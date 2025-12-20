import { useApplication } from "@pixi/react";
import {
  type ConstructorRepresentation,
  createRoot,
  events,
  extend,
  type ReconcilerRoot,
  type RootState,
  type ThreeToJSXElements,
  unmountComponentAtNode,
} from "@react-three/fiber";
import { useContextBridge } from "its-fine";
import { type WebGPURenderer as PixiWebGPURenderer } from "pixi.js";
import {
  type PropsWithChildren,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { WebGPURenderer } from "three/webgpu";
import * as THREE from "three/webgpu";

extend(THREE as unknown as ConstructorRepresentation);

declare module "@react-three/fiber" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

export interface ThreeSceneProps extends PropsWithChildren {
  eventSource?: RefObject<HTMLElement | null>;
}

export function ThreeScene({ children, eventSource }: ThreeSceneProps) {
  const Bridge = useContextBridge();
  const pixi = useApplication();
  const threeRootRef = useRef<ReconcilerRoot<HTMLCanvasElement>>(null);
  const [cleanupFn, setCleanupFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (!pixi.isInitialised) {
      return;
    }

    async function initThree() {
      const canvas = pixi.app.canvas;

      const renderer = new WebGPURenderer({
        canvas: canvas,
        device: (pixi.app.renderer as PixiWebGPURenderer).device.gpu.device,
        antialias: true,
        samples: 4,
        alpha: true,
        stencil: true,
      });

      renderer.setClearColor(0, 0);

      await renderer.init();

      pixi.app.renderer.resetState();

      const threeRoot = createRoot(canvas);

      threeRootRef.current = threeRoot;

      const threeState: RootState = await new Promise((resolve) => {
        void threeRoot.configure({
          dpr: 2,
          frameloop: "never",
          gl: renderer,
          onCreated: resolve,
          events,
        });
        threeRoot.render(<Bridge>{children}</Bridge>);
      });
      if (eventSource?.current) {
        threeState.events.connect?.(eventSource.current);
      }

      pixi.app.renderer.on("resize", (width, height) => {
        renderer.setSize(width, height);
        (threeState.camera as THREE.PerspectiveCamera).aspect = width / height;
        threeState.camera.updateProjectionMatrix();
      });

      function render() {
        threeState.advance(pixi.app.ticker.lastTime * 0.001);
        pixi.app.renderer.resetState();
      }

      const { prerender } = pixi.app.renderer.runners;

      const runner = { prerender: render };

      prerender.add(runner);

      setCleanupFn(() => () => {
        unmountComponentAtNode(canvas);
        try {
          prerender.remove(runner);
        } catch {
          /* ... */
        }
      });
    }

    void initThree();
  }, [Bridge, children, eventSource, pixi, pixi.isInitialised]);

  useEffect(() => {
    if (!cleanupFn) {
      return;
    }
    return cleanupFn;
  }, [cleanupFn]);

  useEffect(() => {
    threeRootRef.current?.render(<Bridge>{children}</Bridge>);
  }, [Bridge, children]);

  return null;
}
