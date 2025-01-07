"use client";

import { useState, useEffect } from "react";
import styles from "./reservations.module.css";
import { IoIosSearch } from "react-icons/io";
import Confirm from "@/components/confirm"; // Confirm 컴포넌트를 import합니다.
import { ReservationStatusType } from "../types";
import apiClient from "@/util/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Reservation = {
  id: number | string;
  code: string;
  productName: string;
  name: string;
  shootDateTime: string;
  reserveTime: string;
  status: keyof typeof ReservationStatusType;
};

export default function Reservations() {
  const router = useRouter();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchId, setSearchId] = useState("");
  const [searchReserver, setSearchReserver] = useState("");

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false); // Confirm 컴포넌트의 상태
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null); // 선택된 예약 정보를 저장

  const queryClient = useQueryClient();

  // 초기 날짜 설정
  useEffect(() => {
    const today = new Date();
    const formattedEndDate = today.toISOString().split("T")[0];
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).toLocaleDateString("en-CA");

    setEndDate(formattedEndDate);
    setStartDate(firstDayOfMonth);
  }, []);

  const { data, isLoading } = useQuery<Reservation[]>({
    queryKey: ["reservations", startDate, endDate],
    queryFn: () => getData(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  const { mutate } = useMutation({
    mutationFn: checkPayment,
    onMutate: async (reservationId: number | string) => {
      // 이전 캐시 데이터를 저장
      const previousData = queryClient.getQueryData<Reservation[]>([
        "reservations",
        startDate,
        endDate,
      ]);

      // 낙관적 업데이트
      queryClient.setQueryData<Reservation[]>(
        ["reservations", startDate, endDate],
        (oldData) =>
          oldData?.map((reservation) =>
            reservation.id === reservationId
              ? { ...reservation, status: "PAYMENT_CONFIRMED" }
              : reservation
          ) ?? []
      );

      return { previousData };
    },
    onError: (error, variables, context) => {
      // 에러 발생 시 이전 데이터를 복구
      queryClient.setQueryData(
        ["reservations", startDate, endDate],
        context?.previousData
      );
    },
    onSettled: () => {
      // 쿼리 재검증
      queryClient.invalidateQueries({
        queryKey: ["reservations", startDate, endDate],
        refetchType: "all",
      });
    },
  });

  const filteredData = data
    ? data.filter(
        (item) =>
          (searchId === "" || item.code.includes(searchId)) &&
          (searchReserver === "" || item.name.includes(searchReserver))
      )
    : [];

  const handleStartDateChange = (value: string) => {
    if (value > endDate) {
      setEndDate(value);
    }
    setStartDate(value);
  };

  const handleEndDateChange = (value: string) => {
    if (value < startDate) {
      setStartDate(value);
    }
    setEndDate(value);
  };

  const handleCompleteClick = (reservation: Reservation) => {
    setSelectedReservation(reservation); // 선택된 예약 정보를 설정
    setConfirmOpen(true); // Confirm 컴포넌트를 열기
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>예약 현황</p>

      <div className={styles.filters}>
        <div className={styles.dateFilter}>
          <input
            className={styles.dateInput}
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
          <span>~</span>
          <input
            className={styles.dateInput}
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
        </div>

        <input
          className={styles.input}
          type="text"
          placeholder="예약번호"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="예약자"
          value={searchReserver}
          onChange={(e) => setSearchReserver(e.target.value)}
        />
        <IoIosSearch className={styles.searchButton} onClick={() => {}} />
      </div>

      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>예약번호</th>
              <th>상품명</th>
              <th>예약자</th>
              <th>예약 시각</th>
              <th>상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td
                  onClick={() => {
                    router.push(`/detail?code=${item.code}`); // `/detail`로 이동하면서 `code` 전달
                  }}
                  className={styles.id}
                >
                  {item.code}
                </td>
                <td>{item.productName}</td>
                <td>{item.name}</td>
                <td>{item.shootDateTime.split("T").join(" ").slice(0, -3)}</td>
                <td>
                  <span>{ReservationStatusType[item.status]}</span>
                </td>
                <td>
                  {item.status === "CONFIRM_REQUESTED" && ( // 상태가 PENDING일 때만 버튼 활성화
                    <button
                      className={styles.btn}
                      onClick={() => handleCompleteClick(item)}
                    >
                      완료
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirm 컴포넌트 */}
      {confirmOpen && selectedReservation && (
        <Confirm
          title="완료 처리하시겠습니까?"
          subTitle={`예약번호: ${selectedReservation.code}`}
          setModalState={setConfirmOpen}
          ok="확인"
          cancel="취소"
          func={() => {
            mutate(selectedReservation.id); // 선택된 예약 ID로 mutate 실행
            setConfirmOpen(false);
          }}
        />
      )}
    </div>
  );
}

async function getData(
  startDate: string,
  endDate: string
): Promise<Reservation[]> {
  const res = await apiClient.get(
    `/admin/reservations?startDate=${startDate}&endDate=${endDate}`
  );
  return res.data;
}

async function checkPayment(reservationId: number | string) {
  await apiClient.patch(`/admin/reservations/deposit/${reservationId}`);
}
