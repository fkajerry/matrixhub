import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_layout/(app)/projects_/$projectId/models/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()

  return (
    <div>
      Project Models Page - Project ID:
      {projectId}
    </div>
  )
}
