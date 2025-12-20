import { useEffect, useRef, useState } from "react";
import { type ThreeElements, useFrame } from "@react-three/fiber";
import { ExternalTexture, Material, type Mesh } from "three";
import { texture, uv } from "three/tsl";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { PixiTexture } from "./pixi-texture";
import { Graphics } from "pixi.js";
import { extend, useTick } from "@pixi/react";

import { usePixiTextureContext } from "./pixi-texture-context";

extend({ Graphics });

export function SpinnyCube(props: ThreeElements["mesh"]) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(null);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current!.rotation.x += delta;
    ref.current!.rotation.y += delta * 0.5;
  });

  const pixiTexture = useRef(new ExternalTexture());
  const [material, setMaterial] = useState<Material>();

  useEffect(() => {
    setMaterial(() => {
      const material = new MeshBasicNodeMaterial();
      material.colorNode = texture(pixiTexture.current, uv());
      return material;
    });
  }, []);

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      material={material}
    >
      <boxGeometry args={[2, 2, 2]} />
      <PixiTexture ref={pixiTexture}>
        <SpinnyCubeTexture />
      </PixiTexture>
    </mesh>
  );
}

function SpinnyCubeTexture() {
  const { render } = usePixiTextureContext();
  const star1 = useRef<Graphics>(null!);
  const star2 = useRef<Graphics>(null!);
  const time = useRef(0);

  useTick((ticker) => {
    time.current += ticker.deltaMS;
    star1.current.rotation = ((time.current % 4000) / 4000) * 2 * Math.PI;
    star2.current.scale = Math.abs(((time.current % 5000) - 2500) / 5000) + 0.5;
    render();
  });

  function drawBackground(graphics: Graphics) {
    graphics.clear();
    graphics.rect(0, 0, 128, 128).fill(0x000000);
  }

  function drawStar1(graphics: Graphics) {
    graphics.clear();
    graphics.star(64, 64, 5, 32).stroke({ width: 8, color: 0xff0000 });
  }

  function drawStar2(graphics: Graphics) {
    graphics.clear();
    graphics.star(64, 64, 5, 32).stroke({ width: 8, color: 0x0000ff });
  }

  return (
    <>
      <pixiGraphics draw={drawBackground} />
      <pixiGraphics ref={star1} draw={drawStar1} origin={64} />
      <pixiGraphics ref={star2} draw={drawStar2} origin={64} />
    </>
  );
}
