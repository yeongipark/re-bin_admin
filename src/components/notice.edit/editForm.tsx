"use client";

import { useEffect, useState } from "react";
import styles from "./editForm.module.css";
import { useSearchParams } from "next/navigation";

export default function EditForm() {
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentLength, setContentLength] = useState(content.length);

  useEffect(() => {
    const title = searchParams.get("title") || "";
    const content = searchParams.get("content") || "";
    if (title && content) {
      setTitle(title);
      setContent(content);
    }
  }, []);

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
