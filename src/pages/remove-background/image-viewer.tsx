import { Modal } from "@/components/modal/modal";
import { useState } from "react";

type ImageViewerProps = {
  src: string;
  alt: string;
  download: string;
};

const ImageViewer = ({ src, alt, download }: ImageViewerProps) => {
  const [showImage, setShowImage] = useState<boolean>(false);

  return (
    <div className="avatar">
      <div className="w-24 rounded-xl" onClick={() => setShowImage(true)}>
        <img src={src} alt={alt} />
      </div>
      <Modal
        title="Image"
        visible={showImage}
        onClose={() => setShowImage(false)}
      >
        <div className="flex flex-col items-center gap-4 card bg-base-100 w-full max-w-sm mx-auto shadow-xl p-4">
          <figure>
            <img src={src} alt={alt} />
          </figure>
          <a href={src} className="btn btn-black" download={download}>
            Download
          </a>
        </div>
      </Modal>
    </div>
  );
};

export default ImageViewer;
