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
import { SheetFooter } from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const CategoryFormSchema = z.object({
  name: z.string().min(1, '请输入标签名称'),
})

interface CategoryFormProps {
  onSubmit: (form: z.infer<typeof CategoryFormSchema>) => void
  values?: z.infer<typeof CategoryFormSchema> | null
}

export default function CategoryForm({ onSubmit, values }: CategoryFormProps) {
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (values) {
      form.setValue('name', values.name)
    }
  }, [form, values])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-1 flex-col space-y-4 px-0.5'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>标签名称</FormLabel>
              <FormControl>
                <Input placeholder='请输入标签名称' {...field} />
              </FormControl>
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
  )
}
