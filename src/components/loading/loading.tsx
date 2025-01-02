import style from "./loading.module.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading({ text }: { text: string }) {
  return (
    <div className={style.container}>
      <AiOutlineLoading3Quarters className={style.icon} />
      <p>{text}</p>
    </div>
  );
}
