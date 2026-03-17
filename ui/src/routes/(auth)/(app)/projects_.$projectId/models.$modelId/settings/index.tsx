import {
  Alert, Button, Stack, Text, TextInput,
} from '@mantine/core'
import { Models } from '@matrixhub/api-ts/v1alpha1/model.pb.ts'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import DeleteIcon from '@/assets/svgs/delete.svg?react'
import WarningIcon from '@/assets/svgs/warning.svg?react'

export const Route = createFileRoute(
  '/(auth)/(app)/projects_/$projectId/models/$modelId/settings/',
)({
  component: ModelSettings,
})

function ModelSettings() {
  const { t } = useTranslation()
  const {
    projectId, modelId,
  } = Route.useParams()

  const fullName = `${projectId}/${modelId}`

  const [inputValue, setInputValue] = useState('')

  const handleDelete = async () => {
    try {
      await Models.DeleteModel({
        project: projectId,
        name: modelId,
      })
    } catch (e) {
      // TODO: handle error noty
      console.error(e)
    }
  }

  return (
    <Stack
      gap="md"
      pt={20}
      align="flex-start"
    >
      <Text fw="600">
        {t('models.settings.delete.title')}
      </Text>

      <Alert
        icon={<WarningIcon />}
        variant="light"
        color="var(--mantine-color-yellow-6)"
        px="md"
        py="sm"
      >
        <Text size="sm" lh="20px" c="var(--mantine-color-gray-9)">
          {t('models.settings.delete.warning', { name: fullName })}
        </Text>
      </Alert>

      <Stack gap={8}>
        <Text fw={600} size="sm" lh="20px" c="var(--mantine-color-gray-7)">
          {t('models.settings.delete.confirmation', { name: fullName })}
        </Text>

        <TextInput
          value={inputValue}
          onChange={e => setInputValue(e.currentTarget.value)}
        />
      </Stack>

      <Button
        disabled={inputValue !== fullName}
        leftSection={<DeleteIcon />}
        color="var(--mantine-color-red-6)"
        onClick={handleDelete}
      >
        {t('models.settings.delete.action')}
      </Button>
    </Stack>
  )
}
