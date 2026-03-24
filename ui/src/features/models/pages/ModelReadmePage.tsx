import { Box } from '@mantine/core'
import { getRouteApi } from '@tanstack/react-router'
import Markdown from 'react-markdown'

const modelDetailRouteApi = getRouteApi('/(auth)/(app)/projects_/$projectId/models/$modelId')

export function ModelReadmePage() {
  const model = modelDetailRouteApi.useLoaderData()

  return (
    <Box pt={20}>
      <Markdown>
        { model?.model.readmeContent }
      </Markdown>
    </Box>
  )
}
