import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { GridData } from "./App";

const PrintBody: FC<{ gridData: GridData; palette: string[] }> = ({
  gridData,
  palette,
}) => (
  <div>
    <h1 className="text-2xl font-bold">Cross Stitcher</h1>
    <div className="">
      Palette:
      <div className="flex flex-row space-x-2">
        {palette.map((color, index) => (
          <div
            key={index}
            className="size-8"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
    Grid:
    <div
      className="grid gap-0.5 grid-cols-10"
      style={{ columnCount: gridData[0].length }}
    >
      {gridData.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (cell === null) {
            return <div key={colIndex} className="size-4" />;
          }
          const paletteIndex =
            typeof cell === "string" ? Number(cell.split(":")[0]) : cell;
          const color = palette[paletteIndex];
          return (
            <div
              key={colIndex}
              className="size-4"
              style={{ backgroundColor: color }}
            />
          );
        })
      )}
    </div>
  </div>
);

type PageSize = "a4" | "a3";

const pageSizes: Record<PageSize, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  a3: { width: 297, height: 420 },
};

const PrintDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
  gridData: GridData;
  palette: string[];
}> = ({ isOpen, onClose, gridData, palette }) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const updateScale = () => {
      if (printContentRef.current) {
        const containerWidth = printContentRef.current.offsetWidth;
        const containerHeight = printContentRef.current.offsetHeight;
        const pageAspectRatio =
          pageSizes[pageSize].height / pageSizes[pageSize].width;
        const containerAspectRatio = containerHeight / containerWidth;

        if (pageAspectRatio > containerAspectRatio) {
          setScale(containerHeight / pageSizes[pageSize].height);
        } else {
          setScale(containerWidth / pageSizes[pageSize].width);
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [pageSize]);

  const handlePrint = () => {
    window.print();
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
          <DialogPanel className="m-8 w-full space-y-4 rounded-lg border bg-white p-6 shadow-xl">
            <DialogTitle className="font-bold">Print...</DialogTitle>
            <div className="size-full">
              <div
                className="overflow-auto border border-gray-200"
                style={{ height: "calc(80vh - 200px)" }}
              >
                <div
                  ref={printContentRef}
                  style={{
                    width: `${pageSizes[pageSize].width}px`,
                    height: `${pageSizes[pageSize].height}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    boxSizing: "border-box",
                    padding: `${Number(scale)}cm`,
                    overflow: "hidden",
                  }}
                >
                  <PrintBody gridData={gridData} palette={palette} />
                </div>
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
        <div id="print-content">
          <PrintBody gridData={gridData} palette={palette} />
        </div>,
        document.body
      )}
    </>
  );
};

export default PrintDialog;
