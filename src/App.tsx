import { FC, useEffect, useState } from "react";

import DropdownMenu from "./DropdownMenu";
import Editor from "./Editor";
import PaletteSelector from "./PaletteSelector";

const initialWidth = 78;
const initialHeight = 112;

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

export type GridData = (number | null)[][];

function useDebouncedLocalStorageState<T>(
  key: string,
  defaultValue: T,
  delay = 500
) {
  // Retrieve initial value from local storage or use default
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue === null ? defaultValue : JSON.parse(storedValue);
  });

  // Debounce logic to update local storage
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, key, delay]);

  return [value, setValue];
}

const initialGridData = Array.from({ length: initialHeight })
  .fill(null)
  .map(() => Array.from({ length: initialWidth }).fill(null)) as GridData;

const App: FC = () => {
  // State for the palette and grid data
  const [palette, setPalette] = useDebouncedLocalStorageState(
    "palette",
    initialPalette
  );
  const [gridData, setGridData] = useDebouncedLocalStorageState(
    "gridData",
    initialGridData
  );

  const [brushSize, setBrushSize] = useDebouncedLocalStorageState(
    "brushSize",
    1
  );

  const handleBrushSizeChange = (event: { target: { value: any } }) => {
    setBrushSize(Number(event.target.value)); // Update brush size state
  };

  const [selectedColorIndex, setSelectedColorIndex] =
    useDebouncedLocalStorageState("selectedColorIndex", 0);

  // // Function to update grid data
  // const updateGridCell = (row, col, colorIndex) => {
  //   const newGridData = [...gridData];
  //   newGridData[row][col] = colorIndex;
  //   setGridData(newGridData);
  // };

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

        <div className="bg-white/30 p-8 rounded-xl max-w-[800px] max-h-[600px] overflow-auto">
          <Editor
            gridData={gridData}
            setGridData={setGridData}
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
