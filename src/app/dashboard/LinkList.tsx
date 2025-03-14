"use client";

import { useContext, useEffect, useOptimistic } from "react";

import LinkItem from "@components/link-item/LinkItem";
import NinjaKeysContext, {
  NinjaKeysContextType,
} from "@components/ninja-keys/context";

import { ITab } from "@interfaces/Tab";

type LinkListProps = {
  linkList: ITab[];
};

const LinkList = (props: LinkListProps) => {
  const context = useContext<NinjaKeysContextType | null>(NinjaKeysContext);

  useEffect(() => {
    context?.setLinkList(props.linkList);
  }, []);

  const [linkList, removeLink] = useOptimistic(
    props.linkList,
    (_links: ITab[], removedLink: ITab) => {
      return _links.filter((tab) => tab.id !== removedLink.id);
    }
  );

  return linkList.map((tab, index) => (
    <LinkItem key={tab.id} tab={tab} index={index} removeLink={removeLink} />
  ));
};

export default LinkList;
