"use client";

import { useEffect, useRef, useState } from "react";
import style from "./confirm.module.css";

interface ConfirmType {
  width?: string; // 기본값 설정 가능
  setModalState?: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  subTitle?: React.ReactNode;
  cancel?: string;
  ok?: string;
  func?: () => void;
}

export default function Confirm({
  width = "80%",
  setModalState,
  title,
  subTitle,
  cancel = "취소",
  ok = "확인",
  func = undefined,
}: ConfirmType) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true); // 닫힘 애니메이션 시작
    setTimeout(() => {
      if (setModalState) {
        setModalState(false);
      }
    }, 300); // 애니메이션 지속 시간 (300ms) 후 모달 상태 변경
  };

  const handleYes = () => {
    if (func) {
      func();
    }
    handleClose();
  };

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  return (
    <dialog
      className={`${style.confirm} ${isClosing ? style.hidden : ""}`}
      ref={dialogRef}
      style={{ width }}
    >
      <p className={style.title}>{title}</p>
      <p className={style.subTitle}>{subTitle}</p>
      <div className={style.btnWrap}>
        <button className={style.btn} onClick={handleClose}>
          {cancel}
        </button>
        <button className={style.btn} onClick={handleYes}>
          {ok}
        </button>
      </div>
    </dialog>
  );
}
