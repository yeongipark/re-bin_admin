"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/util/cookie";
import Alert from "./alert/alert";

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [token, setToken] = useState<string | null | undefined>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setToken("토큰없음");
    }
  }, [router]);

  if (token === "토큰없음") {
    return (
      <Alert
        title="로그인 후 다시 이용해 주세요."
        type="cancel"
        setModalState={() => {
          router.replace("/login");
        }}
      />
    );
  }

  return <>{children}</>; // 인증 통과 시 렌더링
}
