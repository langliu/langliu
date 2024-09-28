import { useEffect, useRef } from 'react'

/**
 * 一个自定义的 React 钩子，用于在给定的延迟后定期执行一个函数。
 * 该钩子可以选择在组件挂载后立即执行一次该函数。
 * @param fn - 要定期执行的函数。
 * @param delay - 执行函数的间隔延迟（以毫秒为单位）。如果 delay 为 null 或未定义，则定时器将不会开始。
 * @param options - 一个可选对象，包含 immediate 布尔属性，指定组件挂载后是否立即执行函数。
 */
export function useInterval(
  fn: () => void,
  delay: number | null | undefined,
  options?: { immediate?: boolean },
): void {
  const immediate = options?.immediate
  const fnRef = useRef<() => void>()
  fnRef.current = fn
  useEffect(() => {
    if (delay === undefined || delay === null) return
    if (immediate) {
      fnRef.current?.()
    }
    const timer = setInterval(() => {
      fnRef.current?.()
    }, delay)

    return () => {
      clearInterval(timer)
    }
  }, [delay, immediate])
}
