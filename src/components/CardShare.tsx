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
import { CheckCircleTwoTone, ContentCopyTwoTone } from "@mui/icons-material";

import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <Card
      className={cn(
        "share-card bg-transparent shadow-none backdrop-blur-sm",
        small && "small",
        borderless ? "border-0" : "border",
        small ? "mx-0 my-0" : "my-1"
      )}
    >
      <CardContent className={cn("p-4", small && "p-2")}>
        {!textless && (
          <h5
            className={cn(
              "flex gap-2 mb-4 font-normal text-foreground",
              small ? "text-lg" : "text-xl"
            )}
          >
            {small ? "Share TabSync" : "If you like TabSync, share it:"}
          </h5>
        )}
        <div
          className="flex gap-2 flex-wrap justify-evenly content-center"
        >
          <div
            className={cn(
              "cursor-pointer flex items-center justify-center rounded-xl text-white transition-colors",
              isCopied ? "bg-green-500" : "bg-primary"
            )}
            style={{
                width: small ? 45 : 50,
                height: small ? 45 : 50,
            }}
            onClick={handleCopyLink}
          >
            {isCopied ? (
              <CheckCircleTwoTone fontSize="medium" />
            ) : (
              <ContentCopyTwoTone fontSize="medium" />
            )}
          </div>
          <EmailShareButton
            url={HOME_PAGE}
            title="TabSync - Sync your tabs across devices"
          >
            <EmailIcon borderRadius={12} size={small ? 45 : 50} />
          </EmailShareButton>
          <FacebookShareButton
            url={HOME_PAGE}
            title="TabSync - Sync your tabs across devices"
          >
            <FacebookIcon borderRadius={12} size={small ? 45 : 50} />
          </FacebookShareButton>
          <LinkedinShareButton
            url={HOME_PAGE}
            title="TabSync - Sync your tabs across devices"
          >
            <LinkedinIcon borderRadius={12} size={small ? 45 : 50} />
          </LinkedinShareButton>
          <RedditShareButton
            url={HOME_PAGE}
            title="TabSync - Sync your tabs across devices"
          >
            <RedditIcon borderRadius={12} size={small ? 45 : 50} />
          </RedditShareButton>
          <TelegramShareButton
            url={HOME_PAGE}
            title="TabSync - Sync your tabs across devices"
          >
            <TelegramIcon borderRadius={12} size={small ? 45 : 50} />
          </TelegramShareButton>
          <TwitterShareButton
            url={HOME_PAGE}
            title="TabSync - Sync your tabs across devices"
          >
            <TwitterIcon borderRadius={12} size={small ? 45 : 50} />
          </TwitterShareButton>
          <ViberShareButton
            url={HOME_PAGE}
            title="TabSync - Sync your tabs across devices"
          >
            <ViberIcon borderRadius={12} size={small ? 45 : 50} />
          </ViberShareButton>
          <WhatsappShareButton
            url={HOME_PAGE}
            title="TabSync - Sync your tabs across devices"
          >
            <WhatsappIcon borderRadius={12} size={small ? 45 : 50} />
          </WhatsappShareButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardShare;
