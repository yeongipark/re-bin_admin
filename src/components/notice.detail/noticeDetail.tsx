"use client";

import { useRouter } from "next/navigation";
import styles from "./noticeDetail.module.css";

type Notice = {
  id: string;
  title: string;
  date: string;
  content: string;
};

const mockData: Notice = {
  id: "1",
  title: "예약 전 필독!",
  date: "2024.10.25",
  content: `
    📢 예약 전 필독!
    촬영 문의는 계정 팔로우 후 카카오톡으로 예약 양식에 맞춰서 보내주세요.
    촬영은 대구에서 이루어집니다.
    주말은 저녁 6시반 이후로 촬영 가능하며 평일은 요일에 따라 가능한 시간을 알려드립니다.

    예약 양식 성함 촬영 인원 희망 날짜 및 시간(1,2지망)
    스튜디오 or 야외 스냅
    원하시는 시안/컨셉 촬영 안내 사항 확인

    감사합니다 :)
  `,
};

export default function NoticeDetail() {
  const router = useRouter();

  const handleEdit = () => {
    const query = new URLSearchParams({
      title: mockData.title,
      content: mockData.content,
    }).toString();

    router.push(`/notice/edit?${query}`);
  };

  const handleDelete = () => {
    alert("삭제하기 버튼 클릭!");
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>📢 {mockData.title}</p>
      <p className={styles.date}>{mockData.date}</p>
      <hr className={styles.divider} />
      <div className={styles.content}>
        {mockData.content.split("\n").map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.editButton} onClick={handleEdit}>
          수정하기
        </button>
        <button className={styles.deleteButton} onClick={handleDelete}>
          삭제하기
        </button>
      </div>
    </div>
  );
}
