"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  Check,
  Grid3X3Icon,
  Loader2,
  SearchIcon,
} from "lucide-react";

import ai from "../../services/gemini-service";
import { createClient } from "../../utils/supabase/client";
import Link from "next/link";

import { uniqeArray } from "../../utils/unique";

type SimplifiedTab = {
  title: string;
  url: string;
  match?: number;
};

const STATUS = {
  IDLE: "idle",
  GET_TABS: "getTabs",
  SEARCH: "search",
  NO_RESULT: "noResult",
};

const AdvanceSearch = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [tabList, setTabList] = useState<SimplifiedTab[]>([]);

  const [searchString, setSearchString] = useState("");
  const [result, setResult] = useState<SimplifiedTab[]>([]);

  const getTabs = async (table = "unique_open_tabs") => {
    try {
      setStatus(STATUS.GET_TABS);
      const supabase = await createClient();

      const { data, error } = await supabase
        .from(table)
        .select("title, url, timeStamp")
        .order("timeStamp", { ascending: false })
        .limit(30);

      if (error) {
        console.error(error);
      }

      if (data) {
        const list = uniqeArray<SimplifiedTab[]>(data, "title");
        setTabList(list);

        setTimeout(() => {
          setStatus(STATUS.IDLE);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTabs();
  }, []);

  const handleSearch = async () => {
    if (!searchString) {
      return;
    }

    let hasResult = false;

    try {
      setStatus(STATUS.SEARCH);
      const { object: data } = await ai.searchByAI({
        tabList: JSON.stringify(tabList),
        searchString,
      });

      console.log("🚀 . data:", data);

      setResult(data);
      hasResult = !!data.length;
    } catch (error) {
      console.error(error);
    } finally {
      console.log("🚀 . result:", result);
      if (!hasResult) {
        setStatus(STATUS.NO_RESULT);
      } else {
        setStatus(STATUS.IDLE);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto pb-6 overflow-auto w-full lg:max-w-6xl">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold mb-2 tracking-tighter flex gap-2 items-center text-left w-full">
          <Grid3X3Icon className="text-primary w-8 h-8" />
          Advanced Search
          <div className="badge badge-soft badge-primary tracking-normal font-medium">
            Beta {status}
          </div>
        </h1>
      </div>
      <div className="flex flex-col w-full gap-2">
        <section className="text-center p-2 mb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-4xl md:text-4xl font-bold mb-6 tracking-tight">
              Search your tabs{" "}
              <span className="text-primary text-md">with AI</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Search tabs based on what you're doing, not just what you've
              typed.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2 max-w-2xl m-auto">
              <div className="join">
                <label className="w-full input join-item">
                  <input
                    type="search"
                    placeholder="No guarantees, but it's fun to watch!"
                    required
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="btn btn-soft join-item"
                  disabled={status === STATUS.SEARCH}
                  onClick={handleSearch}
                >
                  {status === STATUS.SEARCH ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SearchIcon />
                  )}{" "}
                  with AI
                </button>
              </div>
              <p className="text-base-content opacity-70 text-sm">
                Give it a shot! Search tabs by date, title bits, what you were
                after, or even what's on the page. We'll do our best to find
                that tab – no promises, but it's always an adventure!
              </p>
            </div>
          </motion.div>
        </section>
        <section>
          {status === STATUS.NO_RESULT && result.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl opacity-60 max-w-2xl m-auto">
                Our search engine is usually pretty good, but... nope.
                <br />
                No results found.
              </h2>
            </motion.div>
          )}

          {status === STATUS.IDLE && result.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl">
                  Luckily, we found these tabs! Check it out:
                </h2>
              </motion.div>
              <ul className="list">
                {result.map(({ title, url, match }, index: number) => {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 1 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.2 * index }}
                      key={title}
                    >
                      <li className="list-item">
                        <Link
                          href={url}
                          key={title + index}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <li className="list-row hover:bg-base-200 hover:cursor-pointer">
                            <div className="list-col-grow">
                              <div>{title}</div>
                              <div className="text-xs font-semibold opacity-60 line-clamp-1">
                                {url}
                              </div>
                              <div>
                                <progress
                                  className={`progress w-32 ${
                                    Number(match) > 0.7
                                      ? "progress-success"
                                      : Number(match) > 0.3
                                      ? "progress-warning"
                                      : "progress-error"
                                  }`}
                                  value={match}
                                  max="1"
                                />
                                <span className="opacity-60 text-xs px-2">
                                  Match {(Number(match) * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </li>
                        </Link>
                      </li>
                    </motion.div>
                  );
                })}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdvanceSearch;
