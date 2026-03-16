import {
  Alert,
  Box,
  Flex,
  Group,
  SimpleGrid,
  Skeleton,
  TextInput,
} from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import SearchIcon from '@/assets/svgs/search.svg?react'

import { CollectionLayout } from './CollectionLayout'
import {
  SortDropdown,
  type SortDropdownOption,
  type SortOrder,
} from './SortDropdown'

import type { Pagination } from '@matrixhub/api-ts/v1alpha1/utils.pb'
import type { ReactNode } from 'react'

interface ResourceCardListProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void

  sortOptions?: readonly SortDropdownOption[]
  sortField?: string
  sortOrder?: SortOrder
  onSortChange?: (field: string, order: SortOrder) => void
  refreshing?: boolean

  toolbarEnd?: ReactNode

  pagination?: Pagination
  page: number
  onPageChange: (page: number) => void

  loading?: boolean
  error?: boolean
  errorMessage?: ReactNode

  emptyTitle: ReactNode
  emptyDescription: ReactNode
  totalLabel?: ReactNode
  skeletonCount?: number

  children: ReactNode
}

const CARD_HEIGHT = 116
const SEARCH_DEBOUNCE_MS = 300

export function ResourceCardList({
  searchPlaceholder,
  searchValue = '',
  onSearchChange,

  sortOptions,
  sortField,
  sortOrder = 'desc',
  onSortChange,
  refreshing,

  toolbarEnd,

  pagination,
  page,
  onPageChange,

  loading,
  error,
  errorMessage,

  emptyTitle,
  emptyDescription,
  totalLabel,
  skeletonCount = 6,

  children,
}: ResourceCardListProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedSearchChange = useDebouncedCallback((value: string) => {
    startTransition(() => {
      onSearchChange?.(value)
    })
  }, SEARCH_DEBOUNCE_MS)

  const skeletonKeys = useMemo(
    () => Array.from(
      { length: skeletonCount },
      (_, i) => `skeleton-${i + 1}`,
    ),
    [skeletonCount],
  )

  useEffect(() => {
    debouncedSearchChange.cancel()

    const input = inputRef.current

    if (input && input.value !== searchValue) {
      input.value = searchValue
    }
  }, [searchValue, debouncedSearchChange])

  const showSearch = Boolean(searchPlaceholder && onSearchChange)
  const hasItems = !loading && !error && Boolean(children)

  return (
    <Box pt={20}>
      <CollectionLayout
        hasItems={hasItems}
        pagination={pagination}
        page={page}
        loading={loading}
        totalLabel={totalLabel}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        onPageChange={(nextPage) => {
          startTransition(() => {
            onPageChange(nextPage)
          })
        }}
        renderToolbar={() => (
          <Flex justify="space-between" align="center" wrap="wrap" gap="md" mb="md">
            {showSearch && (
              <TextInput
                defaultValue={searchValue}
                ref={inputRef}
                placeholder={searchPlaceholder}
                leftSection={(
                  <SearchIcon
                    width={14}
                    height={14}
                    style={{ color: 'var(--mantine-color-gray-5)' }}
                  />
                )}
                onChange={(event) => {
                  const nextQuery = event.currentTarget.value.trim()

                  if (nextQuery === searchValue) {
                    debouncedSearchChange.cancel()

                    return
                  }

                  debouncedSearchChange(nextQuery)
                }}
                styles={{
                  input: {
                    height: 32,
                    minHeight: 32,
                    borderRadius: 16,
                    fontSize: '14px',
                  },
                }}
                w={260}
              />
            )}

            <Group gap="md" wrap="nowrap" ml="auto">
              {sortOptions && sortField && onSortChange && (
                <SortDropdown
                  fieldOptions={sortOptions}
                  fieldValue={sortField}
                  order={sortOrder}
                  refreshing={refreshing}
                  onFieldChange={(nextField) => {
                    if (sortOptions.find(o => o.value === nextField)?.disabled) {
                      return
                    }

                    startTransition(() => {
                      onSortChange(nextField, sortOrder)
                    })
                  }}
                  onToggleOrder={() => {
                    startTransition(() => {
                      onSortChange(
                        sortField,
                        sortOrder === 'desc' ? 'asc' : 'desc',
                      )
                    })
                  }}
                />
              )}

              {toolbarEnd}
            </Group>
          </Flex>
        )}
      >
        {error
          ? (
              <Alert
                color="red"
                variant="light"
                radius="md"
              >
                {errorMessage}
              </Alert>
            )
          : (
              <SimpleGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                spacing={20}
              >
                {loading
                  ? skeletonKeys.map(key => (
                      <Skeleton key={key} h={CARD_HEIGHT} radius="md" />
                    ))
                  : children}
              </SimpleGrid>
            )}
      </CollectionLayout>
    </Box>
  )
}
