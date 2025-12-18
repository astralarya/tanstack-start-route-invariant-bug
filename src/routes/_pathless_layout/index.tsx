import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_pathless_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_pathless_layout/index.tsx"!</div>
}
