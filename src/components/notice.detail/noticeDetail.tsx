"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./noticeDetail.module.css";
import apiClient from "@/util/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../loading/loading";
import Alert from "../alert/alert";
import Confirm from "../confirm";

type Notice = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default function NoticeDetail({ id }: { id: number | string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showConfirm, setShowConfirm] = useState(false);

  const { data, isLoading, isError } = useQuery<Notice>({
    queryKey: ["notice_detail", id],
    queryFn: () => getData(id),
    refetchOnMount: false,
  });

  const { mutate: deleteNotice, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteData(id),
    onMutate: async () => {
      const previousData = queryClient.getQueryData(["notices"]);

      queryClient.setQueryData(["notices"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            notices: page.notices.filter((notice: Notice) => notice.id !== id),
          })),
        };
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["notices"], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notices"],
        refetchType: "all",
      });
      router.back();
    },
  });

  const handleEdit = () => {
    const query = new URLSearchParams({
      title: data?.title || "",
      content: data?.content || "",
      id: data?.id || "",
    }).toString();

    router.push(`/notice/edit?${query}`);
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteNotice();
    setShowConfirm(false); // Confirm 모달 닫기
  };

  if (isError) {
    return (
      <Alert
        title="오류가 발생했습니다. 다시 시도해 주세요."
        type="cancel"
        setModalState={() => {
          router.back();
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      {isLoading || isDeleting ? <Loading text="로딩중.." /> : null}
      {showConfirm && (
        <Confirm
          title="삭제하시겠습니까?"
          setModalState={setShowConfirm}
          ok="삭제"
          cancel="취소"
          func={confirmDelete}
        />
      )}
      <p className={styles.title}>{data?.title}</p>
      <p className={styles.date}>{data?.createdAt.split("T")[0]}</p>
      <hr className={styles.divider} />
      <div className={styles.content}>{data?.content}</div>
      <div className={styles.buttonGroup}>
        <button className={styles.editButton} onClick={handleEdit}>
          수정하기
        </button>
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}

async function getData(id: string | number) {
  const { data } = await apiClient.get(`/api/notices/${id}`);
  return data;
}

async function deleteData(id: string | number) {
  await apiClient.delete(`/admin/notices/${id}`);
}
