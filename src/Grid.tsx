import "./Grid.css";

import React, { useState } from "react";

const Grid = ({
  gridData,
  updateGridCell,
  palette,
  selectedColorIndex,
  brushSize,
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (row, col) => {
    setIsMouseDown(true);
    updateCells(row, col);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (row, col) => {
    if (isMouseDown) {
      updateCells(row, col);
    }
  };

  const updateCells = (row, col) => {
    // Iterate over a square area around the central cell
    for (let i = -brushSize; i <= brushSize; i++) {
      for (let j = -brushSize; j <= brushSize; j++) {
        const newRow = row + i;
        const newCol = col + j;

        // Check if the cell is within the grid boundaries
        if (
          newRow >= 0 &&
          newRow < gridData.length &&
          newCol >= 0 &&
          newCol < gridData[0].length
        ) {
          // Calculate distance from the central cell to determine if it's within the circle
          const distance = Math.sqrt(i * i + j * j);
          if (distance <= brushSize) {
            updateGridCell(newRow, newCol, selectedColorIndex);
          }
        }
      }
    }
  };

  return (
    <div
      className="grid"
      onMouseLeave={handleMouseUp} // Optional: Stops coloring when the mouse leaves the grid area
    >
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className="grid-cell"
              style={{
                backgroundColor: cell !== null ? palette[cell] : "transparent",
              }}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseUp={handleMouseUp}
              onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
