import { type FC, useState } from "react";

import type { GridData } from "./App";
import Modal from "./Modal";

const SizeEditor: FC<{
  gridData: GridData;
  setGridData: (gridData: GridData) => void;
  isVisible: boolean;
  onClose: () => void;
}> = ({ gridData, setGridData, isVisible, onClose }) => {
  const [widthStr, setWidthStr] = useState<string>(
    gridData[0].length.toString()
  );
  const [heightStr, setHeightStr] = useState<string>(
    gridData.length.toString()
  );

  const handleCrop = () => {
    let minRow = gridData.length;
    let maxRow = 0;
    let minCol = gridData[0].length;
    let maxCol = 0;

    for (let i = 0; i < gridData.length; i++) {
      for (let j = 0; j < gridData[i].length; j++) {
        if (gridData[i][j] !== null) {
          minRow = Math.min(minRow, i);
          maxRow = Math.max(maxRow, i);
          minCol = Math.min(minCol, j);
          maxCol = Math.max(maxCol, j);
        }
      }
    }

    if (maxRow - minRow < 1 || maxCol - minCol < 1) {
      return;
    }

    const newGridData = gridData
      .slice(minRow, maxRow + 1)
      .map((row) => row.slice(minCol, maxCol + 1));

    setGridData(newGridData);

    setWidthStr(newGridData[0].length.toString());
    setHeightStr(newGridData.length.toString());
  };

  const resize = () => {
    const width = parseInt(widthStr, 10);
    const height = parseInt(heightStr, 10);

    if (isNaN(width) || isNaN(height) || width < 1 || height < 1) {
      return;
    }

    const newGridData = Array.from({ length: height })
      .fill(null)
      .map(() => Array.from({ length: width }).fill(null)) as GridData;

    for (let i = 0; i < Math.min(gridData.length, height); i++) {
      for (let j = 0; j < Math.min(gridData[i].length, width); j++) {
        newGridData[i][j] = gridData[i][j];
      }
    }

    setGridData(newGridData);
  };

  return (
    <Modal isOpen={isVisible} setIsOpen={onClose} title="Size">
      <div className="flex flex-col items-start justify-between space-y-2">
        <div className="flex flex-row items-center justify-between space-x-2">
          <div className="flex flex-row items-center justify-between space-x-2">
            <span>Width</span>
            <input
              className="w-16 rounded-lg border border-gray-100 bg-white/5 px-3 py-1.5 text-sm/6 shadow"
              type="text"
              value={widthStr}
              onChange={(e) => setWidthStr(e.target.value)}
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-2">
            <span>Height</span>
            <input
              className="w-16 rounded-lg border border-gray-100 bg-white/5 px-3 py-1.5 text-sm/6 shadow"
              type="text"
              value={heightStr}
              onChange={(e) => setHeightStr(e.target.value)}
            />
          </div>
          <button
            onClick={resize}
            className="rounded-lg border bg-gray-100 px-2 py-1 shadow"
          >
            Resize
          </button>
        </div>
        <div className="">
          <button
            onClick={handleCrop}
            className="rounded-lg border bg-gray-100 px-2 py-1 shadow"
          >
            Crop
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SizeEditor;
