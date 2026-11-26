import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginForm } from '~/components/nav/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { getSession, needsSetup } from '~/lib/session'

/** 登录后要跳回去的页面：只接受站内的绝对路径，免得被带到别的站点。 */
function safeRedirect(value: string | undefined) {
  return value && /^\/(?![/\\])/.test(value) && !value.startsWith('/login') ? value : '/'
}

export const Route = createFileRoute('/login')({
  validateSearch: z.object({ redirect: z.string().optional() }),
  loaderDeps: ({ search }) => ({ redirect: search.redirect }),
  loader: async ({ deps }) => {
    const session = await getSession()
    if (session) {
      throw redirect({ href: safeRedirect(deps.redirect) })
    }
    return { setup: await needsSetup() }
  },
  component: LoginPage,
})

function LoginPage() {
  const { setup } = Route.useLoaderData()
  const { redirect } = Route.useSearch()

  return (
    <main className='flex min-h-svh items-center justify-center p-6'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>{setup ? '创建账号' : '登录'}</CardTitle>
          <CardDescription>
            {setup ? '还没有账号，先创建第一个管理员入口。' : '使用邮件和密码登录导航。'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm setup={setup} redirectTo={safeRedirect(redirect)} />
        </CardContent>
      </Card>
    </main>
  )
}
