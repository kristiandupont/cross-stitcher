import clsx from "clsx";
import React, { useState } from "react";

const PaletteSelector = ({
  palette,
  setPalette,
  selectedIndex,
  setSelectedIndex,
}) => {
  const [newColor, setNewColor] = useState(""); // State to hold the new color value

  // Function to add new color to the palette
  const addColorToPalette = () => {
    if (newColor && !palette.includes(newColor)) {
      setPalette([...palette, newColor]);
      setNewColor(""); // Reset the input field
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-center">
      <div className="grid grid-cols-3 gap-2">
        {palette.map((color, index) => (
          <div
            key={index}
            className={clsx(
              "w-8 h-8 rounded drop-shadow border-2 cursor-pointer",
              selectedIndex === index ? "border-white" : "border-transparent"
            )}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      <div className="flex flex-col items-center">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className=""
        />
        <button onClick={addColorToPalette} className="">
          Add Color
        </button>
      </div>
    </div>
  );
};

export default PaletteSelector;
