import { useState } from 'react'

export const useArrayState = <T>(initialValue: T[] = []) => {
  const [state, setState] = useState<T[]>(initialValue)

  const add = (newValue: T) => {
    setState((currentValue) => [...currentValue, newValue])
  }

  const remove = (index: number) => {
    setState((currentValue) => {
      const newState = [...currentValue]
      newState.splice(index, 1)
      return newState
    })
  }

  const clear = () => {
    setState([])
  }

  const pop = () => {
    setState((currentValue) => {
      const newState = [...currentValue]
      newState.pop()
      return newState
    })
  }

  return [state, { add, remove, clear, pop }]
}
