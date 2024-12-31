"use client";

import { useState } from "react";
import styles from "./nav.module.css";
import { HiMenu } from "react-icons/hi";
import { AiOutlineRight } from "react-icons/ai";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className={styles.nav}>
        <h1 className={styles.title}>Re:bin admin</h1>
        <HiMenu className={styles.hamburger} onClick={toggleMenu} />
      </nav>

      <div
        className={`${styles.sideMenu} ${isOpen ? styles.open : ""}`}
        onClick={toggleMenu}
      >
        <ul className={styles.menuList}>
          {[
            "예약 현황",
            "상품 관리",
            "공지 관리",
            "시간 관리",
            "소개 관리",
            "프로필 관리",
          ].map((item) => (
            <li key={item} className={styles.menuItem}>
              <span>{item}</span>
              <AiOutlineRight />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
