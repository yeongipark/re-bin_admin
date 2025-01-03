import Products from "@/components/products/products";
import style from "./page.module.css";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <div className={style.container}>
        <p>현재 Re:bin에 등록되어있는 상품이에요.</p>
        <button>
          <Link href={"/products/create"}>추가하기</Link>
        </button>
      </div>
      <Products />
    </div>
  );
}
