"use client";

import React, { useEffect, useState } from "react";
import styles from "./editImageUploader.module.css";
import Image from "next/image";
import apiClient from "@/util/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../loading/loading";
import { useRouter } from "next/navigation";

interface ImageData {
  url: string | null;
  type: "server" | "client";
}

export default function EditImageUploader() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [originalImages, setOriginalImages] = useState<ImageData[]>([
    { url: null, type: "server" },
    { url: null, type: "server" },
    { url: null, type: "server" },
    { url: null, type: "server" },
  ]); // 이미지 데이터 저장
  const [images, setImages] = useState<ImageData[]>([
    { url: null, type: "server" },
    { url: null, type: "server" },
    { url: null, type: "server" },
    { url: null, type: "server" },
  ]); // 이미지 데이터 저장
  const [serverImage, setServerImage] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const [receiveImageUrl, setReceiveUrl] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]); // 서버에서 받은 url 저장

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
        updatedImages[index] = { url: fileURL, type: "client" };
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

  const handleUpload = async (index: number) => {
    const image = serverImage[index];
    if (!image) {
      alert("이미지를 선택해 주세요.");
      return;
    }
    try {
      const res = await postImage(image);
      alert("이미지 등록 완료");
      setReceiveUrl((prev) => {
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

  const { mutate, isPending } = useMutation({
    mutationFn: () => editIntroduction(originalImages, receiveImageUrl, texts),
    onError: () => {
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["introduction"],
        refetchType: "all",
      });
      alert("소개글 변경 완료!");
      router.replace("/introduction");
    },
  });

  useEffect(() => {
    if (data) {
      setImages(
        data.map((item) => ({
          url: item.image,
          type: "server",
        }))
      );
      setOriginalImages(
        data.map((item) => ({
          url: item.image,
          type: "server",
        }))
      );
      setTexts(data.map((item) => item.sentence));
    }
  }, [data]);

  if (isLoading) return <Loading text="로딩중.." />;

  if (isPending) return <Loading text="수정중.." />;

  return (
    <div className={styles.container}>
      {[1, 2, 3, 4].map((_, index) => (
        <div key={index} className={styles.section}>
          <label className={styles.label}>소개사진{index + 1}</label>
          <div className={styles.imageUpload}>
            {images[index].url ? (
              <label htmlFor={`fileInput-${index}`} className={styles.image}>
                <Image
                  src={
                    images[index].type === "server"
                      ? `https://image.re-bin.kr/rebin/${images[index].url}`
                      : (images[index].url as string)
                  }
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
              이미지 저장
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
      <button className={styles.saveButton} onClick={() => mutate()}>
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
  const formData = new FormData();
  formData.append("images", image);
  const { data } = await apiClient.post("/api/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

async function editIntroduction(
  original: ImageData[],
  receive: (string | null)[],
  texts: string[]
) {
  await apiClient.post("/admin/infos", [
    { image: receive[0] ?? original[0].url, sentence: texts[0] },
    { image: receive[1] ?? original[1].url, sentence: texts[1] },
    { image: receive[2] ?? original[2].url, sentence: texts[2] },
    { image: receive[3] ?? original[3].url, sentence: texts[3] },
  ]);
}
