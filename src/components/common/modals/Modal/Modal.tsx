import { Modal as BoootstrapModal, ModalProps } from "react-bootstrap";
import { CloseIcon } from "../../../../assets/icons/icons";
import "./Modal.scss";

type CommonModalProps = ModalProps & {
  title?: string;
};

const Modal = (props: CommonModalProps) => {
  const { className, children, title, onHide, ...rest } = props;
  return (
    <BoootstrapModal
      {...rest}
      onHide={onHide}
      centered
      className={`custom_modal ${className || ""}`}
    >
      <div className="modal-header">
        <h3 className="modal-title">{title}</h3>
        <button onClick={onHide} className="close_btn">
          <CloseIcon />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </BoootstrapModal>
  );
};

export default Modal;
