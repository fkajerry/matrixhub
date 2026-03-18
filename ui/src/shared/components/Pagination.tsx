import {
  Group,
  Pagination as MantinePagination,
  type PaginationProps as MantinePaginationProps,
  Text,
  type TextProps,
} from '@mantine/core'
import { startTransition } from 'react'

import type { ReactNode } from 'react'

export interface PaginationProps {
  total: number
  totalPages: number
  page: number
  onPageChange: (page: number) => void
  totalLabel?: ReactNode
  totalLabelProps?: TextProps
  paginationProps?: Omit<
    MantinePaginationProps,
    'total' | 'value' | 'onChange'
  >
}

export function Pagination({
  total,
  totalPages,
  page,
  onPageChange,
  totalLabel,
  totalLabelProps,
  paginationProps,
}: PaginationProps) {
  if (total <= 0 || totalPages <= 1) {
    return null
  }

  return (
    <Group justify="space-between" py="sm">
      {totalLabel && (
        <Text size="sm" fw={500} c="dimmed" {...totalLabelProps}>
          {totalLabel}
        </Text>
      )}
      <MantinePagination
        size="xs"
        radius="sm"
        {...paginationProps}
        value={page}
        onChange={(nextPage) => {
          startTransition(() => {
            onPageChange(nextPage)
          })
        }}
        total={totalPages}
      />
    </Group>
  )
}
