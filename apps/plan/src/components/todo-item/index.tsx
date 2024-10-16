'use client'

import { type FormEvent, useState } from 'react'

export type TodoItemProps = {
  id: string
  value: string
  onChange: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ id, onChange, onDelete }: Readonly<TodoItemProps>) {
  const [value, setValue] = useState<string | undefined>()

  function handleSubmit() {
    console.log(value)
    onChange(value ?? '')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name={'todo'}
        className={
          'block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        }
        onChange={(event) => setValue(event.target.value)}
      />
      <span>{value}</span>
      <button type={'button'} onClick={() => onDelete(id)}>
        删除
      </button>
    </form>
  )
}
