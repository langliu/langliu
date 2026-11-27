import { useServerFn } from '@tanstack/react-start'
import { type FormEvent, useEffect, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import { saveVolume } from '~/lib/novels'

export function VolumeForm({
  open,
  onOpenChange,
  novelId,
  volume,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  novelId: string
  /** 传入则为重命名，否则为新增 */
  volume: { id: string; name: string } | null
  onSaved: () => void
}) {
  const save = useServerFn(saveVolume)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }
    setError(null)
    setName(volume?.name ?? '')
  }, [open, volume])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      await save({ data: { novelId, id: volume?.id, name } })
      onOpenChange(false)
      onSaved()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '保存失败')
    } finally {
      setPending(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='sm:max-w-sm'>
        <SheetHeader>
          <SheetTitle>{volume ? '重命名分卷' : '新增分卷'}</SheetTitle>
          <SheetDescription>
            {volume ? '修改分卷名称，卷里的章节不受影响。' : '分卷用来给章节分组，比如“第一卷”。'}
          </SheetDescription>
        </SheetHeader>
        <form className='flex flex-col gap-4 px-4 pb-2' onSubmit={onSubmit}>
          <div className='space-y-2'>
            <Label htmlFor='volume-name'>名称</Label>
            <Input
              id='volume-name'
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          {error ? <p className='text-sm text-destructive'>{error}</p> : null}

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
