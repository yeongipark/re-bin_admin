"use client";

import { useState } from "react";
import styles from "./writeForm.module.css";

export default function WriteFrom() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
