import Form from './Form'
import { getAllModels } from './actions'
import Breadcrumbs from '@/components/Breadcrumbs'

export default async function Page() {
  const models = await getAllModels()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '专辑管理', href: '/dashboard/albums' },
          {
            label: '新建专辑',
            href: '/dashboard/albums/create',
            active: true,
          },
        ]}
      />
      <Form models={models ?? []} />
    </main>
  )
}
