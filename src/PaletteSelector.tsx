import React, { useState, useRef } from "react";
import ColorPicker from "./ColorPicker";

const PaletteSelector = ({
  palette,
  setPalette,
  selectedIndex,
  setSelectedIndex,
}) => {
  const hiddenColorInputRef = useRef(null); // Ref for the hidden color input

  const addColorToPalette = (color) => {
    if (color && !palette.includes(color)) {
      setPalette([...palette, color]);
    }
  };

  const handleColorChange = (color) => {
    addColorToPalette(color);
    setSelectedColorIndex(palette.length - 1);
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
