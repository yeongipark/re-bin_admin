"use client";

import apiClient from "@/util/axios";
import styles from "./timeslotTable.module.css";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading/loading";

interface TimeSlot {
  id: number;
  date: string;
  time: string;
  isAvailable: boolean;
  reservationCode: string;
}

export default function TimeslotTable({ date }: { date: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["timeslot", date],
    queryFn: () => getData(date),
  });

  if (isLoading) return <Loading text="로딩중.." />;

  return (
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
            <td className={styles.id}>{item.time}</td>
            <td>{item.isAvailable ? "O" : "X"}</td>
            <td>{item.reservationCode}</td>
            <td>{item.isAvailable && <button>삭제하기</button>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

async function getData(date: string): Promise<TimeSlot[]> {
  const { data } = await apiClient.get(`/admin/timeslots?date=${date}`);
  return data;
}
