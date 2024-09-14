import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { GridData } from "./App";

type Orientation = "portrait" | "landscape";

const pageSizes = {
  a4: { width: "210mm", height: "297mm", fontSize: "10mm" },
  a3: { width: "297mm", height: "420mm", fontSize: "11mm" },
};

type PageSize = keyof typeof pageSizes;

function useObjectFit(style: "cover" | "contain"): {
  ref: React.RefObject<HTMLDivElement>;
  refresh: () => void;
} {
  const ref = useRef<HTMLDivElement>(null);
  const refresh = useCallback(() => {
    console.log("REFRESH. Ref exists: ", Boolean(ref.current));
    if (!ref.current) {
      return;
    }
    const parent = ref.current.parentElement;
    if (!parent) {
      return;
    }

    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;
    const containerWidth = ref.current.clientWidth;
    const containerHeight = ref.current.clientHeight;

    let scale = 1;
    if (style === "cover") {
      scale = Math.max(
        parentWidth / containerWidth,
        parentHeight / containerHeight
      );
    } else {
      scale = Math.min(
        parentWidth / containerWidth,
        parentHeight / containerHeight
      );
    }
    console.log({ parentWidth, parentHeight, containerWidth, containerHeight });
    console.log("REFRESH. Scale: ", scale);
    ref.current.style.transform = `scale(${scale})`;
    ref.current.style.transformOrigin = "top left";
  }, [ref, style]);

  useEffect(() => {
    setTimeout(refresh, 100);

    window.addEventListener("resize", refresh);
    return () => window.removeEventListener("resize", refresh);
  }, [refresh]);
  return { ref, refresh };
}

const PrintBody: FC<{
  name: string;
  gridData: GridData;
  palette: string[];
  orientation: Orientation;
}> = ({ name, gridData, palette, orientation }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <h1 style={{ fontSize: "1.2em" }} className="font-bold">
          {name}
        </h1>
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
      </div>
      <div className="flex-grow flex flex-col mt-4">
        <div
          className="flex-grow grid gap-[1px] bg-black p-[1px]"
          style={{
            gridTemplateColumns: `repeat(${gridData[0].length}, 1fr)`,
            gridTemplateRows: `repeat(${gridData.length}, 1fr)`,
            aspectRatio: `${gridData[0].length} / ${gridData.length}`,
          }}
        >
          {gridData.flat().map((cell, index) => {
            if (cell === null) {
              return <div key={index} className="aspect-square bg-white" />;
            }
            const paletteIndex =
              typeof cell === "string" ? Number(cell.split(":")[0]) : cell;
            const color = palette[paletteIndex];
            return (
              <div
                key={index}
                className="aspect-square"
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

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
          ? pageSizes[pageSize].width
          : pageSizes[pageSize].height,
      height:
        orientation === "portrait"
          ? pageSizes[pageSize].height
          : pageSizes[pageSize].width,
      fontSize: pageSizes[pageSize].fontSize,
    }),
    [pageSize, orientation]
  );

  const { ref: printContentRef, refresh: refreshPrintContent } =
    useObjectFit("contain");

  useEffect(() => {
    refreshPrintContent();
  }, [refreshPrintContent]);

  const handlePrint = () => {
    const style = document.createElement("style");
    style.textContent = `
      @page {
        size: ${pageSize} ${orientation};
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
              <div className="h-[600px] w-[800px] overflow-hidden">
                <div
                  ref={printContentRef}
                  className="border border-gray-200 shadow overflow-hidden"
                  style={printContentStyle}
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
                    setTimeout(refreshPrintContent, 100);
                  }}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
                <select
                  value={pageSize}
                  onChange={({ target }) => {
                    setPageSize(target.value as PageSize);
                    setTimeout(refreshPrintContent, 100);
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
