"use client";

import styles from "./productEdit.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import Loading from "../loading/loading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/util/axios";
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

export default function ProductEdit({ id }: { id: number | string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "", // 상품명
    price: "", // 가격
    summary: "", // 한줄 소개
    description: "", // 상품 설명
    thumbnail: null, // 썸네일 이미지
    images: [], // 갤러리 이미지
    deposit: "", // 예약금
    additionalFee: "", // 추가 금액
    guideLine: "", // 가이드라인
  });

  const [contentLength, setContentLength] = useState({
    guideLine: 0,
    description: 0,
  });

  const [serverThumbnail, setServerThumbnail] = useState(null);
  const [serverimages, setServerImages] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true); // 저장 버튼 상태 관리

  const { data, isLoading } = useQuery({
    queryKey: ["product_detail", id],
    queryFn: () => getData(id),
  });

  useEffect(() => {
    if (data) {
      setProduct({
        name: data.name,
        price: data.price.toString(),
        summary: data.summary,
        description: data.description,
        thumbnail: { url: data.thumbnail, type: "server" },
        images: data.images.map((img) => ({ url: img.url, type: "server" })),
        deposit: data.deposit.toString(),
        additionalFee: data.additionalFee.toString(),
        guideLine: data.guideLine,
      });

      setContentLength({
        guideLine: data.guideLine?.length || 0,
        description: data.description?.length || 0,
      });
    }
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      editProduct(id, data), // 객체 구조 분해
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["product_detail", id] });

      queryClient.setQueryData(["product_detail", id], () => ({
        ...product,
        thumbnail: serverThumbnail || product.thumbnail,
        images: serverimages.length > 0 ? serverimages : product.images,
      }));
    },
    onSuccess: () => {
      alert("수정을 완료했습니다.");
      router.replace(`/products/detail/${id}`);
    },
    onError: () => {
      alert("수정에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product_detail", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // 저장 버튼 활성화 조건 업데이트
  useEffect(() => {
    const isAllFieldsFilled =
      product.name && // 상품명
      product.price &&
      !isNaN(Number(product.price)) && // 가격
      product.summary && // 한줄 소개
      product.description && // 상품 설명
      product.deposit &&
      !isNaN(Number(product.deposit)) && // 예약금
      product.additionalFee &&
      !isNaN(Number(product.additionalFee)) && // 추가 금액
      product.guideLine && // 가이드라인
      (serverThumbnail || product.thumbnail) &&
      (serverimages.length !== 0 || product.images.length !== 0);

    setIsSaveDisabled(!isAllFieldsFilled);
  }, [product, serverThumbnail, serverimages]);

  if (isLoading) return <Loading text="로딩중.." />;

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
        thumbnail: {
          url: e.target.files[0], // 로컬 이미지 URL
          type: "local", // 로컬 썸네일
        },
      }));
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        url: file,
        type: "local", // 사용자가 업로드한 이미지는 "local" 타입
      }));
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray], // File 객체 배열 추가
      }));
    }
  };

  const handleSaveThumbnail = async () => {
    try {
      if (product.thumbnail) {
        const thumbnailResponse = await postImage([product.thumbnail]);
        setServerThumbnail(thumbnailResponse.local.urls[0]);
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
        const { local, server } = await postImage(product.images);
        console.log(local, server);
        setServerImages([...local?.urls, ...server?.map((data) => data.url)]);

        alert("갤러리 이미지 저장 완료!");
      } else {
        alert("갤러리 이미지를 업로드하세요.");
      }
    } catch (error) {
      console.error("갤러리 이미지 저장 실패:", error);
      alert("갤러리 이미지 저장에 실패했습니다.");
    }
  };

  const handleGalleryRemove = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSaveBtn = () => {
    const confirmed = window.confirm("정말로 수정하시겠습니까?");
    if (confirmed) {
      const updateData = {
        name: product.name.trim(),
        price: Number(product.price),
        summary: product.summary.trim(),
        description: product.description.trim(),
        thumbnail: serverThumbnail || product.thumbnail.url, // 수정된 썸네일 또는 기존 썸네일
        images:
          serverimages.length > 0
            ? serverimages
            : product.images.map((data) => data.url), // 수정된 이미지 또는 기존 이미지
        deposit: Number(product.deposit),
        additionalFee: Number(product.additionalFee),
        guideLine: product.guideLine.trim(),
      };

      mutate({ id, data: updateData }); // 객체 형태로 전달
    }
  };

  if (isPending) return <Loading text="로딩중.." />;

  return (
    <div className={styles.container}>
      <div className={styles.thumbnail}>
        <label>
          {product.thumbnail ? (
            <div className={styles.thumbnailImage}>
              <Image
                src={
                  product.thumbnail.type === "server"
                    ? `https://image.re-bin.kr/rebin/${product.thumbnail.url}` // 서버 썸네일
                    : URL.createObjectURL(product.thumbnail.url) // 로컬 썸네일
                }
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
                value={product.guideLine ?? ""}
                onChange={handleInputChange}
                className={styles.textarea}
              />
              <div className={styles.charCount}>
                ({contentLength.guideLine}/2000)
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
                ({contentLength.description}/2000)
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
                src={
                  image.type === "server"
                    ? `https://image.re-bin.kr/rebin/${image.url}` // 서버 이미지
                    : URL.createObjectURL(image.url) // 로컬 이미지
                }
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
            style={{ marginRight: "1rem" }}
            htmlFor="imagesInput"
            className={styles.uploadLabel}
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
        disabled={isSaveDisabled}
        onClick={handleSaveBtn}
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

async function postImage(images: File[]) {
  console.log(images);
  const formData = new FormData();

  images.forEach((image) => {
    if (image.type === "local") {
      formData.append("images", image.url);
    }
  });

  const response = await apiClient.post("/api/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    local: response.data,
    server: images.filter((data) => data.type === "server"),
  }; // 서버에서 반환된 데이터
}

async function editProduct(
  id: number | string,
  data: {
    name: string;
    price: number | string;
    summary: string;
    description: string;
    thumbnail: string | null;
    images: string[] | null;
    deposit: number | string;
    additionalFee: number | string;
    guideLine: string;
  }
) {
  return await apiClient.put(`/admin/products/${id}`, data); // POST 대신 PUT 사용 권장
}
