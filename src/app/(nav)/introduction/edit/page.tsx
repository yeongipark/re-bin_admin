import ProtectedPage from "@/components/protectedRouter";
import style from "./page.module.css";
import EditImageUploader from "@/components/introduction.edit/editImageUploader";

export default function Page() {
  return (
    <div className={style.container}>
      <ProtectedPage><EditImageUploader /></ProtectedPage>
    </div>
  );
}
