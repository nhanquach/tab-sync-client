import React, { memo } from "react";

import { EXTENSION_PAGE } from "../utils/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IDownLoadCardProps {
  small?: boolean;
}

const DownloadCard: React.FC<IDownLoadCardProps> = ({ small }) => {
  return (
    <Card
      className={cn(
        // Light: white/30, Dark: black/30 or zinc-900/50
        "backdrop-blur-md bg-white/30 dark:bg-black/30 border-white/20 dark:border-white/10 shadow-none",
        small ? "mx-0 my-0 border-0 bg-transparent dark:bg-transparent" : "my-1"
      )}
    >
      <CardContent className="p-4">
        <h5 className={cn("flex gap-2 mb-4 font-normal text-foreground", small ? "text-lg" : "text-xl")}>
          {small ? "Get TabSync" : "Get TabSync for"}
        </h5>

        <Button
          variant="outline"
          className={cn(
            "w-full bg-transparent border-primary text-primary hover:bg-primary/10",
            "dark:border-primary dark:text-primary dark:hover:bg-primary/20", // Explicit dark mode styles just in case
            small ? "text-xs h-8" : "text-sm h-10"
          )}
          asChild
        >
          <a href={EXTENSION_PAGE} target="_blank" rel="noopener noreferrer">
             {small ? "Chromium / Chrome" : "Chromium based browsers"}
          </a>
        </Button>

        <Button
          variant="outline"
          className={cn(
              "w-full mt-2 bg-transparent border-muted-foreground text-muted-foreground cursor-not-allowed opacity-50",
              small ? "text-xs h-8" : "text-sm h-10"
          )}
          disabled
        >
          {small ? "Firefox (WIP)" : "Firefox (comming soon...)"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default memo(DownloadCard);
