import { randomUUID } from '@/utils/utils';
import React, { useEffect, useRef, useState } from 'react';

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
};

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

  useEffect(() => {
    const startCamera = async () => {
      setIsLoading(true);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        const videoTrack = mediaStream.getVideoTracks()[0];
        setTrack(videoTrack);

        const capabilities = videoTrack.getCapabilities();
        if ('zoom' in capabilities) {
          setHasZoom(true);
          // @ts-ignore
          setMaxZoom(capabilities.zoom?.max ?? 1);
        }

        setError(null);
        setIsLoading(false);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setError((error as Error).message);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const flipCamera = () => {
    setIsFlipped(!isFlipped);
  };

  const download = () => {
    if (videoRef.current && canvasRef.current) {
      setIsDownloading(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        if (isFlipped) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');

        const link = document.createElement('a');
        link.href = dataUrl;
        const outputFileName = `cam-capture-${randomUUID()}.jpg`;
        link.download = outputFileName;
        link.click();

        setTimeout(() => {

          setIsDownloading(false);
        }, 2000);
      }
    }
  };

  const zoomIn = !track
    ? undefined
    : () => {
      if (track) {
        const newZoomLevel = Math.min(zoomLevel + 0.1, maxZoom);
        setZoomLevel(newZoomLevel);
        track.applyConstraints({
          // @ts-ignore
          advanced: [{ zoom: newZoomLevel }] as MediaTrackConstraints[],
        });
      }
    };

  const zoomOut = !track
    ? undefined
    : () => {
      if (track) {
        const newZoomLevel = Math.max(zoomLevel - 0.1, 1);
        setZoomLevel(newZoomLevel);
        track.applyConstraints({
          // @ts-ignore
          advanced: [{ zoom: newZoomLevel }] as MediaTrackConstraints[],
        });
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
    isDownloading
  };
};
