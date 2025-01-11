import ReservationTotal from "@/components/home/reservationTotal";
import ProtectedPage from "@/components/protectedRouter";
import HomeCalendar from "@/components/home/homeCalendar";

export default function Home() {
  return (
    <div style={{ padding: "1rem" }}>
      <ProtectedPage>
        <ReservationTotal />
        <HomeCalendar />
      </ProtectedPage>
    </div>
  );
}
