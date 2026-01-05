import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

interface IUseKeyPress {
  keys: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (event: { key: string }) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any;
  isCombinedWithCtrl?: boolean;
}

export const useKeyPress = ({
  keys,
  callback,
  node,
  isCombinedWithCtrl,
}: IUseKeyPress) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: { key: string; metaKey: boolean }) => {
      if (
        isCombinedWithCtrl &&
        event.metaKey &&
        keys.some((key) => event.key === key)
      ) {
        return callbackRef.current(event);
      }
    },
    [isCombinedWithCtrl, keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    if (targetNode) {
      targetNode.addEventListener("keydown", handleKeyPress);
    }

    // remove the event listener
    return () => {
      if (targetNode) {
        targetNode.removeEventListener("keydown", handleKeyPress);
      }
    };
  }, [handleKeyPress, node]);
};
