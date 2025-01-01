"use client";

import { useRouter } from "next/navigation";
import styles from "./notice.module.css";

type Notice = {
  id: number | string;
  title: string;
  date: string;
};

const mockData: Notice[] = [
  {
    id: 1,
    title:
      "공지사항1dflkajsdkfjsdlfkjsdfjskfjslfjsjfkldjflskjfkdsjalfkdsjfklasjdflkajsdfklasjkldffkdsjlfsd",
    date: "2024.04.03",
  },
  {
    id: 2,
    title: "공지사항2",
    date: "2024.04.04",
  },
];

export default function Notice() {
  const router = useRouter();

  const movePage = (id: number | string) => {
    router.push(`/notice/detail/${id}`);
  };

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((item) => (
            <tr
              key={item.id}
              onClick={() => {
                movePage(item.id);
              }}
            >
              <td className={styles.id}>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
