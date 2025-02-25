import dayjs from "dayjs";
import { ITab } from "../interfaces/Tab";

export const sortByTimeStamp = (a: ITab, b: ITab) => {
  return dayjs(b.timeStamp).unix() - dayjs(a.timeStamp).unix();
};
