'use client'
import { Navbar } from '@/components/Navbar'
import NewsletterForm from '@/components/NewsletterForm'
import siteMetadata from '@/data/siteMetadata'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'

export default function Home() {
  return (
    <>
      <Navbar />
      <CldImage
        src="https://res.cloudinary.com/dvlxngmeg/image/upload/v1719110496/photo/0014_ieq1qg.avif" // Use this sample image or upload your own via the Media Explorer
        width="500" // Transform the image: auto-crop to square aspect_ratio
        height="500"

        alt=''
        // crop={{
        //   type: 'auto',
        //   source: true,
        // }}
      />
      {/* <PageSEO title={siteMetadata.title} description={siteMetadata.description} /> */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            最新の投稿
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
      </div>

      {siteMetadata.newsletter.provider !== '' && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
