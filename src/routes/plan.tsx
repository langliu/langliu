import { createFileRoute } from '@tanstack/react-router'
import { PlanSidebar } from '~/components/plan/plan-sidebar'
import { ResourceCard } from '~/components/plan/resource-card'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { plan } from '~/data/plan'
import { analyticsScripts, getAnalyticsConfig } from '~/lib/analytics'

export const Route = createFileRoute('/plan')({
  loader: () => getAnalyticsConfig(),
  head: ({ loaderData }) => ({
    meta: [
      { title: '影视导航' },
      {
        name: 'description',
        content:
          '影视导航致力于以丰富的内容、优良的观看体验要满足用户在线观看视频的需求，本站提供又新又热的电影、电视剧、动漫、综艺、游戏、娱乐视频在线观看综合影视尽在影视导航。',
      },
    ],
    scripts: loaderData ? analyticsScripts(loaderData) : [],
  }),
  component: PlanPage,
})

function PlanPage() {
  const analytics = Route.useLoaderData()

  return (
    <SidebarProvider>
      <PlanSidebar />
      <main>
        <SidebarTrigger />
        <div className='min-h-screen p-4 pt-0 pb-20 md:p-8 md:pt-0'>
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
          <div className='grid items-center gap-8 sm:items-start'>
            {plan.map((section) => (
              <div key={section.id} id={section.id}>
                <a className='font-bold text-2xl' href={`#${section.id}`}>
                  <h2 className='pb-4'>{section.category}</h2>
                </a>
                <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                  {section.data.map((item) => (
                    <ResourceCard
                      key={item.link}
                      title={item.title}
                      description={item.description}
                      tags={item.tags}
                      href={item.link}
                      icon={item.icon}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
