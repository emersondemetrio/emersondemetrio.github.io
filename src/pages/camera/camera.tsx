import { Page } from '@/components/page/page';
import { useCamera } from './hooks/use-camera';
import { Modal } from '@/components/modal/modal';

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
    isLoading,
    isDownloading,
  } = useCamera();

  return (
    <Page name="Camera" className="flex flex-col">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Modal title="Downloading file" visible={isDownloading}>
        <div className="text-gray-500">Please wait...</div>
      </Modal>
      <div className="flex flex-col items-center gap-6 sm:gap-10 p-4 sm:p-6">
        {isLoading && <div className="text-gray-500">Loading...</div>}
        {!isLoading && (
          <div className="relative border border-gray-300 shadow-md p-2 sm:p-4 rounded-lg w-full max-w-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-full  transition-transform duration-300 ease-in-out"
              style={{
                transform: `${isFlipped ? 'scaleX(-1)' : 'none'}`,
              }}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <button
            onClick={flipCamera}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center gap-2"
          >
            <span>🔄</span>
            Flip View
          </button>
          {hasZoom && (
            <>
              <button
                onClick={zoomIn}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 flex items-center gap-2"
              >
                <span>🔍+</span>
                Zoom In
              </button>

              <button
                onClick={zoomOut}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center gap-2"
              >
                <span>🔍-</span>
                Zoom Out
              </button>
            </>
          )}
          <button
            onClick={download}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center gap-2"
          >
            <span>📸</span>
            Capture
          </button>
        </div>
      </div>
    </Page>
  );
};
