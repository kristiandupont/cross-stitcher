import "./Editor.css";

import { FC, useMemo, useState } from "react";

import { Grid } from "./App";

const createCursor = (radius: number): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = radius * 2;
  canvas.height = radius * 2;

  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "black"; // Color of the circle
  ctx.stroke();

  return canvas.toDataURL("image/png");
};

const isTenth = (index: number): boolean => index % 10 === 0;

const Editor: FC<{
  gridData: Grid;
  updateGridCell: (row: number, col: number, colorIndex: number) => void;
  palette: string[];
  selectedColorIndex: number;
  brushSize: number;
}> = ({ gridData, updateGridCell, palette, selectedColorIndex, brushSize }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const radius = brushSize * 8;
  const cursorDataURL = useMemo(() => createCursor(radius), [brushSize]);

  // Calculate the center row and column
  const centerRow = Math.floor(gridData.length / 2);
  const centerCol = Math.floor(gridData[0].length / 2);

  const handleMouseDown = (row, col) => {
    setIsMouseDown(true);
    updateCells(row, col);
  };

  const handleMouseUp = () => setIsMouseDown(false);

  const handleMouseMove = (row, col) => {
    if (isMouseDown) {
      updateCells(row, col);
    }
  };

  const updateCells = (row, col) => {
    const min1 = Math.ceil(Math.max(brushSize, 1));

    // Iterate over a square area around the central cell
    for (let i = -min1; i <= min1; i++) {
      for (let j = -min1; j <= min1; j++) {
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
          const distance = Math.hypot(i, j);
          if (distance <= brushSize) {
            updateGridCell(newRow, newCol, selectedColorIndex);
          }
        }
      }
    }
  };

  return (
    <div
      className="flex flex-col select-none bg-white"
      style={{ cursor: `url('${cursorDataURL}') ${radius} ${radius}, auto` }}
      onMouseLeave={handleMouseUp}
      onDragStart={(e) => e.preventDefault()}
    >
      {gridData.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid-row flex ${isTenth(rowIndex) ? "tenth-row" : ""} ${
            rowIndex === centerRow ? "center-row" : ""
          }`}
        >
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`grid-cell ${isTenth(colIndex) ? "tenth-col" : ""} ${
                colIndex === centerCol ? "center-col" : ""
              }`}
              style={{
                backgroundColor: cell === null ? "transparent" : palette[cell],
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

export default Editor;
