import style from "./page.module.css";
import TimeslotTable from "@/components/timeslot/timeslotTable";

export default function Page({ params }: { params: { date: string } }) {
  const date = params.date;
  return (
    <div>
      <p className={style.title}>
        {date} {getDayOfWeek(date)}
      </p>
      <button>추가하기</button>
      <TimeslotTable date={date} />
    </div>
  );
}

function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);

  // 요일 배열 (0: 일요일 ~ 6: 토요일)
  const daysOfWeek = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  // Date 객체의 getDay 메서드로 요일 인덱스 가져오기
  const dayIndex = date.getDay();

  return daysOfWeek[dayIndex];
}
