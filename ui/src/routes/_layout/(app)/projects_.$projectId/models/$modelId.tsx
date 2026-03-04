import {
  Title,
  Tabs,
  Stack,
  Container,
} from '@mantine/core'
import {
  Outlet,
  Link,
  useMatchRoute,
  createFileRoute,
} from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_layout/(app)/projects_/$projectId/models/$modelId',
)({
  component: ModelLayout,
})

function ModelLayout() {
  const {
    projectId, modelId,
  } = Route.useParams()
  const matchRoute = useMatchRoute()

  const isSettings = !!matchRoute({ to: '/projects/$projectId/models/$modelId/settings' })

  return (
    <Stack gap="md" py="xl">
      <Container size="xl" w="100%">
        <Title order={2}>
          Model:
          {' '}
          {modelId}
          {' '}
          (Project
          {' '}
          {projectId}
          )
        </Title>
      </Container>

      <Container size="xl" w="100%">
        <Tabs value={isSettings ? 'settings' : 'card'}>
          <Tabs.List>
            <Tabs.Tab
              value="card"
              component={Link}
              // @ts-expect-error valid route
              to={`/projects/${projectId}/models/${modelId}`}
            >
              Model card
            </Tabs.Tab>
            <Tabs.Tab
              value="settings"
              component={Link}
              // @ts-expect-error valid route
              to={`/projects/${projectId}/models/${modelId}/settings`}
            >
              Settings
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Container>

      <Container size="xl" w="100%" p={0}>
        <Outlet />
      </Container>
    </Stack>
  )
}
