"use client";

import React, { useEffect, useState } from "react";
import styles from "./editImageUploader.module.css";
import Image from "next/image";
import apiClient from "@/util/axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading/loading";

export default function EditImageUploader() {
  const [images, setImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]); // 이미지 URL 저장
  const [serverImage, setServerImage] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [texts, setTexts] = useState<string[]>(["", "", "", ""]); // 텍스트 입력값 저장

  const handleImageChange = (index: number, file: File | null) => {
    if (file) {
      setServerImage((prev) => {
        const updatedImages = [...prev];
        updatedImages[index] = file;
        return updatedImages;
      });
      const fileURL = URL.createObjectURL(file);
      setImages((prev) => {
        const updatedImages = [...prev];
        updatedImages[index] = fileURL;
        return updatedImages;
      });
    }
  };

  const handleTextChange = (index: number, value: string) => {
    setTexts((prev) => {
      const updatedTexts = [...prev];
      updatedTexts[index] = value;
      return updatedTexts;
    });
  };

  const handleSave = () => {
    // 저장 버튼 클릭 시 로직
    alert("저장 완료");
  };

  const handleUpload = async (index: number) => {
    const image = serverImage[index];
    if (!image) {
      alert("이미지를 변경해 주세요.");
      return;
    }
    try {
      const res = await postImage(image);
      alert("이미지 등록 완료");
      console.log(res);
      setImages((prev) => {
        const updatedImages = [...prev];
        updatedImages[index] = res.urls[0];
        return updatedImages;
      });
    } catch {
      alert("이미지 등록에 실패했습니다.");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["introduction"],
    queryFn: getData,
  });

  useEffect(() => {
    if (data) {
      setImages(data.map((item) => item.image));
      setTexts(data.map((item) => item.sentence));
    }
  }, [data]);

  if (isLoading) return <Loading text="로딩중.." />;

  return (
    <div className={styles.container}>
      {[1, 2, 3, 4].map((_, index) => (
        <div key={index} className={styles.section}>
          <label className={styles.label}>소개사진{index + 1}</label>
          <div className={styles.imageUpload}>
            {images[index] ? (
              <label htmlFor={`fileInput-${index}`} className={styles.image}>
                <Image
                  src={images[index] as string}
                  alt={`Preview ${index + 1}`}
                  className={styles.image}
                  width={100}
                  height={100}
                />
              </label>
            ) : (
              <div className={styles.placeholder}>
                <label htmlFor={`fileInput-${index}`}>
                  이미지를 업로드하세요
                </label>
              </div>
            )}
            <label
              onClick={() => handleUpload(index)}
              className={styles.uploadButton}
            >
              업로드
            </label>
            <input
              id={`fileInput-${index}`}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={(e) =>
                handleImageChange(
                  index,
                  e.target.files ? e.target.files[0] : null
                )
              }
            />
          </div>
          <label className={styles.label}>소개문구{index + 1}</label>
          <input
            type="text"
            value={texts[index]}
            onChange={(e) => handleTextChange(index, e.target.value)}
            className={styles.textInput}
          />
        </div>
      ))}
      <button className={styles.saveButton} onClick={handleSave}>
        저장하기
      </button>
    </div>
  );
}

interface Type {
  image: string;
  sentence: string;
}

async function getData(): Promise<Type[]> {
  const { data } = await apiClient.get("/admin/infos");
  return data;
}

interface Type {
  urls: Array<string>;
}

async function postImage(image: File): Promise<Type> {
  const { data } = await apiClient.post("/api/images", { images: [image] });
  return data;
}
