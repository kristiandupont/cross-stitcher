import React, { useState } from "react";
import PaletteSelector from "./PaletteSelector";
import Grid from "./Grid";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import PdfRenderer from "./PdfRenderer";

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
]; // Example colors

const App = () => {
  // Initialize grid data (50x50 cells, all null initially)
  const initialGridData = Array(50)
    .fill(null)
    .map(() => Array(50).fill(null));

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
    <div className="app-container">
      {/* Palette Selector Component */}
      {/* Pass palette and a function to modify it */}
      <PaletteSelector
        palette={palette}
        setPalette={setPalette}
        selectedIndex={selectedColorIndex}
        setSelectedIndex={setSelectedColorIndex}
      />

      {/* Slider to adjust brush size */}
      <div className="brush-size-slider">
        <input
          type="range"
          id="brushSize"
          min="0.5"
          max="12"
          step={0.1}
          value={brushSize}
          onChange={handleBrushSizeChange}
        />
        <label htmlFor="brushSize">Brush Size: {brushSize}</label>
      </div>

      {/* Grid Component */}
      {/* Pass grid data and a function to update the grid */}
      <Grid
        gridData={gridData}
        updateGridCell={updateGridCell}
        palette={palette}
        selectedColorIndex={selectedColorIndex}
        brushSize={brushSize}
      />

      {/* Lazy PDFDownloadLink */}
      <PDFDownloadLink
        document={<PdfRenderer gridData={gridData} palette={palette} />}
        fileName="cross-stitch-pattern.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download PDF"
        }
      </PDFDownloadLink>
    </div>
  );
};

export default App;
