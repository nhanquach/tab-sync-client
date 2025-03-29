"use client";

import { useCallback, useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Brain, Calendar, Check, Grid3X3Icon, Loader2 } from "lucide-react";

import Link from "next/link";

import { saveItem, getItem } from "../../utils/localStorage";

import { getUniqueOpenTabs, buildCategories } from "./actions";

type SimplifiedTab = {
  title: string;
  url: string;
};

const STATUS = {
  IDLE: "idle",
  GET_TABS: "getTabs",
  GET_CATEGORIES: "getCategories",
};

const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

const Categories = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [tabList, setTabList] = useState<SimplifiedTab[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);

  const getTabs = useCallback(async () => {
    try {
      setStatus(STATUS.GET_TABS);
      const { data } = await getUniqueOpenTabs();

      setTabList(data);

      setTimeout(() => {
        setStatus(STATUS.GET_CATEGORIES);
      }, 2000);

      return data;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getCategories = useCallback(async () => {
    try {
      const tabList = await getTabs();

      if (!tabList) {
        throw new Error("No tabs found");
      }

      const data = await buildCategories(tabList!);

      setCategoryList(data);
      saveItem("categories", JSON.stringify(data));
      saveItem("categoriesTime", Date.now().toString());
    } catch (error) {
      console.error(error);
    } finally {
      setStatus(STATUS.IDLE);
    }
  }, [getTabs]);

  useEffect(() => {
    const categories = getItem<string>("categories");
    const time = getItem<string>("categoriesTime") || 0;

    try {
      const parsedCategories = categories ? JSON.parse(categories) : null;

      if (
        !parsedCategories ||
        Object.keys(parsedCategories).length === 0 ||
        Date.now() - Number(time) >= oneDayInMilliseconds
      ) {
        getCategories();
      } else {
        setCategoryList(parsedCategories);
      }
    } catch (error) {
      console.error(error);
      getCategories();
    }
  }, [getCategories]);

  return (
    <div className="flex flex-col items-center justify-center mx-auto pb-6 overflow-auto w-full lg:max-w-6xl">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold mb-2 tracking-tighter flex gap-2 items-center text-left w-full">
          <Grid3X3Icon className="text-primary w-8 h-8" />
          Categories
          <div className="badge badge-soft badge-primary tracking-normal font-medium">
            Beta
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
              Rediscover your tabs{" "}
              <span className="text-primary text-md">with AI</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Our intelligent system will automatically categorize your tabs
              while keeping your data private and secure.
            </p>
          </motion.div>
        </section>
        <section className="w-full flex flex-col gap-2">
          {status !== STATUS.IDLE && (
            <progress className="progress w-16 mx-1" />
          )}

          {status === STATUS.GET_TABS && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <section className="opacity-70">
                <div className="text-center m-6">
                  <h2 className="text-3xl font-bold mb-4">How It Will Work</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our application is designed to make organization effortless
                    through AI-powered categorization.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Your visited site titles",
                      description:
                        "Your browse like normal. We can only categorize the titles of your visited sites.",
                      icon: Calendar,
                    },
                    {
                      title: "AI Categorization",
                      description:
                        "Our AI suggests relevant categories based solely on the titles of the websites you visit. We do not access the content of those sites.",
                      icon: Brain,
                    },
                    {
                      title: "Organized Results",
                      description:
                        "See your records organized in a structured manner.",
                      icon: Check,
                    },
                  ].map((step, index) => (
                    <div key={index} className="card relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                      <div className="card-body">
                        <step.icon className="h-12 w-12 text-primary mb-2" />
                        <h2 className="card-title">{step.title}</h2>
                      </div>
                      <div className="card-body">
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                      <div className="absolute bottom-4 right-4 text-primary/40">
                        <div className="text-4xl font-bold opacity-20">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {status === STATUS.GET_CATEGORIES && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-2"
            >
              <div className="text-center text-muted-foreground border-1 rounded-2xl border-base-300 p-4 max-h-69 overflow-auto">
                <div className="flex items-center gap-2 sticky top-0 backdrop-blur-2xl p-2 rounded-2xl">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Categorising your tabs...
                </div>
                <ul className="w-full text-left text-sm">
                  {tabList.map(({ title, url }: any, index) => {
                    return (
                      <motion.li
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.2,
                        }}
                        key={url}
                        className="px-2"
                      >
                        {title}
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          )}

          {status === STATUS.IDLE && Object.keys(categoryList).length > 0
            ? Object.keys(categoryList).map((key, index) => {
                const list = categoryList[key as keyof typeof categoryList];

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.5 }}
                    key={key}
                  >
                    <div
                      className="collapse collapse-arrow bg-base-100 border border-base-300"
                      key={key}
                    >
                      <input type="radio" name="category-accordion" />
                      <div className="collapse-title font-semibold">{key}</div>
                      <div className="collapse-content">
                        <ul className="list bg-base-100 rounded-box ">
                          {list.map(({ title, url }: any, index: number) => {
                            return (
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
                                  </div>
                                </li>
                              </Link>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            : null}
          {status === STATUS.IDLE && Object.keys(categoryList).length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{
                duration: 0.5,
                delay: Object.keys(categoryList).length * 0.5,
              }}
              className="text-sm text-neutral-500"
            >
              The result is based on 30 latest visited tabs. Your result will be
              cached locally for 1 day.
            </motion.div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default Categories;
