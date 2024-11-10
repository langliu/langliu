'use server'
import CryptoJS from 'crypto-js'
import { v7 } from 'uuid'

function truncate(q = '') {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

/**
 * 翻译 JSON 字符串
 * @param input
 * @param from
 * @param to
 */
export async function translation({
  input,
  from,
  to,
}: {
  input: string
  from: string
  to: string
}) {
  try {
    const appKey = process.env.NEXT_PUBLIC_YOUDAO_APP_KEY ?? ''
    const key = process.env.NEXT_PUBLIC_YOUDAO_APP_SECRET ?? ''
    const salt = v7()
    const curtime = Math.round(new Date().getTime() / 1000).toString()
    // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'

    const jsonObj: Record<string, string | number> = JSON.parse(input)
    const values = []
    for (const key in jsonObj) {
      if (typeof jsonObj[key] === 'string') {
        values.push(jsonObj[key])
      }
    }
    const sign = CryptoJS.SHA256(
      appKey + truncate(values.join('\n')) + salt + curtime + key,
    ).toString(CryptoJS.enc.Hex)
    console.log(values.join('\n'))
    const params = {
      q: values.join('\n'),
      appKey: appKey,
      salt: salt,
      from: from,
      to: to,
      sign: sign,
      signType: 'v3',
      curtime: curtime,
    }
    const url = new URL('https://openapi.youdao.com/api')
    url.search = new URLSearchParams(params).toString()

    const res = await fetch(url).then((res) => res.json())
    if (res.errorCode === '0') {
      console.log(res.translation)
      const result = res.translation[0].split('\n')
      let index = 0
      for (const key in jsonObj) {
        if (typeof jsonObj[key] === 'string') {
          jsonObj[key] = result[index]
          index++
        }
      }
      return JSON.stringify(jsonObj, null, 2)
    }
    throw new Error(res.errorCode)
  } catch (e) {
    throw new Error((e as Error)?.message || '接口调用失败')
  }
}
