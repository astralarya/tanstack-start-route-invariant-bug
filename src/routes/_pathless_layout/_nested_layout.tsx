import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { WebGPURenderer } from 'three/webgpu'

export const Route = createFileRoute('/_pathless_layout/_nested_layout')({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  return (
    <Canvas
      gl={async (props) => {
        const renderer = new WebGPURenderer(props as any)
        await renderer.init()
        return renderer
      }}
    >
      <Outlet />
    </Canvas>
  )
}
