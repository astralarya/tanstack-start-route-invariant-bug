import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Application } from '@pixi/react'

export const Route = createFileRoute('/_pathless_layout/_nested_layout')({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  return (
    <Application>
      <Outlet />
    </Application>
  )
}
