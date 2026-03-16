import {
  Button,
  Group,
  Pagination,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

import type { Pagination as PaginationData } from '@matrixhub/api-ts/v1alpha1/utils.pb'
import type { ReactNode } from 'react'

export interface CollectionToolbarProps {
  /** Show search input. Provide a placeholder string or `true` to use default. */
  searchPlaceholder?: string | boolean
  /** Controlled search value. */
  searchValue?: string
  /** Called when search input changes. */
  onSearchChange?: (value: string) => void

  /** Show refresh button when provided. */
  onRefresh?: () => void

  /** Number of selected items. Shows batch-delete button when > 0 and `onBatchDelete` is provided. */
  selectedCount?: number
  /** Called when batch-delete button is clicked. */
  onBatchDelete?: () => void

  /** Slot: replaces the entire toolbar row. Receives default toolbar as children for composition. */
  renderToolbar?: (defaultToolbar: ReactNode) => ReactNode
  /** Slot: extra actions rendered after built-in buttons. */
  toolbarExtra?: ReactNode
}

interface CollectionLayoutProps extends CollectionToolbarProps {
  pagination?: PaginationData
  page: number
  totalLabel?: string
  loading?: boolean
  children: ReactNode
  onPageChange: (page: number) => void
}

function DefaultToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onRefresh,
  selectedCount = 0,
  onBatchDelete,
  toolbarExtra,
  loading,
}: CollectionToolbarProps & { loading?: boolean }) {
  const { t } = useTranslation()
  const placeholder = typeof searchPlaceholder === 'string'
    ? searchPlaceholder
    : t('shared.search')

  const showSearch = !!searchPlaceholder
  const showBatchDelete = selectedCount > 0 && onBatchDelete

  return (
    <Group justify="space-between" mb="md">
      {showSearch
        ? (
            <TextInput
              placeholder={placeholder}
              value={searchValue ?? ''}
              onChange={event => onSearchChange?.(event.currentTarget.value)}
              maw={360}
              style={{ flex: 1 }}
            />
          )
        : <div />}
      <Group>
        {showBatchDelete && (
          <Button
            color="red"
            variant="light"
            onClick={onBatchDelete}
          >
            {t('shared.batchDelete', { count: selectedCount })}
          </Button>
        )}
        {onRefresh && (
          <Button
            variant="default"
            onClick={onRefresh}
            loading={loading}
          >
            {t('shared.refresh')}
          </Button>
        )}
        {toolbarExtra}
      </Group>
    </Group>
  )
}

export function CollectionLayout({
  pagination,
  page,
  loading,
  children,
  onPageChange,
  totalLabel,
  // Toolbar
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onRefresh,
  selectedCount,
  onBatchDelete,
  renderToolbar,
  toolbarExtra,
}: CollectionLayoutProps) {
  const { t } = useTranslation()
  const showBatchDelete = (selectedCount ?? 0) > 0 && !!onBatchDelete

  const totalPages = pagination?.pages
    ?? (
      pagination?.total && pagination?.pageSize
        ? Math.ceil(pagination.total / pagination.pageSize)
        : 0
    )

  const showToolbar = !!(searchPlaceholder || onRefresh || showBatchDelete || toolbarExtra)
  const defaultToolbar = showToolbar
    ? (
        <DefaultToolbar
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onRefresh={onRefresh}
          selectedCount={selectedCount}
          onBatchDelete={onBatchDelete}
          toolbarExtra={toolbarExtra}
          loading={loading}
        />
      )
    : null

  const toolbar = renderToolbar
    ? renderToolbar(defaultToolbar)
    : defaultToolbar

  return (
    <Stack gap={0} miw={0}>
      {toolbar}

      {children}

      {pagination && totalPages > 1 && (
        <Group justify="space-between" py="sm">
          <Text size="sm" fw={500} c="dimmed">
            {totalLabel ?? t('shared.total', { count: pagination.total ?? 0 })}
          </Text>
          <Pagination
            size="xs"
            radius="sm"
            value={page}
            onChange={onPageChange}
            total={totalPages}
          />
        </Group>
      )}
    </Stack>
  )
}
