import { useServerFn } from '@tanstack/react-start'
import { type FormEvent, useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import { Textarea } from '~/components/ui/textarea'
import {
  type NovelDetail,
  type NovelStatus,
  novelStatuses,
  novelStatusLabels,
} from '~/lib/novel-utils'
import { createNovel, updateNovel } from '~/lib/novels'

type EditableNovel = Pick<NovelDetail, 'id' | 'name' | 'author' | 'cover' | 'status' | 'intro'>

type Draft = {
  name: string
  author: string
  cover: string
  status: NovelStatus
  intro: string
}

const empty: Draft = { name: '', author: '', cover: '', status: 'serializing', intro: '' }

const statusItems = Object.fromEntries(
  novelStatuses.map((status) => [status, novelStatusLabels[status]]),
)

export function NovelForm({
  open,
  onOpenChange,
  novel,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 传入则为编辑，否则为新建 */
  novel: EditableNovel | null
  onSaved: (id: string) => void
}) {
  const saveNew = useServerFn(createNovel)
  const saveExisting = useServerFn(updateNovel)
  const [draft, setDraft] = useState<Draft>(empty)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }
    setError(null)
    setDraft(
      novel
        ? {
            name: novel.name,
            author: novel.author ?? '',
            cover: novel.cover ?? '',
            status: novel.status,
            intro: novel.intro ?? '',
          }
        : empty,
    )
  }, [open, novel])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      const data = {
        name: draft.name,
        author: draft.author || undefined,
        cover: draft.cover || undefined,
        status: draft.status,
        intro: draft.intro || undefined,
      }
      let id: string
      if (novel) {
        await saveExisting({ data: { id: novel.id, ...data } })
        id = novel.id
      } else {
        id = (await saveNew({ data })).id
      }
      onOpenChange(false)
      onSaved(id)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '保存失败')
    } finally {
      setPending(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>{novel ? '编辑小说' : '新增小说'}</SheetTitle>
          <SheetDescription>
            {novel ? '修改名称、封面、状态等信息。' : '先建一个空壳，分卷和章节进去之后再加。'}
          </SheetDescription>
        </SheetHeader>
        <form className='flex flex-col gap-4 px-4 pb-2' onSubmit={onSubmit}>
          <div className='space-y-2'>
            <Label htmlFor='novel-name'>名称</Label>
            <Input
              id='novel-name'
              required
              maxLength={100}
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-2'>
              <Label htmlFor='novel-author'>作者</Label>
              <Input
                id='novel-author'
                maxLength={50}
                value={draft.author}
                onChange={(event) => setDraft({ ...draft, author: event.target.value })}
              />
            </div>
            <div className='space-y-2'>
              <Label>状态</Label>
              <Select<NovelStatus>
                value={draft.status}
                onValueChange={(value) => value && setDraft({ ...draft, status: value })}
                items={statusItems}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {novelStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {novelStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='novel-cover'>封面地址</Label>
            <Input
              id='novel-cover'
              type='url'
              maxLength={500}
              placeholder='https://'
              value={draft.cover}
              onChange={(event) => setDraft({ ...draft, cover: event.target.value })}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='novel-intro'>简介</Label>
            <Textarea
              id='novel-intro'
              rows={4}
              maxLength={2000}
              value={draft.intro}
              onChange={(event) => setDraft({ ...draft, intro: event.target.value })}
            />
          </div>

          {error ? <p className='text-destructive text-sm'>{error}</p> : null}

          <SheetFooter className='px-0'>
            <Button type='submit' disabled={pending}>
              {pending ? '保存中…' : '保存'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
