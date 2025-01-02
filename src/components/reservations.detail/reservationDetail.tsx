"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReservationStatusType } from "../types";
import styles from "./ReservationDetail.module.css";
import apiClient from "@/util/axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading/loading";
import Alert from "../alert/alert";

interface ReservationDetail {
  id: number | number; // 예약 ID
  code: string; // 예약 코드
  shootDate: string; // 촬영 날짜
  time: string;
  name: string; // 예약자 이름
  phone: string; // 예약자 전화번호
  status: keyof typeof ReservationStatusType;
  peopleCnt: number; // 예약 인원 수
  isAgreeUpload: boolean; // 업로드 동의 여부
  notes: string; // 예약 메모
  totalPrice: number; // 총 금액
  canChange: boolean; // 예약 변경 가능 여부
  productInfo: {
    id: number; // 상품 ID
    name: string; // 상품 이름
    price: number; // 상품 가격
    thumbnail: string; // 상품 썸네일 URL
    deposit: number; // 예약금
    additionalFee: number; // 추가 요금
  };
}

export default function ReservationDetail() {
  const router = useRouter();

  const params = useSearchParams();
  const code = params.get("code");

  const { data, isLoading, error } = useQuery({
    queryKey: ["reservation_detail", code],
    queryFn: () => getData(code ?? ""),
  });

  if (isLoading) return <Loading text="로딩중.." />;

  if (error)
    return (
      <Alert
        title="오류가 발생했습니다. 다시 시도해 주세요."
        type="cancel"
        setModalState={() => router.back()}
      />
    );

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>예약 번호</th>
            <td>{data?.code}</td>
          </tr>
          <tr>
            <th>상품명</th>
            <td>{data?.productInfo.name}</td>
          </tr>
          <tr>
            <th>예약자</th>
            <td>{data?.name}</td>
          </tr>
          <tr>
            <th>전화번호</th>
            <td>{data?.phone}</td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>{data?.email || "이메일 없음음"}</td>
          </tr>
          <tr>
            <th>예약 시간</th>
            <td>{data?.reservationTime}</td>
          </tr>
          <tr>
            <th>촬영 인원</th>
            <td>{data?.peopleCnt}</td>
          </tr>
          <tr>
            <th>신청 일시</th>
            <td>{data?.applicationDate}</td>
          </tr>
          <tr>
            <th>상태</th>
            <td>{data?.status}</td>
          </tr>
          <tr>
            <th>입금자명</th>
            <td>{data?.depositorName}</td>
          </tr>
          <tr>
            <th>입금 일자</th>
            <td>{data?.depositDate}</td>
          </tr>
          <tr>
            <th>인스타 업로드</th>
            <td>{data?.isAgreeUpload}</td>
          </tr>
          <tr>
            <th>개인정보수집</th>
            <td>{data?.privacyPolicy}</td>
          </tr>
          <tr>
            <th>요청 사항</th>
            <td className={styles.request}>{data?.notes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

async function getData(code: string): Promise<ReservationDetail> {
  const res = await apiClient.get(`/admin/reservations/${code}`);
  return res.data;
}
