import { type RootState, useFrame, useThree } from "@react-three/fiber";
import { type ReactNode, type RefObject } from "react";
import { type RenderTarget, type Texture } from "three";
import type WebGPUBackend from "three/src/renderers/webgpu/WebGPUBackend.js";
import { type PostProcessing, type WebGPURenderer } from "three/webgpu";

export interface PortalProps {
  frames: number;
  renderPriority: number;
  renderTarget: RefObject<RenderTarget>;
  children: ReactNode;
  onTextureUpdate?: (x: GPUTexture) => unknown;
  postProcessing?: (x: RootState) => PostProcessing;
}

export function Portal({
  frames,
  renderPriority,
  renderTarget,
  children,
  onTextureUpdate,
  postProcessing,
}: PortalProps) {
  const state = useThree();
  const backendData = (
    (state.gl as unknown as WebGPURenderer).backend as WebGPUBackend & {
      data: WeakMap<Texture, { texture: GPUTexture }>;
    }
  ).data;

  let count = 0;
  const postProcessor = postProcessing ? postProcessing(state) : null;
  useFrame(() => {
    if (frames === Infinity || count < frames) {
      const gl = state.gl as unknown as WebGPURenderer;
      const oldAutoClear = gl.autoClear;
      const oldXrEnabled = gl.xr.enabled;
      const oldIsPresenting = gl.xr.isPresenting;
      const oldRenderTarget = gl.getRenderTarget();
      gl.autoClear = true;
      gl.xr.enabled = false;
      gl.xr.isPresenting = false;
      gl.setRenderTarget(renderTarget.current);
      if (postProcessor) {
        postProcessor.render();
      } else {
        gl.render(state.scene, state.camera);
      }
      if (onTextureUpdate) {
        const textureData = backendData.get(renderTarget.current.texture)!;
        onTextureUpdate(textureData.texture);
      }
      gl.setRenderTarget(oldRenderTarget);
      gl.autoClear = oldAutoClear;
      gl.xr.enabled = oldXrEnabled;
      gl.xr.isPresenting = oldIsPresenting;
      count++;
    }
  }, renderPriority);
  return <>{children}</>;
}
