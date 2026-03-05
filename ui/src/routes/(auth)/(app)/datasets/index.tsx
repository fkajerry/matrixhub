import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/(app)/datasets/')({
  component: RouteComponent,
  staticData: {
    navName: 'Datasets',
  },
})

function RouteComponent() {
  return <div>Datasets Page</div>
}
