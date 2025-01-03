"use client";

import apiClient from "@/util/axios";
import styles from "./products.module.css";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading/loading";
import { useRouter } from "next/navigation";

interface Product {
  id: number | string;
  name: string;
  price: number;
  totalReservationCount: number;
}

export default function Products() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <Loading text="로딩중.." />;

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>상품 번호</th>
            <th>상품명</th>
            <th>가격</th>
            <th>총 예약 건 수</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((post) => (
            <tr key={post.id}>
              <td
                className={styles.id}
                onClick={() => router.push(`/products/detail/${post.id}`)}
              >
                {post.id}
              </td>
              <td onClick={() => router.push(`/products/detail/${post.id}`)}>
                {post.name}
              </td>
              <td onClick={() => router.push(`/products/detail/${post.id}`)}>
                {post.price}
              </td>
              <td onClick={() => router.push(`/products/detail/${post.id}`)}>
                {post.totalReservationCount}
              </td>
              <td onClick={() => router.push(`/products/edit/${post.id}`)}>
                <button>수정하기</button>
              </td>
              <td>
                <button>삭제하기</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function fetchPosts(): Promise<Product[]> {
  const { data } = await apiClient.get(`/admin/products`);
  return data;
}
