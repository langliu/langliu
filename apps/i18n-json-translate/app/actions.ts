'use server'
import { isJSONStr } from '@/utils'
import CryptoJS from 'crypto-js'
import { v7 } from 'uuid'
import { z } from 'zod'

function truncate(q = '') {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

export async function translate(
  _: { output: string; error: Record<string, string> },
  formData: FormData,
) {
  const query = formData.get('input') as string
  const FormSchema = z.object({
    input: z
      .string({
        required_error: '请输入JSON字符串',
      })
      .min(1, '请输入 JSON 字符串'),
  })

  const parseResult = FormSchema.safeParse({
    input: query,
  })
  const error: Record<string, string> = {}
  if (!parseResult.success) {
    for (const parseResultElement of parseResult.error.errors) {
      error[parseResultElement.path[0]] = parseResultElement.message
    }
    return {
      error: error,
    }
  }
  if (!isJSONStr(query)) {
    return {
      error: {
        ...error,
        input: '请输入正确的JSON字符串',
      },
      output: '',
    }
  }

  try {
    const appKey = process.env.NEXT_PUBLIC_YOUDAO_APP_KEY ?? ''
    const key = process.env.NEXT_PUBLIC_YOUDAO_APP_SECRET //注意：暴露appSecret，有被盗用造成损失的风险
    const salt = v7()
    const curtime = Math.round(new Date().getTime() / 1000).toString()
    // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
    const from = 'auto'
    const to = 'en'
    const sign = CryptoJS.SHA256(appKey + truncate(query) + salt + curtime + key).toString(
      CryptoJS.enc.Hex,
    )
    const params = {
      q: query,
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
      return {
        output: JSON.stringify(JSON.parse(res.translation[0]), null, 2),
        error,
      }
    }
    return {
      output: '',
      error: {
        input: res.errorCode,
      },
    }
  } catch (e) {
    return {
      output: '',
      error: {
        input: (e as Error)?.message || '接口调用失败',
      },
    }
  }
}
