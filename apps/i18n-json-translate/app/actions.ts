'use server'
import { isJSONStr } from '@/utils'

export async function translate(formData: FormData) {
  const text = formData.get('input')
  console.log(text)
  if (isJSONStr(text)) {
    console.log(true)
  } else {
    console.log(false)
  }
}
