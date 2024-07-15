import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

import dmcColors from "./dmc-colors.json";
import Modal from "./Modal";

function colorDistance(color1: string, color2: string): number {
  const [r1, g1, b1] = color1
    .slice(1)
    .match(/.{1,2}/g)!
    .map((hex) => Number.parseInt(hex, 16));
  const [r2, g2, b2] = color2
    .slice(1)
    .match(/.{1,2}/g)!
    .map((hex) => Number.parseInt(hex, 16));

  return Math.hypot(r2 - r1, g2 - g1, b2 - b1);
}

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
    const distances = dmcColors.map((dmcColor) => ({
      color: dmcColor,
      distance: colorDistance(color, `#${dmcColor.color}`),
    }));
    distances.sort((a, b) => a.distance - b.distance);
    const closestDmcColor = distances[0];
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
          <div className="flex flex-row space-x-2 items-center justify-start">
            <button
              className="bg-gray-100 border shadow rounded-lg px-2 py-1"
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
                className="group size-6 border border-gray-100 shadow rounded-md bg-white/10 p-1 ring-1 ring-inset ring-white/15 data-[checked]:bg-white"
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
