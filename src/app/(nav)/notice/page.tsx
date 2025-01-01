import Link from "next/link";
import style from "./page.module.css";
import Notice from "@/components/notice/notice";

export default function Page() {
  return (
    <div>
      <div className={style.container}>
        <p>현재 Re:bin에 등록되어있는 공지사항이에요.</p>
        <button>
          <Link href={"/notice/write"}>추가하기</Link>
        </button>
      </div>
      <Notice />
    </div>
  );
}
