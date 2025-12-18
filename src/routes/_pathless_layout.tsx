import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_pathless_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div>Hello "/_pathless_layout"!</div>
      <div>
        <Link to={'/'}>Link to "/"</Link>
        <Link to={'/nested_path'}>Link to "/nested_path"</Link>
      </div>
      <Outlet />
    </div>
  )
}
