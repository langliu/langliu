import Card from '@/components/Card'
import projectsData from '@/data/projectsData'
import Image from 'next/image'

export default function Projects() {
  return (
    <>
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14'>
            关于
          </h1>
        </div>
        <div className='container py-12'>
          <div className='flex flex-col items-center gap-4 flex-wrap text-center w-full'>
            <Image
              className='rounded-full'
              src={'/static/images/avatar.jpg'}
              width={200}
              height={200}
              alt={'头像'}
            />
            <p className='text-2xl leading-7 font-black'>刘浪</p>
            <p className='text-gray-500 dark:text-gray-400'>
              Professor of Atmospheric Science Stanford University mail github linkedin twitter
            </p>
            <p className='text-gray-500 dark:text-gray-400'>
              Tails Azimuth is a professor of atmospheric sciences at the Stanford AI Lab. His
              research interests includes complexity modelling of tailwinds, headwinds and
              crosswinds.
            </p>
            <p className='text-gray-500 dark:text-gray-400'>
              He leads the clean energy group which develops 3D air pollution-climate models, writes
              differential equation solvers, and manufactures titanium plated air ballons. In his
              free time he bakes raspberry pi.
            </p>
            <p className='text-gray-500 dark:text-gray-400'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique
              placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem
              nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
