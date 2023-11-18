import clsx from "clsx";
import "./PaletteSelector.css";
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
    <div className="palette-selector">
      <div className="colors">
        {palette.map((color, index) => (
          <div
            key={index}
            className={clsx(
              "w-6 h-6 m-2 border-2 inline-block cursor-pointer",
              selectedIndex === index ? "border-black" : "border-white"
            )}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      <div className="add-color">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="color-picker"
        />
        <button onClick={addColorToPalette} className="add-color-btn">
          Add Color
        </button>
      </div>
    </div>
  );
};

export default PaletteSelector;
