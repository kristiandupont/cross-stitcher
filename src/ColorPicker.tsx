import { Popover } from "@headlessui/react";
import { FC, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";

import dmcColors from "./dmc-colors.json";

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

const ColorPicker: FC<{
  addColor: (color: string) => void;
}> = ({ addColor }) => {
  const [color, setColor] = useState<string>("#ffffff");

  const closestDmcColor = useMemo(() => {
    const distances = dmcColors.map((dmcColor) => ({
      color: dmcColor,
      distance: colorDistance(color, `#${dmcColor.color}`),
    }));
    distances.sort((a, b) => a.distance - b.distance);
    return distances[0].color;
  }, [color]);

  return (
    <Popover className="">
      <Popover.Button className="bg-white/70 px-4 py-2 flex flex-col items-center justify-center rounded-lg">
        Change..
      </Popover.Button>
      <Popover.Panel className="absolute right-0 z-10 space-y-2 mt-2 shadow bg-white/70 rounded-xl p-8 flex flex-col items-center">
        <HexColorPicker color={color} onChange={setColor} />

        <div className="p-2 text-center">
          Closest DMC color:{" "}
          <span style={{ backgroundColor: `#${closestDmcColor.color}` }}>
            {closestDmcColor.id}
          </span>
        </div>

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
