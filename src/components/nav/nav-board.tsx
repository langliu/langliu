import { useRouter } from '@tanstack/react-router'
import { ExternalLink, Folder, LayoutGrid, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AppShell } from '~/components/app-shell'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'
import { Switch } from '~/components/ui/switch'
import { deleteLink, type NavCategory, type NavLinkItem } from '~/lib/nav'
import { AddDrawer } from './add-drawer'

function countLinks(cat: NavCategory) {
  return cat.subcategories.reduce((total, sub) => total + sub.links.length, 0)
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function NavBoard({ board, email }: { board: NavCategory[]; email: string }) {
  const router = useRouter()
  const [activeId, setActiveId] = useState('all')
  const [editing, setEditing] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<NavLinkItem | null>(null)
  const [deletingLink, setDeletingLink] = useState<NavLinkItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const visible = useMemo(
    () => (activeId === 'all' ? board : board.filter((cat) => cat.id === activeId)),
    [activeId, board],
  )

  const activeName =
    activeId === 'all' ? '全部' : (board.find((cat) => cat.id === activeId)?.name ?? '全部')
  const visibleCount = visible.reduce((total, cat) => total + countLinks(cat), 0)

  function openCreate() {
    setEditingLink(null)
    setSheetOpen(true)
  }

  function openEdit(link: NavLinkItem) {
    setEditingLink(link)
    setSheetOpen(true)
  }

  async function confirmDelete() {
    if (!deletingLink) {
      return
    }
    setDeleting(true)
    try {
      await deleteLink({ data: { id: deletingLink.id } })
      setDeletingLink(null)
      await router.invalidate()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AppShell
      email={email}
      headerAction={
        <Button
          className='w-full justify-start bg-background text-foreground hover:bg-background/90'
          size='sm'
          onClick={openCreate}
        >
          <Plus />
          新增
        </Button>
      }
      groups={
        <SidebarGroup>
          <SidebarGroupLabel>分类</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeId === 'all'} onClick={() => setActiveId('all')}>
                  <LayoutGrid />
                  <span>全部</span>
                  <SidebarMenuBadge>
                    {board.reduce((total, cat) => total + countLinks(cat), 0)}
                  </SidebarMenuBadge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {board.map((cat) => (
                <SidebarMenuItem key={cat.id}>
                  <SidebarMenuButton
                    isActive={activeId === cat.id}
                    onClick={() => setActiveId(cat.id)}
                  >
                    <Folder />
                    <span>{cat.name}</span>
                    <SidebarMenuBadge>{countLinks(cat)}</SidebarMenuBadge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      }
      title={activeName}
      description={`${visibleCount} 个站点`}
      actions={
        <>
          <div className='flex items-center gap-2'>
            <Switch
              id='edit-mode'
              checked={editing}
              onCheckedChange={(checked) => setEditing(Boolean(checked))}
            />
            <Label htmlFor='edit-mode' className='text-sm'>
              编辑
            </Label>
          </div>
          <Button size='sm' variant='outline' onClick={openCreate} className='md:hidden'>
            <Plus />
            新增
          </Button>
        </>
      }
    >
      <div className='mx-auto w-full max-w-6xl flex-1 space-y-10 p-6'>
        {visible.length === 0 ? <EmptyState onAdd={openCreate} /> : null}
        {visible.map((cat) => (
          <section key={cat.id} className='space-y-5'>
            {activeId === 'all' ? (
              <div className='flex items-center gap-2'>
                <h2 className='font-semibold text-base'>{cat.name}</h2>
                <Badge variant='secondary'>{countLinks(cat)}</Badge>
              </div>
            ) : null}
            {cat.subcategories.length === 0 ? (
              <p className='text-muted-foreground text-sm'>这个分类还没有小分类。</p>
            ) : null}
            {cat.subcategories.map((sub) => (
              <div key={sub.id} className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <h3 className='font-medium text-muted-foreground text-sm'>{sub.name}</h3>
                  <Separator className='flex-1' />
                </div>
                {sub.links.length === 0 ? (
                  <p className='text-muted-foreground text-sm'>还没有站点。</p>
                ) : (
                  <div className='grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3'>
                    {sub.links.map((link) => (
                      <LinkCard
                        key={link.id}
                        link={link}
                        editing={editing}
                        onEdit={() => openEdit(link)}
                        onDelete={() => setDeletingLink(link)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
      <AddDrawer
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open)
          if (!open) {
            setEditingLink(null)
          }
        }}
        board={board}
        editingLink={editingLink}
      />

      <AlertDialog
        open={deletingLink != null}
        onOpenChange={(open) => !open && setDeletingLink(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除站点</AlertDialogTitle>
            <AlertDialogDescription>
              确定删除「{deletingLink?.title}」？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={confirmDelete} disabled={deleting}>
              {deleting ? '删除中…' : '删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  )
}

function LinkCard({
  link,
  editing,
  onEdit,
  onDelete,
}: {
  link: NavLinkItem
  editing: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const host = hostname(link.url)

  return (
    <div className='group relative'>
      <a
        href={link.url}
        target='_blank'
        rel='noreferrer'
        className='flex items-start gap-3 rounded-xl bg-card p-3 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50'
      >
        <img
          src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`}
          alt=''
          width={32}
          height={32}
          className='mt-0.5 size-8 rounded-md bg-muted'
        />
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-1.5'>
            <span className='truncate font-medium text-sm'>{link.title}</span>
            <ExternalLink className='size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' />
          </div>
          <p className='truncate text-muted-foreground text-xs'>{host}</p>
          {link.description ? (
            <p className='mt-1 line-clamp-2 text-muted-foreground text-xs'>{link.description}</p>
          ) : null}
        </div>
      </a>
      {editing ? (
        <div className='absolute top-2 right-2 hidden gap-1 group-hover:flex'>
          <Button
            type='button'
            size='icon-xs'
            variant='outline'
            className='bg-background'
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onEdit()
            }}
          >
            <Pencil />
            <span className='sr-only'>编辑</span>
          </Button>
          <Button
            type='button'
            size='icon-xs'
            variant='destructive'
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 />
            <span className='sr-only'>删除</span>
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
      <p className='font-medium text-sm'>还没有导航</p>
      <p className='mt-1 text-muted-foreground text-sm'>先新增一个分类或站点。</p>
      <Button className='mt-4' size='sm' onClick={onAdd}>
        <Plus />
        新增
      </Button>
    </div>
  )
}
