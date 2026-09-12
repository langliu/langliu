/// <reference types='vite/client' />

import { Toaster } from '@langliu/ui/ui/toast'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { ReactNode } from 'react'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: '导航' },
      { name: 'description', content: '个人导航' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  return <Outlet />
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang='zh-CN' className='dark'>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <TanStackRouterDevtools position='bottom-right' />
        <Scripts />
      </body>
    </html>
  )
}
