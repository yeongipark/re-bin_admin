import ProtectedPage from "@/components/protectedRouter";
import ReservationDetail from "@/components/reservations.detail/reservationDetail";
import { Suspense } from "react";

export default function Page() {
  return (
    <ProtectedPage>
      <Suspense fallback="로딩중">
        <ReservationDetail />
      </Suspense>
    </ProtectedPage>
  );
}
