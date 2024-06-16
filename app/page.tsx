"use client";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import localFont from "next/font/local";
import "./page.css";
const myFont = localFont({ src: "./fusion-pixel.ttf" });

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uploadImgRef = useRef<HTMLImageElement>(null);
  const uploadImgInputRef = useRef<HTMLInputElement>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState(1);
  const [snapshotImg, setSnapshotImg] = useState("");
  const [uploadImg, setUploadImg] = useState("");
  const [resultText, setResultText] = useState("");
  const [resultImg, setResultImg] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowSnapshot, setIsShowSnapshot] = useState(false);
  const [isResultShow, setIsResultShow] = useState(false);
  const [isErrorShow, setIsErrorShow] = useState(false);

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
    if (!videoRef?.current) {
      return;
    }
    const video = videoRef.current;
    let videoRatio =
      videoAspectRatio < 1 ? 1 / videoAspectRatio : videoAspectRatio;
    let finalWidth = video.offsetWidth;
    let finalHeight = finalWidth * videoRatio;
    drawOnCanvas(video, finalWidth, finalHeight);
  };

  const drawOnCanvas = (source: any, width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ratio = window.devicePixelRatio || 1;
    let finalWidth = width * ratio,
      finalHeight = height * ratio;
    if (finalWidth > finalHeight) {
      const scale = 1024 / finalWidth;
      finalWidth = 1024;
      finalHeight *= scale;
    } else {
      const scale = 1024 / finalHeight;
      finalHeight = 1024;
      finalWidth *= scale;
    }
    const ctx = canvas.getContext("2d");
    canvas.width = finalWidth;
    canvas.height = finalHeight;
    ctx?.drawImage(source, 0, 0, canvas.width, canvas.height);
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

    const url = "/api/create"; //TODO

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
          if (resp.status === 500) {
            setErrorText("用的人太多，欠费了，请稍后重试");
          } else {
            setErrorText("出错了，请重试");
          }
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
        setErrorText("出错了，请重试");
      });
  };

  const reset = () => {
    setResultText("");
    setResultImg("");
    setSnapshotImg("");
    setIsResultShow(false);
    setIsLoading(false);
    setIsShowSnapshot(false);
  };

  const onUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const img = uploadImgRef.current;
    if (!img) {
      return;
    }
    const file = event.target.files[0];
    const fr = new FileReader();
    fr.onloadend = () => {
      if (fr.result) {
        setUploadImg(fr.result as string);
        setIsLoading(true);
        img.onload = () => {
          drawOnCanvas(img, img.width, img.height);
          img.onload = null;
        };
      }
    };
    fr.readAsDataURL(file);
  };

  const showError = (newErrorText: string, showTime = 1500) => {
    setErrorText(newErrorText);
    setIsErrorShow(true);
    setTimeout(() => {
      setIsErrorShow(false);
    }, showTime);
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
            ref={uploadImgRef}
            src={snapshotImg}
            className="h-full main-img"
          />
        </div>
        <div className="flex absolute bottom-px z-10 pb-10 w-full justify-center">
          <div className="px-3">
            <label className="btn btn-blue inline-flex" htmlFor="capture-img">
              {isLoading ? (
                <img
                  src="/loading.svg"
                  className="animate-spin h-5 w-5 mr-3"
                ></img>
              ) : null}
              拍摄
            </label>
            <input
              ref={uploadImgInputRef}
              id="capture-img"
              type="file"
              accept="image/*"
              className="file-input"
              multiple={false}
              onChange={onUploadChange}
              capture="environment"
              disabled={isLoading}
            ></input>
          </div>
          <div className="px-3">
            <label className="btn btn-blue inline-flex" htmlFor="upload-img">
              {isLoading ? (
                <img
                  src="/loading.svg"
                  className="animate-spin h-5 w-5 mr-3"
                ></img>
              ) : null}
              上传
            </label>
            <input
              ref={uploadImgInputRef}
              id="upload-img"
              type="file"
              accept="image/*"
              className="file-input"
              multiple={false}
              onChange={onUploadChange}
              disabled={isLoading}
            ></input>
          </div>
          <img
            ref={uploadImgRef}
            src={uploadImg}
            className="absolute invisible"
          />
        </div>
      </div>
      {isResultShow ? (
        <div className="flex h-full w-full flex-col items-center justify-center z-20 mask absolute">
          <img src={resultImg} className="max-w-80 max-h-80"></img>
          <div className="text-white text-2xl pt-5 pb-10 break-all text-center px-8">
            {resultText}
          </div>
          <button className="btn btn-blue inline-flex" onClick={reset}>
            下一张
          </button>
        </div>
      ) : null}
      {isErrorShow ? (
        <div className="flex h-full w-full flex-col items-center justify-center absolute z-20">
          <div className="error-bg px-5 py-3">{errorText}</div>
        </div>
      ) : null}
    </main>
  );
}
