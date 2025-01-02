"use client";

import { useEffect, useState } from "react";
import styles from "./editForm.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/util/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function EditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [contentLength, setContentLength] = useState(0);

  useEffect(() => {
    const titleFromQuery = searchParams.get("title") || "";
    const contentFromQuery = searchParams.get("content") || "";
    setTitle(titleFromQuery);
    setContent(contentFromQuery);
    setOriginalTitle(titleFromQuery);
    setOriginalContent(contentFromQuery);
    setContentLength(contentFromQuery.length);
  }, [searchParams]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setContentLength(value.length);
  };

  // 수정 버튼 비활성화 조건
  const isButtonDisabled =
    (title === originalTitle && content === originalContent) ||
    title.length < 5 ||
    content.length < 5;

  // useMutation으로 수정 요청
  const { mutate, isPending } = useMutation({
    mutationFn: () => editNotice(searchParams.get("id") || 1, title, content),
    onMutate: async () => {
      const updatedNotice = {
        id: searchParams.get("id"),
        title,
        content,
        createdAt: new Date().toISOString(), // 현재 시간
      };

      // 이전 데이터 스냅샷 저장
      const previousData = queryClient.getQueryData(["notices"]);

      // 낙관적 업데이트
      queryClient.setQueryData(["notices"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            notices: page.notices.map((notice: any) =>
              notice.id === updatedNotice.id ? updatedNotice : notice
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      // 실패 시 이전 데이터 복구
      if (context?.previousData) {
        queryClient.setQueryData(["notices"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notices"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["notice_detail"],
        refetchType: "all",
      });
      router.push("/notice");
    },
  });

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
          isButtonDisabled || isPending ? styles.disabled : ""
        }`}
        onClick={handleSubmit}
        disabled={isButtonDisabled || isPending}
      >
        {isPending ? "수정 중..." : "수정 하기"}
      </button>
    </div>
  );
}

async function editNotice(id: number | string, title: string, content: string) {
  await apiClient.put(`/admin/notices/${id}`, { title, content });
}
