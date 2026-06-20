import { Page } from "@/components/page/page";
import { useCamera } from "./hooks/use-camera";
import { Modal } from "@/components/modal/modal";
import "./camera.css";

export const Camera = () => {
  const {
    videoRef,
    canvasRef,
    isFlipped,
    flipCamera,
    download,
    hasZoom,
    zoomIn,
    zoomOut,
    error,
    isDownloading,
    isLoading,
    tracks,
    changeTrack,
  } = useCamera();

  return (
    <Page name="Camera">
      {error && <div className="cam-error">{error}</div>}
      <Modal title="Downloading file" visible={isDownloading}>
        <div style={{ color: "var(--mx-muted)" }}>Please wait...</div>
      </Modal>
      <div className="cam-layout">
        <div className="cam-video-wrap">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-500 transition-transform duration-300 ease-in-out"
            style={{
              transform: `${isFlipped ? "scaleX(-1)" : "none"}`,
            }}
          />
          {isLoading && (
            <div className="w-full max-w-500 transition-transform duration-300 ease-in-out absolute inset-0 flex items-center justify-center">
              Loading...
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="cam-controls">
          <button onClick={flipCamera} className="cam-btn">
            <span>{isFlipped ? "⏪" : "⏩"}</span>
            Flip
          </button>
          {hasZoom && (
            <button onClick={zoomIn} className="cam-btn">
              <span>🔍+</span>
              Zoom In
            </button>
          )}
          {hasZoom && (
            <button onClick={zoomOut} className="cam-btn">
              <span>🔍-</span>
              Zoom Out
            </button>
          )}
          <button onClick={download} className="cam-btn">
            <span>📸</span>
            Capture
          </button>
          {tracks > 1 && (
            <button onClick={changeTrack} className="cam-btn">
              <span>🔃</span>
              Change Camera
            </button>
          )}
        </div>
      </div>
    </Page>
  );
};
