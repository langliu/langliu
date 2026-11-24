import { useRouter } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { authClient } from '~/lib/auth-client'

export function LoginForm({ setup }: { setup: boolean }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    const result = setup
      ? await authClient.signUp.email({
          email,
          password,
          name: email.split('@')[0] || 'me',
        })
      : await authClient.signIn.email({ email, password })

    setPending(false)

    if (result.error) {
      setError(result.error.message || '登录失败')
      return
    }

    await router.invalidate()
    await router.navigate({ to: '/' })
  }

  return (
    <form className='grid gap-4' onSubmit={onSubmit}>
      <div className='grid gap-2'>
        <Label htmlFor='email'>邮件</Label>
        <Input
          id='email'
          type='email'
          autoComplete='email'
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder='you@example.com'
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='password'>密码</Label>
        <Input
          id='password'
          type='password'
          autoComplete={setup ? 'new-password' : 'current-password'}
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error ? <p className='text-destructive text-sm'>{error}</p> : null}
      <Button type='submit' className='w-full' disabled={pending}>
        {pending ? '请稍候…' : setup ? '创建账号' : '登录'}
      </Button>
    </form>
  )
}
