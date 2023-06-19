// import SpotifyPlayingNow from "./SpotifyPlayingNow";
import { Container } from 'components/Container'
import Link from 'next/link'

const navigations = [
  { href: '/articles', label: '文章' },
  { href: '/projects', label: '项目' },
  { href: '/snippets', label: '代码片段' },
  { href: '/resources', label: '资源' },
]

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className='transition hover:text-teal-500 dark:hover:text-teal-400'>
      {children}
    </Link>
  )
}

export default function Footer(): JSX.Element {
  return (
    <footer className='mt-32'>
      <Container.Outer>
        <div className='border-t border-zinc-100 pt-8 pb-16 dark:border-zinc-700/40'>
          <Container.Inner>
            {/* <SpotifyPlayingNow /> */}
            <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
              <div className='flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200'>
                {navigations.map((navigation) => (
                  <NavLink key={navigation.href} href={navigation.href}>
                    {navigation.label}
                  </NavLink>
                ))}
              </div>
              <p className='text-sm text-zinc-400 dark:text-zinc-500'>
                © {new Date().getFullYear()} 版权所有
              </p>
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  )
}
