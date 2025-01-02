"use client";

import Link from "next/link";
import style from "./reservationTotal.module.css";
import { useEffect } from "react";
import { getToken } from "@/util/cookie";
import { useRouter } from "next/navigation";
import apiClient from "@/util/axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading/loading";
import Alert from "../alert/alert";
export default function ReservationTotal() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
    }
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["reservations_month_count"],
    queryFn: getTotalReservation,
  });

  if (isLoading) return <Loading text="로딩중.." />;

  if (error)
    return (
      <Alert
        title="오류가 발생했습니다. 다시 시도해 주세요."
        type="cancel"
        setModalState={() => router.push("/login")}
      />
    );

  return (
    <div className={style.container}>
      <p>
        <Link href={"/reservations"}>
          이번 달<br />
          전체 예약 건수
        </Link>
      </p>
      <p>
        <Link href={"/reservations"}>
          <span className={style.count}>{data.count}</span>건
        </Link>
      </p>
    </div>
  );
}

async function getTotalReservation() {
  const res = await apiClient.get("admin/reservations/month");
  return res.data;
}
