import { Button } from '@mantine/core'
import {
  Category,
  Models,
} from '@matrixhub/api-ts/v1alpha1/model.pb'
import {
  queryOptions,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
} from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import ArrowBarToDownIcon from '@/assets/svgs/arrow-bar-to-down.svg?react'
import BinaryTreeIcon from '@/assets/svgs/binary-tree.svg?react'
import ClockIcon from '@/assets/svgs/clock.svg?react'
import ModelIcon from '@/assets/svgs/model.svg?react'
import PhotoUpIcon from '@/assets/svgs/photo-up.svg?react'
import ProjectIcon from '@/assets/svgs/project.svg?react'
import PytorchIcon from '@/assets/svgs/pytorch.svg?react'
import {
  ResourceCard,
  type ResourceCardBadge,
} from '@/shared/components/ResourceCard'
import { ResourceCardList } from '@/shared/components/ResourceCardList'

import type { SortDropdownOption } from '@/shared/components/SortDropdown'
import type {
  Label,
  Model,
} from '@matrixhub/api-ts/v1alpha1/model.pb'

const sortFieldSchema = z.enum(['updatedAt', 'downloads'])

const modelsSearchSchema = z.object({
  q: z.string().transform(v => v.trim()).catch(''),
  sort: sortFieldSchema.catch('updatedAt'),
  order: z.enum(['asc', 'desc']).catch('desc'),
  page: z.coerce.number().int().positive().catch(1),
})

type SortField = z.infer<typeof sortFieldSchema>

type ModelsSearch = z.output<typeof modelsSearchSchema>

export const Route = createFileRoute(
  '/(auth)/(app)/projects/$projectId/models/',
)({
  validateSearch: search => modelsSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({
    context,
    params,
    deps,
  }) => {
    void context.queryClient.ensureQueryData(
      buildModelsQueryOptions({
        projectId: params.projectId,
        search: deps,
      }),
    )
  },
  component: RouteComponent,
})

const PAGE_SIZE = 6

function buildModelsQueryOptions({
  projectId,
  search,
}: {
  projectId: string
  search: ModelsSearch
}) {
  const sortParam = toSortParam(search.sort, search.order)

  return queryOptions({
    queryKey: ['project-models', projectId, search.q, sortParam, search.page],
    queryFn: () => Models.ListModels({
      project: projectId,
      search: search.q || undefined,
      sort: sortParam,
      page: search.page,
      pageSize: PAGE_SIZE,
    }),
  })
}

function RouteComponent() {
  const { projectId } = Route.useParams()
  const navigate = Route.useNavigate()
  const {
    q: query,
    sort: sortField,
    order: sortOrder,
    page,
  } = Route.useSearch()
  const { t } = useTranslation()
  const modelsQuery = buildModelsQueryOptions({
    projectId,
    search: {
      q: query,
      sort: sortField,
      order: sortOrder,
      page,
    },
  })
  const sortFieldOptions: SortDropdownOption[] = [
    {
      value: 'updatedAt',
      label: t('projects.detail.modelsPage.sortFieldUpdatedAt'),
      icon: <ClockIcon width={16} height={16} />,
    },
    {
      value: 'downloads',
      label: t('projects.detail.modelsPage.sortFieldDownloads'),
      icon: <ArrowBarToDownIcon width={16} height={16} />,
      disabled: true,
    },
  ]

  const {
    data,
    isError,
    isFetching,
    isPending,
  } = useQuery({
    ...modelsQuery,
    placeholderData: keepPreviousData,
  })

  const models = data?.items ?? []
  const pagination = data?.pagination
  const showSkeletons = isPending && !data
  const showErrorState = isError && !data
  const isRefreshing = isFetching && !showSkeletons

  return (
    <ResourceCardList
      searchPlaceholder={t('projects.detail.modelsPage.searchPlaceholder')}
      searchValue={query}
      onSearchChange={(nextQuery) => {
        void navigate({
          replace: true,
          search: prev => ({
            ...prev,
            q: nextQuery,
            page: 1,
          }),
        })
      }}
      sortOptions={sortFieldOptions}
      sortField={sortField}
      sortOrder={sortOrder}
      onSortChange={(nextField, nextOrder) => {
        void navigate({
          replace: true,
          search: prev => ({
            ...prev,
            sort: isSortField(nextField) ? nextField : prev.sort,
            order: nextOrder,
            page: 1,
          }),
        })
      }}
      refreshing={isRefreshing}
      toolbarEnd={(
        <Button
          h={32}
          px="md"
          radius={6}
          leftSection={<ModelIcon width={16} height={16} />}
          component={Link}
          to="/models/new"
        >
          {t('projects.detail.modelsPage.create')}
        </Button>
      )}
      pagination={pagination}
      page={page}
      onPageChange={(nextPage) => {
        void navigate({
          search: prev => ({
            ...prev,
            page: nextPage,
          }),
        })
      }}
      loading={showSkeletons}
      error={showErrorState}
      errorMessage={t('projects.detail.modelsPage.loadFailed')}
      emptyTitle={t('projects.detail.modelsPage.emptyTitle')}
      emptyDescription={t('projects.detail.modelsPage.emptyDescription')}
      totalLabel={t('shared.total', { count: pagination?.total ?? 0 })}
      skeletonCount={PAGE_SIZE}
    >
      {models.map((model) => {
        const modelName = model.name?.trim()

        return (
          <ResourceCard
            key={`${model.project ?? projectId}/${model.name ?? 'unknown'}`}
            title={buildModelTitle(model, projectId)}
            renderRoot={modelName
              ? (props: Record<string, unknown>) => (
                  <Link
                    {...props}
                    to="/projects/$projectId/models/$modelId"
                    params={{
                      projectId,
                      modelId: modelName,
                    }}
                  />
                )
              : undefined}
            badges={buildModelBadges(model)}
            metaItems={[
              {
                key: 'project',
                icon: <ProjectIcon width={16} height={16} />,
                value: model.project ?? projectId,
              },
              {
                key: 'size',
                icon: <ModelIcon width={16} height={16} />,
                value: formatStorageSize(model.size),
              },
              {
                key: 'updatedAt',
                icon: <ClockIcon width={16} height={16} />,
                value: formatDate(model.updatedAt),
              },
            ]}
          />
        )
      })}
    </ResourceCardList>
  )
}

