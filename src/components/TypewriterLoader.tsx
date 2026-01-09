import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterLoaderProps {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

const TypewriterLoader: React.FC<TypewriterLoaderProps> = ({
  phrases = ["Syncing tabs...", "Connecting devices...", "Almost there..."],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1500,
  className,
}) => {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex % phrases.length];

    const handleTyping = () => {
      if (isDeleting) {
        // Deleting
        setText((prev) => prev.slice(0, -1));
        if (text === "") {
          setIsDeleting(false);
          setPhraseIndex((prev) => prev + 1);
        }
      } else {
        // Typing
        setText((prev) => currentPhrase.slice(0, prev.length + 1));
        if (text === currentPhrase) {
          // Finished typing phrase, wait before deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
          return; // Return early to avoid setting the timeout below immediately
        }
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [
    text,
    isDeleting,
    phraseIndex,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <div
      className={cn(
        "font-mono text-lg font-medium text-md-sys-color-primary tracking-wide",
        className
      )}
    >
      <span>{text}</span>
      <span className="animate-pulse ml-1 inline-block w-[2px] h-[1em] bg-current align-middle"></span>
    </div>
  );
};

export default TypewriterLoader;
