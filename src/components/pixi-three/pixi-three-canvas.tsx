import { Application } from "@pixi/react";
import { type ReactNode, useRef } from "react";

import {
  PixiTextureRenderer,
  PixiTextureTunnelProvider,
} from "./pixi-texture-react";
import { ThreeRoot } from "./three-root";
import { ThreeSceneRenderer, ThreeSceneTunnelProvider } from "./three-scene";

export interface PixiThreeCanvasProps {
  className?: string;
  children?: ReactNode;
  domChildren?: ReactNode;
}

export function PixiThreeCanvas({
  className,
  children,
  domChildren,
}: PixiThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`${className} relative touch-none overflow-clip`}
    >
      <PixiTextureTunnelProvider>
        <ThreeSceneTunnelProvider>
          <Application
            resizeTo={containerRef}
            backgroundAlpha={0}
            preference="webgpu"
            resolution={2}
          >
            <PixiTextureRenderer />
            <ThreeRoot>
              <ThreeSceneRenderer />
            </ThreeRoot>
            {children}
          </Application>
        </ThreeSceneTunnelProvider>
      </PixiTextureTunnelProvider>
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto">{domChildren}</div>
      </div>
    </div>
  );
}
