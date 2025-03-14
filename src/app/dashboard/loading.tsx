import Logo from "@components/Logo";
import ReloadButton from "@components/reload-button/ReloadButton";
import Stats from "@components/stats/Stats";

const emptyData = { count: 0, data: [], error: null };

export default function Loading() {
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
          openTabs={emptyData}
          archivedTabs={emptyData}
          devices={{ devices: [], error: null }}
        />
      </div>

      <ul className="list bg-base-100 rounded-box w-full">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          <div className="flex align-center justify-between">
            <span>Recently</span>
            <ReloadButton />
          </div>
        </li>
        {Array.from({ length: 6 }).map((_, index) => (
          <li
            className="d-block p-4 my-2 rounded-md animate-pulse bg-base-300 w-full h-16 last-of-type:max-w-xl"
            key={index}
          />
        ))}
      </ul>
    </div>
  );
}
