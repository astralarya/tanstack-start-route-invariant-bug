import { createContext, useContext } from "react";

export interface PixiTextureContextValue {
  render: () => unknown;
}

export const PixiTextureContext = createContext<PixiTextureContextValue | null>(
  null,
);

export function usePixiTextureContext() {
  const context = useContext(PixiTextureContext);
  if (context === null) {
    throw Error(
      "usePixiTextureContext() must be called within a <PixiTexture />",
    );
  }
  return context;
}
