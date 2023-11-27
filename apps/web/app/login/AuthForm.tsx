'use client'
import { Database } from './database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()

  return (
    <Auth
      supabaseClient={supabase}
      view='magic_link'
      appearance={{ theme: ThemeSupa }}
      theme='dark'
      showLinks={false}
      providers={['google', 'twitter', 'github']}
      redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
      localization={{
        variables: {
          sign_in: {
            email_label: '邮件地址',
            password_label: '登录密码',
            email_input_placeholder: '请输入你的邮件地址',
            password_input_placeholder: '请输入你的密码',
            button_label: '登录',
          },
          sign_up: {
            email_label: '邮件地址',
            password_label: '登录密码',
            email_input_placeholder: '请输入你的邮件地址',
          },
          magic_link: {
            email_input_label: '邮件地址',
            email_input_placeholder: '请输入你的邮件地址',
            button_label: '发送登录链接',
            loading_button_label: '正在发送登录链接 ...',
            link_text: 'Send a magic link email',
            confirmation_text: '查看您的电子邮件中的魔法链接',
          },
        },
      }}
      socialLayout='horizontal'
    />
  )
}
