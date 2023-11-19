import { Popover } from "@headlessui/react";
import { FC, useState } from "react";
import { HexColorPicker } from "react-colorful";

const ColorPicker: FC<{
  addColor: (color: string) => void;
}> = ({ addColor }) => {
  const [color, setColor] = useState<string>("#ffffff");

  return (
    <Popover className="">
      <Popover.Button className="bg-white/70 px-4 py-2 flex flex-col items-center justify-center rounded-lg">
        Add Colors
      </Popover.Button>
      <Popover.Panel className="absolute z-10 space-y-2 mt-2 shadow bg-white/70 rounded-xl p-8 flex flex-col items-center">
        <HexColorPicker color={color} onChange={setColor} />
        <button
          className="bg-white/70 rounded-lg px-4 py-2 w-full flex flex-col items-center justify-center"
          onClick={() => addColor(color)}
        >
          Add
        </button>
      </Popover.Panel>
    </Popover>
  );
};

export default ColorPicker;
