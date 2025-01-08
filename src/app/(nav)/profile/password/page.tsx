"use client";

import style from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/util/axios";
import Loading from "@/components/loading/loading";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlash } from "react-icons/bs";

export default function Page() {
  const [password, setPassword] = useState("");
  const [changePassword, setChangePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 기존 비밀번호 보기 상태
  const [showChangePassword, setShowChangePassword] = useState(false); // 변경 비밀번호 보기 상태
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => change(password, changePassword),
    onError: (err) => {
      alert("비밀번호 변경에 실패했습니다. 다시 시도해 주세요." + err.message);
    },
    onSuccess: () => {
      alert("비밀번호가 변경되었습니다.");
      router.replace("/profile");
    },
  });

  if (isPending) return <Loading text="변경중.." />;

  return (
    <div>
      <div style={{ padding: "0px 10px" }}>
        <div className={style.wrap}>
          <p>기존 비밀번호</p>

          <input
            type={showPassword ? "text" : "password"} // 비밀번호 보기 상태에 따라 type 변경
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="기존 비밀번호"
          />
          {showPassword ? (
            <BsEyeSlash
              className={style.icon}
              onClick={() => setShowPassword(false)} // 감추기
            />
          ) : (
            <IoEyeSharp
              className={style.icon}
              onClick={() => setShowPassword(true)} // 보기
            />
          )}
        </div>
        <div className={style.wrap} style={{ marginTop: "2rem" }}>
          <p>변경 할 비밀번호</p>

          <input
            type={showChangePassword ? "text" : "password"} // 변경 비밀번호 보기 상태에 따라 type 변경
            value={changePassword}
            onChange={(e) => setChangePassword(e.target.value)}
            placeholder="변경할 비밀번호"
          />
          {showChangePassword ? (
            <BsEyeSlash
              className={style.icon}
              onClick={() => setShowChangePassword(false)} // 감추기
            />
          ) : (
            <IoEyeSharp
              className={style.icon}
              onClick={() => setShowChangePassword(true)} // 보기
            />
          )}
        </div>
      </div>
      <div className={style.btn}>
        <button
          disabled={password.length < 5 || changePassword.length < 5}
          className={`${
            password.length >= 5 && changePassword.length >= 5 && style.active
          }`}
          onClick={() => mutate()}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}

async function change(originalPassword: string, newPassword: string) {
  await apiClient.post(`/admin/profile/password`, {
    originalPassword,
    newPassword,
  });
}
