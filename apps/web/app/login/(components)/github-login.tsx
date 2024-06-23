'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { createClient } from '@/libs/supabase/client'
import { Github, Loader } from 'lucide-react'
import { useState } from 'react'

export const GithubLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function loginWithGithub() {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.origin}/auth/callback`,
      },
    })

    if (error) {
      toast({
        description: error.message,
        title: error.name,
        variant: 'destructive',
        action: (
          <ToastAction altText="重试" onClick={loginWithGithub}>
            重试
          </ToastAction>
        ),
      })
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={loginWithGithub} disabled={isLoading}>
      {isLoading ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Github className="mr-2 h-4 w-4" />
      )}{' '}
      GitHub
    </Button>
  )
}
