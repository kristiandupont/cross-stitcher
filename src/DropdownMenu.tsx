import { Menu, Transition } from "@headlessui/react";
import {
  ArrowsPointingInIcon,
  ChevronDownIcon,
  CogIcon,
  FolderOpenIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { pdf } from "@react-pdf/renderer";
import { type FC, Fragment, useState } from "react";

import type { GridData } from "./App";
import PdfRenderer from "./PdfRenderer";
import SaveIcon from "./SaveIcon";

const MenuItem: FC<{ onClick: () => void; children: React.ReactNode }> = ({
  onClick,
  children,
}) => (
  <Menu.Item>
    {({ active }) => (
      <button className="w-full" onClick={onClick}>
        <div
          className={`${
            active ? "bg-violet-500 text-white" : "text-gray-900"
          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
        >
          {children}
        </div>
      </button>
    )}
  </Menu.Item>
);

function saveAs(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

const DropdownMenu: FC<{
  gridData: GridData;
  setGridData: (gridData: GridData) => void;
  palette: string[];
  setPalette: (palette: string[]) => void;
}> = ({ gridData, setGridData, palette, setPalette }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    setTimeout(async () => {
      const pdfBlob = await pdf(
        <PdfRenderer gridData={gridData} palette={palette} />
      ).toBlob();
      saveAs(pdfBlob, "cross-stitch.pdf");
      setIsGeneratingPdf(false);
    }, 0);
  };

  const handleSave = () => {
    const data = { gridData, palette };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    saveAs(blob, "cross-stitch.json");
  };

  const handleLoad = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          if (typeof content === "string") {
            const data = JSON.parse(content);
            if (
              Array.isArray(data.gridData) &&
              Array.isArray(data.palette) &&
              data.gridData.every((row: any) => Array.isArray(row))
            ) {
              // Check if the loaded data is valid
              // and set the grid data and palette state
              setGridData(data.gridData);
              setPalette(data.palette);
            } else {
              console.error("Invalid data");
            }
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
          Options
          {isGeneratingPdf ? (
            <CogIcon className="animate-spin -mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100" />
          ) : (
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <MenuItem onClick={handleSave}>
              <SaveIcon /> Save
            </MenuItem>

            <MenuItem onClick={handleLoad}>
              <FolderOpenIcon className="mr-2 h-5 w-5" /> Load
            </MenuItem>

            <MenuItem onClick={handleDownloadPDF}>
              <PrinterIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
            </MenuItem>

            <MenuItem onClick={() => {}}>
              <ArrowsPointingInIcon className="mr-2 h-5 w-5" /> Crop
            </MenuItem>

            {/* Separator */}
            <hr className="my-1" />

            <MenuItem
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              <TrashIcon className="mr-2 h-5 w-5" /> Clear
            </MenuItem>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropdownMenu;
