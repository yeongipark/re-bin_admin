"use client";

import { useState, useEffect } from "react";
import styles from "./nav.module.css";
import { HiMenu } from "react-icons/hi";
import { AiOutlineRight } from "react-icons/ai";
import Link from "next/link";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sideMenu = document.querySelector(`.${styles.sideMenu}`);
      if (sideMenu && !sideMenu.contains(e.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <nav className={styles.nav}>
        <Link href={"/"}>
          <p className={styles.title}>Re:bin admin</p>
        </Link>
        <HiMenu className={styles.hamburger} onClick={toggleMenu} />
      </nav>

      <div
        className={`${styles.sideMenu} ${isOpen ? styles.open : ""}`}
        onClick={closeMenu}
      >
        <ul className={styles.menuList}>
          {[
            { name: "예약 현황", link: "/reservations" },
            { name: "상품 관리", link: "/products" },
            { name: "공지 관리", link: "/notice" },
            { name: "시간 관리", link: "/time-management" },
            { name: "소개 관리", link: "/introduction" },
            { name: "프로필 관리", link: "/profile" },
          ].map((item) => (
            <li key={item.name} className={styles.menuItem}>
              <Link href={item.link}>
                <span onClick={closeMenu}>{item.name}</span>
              </Link>
              <AiOutlineRight />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
