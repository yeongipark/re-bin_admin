"use client";

import { useState } from "react";
import styles from "./editForm.module.css";

export default function EditForm() {
  const [title, setTitle] = useState("예약 전 필독! (20자 이하)");
  const [content, setContent] = useState(
    "촬영 문의는 계정 팔로우 후 카카오톡으로 예약 양식에 맞춰서 보내주세요\n촬영은 대구에서 이루어집니다.\n\n주말은 저녁 6시반 이후로 촬영 가능하며 평일은 요일에 따라 가능한 시간을 알려드립니다.\n\n예약 양식\n성함\n촬영 인원\n희망 날짜 및 시간(1,2지망)\n스튜디오 or 야외 스냅\n원하시는 시간/컨셉\n촬영 안내 사항 확인\n\n감사합니다 :)"
  );
  const [contentLength, setContentLength] = useState(content.length);

  const handleContentChange = (value: string) => {
    setContent(value);
    setContentLength(value.length);
  };

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          maxLength={20}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          maxLength={5000}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className={styles.textarea}
        />
        <div className={styles.charCount}>({contentLength}/5000)</div>
      </div>

      <button className={styles.button}>작성 하기</button>
    </div>
  );
}
