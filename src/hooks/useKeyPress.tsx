import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

interface IUseKeyPress {
  keys: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (event: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any;
  isCombinedWithCtrl?: boolean;
}

export const useKeyPress = ({
  keys,
  callback,
  node,
  isCombinedWithCtrl = false,
}: IUseKeyPress) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const isMatch = keys.some((key) => event.key === key);

      if (isMatch) {
        if (isCombinedWithCtrl) {
          if (event.metaKey || event.ctrlKey) {
            callbackRef.current(event);
          }
        } else {
           // Don't trigger if user is typing in an input
           const target = event.target as HTMLElement;
           const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

           if (!isInput) {
             event.preventDefault();
             callbackRef.current(event);
           }
        }
      }
    },
    [isCombinedWithCtrl, keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    if (targetNode) {
      targetNode.addEventListener("keydown", handleKeyPress as EventListener);
    }

    // remove the event listener
    return () => {
      if (targetNode) {
        targetNode.removeEventListener("keydown", handleKeyPress as EventListener);
      }
    };
  }, [handleKeyPress, node]);
};
