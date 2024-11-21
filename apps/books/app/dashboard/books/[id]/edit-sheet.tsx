'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { getWordCount } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Article } from '@prisma/client'
import { useDebounceFn } from 'ahooks'
import { clsx } from 'clsx'
import { Guitar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getArticle, insertArticle, updateArticle } from './actions'

const formSchema = z.object({
  order: z.coerce
    .number({
      required_error: '请输入章节序号',
    })
    .min(1, '序号不能小于1'),
  title: z.string({ required_error: '请输入标题' }),
  content: z.string({ required_error: '请输入章节内容' }).min(1, '请输入章节内容'),
})

export type CreateSheetProps = {
  bookId: string
  id?: string
  last?: number
  type?: 'edit' | 'create'
  customTrigger?: ReactNode
  onOpenChange?: (open: boolean) => void
}

export type EditSheetProps = CreateSheetProps & {
  id: string
}

export function EditSheet({
  bookId,
  id,
  last,
  type = 'edit',
  customTrigger,
}: CreateSheetProps | EditSheetProps) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const handleSuccess = () => {
    setOpen(false)
    router.refresh()
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      order: last ?? 1,
    },
  })

  const { run: handleSubmit } = useDebounceFn(
    async (values: z.infer<typeof formSchema>, close = true) => {
      try {
        if (type === 'create') {
          await insertArticle({
            ...values,
            bookId,
            wordCount: getWordCount(values?.content),
          })
          if (close) {
            form.reset()
            handleSuccess()
          } else {
            form.setValue('title', '')
            form.setValue('content', '')
            form.setValue('order', Number.parseInt(form.getValues('order')) + 1)
          }
        } else if (id) {
          await updateArticle(
            {
              ...values,
              id: id,
              wordCount: getWordCount(values?.content),
              bookId,
            },
            article?.wordCount ?? 0,
          )
        }
        if (close) {
          form.reset()
          handleSuccess()
        }
      } catch (error) {
        console.error(error)
        toast({
          title: '编辑失败',
          description: (error as Error)?.message ?? '',
          variant: 'destructive',
        })
      }
    },
    {
      wait: 1000,
    },
  )

  const submitAndContinue = () => {
    const formData = form.getValues()
    handleSubmit({ ...formData, order: Number.parseInt(formData.order) }, false)
  }

  useEffect(() => {
    if (open && id && type === 'edit') {
      getArticle(id)
        .then((res) => {
          form.setValue('title', res?.title ?? '')
          form.setValue('content', res?.content ?? '')
          form.setValue('order', res?.order ?? 0)
          setArticle(res)
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }, [id, open, form, type])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={'w-full'}>
        {customTrigger ? customTrigger : type === 'edit' ? '编辑' : '新建'}
      </SheetTrigger>
      <SheetContent
        className={clsx('flex w-[600px] flex-col sm:w-[800px] sm:max-w-full', {
          'sm:w-screen': preview,
        })}
      >
        <SheetHeader>
          <SheetTitle>{type === 'edit' ? '编辑章节' : '新建章节'}</SheetTitle>
          <SheetDescription>
            请注意，新建或编辑章节后，您的内容将被保存并可能对其他读者可见。请确保您的内容符合相关法律法规和社区准则。如果您需要删除章节，请联系管理员。
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex flex-1 flex-col space-y-4 overflow-y-hidden px-0.5'
          >
            <FormField
              control={form.control}
              name='order'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>章节序号</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入章节序号' type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入标题' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem className={'flex flex-1 flex-col overflow-y-hidden'}>
                  <FormLabel>章节内容</FormLabel>
                  <FormControl>
                    <div className={'relative flex flex-1 gap-8 overflow-y-hidden p-0.5'}>
                      <Textarea
                        placeholder='请输入章节内容'
                        className={clsx('h-full min-h-96 leading-6 md:leading-6', {
                          'w-1/2': preview,
                        })}
                        {...field}
                      />
                      <div
                        className='h-full min-h-96 flex-1 overflow-auto whitespace-pre-line rounded-lg border p-4 text-sm leading-6 md:leading-6'
                        style={preview ? { display: 'block' } : { display: 'none' }}
                      >
                        {form
                          .watch('content')
                          .split('\n')
                          .map((p: string, index: number) => {
                            const key = p.slice(0, 5) + index
                            return (
                              <p className={'mb-2'} key={key}>
                                {p}
                              </p>
                            )
                          })}
                      </div>
                      <button
                        type={'button'}
                        className={
                          'absolute top-4 right-4 z-10 inline-flex h-7 w-7 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background font-medium text-foreground text-sm opacity-100 shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                        }
                        onClick={() => setPreview((prevState) => !prevState)}
                      >
                        <Guitar className={'pointer-events-none size-3.5 shrink-0'} />
                      </button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    共记有 {getWordCount(form.watch('content') ?? '')} 字
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type='submit' className='px-8'>
                提交
              </Button>
              <Button type='button' className='px-8' onClick={submitAndContinue}>
                提交并继续
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
