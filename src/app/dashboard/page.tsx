import Logo from "../../components/Logo";
import EmptyState from "../../components/EmptyState";

import { getOpenTabs, getArchivedTabs, getDevices } from "./actions";

import LinkItem from "../../components/link-item/LinkItem";
import Stats from "../../components/stats/Stats";

const Home = async () => {
  const openTabs = await getOpenTabs();
  const archivedTabs = await getArchivedTabs();
  const devices = await getDevices();

  const { data: tabs } = openTabs;

  if (!tabs) return <EmptyState />;

  return (
    <div className="flex flex-col items-center justify-center mx-auto pb-6 overflow-auto w-full lg:w-4xl">
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

      <div className="my-2 bg-base-200 w-full px-6 rounded-2xl">
        <Stats openTabs={openTabs} archivedTabs={archivedTabs} devices={devices} />
      </div>

      <ul className="list bg-base-100 rounded-box w-full">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Recently</li>
        {tabs.map((tab, index) => (
          <LinkItem key={tab.id} tab={tab} index={index} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
