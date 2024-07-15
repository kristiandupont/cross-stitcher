import clsx from "clsx";
import type { FC, ReactNode } from "react";

const BrushButton: FC<{
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    className={clsx("p-2 flex items-center justify-center rounded", {
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
}> = ({ brushSize, setBrushSize }) => {
  const handleBrushSizeChange = (event: { target: { value: any } }) => {
    setBrushSize(Number(event.target.value));
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-row space-x-2 justify-between">
        <BrushButton
          active={brushSize === 0.5}
          onClick={() => setBrushSize(0.5)}
        >
          <div className="size-3 bg-black rounded-full" />
        </BrushButton>
        <BrushButton active={brushSize === 1} onClick={() => setBrushSize(1)}>
          <svg width="12" height="12">
            <polygon points="0,0 12,0 0,12" fill="black" />
          </svg>
        </BrushButton>
        <BrushButton active={brushSize === 1} onClick={() => setBrushSize(1)}>
          <svg width="12" height="12">
            <polygon points="0,0 12,0 10,12" fill="black" />
          </svg>
        </BrushButton>
        <BrushButton active={brushSize === 1} onClick={() => setBrushSize(1)}>
          <svg width="12" height="12">
            <polygon points="12,0 12,12 0,12" fill="black" />
          </svg>
        </BrushButton>
        <BrushButton active={brushSize === 1} onClick={() => setBrushSize(1)}>
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
        />
      </div>
      <div className="flex flex-row justify-between w-40">
        <span>Brush size:</span> <span className="font-bold">{brushSize}</span>
      </div>
    </div>
  );
};

export default BrushEditor;
