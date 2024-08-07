import { type FC, useState } from "react";

import PaletteEditor from "./PaletteEditor";

const PaletteSelector: FC<{
  palette: string[];
  setPalette: (palette: string[]) => void;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
}> = ({ palette, setPalette, selectedIndex, setSelectedIndex }) => {
  const [paletteEditorVisible, setPaletteEditorVisible] = useState(false);

  return (
    <>
      <PaletteEditor
        isVisible={paletteEditorVisible}
        onClose={() => setPaletteEditorVisible(false)}
        palette={palette}
        setPalette={setPalette}
        initialEditingIndex={selectedIndex}
      />
      <div className="flex flex-col items-center space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div
            className={`size-9 cursor-pointer rounded bg-white outline-offset-1 outline-red-500 drop-shadow ${
              selectedIndex === null ? "outline" : ""
            }`}
            onClick={() => setSelectedIndex(null)}
          >
            <svg className="size-full" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="#888"
                strokeWidth="0.5"
                d="M0 0 24 24 M0 24 24 0"
              />
            </svg>
          </div>
          {palette.map((color, index) => (
            <div
              key={index}
              className={`size-9 cursor-pointer rounded outline-offset-1 outline-red-500 drop-shadow ${
                selectedIndex === index ? "outline" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
        <div className="flex w-full flex-col items-center">
          <button
            className="flex w-full flex-col items-center justify-center rounded-lg bg-white/70 py-2"
            onClick={() => setPaletteEditorVisible(true)}
          >
            Change...
          </button>
        </div>
      </div>
    </>
  );
};

export default PaletteSelector;
