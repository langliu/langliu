'use client'

import { CircleArrowRight } from 'lucide-react'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { translate } from './actions'

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

export default function TranslateForm() {
  const [input, setInput] = useState<string>('')
  const [state, fromAction] = useActionState(
    async (
      previousState: { output: string; error: Record<string, string> },
      formData: FormData,
    ) => {
      const response = await translate(previousState, formData)
      return {
        output: response?.output || '',
        error: response?.error ?? {},
      }
    },
    initialState,
  )
  return (
    <form className={'flex h-full w-full items-center gap-8'} action={fromAction}>
      <div className={'h-full w-1/2'}>
        <textarea
          className={'h-full w-full rounded-md border border-gray-200 p-4 align-top text-black'}
          placeholder={'请输入JSON格式的字符串'}
          name={'input'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {state?.error.input && <div className={'mt-1 text-red-500'}>{state?.error.input}</div>}
      </div>
      <SubmitButton />
      <textarea
        className={'h-full w-1/2 rounded-md border border-gray-200 p-4 text-black '}
        name={'output'}
        value={state.output}
        readOnly
      />
    </form>
  )
}
