import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { FC, ReactNode } from "react";

const Modal: FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  children: ReactNode;
}> = ({ isOpen, setIsOpen, title, children }) => (
  <Dialog
    open={isOpen}
    onClose={() => setIsOpen(false)}
    className="relative z-50"
  >
    <div className="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-700/75" />

    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
      <DialogPanel className="w-full max-w-screen-sm space-y-4 border bg-white p-6 rounded-lg shadow-xl">
        <DialogTitle className="font-bold">{title}</DialogTitle>
        {children}
        <div className="flex gap-4 justify-end">
          <button
            className="bg-gray-100 border border-gray-200 rounded w-48 h-12 shadow"
            onClick={() => setIsOpen(false)}
          >
            OK
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
);

export default Modal;
