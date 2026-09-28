import "./remove-background.css";
import { Page } from "@/components/page/page";
import { useRemoveBackground } from "@/hooks/use-remove-background/use-remove-background";
import { Loading } from "@/components/loading/loading";
import { useState } from "react";
import { randomUUID } from "@/utils/utils";
import { Dropzone } from "./dropzone";
import ImagePreviewModal from "./image-viewer";

type ItemStatus = "processing" | "done" | "error";

type ProcessingItem = {
  id: string;
  file: File;
  originalUrl: string;
  status: ItemStatus;
  resultUrl?: string;
  downloadName?: string;
  error?: string;
};

const errorDetail = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

type ImageCardProps = {
  item: ProcessingItem;
  onPreview: () => void;
  onRetry: () => void;
};

const ImageCard = ({ item, onPreview, onRetry }: ImageCardProps) => {
  const isDone = item.status === "done";

  return (
    <div className="rb-card">
      <button
        type="button"
        className="rb-thumb rb-checkerboard"
        onClick={isDone ? onPreview : undefined}
        disabled={!isDone}
      >
        <img
          src={isDone ? item.resultUrl : item.originalUrl}
          alt={item.file.name}
          className={`rb-thumb-img${item.status === "processing" ? " is-dimmed" : ""}`}
        />
        {item.status === "processing" && (
          <div className="rb-thumb-overlay">
            <Loading />
          </div>
        )}
        {item.status === "error" && (
          <div className="rb-thumb-overlay rb-thumb-overlay-error">⚠️</div>
        )}
      </button>
      <div className="rb-card-body">
        <p className="rb-card-name" title={item.file.name}>
          {item.file.name}
        </p>
        {item.status === "processing" && (
          <span className="rb-status rb-status-processing">Removing background…</span>
        )}
        {isDone && (
          <div className="rb-card-actions">
            <a
              href={item.resultUrl}
              download={item.downloadName}
              className="btn btn-primary btn-sm"
            >
              Download
            </a>
            <button type="button" className="btn btn-outline btn-sm" onClick={onPreview}>
              View
            </button>
          </div>
        )}
        {item.status === "error" && (
          <div className="rb-card-error">
            <span className="rb-status rb-status-error">Couldn't remove the background</span>
            <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
              Try again
            </button>
            {item.error && (
              <details className="rb-error-details">
                <summary>Details</summary>
                {item.error}
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const RemoveBackground = () => {
  const { removeBackground, isLoading, progress } = useRemoveBackground();
  const [items, setItems] = useState<ProcessingItem[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const updateItem = (id: string, patch: Partial<ProcessingItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const processItem = async (item: ProcessingItem, forceRetry = false) => {
    try {
      const result = await removeBackground({ file: item.file, forceRetry });

      if (!result) return;

      updateItem(item.id, {
        status: "done",
        resultUrl: result.url,
        downloadName: result.name,
        error: undefined,
      });
    } catch (error) {
      updateItem(item.id, { status: "error", error: errorDetail(error) });
    }
  };

  const addFiles = async (files: FileList | File[]) => {
    const newItems: ProcessingItem[] = Array.from(files).map((file) => ({
      id: randomUUID(),
      file,
      originalUrl: URL.createObjectURL(file),
      status: "processing",
    }));

    if (!newItems.length) return;

    setItems((prev) => [...newItems, ...prev]);

    for (const item of newItems) {
      await processItem(item);
    }
  };

  const retryItem = (id: string) => {
    const item = items.find((it) => it.id === id);

    if (!item) return;

    updateItem(id, { status: "processing", error: undefined });
    processItem({ ...item, status: "processing" }, true);
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const clipboardItems = event.clipboardData?.items;

    if (!clipboardItems) return;

    const files = Array.from(clipboardItems)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);

    if (files.length) await addFiles(files);
  };

  const previewItem = items.find((item) => item.id === previewId && item.status === "done");
  const isDownloadingModel = isLoading && progress?.toLowerCase().includes("download");

  return (
    <Page
      onPaste={handlePaste}
      name="Remove Background"
      description="Drop an image, paste one, or choose a file — everything happens in your browser."
    >
      <div className="rb-page">
        <Dropzone onFiles={addFiles} />
        {isDownloadingModel && (
          <div className="rb-model-status">
            <Loading />
            <span>Setting up the model, this only happens once — {progress}</span>
          </div>
        )}
        {items.length === 0 ? (
          <div className="rb-empty">No images yet — drop one above to get started.</div>
        ) : (
          <div className="rb-grid">
            {items.map((item) => (
              <ImageCard
                key={item.id}
                item={item}
                onPreview={() => setPreviewId(item.id)}
                onRetry={() => retryItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>
      {previewItem?.resultUrl && (
        <ImagePreviewModal
          src={previewItem.resultUrl}
          alt={previewItem.file.name}
          download={previewItem.downloadName ?? previewItem.file.name}
          onClose={() => setPreviewId(null)}
        />
      )}
    </Page>
  );
};
