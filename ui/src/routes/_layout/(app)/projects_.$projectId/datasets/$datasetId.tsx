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
  '/_layout/(app)/projects_/$projectId/datasets/$datasetId',
)({
  component: DatasetLayout,
})

function DatasetLayout() {
  const {
    projectId, datasetId,
  } = Route.useParams()
  const matchRoute = useMatchRoute()

  const isSettings = !!matchRoute({ to: '/projects/$projectId/datasets/$datasetId/settings' })

  return (
    <Stack gap="md" py="xl">
      <Container size="xl" w="100%">
        <Title order={2}>
          Dataset:
          {' '}
          {datasetId}
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
              to={`/projects/${projectId}/datasets/${datasetId}`}
            >
              Dataset card
            </Tabs.Tab>
            <Tabs.Tab
              value="settings"
              component={Link}
              // @ts-expect-error valid route
              to={`/projects/${projectId}/datasets/${datasetId}/settings`}
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
