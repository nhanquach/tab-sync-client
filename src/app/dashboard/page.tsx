import Logo from "../../components/Logo";
import EmptyState from "../../components/EmptyState";

import Link from "next/link";
import { getOpenTabs, getArchivedTabs } from "./actions";

import { ExternalLink, Archive } from "lucide-react";
import LinkItem from "../../components/link-item/LinkItem";

const Home = async () => {
  const { data: tabs, count, error } = await getOpenTabs();
  const {
    data: archivedTabs,
    error: archivedTabsError,
    count: archivedTabsCount,
  } = await getArchivedTabs();

  if (!tabs) return <EmptyState />;

  return (
    <div className="flex flex-col items-center justify-center mx-auto pb-12 overflow-auto w-full lg:w-4xl">
      <div className="flex w-full items-center justify-between flex-col md:flex-row">
        <h1 className="text-3xl font-bold mb-2 tracking-tighter flex gap-2 items-center text-left w-full">
          <Logo className="bg-primary" />
          Dashboard
        </h1>
        <input
          type="text"
          className="input input-bordered w-full max-w-md"
          placeholder="Search..."
        />
      </div>
      <div className="flex justify-space-between w-full py-4 gap-8 flex-wrap">
        <div className="stats shadow flex-1">
          <div className="stat">
            <div className="stat-title">All Tabs</div>
            <div className="stat-value">{count + archivedTabsCount}</div>
          </div>
        </div>
        <div className="stats shadow flex-1">
          <div className="stat">
            <div className="stat-title">Your Synced Tabs</div>
            <div className="stat-value">{count}</div>
          </div>
        </div>
        <div className="stats shadow flex-1">
          <div className="stat">
            <div className="stat-title">Your Archived Tabs</div>
            <div className="stat-value">{archivedTabsCount}</div>
          </div>
        </div>
      </div>
      <ul className="list bg-base-100 rounded-box shadow-md w-full">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Recently</li>
        {tabs.map((tab, index) => (
          <LinkItem key={tab.id} tab={tab} index={index} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
