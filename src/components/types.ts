export const ReservationStatusType = {
  PENDING_PAYMENT: "입금 전",
  CONFIRM_REQUESTED: "입금 요청 보냄",
  PAYMENT_CONFIRMED: "입금 완료",
  SHOOTING_COMPLETED: "촬영 완료",
  REVIEW_COMPLETED: "리뷰 작성 완료",
  CANCELED: "예약 취소",
};

export interface DayInMonth {
  date: string;
  year: string;
  month: string;
  day: string;
  dayIndexOfWeek: number;
}

export interface CalendarBodyProps {
  isOverMax: (date: string) => boolean;
  before: (date: string) => boolean;
  today: (date: string) => boolean;
  currentDate: {
    year: string;
    month: string;
    day: string;
  };
  daysInMonth: DayInMonth[];
  dispatch: {
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
  };
  selectedDate: {
    date: string;
    selectDate: (date: string) => void;
  };
}
