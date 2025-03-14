import { createContext } from "react";
import { ITab } from "../../interfaces/Tab";

export type NinjaKeysContextType = {
  linkList: ITab[];
  setLinkList: (val: ITab[]) => void;
};

const NinjaKeysContext = createContext<NinjaKeysContextType | null>(null);

export default NinjaKeysContext;
