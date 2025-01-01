"use client";

import { useState, useEffect } from "react";
import styles from "./reservations.module.css";
import { IoIosSearch } from "react-icons/io";
import Confirm from "@/components/confirm"; // Confirm 컴포넌트를 import합니다.

type Reservation = {
  id: string;
  product: string;
  reserver: string;
  time: string;
  status: string;
  check: boolean;
};

const mockData: Reservation[] = [
  {
    id: "REBIN20240925A",
    product: "개인 프로필",
    reserver: "오주은",
    time: "2024-10-01 13:00",
    status: "입금 완료",
    check: false,
  },
  {
    id: "REBIN20240925B",
    product: "개인 프로필",
    reserver: "오주은",
    time: "2024-10-01 13:00",
    status: "입금 확인 요청",
    check: true,
  },
];

export default function Reservations() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchId, setSearchId] = useState("");
  const [searchReserver, setSearchReserver] = useState("");
  const [filteredData, setFilteredData] = useState<Reservation[]>(mockData);

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false); // Confirm 컴포넌트의 상태
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null); // 선택된 예약 정보를 저장

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
    handleSearch();
  }, []);

  const handleSearch = () => {
    const filtered = mockData.filter(
      (item) =>
        (searchId === "" || item.id.includes(searchId)) &&
        (searchReserver === "" || item.reserver.includes(searchReserver)) &&
        item.time >= startDate &&
        item.time <= endDate
    );
    setFilteredData(filtered);
  };

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
        <IoIosSearch className={styles.searchButton} onClick={handleSearch} />
      </div>

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
              <td className={styles.id}>{item.id}</td>
              <td>{item.product}</td>
              <td>{item.reserver}</td>
              <td>{item.time}</td>
              <td>
                <span>{item.status}</span>
              </td>
              <td>
                {item.check && (
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

      {/* Confirm 컴포넌트 */}
      {confirmOpen && selectedReservation && (
        <Confirm
          title="완료 처리하시겠습니까?"
          subTitle={`예약번호: ${selectedReservation.id}`}
          setModalState={setConfirmOpen}
          ok="확인"
          cancel="취소"
          func={() => {
            console.log(`${selectedReservation.id} 완료 처리`);
            setConfirmOpen(false);
          }}
        />
      )}
    </div>
  );
}
