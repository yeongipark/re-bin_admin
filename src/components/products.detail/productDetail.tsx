"use client";

import apiClient from "@/util/axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading/loading";
import styles from "./productDetail.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  thumbnail: string;
  summary: string;
  price: number;
  description: string;
  images: Image[];
  guideLine: string;
  deposit: number;
  additionalFee: number;
}

interface Image {
  id: number;
  url: string;
}

export default function ProductDetail({ id }: { id: number | string }) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["product_detail", id],
    queryFn: () => getData(id),
  });

  if (isLoading) return <Loading text="로딩중.." />;

  return (
    <div className={styles.container}>
      <div className={styles.thumbnail}>
        <div className={styles.thumbnailImage}>
          <Image
            src={`https://image.re-bin.kr/rebin/${data!.thumbnail}`}
            alt="Thumbnail"
            width={100}
            height={100}
            layout="responsive"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
      <div className={styles.divider}></div>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>상품명</th>
            <td>
              <p>{data?.name}</p>
            </td>
          </tr>
          <tr>
            <th>가격</th>
            <td>
              <p>{data?.price}</p>
            </td>
          </tr>
          <tr>
            <th>한줄 소개</th>
            <td>
              <p>{data?.summary}</p>
            </td>
          </tr>
          <tr>
            <th>추가 금액</th>
            <td>
              <p>{data?.additionalFee}</p>
            </td>
          </tr>
          <tr>
            <th>예약금</th>
            <td>
              <p>{data?.deposit}</p>
            </td>
          </tr>
          <tr>
            <th>가이드라인</th>
            <td>
              <p className={styles.p}>{data?.guideLine}</p>
            </td>
          </tr>
          <tr>
            <th>상품 설명</th>
            <td>
              <p className={styles.p}>{data?.description}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <div className={styles.gallery}>
        <div className={styles.galleryPreview}>
          {data?.images.map((image, index) => (
            <div key={index} className={styles.galleryItem}>
              <Image
                width={100}
                height={100}
                layout="responsive"
                src={`https://image.re-bin.kr/rebin/${image.url}`}
                alt={`Gallery ${index}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.divider}></div>
      <button
        className={styles.saveButton}
        onClick={() => router.push(`/products/edit/${id}`)}
      >
        수정하기
      </button>
    </div>
  );
}

async function getData(id: number | string): Promise<Product> {
  const { data } = await apiClient.get(`/admin/products/${id}`);
  return data;
}
