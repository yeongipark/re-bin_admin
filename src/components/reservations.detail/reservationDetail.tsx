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
  payerName: string; // 결제자 이름
  paymentDate: string; // 결제일
  createdAt: string; // 등록일
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
            <th>예약 시간</th>
            <td>{data?.time.slice(0, -3)}</td>
          </tr>
          <tr>
            <th>촬영 인원</th>
            <td>{data?.peopleCnt}</td>
          </tr>
          <tr>
            <th>신청 일시</th>
            <td>{formatDateTime(data!.createdAt)}</td>
          </tr>
          <tr>
            <th>상태</th>
            <td>{ReservationStatusType[data!.status]}</td>
          </tr>
          <tr>
            <th>입금자명</th>
            <td>{data?.payerName}</td>
          </tr>
          <tr>
            <th>입금 일자</th>
            <td>{formatDateTime(data!.paymentDate)}</td>
          </tr>
          <tr>
            <th>인스타 업로드</th>
            <td>{data?.isAgreeUpload ? "허용" : "불가"}</td>
          </tr>
          <tr>
            <th>요청 사항</th>
            <td className={styles.request}>
              {data?.notes === "" ? "없음" : data?.notes}
            </td>
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

function formatDateTime(isoString: string): string {
  if (!isoString) return "날짜 정보 없음"; // undefined 또는 null 처리

  const date = new Date(isoString);

  // 날짜가 유효하지 않은 경우 처리
  if (isNaN(date.getTime())) {
    return "잘못된 날짜 형식";
  }

  // 연도, 월, 일, 시간, 분 추출 및 포맷팅
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // 원하는 형식으로 문자열 반환
  return `${year}-${month}-${day} ${hours}:${minutes}분`;
}
