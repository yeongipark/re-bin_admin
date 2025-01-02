"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useMemo } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  // QueryClient 생성 및 옵션 설정
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // 창을 다시 포커싱했을 때 재요청 방지
            retry: 1, // 요청 실패 시 재시도 횟수
            staleTime: 1000 * 60 * 5, // 데이터가 신선한 상태로 유지되는 시간 (5분)
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
