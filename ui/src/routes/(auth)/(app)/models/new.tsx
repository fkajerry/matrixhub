import { Title, Box } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute(
  '/(auth)/(app)/models/new',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()

  return (
    <Box p="md">
      <Title order={3}>{t('models.new', 'Create New Model')}</Title>
      {/* TODO: Add model creation form */}
    </Box>
  )
}
