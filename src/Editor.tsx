import "./Editor.css";

import type { FC } from "react";
import { createRef, useCallback, useEffect, useMemo, useState } from "react";

import type { GridData } from "./App";
import bg from "./fakkelmannen.png";

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

function brushStroke(
  gridData: GridData,
  row: number,
  col: number,
  brushSize: number,
  colorIndex: number | null
): GridData {
  const newGridData = [...gridData];
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
          newGridData[newRow][newCol] = colorIndex;
        }
      }
    }
  }

  return newGridData;
}

const Editor: FC<{
  gridData: GridData;
  setGridData: (gridData: GridData) => void;
  palette: string[];
  selectedColorIndex: number | null;
  brushSize: number;
}> = ({ gridData, setGridData, palette, selectedColorIndex, brushSize }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const radius = brushSize * 8;
  const cursorDataURL = useMemo(() => createCursor(radius), [brushSize]);

  const updateCells = (row: number, col: number) => {
    const newGridData = brushStroke(
      gridData,
      row,
      col,
      brushSize,
      selectedColorIndex
    );
    setGridData(newGridData);
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsMouseDown(true);
    updateCells(row, col);
  };

  const handleMouseUp = () => setIsMouseDown(false);

  const handleMouseMove = (row: number, col: number) => {
    if (isMouseDown) {
      updateCells(row, col);
    }
  };

  const canvasRef = useMemo(() => createRef<HTMLCanvasElement>(), []);

  const drawGrid = useCallback((gridData: GridData, palette: string[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = 8;
    const width = gridData[0].length * cellSize;
    const height = gridData.length * cellSize;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    gridData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        ctx.fillStyle = cell === null ? "transparent" : palette[cell];
        ctx.fillRect(
          colIndex * cellSize,
          rowIndex * cellSize,
          cellSize,
          cellSize
        );
      });
    });

    // Add the actual grid:
    ctx.strokeStyle = "rgba(127, 127, 127, 0.3)";
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= width; i += cellSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    for (let i = 0; i <= height; i += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    drawGrid(gridData, palette);
  }, [gridData]);

  const style = useMemo(
    () => ({
      cursor: `url('${cursorDataURL}') ${radius} ${radius}, auto`,
      backgroundImage: `url(${bg})`,
    }),
    [cursorDataURL, radius]
  );

  return (
    <canvas
      ref={canvasRef}
      className="flex flex-col select-none bg-white/50 m-8"
      style={style}
      onMouseDown={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / 8);
        const row = Math.floor(y / 8);

        handleMouseDown(row, col);
      }}
      onMouseMove={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / 8);
        const row = Math.floor(y / 8);

        handleMouseMove(row, col);
      }}
      onMouseUp={handleMouseUp}
    />
  );
};

export default Editor;
