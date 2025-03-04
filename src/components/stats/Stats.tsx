import { ArchiveIcon, FlameIcon, Laptop } from "lucide-react";
import { ITab } from "../../interfaces/Tab";
import Logo from "../Logo";
import Link from "next/link";

type StatsProps = {
  openTabs: { count: number; data: ITab[]; error?: string };
  archivedTabs: { count: number; data: ITab[]; error?: string };
  devices: { devices: string[]; error?: string };
};

const Stats = ({ openTabs, archivedTabs, devices }: StatsProps) => {
  const totalCount = openTabs.count + archivedTabs.count;

  return (
    <div className="stats w-full hidden md:flex">
      <div className="stat">
        <div className="stat-figure text-primary">
          <Logo className="bg-primary" />
        </div>
        <div className="stat-title">Total Urls</div>
        <div className="stat-value text-primary">{totalCount}</div>
        <div className="stat-desc">
          <Link href="/links">View all links</Link>
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <FlameIcon className="h-8 w-8 text-secondary" />
        </div>
        <div className="stat-title">Open Tabs</div>
        <div className="stat-value text-secondary">{openTabs.count}</div>
        <div className="stat-desc">
          <Link href="/links">View open tabs</Link>
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <ArchiveIcon className="h-8 w-8 text-secondary" />
        </div>
        <div className="stat-title">Archived Tabs</div>
        <div className="stat-value text-secondary">{archivedTabs.count}</div>
        <div className="stat-desc">
          <Link href="/links">View archived tabs</Link>
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-info">
          <Laptop className="h-8 w-8 text-info" />
        </div>
        <div className="stat-title">Devices</div>
        <div className="stat-value text-info">
          {devices.devices.length}
        </div>
        <div className="stat-desc">
          <Link href="/devices">View devices</Link>
        </div>
      </div>
    </div>
  );
};

export default Stats;
