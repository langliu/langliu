import ResourceCard from '@/components/resource-card'
import { data } from '@/data'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='min-h-screen items-center justify-items-center gap-16 p-4 pt-0 pb-20 font-sans md:p-8 md:pt-0'>
      <main className='row-start-2 grid items-center gap-8 sm:items-start'>
        {data.map((item) => (
          <div key={item.category} id={item.id}>
            <Link className=' font-bold text-2xl' href={`#${item.id}`}>
              <h2 className={'pb-4'}>{item.category}</h2>
            </Link>
            <ul className={'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'}>
              {item.data.map((item) => (
                <ResourceCard
                  title={item.title}
                  key={item.id}
                  description={item.description}
                  tags={item.tags}
                  href={item.link}
                  icon={item.icon}
                />
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  )
}
