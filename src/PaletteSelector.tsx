import { FC } from "react";

import ColorPicker from "./ColorPicker";

const PaletteSelector: FC<{
  palette: string[];
  setPalette: (palette: string[]) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
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
        {palette.map((color, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded drop-shadow border-2 cursor-pointer ${
              selectedIndex === index ? "border-white" : "border-transparent"
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
