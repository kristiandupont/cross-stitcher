import React, { useState, useRef } from "react";

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

  const handleAddColorClick = () => {
    hiddenColorInputRef.current.click(); // Simulate click on hidden color input
  };

  const handleColorChange = (e) => {
    addColorToPalette(e.target.value);
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
        <input
          type="color"
          ref={hiddenColorInputRef}
          onChange={handleColorChange}
          style={{ display: "none" }} // Hide the color input
        />
        <button onClick={handleAddColorClick} className="">
          Add Color
        </button>
      </div>
    </div>
  );
};

export default PaletteSelector;
