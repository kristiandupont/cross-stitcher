import { Popover } from "@headlessui/react";
import type { FC } from "react";
import { useMemo, useState } from "react";
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
      <Popover.Button className="flex flex-col items-center justify-center rounded-lg bg-white/70 px-6 py-2">
        Change..
      </Popover.Button>
      <Popover.Panel className="absolute z-10 mt-2 flex flex-col items-center space-y-2 rounded-xl bg-white/70 p-8 shadow">
        <HexColorPicker color={color} onChange={setColor} />

        <div className="p-2 text-center">
          Closest DMC color:{" "}
          <span style={{ backgroundColor: `#${closestDmcColor.color}` }}>
            {closestDmcColor.id}
          </span>
        </div>

        <button
          className="flex w-full flex-col items-center justify-center rounded-lg bg-white/70 px-4 py-2"
          onClick={() => addColor(color)}
        >
          Add
        </button>
      </Popover.Panel>
    </Popover>
  );
};

export default ColorPicker;
