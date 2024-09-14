import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

import type { GridData } from "./App";
import logo from "./logo.png";
import { matchDmcColor } from "./matchDmcColor";

type Orientation = "portrait" | "landscape";

const pageSizes = {
  a4: { width: 210, height: 297, fontSize: "10mm", scale: 0.58, margin: 15 },
  a3: { width: 297, height: 420, fontSize: "11mm", scale: 0.4, margin: 20 },
};

type PageSize = keyof typeof pageSizes;

const isTenth = (index: number): boolean => index % 10 === 0;
const Grid: FC<{ gridData: GridData; palette: string[] }> = ({
  gridData,
  palette,
}) => {
  const centerRow = Math.floor(gridData.length / 2);
  const centerCol = Math.floor(gridData[0].length / 2);
  const rowCount = gridData.length;
  const colCount = gridData[0].length;

  const cellWidth = 625 / colCount;
  const cellHeight = 625 / rowCount;
  const cellSize = Math.min(cellWidth, cellHeight);

  return (
    <div className="flex flex-col p-[1px]">
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row">
          {row.map((cell, cellIndex) => {
            const paletteIndex =
              typeof cell === "string" ? Number(cell.split(":")[0]) : cell;
            const color =
              paletteIndex !== null ? palette[paletteIndex] : "white";
            return (
              <div
                key={cellIndex}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: color,
                  borderTop:
                    rowIndex === centerRow
                      ? "1px solid red"
                      : isTenth(rowIndex)
                        ? "1px solid black"
                        : "1px solid #E4E4E4",
                  borderLeft:
                    cellIndex === centerCol
                      ? "1px solid red"
                      : isTenth(cellIndex)
                        ? "1px solid black"
                        : "1px solid #E4E4E4",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const PrintBody: FC<{
  name: string;
  gridData: GridData;
  palette: string[];
  orientation: Orientation;
}> = ({ name, gridData, palette, orientation }) => (
  <div className="h-full flex flex-col justify-between">
    <header>
      <h1 style={{ fontSize: "1.2em" }} className="font-bold">
        {name}
      </h1>
    </header>
    <main
      className={`flex ${orientation === "portrait" ? "flex-col space-y-4" : "flex-row space-x-4"}`}
    >
      <Grid gridData={gridData} palette={palette} />
      <div className="size-full">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(1em,1fr))] gap-2">
          {palette.map((color, index) => {
            const { color: dmcColor, distance } = matchDmcColor(color);
            return (
              <div
                key={index}
                className="flex flex-row space-x-1 items-center justify-start"
              >
                <div
                  className="size-4 border border-gray-200"
                  style={{ backgroundColor: color }}
                />
                <div className="text-[0.2em]">
                  {distance === 0 ? dmcColor.id : color}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
    <footer>
      <div className="w-full flex justify-between items-end">
        <div className="text-xs text-gray-500 flex flex-col space-y-2">
          <div>Copyright &copy; NedalNeedle.</div>
          <div>
            Mønsteret er kun til privat bruk og må ikke kopieres, videreselges
            eller omfordeles.
            <br />
            Det er ikke tillatt med systematisk salg av produkter laget av dette
            mønsteret.
          </div>
        </div>
        <img src={logo} alt="logo" style={{ height: "2.5em" }} />
      </div>
    </footer>
  </div>
);

const PrintDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
  name: string;
  gridData: GridData;
  palette: string[];
}> = ({ isOpen, onClose, name, gridData, palette }) => {
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");

  const printContentStyle = useMemo(
    () => ({
      width:
        orientation === "portrait"
          ? `${pageSizes[pageSize].width - pageSizes[pageSize].margin * 2}mm`
          : `${pageSizes[pageSize].height - pageSizes[pageSize].margin * 2}mm`,
      height:
        orientation === "portrait"
          ? `${pageSizes[pageSize].height - pageSizes[pageSize].margin * 2}mm`
          : `${pageSizes[pageSize].width - pageSizes[pageSize].margin * 2}mm`,
      fontSize: pageSizes[pageSize].fontSize,
    }),
    [pageSize, orientation]
  );

  // const { ref: printContentRef, refresh: refreshPrintContent } =
  //   useObjectFit("contain");

  const handlePrint = () => {
    const style = document.createElement("style");
    style.textContent = `
      @page {
        size: ${pageSize} ${orientation};
        margin: ${pageSizes[pageSize].margin}mm;
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="relative z-50 print:hidden"
      >
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-700/75" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="m-8 w-full max-w-screen-lg space-y-4 rounded-lg border bg-white p-6 shadow-xl">
            <DialogTitle className="font-bold">Print...</DialogTitle>
            <div className="flex flex-row space-x-4 justify-between">
              <div className="h-[600px] w-[800px]">
                <div
                  className="border border-gray-200 shadow-xl"
                  style={{
                    ...printContentStyle,
                    padding: "5mm",
                    transform: `scale(${pageSizes[pageSize].scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <PrintBody
                    name={name}
                    gridData={gridData}
                    palette={palette}
                    orientation={orientation}
                  />
                </div>
              </div>
              <div className="w-64 m-4 flex flex-col space-y-4">
                <select
                  value={orientation}
                  onChange={({ target }) => {
                    setOrientation(target.value as Orientation);
                  }}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
                <select
                  value={pageSize}
                  onChange={({ target }) => {
                    setPageSize(target.value as PageSize);
                  }}
                >
                  <option value="a4">A4</option>
                  <option value="a3">A3</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="h-12 w-48 rounded border border-gray-200 bg-gray-100 shadow"
                onClick={handlePrint}
              >
                Print
              </button>
              <button
                className="h-12 w-48 rounded border border-gray-200 bg-gray-100 shadow"
                onClick={onClose}
              >
                OK
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      {createPortal(
        <div id="print-content" style={printContentStyle} className="">
          <PrintBody
            name={name}
            gridData={gridData}
            palette={palette}
            orientation={orientation}
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default PrintDialog;
