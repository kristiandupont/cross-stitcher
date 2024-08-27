import { type FC, useState } from "react";

import Modal from "./Modal";

const BackgroundImageModal: FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => (
  <Modal isOpen={isVisible} setIsOpen={onClose} title="Size">
    <div className="flex flex-col items-start justify-between space-y-2">
      <div className="flex flex-row items-center justify-between space-x-2">
        <button
          onClick={resize}
          className="rounded-lg border bg-gray-100 px-2 py-1 shadow"
        >
          Resize
        </button>
      </div>
      <div className="">
        <button
          onClick={handleCrop}
          className="rounded-lg border bg-gray-100 px-2 py-1 shadow"
        >
          Crop
        </button>
      </div>
    </div>
  </Modal>
);

export default BackgroundImageModal;
