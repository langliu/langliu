import { TooltipProvider } from '@langliu/ui/ui/tooltip'
import { redirect } from 'next/navigation'
import { createClient } from '@/libs/supabase/server'
import Panel from './(components)/Panel'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <TooltipProvider delay={0}>
      <div className='flex h-screen flex-col md:overflow-hidden'>
        <Panel>{children}</Panel>
      </div>
    </TooltipProvider>
  )
}
