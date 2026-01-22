import { LAYOUT } from "../utils/constants";

export type Layout = (typeof LAYOUT)[keyof typeof LAYOUT];
