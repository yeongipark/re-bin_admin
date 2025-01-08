"use client";

import { useState } from "react";
import style from "./page.module.css";
import { TiDeleteOutline } from "react-icons/ti";
import apiClient from "@/util/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading/loading";

async function changeId(newId: string) {
  await apiClient.post("/admin/profile/id", { newId });
}

export default function Page() {
  const [id, setId] = useState("");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => changeId(id),
    onError: () => {
      alert("아이디 변경에 실패했습니다. 다시 시도해 주세요.");
    },
    onSuccess: () => {
      alert("아이디를 변경했습니다.");
      router.replace("/profile");
    },
  });

  const handleSaveBtn = () => {
    mutate();
  };

  const handleDeleteBtn = () => {
    setId("");
  };

  if (isPending) return <Loading text="로딩중.." />;

  return (
    <div>
      <div style={{ padding: "0px 10px" }}>
        <div className={style.wrap}>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <TiDeleteOutline className={style.icon} onClick={handleDeleteBtn} />
        </div>
      </div>
      <div className={style.btn}>
        <button
          disabled={id.length < 5}
          className={`${id.length >= 5 && style.active}`}
          onClick={handleSaveBtn}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
