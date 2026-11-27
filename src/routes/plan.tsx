import { createFileRoute } from '@tanstack/react-router'
import { AppShell, PageHeader } from '~/components/app-shell'
import { ResourceCard } from '~/components/plan/resource-card'
import { Badge } from '~/components/ui/badge'
import { plan } from '~/data/plan'
import { analyticsScripts, getAnalyticsConfig } from '~/lib/analytics'
import { getNavBoard } from '~/lib/nav'
import { listNovels } from '~/lib/novels'
import { getSession } from '~/lib/session'

export const Route = createFileRoute('/plan')({
  loader: async () => {
    const [analytics, session] = await Promise.all([getAnalyticsConfig(), getSession()])
    if (!session) {
      return { analytics, email: null, board: [], novels: [] }
    }
    const [board, novels] = await Promise.all([getNavBoard(), listNovels()])
    return { analytics, email: session.user.email, board, novels }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: '影视导航' },
      {
        name: 'description',
        content:
          '影视导航致力于以丰富的内容、优良的观看体验要满足用户在线观看视频的需求，本站提供又新又热的电影、电视剧、动漫、综艺、游戏、娱乐视频在线观看综合影视尽在影视导航。',
      },
    ],
    scripts: loaderData ? analyticsScripts(loaderData.analytics) : [],
  }),
  component: PlanPage,
})

const totalResources = plan.reduce((total, section) => total + section.data.length, 0)

function PlanPage() {
  const { analytics, email, board, novels } = Route.useLoaderData()

  return (
    <AppShell email={email} board={board} novels={novels}>
      <PageHeader title='影视导航' description={`${totalResources} 个影视资源`} />

      <div id='top' className='mx-auto w-full max-w-6xl flex-1 space-y-10 p-6'>
        {analytics.gtmId ? (
          <noscript>
            {/* biome-ignore lint/a11y/useIframeTitle: GTM 官方回退片段，iframe 始终不可见 */}
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${analytics.gtmId}`}
              height={0}
              width={0}
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}

        {plan.map((section) => (
          <section key={section.id} id={section.id} className='scroll-mt-20 space-y-4'>
            <div className='flex items-center gap-2'>
              <a href={`#${section.id}`} className='hover:underline'>
                <h2 className='text-base font-semibold'>{section.category}</h2>
              </a>
              <Badge variant='secondary'>{section.data.length}</Badge>
            </div>
            <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
              {section.data.map((item) => (
                <li key={item.link}>
                  <ResourceCard
                    title={item.title}
                    description={item.description}
                    tags={item.tags}
                    href={item.link}
                    icon={item.icon}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </AppShell>
  )
}
