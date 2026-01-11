import { ITab } from "../interfaces/iTab";

export const getNextTab = (currentTab: ITab, list: ITab[]): ITab | null => {
  const currentIndex = list.findIndex((t) => t.id === currentTab.id);

  if (currentIndex === -1) {
    return null;
  }

  // Try next item
  if (currentIndex < list.length - 1) {
    return list[currentIndex + 1];
  }

  // Try previous item
  if (currentIndex > 0) {
    return list[currentIndex - 1];
  }

  // List was size 1 (or 0 but index found), so no other item to select
  return null;
};
