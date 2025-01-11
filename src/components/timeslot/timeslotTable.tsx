"use client";

import apiClient from "@/util/axios";
import styles from "./timeslotTable.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../loading/loading";
import { useState } from "react";
import Confirm from "../confirm";
import Link from "next/link";

interface TimeSlot {
  id: number;
  date: string;
  time: string;
  isAvailable: boolean;
  reservationCode: string;
}

export default function TimeslotTable({ date }: { date: string }) {
  const queryClient = useQueryClient();

  const [confirmState, setConfirmState] = useState(false);
  const [timeSlotId, setTimeSlotId] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["timeslot", date],
    queryFn: () => getData(date),
  });

  const { mutate } = useMutation({
    mutationFn: () => deleteTimeSlot(timeSlotId),
    onMutate: () => {
      queryClient.setQueryData(["timeslot", date], (prev) => {
        return prev.filter((data) => data.id !== timeSlotId);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeslot", date],
        refetchType: "all",
      });
    },
  });

  if (isLoading) return <Loading text="로딩중.." />;

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>시작 시간</th>
            <th>예약 가능 여부</th>
            <th>예약</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item: TimeSlot) => (
            <tr key={item.id}>
              <td className={styles.id}>{item.time.slice(0, -3)}</td>
              <td>{item.isAvailable ? "O" : "X"}</td>
              <td>
                {item.reservationCode && (
                  <Link href={`/detail?code=${item.reservationCode}`}>
                    {item.reservationCode}
                  </Link>
                )}
              </td>
              <td>
                {item.isAvailable && (
                  <button
                    onClick={() => {
                      setConfirmState(true);
                      setTimeSlotId(item.id);
                    }}
                  >
                    삭제하기
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {confirmState && (
        <Confirm
          title="정말로 삭제하시겠습니까?"
          setModalState={setConfirmState}
          func={mutate}
        />
      )}
    </div>
  );
}

async function getData(date: string): Promise<TimeSlot[]> {
  const { data } = await apiClient.get(`/admin/timeslots?date=${date}`);
  return data;
}

async function deleteTimeSlot(timeSlotId) {
  await apiClient.delete(`/admin/timeslots/${timeSlotId}`);
}
