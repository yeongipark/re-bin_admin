import ProtectedPage from "@/components/protectedRouter";
import ReservationDetail from "@/components/reservations.detail/reservationDetail";

export default function Page() {
  return (
    <ProtectedPage>
      <ReservationDetail />
    </ProtectedPage>
  );
}
