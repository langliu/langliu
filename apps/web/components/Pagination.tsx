'use client'
import { ChevronLeft, ChevronRight, Replace } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from './ui/button'

interface Props {
  totalPages?: number
  currentPage: number
}

export default function Pagination({ totalPages = 0, currentPage = 1 }: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const hasPrev = currentPage > 1
  const hasNext = currentPage <= (totalPages ?? 0)

  const goToNextPage = () => {
    const params = new URLSearchParams(searchParams)
    params.set('page', `${currentPage + 1}`)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const goToPrevPage = () => {
    const params = new URLSearchParams(searchParams)
    params.set('page', `${currentPage - 1}`)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='mt-2 flex items-center justify-end gap-2'>
      {totalPages !== 0 && (
        <span>
          第{currentPage}/{totalPages}页
        </span>
      )}
      <Button
        variant={'outline'}
        size={'icon'}
        disabled={!hasPrev}
        className={'cursor-pointer disabled:cursor-not-allowed'}
        onClick={goToPrevPage}
      >
        <ChevronLeft className='size-4' />
      </Button>
      <Button
        variant={'outline'}
        size={'icon'}
        disabled={!hasNext}
        className={'cursor-pointer disabled:cursor-not-allowed'}
        onClick={goToNextPage}
      >
        <ChevronRight className='size-4' />
      </Button>
    </div>
  )
}
