// 쿠키에서 토큰 가져오는 함수
export const getToken = () => {
  const cookies = document.cookie;

  // 쿠키 문자열에서 'accessToken'을 찾아 파싱
  const token = cookies
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  return token;
};

// 쿠키에 토큰 설정하는 함수
export const setToken = (accessToken: string) => {
  // 쿠키에 accessToken을 저장 (만료 시간을 2시간으로 설정)
  document.cookie = `accessToken=${accessToken}; max-age=3600; path=/;`;
};

// 쿠키에서 토큰 삭제하는 함수
export const deleteToken = () => {
  // 쿠키의 만료 시간을 과거로 설정하여 accessToken을 삭제
  document.cookie = `accessToken=; path=/; max-age=0;`;
};
