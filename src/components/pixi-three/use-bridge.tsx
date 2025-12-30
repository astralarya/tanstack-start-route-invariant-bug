import { traverseFiber, useContextBridge, useFiber } from "its-fine";
import { Fragment, type PropsWithChildren, StrictMode, useMemo } from "react";

export type Bridge = React.FC<{ children?: React.ReactNode }>;

/**
 * Bridges renderer Context and StrictMode from a primary renderer.
 */
export function useBridge(): Bridge {
  const fiber = useFiber();
  const ContextBridge = useContextBridge();

  return useMemo(
    () =>
      function ThreeRoot({ children }: PropsWithChildren) {
        const strict = !!traverseFiber(
          fiber,
          true,
          (node) => node.type === StrictMode,
        );
        const Root = strict ? StrictMode : Fragment;

        return (
          <Root>
            <ContextBridge>{children}</ContextBridge>
          </Root>
        );
      },
    [fiber, ContextBridge],
  );
}
