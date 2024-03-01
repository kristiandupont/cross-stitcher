import type { FC } from "react";

import DropdownMenu from "./DropdownMenu";
import Editor from "./Editor";
import PaletteSelector from "./PaletteSelector";
import useDebouncedLocalStorageState from "./useDebouncedLocalStorageState";

const initialWidth = 78;
const initialHeight = 52;

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

const initialGridData = Array.from({ length: initialHeight })
  .fill(null)
  .map(() => Array.from({ length: initialWidth }).fill(null)) as GridData;

const ZoomSelector: FC<{ zoom: number; setZoom: (zoom: number) => void }> = ({
  zoom,
  setZoom,
}) => (
  <div className="flex flex-row justify-between space-x-2">
    {[1, 2, 3].map((z) => (
      <button
        key={z}
        className={
          (z === zoom ? "bg-white/50" : "bg-white/10") + " rounded w-8"
        }
        onClick={() => setZoom(z)}
      >
        {z}
      </button>
    ))}
  </div>
);

const BrushSizeSelector: FC<{
  brushSize: number;
  setBrushSize: (size: number) => void;
}> = ({ brushSize, setBrushSize }) => {
  const handleBrushSizeChange = (event: { target: { value: any } }) => {
    setBrushSize(Number(event.target.value));
  };

  return (
    <div>
      <div className="flex h-6 w-32 justify-start">
        <input
          type="range"
          className="w-32"
          id="brushSize"
          min="0.5"
          max="8"
          step={0.1}
          value={brushSize}
          onChange={handleBrushSizeChange}
        />
      </div>
      <div className="flex flex-row justify-between">
        <span>Brush size:</span> <span className="font-bold">{brushSize}</span>
      </div>
    </div>
  );
};

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

  const [selectedColorIndex, setSelectedColorIndex] =
    useDebouncedLocalStorageState<number | null>("selectedColorIndex", 0);

  const [zoom, setZoom] = useDebouncedLocalStorageState("zoom", 1);

  return (
    <div className="flex w-full flex-col items-center justify-between">
      <nav className="flex w-full items-center justify-between bg-white/60 p-4">
        <h1 className="text-2xl font-bold">Cross Stitcher</h1>
        <ZoomSelector zoom={zoom} setZoom={setZoom}></ZoomSelector>
        <DropdownMenu
          gridData={gridData}
          setGridData={setGridData}
          palette={palette}
          setPalette={setPalette}
        />
      </nav>

      <main className="flex w-full flex-1 flex-row items-start justify-start space-x-8 p-8">
        <div className="flex w-52 flex-col items-start justify-start">
          <div className="flex flex-col items-center space-y-8 rounded-xl bg-white/30 p-4">
            <BrushSizeSelector
              brushSize={brushSize}
              setBrushSize={setBrushSize}
            />
            <PaletteSelector
              palette={palette}
              setPalette={setPalette}
              selectedIndex={selectedColorIndex}
              setSelectedIndex={setSelectedColorIndex}
            />
          </div>
        </div>

        <div className="flex-1">
          <div
            className="overflow-auto bg-white/30"
            style={{
              width: "calc(100vw - 320px)",
              height: "calc(100vh - 132px",
            }}
          >
            <Editor
              gridData={gridData}
              setGridData={setGridData}
              palette={palette}
              selectedColorIndex={selectedColorIndex}
              brushSize={brushSize}
              zoom={zoom}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
