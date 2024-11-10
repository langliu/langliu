'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { isJSONStr } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightLeft, CircleArrowRight } from 'lucide-react'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { translate, translation } from './actions'
import { LanguageSelect } from './language-select'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type={'submit'} aria-disabled={pending}>
      <CircleArrowRight size={40} className={'text-gray-400'} strokeWidth={1} />
    </button>
  )
}

const initialState = {
  message: '',
  output: '',
  success: null,
  error: {
    input: '',
  },
}

const formSchema = z.object({
  from: z.string(),
  to: z.string(),
  input: z
    .string({
      required_error: '请输入JSON字符串',
    })
    .min(1, '请输入 JSON 字符串')
    .refine((val) => isJSONStr(val), '请输入正确的JSON字符串'),
})

export default function TranslateForm() {
  const [translateResult, setTranslateResult] = useState('')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: '',
      from: 'auto',
      to: 'en',
    },
  })
  const { toast } = useToast()
  const [state, fromAction] = useActionState(
    async (
      previousState: { output: string; error: Record<string, string> },
      formData: FormData,
    ) => {
      try {
        const response = await translate(previousState, formData)
        return {
          output: response?.output || '',
          error: response?.error ?? {},
        }
      } catch (e) {
        return {
          output: '',
          error: {
            input: (e as Error)?.message ?? '未知错误',
          },
        }
      }
    },
    initialState,
  )

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    try {
      const result = await translation(values)
      console.log(result)
      setTranslateResult(result)
    } catch (e) {
      toast({
        title: '翻译失败',
        description: (e as Error)?.message ?? '未知错误',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form className={'flex h-full flex-col'} onSubmit={form.handleSubmit(onSubmit)}>
        <div className={'mb-5 grid grid-cols-[1fr_40px_1fr] items-center gap-8'}>
          <FormField
            name={'from'}
            control={form.control}
            render={({ field }) => (
              <FormItem className={'flex items-center space-x-2 space-y-0'}>
                <FormLabel>源语言</FormLabel>
                <LanguageSelect
                  allowAuto
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormItem>
            )}
          />
          <div className={'flex justify-center'}>
            <ArrowRightLeft className={'text-gray-400'} size={20} />
          </div>
          <FormField
            name={'to'}
            control={form.control}
            render={({ field }) => (
              <FormItem className={'flex items-center space-x-2 space-y-0'}>
                <FormLabel>目标语言</FormLabel>
                <LanguageSelect onValueChange={field.onChange} defaultValue={field.value} />
              </FormItem>
            )}
          />
        </div>
        <div className={'grid h-full w-full flex-1 grid-cols-[1fr_40px_1fr] items-center gap-8'}>
          <FormField
            name={'input'}
            control={form.control}
            render={({ field }) => (
              <FormItem className={'h-full'}>
                <FormControl>
                  <Textarea
                    {...field}
                    className={'h-full'}
                    placeholder={'请输入JSON格式的字符串'}
                    name={'input'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton />
          <Textarea className={'h-full w-full'} name={'output'} value={translateResult} readOnly />
        </div>
      </form>
    </Form>
  )
}
