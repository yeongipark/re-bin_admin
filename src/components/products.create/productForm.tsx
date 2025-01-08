"use client";

import React, { useEffect, useState } from "react";
import styles from "./productForm.module.css";
import Image from "next/image";
import { TiDeleteOutline } from "react-icons/ti";
import apiClient from "@/util/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ProductForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "", // 상품명
    price: "", // 가격
    summary: "", // 한줄 소개
    description: "", // 상품 설명
    thumbnail: null as File | null, // 썸네일 이미지
    images: [] as File[], // 갤러리 이미지
    deposit: "", // 예약금
    additionalFee: "", // 추가 금액
    guideLine: "", // 가이드라인
  });

  const [serverThumbnail, setServerThumbnail] = useState(null);
  const [serverimages, setServerImages] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true); // 저장 버튼 상태 관리

  const { mutate } = useMutation({
    mutationFn: createProducts,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["products"] });

      queryClient.setQueryData(["products"], (prev: any) => {
        return [
          ...(prev || []), // 이전 데이터 유지
          {
            id: 0, // 임시 ID
            name: product.name,
            price: product.price,
            totalReservationCount: 0, // 초기값 설정
          },
        ];
      });
    },
    onSuccess: () => {
      alert("상품 등록을 완료했습니다.");
      router.push("/products");
    },
    onError: () => {
      alert("상품 등록을 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "all",
      });
    },
  });

  const [contentLength, setContentLength] = useState({
    guideLine: 0,
    description: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "guideLine" || name === "description") {
      setContentLength((prev) => ({
        ...prev,
        [name]: value.length,
      }));
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProduct((prev) => ({
        ...prev,
        thumbnail: e.target.files[0], // File 객체 저장
      }));
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setProduct((prev) => ({
        ...prev,
        images: [...filesArray, ...prev.images], // File 객체 배열 추가
      }));
    }
  };

  const handleGalleryRemove = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSaveThumbnail = async () => {
    try {
      if (product.thumbnail) {
        const thumbnailResponse = await postImage([product.thumbnail]);
        setServerThumbnail(thumbnailResponse.urls[0]);
        alert("썸네일 저장 완료!");
      } else {
        alert("썸네일 이미지를 업로드하세요.");
      }
    } catch (error) {
      console.error("썸네일 저장 실패:", error);
      alert("썸네일 저장에 실패했습니다.");
    }
  };

  const handleSaveGallery = async () => {
    try {
      if (product.images.length > 0) {
        const galleryResponse = await postImage(product.images);
        setServerImages(galleryResponse.urls);

        alert("갤러리 이미지 저장 완료!");
      } else {
        alert("갤러리 이미지를 업로드하세요.");
      }
    } catch (error) {
      console.error("갤러리 이미지 저장 실패:", error);
      alert("갤러리 이미지 저장에 실패했습니다.");
    }
  };

  const handleSaveBtn = () => {
    const data = {
      ...product,
      thumbnail: serverThumbnail,
      images: serverimages,
    };

    mutate(data);
  };

  // 저장 버튼 활성화 조건 업데이트
  useEffect(() => {
    const isAllFieldsFilled =
      product.name.trim() && // 상품명
      product.price &&
      !isNaN(Number(product.price)) && // 가격
      product.summary.trim() && // 한줄 소개
      product.description.trim() && // 상품 설명
      product.deposit &&
      !isNaN(Number(product.deposit)) && // 예약금
      product.additionalFee &&
      !isNaN(Number(product.additionalFee)) && // 추가 금액
      product.guideLine.trim() && // 가이드라인
      serverThumbnail &&
      serverimages.length !== 0;

    setIsSaveDisabled(!isAllFieldsFilled);
  }, [product, serverThumbnail, serverimages]);

  return (
    <div className={styles.container}>
      <div className={styles.thumbnail}>
        <label>
          {product.thumbnail ? (
            <div className={styles.thumbnailImage}>
              <Image
                src={URL.createObjectURL(product.thumbnail)} // 미리보기
                alt="Thumbnail"
                width={100}
                height={100}
                layout="responsive"
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <div className={styles.placeholder}>이미지를 업로드하세요</div>
          )}
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            hidden
          />
        </label>

        <div>
          <label
            htmlFor="thumbnail"
            className={styles.uploadLabel}
            style={{ marginTop: "1rem", marginRight: "1rem" }}
          >
            업로드
          </label>
          <label className={styles.uploadLabel} onClick={handleSaveThumbnail}>
            사진 저장하기
          </label>
        </div>
      </div>
      <div className={styles.divider}></div>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>상품명</th>
            <td>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </td>
          </tr>
          <tr>
            <th>가격</th>
            <td>
              <input
                type="text"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className={styles.input}
              />
            </td>
          </tr>
          <tr>
            <th>한줄 소개</th>
            <td>
              <input
                type="text"
                name="summary"
                maxLength={20}
                value={product.summary}
                onChange={handleInputChange}
                className={styles.input}
              />
            </td>
          </tr>
          <tr>
            <th>추가 금액</th>
            <td>
              <input
                type="text"
                name="additionalFee"
                value={product.additionalFee}
                onChange={handleInputChange}
                className={styles.input}
              />
            </td>
          </tr>
          <tr>
            <th>예약금</th>
            <td>
              <input
                type="text"
                name="deposit"
                value={product.deposit}
                onChange={handleInputChange}
                className={styles.input}
              />
            </td>
          </tr>
          <tr>
            <th>가이드라인</th>
            <td>
              <textarea
                name="guideLine"
                maxLength={2000}
                value={product.guideLine}
                onChange={handleInputChange}
                className={styles.textarea}
              />
              <div className={styles.charCount}>
                ({contentLength.guideLine}/5000)
              </div>
            </td>
          </tr>
          <tr>
            <th>상품 설명</th>
            <td>
              <textarea
                name="description"
                maxLength={2000}
                value={product.description}
                onChange={handleInputChange}
                className={styles.textarea}
              />
              <div className={styles.charCount}>
                ({contentLength.description}/5000)
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className={styles.gallery}>
        <div className={styles.galleryPreview}>
          {product.images.length === 0 && <label>이미지를 업로드하세요</label>}
          {product.images.map((image, index) => (
            <div key={index} className={styles.galleryItem}>
              <Image
                width={100}
                height={100}
                layout="responsive"
                src={URL.createObjectURL(image)} // 미리보기
                alt={`Gallery ${index}`}
              />

              <TiDeleteOutline
                className={styles.removeButton}
                onClick={() => handleGalleryRemove(index)}
              />
            </div>
          ))}
        </div>
        <input
          id="imagesInput"
          type="file"
          multiple
          accept="image/*"
          onChange={handleGalleryUpload}
          hidden
        />
        <div className={styles.labelWrap}>
          <label
            htmlFor="imagesInput"
            className={styles.uploadLabel}
            style={{ marginRight: "1rem" }}
          >
            업로드
          </label>
          <label className={styles.uploadLabel} onClick={handleSaveGallery}>
            사진 저장하기
          </label>
        </div>
      </div>
      <div className={styles.divider}></div>
      <button
        className={`${styles.saveButton} ${isSaveDisabled && styles.notBtn}`}
        onClick={handleSaveBtn}
        disabled={isSaveDisabled}
      >
        저장하기
      </button>
    </div>
  );
}

export async function postImage(images: File[]) {
  console.log(images);
  const formData = new FormData();

  images.forEach((image) => {
    formData.append("images", image); // File 객체 추가
  });

  const response = await apiClient.post("/api/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // 서버에서 반환된 데이터
}

async function createProducts(data: {
  name: string;
  price: number | string;
  summary: string;
  description: string;
  thumbnail: string | null;
  images: string[] | null;
  deposit: number | string;
  additionalFee: number | string;
  guideLine: string;
}) {
  await apiClient.post(`/admin/products`, data);
}
