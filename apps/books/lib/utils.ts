import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 计算字符串数组中所有字符串的单词总数
 *
 * @param inputs - 要计算单词数的字符串数组
 * @returns 字符串数组中所有字符串的单词总数
 */
export function getWordCount(inputs: string) {
  return Array.from(inputs).filter((text) => !['\n', ' '].includes(text)).length
}

export function dateFormat(date: Date) {
  const intl = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
  return intl.format(date)
}
