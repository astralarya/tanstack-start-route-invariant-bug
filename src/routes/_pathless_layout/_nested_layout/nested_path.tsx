import { ThreeScene } from '@/components/pixi-three/three-scene'
import { SpinnyCube } from '@/components/spinny-cube'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_pathless_layout/_nested_layout/nested_path',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <ThreeScene>
        <SpinnyCube position={[-2, -2, 0]} />
        <SpinnyCube position={[0, -2, 0]} />
        <SpinnyCube position={[2, -2, 0]} />
        <SpinnyCube position={[-2, 0, 0]} />
        <SpinnyCube position={[0, 0, 0]} />
        <SpinnyCube position={[2, 0, 0]} />
        <SpinnyCube position={[-2, 2, 0]} />
        <SpinnyCube position={[0, 2, 0]} />
        <SpinnyCube position={[2, 2, 0]} />

        <SpinnyCube position={[-2, -2, -2]} />
        <SpinnyCube position={[0, -2, -2]} />
        <SpinnyCube position={[2, -2, -2]} />
        <SpinnyCube position={[-2, 0, -2]} />
        <SpinnyCube position={[0, 0, -2]} />
        <SpinnyCube position={[2, 0, -2]} />
        <SpinnyCube position={[-2, 2, -2]} />
        <SpinnyCube position={[0, 2, -2]} />
        <SpinnyCube position={[2, 2, -2]} />

        <SpinnyCube position={[-2, -2, 2]} />
        <SpinnyCube position={[0, -2, 2]} />
        <SpinnyCube position={[2, -2, 2]} />
        <SpinnyCube position={[-2, 0, 2]} />
        <SpinnyCube position={[0, 0, 2]} />
        <SpinnyCube position={[2, 0, 2]} />
        <SpinnyCube position={[-2, 2, 2]} />
        <SpinnyCube position={[0, 2, 2]} />
        <SpinnyCube position={[2, 2, 2]} />
      </ThreeScene>
    </>
  )
}
