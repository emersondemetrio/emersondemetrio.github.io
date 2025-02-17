import "react";
import { Page } from "@/components/page/page";
import { usePasteable } from "./hooks/use-pasteable";

export const Pasteable = () => {
  const { images, error, isLoading, handlePaste, removeImage, clearAll } = usePasteable();

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

        {images.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative border border-slate-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.fileName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-2 flex justify-between items-center bg-slate-50">
                    <span className="text-sm text-gray-500 truncate">
                      {image.fileName}
                    </span>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="btn btn-error btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button onClick={clearAll} className="btn btn-primary">
                Clear All Images
              </button>
            </div>
          </div>
        )}

        {images.length === 0 && !isLoading && (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-12">
            <div className="text-center text-slate-500">
              No images pasted yet
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};
