import { FC, useState } from "react";

import DropdownMenu from "./DropdownMenu";
import Editor from "./Editor";
import PaletteSelector from "./PaletteSelector";

// Initial palette colors (can be modified)
const initialPalette = [
  "#1b9e77",
  "#d95f02",
  "#7570b3",
  "#e7298a",
  "#66a61e",
  "#e6ab02",
  "#a6761d",
  "#666666",
  "#ffffff",
];

export type Grid = (number | null)[][];

const App: FC = () => {
  const initialGridData = Array.from({ length: 50 })
    .fill(null)
    .map(() => Array.from({ length: 80 }).fill(null)) as Grid;

  // State for the palette and grid data
  const [palette, setPalette] = useState<string[]>(initialPalette);
  const [gridData, setGridData] = useState<Grid>(initialGridData);

  const [brushSize, setBrushSize] = useState(1); // Initialize brushSize state

  const handleBrushSizeChange = (event: { target: { value: any } }) => {
    setBrushSize(Number(event.target.value)); // Update brush size state
  };

  const [selectedColorIndex, setSelectedColorIndex] = useState(0); // State to hold the selected color index [0, palette.length]

  // Function to update grid data
  const updateGridCell = (row, col, colorIndex) => {
    const newGridData = [...gridData];
    newGridData[row][col] = colorIndex;
    setGridData(newGridData);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full">
      <nav className="flex items-center justify-between w-full p-4 bg-white/60">
        <h1 className="text-2xl font-bold">Cross Stitcher</h1>
        <DropdownMenu gridData={gridData} palette={palette} />
      </nav>

      <main className="flex flex-row items-start justify-between w-full flex-1 pt-8">
        <div className="flex-1 px-8 flex flex-col items-end justify-start">
          <div className="bg-white/30 p-4 rounded-xl flex flex-col items-center">
            <div className="h-48 w-6 flex justify-center">
              <input
                type="range"
                className="w-48"
                style={{ transform: "rotate(270deg)" }}
                id="brushSize"
                min="0.5"
                max="8"
                step={0.1}
                value={brushSize}
                onChange={handleBrushSizeChange}
              />
            </div>
            <div>{brushSize}</div>
          </div>
        </div>

        <div className="bg-white/30 p-8 rounded-xl">
          <Editor
            gridData={gridData}
            updateGridCell={updateGridCell}
            palette={palette}
            selectedColorIndex={selectedColorIndex}
            brushSize={brushSize}
          />
        </div>

        <div className="flex-1 px-8 flex flex-col items-start justify-start">
          <div className="bg-white/30 p-4 rounded-xl flex flex-col items-center">
            <PaletteSelector
              palette={palette}
              setPalette={setPalette}
              selectedIndex={selectedColorIndex}
              setSelectedIndex={setSelectedColorIndex}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
