'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebounceFn } from 'ahooks'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { insertArticle } from './actions'

const formSchema = z.object({
  serial: z.coerce
    .number({
      required_error: '请输入章节序号',
    })
    .min(1, '序号不能小于1'),
  title: z.string({ required_error: '请输入标题' }),
  content: z.string({ required_error: '请输入章节内容' }).min(1, '请输入章节内容'),
})

export function CreateSheet({
  bookId,
  last,
}: {
  bookId: string
  last?: number
}) {
  const [open, setOpen] = useState(false)
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
      serial: last,
    },
  })

  const { run: handleSubmit } = useDebounceFn(
    async (values: z.infer<typeof formSchema>) => {
      try {
        await insertArticle({
          ...values,
          bookId,
        })
        form.reset()
        handleSuccess()
      } catch (error) {
        toast({
          title: '新建失败',
          description: (error as Error)?.message ?? '',
          variant: 'destructive',
        })
      }
    },
    {
      wait: 1000,
    },
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>新建章节</SheetTrigger>
      <SheetContent className='flex w-[600px] flex-col sm:w-[800px] sm:max-w-max'>
        <SheetHeader>
          <SheetTitle>新建章节</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex h-full flex-col space-y-4'
          >
            <FormField
              control={form.control}
              name='serial'
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
                <FormItem className={'flex flex-1 flex-col'}>
                  <FormLabel>章节内容</FormLabel>
                  <FormControl>
                    <Textarea placeholder='请输入章节内容' className='min-h-96 flex-1' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type='submit'>提交</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
