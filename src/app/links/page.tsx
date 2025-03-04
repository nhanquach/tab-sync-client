"use client";

import { useEffect, useState } from "react";
import Logo from "../../components/Logo";
import { createClient } from "../../utils/supabase/client";
import { TABLES } from "../../clients/constants";
import { ITab } from "../../interfaces/Tab";
import Link from "next/link";

import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import dayjs from "dayjs";
import { Bookmark, LinkIcon, Loader2Icon } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import LinkActionCell from "../../components/grid-renderer/LinkActionCell";
import { useRouter, useSearchParams } from "next/navigation";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const TABS = {
  RECENT: TABLES.OPEN_TABS,
  ARCHIVED: TABLES.ARCHIVED_TABS,
};

let originTabList: ITab[] = [];

const Links = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") as string;

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    view === TABS.RECENT ? TABS.RECENT : TABS.ARCHIVED
  );

  const [tabList, setTabList] = useState<ITab[]>([]);

  const [searchString, setSearchString] = useState("");

  const getTabs = async (table = TABLES.OPEN_TABS) => {
    try {
      setLoading(true);
      const supabase = await createClient();

      const { data, error } = await supabase
        .from(table)
        .select("*", { count: "exact" })
        .limit(3)
        .order("timeStamp", { ascending: false });

      if (error) {
        console.error(error);
      }

      setTabList(data as ITab[]);
      originTabList = data as ITab[];
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    getTabs();
  }, []);

  const onTabChange = (table: string) => {
    router.push(`?view=${table}`);
    setActiveTab(table);
    getTabs(table);
  };

  const [colDefs, setColDefs] = useState([
    {
      headerName: "Time",
      field: "timeStamp",
      valueFormatter: (p) => dayjs(p.value).format("DD MMM YYYY"),
    },
    {
      field: "title",
      cellRenderer: (params: CustomCellRendererProps) => (
        <Link href={params.data.url} target="_blank">
          {params.value}
        </Link>
      ),
    },
    {
      field: "url",
      width: 100,
      cellRenderer: (params: CustomCellRendererProps) => (
        <Link href={params.data.url} target="_blank">
          {params.value}
        </Link>
      ),
    },
    { field: "deviceName" },
    {
      pinned: "right",
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClass: ["text-center", "w-full"],
      cellRenderer: LinkActionCell,
      cellRendererParams: {
        setTabList,
      },
    },
  ] as ColDef[]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);

    if (!e.target.value) {
      setTabList(originTabList);
      return;
    }

    const filteredTabList = tabList.filter((tab) => {
      return (
        tab.title.toLowerCase().includes(searchString.toLowerCase()) ||
        tab.url.toLowerCase().includes(searchString.toLowerCase())
      );
    });

    setTabList(filteredTabList);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto overflow-auto w-full h-[calc(100vh-50px)]">
      <div className="flex w-full items-center justify-between flex-col md:flex-row py-2">
        <h1 className="text-3xl font-bold mb-2 tracking-tighter flex gap-2 items-center text-left w-full">
          <Bookmark className="w-8 h-8 text-primary" />
          Links
        </h1>
        <input
          type="text"
          className="input input-bordered w-full max-w-md"
          placeholder={`Search ${
            activeTab === TABS.RECENT ? "recent tabs" : "archived tabs"
          }...`}
          value={searchString}
          onChange={handleSearch}
        />
      </div>
      <div className="flex justify-start w-full py-2">
        <div role="tablist" className="tabs tabs-box tabs-sm">
          <button
            role="tab"
            className={`tab ${activeTab === TABS.RECENT ? "tab-active" : ""}`}
            onClick={() => onTabChange(TABS.RECENT)}
          >
            {loading && activeTab === TABS.RECENT && (
              <Loader2Icon className="h-3 w-3 animate-spin mr-2" />
            )}
            Recently Opened
          </button>
          <button
            role="tab"
            className={`tab ${activeTab === TABS.ARCHIVED ? "tab-active" : ""}`}
            onClick={() => onTabChange(TABS.ARCHIVED)}
          >
            {loading && activeTab === TABS.ARCHIVED && (
              <Loader2Icon className="h-3 w-3 animate-spin mr-2" />
            )}
            Archived
          </button>
        </div>
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <span className="loading loading-ring w-32 h-32"></span>
          <span className="animate-pulse text-neutral-300">Working...</span>
        </div>
      )}
      {!loading && tabList.length === 0 && originTabList.length === 0 && (
        <div className="flex-1">
          <EmptyState />
        </div>
      )}
      {!loading && (tabList.length > 0 || originTabList.length > 0) && (
        <>
          <div className="w-full flex-1">
            <AgGridReact
              loading={loading}
              rowData={tabList}
              columnDefs={colDefs}
              autoSizeStrategy={{ type: "fitCellContents" }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Links;
