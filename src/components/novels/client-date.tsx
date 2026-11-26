import { ClientOnly } from '@tanstack/react-router'

/** 按浏览器的本地时区显示日期。服务端和浏览器时区可能不同，所以等水合之后再渲染。 */
export function ClientDate({ time }: { time: number }) {
  return (
    <ClientOnly fallback={null}>
      <time dateTime={new Date(time).toISOString()}>
        {new Date(time).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })}
      </time>
    </ClientOnly>
  )
}
