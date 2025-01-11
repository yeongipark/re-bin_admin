import EditForm from "@/components/notice.edit/editForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <Suspense fallback="로딩중">
        {" "}
        <EditForm />
      </Suspense>
    </div>
  );
}
