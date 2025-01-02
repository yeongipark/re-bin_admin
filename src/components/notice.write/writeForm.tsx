"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./writeForm.module.css";
import apiClient from "@/util/axios";
import { useRouter } from "next/navigation";

export default function WriteFrom() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentLength, setContentLength] = useState(content.length);

  const queryClient = useQueryClient();
  const router = useRouter();

  // 작성하기 버튼 활성화 조건
  const isButtonDisabled = title.length < 5 || content.length < 5;

  // useMutation을 이용한 작성 요청
  const { mutate, isPending } = useMutation({
    mutationFn: () => postNotice(title, content),
    onMutate: async () => {
      const newNotice = {
        id: Date.now(), // 임시 ID
        title,
        content,
        createdAt: new Date().toISOString(), // 현재 시간
      };

      // 낙관적 업데이트
      queryClient.setQueryData(["notices"], (oldData: any) => {
        if (!oldData) return { pages: [{ notices: [newNotice] }] };
        return {
          ...oldData,
          pages: oldData.pages.map((page: any, idx: number) =>
            idx === 0
              ? { ...page, notices: [newNotice, ...page.notices] }
              : page
          ),
        };
      });

      return { previousData: queryClient.getQueryData(["notices"]) };
    },
    onError: (error, variables, context) => {
      // 실패 시 이전 데이터 복구
      queryClient.setQueryData(["notices"], context?.previousData);
    },
    onSettled: () => {
      // 데이터 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: ["notices"],
        refetchType: "all",
      });
      router.push("/notice");
    },
  });

  const handleContentChange = (value: string) => {
    setContent(value);
    setContentLength(value.length);
  };

  const handleSubmit = () => {
    mutate();
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

      <button
        className={`${styles.button} ${
          (isButtonDisabled || isPending) && styles.disabled
        }`}
        onClick={handleSubmit}
        disabled={isButtonDisabled || isPending}
      >
        {isPending ? "작성 중..." : "작성 하기"}
      </button>
    </div>
  );
}

async function postNotice(title: string, content: string) {
  await apiClient.post(`/admin/notices`, { title, content });
}
