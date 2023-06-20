import About from './About'
import Server from './Server'
import AboutPlaceholder from 'components/skeleton/AboutPlaceholder'
import ArticlesPlaceholder from 'components/skeleton/ArticlesPlaceholder'
import EducationsPlaceholder from 'components/skeleton/EducationsPlaceholder'
import ExperiencesPlaceholder from 'components/skeleton/ExperiencesPlaceholder'
import LifeEventsPlaceholder from 'components/skeleton/LifeEventsPlaceholder'
import PublicationsPlaceholder from 'components/skeleton/PublicationsPlaceholder'
import fs from 'fs'
import { Suspense } from 'react'
import generateRss from 'utils/generate-rss'

export default async function Home(): Promise<JSX.Element> {
  if (fs.existsSync('public')) {
    await generateRss()
  }

  return (
    <>
      <Suspense fallback={<AboutPlaceholder />}>
        <About />
      </Suspense>

      <Suspense fallback={<EducationsPlaceholder />}>
        <Server component='Educations' />
      </Suspense>

      <Suspense fallback={<ExperiencesPlaceholder />}>
        <Server component='Experiences' />
      </Suspense>

      <Suspense fallback={<PublicationsPlaceholder />}>
        <Server component='Publications' />
      </Suspense>

      <Suspense fallback={<ArticlesPlaceholder />}>
        <Server component='Articles' />
      </Suspense>

      <Suspense fallback={<LifeEventsPlaceholder />}>
        <Server component='LifeEvents' />
      </Suspense>
    </>
  )
}
