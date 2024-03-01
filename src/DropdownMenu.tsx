import { Menu, Transition } from "@headlessui/react";
import {
  ArrowUturnLeftIcon,
  ChevronDownIcon,
  CogIcon,
  PrinterIcon,
} from "@heroicons/react/20/solid";
import { pdf } from "@react-pdf/renderer";
import type { FC } from "react";
import { Fragment, useState } from "react";

import type { GridData } from "./App";
import PdfRenderer from "./PdfRenderer";

const DropdownMenu: FC<{ gridData: GridData; palette: string[] }> = ({
  gridData,
  palette,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    setTimeout(async () => {
      const pdfBlob = await pdf(
        <PdfRenderer gridData={gridData} palette={palette} />
      ).toBlob();
      const url = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "cross-stitch.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
      setIsGeneratingPdf(false);
    }, 0);
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
            <Menu.Item>
              {({ active }) => (
                <button className="w-full" onClick={handleDownloadPDF}>
                  <div
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <PrinterIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                    {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
                  </div>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className="w-full"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  <div
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <ArrowUturnLeftIcon className="mr-2 h-5 w-5" />
                    Clear
                  </div>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropdownMenu;
