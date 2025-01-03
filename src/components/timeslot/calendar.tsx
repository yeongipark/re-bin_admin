"use client";

import style from "./calendar.module.css";
import CalendarBody from "./calendarBody";
import { useCalendar } from "@/hooks/useCalendar";

export default function Calendar({}) {
  const calendarProps = useCalendar();
  return (
    <div className={style.container}>
      <CalendarBody
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
