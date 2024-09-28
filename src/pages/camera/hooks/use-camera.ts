import { randomUUID } from "@/utils/utils";
import React, { useEffect, useRef, useState } from "react";

type CameraHook = {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isFlipped: boolean;
  flipCamera: () => void;
  download: () => void;
  zoomIn?: () => void;
  zoomOut?: () => void;
  zoomLevel: number;
  hasZoom: boolean;
  error: string | null;
  isLoading: boolean;
  isDownloading: boolean;
  changeTrack: () => void;
  tracks: number;
};

const DEFAULT_TRACK = 0;

export const useCamera = (): CameraHook => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isFlipped, setIsFlipped] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [track, setTrack] = useState<MediaStreamTrack | null>(null);
  const [hasZoom, setHasZoom] = useState(false);
  const [maxZoom, setMaxZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(DEFAULT_TRACK);
  const [availableDevices, setAvailableDevices] = useState<MediaStreamTrack[]>(
    [],
  );

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 1280,
            height: 720,
          },
          audio: false,
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        const tracks = mediaStream.getVideoTracks();
        setAvailableDevices(tracks);

        const videoTrack = tracks[DEFAULT_TRACK];
        setTrack(videoTrack);

        const capabilities = videoTrack.getCapabilities();
        if ("zoom" in capabilities) {
          setHasZoom(true);
          // @ts-ignore
          setMaxZoom(capabilities.zoom?.max ?? 1);
        }

        setError(null);
        setIsLoading(false);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setError((error as Error).message);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const flipCamera = () => setIsFlipped(!isFlipped);

  const download = () => {
    if (videoRef.current && canvasRef.current) {
      setIsDownloading(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const canvasContext = canvas.getContext("2d");

      if (canvasContext) {
        if (isFlipped) {
          canvasContext.translate(canvas.width, 0);
          canvasContext.scale(-1, 1);
        }
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        const link = document.createElement("a");
        const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
        link.href = dataUrl;
        link.download = `cam-capture-${randomUUID()}.jpg`;
        link.click();

        setTimeout(() => {
          setIsDownloading(false);
        }, 100);
      }
    }
  };

  const zoomIn = () => {
    if (track) {
      const newZoomLevel = Math.min(zoomLevel + 0.1, maxZoom);
      setZoomLevel(newZoomLevel);
      track.applyConstraints({
        // @ts-ignore
        advanced: [{ zoom: newZoomLevel }] as MediaTrackConstraints[],
      });
    }
  };

  const zoomOut = () => {
    if (track) {
      const newZoomLevel = Math.max(zoomLevel - 0.1, 1);
      setZoomLevel(newZoomLevel);
      track.applyConstraints({
        // @ts-ignore
        advanced: [{ zoom: newZoomLevel }] as MediaTrackConstraints[],
      });
    }
  };

  const changeTrack = () => {
    if (availableDevices.length <= 1) {
      return;
    }

    const nextTrackIndex = (currentTrackIndex + 1) % availableDevices.length;
    if (availableDevices[nextTrackIndex]) {
      setCurrentTrackIndex(nextTrackIndex);
      setTrack(availableDevices[nextTrackIndex]);
    } else {
      setCurrentTrackIndex(DEFAULT_TRACK);
      setTrack(availableDevices[DEFAULT_TRACK]);
    }
  };

  return {
    videoRef,
    canvasRef,
    isFlipped,
    flipCamera,
    download,
    zoomIn,
    zoomOut,
    zoomLevel,
    error,
    hasZoom,
    isLoading,
    isDownloading,
    tracks: availableDevices.length,
    changeTrack,
  };
};
