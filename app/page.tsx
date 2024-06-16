"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import localFont from "next/font/local";
import "./page.css";
const myFont = localFont({ src: "./fusion-pixel.ttf" });
import { ImageUpload } from "@/components/ui/ImageUpload";
export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snapshotImgRef = useRef<HTMLImageElement>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState(1);
  const [snapshotImg, setSnapshotImg] = useState("");
  const [resultText, setResultText] = useState("");
  const [resultImg, setResultImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowSnapshot, setIsShowSnapshot] = useState(false);
  const [isResultShow, setIsResultShow] = useState(false);
  const [referImage, setReferImage] = useState<string | undefined>(undefined)
  const [referImageMode, setReferImageMode] = useState("")
  const onUploadReferImage = (value: string) => {
    setReferImage(value)
  }
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
        },
      })
      .then((stream) => {
        if (videoRef?.current) {
          videoRef.current.srcObject = stream;
          setVideoAspectRatio(
            stream.getVideoTracks()[0]?.getSettings()?.aspectRatio ?? 1
          );
        }
      });
  }, []);

  useEffect(() => {
    if (snapshotImg === "") {
      return;
    }
    fetchResult();
  }, [snapshotImg]);

  const submit = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    snapshot();
  };

  const snapshot = () => {
    if (!videoRef?.current || !canvasRef?.current || !snapshotImgRef?.current) {
      return;
    }
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    ctx?.scale(ratio, ratio);

    let videoRatio =
      videoAspectRatio < 1 ? 1 / videoAspectRatio : videoAspectRatio;
    let finalWidth = video.offsetWidth;
    let finalHeight = finalWidth * videoRatio;

    if (finalWidth > finalHeight) {
      const scale = 1024 / finalWidth;
      finalWidth = 1024;
      finalHeight *= scale;
    } else {
      const scale = 1024 / finalHeight;
      finalHeight = 1024;
      finalWidth *= scale;
    }

    canvas.width = finalWidth * ratio;
    canvas.height = finalHeight * ratio;

    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setSnapshotImg(canvas.toDataURL("image/jpg"));
    setIsShowSnapshot(true);
  };

  /** TODO: 填充服务器信息 */
  const fetchResult = () => {
    /*
    setTimeout(() => {
      setResultText(`你获得了"游戏手柄"`);
      setResultImg("/test-img.png");
      setIsResultShow(true);
      setIsLoading(false);
    }, 3000);
    */

    const url = "/create"; //TODO

    const data = {
      base_64: snapshotImg,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    };

    fetch(url, options)
      .then(async (resp) => {
        if (!resp.ok) {
          //TODO
          reset();
          alert("出错了，请重试");
          return;
        }

        const res = await resp.json();

        // TODO: 拿到结果并显示
        setResultImg(res.image_url);
        setResultText(res.text);

        setIsResultShow(true);
        setIsLoading(false);
      })
      .catch((err) => {
        reset();
        alert("出错了，请重试");
      });
  };

  const reset = () => {
    setResultText("");
    setResultImg("");
    setIsResultShow(false);
    setIsLoading(false);
    setIsShowSnapshot(false);
  };

  return (
    <main className={"h-dvh " + myFont.className}>
      <div className="flex h-full w-full flex-col items-center justify-center p-0 absolute">
        <div
          className={
            "z-0 h-dvh absolute " + (isShowSnapshot ? "invisible" : "visbile")
          }
        >
          <video ref={videoRef} autoPlay className="h-full main-video" />
        </div>
        <canvas
          ref={canvasRef}
          className="z-0 h-dvh w-full absolute invisible"
        ></canvas>
        <div
          className={
            "z-0 h-dvh absolute " + (isShowSnapshot ? "visible" : "invisible")
          }
        >
          <img
            ref={snapshotImgRef}
            src={snapshotImg}
            className="h-full main-img"
          />
        </div>
        <div className="flex items-center jusify-center absolute bottom-px z-10 pb-10">
          {isResultShow ? null : (
            <button
              className="btn btn-blue inline-flex"
              onClick={() => submit()}
            >
              {isLoading ? (
                <img
                  src="/loading.svg"
                  className="animate-spin h-5 w-5 mr-3"
                ></img>
              ) : null}
              拍摄
            </button>
          )}
        </div>
      </div>
      <ImageUpload
          value={referImage}
          onChange={(newValue?: string) => onUploadReferImage(newValue || '')}
      />
      {isResultShow ? (
        <div className="flex h-full w-full flex-col items-center justify-center z-20 mask absolute">
          <img src={resultImg} className="max-w-80 max-h-80"></img>
          <div className="text-2xl pt-5 pb-10 break-all text-center px-8">
            {resultText}
          </div>
          <button className="btn btn-blue inline-flex" onClick={() => reset()}>
            下一张
          </button>
        </div>
      ) : null}
    </main>
  );
}
