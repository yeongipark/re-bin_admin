"use client";

import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import styles from "./backNav.module.css";
export default function BackNav({ text }: { text: string }) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back(); // 이전 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <GoArrowLeft className={styles.icon} onClick={handleBackClick} />
      <span className={styles.text}>{text}</span>
    </div>
  );
}
