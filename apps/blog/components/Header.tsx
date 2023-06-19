'use client'

import Avatar from './Avatar'
import { Container } from './Container'
import DesktopNavigation from './DesktopNavigation'
import MobileNavigation from './MobileNavigation'
import ThemeSelector from './ThemeSelector'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const navigations = [
  { href: '/', label: '首页' },
  { href: '/articles', label: '文章' },
  { href: '/projects', label: '项目' },
  { href: '/snippets', label: '代码片段' },
  { href: '/resources', label: '资源' },
]

function clamp(value: number, a: number, b: number): number {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  return Math.min(Math.max(value, min), max)
}

function AvatarContainer({
  className,
  ...props
}: {
  className?: string
  [key: string]: unknown
}): JSX.Element {
  return (
    <div
      className={clsx(
        className,
        'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10',
      )}
      {...props}
    />
  )
}

export default function Header(): JSX.Element {
  const isHomePage = usePathname() === '/'

  const headerRef = useRef()
  const avatarRef = useRef()
  const isInitial = useRef(true)

  useEffect(() => {
    const downDelay = (avatarRef.current as any)?.offsetTop ?? 0
    const upDelay = 64

    function setProperty({ property, value }: { [key: string]: any }): void {
      document.documentElement.style.setProperty(property, value)
    }

    function updateHeaderStyles(): void {
      const { top, height } = (headerRef.current as any).getBoundingClientRect()
      const scrollY = clamp(window.scrollY, 0, document.body.scrollHeight - window.innerHeight)

      if (isInitial.current) {
        setProperty({ property: '--header-position', value: 'sticky' })
      }

      setProperty({ property: '--content-offset', value: `${downDelay}px` })

      if (isInitial.current || scrollY < downDelay) {
        setProperty({
          property: '--header-height',
          value: `${downDelay + height}px`,
        })
        setProperty({ property: '--header-mb', value: `${-downDelay}px` })
      } else if (top + height < -upDelay) {
        const offset = Math.max(height, scrollY - upDelay)
        setProperty({ property: '--header-height', value: `${offset}px` })
        setProperty({ property: '--header-mb', value: `${height - offset}px` })
      } else if (top === 0) {
        setProperty({
          property: '--header-height',
          value: `${scrollY + height}px`,
        })
        setProperty({ property: '--header-mb', value: `${-scrollY}px` })
      }
    }

    function updateAvatarStyles(): void {
      if (!isHomePage) {
        return
      }

      const fromScale = 1
      const toScale = 36 / 64
      const fromX = 0
      const toX = 2 / 16

      const scrollY = downDelay - window.scrollY

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale
      scale = clamp(scale, fromScale, toScale)

      let x = (scrollY * (fromX - toX)) / downDelay + toX
      x = clamp(x, fromX, toX)

      setProperty({
        property: '--avatar-image-transform',
        value: `translate3d(${x}rem, 0, 0) scale(${scale})`,
      })

      const borderScale = 1 / (toScale / scale)
      const borderX = (-toX + x) * borderScale
      const borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`

      setProperty({
        property: '--avatar-border-transform',
        value: borderTransform,
      })
      setProperty({
        property: '--avatar-border-opacity',
        value: scale === toScale ? 1 : 0,
      })
    }

    function updateStyles(): void {
      updateHeaderStyles()
      updateAvatarStyles()
      isInitial.current = false
    }

    updateStyles()
    window.addEventListener('scroll', updateStyles, { passive: true })
    window.addEventListener('resize', updateStyles)

    return () => {
      window.removeEventListener('scroll', updateStyles, {
        passive: true,
      })
      window.removeEventListener('resize', updateStyles)
    }
  }, [isHomePage])

  return (
    <>
      <header
        className='pointer-events-none relative z-50 flex flex-col'
        style={{
          height: 'var(--header-height)',
          marginBottom: 'var(--header-mb)',
        }}
      >
        {isHomePage && (
          <>
            <div
              ref={avatarRef as any}
              className='order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]'
            />
            <Container
              className='top-0 order-last -mb-3 pt-3'
              style={{ position: 'var(--header-position)' }}
            >
              <div className='relative'>
                <AvatarContainer
                  className='absolute left-0 top-3 origin-left transition-opacity'
                  style={{
                    opacity: 'var(--avatar-border-opacity, 0)',
                    transform: 'var(--avatar-border-transform)',
                  }}
                />
                <Avatar
                  large
                  className='block h-16 w-16 origin-left'
                  style={{ transform: 'var(--avatar-image-transform)' }}
                />
              </div>
            </Container>
          </>
        )}
        <div
          ref={headerRef as any}
          className='top-0 z-10 pt-6'
          style={{
            position: 'var(--header-position)' as any,
          }}
        >
          <Container>
            <div className='relative flex gap-4'>
              <div className='flex flex-1'>
                {!isHomePage && (
                  <AvatarContainer>
                    <Avatar />
                  </AvatarContainer>
                )}
              </div>
              <div className='flex flex-1 justify-end md:justify-center'>
                <MobileNavigation links={navigations} className='pointer-events-auto md:hidden' />
                <DesktopNavigation
                  links={navigations}
                  className='pointer-events-auto hidden md:block'
                />
              </div>
              <div className='flex justify-end md:flex-1'>
                <div className='pointer-events-auto'>
                  <ThemeSelector />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>
      {isHomePage && <div style={{ height: 'var(--content-offset)' }} />}
    </>
  )
}
