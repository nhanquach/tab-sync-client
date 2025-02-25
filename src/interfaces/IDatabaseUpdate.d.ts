import { ITab } from "./Tab";

export interface IDatabaseUpdatePayload {
  new: ITab;
  old: ITab;
  eventType: "UPDATE" | "DELETE";
}
