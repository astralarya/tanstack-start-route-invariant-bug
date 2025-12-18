import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_pathless_layout/_nested_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div>Hello "/_pathless_layout/_nested_layout"!</div>
      <Outlet />
    </div>
  )
}
