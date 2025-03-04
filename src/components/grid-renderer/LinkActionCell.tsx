"use client";

import { Archive, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { archiveTab } from "./actions";
import { ITab } from "../../interfaces/Tab";

const LinkActionCell = ({
  data,
  setTabList,
}: {
  data: ITab;
  setTabList: React.Dispatch<React.SetStateAction<ITab[]>>;
}) => {
  const handleArchive = async () => {
    try {
      await archiveTab(data);
      setTabList((prev) => prev.filter((tab) => tab.id !== data.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="join w-full justify-center align-center">
      <button
        className="btn btn-xs hover:text-primary/70 join-item"
        onClick={handleArchive}
      >
        <Archive className="h-4 w-4" />
        <span className="hidden md:block">Archive</span>
      </button>
      <Link
        href={data.url}
        target="_blank"
        className="btn btn-xs hover:text-primary/70 join-item"
      >
        <ExternalLinkIcon className="h-4 w-4" />
        <span className="hidden md:block">Open</span>
      </Link>
    </div>
  );
};

export default LinkActionCell;
