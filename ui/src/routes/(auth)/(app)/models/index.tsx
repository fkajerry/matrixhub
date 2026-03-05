import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/(app)/models/')({
  component: RouteComponent,
  staticData: {
    navName: 'Models',
  },
})

function RouteComponent() {
  return <div>Models Page</div>
}
