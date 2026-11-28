import { createFileRoute, redirect } from '@tanstack/react-router'

import { getSession } from '~/lib/session'

// 小说管理和阅读都放在这个布局下面；以后想让阅读页公开，把 read 路由挪出去即可。
export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session) {
      // 记下想去的站内页面，登录后跳回来
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
    return { email: session.user.email }
  },
})
