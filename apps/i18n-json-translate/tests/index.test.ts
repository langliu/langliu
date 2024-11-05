import { isJSONStr } from '@/utils'

describe('isJSONStr 函数测试', () => {
  test('有效 JSON 字符串', () => {
    const jsonStr = '{"key": "value"}'
    expect(isJSONStr(jsonStr)).toBe(true)
  })

  test('无效 JSON 字符串', () => {
    const invalidStr = 'not a json string'
    expect(isJSONStr(invalidStr)).toBe(false)
  })

  test('空字符串', () => {
    const emptyStr = ''
    expect(isJSONStr(emptyStr)).toBe(false)
  })

  test('非字符串输入', () => {
    const nonStr = 123
    expect(isJSONStr(nonStr)).toBe(false)
  })
})
