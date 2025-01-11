import ReservationTotal from "@/components/home/reservationTotal";
import ProtectedPage from "@/components/protectedRouter";

export default function Home() {
  return (
    <div>
      <ProtectedPage>
        <ReservationTotal />
      </ProtectedPage>
    </div>
  );
}
