import { Page } from '@/components/page/page';
import { useCamera } from './hooks/use-camera';

export const Camera = () => {
  const {
    videoRef,
    canvasRef,
    isFlipped,
    flipCamera,
    download: captureImage,
    hasZoom,
    zoomIn,
    zoomOut,
    error,
  } = useCamera();

  return (
    <Page name="Camera">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex flex-col items-center gap-10">
        <div className="relative border border-gray-300 shadow-md p-4 rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-500 transition-transform duration-300 ease-in-out"
            style={{
              transform: `${isFlipped ? 'scaleX(-1)' : 'none'}`,
            }}
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={flipCamera}
            className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition duration-300 flex items-center gap-2"
          >
            <span>🔄</span>
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
            onClick={captureImage}
            className="bg-purple-500 text-white px-4 py-1 rounded-md hover:bg-purple-600 transition duration-300 flex items-center gap-2"
          >
            <span>📸</span>
            Capture
          </button>
        </div>
      </div>
    </Page>
  );
};
