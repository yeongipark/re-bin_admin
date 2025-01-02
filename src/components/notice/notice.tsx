"use client";

import { useRouter } from "next/navigation";
import styles from "./notice.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/util/axios";

type Notice = {
  id: number | string;
  title: string;
  content: string;
  createdAt: string;
};

type FetchNoticesResponse = {
  notices: Notice[];
  nextPage: number | null;
};

async function fetchPosts(page: number): Promise<FetchNoticesResponse> {
  const { data } = await apiClient.get(`/api/notices?page=0`);
  return {
    notices: data.notices,
    nextPage: data.hasNextPage ? page + 1 : null,
  };
}

export default function Notice() {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["notices"],
      getNextPageParam: (lastPage) => lastPage.nextPage,
      queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
    });

  const movePage = (id: number | string) => {
    router.push(`/notice/detail/${id}`);
  };

  const formatDate = (dateString: string) => {
    return dateString.split("T")[0]; // '2024-12-31T00:00:00' -> '2024-12-31'
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
          {data?.pages.map((page) =>
            page.notices.map((item) => (
              <tr
                key={item.id}
                onClick={() => {
                  movePage(item.id);
                }}
              >
                <td className={styles.id}>{item.id}</td>
                <td>{item.title}</td>
                <td>{formatDate(item.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 더보기 버튼 */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className={styles.loadMoreButton}
        >
          {isFetchingNextPage ? "로딩 중..." : "더보기"}
        </button>
      )}

      {/* 로딩 표시 */}
      {isFetching && !isFetchingNextPage && <p>로딩 중...</p>}
    </div>
  );
}
