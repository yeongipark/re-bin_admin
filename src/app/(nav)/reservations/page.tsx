import ProtectedPage from "@/components/protectedRouter";
import Reservations from "@/components/reservation/reservations";

export default function Page() {
  return <ProtectedPage><Reservations /></ProtectedPage>;
}
