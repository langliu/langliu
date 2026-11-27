import { useServerFn } from '@tanstack/react-start'
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react'
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
import { createNovel, updateNovel, uploadCover } from '~/lib/novels'

type EditableNovel = Pick<NovelDetail, 'id' | 'name' | 'author' | 'cover' | 'status' | 'intro'>

type Draft = {
  name: string
  author: string
  cover: string
  status: NovelStatus
  intro: string
}

const empty: Draft = { name: '', author: '', cover: '', status: 'serializing', intro: '' }

const COVER_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
const COVER_MAX_BYTES = 2 * 1024 * 1024

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
  const upload = useServerFn(uploadCover)
  const [draft, setDraft] = useState<Draft>(empty)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const coverInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    setError(null)
    setCoverFile(null)
    if (coverInput.current) {
      coverInput.current.value = ''
    }
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

  function clearCoverFile() {
    setCoverFile(null)
    if (coverInput.current) {
      coverInput.current.value = ''
    }
  }

  function onCoverFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      setCoverFile(null)
      return
    }
    if (!COVER_MIME_TYPES.has(file.type)) {
      setError('封面只支持 PNG、JPG、WebP 或 GIF')
      clearCoverFile()
      return
    }
    if (file.size === 0) {
      setError('封面文件为空')
      clearCoverFile()
      return
    }
    if (file.size > COVER_MAX_BYTES) {
      setError('封面图片最大 2MB')
      clearCoverFile()
      return
    }
    setError(null)
    setCoverFile(file)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      let cover = draft.cover.trim() || undefined
      // 选了文件先上传到对象存储，把返回的站内地址存进封面字段；
      // 若后续保存失败，也回填已上传地址并清掉本地文件，避免重试时重复上传
      if (coverFile) {
        const formData = new FormData()
        formData.append('file', coverFile)
        cover = (await upload({ data: formData })).url
        setDraft((current) => ({ ...current, cover: cover ?? '' }))
        clearCoverFile()
      }
      const data = {
        name: draft.name,
        author: draft.author || undefined,
        cover,
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
              type='text'
              maxLength={500}
              placeholder='https:// 或上传本地图片'
              disabled={coverFile != null}
              value={draft.cover}
              onChange={(event) => setDraft({ ...draft, cover: event.target.value })}
            />
            <div className='flex items-center justify-between gap-2'>
              <Label htmlFor='novel-cover-file' className='text-muted-foreground text-xs'>
                或上传本地图片（PNG/JPG/WebP/GIF，≤2MB）
              </Label>
              <Button
                type='button'
                size='xs'
                variant='outline'
                disabled={pending}
                onClick={() => coverInput.current?.click()}
              >
                {coverFile ? '重新选择' : '选择文件'}
              </Button>
            </div>
            <input
              ref={coverInput}
              id='novel-cover-file'
              type='file'
              accept='image/png,image/jpeg,image/webp,image/gif'
              className='hidden'
              onChange={onCoverFile}
            />
            {coverFile ? (
              <div className='text-muted-foreground flex items-center justify-between gap-2 text-xs'>
                <p className='min-w-0 truncate'>已选文件：{coverFile.name}</p>
                <Button
                  type='button'
                  size='xs'
                  variant='ghost'
                  disabled={pending}
                  onClick={clearCoverFile}
                >
                  清除
                </Button>
              </div>
            ) : null}
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
