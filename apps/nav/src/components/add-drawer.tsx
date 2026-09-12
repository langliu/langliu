import { Button } from '@langliu/ui/ui/button'
import { Input } from '@langliu/ui/ui/input'
import { Label } from '@langliu/ui/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@langliu/ui/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@langliu/ui/ui/sheet'
import { Textarea } from '@langliu/ui/ui/textarea'
import { useRouter } from '@tanstack/react-router'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  createCategory,
  createLink,
  createSubcategory,
  type NavCategory,
  type NavLinkItem,
  updateLink,
} from '~/lib/nav'

type Kind = 'category' | 'subcategory' | 'link'

export function AddDrawer({
  open,
  onOpenChange,
  board,
  editingLink,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  board: NavCategory[]
  editingLink: NavLinkItem | null
}) {
  const router = useRouter()
  const isEditing = editingLink != null
  const [kind, setKind] = useState<Kind>('link')
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState(board[0]?.id ?? '')
  const [subcategoryId, setSubcategoryId] = useState(board[0]?.subcategories[0]?.id ?? '')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const subcategories = useMemo(
    () =>
      board.flatMap((cat) => cat.subcategories.map((sub) => ({ ...sub, categoryName: cat.name }))),
    [board],
  )

  useEffect(() => {
    if (!open) {
      return
    }
    setError(null)
    if (editingLink) {
      setKind('link')
      setTitle(editingLink.title)
      setUrl(editingLink.url)
      setDescription(editingLink.description ?? '')
      setSubcategoryId(editingLink.subcategoryId)
      return
    }
    setKind('link')
    setName('')
    setTitle('')
    setUrl('')
    setDescription('')
    setCategoryId(board[0]?.id ?? '')
    setSubcategoryId(board[0]?.subcategories[0]?.id ?? '')
  }, [open, editingLink, board])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      if (isEditing && editingLink) {
        await updateLink({
          data: {
            id: editingLink.id,
            subcategoryId,
            title,
            url,
            description: description || undefined,
          },
        })
      } else if (kind === 'category') {
        await createCategory({ data: { name } })
      } else if (kind === 'subcategory') {
        await createSubcategory({ data: { categoryId, name } })
      } else {
        await createLink({
          data: {
            subcategoryId,
            title,
            url,
            description: description || undefined,
          },
        })
      }
      onOpenChange(false)
      await router.invalidate()
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
          <SheetTitle>{isEditing ? '编辑站点' : '新增'}</SheetTitle>
          <SheetDescription>
            {isEditing ? '修改站点名称、地址或所属分类。' : '写入一条分类、小分类，或导航地址。'}
          </SheetDescription>
        </SheetHeader>
        <form className='space-y-4 px-4 pb-2' onSubmit={onSubmit}>
          {isEditing ? null : (
            <div className='space-y-2'>
              <Label>类型</Label>
              <Select
                value={kind}
                onValueChange={(value) => value && setKind(value as Kind)}
                items={{
                  category: '大分类',
                  subcategory: '小分类',
                  link: '导航地址',
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='category'>大分类</SelectItem>
                  <SelectItem value='subcategory'>小分类</SelectItem>
                  <SelectItem value='link'>导航地址</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {!isEditing && kind === 'category' ? (
            <div className='space-y-2'>
              <Label htmlFor='category-name'>分类名</Label>
              <Input
                id='category-name'
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          ) : null}

          {!isEditing && kind === 'subcategory' ? (
            <>
              <div className='space-y-2'>
                <Label>所属大分类</Label>
                <Select
                  value={categoryId}
                  onValueChange={(value) => value && setCategoryId(value)}
                  items={Object.fromEntries(board.map((cat) => [cat.id, cat.name]))}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {board.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='sub-name'>小分类名</Label>
                <Input
                  id='sub-name'
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </>
          ) : null}

          {isEditing || kind === 'link' ? (
            <>
              <div className='space-y-2'>
                <Label>小分类</Label>
                <Select
                  value={subcategoryId}
                  onValueChange={(value) => value && setSubcategoryId(value)}
                  items={Object.fromEntries(
                    subcategories.map((sub) => [sub.id, `${sub.categoryName} / ${sub.name}`]),
                  )}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.categoryName} / {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='link-title'>名称</Label>
                <Input
                  id='link-title'
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='link-url'>地址</Label>
                <Input
                  id='link-url'
                  type='url'
                  required
                  placeholder='https://'
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='link-desc'>备注</Label>
                <Textarea
                  id='link-desc'
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </>
          ) : null}

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
