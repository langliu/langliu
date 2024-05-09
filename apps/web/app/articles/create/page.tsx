'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';
import { useDebounceFn } from 'ahooks';
import { message } from 'antd';
import { unstable_noStore as noStore } from 'next/cache';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  serial: z.coerce
    .number({
      required_error: '请输入章节序号',
    })
    .min(1, '序号不能小于1'),
  title: z.string({ required_error: '请输入标题' }).min(1, '请输入标题'),
  content: z
    .string({ required_error: '请输入章节内容' })
    .min(1, '请输入章节内容'),
});

async function insertArticle(params: {
  bookId: number;
  content: string;
  title: string;
  serial: number;
}) {
  noStore();
  const supabase = createClientComponentClient();
  const { data, error } = await supabase
    .from('articles')
    .insert([params])
    .select();
  return { data, error };
}

export default function CreateBook() {
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const { run: handleSubmit } = useDebounceFn(
    async (values: z.infer<typeof formSchema>) => {
      console.log(values);
      try {
        const resp = await insertArticle({
          ...values,
          bookId: Number(searchParams.get('bookId')),
        });
        console.warn('res', resp);
        if (resp.error) {
          message.error(resp.error.message);
        } else {
          message.success('新建成功');
          form.setValue('serial', values.serial + 1);
          form.reset({
            serial: values.serial + 1,
          });
        }
      } catch (error) {}
    },
    {
      wait: 1000,
    },
  );

  return (
    <div className="pt-8 px-8">
      <h1 className="text-2xl mb-6">新建章节</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="serial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>章节序号</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入章节序号"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input placeholder="请输入标题" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>章节内容</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="请输入章节内容"
                    className="min-h-20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            提交
          </Button>
        </form>
      </Form>
    </div>
  );
}
