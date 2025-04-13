import { Modal } from "antd";

interface ConfirmModalOptions {
  title?: string;
  content: string;
  okText?: string;
  cancelText?: string;
  okType?: "primary" | "danger" | "default";
  onOk: () => Promise<void> | void;
}

export const showConfirmModal = ({
  title = "확인",
  content,
  okText = "확인",
  cancelText = "취소",
  okType = "primary",
  onOk,
}: ConfirmModalOptions) => {
  Modal.confirm({
    title,
    content,
    okText,
    cancelText,
    okType,
    onOk,
  });
};
