import React, { useState } from "react";
import PaletteSelector from "./PaletteSelector";
import Grid from "./Grid";
import { PDFDownloadLink } from "@react-pdf/renderer";

import PdfRenderer from "./PdfRenderer";
import DropdownMenu from "./DropdownMenu";

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
]; // Example colors

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const initialGridData = Array(50)
    .fill(null)
    .map(() => Array(80).fill("#ffffff"));

  // State for the palette and grid data
  const [palette, setPalette] = useState(initialPalette);
  const [gridData, setGridData] = useState(initialGridData);

  const [brushSize, setBrushSize] = useState(1); // Initialize brushSize state

  const handleBrushSizeChange = (event) => {
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
        <h1 className="text-2xl font-bold">Cross Stitch Pattern Maker</h1>
        <DropdownMenu />
      </nav>

      <main className="flex flex-row items-center justify-between w-full flex-1 pt-8">
        <div className="w-64 p-8 flex flex-col items-start justify-start">
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
          <Grid
            gridData={gridData}
            updateGridCell={updateGridCell}
            palette={palette}
            selectedColorIndex={selectedColorIndex}
            brushSize={brushSize}
          />
        </div>

        <div className="w-64 p-8 flex flex-col items-end justify-start">
          <div className="bg-white/30 p-4 rounded-xl flex flex-col items-center">
            <PaletteSelector
              palette={palette}
              setPalette={setPalette}
              selectedIndex={selectedColorIndex}
              setSelectedIndex={setSelectedColorIndex}
            />
          </div>
        </div>

        {/* <button onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
        {menuOpen && (
          <div className="menu">
            <PDFDownloadLink
              document={<PdfRenderer gridData={gridData} palette={palette} />}
              fileName="cross-stitch-pattern.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? "Loading document..." : "Download PDF"
              }
            </PDFDownloadLink>
          </div>
        )} */}
      </main>
    </div>
  );
};

export default App;
