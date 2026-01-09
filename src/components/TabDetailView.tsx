import React, { useState } from "react";
import QRCode from "react-qr-code";
import {
  OpenInNew,
  ContentCopy,
  Share,
  DeleteForeverTwoTone,
  ArchiveTwoTone,
  Close,
  LaptopMacTwoTone,
  PhoneIphoneTwoTone,
  DevicesOtherTwoTone,
  WebStoriesTwoTone
} from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";

interface ITabDetailViewProps {
  tab: ITab | null;
  onClose?: () => void;
  view: TABS_VIEWS;
  onArchive?: (tab: ITab) => void;
  onDelete?: (tab: ITab) => void;
}

const TabDetailView: React.FC<ITabDetailViewProps> = ({
  tab,
  onClose,
  view,
  onArchive,
  onDelete
}) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();
  const [copySuccess, setCopySuccess] = useState(false);

  // Helper to get icon for device (Duplicated logic, consider extracting)
  const getDeviceIcon = (name: string) => {
    const lower = name.toLowerCase();
    const className = "text-md-sys-color-on-tertiary-container opacity-80";
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("laptop"))
      return <LaptopMacTwoTone className={className} fontSize="large" />;
    if (lower.includes("iphone") || lower.includes("android") || lower.includes("mobile"))
      return <PhoneIphoneTwoTone className={className} fontSize="large" />;
    return <DevicesOtherTwoTone className={className} fontSize="large" />;
  };

  const handleCopyLink = async () => {
    if (!tab) return;
    try {
      await navigator.clipboard.writeText(tab.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleShare = async () => {
    if (!tab) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: tab.title,
          text: `Check out this link: ${tab.title}`,
          url: tab.url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
        // Fallback or just copy
        handleCopyLink();
    }
  };

  // Empty State
  if (!tab) {
    return (
      <div className={cn(
        "h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center",
        "bg-md-sys-color-surface-container-low rounded-[32px] border border-md-sys-color-outline-variant/20"
      )}>
        <div className="bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container p-6 rounded-full mb-6 animate-pulse">
           <WebStoriesTwoTone style={{ fontSize: 64 }} />
        </div>
        <h3 className="text-2xl font-bold text-md-sys-color-on-surface mb-2">
          No Tab Selected
        </h3>
        <p className="text-md-sys-color-on-surface-variant max-w-xs">
          Select a tab from the list to view details, generate a QR code, or share it.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden shadow-sm",
      "bg-md-sys-color-surface rounded-[32px] md:rounded-tl-[64px] md:rounded-br-[64px] md:rounded-tr-[24px] md:rounded-bl-[24px] border border-md-sys-color-outline-variant/20"
    )}>

      {/* Header Section (Hero) */}
      <div className="relative bg-md-sys-color-tertiary-container text-md-sys-color-on-tertiary-container p-8 pb-12 overflow-hidden shrink-0">
         {/* Decorative blob */}
         <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

         {onClose && (
             <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 text-md-sys-color-on-tertiary-container hover:bg-white/20 rounded-full"
             >
                 <Close />
             </Button>
         )}

         <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit">
                    {getDeviceIcon(tab.deviceName)}
                    <span className="font-medium text-sm tracking-wide uppercase opacity-90">
                        {tab.deviceName}
                    </span>
                 </div>
                 <span className="text-xs font-medium opacity-70 bg-black/10 px-2 py-1 rounded-md">
                    {dayjs(tab.timeStamp).format("MMM D, HH:mm")}
                 </span>
            </div>

            <div className="flex gap-4 mt-2">
                <div className="shrink-0 mt-1">
                    {!showFallback ? (
                        <img
                        src={tab.favIconUrl}
                        alt="favicon"
                        className="w-16 h-16 rounded-2xl shadow-md bg-white p-2 object-contain"
                        onError={handleOnErrorImage}
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-md-sys-color-surface-container-high flex items-center justify-center shadow-md">
                            <WebStoriesTwoTone className="text-md-sys-color-primary" style={{ fontSize: 32 }} />
                        </div>
                    )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-3" title={tab.title}>
                    {tab.title}
                </h2>
            </div>
         </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-md-sys-color-surface overflow-y-auto">
        <div className="p-6 md:p-8 flex flex-col gap-8">

            {/* Main Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Button
                    size="lg"
                    className="col-span-2 bg-md-sys-color-primary text-md-sys-color-on-primary hover:bg-md-sys-color-primary/90 h-14 rounded-xl text-lg gap-2 shadow-md"
                    onClick={() => window.open(tab.url, "_blank")}
                >
                    <OpenInNew /> Open Website
                </Button>

                <Button
                    variant="outline"
                    className="h-12 rounded-xl gap-2 border-md-sys-color-outline/20 hover:bg-md-sys-color-surface-container-high"
                    onClick={handleCopyLink}
                >
                    <ContentCopy fontSize="small" /> {copySuccess ? "Copied!" : "Copy Link"}
                </Button>

                <Button
                     variant="outline"
                     className="h-12 rounded-xl gap-2 border-md-sys-color-outline/20 hover:bg-md-sys-color-surface-container-high"
                     onClick={handleShare}
                >
                    <Share fontSize="small" /> Share
                </Button>
            </div>

            <div className="h-px bg-md-sys-color-outline-variant/30 w-full" />

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center p-6 bg-md-sys-color-surface-container-lowest rounded-[24px] border border-dashed border-md-sys-color-outline/30">
                <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                    <QRCode value={tab.url} size={160} />
                </div>
                <p className="text-sm text-md-sys-color-on-surface-variant font-medium text-center break-all px-4">
                    Scan to open on mobile
                </p>
            </div>

            {/* URL Display */}
            <div className="bg-md-sys-color-surface-container p-4 rounded-xl">
                 <p className="text-xs font-bold text-md-sys-color-primary mb-1 uppercase tracking-wider">Full URL</p>
                 <p className="text-sm font-mono text-md-sys-color-on-surface-variant break-all leading-relaxed select-all">
                    {tab.url}
                 </p>
            </div>

             {/* Danger Zone (Archive/Delete) */}
             {(onArchive || onDelete) && (
                <div className="flex justify-end mt-4">
                    {view === TABS_VIEWS.OPEN_TABS && onArchive && (
                        <Button
                            variant="ghost"
                            onClick={() => onArchive(tab)}
                            className="text-md-sys-color-error hover:bg-md-sys-color-error-container/20 hover:text-md-sys-color-error gap-2 rounded-xl"
                        >
                            <ArchiveTwoTone /> Archive Tab
                        </Button>
                    )}
                    {view === TABS_VIEWS.ARCHIVED_TABS && onDelete && (
                        <Button
                            variant="ghost"
                            onClick={() => onDelete(tab)}
                            className="text-md-sys-color-error hover:bg-md-sys-color-error-container/20 hover:text-md-sys-color-error gap-2 rounded-xl"
                        >
                            <DeleteForeverTwoTone /> Delete Permanently
                        </Button>
                    )}
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default TabDetailView;
