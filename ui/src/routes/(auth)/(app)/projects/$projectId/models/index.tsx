import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(auth)/(app)/projects/$projectId/models/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/(app)/projects/$projectId/models/"!</div>
}
