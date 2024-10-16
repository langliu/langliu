import ResourceCard from '@/components/resource-card'
import { data } from '@/data'

export default function Home() {
  return (
    <div className='min-h-screen items-center justify-items-center gap-16 p-4 pb-20 font-sans sm:p-8'>
      <h1
        className={
          'mb-6 inline-block bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text font-bold text-4xl text-transparent'
        }
      >
        影视导航
      </h1>
      <main className='row-start-2 grid items-center gap-8 sm:items-start'>
        {data.map((item) => (
          <div key={item.category}>
            <h2 className='mb-4 font-bold text-2xl'>{item.category}</h2>
            <ul className={'grid grid-cols-3 gap-4 sm:grid-cols-2 md:grid-cols-3'}>
              {item.data.map((item) => (
                <ResourceCard
                  title={item.title}
                  key={item.id}
                  description={item.description}
                  tags={item.tags}
                  href={item.link}
                />
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  )
}
