import { extend, useApplication } from "@pixi/react";
import {
  type ComputeFunction,
  createPortal,
  type DomEvent,
  type RootState,
  useThree,
} from "@react-three/fiber";
import {
  type Application,
  Container,
  ExternalSource,
  Point,
  type Renderer,
  Sprite,
  Texture,
} from "pixi.js";
import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  type Ref,
  useContext,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { type RenderTargetOptions, Scene } from "three";
import { type PostProcessing } from "three/webgpu";
import tunnel from "tunnel-rat";

import { Portal } from "../three/portal";
import { useRenderTarget } from "../three/use-render-target";

extend({ Container, Sprite });

interface ThreeSceneTunnelContextValue {
  tunnel: ReturnType<typeof tunnel>;
}

const ThreeSceneTunnelContext =
  createContext<ThreeSceneTunnelContextValue | null>(null);

export function ThreeSceneTunnelProvider({ children }: PropsWithChildren) {
  return (
    <ThreeSceneTunnelContext value={{ tunnel: tunnel() }}>
      {children}
    </ThreeSceneTunnelContext>
  );
}

function useThreeSceneTunnelContext() {
  const context = useContext(ThreeSceneTunnelContext);
  if (context === null) {
    throw Error(
      "useThreeViewTunnelContext() must be called within a <ThreeViewTunnelProvider />",
    );
  }
  return context;
}

export function ThreeSceneRenderer() {
  const { tunnel } = useThreeSceneTunnelContext();
  return <tunnel.Out />;
}

export interface ThreeSceneProps {
  /** Three View Sprite Ref */
  ref?: Ref<Sprite>;
  /** Optional width of the texture, defaults to viewport bounds */
  width?: number;
  /** Optional height of the texture, defaults to viewport bounds */
  height?: number;
  /** Optional RenderTarget options */
  options?: RenderTargetOptions;
  /** Optional render priority, defaults to 0 */
  renderPriority?: number;
  /** Optional event priority, defaults to 0 */
  eventPriority?: number;
  /** Optional frame count, defaults to Infinity. If you set it to 1, it would only render a single frame, etc */
  frames?: number;
  /** Optional event compute, defaults to undefined */
  compute?: ComputeFunction;
  /** Optional post processing factory, defaults to undefined */
  postProcessing?: (x: RootState) => PostProcessing;
  /** Children will be rendered into a portal */
  children: ReactNode;
}

export function ThreeScene(props: ThreeSceneProps) {
  const container = useRef<Container>(null);

  return (
    <pixiContainer ref={container}>
      <ThreeSceneSprite
        {...props}
        ref={(sprite) => {
          if (!sprite || !container.current) {
            return;
          }
          container.current.addChild(sprite);
        }}
      />
    </pixiContainer>
  );
}

export function ThreeSceneSprite(props: ThreeSceneProps) {
  const { tunnel } = useThreeSceneTunnelContext();
  const key = useId();

  const { app } = useApplication();

  return (
    <tunnel.In>
      <ThreeSceneSpriteInternal key={key} app={app} {...props} />
    </tunnel.In>
  );
}

export interface ThreeSceneSpriteInternalProps extends ThreeSceneProps {
  /** Pixi Application */
  app: Application<Renderer>;
}

function ThreeSceneSpriteInternal({
  ref,
  app,
  width,
  height,
  options,
  renderPriority = 0,
  eventPriority = 0,
  frames = Infinity,
  compute,
  postProcessing,
  children,
}: ThreeSceneSpriteInternalProps) {
  const dpr = useThree((state) => state.gl.getPixelRatio());
  const [scene] = useState(new Scene());
  const renderTarget = useRenderTarget(width, height, options);
  const sprite = useRef(
    (() => {
      const x = new Sprite();
      x.eventMode = "static";
      return x;
    })(),
  );

  function onTextureUpdate(texture: GPUTexture) {
    sprite.current.texture = new Texture({
      source: new ExternalSource({ resource: texture, resolution: dpr }),
    });
  }
  useImperativeHandle(ref, () => sprite.current, []);

  function computeFn(event: DomEvent, state: RootState) {
    const worldPos = new Point();
    app.renderer.events.mapPositionToPoint(
      worldPos,
      event.clientX,
      event.clientY,
    );
    const hit = app.renderer.events.rootBoundary.hitTest(
      worldPos.x,
      worldPos.y,
    );
    if (hit !== sprite.current) {
      return false;
    }

    const localPos = sprite.current.toLocal(worldPos);
    const bounds = sprite.current.getLocalBounds();
    const x = (localPos.x - bounds.x) / bounds.width;
    const y = (localPos.y - bounds.y) / bounds.height;

    state.raycaster.setFromCamera(
      state.pointer.set(x * 2 - 1, -(y * 2 - 1)),
      state.camera,
    );
  }

  return (
    <>
      {createPortal(
        <Portal
          frames={frames}
          renderPriority={renderPriority}
          renderTarget={renderTarget}
          onTextureUpdate={onTextureUpdate}
          postProcessing={postProcessing}
        >
          {children}
          {/* Without an element that receives pointer events state.pointer will always be 0/0 */}
          <group onPointerOver={() => null} />
        </Portal>,
        scene,
        // eslint-disable-next-line react-hooks/refs
        {
          events: { compute: compute ?? computeFn, priority: eventPriority },
        },
      )}
    </>
  );
}
