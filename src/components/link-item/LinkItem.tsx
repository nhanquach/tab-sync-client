"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { Archive, Loader2 } from "lucide-react";

import { ITab } from "../../interfaces/Tab";
import Logo from "../Logo";
import { archiveTab } from "./actions";

type TLinkItemProps = {
  tab: ITab;
  index: number;
  removeLink: (removedLink: ITab) => void;
};

const LinkItem = ({ tab, index, removeLink }: TLinkItemProps) => {
  const handleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(() => {
      removeLink(tab);
    });

    try {
      await archiveTab(tab);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Link key={tab.id} href={tab.url} target="_blank" rel="noreferrer">
      <li
        className={`list-row cursor-pointer group hover:bg-base-200 items-center w-full`}
      >
        <div className="text-2xl md:text-4xl font-thin opacity-30 tabular-nums">
          {(index + 1).toString().padStart(2, "0")}
        </div>
        <div className="group-hover:scale-125 transition-all duration-300">
          {tab.favIconUrl ? (
            <img
              className="size-6 md:size-10 rounded-box"
              src={tab.favIconUrl}
              alt="favicon"
            />
          ) : (
            <div className="size-6 md:size-10 rounded-box">
              <Logo height={40} width={40} opacity={0.2} />
            </div>
          )}
        </div>
        <div className="list-col-grow">
          <div>{tab.title}</div>
          <div className="text-xs opacity-60 line-clamp-1">
            {tab.deviceName}
          </div>
          <div className="text-xs opacity-60 line-clamp-1">{tab.url}</div>
        </div>

        <button
          className={`btn btn-xs btn-ghost hidden md:block opacity-0 group-hover:opacity-100`}
          onClick={handleArchive}
        >
          <Archive size={20} />
        </button>
      </li>
    </Link>
  );
};

export default LinkItem;
