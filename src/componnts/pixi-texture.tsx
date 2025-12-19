import { extend, useApplication } from "@pixi/react";
import { Container, type GpuTextureSystem, RenderTexture } from "pixi.js";
import {
  createContext,
  type PropsWithChildren,
  type RefObject,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react";
import { type ExternalTexture } from "three";
import tunnel from "tunnel-rat";

import { PixiTextureContext } from "./pixi-texture-context";

extend({ Container });

interface PixiTextureTunnelContextValue {
  tunnel: ReturnType<typeof tunnel>;
}

const PixiTextureTunnelContext =
  createContext<PixiTextureTunnelContextValue | null>(null);

export function PixiTextureTunnelProvider({ children }: PropsWithChildren) {
  return (
    <PixiTextureTunnelContext value={{ tunnel: tunnel() }}>
      {children}
    </PixiTextureTunnelContext>
  );
}

function usePixiTextureTunnelContext() {
  const context = useContext(PixiTextureTunnelContext);
  if (context === null) {
    throw Error(
      "usePixiTextureTunnelContext() must be called within a <PixiTextureTunnelProvider />",
    );
  }
  return context;
}

export function PixiTextureRenderer() {
  const { tunnel } = usePixiTextureTunnelContext();
  return (
    <pixiContainer renderable={false}>
      <tunnel.Out />
    </pixiContainer>
  );
}

export interface PixiTextureProps extends PropsWithChildren {
  ref: RefObject<ExternalTexture>;
}

export function PixiTexture({ ref, children }: PixiTextureProps) {
  const { tunnel } = usePixiTextureTunnelContext();
  const key = useId();
  return (
    <tunnel.In>
      <PixiTextureInternal key={key} ref={ref}>
        {children}
      </PixiTextureInternal>
    </tunnel.In>
  );
}

function PixiTextureInternal({ ref, children }: PixiTextureProps) {
  const app = useApplication();
  const containerRef = useRef<Container>(null!);
  const pixiTextureRef = useRef(new RenderTexture());

  function render() {
    if (
      pixiTextureRef.current.width !== containerRef.current.width ||
      pixiTextureRef.current.height !== containerRef.current.height
    ) {
      pixiTextureRef.current.resize(
        containerRef.current.width,
        containerRef.current.height,
      );
    }
    app.app.renderer.render({
      container: containerRef.current,
      target: pixiTextureRef.current,
    });
    const gpuTexture = (
      app.app.renderer.texture as GpuTextureSystem
    ).getGpuSource(pixiTextureRef.current._source);
    if (ref.current.sourceTexture !== gpuTexture) {
      ref.current.sourceTexture = gpuTexture;
    }
  }

  useEffect(render);

  return (
    <PixiTextureContext value={{ render }}>
      <pixiContainer ref={containerRef}>{children}</pixiContainer>
    </PixiTextureContext>
  );
}
