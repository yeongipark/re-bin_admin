"use client";

import style from "./homeCalendar.module.css";
import { useCalendar } from "@/hooks/useCalendar";
import HomeCalendarBody from "./homeCalendarBody";

export default function HomeCalendar({}) {
  const calendarProps = useCalendar();
  return (
    <div className={style.container}>
      <HomeCalendarBody
        isOverMax={calendarProps.isOverMax}
        before={calendarProps.before}
        today={calendarProps.today}
        currentDate={calendarProps.currentDate}
        daysInMonth={calendarProps.daysInMonth}
        dispatch={calendarProps.dispatch}
        selectedDate={calendarProps.selectedDate}
      />
    </div>
  );
}
