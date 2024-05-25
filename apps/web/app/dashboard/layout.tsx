import { TooltipProvider } from '@/components/ui/tooltip'
import { createClient } from '@/libs/supabase/server'
import { redirect } from 'next/navigation'
import Panel from './(components)/Panel'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen flex-col  md:overflow-hidden">
        <Panel>{children}</Panel>
      </div>
    </TooltipProvider>
  )
}
