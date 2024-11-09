'use server'
import { isJSONStr } from '@/utils'
import CryptoJS from 'crypto-js'
import { v7 } from 'uuid'
import { z } from 'zod'

export type State = {
  input?: string
}

function truncate(q = '') {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

export async function translate(prevState: { input: string }, formData: FormData) {
  'use server'
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
  // console.log(parseResult)
  console.log(true)
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
  try {
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
        output: res.translation[0],
      }
    }
  } catch (e) {
    console.error(e)
  }
}
//
// export async function translate(formData: FormData) {
//   'use server'
//   // const FormSchema = z.object({
//   //   id: z.string(),
//   //   customerId: z.string({
//   //     invalid_type_error: 'Please select a customer.',
//   //   }),
//   //   amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
//   //   status: z.enum(['pending', 'paid'], {
//   //     invalid_type_error: 'Please select an invoice status.',
//   //   }),
//   //   date: z.string(),
//   // })
//   //
//   // const text = formData.get('input')
//   // console.log(text)
//   // if (isJSONStr(text)) {
//   //   console.log(true)
//   // } else {
//   //   console.log(false)
//   // }
// }
