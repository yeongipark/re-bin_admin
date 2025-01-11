import ProtectedPage from "@/components/protectedRouter";
import style from "./page.module.css";
import Link from "next/link";

export default function Page() {
  return (
    <ProtectedPage>
      <div className={style.container}>
        <div className={style.btnWrap}>
          <Link href={"/profile/id"}>
            <button>아이디 변경</button>
          </Link>
          <Link href={"/profile/password"}>
            <button>비밀번호 변경</button>
          </Link>
        </div>
      </div>
    </ProtectedPage>
  );
}
