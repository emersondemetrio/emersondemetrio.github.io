import { Page } from "@/components/page/page";
import { useCamera } from "./hooks/use-camera";
import { Modal } from "@/components/modal/modal";

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
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Modal title="Downloading file" visible={isDownloading}>
        <div className="text-gray-500">Please wait...</div>
      </Modal>
      <div className="flex flex-col items-center gap-10">
        <div className="relative border border-gray-300 shadow-md p-4 rounded-lg">
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
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={flipCamera}
            className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition duration-300 flex items-center gap-2"
          >
            <span>{isFlipped ? "⏪" : "⏩"}</span>
            Flip
          </button>
          {hasZoom && (
            <button
              onClick={zoomIn}
              className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 transition duration-300 flex items-center gap-2"
            >
              <span>🔍+</span>
              Zoom In
            </button>
          )}
          {hasZoom && (
            <button
              onClick={zoomOut}
              className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition duration-300 flex items-center gap-2"
            >
              <span>🔍-</span>
              Zoom Out
            </button>
          )}
          <button
            onClick={download}
            className="bg-purple-500 text-white px-4 py-1 rounded-md hover:bg-purple-600 transition duration-300 flex items-center gap-2"
          >
            <span>📸</span>
            Capture
          </button>
          {tracks > 1 && (
            <button
              onClick={changeTrack}
              className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-600 transition duration-300 flex items-center gap-2"
            >
              <span>🔃</span>
              Change Camera
            </button>
          )}
        </div>
      </div>
    </Page>
  );
};
