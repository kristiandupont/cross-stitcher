import type { FC } from "react";

import BrushEditor from "./BrushEditor";
import DropdownMenu from "./DropdownMenu";
import Editor from "./Editor";
import PaletteSelector from "./PaletteSelector";
import useDebouncedLocalStorageState from "./useDebouncedLocalStorageState";

const initialWidth = 78;
const initialHeight = 52;

// Initial palette colors (can be modified)
const initialPalette = [
  "#00A275",
  "#F44900",
  "#738CAA",
  "#DB3779",
  "#627739",
  "#FFB000",
  "#B27737",
  "#6B6766",
  "#ffffff",
];

export type FillType = "full" | "A" | "B" | "C" | "D";
export type Cell = null | number | `${number}:${FillType}`;
export type GridData = Cell[][];

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

  const [brushType, setBrushType] = useDebouncedLocalStorageState<FillType>(
    "brushType",
    "full"
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
            <BrushEditor
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              brushType={brushType}
              setBrushType={setBrushType}
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
              brushType={brushType}
              zoom={zoom}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
