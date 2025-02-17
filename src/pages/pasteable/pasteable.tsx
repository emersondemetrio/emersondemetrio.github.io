import "react";
import { Page } from "@/components/page/page";
import { usePasteable } from "./hooks/use-pasteable";

export const Pasteable = () => {
  const { image, error, isLoading, handlePaste, clearImage } = usePasteable();

  return (
    <Page
      name="Pasteable"
      description="Paste images to see and download them"
      onPaste={handlePaste}
    >
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">
            {isLoading ? "Processing..." : "Paste an image (Ctrl+V)"}
          </h2>
          {error && <p className="text-red-500">Error: {error}</p>}
        </div>

        {image
          ? (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.fileName}
                  className="w-full max-h-[70vh] object-contain"
                />
                <div className="p-2 flex justify-between items-center bg-slate-50">
                  <span className="text-sm text-gray-500 truncate">
                    {image.fileName}
                  </span>
                  <button
                    onClick={clearImage}
                    className="btn btn-error btn-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )
          : (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-12">
              <div className="text-center text-slate-500">
                No image pasted yet
              </div>
            </div>
          )}
      </div>
    </Page>
  );
};
