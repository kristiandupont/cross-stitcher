import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { GridData } from "./App";

type Orientation = "portrait" | "landscape";

const aspectRatios = {
  portrait: "1/1.414",
  landscape: "1.414/1",
};

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

const a4 = { width: 210, height: 297 };

const PrintBody: FC<{
  name: string;
  gridData: GridData;
  palette: string[];
  orientation: Orientation;
}> = ({ name, gridData, palette, orientation }) => {
  const { ref } = useObjectFit("contain");
  return (
    <div className="">
      <div
        className={clsx("flex", {
          "flex-col": orientation === "portrait",
          "flex-row": orientation === "landscape",
        })}
      >
        <div className="">
          <h1 className="text-2xl font-bold">{name}</h1>
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
        <div className="">
          Grid:
          <div className="flex flex-col" ref={ref}>
            {gridData.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-row">
                {row.map((cell, colIndex) => {
                  if (cell === null) {
                    return <div key={colIndex} className="size-4" />;
                  }
                  const paletteIndex =
                    typeof cell === "string"
                      ? Number(cell.split(":")[0])
                      : cell;
                  const color = palette[paletteIndex];
                  return (
                    <div
                      key={colIndex}
                      className="size-4"
                      style={{ backgroundColor: color }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type PageSize = "a4" | "a3";

const PrintDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
  name: string;
  gridData: GridData;
  palette: string[];
}> = ({ isOpen, onClose, name, gridData, palette }) => {
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");

  const { ref: printContentRef, refresh: refreshPrintContent } =
    useObjectFit("contain");

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
                  className="border border-gray-200 shadow"
                  style={{
                    width:
                      orientation === "portrait"
                        ? `${a4.width}mm`
                        : `${a4.height}mm`,
                    aspectRatio: aspectRatios[orientation],
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
                    refreshPrintContent();
                  }}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
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
        <div id="print-content" className="w-screen h-auto">
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
