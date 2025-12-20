import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PixiThreeCanvas } from '@/components/pixi-three-canvas'

export const Route = createFileRoute('/_pathless_layout/_nested_layout')({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  return (
    <PixiThreeCanvas className="w-full h-[calc(100lvh-4rem)]">
      <Outlet />
    </PixiThreeCanvas>
  )
}
