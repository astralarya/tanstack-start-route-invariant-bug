import { extend, useApplication } from "@pixi/react";
import {
  Container,
  type GpuTextureSystem,
  Graphics,
  RenderTexture,
  TextureSource,
} from "pixi.js";
import {
  createContext,
  type PropsWithChildren,
  type Ref,
  type RefObject,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ExternalTexture, Texture } from "three";
import { texture } from "three/tsl";
import type { TextureNode } from "three/webgpu";
import tunnel from "tunnel-rat";

import { PixiTextureContext } from "./pixi-texture-react-hooks";

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
  ref: Ref<TextureNode>;
  width: number;
  height: number;
}

export function PixiTexture({
  ref,
  children,
  width,
  height,
}: PixiTextureProps) {
  const { tunnel } = usePixiTextureTunnelContext();
  const key = useId();

  const textureRef = useRef(texture(new Texture()));

  useEffect(
    () => () => {
      textureRef.current.dispose();
    },
    [],
  );

  useImperativeHandle(ref, () => {
    return textureRef.current;
  });

  return (
    <tunnel.In>
      <PixiTextureInternal
        key={key}
        textureRef={textureRef}
        width={width}
        height={height}
      >
        {children}
      </PixiTextureInternal>
    </tunnel.In>
  );
}

interface PixiTextureInternalProps extends Omit<PixiTextureProps, "ref"> {
  textureRef: RefObject<TextureNode>;
}

function PixiTextureInternal({
  children,
  textureRef,
  width,
  height,
}: PixiTextureInternalProps) {
  const app = useApplication();
  const containerRef = useRef<Container>(null!);
  const pixiTextureRef = useRef(new RenderTexture());

  useEffect(
    () => () => {
      pixiTextureRef.current.destroy();
    },
    [],
  );

  const [mask, setMask] = useState<Graphics>();

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMask((prev) => {
      const graphics = prev ?? new Graphics();
      graphics.clear();
      graphics.rect(0, 0, width, height).fill(0xffffff);
      return graphics;
    });
    pixiTextureRef.current.destroy();
    pixiTextureRef.current = new RenderTexture({
      source: new TextureSource({ width, height }),
    });
    const gpuTexture = (
      app.app.renderer.texture as GpuTextureSystem
    ).getGpuSource(pixiTextureRef.current._source);
    textureRef.current.value.dispose();
    textureRef.current.value = new ExternalTexture(gpuTexture);
  }, [app.app.renderer.texture, height, textureRef, width]);

  function render() {
    app.app.renderer.render({
      container: containerRef.current,
      target: pixiTextureRef.current,
    });
  }

  useEffect(render);

  return (
    <PixiTextureContext value={{ render }}>
      <pixiContainer ref={containerRef} mask={mask}>
        {children}
      </pixiContainer>
    </PixiTextureContext>
  );
}
