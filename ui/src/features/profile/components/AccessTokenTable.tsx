import {
  ActionIcon,
  Box,
  Group,
  Menu,
  Table,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  CurrentUser, AccessTokenStatus, type AccessToken,
} from '@matrixhub/api-ts/v1alpha1/current_user.pb'
import {
  IconDotsVertical,
  IconTrash,
} from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { profileKeys } from '@/features/profile/profile.query'
import { ModalWrapper } from '@/shared/components/ModalWrapper'
import { formatDateTime } from '@/shared/utils/date'

interface AccessTokenTableProps {
  tokens: AccessToken[]
}

export function AccessTokenTable({ tokens }: AccessTokenTableProps) {
  const { t } = useTranslation()
  const [deleteOpened, {
    open: openDelete, close: closeDelete,
  }] = useDisclosure(false)
  const [deletingToken, setDeletingToken] = useState<AccessToken | null>(null)

  const {
    mutate: deleteToken, isPending: isDeleting,
  } = useMutation({
    mutationFn: () => CurrentUser.DeleteAccessToken({ id: deletingToken?.id }),
    meta: {
      successMessage: t('profile.tokenDeleted'),
      invalidates: [profileKeys.accessTokens],
    },
    onSuccess: () => {
      closeDelete()
      setDeletingToken(null)
    },
  })

  const handleDeleteOpen = (token: AccessToken) => {
    setDeletingToken(token)
    openDelete()
  }

  const handleDeleteClose = () => {
    closeDelete()
    setDeletingToken(null)
  }

  const formatExpiredAt = (expiredAt: string | undefined) => {
    if (!expiredAt) {
      return t('profile.tokenPermanent')
    }

    return formatDateTime(expiredAt)
  }

  const statusColor = {
    [AccessTokenStatus.ACCESS_TOKEN_STATUS_VALID]: 'teal.6',
    [AccessTokenStatus.ACCESS_TOKEN_STATUS_EXPIRED]: 'yellow.6',
    [AccessTokenStatus.ACCESS_TOKEN_STATUS_UNKNOWN]: 'gray.5',
  }

  return (
    <>
      <Box>
        <Table highlightOnHover>
          <Table.Thead bg="gray.0">
            <Table.Tr>
              <Table.Th>{t('profile.tokenName')}</Table.Th>
              <Table.Th>{t('profile.tokenStatus')}</Table.Th>
              <Table.Th>{t('profile.tokenExpiredAt')}</Table.Th>
              <Table.Th>{t('profile.tokenCreatedAt')}</Table.Th>
              <Table.Th w={48} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tokens.length === 0
              ? (
                  <Table.Tr>
                    <Table.Td
                      colSpan={5}
                      ta="center"
                    >
                      <Text
                        size="sm"
                        c="dimmed"
                        py="xl"
                      >
                        {t('common.noResults')}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )
              : tokens.map((token: AccessToken) => (
                  <Table.Tr key={token.id}>
                    <Table.Td>
                      <Text size="sm">{token.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6}>
                        <Box
                          w={12}
                          h={12}
                          bdrs="50%"
                          bg={statusColor[token.status ?? AccessTokenStatus.ACCESS_TOKEN_STATUS_UNKNOWN]}
                        />
                        <Text size="sm">
                          {t(`profile.status.${token.status ?? AccessTokenStatus.ACCESS_TOKEN_STATUS_UNKNOWN}`)}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatExpiredAt(token.expiredAt)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatDateTime(token.createdAt)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="transparent" c="gray.6" size={20}>
                            <IconDotsVertical />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDeleteOpen(token)}
                            styles={{ itemSection: { marginInlineEnd: 4 } }}
                          >
                            {t('profile.deleteToken')}
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
          </Table.Tbody>
        </Table>
      </Box>

      <ModalWrapper
        type="danger"
        title={t('profile.deleteToken')}
        opened={deleteOpened}
        onClose={handleDeleteClose}
        onConfirm={() => deleteToken()}
        confirmLoading={isDeleting}
      >
        <Text size="sm">
          {t('profile.deleteTokenConfirm', { name: deletingToken?.name ?? '' })}
        </Text>
      </ModalWrapper>
    </>
  )
}
