"use client";

import { useState } from "react";
import Link from "next/link";
import { Archive, Loader2 } from "lucide-react";

import { ITab } from "../../interfaces/Tab";
import Logo from "../Logo";
import { archiveTab } from "./actions";

type TLinkItemProps = {
  tab: ITab;
  index: number;
};

const LinkItem = ({ tab, index }: TLinkItemProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsLoading(true);
      await archiveTab(tab);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <Link key={tab.id} href={tab.url} target="_blank" rel="noreferrer">
      <li
        className={`list-row cursor-pointer group hover:bg-base-200 ${
          isLoading ? "opacity-50" : ""
        }`}
      >
        <div className="text-4xl font-thin opacity-30 tabular-nums">
          {(index + 1).toString().padStart(2, "0")}
        </div>
        <div>
          {tab.favIconUrl ? (
            <img className="size-10 rounded-box" src={tab.favIconUrl} />
          ) : (
            <div className="size-10 rounded-box">
              <Logo height={40} width={40} opacity={0.2} />
            </div>
          )}
        </div>
        <div className="list-col-grow">
          <div>{tab.title}</div>
          <div className="text-xs opacity-60">{tab.url}</div>
        </div>

        <button
          className={`btn btn-sm btn-ghost invisible group-hover:visible ${
            isLoading ? "visible" : ""
          }`}
          onClick={handleArchive}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Archive />}
        </button>
      </li>
    </Link>
  );
};

export default LinkItem;
