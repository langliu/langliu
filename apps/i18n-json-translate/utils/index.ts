/**
 * 检查给定的字符串是否为有效的 JSON 字符串
 * @param str - 要检查的字符串
 * @returns 如果字符串是有效的 JSON，则返回 true，否则返回 false
 */
export function isJSONStr(str: unknown): boolean {
  // 首先检查输入是否为字符串
  if (typeof str === 'string') {
    try {
      // 尝试将字符串解析为 JSON 对象
      const obj = JSON.parse(str)
      // 检查解析后的对象是否为对象类型且不为 null
      if (typeof obj === 'object' && obj) {
        // 如果是，则返回 true，表示字符串是有效的 JSON
        return true
      }
      // 如果不是对象类型或为 null，则返回 false
      return false
    } catch (_) {
      // 如果解析过程中发生错误，记录错误信息并返回 false
      return false
    }
  }
  // 如果输入不是字符串，则直接返回 false
  return false
}
