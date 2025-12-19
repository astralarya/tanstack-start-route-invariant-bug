import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_pathless_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="bg-slate-300 flex gap-2 p-1">
        <Link
          className="bg-slate-500 hover:bg-slate-400 rounded-sm p-1"
          to={'/'}
        >
          Link to "/"
        </Link>
        <Link
          className="bg-slate-500 hover:bg-slate-400 rounded-sm p-1"
          to={'/nested_path'}
        >
          Link to "/nested_path"
        </Link>
      </div>
      <div>Hello "/_pathless_layout"!</div>
      <Outlet />
    </div>
  )
}
