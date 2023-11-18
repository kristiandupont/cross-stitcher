import "./Grid.css";
import React from "react";

const Grid = ({ gridData, updateGridCell, palette, selectedColorIndex }) => {
  const handleCellClick = (row, col) => {
    // Assuming a selectedColor state in the App component that holds the currently selected color index
    // You would need to pass selectedColor and setSelectedColor as props to this component
    updateGridCell(row, col, selectedColorIndex);
  };

  return (
    <div className="grid">
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className="grid-cell"
              style={{
                backgroundColor: cell !== null ? palette[cell] : "transparent",
              }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
