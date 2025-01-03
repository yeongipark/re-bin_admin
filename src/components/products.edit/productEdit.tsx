"use client";

import styles from "./productEdit.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import Loading from "../loading/loading";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/util/axios";

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
        thumbnail: data.thumbnail,
        images: data.images.map((img) => img.url),
        deposit: data.deposit.toString(),
        additionalFee: data.additionalFee.toString(),
        guideLine: data.guideLine,
      });

      setContentLength({
        guideLine: data.guideLine.length,
        description: data.description.length,
      });
    }
  }, [data]);

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
        thumbnail: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setProduct((prev) => ({
        ...prev,
        images: [...filesArray, ...prev.images], // 새 이미지를 왼쪽에 추가
      }));
    }
  };

  const handleGalleryRemove = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.thumbnail}>
        <label>
          {product.thumbnail ? (
            <div className={styles.thumbnailImage}>
              <Image
                src={product.thumbnail}
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
          <label className={styles.uploadLabel}>사진 저장하기</label>
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
                src={image}
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
          <label className={styles.uploadLabel}>사진 저장하기</label>
        </div>
      </div>
      <div className={styles.divider}></div>
      <button className={styles.saveButton}>저장하기</button>
    </div>
  );
}

async function getData(id: number | string): Promise<Product> {
  const { data } = await apiClient.get(`/admin/products/${id}`);
  return data;
}
