'use client'
import { buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Upload from '@/components/Upload'
import { createClient } from '@/libs/supabase/client'
import { EditIcon, Loader } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebounceFn, useRequest } from 'ahooks'

async function getAlbumDetail(id: number | string) {
  const supabase = createClient()

  const { data, error } = await supabase.from('albums').select().eq('id', id).maybeSingle()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

async function updateAlbum(params: Record<string, unknown>, id: number | string) {
  const supabase = createClient()
  const { data, error } = await supabase.from('albums').update(params).eq('id', id)
  if (error) {
    throw new Error(error.message)
  }
  return data
}

const formSchema = z.object({
  name: z.string({ required_error: '请输入专辑名称' }).min(1, '请输入专辑名称'),
  cover: z.string({ required_error: '请输入专辑封面' }),
  collected: z.boolean(),
  picture_num: z.coerce.number({ required_error: '请输入图片数量' }).min(0, '最小为0'),
  video_num: z.coerce.number({ required_error: '请输入视频数量' }).min(0, '最小为0'),
})

export default function Edit({ id }: { id: string | number }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { data } = useRequest(() => (open ? getAlbumDetail(id) : Promise.resolve(null)), {
    cacheKey: `album_detail${id}`,
    refreshDeps: [open],
  })

  const { run, loading: submitLoading } = useRequest(updateAlbum, {
    manual: true,
    onSuccess: () => {
      handleSuccess()
    },
    onError: (e) => {
      toast({ title: '编辑错误', description: e.message })
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: data,
  })

  const { run: handleSubmit } = useDebounceFn(
    async (values: z.infer<typeof formSchema>) => {
      console.log(values)
      try {
        run(values, id)
      } catch (error) {}
    },
    {
      wait: 1000,
    },
  )

  const handleSuccess = () => {
    setOpen(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={buttonVariants({
          className: 'ml-auto gap-1.5',
          size: 'sm',
          variant: 'outline',
        })}
      >
        <EditIcon className="size-3.5" />
        编辑
      </SheetTrigger>
      <SheetContent className="w-[540px] sm:w-[500px] sm:max-w-7xl md:w-[680px] flex flex-col">
        <SheetHeader>
          <SheetTitle>编辑专辑</SheetTitle>
          <SheetDescription>编辑专辑相关信息</SheetDescription>
        </SheetHeader>
        <ScrollArea className='flex-1'>
          <Form {...form}>
            <form className="space-y-4 px-4">
              <FormField
                control={form.control}
                name={'name'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>专辑名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入专辑名称" {...field} value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'picture_num'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>照片数量</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="请输入照片数量"
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'video_num'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>视频数量</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="请输入视频数量"
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'collected'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">是否收藏</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'cover'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">专辑封面</FormLabel>
                    <FormControl>
                      <Upload value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter>
          <Button
            type={'submit'}
            onClick={form.handleSubmit(handleSubmit)}
            className="gap-1.5"
            disabled={submitLoading}
          >
            {submitLoading && <Loader className="size-3.5 animate-spin" />}
            保持更改
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
