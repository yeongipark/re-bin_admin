"use client";

import { useEffect, useState } from "react";
import style from "./login.module.css";
import Image from "next/image";
import apiClient from "@/util/axios";
import { useRouter } from "next/navigation";
import { getToken, setToken } from "@/util/cookie";

export default function Login() {
  const [idFocused, setIdFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const login = async () => {
    try {
      const res = await apiClient.post(`admin/login`, {
        loginId,
        password,
      });

      // HTTP 상태 코드 확인
      if (res.status !== 201) {
        alert("오류가 발생했습니다.");
        throw new Error(`Login failed with status ${res.statusText}`);
      }

      // 어세스 토큰 받아오기
      const accessToken = res.headers["access-token"]; // 헤더 값 읽기
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken); // 로컬 스토리지에 저장
        setToken(accessToken); // 쿠키에 저장

        // 성공적으로 로그인 후 홈 화면으로 리다이렉트
        router.push("/");
      } else {
        throw new Error("Access token is missing.");
      }
    } catch (error) {
      alert("오류가 발생했습니다.");
      console.error("Unexpected Error:", error);
    }
  };

  const isButtonDisabled = loginId.length < 4 || password.length < 4;

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className={style.wrap}>
      <div className={style.container}>
        <div className={style.imgWrap}>
          <Image
            src="/logoNoText.png"
            alt="로고"
            width={100}
            height={50}
            layout="responsive"
          />
        </div>
        <div className={style.login_form}>
          <div className={style.input_wrap}>
            <span
              className={`${style.label} ${idFocused ? style.focused : ""}`}
            >
              아이디
            </span>
            <input
              type="text"
              className={style.login_input}
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              onFocus={() => setIdFocused(true)}
              onBlur={(e) => setIdFocused(e.target.value !== "")}
            />
          </div>
          <hr className={style.divider} />
          <div className={style.input_wrap}>
            <span
              className={`${style.label} ${pwFocused ? style.focused : ""}`}
            >
              비밀번호
            </span>
            <input
              type="password"
              className={style.login_input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPwFocused(true)}
              onBlur={(e) => setPwFocused(e.target.value !== "")}
            />
          </div>
        </div>
        <div className={style.btn_wrap}>
          <button
            className={style.login_btn}
            disabled={isButtonDisabled}
            onClick={login}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
