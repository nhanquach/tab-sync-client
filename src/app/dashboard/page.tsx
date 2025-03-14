import Logo from "components/Logo";
import EmptyState from "components/EmptyState";

import { getOpenTabs, getArchivedTabs, getDevices } from "./actions";

import Stats from "components/stats/Stats";
import ReloadButton from "components/reload-button/ReloadButton";
import LinkList from "./LinkList";

// Fetches all the data needed for the dashboard in parallel
const getData = async () => {
  const [openTabs, archivedTabs, devices] = await Promise.all([
    getOpenTabs(),
    getArchivedTabs(),
    getDevices(),
  ]);

  return { openTabs, archivedTabs, devices };
};

const Home = async () => {
  const { openTabs, archivedTabs, devices } = await getData();

  const { data: tabs } = openTabs;

  if (!tabs) return <EmptyState />;

  return (
    <div className="flex flex-col items-center justify-center mx-auto pb-6 overflow-auto w-full lg:w-4xl">
      <div className="flex w-full items-center justify-between flex-col md:flex-row">
        <h1 className="text-3xl font-bold mb-2 tracking-tighter flex gap-2 items-center text-left w-full">
          <Logo className="bg-primary" />
          Dashboard
        </h1>
      </div>

      <div className="my-2 bg-base-200 w-full px-6 rounded-2xl">
        <Stats
          openTabs={openTabs}
          archivedTabs={archivedTabs}
          devices={devices}
        />
      </div>

      <ul className="list bg-base-100 rounded-box w-full overflow-hidden">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          <div className="flex align-center justify-between">
            <span>Recently</span>
            <ReloadButton />
          </div>
        </li>
        <LinkList linkList={tabs} />
      </ul>
    </div>
  );
};

export default Home;

export const dynamic = "force-dynamic";
