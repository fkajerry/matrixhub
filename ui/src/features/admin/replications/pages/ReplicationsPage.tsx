import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import {
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import {
  getRouteApi,
  useRouterState,
} from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { useRouteListState } from '@/shared/hooks/useRouteListState'

import { ReplicationsTable } from '../components/ReplicationsTable'
import {
  adminReplicationKeys,
  replicationsQueryOptions,
} from '../replications.query'
import { DEFAULT_REPLICATIONS_PAGE } from '../replications.schema'
import { getReplicationRowId } from '../replications.utils'

const replicationsRouteApi = getRouteApi('/(auth)/admin/replications')

export function ReplicationsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = replicationsRouteApi.useNavigate()
  const search = replicationsRouteApi.useSearch()
  const {
    data,
    isFetching,
  } = useSuspenseQuery(replicationsQueryOptions(search))
  const {
    replications,
    pagination,
  } = data
  const routeLoading = useRouterState({
    select: state => state.isLoading,
  })
  const loading = routeLoading || isFetching

  const refreshReplications = () => queryClient.invalidateQueries({
    queryKey: adminReplicationKeys.lists(),
  })

  const {
    rowSelection,
    setRowSelection,
    selectedCount,
    onSearchChange,
    onRefresh,
    onPageChange,
  } = useRouteListState({
    search,
    navigate,
    records: replications,
    getRecordId: getReplicationRowId,
    refresh: refreshReplications,
  })

  const handleCreate = () => {
    // TODO: open create replication modal
  }

  const handleBatchDelete = () => {
    if (selectedCount === 0) {
      return
    }

    // TODO: open batch delete replication modal
  }

  return (
    <ReplicationsTable
      data={replications}
      pagination={pagination}
      loading={loading}
      page={search.page ?? DEFAULT_REPLICATIONS_PAGE}
      searchValue={search.query ?? ''}
      onSearchChange={onSearchChange}
      onRefresh={onRefresh}
      onBatchDelete={handleBatchDelete}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      onPageChange={onPageChange}
      selectedCount={selectedCount}
      toolbarExtra={(
        <Button
          disabled
          onClick={handleCreate}
          leftSection={<IconPlus size={16} />}
        >
          {t('routes.admin.replications.toolbar.create')}
        </Button>
      )}
    />
  )
}
