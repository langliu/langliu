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
import { SheetFooter } from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const AuthorFormSchema = z.object({
  name: z.string({ required_error: '请输入作家名称' }).min(1, '请输入作家名称'),
  email: z.string().nullable(),
})

interface AuthorFormProps {
  onSubmit: (form: z.infer<typeof AuthorFormSchema>) => void
  values?: z.infer<typeof AuthorFormSchema> | null
}

export default function AuthorForm({ onSubmit, values }: AuthorFormProps) {
  const form = useForm<z.infer<typeof AuthorFormSchema>>({
    resolver: zodResolver(AuthorFormSchema),
    defaultValues: {
      name: '',
      email: null,
    },
  })

  useEffect(() => {
    if (values) {
      form.setValue('name', values.name)
      form.setValue('email', values.email)
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
              <FormLabel>作家名称</FormLabel>
              <FormControl>
                <Input placeholder='请输入作家名称' {...field} />
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
