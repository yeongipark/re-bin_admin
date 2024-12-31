"use client";

import styles from "./ReservationDetail.module.css";

const mockData = {
  reservationId: "REBIN20240925A",
  productName: "개인 프로필",
  reserver: "오주은",
  phone: "010-4108-5088",
  email: "jueun1025@naver.com",
  reservationTime: "2024-10-01 13:00",
  attendees: 2,
  applicationDate: "2024-09-01 13:31",
  status: "입금 완료",
  depositorName: "오주은",
  depositDate: "2024. 03. 10",
  instaUpload: "동의",
  privacyPolicy: "동의",
  request: `사장님~~~ 예쁘게 찍어주세요^^ 
요청사항이 길어질 수도 있겠어요
스튜디오 예약관련 문의 드립니다.
요청사항은 길면 길수록 구역기 귀찮아!`,
};

export default function ReservationDetail() {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>예약 번호</th>
            <td>{mockData.reservationId}</td>
          </tr>
          <tr>
            <th>상품명</th>
            <td>{mockData.productName}</td>
          </tr>
          <tr>
            <th>예약자</th>
            <td>{mockData.reserver}</td>
          </tr>
          <tr>
            <th>전화번호</th>
            <td>{mockData.phone}</td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>{mockData.email}</td>
          </tr>
          <tr>
            <th>예약 시간</th>
            <td>{mockData.reservationTime}</td>
          </tr>
          <tr>
            <th>촬영 인원</th>
            <td>{mockData.attendees}</td>
          </tr>
          <tr>
            <th>신청 일시</th>
            <td>{mockData.applicationDate}</td>
          </tr>
          <tr>
            <th>상태</th>
            <td>{mockData.status}</td>
          </tr>
          <tr>
            <th>입금자명</th>
            <td>{mockData.depositorName}</td>
          </tr>
          <tr>
            <th>입금 일자</th>
            <td>{mockData.depositDate}</td>
          </tr>
          <tr>
            <th>인스타 업로드</th>
            <td>{mockData.instaUpload}</td>
          </tr>
          <tr>
            <th>개인정보수집</th>
            <td>{mockData.privacyPolicy}</td>
          </tr>
          <tr>
            <th>요청 사항</th>
            <td className={styles.request}>{mockData.request}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
