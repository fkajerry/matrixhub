import {
  Group,
  NavLink,
  ScrollArea,
  Stack,
} from '@mantine/core'
import {
  createFileRoute,
  Link,
  Outlet,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createFileRoute('/(auth)/admin')({
  component: AdminLayout,
  staticData: {
    navName: 'Admin',
  },
})

function AdminNavbar() {
  const router = useRouter()
  const activeRouteIds = useRouterState({
    select: state => state.matches.map(match => match.routeId),
  })

  const adminRoute = router.routesById['/(auth)/admin']
  const navRoutes = useMemo(() => {
    const children = adminRoute?.children

    if (!children) {
      return []
    }

    return Object.values(children)
      .filter(route => typeof route.options.staticData?.navName === 'string')
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
  }, [adminRoute])

  return (
    <ScrollArea>
      <Stack gap={0}>
        {navRoutes.map((route) => {
          const isActive = activeRouteIds.includes(route.id)

          return (
            <NavLink
              key={route.id}
              label={route.options.staticData?.navName ?? route.id}
              component={Link}
              to={route.to}
              active={isActive}
            />
          )
        })}
      </Stack>
    </ScrollArea>
  )
}

function AdminLayout() {
  return (
    <Group
      align="flex-start"
      wrap="nowrap"
      gap={0}
      style={{ height: '100%' }}
    >
      <nav style={{
        width: 200,
        flexShrink: 0,
      }}
      >
        {/* Placeholder to display admin routes */}
        <AdminNavbar />
      </nav>
      <div style={{
        flex: 1,
        padding: 'var(--mantine-spacing-md)',
      }}
      >
        <Outlet />
      </div>
    </Group>
  )
}
