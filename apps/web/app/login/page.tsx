import AuthForm from './AuthForm'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='flex flex-col justify-center items-center h-screen gap-6'>
      <div className='col-6 w-10/12 md:w-1/2 2xl:w-1/3'>
        <h1 className='header text-2xl'>Supabase Auth + Storage</h1>
        <p className=''>
          Experience our Auth and Storage through a simple profile management example. Create a user
          profile and upload an avatar image. Fast, simple, secure.
        </p>
      </div>
      <div className='col-6 auth-widget w-10/12 md:w-1/2 2xl:w-1/3'>
        <AuthForm />
      </div>
      <div>
        <Link href={'/test'}>现在尝试</Link>
      </div>
    </div>
  )
}
