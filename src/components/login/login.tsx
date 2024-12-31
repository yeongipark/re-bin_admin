"use client";

import { useState } from "react";
import style from "./login.module.css";
import Image from "next/image";

export default function Login() {
  const [idFocused, setIdFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

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
              onFocus={() => setPwFocused(true)}
              onBlur={(e) => setPwFocused(e.target.value !== "")}
            />
          </div>
        </div>
        <div className={style.btn_wrap}>
          <button className={style.login_btn}>로그인</button>
        </div>
      </div>
    </div>
  );
}
