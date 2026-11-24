/// <reference types='vite/client' />

import { createRootRoute, HeadContent, Outlet, Scripts, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { ReactNode } from 'react'
import { Toaster } from '~/components/ui/toast'
import appCss from '~/styles/app.css?url'

// 个人导航固定深色，影视导航沿用原来的浅色
const lightRoutes = ['/plan']

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: '导航' },
      { name: 'description', content: '个人导航' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  return <Outlet />
}

function RootDocument({ children }: { children: ReactNode }) {
  const dark = useLocation({
    select: ({ pathname }) => !lightRoutes.some((route) => pathname.startsWith(route)),
  })

  return (
    <html lang='zh-CN' className={dark ? 'dark' : undefined}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        {import.meta.env.DEV ? <TanStackRouterDevtools position='bottom-right' /> : null}
        <Scripts />
      </body>
    </html>
  )
}
