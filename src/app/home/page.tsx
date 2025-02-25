import Logo from "../../components/Logo";
import Link from "next/link";
import { getOpenTabs, getArchivedTabs } from "./actions";

import { ExternalLink, Archive } from "lucide-react";

const Home = async () => {
  const { data: tabs, count, error } = await getOpenTabs();
  const {
    data: archivedTabs,
    error: archivedTabsError,
    count: archivedTabsCount,
  } = await getArchivedTabs();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto pb-12">
      <div className="flex justify-space-between w-full py-8 gap-8">
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
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Recently</li>

        {tabs.map((tab, index) => (
          <li className="list-row" key={tab.id}>
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

            <button className="btn btn-sm btn-ghost">
              <Link href={tab.url} target="_blank" rel="noreferrer">
                <ExternalLink />
              </Link>
            </button>
            <button className="btn btn-sm btn-ghost">
              <Archive />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
