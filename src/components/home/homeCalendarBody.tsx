"use client";

import style from "./homeCalendarBody.module.css";
import { CalendarBodyProps } from "../types";
import apiClient from "@/util/axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading/loading";

export default function HomeCalendarBody({
  before,
  today,
  currentDate,
  daysInMonth,
  dispatch,
  selectedDate,
}: CalendarBodyProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["reservations_month"],
    queryFn: getRervertaionCount,
  });

  const weeks = ["일", "월", "화", "수", "목", "금", "토"];

  if (isLoading) return <Loading text="로딩중.." />;

  return (
    <div>
      <div className={style.navContainer}>
        <div className={style.button} onClick={dispatch.handlePrevMonth}>
          {"<"}
        </div>
        <div>
          {currentDate.year}년 {currentDate.month}월
        </div>
        <div className={style.button} onClick={dispatch.handleNextMonth}>
          {">"}
        </div>
      </div>
      <div className={style.container}>
        <div className={style.dayWrap}>
          {weeks.map((week, index) => (
            <Week
              key={index}
              text={week}
              isWeekend={index === 0 || index === 6}
            />
          ))}
        </div>
        <div className={style.dayWrap}>
          {Array.isArray(daysInMonth) &&
            daysInMonth.map((day, index) => {
              return (
                <Day
                  key={index}
                  day={day.day}
                  isWeekend={
                    day.dayIndexOfWeek === 0 || day.dayIndexOfWeek === 6
                  }
                  today={today(day.date)}
                  before={before(day.date)}
                  displayNone={currentDate.month !== day.month}
                  onClick={() => {
                    selectedDate.selectDate(day.date);
                  }}
                  isSelected={selectedDate.date === day.date}
                  count={data?.find((item) => item.date === day.date)?.count}
                  reservations={
                    data?.find((item) => item.date === day.date)?.reservation
                  }
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

// 요일(월, 화, 수 ... )을 나타내는 컴포넌트
function Week({ text, isWeekend }: { text: string; isWeekend: boolean }) {
  return (
    <div className={`${style.week} ${isWeekend && style.weekend}`}>{text}</div>
  );
}

// 날짜를 나타내는 컴포넌트 (1일, 2일 ...)
function Day({
  day,
  isWeekend,
  today,
  displayNone,
  onClick,
  isSelected,
  count,
  reservations,
}: {
  day: string;
  isWeekend: boolean;
  today: boolean;
  before: boolean;
  displayNone: boolean;
  onClick: () => void;
  isSelected: boolean;
  count: number | undefined;
  reservations: Revervations[] | undefined;
}) {
  console.log(reservations);
  return (
    <div
      className={`${style.day} ${isWeekend && style.weekend} ${
        displayNone && style.none
      } ${isSelected && style.selected}`}
      onClick={onClick}
    >
      {day}
      {count && (
        <div className={style.reservationText}>
          <p>예약 건수 : {count}</p>
        </div>
      )}
      {reservations &&
        reservations.length > 0 &&
        reservations.map((item, index) => (
          <div key={index} className={style.reservationText}>
            <p>{item.time.slice(0, -3)}</p>
            <p>{item.productName}</p>
          </div>
        ))}
    </div>
  );
}

interface Revervations {
  time: string;
  productName: string;
}

interface Type {
  count: number;
  date: string;
  reservation: Revervations[];
}

async function getRervertaionCount(): Promise<Type[]> {
  const { data } = await apiClient.get("/admin/reservations/month");
  return data;
}
