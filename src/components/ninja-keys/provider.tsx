'use client'

import { ReactNode, useState } from "react";
import NinjaKeysContext from "./context";
import { ITab } from "../../interfaces/Tab";

interface NinjaKeysProviderProps {
  children: ReactNode;
}
const NinjaKeysProvider = ({ children }: NinjaKeysProviderProps) => {
  const [linkList, setLinkList] = useState<ITab[]>([]);

  return (
    <NinjaKeysContext.Provider value={{ linkList, setLinkList }}>
      {children}
    </NinjaKeysContext.Provider>
  );
};

export default NinjaKeysProvider;
