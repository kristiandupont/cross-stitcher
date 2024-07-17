import clsx from "clsx";
import { type FC, type ReactNode, useCallback } from "react";

import type { FillType } from "./App";

const BrushButton: FC<{
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    className={clsx("flex items-center justify-center rounded p-2", {
      "bg-white/50": active,
      "bg-white/10": !active,
    })}
    onClick={onClick}
  >
    {children}
  </button>
);

const BrushEditor: FC<{
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushType: FillType;
  setBrushType: (type: FillType) => void;
}> = ({ brushSize, setBrushSize, brushType, setBrushType }) => {
  const handleBrushSizeChange = (event: { target: { value: any } }) => {
    setBrushSize(Number(event.target.value));
  };

  const activateBrush = useCallback(
    (type: FillType) => {
      setBrushType(type);
      setBrushSize(1);
    },
    [setBrushType, setBrushSize]
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-row justify-between space-x-2">
        <BrushButton
          active={brushType === "full"}
          onClick={() => activateBrush("full")}
        >
          <div className="size-3 rounded-full bg-black" />
        </BrushButton>
        <BrushButton
          active={brushType === "A"}
          onClick={() => activateBrush("A")}
        >
          <svg width="12" height="12">
            <polygon points="0,0 12,0 0,12" fill="black" />
          </svg>
        </BrushButton>
        <BrushButton
          active={brushType === "B"}
          onClick={() => activateBrush("B")}
        >
          <svg width="12" height="12">
            <polygon points="0,0 12,0 10,12" fill="black" />
          </svg>
        </BrushButton>
        <BrushButton
          active={brushType === "C"}
          onClick={() => activateBrush("C")}
        >
          <svg width="12" height="12">
            <polygon points="12,0 12,12 0,12" fill="black" />
          </svg>
        </BrushButton>
        <BrushButton
          active={brushType === "D"}
          onClick={() => activateBrush("D")}
        >
          <svg width="12" height="12">
            <polygon points="0,0 0,12 12,12" fill="black" />
          </svg>
        </BrushButton>
      </div>
      <div className="flex h-6 w-40 justify-start">
        <input
          type="range"
          className="w-40"
          id="brushSize"
          min="0.5"
          max="8"
          step={0.1}
          value={brushSize}
          onChange={handleBrushSizeChange}
          disabled={brushType !== "full"}
        />
      </div>
      <div className="flex w-40 flex-row justify-between">
        <span>Brush size:</span> <span className="font-bold">{brushSize}</span>
      </div>
    </div>
  );
};

export default BrushEditor;
