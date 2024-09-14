import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

import dmcColors from "./dmc-colors.json";
import { matchDmcColor } from "./matchDmcColor";
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

  const color = palette[editingIndex];

  const [dmcColorId, setDmcColorId] = useState<string>("");
  const [matchesDmcColor, setMatchesDmcColor] = useState<boolean>(false);

  useEffect(() => {
    const closestDmcColor = matchDmcColor(color);
    setDmcColorId(closestDmcColor.color.id);
    setMatchesDmcColor(closestDmcColor.distance === 0);
  }, [color]);

  const applyDmcColor = () => {
    const dmcColor = dmcColors.find((dmc) => dmc.id === dmcColorId);
    if (dmcColor) {
      setColor(`#${dmcColor.color}`);
    }
  };

  return (
    <Modal isOpen={isVisible} setIsOpen={onClose} title="Edit Palette">
      <div className="flex flex-row items-start justify-between space-x-2">
        <div className="flex h-full flex-col justify-between space-y-4 ">
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
          <div className="flex flex-row items-center justify-start space-x-2">
            <button
              className="rounded-lg border bg-gray-100 px-2 py-1 shadow"
              onClick={() => setPalette([...palette, "#888888"])}
            >
              Add
            </button>
            {/* <button
              className="bg-gray-100 border shadow rounded-lg px-2 py-1"
              onClick={() =>
                setPalette(palette.filter((_, index) => index !== editingIndex))
              }
            >
              Remove
            </button> */}
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="w-44">
              DMC Color {matchesDmcColor ? "" : "(closest)"}
            </div>
            <div className="flex flex-row items-center space-x-2">
              <input
                type="text"
                className="w-16 rounded-lg border border-gray-100 bg-white/5 px-3 py-1.5 text-sm/6 shadow"
                value={dmcColorId}
                onChange={(e) => {
                  setMatchesDmcColor(false);
                  setDmcColorId(e.target.value);
                }}
              />

              <Checkbox
                checked={matchesDmcColor}
                onChange={applyDmcColor}
                className="group size-6 rounded-md border border-gray-100 bg-white/10 p-1 shadow ring-1 ring-inset ring-white/15 data-[checked]:bg-white"
              >
                <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
              </Checkbox>
            </div>
          </div>
        </div>
        <div className="">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
      </div>
    </Modal>
  );
};

export default PaletteEditor;
