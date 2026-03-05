import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/(app)/profile/')({
  component: RouteComponent,
  staticData: {
    navName: 'Profile',
  },
})

function RouteComponent() {
  return <div>Profile Page</div>
}
