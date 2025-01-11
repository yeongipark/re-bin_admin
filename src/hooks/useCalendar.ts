import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isAfter,
  isBefore,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import { DayInMonth } from "@/components/types";

export const useCalendar = ({ basicDate }: { basicDate?: string } = {}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [currentYear, currentMonth, currentDay] = format(
    currentDate,
    "yyyy-MM-dd"
  ).split("-");

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const parsedDate = basicDate ? new Date(basicDate) : null;
    if (parsedDate && !isNaN(parsedDate.getTime()))
      return format(parsedDate, "yyyy-MM-dd");
    return format(new Date(), "yyyy-MM-dd");
  });

  const [daysInMonth, setDaysInMonth] = useState<DayInMonth[]>([]);

  useEffect(() => {
    const startCurrentMonth = startOfMonth(currentDate);
    const endCurrentMonth = endOfMonth(currentDate);
    const startOfFirstWeek = startOfWeek(startCurrentMonth, {
      weekStartsOn: 0,
    });
    const endOfLastWeek = endOfWeek(endCurrentMonth, { weekStartsOn: 0 });
    const days = eachDayOfInterval({
      start: startOfFirstWeek,
      end: endOfLastWeek,
    });

    setDaysInMonth(
      days.map((day) => ({
        date: format(day, "yyyy-MM-dd"),
        year: format(day, "yyyy"),
        month: format(day, "MM"),
        day: format(day, "dd"),
        dayIndexOfWeek: getDay(day),
      }))
    );
  }, [currentDate]);

  const handlePrevMonth = () => {
    // 현재 달보다 이전으로 가지 못하게 설정
    // if (currentDate.getMonth() === new Date().getMonth()) {
    //   return;
    // }
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(format(new Date(date), "yyyy-MM-dd"));
  };

  // 오늘인지 표현
  const today = (date: string) => {
    return isToday(new Date(date));
  };

  // 오늘보다 이전 날은 선택하지 못하도록 설정
  const before = (date: string) => {
    return isBefore(new Date(date), new Date());
  };

  // 최대 예약 가능한 날짜보다 오버 됐는지 확인하는 함수
  const isOverMax = (date: string) => {
    return isAfter(new Date(date), addDays(new Date(), 14));
  };

  return {
    isOverMax,
    before,
    today,
    currentDate: {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
    },
    daysInMonth,
    dispatch: {
      handlePrevMonth,
      handleNextMonth,
    },
    selectedDate: {
      date: selectedDate,
      selectDate: handleSelectDate,
    },
  };
};
