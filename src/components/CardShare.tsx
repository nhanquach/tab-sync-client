import React, { useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  ViberShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  ViberIcon,
  WhatsappIcon,
} from "react-share";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { HOME_PAGE } from "../utils/constants";

interface ICardShareProps {
  small?: boolean;
  textless?: boolean;
  borderless?: boolean;
}

const CardShare: React.FC<ICardShareProps> = ({
  small,
  textless,
  borderless,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(
      `TabSync - Sync your tabs across devices \n ${HOME_PAGE}`
    );

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const size = small ? 28 : 32;
  const shareTitle = "TabSync - Sync your tabs across devices";

  return (
    <section className={cn("share-card space-y-2", small && "small")}>
      {!textless && <h3 className="section-label">Share TabSync</h3>}
      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          !borderless && "rounded-lg border border-border p-3"
        )}
      >
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy link"
          title="Copy link"
          className="inline-flex items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          style={{ width: size, height: size }}
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
        <EmailShareButton url={HOME_PAGE} title={shareTitle}>
          <EmailIcon borderRadius={6} size={size} />
        </EmailShareButton>
        <FacebookShareButton url={HOME_PAGE} title={shareTitle}>
          <FacebookIcon borderRadius={6} size={size} />
        </FacebookShareButton>
        <LinkedinShareButton url={HOME_PAGE} title={shareTitle}>
          <LinkedinIcon borderRadius={6} size={size} />
        </LinkedinShareButton>
        <RedditShareButton url={HOME_PAGE} title={shareTitle}>
          <RedditIcon borderRadius={6} size={size} />
        </RedditShareButton>
        <TelegramShareButton url={HOME_PAGE} title={shareTitle}>
          <TelegramIcon borderRadius={6} size={size} />
        </TelegramShareButton>
        <TwitterShareButton url={HOME_PAGE} title={shareTitle}>
          <TwitterIcon borderRadius={6} size={size} />
        </TwitterShareButton>
        <ViberShareButton url={HOME_PAGE} title={shareTitle}>
          <ViberIcon borderRadius={6} size={size} />
        </ViberShareButton>
        <WhatsappShareButton url={HOME_PAGE} title={shareTitle}>
          <WhatsappIcon borderRadius={6} size={size} />
        </WhatsappShareButton>
      </div>
    </section>
  );
};

export default CardShare;
