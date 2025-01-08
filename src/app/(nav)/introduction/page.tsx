import style from "./page.module.css";
import ImageUploader from "@/components/introduction/imageUploader";

export default function Page() {
  return (
    <div className={style.container}>
      <p className={style.title}>현재 Re:bin에 등록되어 있는 소개 글이에요.</p>
      <ImageUploader />
    </div>
  );
}
