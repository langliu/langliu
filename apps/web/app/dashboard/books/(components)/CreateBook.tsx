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
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/libs/supabase/client'
import { useDebounceFn } from 'ahooks'
import { unstable_noStore as noStore } from 'next/cache'
import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string({ required_error: '请输入书籍名称' }).min(1, '请输入书籍名称'),
  author: z.string({ required_error: '请输入书籍作者' }).min(1, '请输入书籍作者'),
  end: z.boolean(),
})

async function insertBook(params: {
  name: string
  author: string
  end: boolean
}) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from('books').insert([params]).select()
  return { data, error }
}

export default function CreateBook({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      author: '',
      end: false,
    },
  })

  const { run: handleSubmit } = useDebounceFn(
    async (values: z.infer<typeof formSchema>) => {
      console.log(values)
      try {
        const resp = await insertBook({
          ...values,
        })
        console.warn('res', resp)
        if (resp.error) {
          toast({
            title: '错误',
            description: resp.error.message,
          })
        } else {
          onSuccess?.()
          toast({
            title: '新建成功',
          })
        }
      } catch (error) {}
    },
    {
      wait: 1000,
    },
  )

  return (
    <Suspense>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>书籍名称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入书籍名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>书籍作者</FormLabel>
                <FormControl>
                  <Input placeholder="请输入书籍作者" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>已完结</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="px-8">
            提交
          </Button>
        </form>
      </Form>
    </Suspense>
  )
}
