import { randomUUID } from "@/utils/utils";

type ModalProps = {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({
  title,
  visible,
  onClose,
  children,
}: ModalProps) => {
  const modalId = randomUUID();

  return (
    <dialog id={modalId} className={visible ? "modal modal-open" : "modal"}>
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}