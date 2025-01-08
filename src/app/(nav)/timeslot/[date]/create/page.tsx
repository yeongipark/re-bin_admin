import style from "./page.module.css";
import TimePicker from "@/components/timeslot.create/timePicker";

export default function Page({ params }: { params: { date: string } }) {
  return (
    <div>
      <p className={style.title}>{params.date} 타임슬롯 생성</p>
      <TimePicker date={params.date} />
    </div>
  );
}
