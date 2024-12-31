import Link from "next/link";
import style from "./reservationTotal.module.css";

export default function ReservationTotal() {
  return (
    <div className={style.container}>
      <p>
        <Link href={"/reservations"}>
          이번 달<br />
          전체 예약 건수
        </Link>
      </p>
      <p>
        <Link href={"/reservations"}>
          <span className={style.count}>7</span>건
        </Link>
      </p>
    </div>
  );
}
