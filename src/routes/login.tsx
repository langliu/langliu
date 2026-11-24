import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '~/components/nav/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { getSession, needsSetup } from '~/lib/session'

export const Route = createFileRoute('/login')({
  loader: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({ to: '/' })
    }
    return { setup: await needsSetup() }
  },
  component: LoginPage,
})

function LoginPage() {
  const { setup } = Route.useLoaderData()

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
          <LoginForm setup={setup} />
        </CardContent>
      </Card>
    </main>
  )
}
