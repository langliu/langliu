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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { isJSONStr } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightLeft, CircleArrowRight, Clipboard, Guitar } from 'lucide-react'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { translation } from './actions'
import { LanguageSelect } from './language-select'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type={'submit'} aria-disabled={pending}>
      <CircleArrowRight size={40} className={'text-gray-400'} strokeWidth={1} />
    </button>
  )
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await translation(values)
      setTranslateResult(result)
    } catch (e) {
      toast({
        title: '翻译失败',
        description: (e as Error)?.message ?? '未知错误',
        variant: 'destructive',
      })
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(translateResult)
      toast({
        title: '复制成功',
        description: '已复制到剪贴板',
      })
    } catch (e) {
      toast({
        title: '复制失败',
        description: (e as Error)?.message ?? '未知错误',
        variant: 'destructive',
      })
    }
  }

  /**
   * Formats the input JSON string to make it more readable.
   *
   * @remarks
   * This function is used to format the JSON string entered by the user.
   * It first checks if the input is valid, and then parses the JSON string.
   * Finally, it stringifies the parsed JSON object with a 2-space indentation.
   *
   * @throws {Error} If the input is not a valid JSON string.
   */
  function prettyInput() {
    const input = form.getValues('input')
    // Check if the input field is not invalid
    if (input && isJSONStr(input)) {
      // Get the value of the input field
      // Parse the JSON string
      const parsedInput = JSON.parse(input)
      // Stringify the parsed JSON object with a 2-space indentation
      const prettyInput = JSON.stringify(parsedInput, null, 2)
      // Set the value of the input field to the formatted JSON string
      form.setValue('input', prettyInput)
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
              <FormItem className={'relative h-full'}>
                <FormControl>
                  <Textarea
                    {...field}
                    className={'h-full'}
                    placeholder={'请输入JSON字符串，例如：\n{\n  "fast": "Fast"\n}'}
                    name={'input'}
                  />
                </FormControl>
                <FormMessage />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type={'button'}
                        className={
                          'absolute top-4 right-4 z-10 inline-flex h-7 w-7 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background font-medium text-foreground text-sm opacity-100 shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                        }
                        onClick={prettyInput}
                      >
                        <Guitar className={'pointer-events-none size-3.5 shrink-0'} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Format JSON Input</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormItem>
            )}
          />
          <SubmitButton />
          <div className={'relative h-full w-full'}>
            {translateResult && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type={'button'}
                      className={
                        'absolute top-4 right-4 z-10 inline-flex h-7 w-7 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background font-medium text-foreground text-sm opacity-100 shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                      }
                      onClick={handleCopy}
                    >
                      <Clipboard className={'pointer-events-none size-3.5 shrink-0'} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Textarea
              className={'h-full w-full'}
              name={'output'}
              value={form.getValues('input') ? translateResult : ''}
              readOnly
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
