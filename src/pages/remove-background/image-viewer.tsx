import { Modal } from "@/components/modal/modal";

type ImagePreviewModalProps = {
  src: string;
  alt: string;
  download: string;
  onClose: () => void;
};

const ImagePreviewModal = ({ src, alt, download, onClose }: ImagePreviewModalProps) => {
  return (
    <Modal title={alt} visible onClose={onClose}>
      <div className="rb-preview">
        <div className="rb-preview-image rb-checkerboard">
          <img src={src} alt={alt} />
        </div>
        <a href={src} className="btn btn-black" download={download}>
          Download
        </a>
      </div>
    </Modal>
  );
};

export default ImagePreviewModal;
