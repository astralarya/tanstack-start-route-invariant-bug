import { SpinnyCube } from '@/componnts/spinny-cube'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_pathless_layout/_nested_layout/nested_path',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <SpinnyCube />
}
