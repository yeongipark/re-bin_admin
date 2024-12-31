export async function logout() {
  try {
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_SERVER_URL}/logout`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      console.error(res);
      throw new Error("로그아웃에 실패했습니다.");
    }

    // 필요한 경우 localStorage에서 토큰 삭제
    localStorage.removeItem("accessToken");
  } catch (e) {
    console.log(e);
  }
}
