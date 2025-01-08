"use client";

import React, { useEffect, useState } from "react";
import styles from "./imageUploader.module.css";
import Image from "next/image";
import apiClient from "@/util/axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Loading from "../loading/loading";

export default function ImageUploader() {
  const router = useRouter();

  const [images, setImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]); // 이미지 URL 저장
  const [texts, setTexts] = useState<string[]>(["", "", "", ""]); // 텍스트 입력값 저장

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
              <Image
                src={images[index] as string}
                alt={`Preview ${index + 1}`}
                className={styles.image}
                width={100}
                height={100}
              />
            ) : (
              <div className={styles.placeholder}>이미지를 업로드하세요</div>
            )}
          </div>
          <label className={styles.label}>소개문구{index + 1}</label>
          <div className={styles.textInput}>{texts[index]}</div>
        </div>
      ))}

      <button
        className={styles.saveButton}
        onClick={() => router.push("/introduction/edit")}
      >
        수정하기
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