function toSortParam(field: SortField, order: ModelsSearch['order']) {
  if (field !== 'updatedAt') {
    return undefined
  }

  return order === 'asc' ? 'updated_at_asc' : 'updated_at_desc'
}

function isSortField(value: unknown): value is SortField {
  return sortFieldSchema.safeParse(value).success
}

function buildModelTitle(model: Model, projectId: string) {
  const projectName = model.project ?? projectId
  const modelName = model.name?.trim()

  return `${projectName} / ${modelName || '-'}`
}

function buildModelBadges(model: Model): ResourceCardBadge[] {
  const badges: ResourceCardBadge[] = []
  const taskLabels = getLabelsByCategory(model.labels, Category.TASK)
  const libraryLabels = getLabelsByCategory(model.labels, Category.LIBRARY)

  for (const name of taskLabels) {
    badges.push({
      key: `task-${name}`,
      icon: (
        <PhotoUpIcon
          width={16}
          height={16}
          style={{ color: 'var(--mantine-color-blue-4)' }}
        />
      ),
      label: name,
    })
  }

  for (const name of libraryLabels) {
    badges.push({
      key: `library-${name}`,
      icon: /pytorch/i.test(name)
        ? <PytorchIcon width={16} height={16} />
        : undefined,
      label: name,
    })
  }

  if (model.parameterCount) {
    badges.push({
      key: 'parameterCount',
      icon: (
        <BinaryTreeIcon
          width={16}
          height={16}
          style={{ color: 'var(--mantine-color-violet-4)' }}
        />
      ),
      label: formatParameterCount(model.parameterCount),
    })
  }

  return badges
}

function getLabelsByCategory(labels: Label[] | undefined, category: Category) {
  return (labels ?? [])
    .filter(label => label.category === category && !!label.name)
    .map(label => label.name as string)
}

function formatParameterCount(value: string | undefined) {
  return formatNumberUnits(value, [
    ['T', 1_000_000_000_000],
    ['B', 1_000_000_000],
    ['M', 1_000_000],
    ['K', 1_000],
  ])
}

function formatStorageSize(value: string | undefined) {
  return formatNumberUnits(value, [
    ['TB', 1024 ** 4],
    ['GB', 1024 ** 3],
    ['MB', 1024 ** 2],
    ['KB', 1024],
    ['B', 1],
  ])
}

function formatNumberUnits(
  value: string | undefined,
  units: [string, number][],
) {
  if (!value) {
    return '-'
  }

  if (/[a-zA-Z]/.test(value)) {
    return value
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return value
  }

  for (const [unit, threshold] of units) {
    if (numericValue >= threshold) {
      const amount = numericValue / threshold

      return `${trimTrailingZero(amount >= 100 ? amount.toFixed(0) : amount.toFixed(1))} ${unit}`
    }
  }

  return `${numericValue}`
}

function trimTrailingZero(value: string) {
  return value.replace(/\.0$/, '')
}

function formatDate(value: string | undefined) {
  if (!value) {
    return '-'
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10)
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}
