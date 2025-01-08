"use client";

import React, { useState, useEffect } from "react";
import styles from "./TimePicker.module.css"; // CSS Module import
import apiClient from "@/util/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function TimePicker({ date }: { date: string }) {
  const [hour, setHour] = useState(0); // 24시간 형식의 시간 (0 ~ 23)
  const [minute, setMinute] = useState(0); // 분 (0 ~ 59)
  const [period, setPeriod] = useState("AM"); // AM/PM (자동 변경)
  const [isToday, setIsToday] = useState(false); // 오늘인지 확인

  const queryClient = useQueryClient();
  const router = useRouter();

  // 현재 시간 가져오기
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  useEffect(() => {
    // date가 오늘 날짜인지 확인
    const today = new Date().toISOString().split("T")[0];
    setIsToday(date === today);
  }, [date]);

  // 시간(hour) 변경 시 AM/PM 업데이트
  useEffect(() => {
    if (hour >= 0 && hour < 12) {
      setPeriod("AM");
    } else {
      setPeriod("PM");
    }
  }, [hour]);

  const { mutate } = useMutation({
    mutationFn: () => createTimeSlot(`${hour}:${minute}`, date),
    onMutate: async () => {
      const previousData = queryClient.getQueryData(["timeslot", date]);

      queryClient.setQueryData(["timeslot", date], (prev: any) => {
        return [
          ...(prev || []), // 기존 데이터를 유지
          {
            id: Date.now(), // 임시 ID
            date: date,
            time: `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`, // 선택한 시간
            isAvailable: true, // 예약 가능 상태
            reservationCode: null, // 예약 코드 없음
          },
        ];
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["timeslot", date], context?.previousData);
      alert("중복된 시간은 등록할 수 없습니다.");
    },
    onSuccess: () => {
      router.push(`/timeslot/${date}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeslot", date],
        refetchType: "all",
      });
    },
  });

  const handleAdd = () => {
    // mutate 호출로 시간 슬롯 추가
    mutate();
  };

  return (
    <div className={styles.container}>
      <div className={styles.timePicker}>
        {/* 시간 */}
        <select
          className={styles.select}
          value={hour}
          onChange={(e) => setHour(parseInt(e.target.value))}
        >
          {Array.from({ length: 24 }, (_, i) => i).map((h) => (
            <option
              key={h}
              value={h}
              disabled={isToday && h < currentHour} // 오늘 날짜이고 현재 시간보다 이전이면 비활성화
            >
              {h.toString().padStart(2, "0")} {/* 2자리 숫자로 포맷팅 */}
            </option>
          ))}
        </select>
        :{/* 분 */}
        <select
          className={styles.select}
          value={minute}
          onChange={(e) => setMinute(parseInt(e.target.value))}
        >
          {Array.from({ length: 60 }, (_, i) => i).map((m) => (
            <option
              key={m}
              value={m}
              disabled={
                isToday && hour === currentHour && m < currentMinute // 오늘 날짜이고 현재 시간과 동일하며 현재 분보다 이전이면 비활성화
              }
            >
              {m.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        {/* AM/PM (자동 변경) */}
        <span className={styles.period}>{period}</span>
      </div>
      {/* 추가 버튼 */}
      <button onClick={handleAdd} className={styles.button}>
        추가
      </button>
    </div>
  );
}

async function createTimeSlot(time: string, date: string) {
  await apiClient.post("/admin/timeslots", { date, time });
}
