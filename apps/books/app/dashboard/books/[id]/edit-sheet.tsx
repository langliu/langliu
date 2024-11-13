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
import { useDebounceFn } from 'ahooks'
import { clsx } from 'clsx'
import { Guitar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getArticle, updateArticle } from './actions'

const formSchema = z.object({
  order: z.coerce
    .number({
      required_error: '请输入章节序号',
    })
    .min(1, '序号不能小于1'),
  title: z.string({ required_error: '请输入标题' }),
  content: z.string({ required_error: '请输入章节内容' }).min(1, '请输入章节内容'),
})

export function EditSheet({
  bookId,
  last,
}: {
  bookId: string
  last?: number
}) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState(false)
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
      order: last,
    },
  })

  const { run: handleSubmit } = useDebounceFn(
    async (values: z.infer<typeof formSchema>) => {
      console.log(values)
      try {
        await updateArticle({
          ...values,
          id: bookId,
          wordCount: getWordCount(values?.content),
        })
        form.reset()
        handleSuccess()
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

  useEffect(() => {
    if (open) {
      getArticle(bookId)
        .then((res) => {
          form.setValue('title', res?.title ?? '')
          form.setValue('content', res?.content ?? '')
          form.setValue('order', res?.order ?? 0)
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }, [bookId, open, form])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>编辑</SheetTrigger>
      <SheetContent
        className={clsx('flex w-[600px] flex-col sm:w-[800px] sm:max-w-full', {
          'sm:w-screen': preview,
        })}
      >
        <SheetHeader>
          <SheetTitle>编辑章节</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex flex-1 flex-col space-y-4 overflow-hidden'
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
                <FormItem className={'flex flex-1 flex-col overflow-hidden'}>
                  <FormLabel>章节内容</FormLabel>
                  <FormControl>
                    <div className={'relative flex flex-1 gap-8 overflow-hidden'}>
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
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
