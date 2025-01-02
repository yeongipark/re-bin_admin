"use client";

import { useEffect, useRef, useState } from "react";
import style from "./alert.module.css";
import { FiAlertCircle, FiAlertOctagon } from "react-icons/fi";

interface AlertType {
  width?: string; // 기본값 설정 가능
  type?: "info" | "cancel" | undefined;
  title: string;
  subTitle?: React.ReactNode;
  setModalState?: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
}

export default function Alert({
  width = "80%",
  setModalState,
  type,
  title,
  subTitle,
}: AlertType) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true); // 닫히는 애니메이션 시작
    setTimeout(() => {
      if (setModalState) {
        setModalState(false);
      }
    }, 300); // 애니메이션 지속 시간과 동일하게 설정
  };

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  return (
    <dialog
      className={`${style.alert} ${isClosing ? style.hidden : ""}`}
      ref={dialogRef}
      style={{ width }}
    >
      <div className={style.icon}>
        {type === "info" && <FiAlertCircle />}
        {type === "cancel" && <FiAlertOctagon color="red" />}
      </div>
      <p className={style.title}>{title}</p>
      <p className={style.subTitle}>{subTitle}</p>
      <button className={style.btn} onClick={handleClose}>
        확인
      </button>
    </dialog>
  );
}
