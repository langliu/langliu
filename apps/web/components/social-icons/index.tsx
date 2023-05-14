import Image from 'next/image'
import { FC } from 'react'

// Icons taken from: https://simpleicons.org/

type Props = {
  kind: 'mail' | 'facebook' | 'github' | 'linkedin' | 'twitter' | 'youtube'
  href: string
  size: number
}

const icons = {
  mail: {
    src: '/mail.svg',
    alt: '邮件',
  },
  facebook: {
    src: '/facebook.svg',
    alt: '脸书',
  },
  github: {
    src: '/github.svg',
    alt: 'Github',
  },
  linkedin: {
    src: '/linkedin.svg',
    alt: '领英',
  },
  twitter: {
    src: '/twitter.svg',
    alt: '推特',
  },
  youtube: {
    src: '/youtube.svg',
    alt: 'YouTube',
  },
}

const SocialIcon: FC<Props> = ({ kind, href, size = 8 }) => {
  if (!href || (kind === 'mail' && !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href)))
    return null

  const icon = icons[kind]

  return (
    <a
      className='text-sm text-gray-500 transition hover:text-gray-600'
      target='_blank'
      rel='noopener noreferrer'
      href={href}
    >
      <span className='sr-only'>{kind}</span>
      <Image
        className='fill-current text-gray-700 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400'
        src={icon.src}
        alt='mail'
        width={size * 4}
        height={size * 4}
      />
    </a>
  )
}

export default SocialIcon
