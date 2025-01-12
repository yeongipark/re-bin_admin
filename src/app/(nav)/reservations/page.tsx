import ProtectedPage from "@/components/protectedRouter";
import Reservations from "@/components/reservation/reservations";
import { Suspense } from "react";

export default function Page() {
  return (
    <ProtectedPage>
      <Suspense fallback="로딩중..">
        <Reservations />
      </Suspense>
    </ProtectedPage>
  );
}
