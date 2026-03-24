import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { CurrentUser } from '@matrixhub/api-ts/v1alpha1/current_user.pb'
import {
  IconInfoCircle,
  IconKey,
  IconRefresh,
} from '@tabler/icons-react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import z from 'zod'

import { AccessTokenTable } from '@/features/profile/components/AccessTokenTable'
import { profileKeys, useAccessTokens } from '@/features/profile/profile.query'
import { ModalWrapper } from '@/shared/components/ModalWrapper'

export function AccessTokenPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const {
    data, isFetching,
  } = useAccessTokens()

  const tokens = data?.items ?? []

  const [hintVisible, setHintVisible] = useState(true)

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: profileKeys.accessTokens })
  }

  // Create token

  const [createOpened, {
    open: openCreate, close: closeCreate,
  }] = useDisclosure(false)

  const {
    mutate: createToken, isPending: isCreating,
  } = useMutation({
    mutationFn: (value: string) => CurrentUser.CreateAccessToken({ name: value }),
    meta: {
      successMessage: t('profile.tokenCreated'),
      invalidates: [profileKeys.accessTokens],
    },
    onSuccess: () => {
      closeCreate()
    },
  })

  const nameSchema = z.string().min(1, { error: t('common.validation.fieldRequired', { field: t('profile.tokenName') }) })

  const {
    reset, handleSubmit, Field,
  } = useForm({
    defaultValues: {
      tokenName: '',
    },
    onSubmit: ({ value }) => {
      createToken(value.tokenName)
    },
  })

  const handleCreateClose = () => {
    closeCreate()
    reset()
  }

  return (
    <Stack gap="sm">
      {hintVisible && (
        <Alert
          icon={<IconInfoCircle size={20} />}
          variant="light"
          color="cyan"
          withCloseButton
          onClose={() => setHintVisible(false)}
          styles={{ icon: { marginRight: 6 } }}
        >
          <Text size="sm">{t('profile.tokenHint')}</Text>
        </Alert>
      )}

      <Group justify="flex-end" gap={16}>
        <ActionIcon
          variant="transparent"
          loading={isFetching}
          onClick={handleRefresh}
          aria-label="refresh"
          c="gray.6"
          size={24}
        >
          <IconRefresh />
        </ActionIcon>
        <Button
          leftSection={<IconKey size={16} />}
          onClick={openCreate}
          size="xs"
        >
          {t('profile.createToken')}
        </Button>
      </Group>

      <AccessTokenTable tokens={tokens} />

      <ModalWrapper
        title={t('profile.createToken')}
        opened={createOpened}
        onClose={handleCreateClose}
        onConfirm={handleSubmit}
        confirmLoading={isCreating}
        size="sm"
      >
        <Field
          name="tokenName"
          validators={{ onChange: nameSchema }}
        >
          {({
            state, handleChange,
          }) => (
            <TextInput
              label={t('profile.tokenName')}
              required
              value={state.value}
              onChange={e => handleChange(e.currentTarget.value)}
              error={state.meta.errors[0]?.message}
            />
          )}
        </Field>
      </ModalWrapper>
    </Stack>
  )
}
