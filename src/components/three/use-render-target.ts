import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  DepthTexture,
  FloatType,
  RenderTarget,
  type RenderTargetOptions,
} from "three";

export function useRenderTarget(
  width?: number,
  height?: number,
  options?: RenderTargetOptions,
) {
  const { size, viewport } = useThree(({ size, viewport }) => ({
    size,
    viewport,
  }));
  const _width = (width ?? size.width) * viewport.dpr;
  const _height = (height ?? size.height) * viewport.dpr;

  const renderTarget = useRef(
    (() => {
      const val = new RenderTarget(_width, _height, options);
      if (options?.depthBuffer) {
        val.depthTexture = new DepthTexture(_width, _height, FloatType);
      }
      return val;
    })(),
  );

  useLayoutEffect(() => {
    renderTarget.current.setSize(_width, _height);
    if (options?.samples) {
      renderTarget.current.samples = options.samples;
    }
  }, [_width, _height, options?.samples, renderTarget]);

  useEffect(() => {
    const val = renderTarget.current;
    return () => val.dispose();
  });

  return renderTarget;
}
