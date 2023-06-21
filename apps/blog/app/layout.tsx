import Footer from '../components/Footer'
import { server } from '../config'
import '../styles/globals.css'
import ClientThemeProvider from './theme-provider'
import Header from 'components/Header'
import AnalyticsWrapper from 'components/analytics'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: '研之有物 - Innovative Researcher and Skilled Mentor',
    template: '%s - 研之有物',
  },
  description:
    "研之有物 is a recent college graduate with a solid foundation in computer science as well as competence in exploratory data analysis, 机器学习, 计算机视觉, and statistics. He is currently working as a Research Assistant at the Independent University, Bangladesh's Center for Computational and Data Sciences.",
  generator: '研之有物 - Personal Website',
  applicationName: '研之有物 - Personal Website',
  referrer: 'origin-when-cross-origin',
  keywords: [
    '研之有物',
    'Mir Sazzat',
    'Sazzat',
    'Sazzat Hossain',
    'Mir',
    'Hossain',
    '研之有物',
    '研之有物 - Innovative Researcher and Skilled Mentor',
    '研之有物 - Personal Website',
    'Sajjad',
    'Sajjat',
    'Hossain',
    'Sazzad',
    'Mir Github',
  ],
  authors: [
    {
      name: '研之有物',
      url: `${server}`,
    },
  ],
  themeColor: '#ffffff',
  colorScheme: 'light',
  creator: '研之有物',
  publisher: '研之有物',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    title: '研之有物 - Innovative Researcher and Skilled Mentor',
    description:
      "研之有物 is a recent college graduate with a solid foundation in computer science as well as competence in exploratory data analysis, 机器学习, 计算机视觉, and statistics. He is currently working as a Research Assistant at the Independent University, Bangladesh's Center for Computational and Data Sciences.",
    url: `${server}`,
    siteName: '研之有物 - Innovative Researcher and Skilled Mentor',
    images: [
      {
        url: `${server}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: '研之有物 - Innovative Researcher and Skilled Mentor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': 0,
      'max-image-preview': 'large',
      'max-snippet': 0,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
      },
      new URL('/favicon.ico', server).href,
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
      },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: `${server}/site.webmanifest`,
  twitter: {
    card: 'summary_large_image',
    site: '@mir_sazzat',
    title: '研之有物 - Innovative Researcher and Skilled Mentor',
    description:
      "研之有物 is a recent college graduate with a solid foundation in computer science as well as competence in exploratory data analysis, 机器学习, 计算机视觉, and statistics. He is currently working as a Research Assistant at the Independent University, Bangladesh's Center for Computational and Data Sciences.",
    creator: '@mir_sazzat',
    images: [
      {
        url: `${server}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: '研之有物 - Innovative Researcher and Skilled Mentor',
      },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'google-site-verification=0',
    bing: 'msvalidate.01=0',
    yandex: 'yandex-verification=0',
  },

  alternates: {
    canonical: `${server}`,
    types: {
      'application/rss+xml': `${server}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-CN'>
      <head />
      <body className='flex h-full flex-col bg-zinc-50 dark:bg-black min-h-screen'>
        <ClientThemeProvider>
          <div className='fixed inset-0 flex justify-center sm:px-8'>
            <div className='flex w-full max-w-7xl lg:px-8'>
              <div className='w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20' />
            </div>
          </div>
          <div className='relative'>
            <Header />
            <main>{children}</main>
            <AnalyticsWrapper />
            <Footer />
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  )
}
