import { Stack, Title } from '@mantine/core'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/(app)/projects/$projectId')({
  component: RouteComponent,
})

export function RouteComponent() {
  const { projectId } = Route.useParams()

  return (
    <Stack>
      <Title order={2}>Project Detail</Title>
      {projectId}

      <Outlet />
    </Stack>
  )
}
