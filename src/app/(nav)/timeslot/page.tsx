import ProtectedPage from "@/components/protectedRouter";
import style from "./page.module.css";
import Calendar from "@/components/timeslot/calendar";

export default function Page() {
  return (
    <div className={style.container}>
      <p className={style.title}>예약 타임슬롯 관리</p>
      <ProtectedPage>
        <Calendar />
      </ProtectedPage>
    </div>
  );
}
