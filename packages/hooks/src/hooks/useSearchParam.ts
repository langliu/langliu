import { useState } from 'react'

/**
 * 获取 URL 查询字符串的函数
 */
const getQuery = () => {
  // 如果 window 对象存在（在浏览器环境中）
  if (typeof window !== 'undefined') {
    // 返回当前 URL 的查询字符串部分
    return new URLSearchParams(window.location.search)
  }
  // 如果 window 对象不存在（例如在服务器端渲染时），返回一个空的 URLSearchParams 对象
  return new URLSearchParams()
}

/**
 * 获取指定查询参数值的函数
 * @param key 查询参数的键
 */
const getSearchParamValue = (key: string): string | null => {
  // 调用 getQuery 函数获取查询字符串对象，并获取指定 key 的值
  return getQuery().get(key)
}

/**
 * 自定义 Hook，用于处理 URL 中的查询参数
 * @param key 查询参数的键
 * @param defaultValue 默认值
 */
export const useSearchParam = (key: string, defaultValue: string) => {
  const [query, setQuery] = useState<string>(
    // 如果查询参数存在，则使用其值，否则使用默认值
    getSearchParamValue(key) || defaultValue,
  )

  /**
   * 更新URL中的查询参数
   * @param newValue 新的值
   */
  const updateUrl = (newValue: string) => {
    const query = getQuery()

    // 判断值是否为有效的值
    if (newValue.trim() !== '') {
      query.set(key, newValue)
    } else {
      query.delete(key)
    }

    if (typeof window !== 'undefined') {
      const { protocol, pathname, host } = window.location
      const newUrl = `${protocol}://${host}:${pathname}?${query.toString()}`
      window.history.pushState({}, '', newUrl)
    }
    setQuery(newValue)
  }

  // 返回当前查询参数的值和更新函数
  return [query, updateUrl]
}
