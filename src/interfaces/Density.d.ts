import { DENSITY } from "../utils/constants";

export type Density = (typeof DENSITY)[keyof typeof DENSITY];
