import { Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(auth)/admin/replications_/$replicationId/executions',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { replicationId } = Route.useParams()

  return (
    <div>
      <Title order={3}>
        Executions for Replication
        {' '}
        {replicationId}
      </Title>
    </div>
  )
}
