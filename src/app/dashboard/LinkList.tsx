"use client";

import { useContext, useEffect, useOptimistic } from "react";
import { motion } from "framer-motion";

import LinkItem from "components/link-item/LinkItem";
import NinjaKeysContext, {
  NinjaKeysContextType,
} from "components/ninja-keys/context";

import { ITab } from "interfaces/Tab";

type LinkListProps = {
  linkList: ITab[];
};

const LinkList = (props: LinkListProps) => {
  const context = useContext<NinjaKeysContextType | null>(NinjaKeysContext);

  useEffect(() => {
    context?.setLinkList(props.linkList);
  }, [props.linkList, context]);

  const [linkList, removeLink] = useOptimistic(
    props.linkList,
    (_links: ITab[], removedLink: ITab) => {
      return _links.filter((tab) => tab.id !== removedLink.id);
    }
  );

  return linkList.map((tab, index) => (
    <motion.div
      key={tab.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <LinkItem key={tab.id} tab={tab} index={index} removeLink={removeLink} />
    </motion.div>
  ));
};

export default LinkList;
