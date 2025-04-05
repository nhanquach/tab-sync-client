"use client";

import { Archive, ExternalLinkIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

import { archiveTab, deleteTab } from "./actions";
import { ITab } from "../../interfaces/Tab";

const LinkActionCell = ({
  table,
  data,
  setTabList,
}: {
  table: string;
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

  const handleDelete = async () => {
    try {
      await deleteTab(data, table);
      setTabList((prev) => prev.filter((tab) => tab.id !== data.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="join w-full justify-center align-center">
      <Link
        href={data.url}
        target="_blank"
        className="btn btn-xs hover:bg-primary/70 join-item"
      >
        <ExternalLinkIcon className="h-4 w-4" />
        <span className="hidden md:block">Open</span>
      </Link>
      <button
        className="btn btn-xs hover:bg-accent/70 join-item"
        onClick={handleArchive}
      >
        <Archive className="h-4 w-4" />
        <span className="hidden md:block">Archive</span>
      </button>
      <button
        className="btn btn-xs hover:bg-error/70 join-item"
        onClick={handleDelete}
      >
        <TrashIcon className="h-4 w-4" />
        <span className="hidden md:block">Delete</span>
      </button>
    </div>
  );
};

export default LinkActionCell;
