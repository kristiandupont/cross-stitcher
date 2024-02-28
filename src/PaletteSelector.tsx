import type { FC } from "react";

import ColorPicker from "./ColorPicker";

const PaletteSelector: FC<{
  palette: string[];
  setPalette: (palette: string[]) => void;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
}> = ({ palette, setPalette, selectedIndex, setSelectedIndex }) => {
  const addColorToPalette = (color: string) => {
    if (color && !palette.includes(color)) {
      setPalette([...palette, color]);
    }
  };

  const handleColorChange = (color: string) => {
    addColorToPalette(color);
    setSelectedIndex(palette.length - 1);
  };

  return (
    <div className="flex flex-col space-y-4 items-center">
      <div className="grid grid-cols-3 gap-2">
        <div
          className={`w-8 h-8 rounded drop-shadow outline-red-500 outline-offset-1 cursor-pointer bg-white ${
            selectedIndex === null ? "outline" : ""
          }`}
          onClick={() => setSelectedIndex(null)}
        >
          <svg className="w-full h-full" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="#888"
              strokeWidth="0.5"
              d="M0 0 24 24 M0 24 24 0"
            />
          </svg>
        </div>
        {palette.map((color, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded drop-shadow outline-red-500 outline-offset-1 cursor-pointer ${
              selectedIndex === index ? "outline" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      <div className="flex flex-col items-center">
        <ColorPicker addColor={handleColorChange} />
      </div>
    </div>
  );
};

export default PaletteSelector;
