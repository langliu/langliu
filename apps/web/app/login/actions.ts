'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/libs/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  console.log('data', data)
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error(error.message)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function githubLogin() {
  const supabase = createClient()
  console.log('github----------')
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:3001/auth/callback',
    },
  })

  if (error) {
    console.error(error.message)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
