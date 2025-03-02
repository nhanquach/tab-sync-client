"use client";

import { useEffect, useState } from "react";
import Logo from "../../components/Logo";
import { createClient } from "../../utils/supabase/client";
import { TABLES } from "../../clients/constants";
import { ITab } from "../../interfaces/Tab";
import Link from "next/link";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import dayjs from "dayjs";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Links = () => {
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState<ITab[]>([]);

  const [colDefs, setColDefs] = useState([
    {
      field: "timeStamp",
      valueFormatter: (p) => dayjs(p.value).format("DD-MM-YYYY HH:mm:ss"),
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
      minWidth: 100,
      cellRenderer: (params: CustomCellRendererProps) => (
        <Link href={params.data.url} target="_blank">
          {params.value}
        </Link>
      ),
    },
    { field: "deviceName" },
  ]);

  const getTabs = async () => {
    try {
      setLoading(true);
      const supabase = await createClient();

      const { data, error, count } = await supabase
        .from(TABLES.OPEN_TABS)
        .select("*", { count: "exact" })
        .order("timeStamp", { ascending: false });

      if (error) {
        console.error(error);
      }

      setTabs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTabs();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mx-auto overflow-auto w-full h-[calc(100vh-50px)]">
      <div className="flex w-full items-center justify-between flex-col md:flex-row">
        <h1 className="text-3xl font-bold mb-2 tracking-tighter flex gap-2 items-center text-left w-full">
          <Logo className="bg-primary" />
          Links
        </h1>
        <input
          type="text"
          className="input input-bordered w-full max-w-md"
          placeholder="Search..."
        />
      </div>
      <div className="w-full flex-1 py-4">
        <AgGridReact
          loading={loading}
          rowData={tabs}
          columnDefs={colDefs}
          autoSizeStrategy={{ type: "fitCellContents" }}
        />
      </div>
    </div>
  );
};

export default Links;
