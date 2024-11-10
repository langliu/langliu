'use server'
import TranslateForm from './form'

export default async function Home() {
  return (
    <div className='grid min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20 lg:p-12'>
      <main className='w-full'>
        <TranslateForm />
      </main>
    </div>
  )
}
