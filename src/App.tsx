import React, { useState } from "react";
import PaletteSelector from "./PaletteSelector";
import Grid from "./Grid";

const App = () => {
  // Initial palette colors (can be modified)
  const initialPalette = ["#FF0000", "#00FF00", "#0000FF"]; // Example colors

  // Initialize grid data (50x50 cells, all null initially)
  const initialGridData = Array(50)
    .fill(null)
    .map(() => Array(50).fill(null));

  // State for the palette and grid data
  const [palette, setPalette] = useState(initialPalette);
  const [gridData, setGridData] = useState(initialGridData);

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

      {/* Grid Component */}
      {/* Pass grid data and a function to update the grid */}
      <Grid
        gridData={gridData}
        updateGridCell={updateGridCell}
        palette={palette}
        selectedColorIndex={selectedColorIndex}
      />
    </div>
  );
};

export default App;
