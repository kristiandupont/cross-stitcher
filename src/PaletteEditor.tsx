import type { FC } from "react";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

import Modal from "./Modal";

const PaletteEditor: FC<{
  isVisible: boolean;
  onClose: () => void;
  palette: string[];
  setPalette: (palette: string[]) => void;
  initialEditingIndex: number | null;
}> = ({ isVisible, onClose, palette, setPalette, initialEditingIndex }) => {
  const [editingIndex, setEditingIndex] = useState<number>(
    initialEditingIndex ?? 0
  );
  const setColor = (color: string) => {
    setPalette(palette.map((c, index) => (index === editingIndex ? color : c)));
  };

  useEffect(() => {
    setEditingIndex(initialEditingIndex ?? 0);
  }, [initialEditingIndex, isVisible]);

  return (
    <Modal isOpen={isVisible} setIsOpen={onClose} title="Edit Palette">
      <div className="flex flex-row space-x-2 items-start justify-between">
        <div className="grid grid-cols-8 gap-2">
          {palette.map((color, index) => (
            <div
              className={`size-9 cursor-pointer rounded bg-white outline-offset-1 outline-red-500 drop-shadow ${
                editingIndex === index ? "outline" : ""
              }`}
              onClick={() => setEditingIndex(index)}
              key={index}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="">
          <HexColorPicker color={palette[editingIndex]} onChange={setColor} />
        </div>
      </div>
    </Modal>
  );
};

export default PaletteEditor;
