import "react";
import * as ReactModal from "react-modal";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    backgroundColor: "#000",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    top: "50%",
    right: "50%",
    bottom: "auto",
    display: "flex",
    flex: 1,
    width: "80%",
  },
};

type ModalProps = {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({ title, visible, onClose, children }: ModalProps) => {
  return (
    <ReactModal
      isOpen={visible}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={title}
    >
      <div
        style={{
          flex: 1,
          width: "80%",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
          }}
        >
          <h2>{title}</h2>
        </div>
        {children}
        <button className="btn btn-dark" onClick={onClose}>
          close
        </button>
      </div>
    </ReactModal>
  );
};
