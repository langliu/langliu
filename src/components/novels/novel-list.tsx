import { Link, useRouter } from '@tanstack/react-router'
import { BookOpen, Plus } from 'lucide-react'
import { useState } from 'react'
import { ClientDate } from '~/components/novels/client-date'
import { NovelCover } from '~/components/novels/novel-cover'
import { NovelForm } from '~/components/novels/novel-form'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { formatWords, type NovelSummary, novelStatusLabels } from '~/lib/novel-utils'

export function NovelList({ novels }: { novels: NovelSummary[] }) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  async function onCreated(id: string) {
    await router.invalidate()
    await router.navigate({ to: '/novels/$novelId', params: { novelId: id } })
  }

  return (
    <div className='mx-auto w-full max-w-6xl flex-1 space-y-4 p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='font-semibold text-base'>书架</h2>
        <Button size='sm' onClick={() => setCreating(true)}>
          <Plus />
          新增小说
        </Button>
      </div>

      {novels.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <BookOpen className='size-8 text-muted-foreground' />
          <p className='mt-3 font-medium text-sm'>书架还是空的</p>
          <p className='mt-1 text-muted-foreground text-sm'>先新增一本小说，再往里加分卷和章节。</p>
          <Button className='mt-4' size='sm' onClick={() => setCreating(true)}>
            <Plus />
            新增小说
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5'>
          {novels.map((novel) => (
            <Link
              key={novel.id}
              to='/novels/$novelId'
              params={{ novelId: novel.id }}
              className='group space-y-2'
            >
              <NovelCover
                src={novel.cover}
                name={novel.name}
                className='w-full transition-opacity group-hover:opacity-85'
              />
              <div>
                <span className='block truncate font-medium text-sm'>{novel.name}</span>
                <div className='mt-1 flex items-center gap-2 text-muted-foreground text-xs'>
                  <Badge variant='secondary'>{novelStatusLabels[novel.status]}</Badge>
                  <span className='truncate'>{novel.author ?? '佚名'}</span>
                </div>
                <p className='mt-1 text-muted-foreground text-xs'>
                  {novel.chapterCount} 章 · {formatWords(novel.wordCount)} 字 · 更新于{' '}
                  <ClientDate time={novel.updatedAt} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <NovelForm open={creating} onOpenChange={setCreating} novel={null} onSaved={onCreated} />
    </div>
  )
}
