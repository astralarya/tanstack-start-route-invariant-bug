import { Application } from "@pixi/react";
import { type PropsWithChildren, useRef } from "react";

import { PixiTextureRenderer, PixiTextureTunnelProvider } from "./pixi-texture";
import { ThreeScene } from "./three-scene";

export interface GameCanvasProps extends PropsWithChildren {
  className?: string;
}

export function PixiThreeCanvas({ className, children }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`${className} relative touch-none overflow-clip`}
    >
      <PixiTextureTunnelProvider>
        <Application
          resizeTo={containerRef}
          backgroundAlpha={0}
          preference="webgpu"
          resolution={2}
          clearBeforeRender={false}
        >
          <PixiTextureRenderer />
          <ThreeScene>{children}</ThreeScene>
        </Application>
      </PixiTextureTunnelProvider>
    </div>
  );
}
