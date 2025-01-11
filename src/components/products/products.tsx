"use client";

import apiClient from "@/util/axios";
import styles from "./products.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchPosts,
  });

  const { mutate } = useMutation({
    mutationFn: deleteProduct,
    onMutate: async (productId: number | string) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previousData = queryClient.getQueryData<Product[]>(["products"]);

      queryClient.setQueryData<Product[]>(
        ["products"],
        (prev) => prev?.filter((product) => product.id !== productId) ?? []
      );

      return { previousData };
    },
    onError: () => {
      alert("상품 삭제에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  if (isLoading) return <Loading text="로딩중.." />;

  const handleDelete = (productId: number | string) => {
    const confirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmed) {
      mutate(productId);
    }
  };

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
                <button style={{ fontSize: "0.8rem" }}>수정하기</button>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{ fontSize: "0.8rem" }}
                >
                  삭제하기
                </button>
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

async function deleteProduct(productId: number | string) {
  await apiClient.delete(`/admin/products/${productId}`);
}
