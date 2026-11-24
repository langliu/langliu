import { createServerFn } from '@tanstack/react-start'

export type AnalyticsConfig = {
  gaId: string | null
  gtmId: string | null
}

type HeadScript = { src: string; async: true } | { children: string }

/** 读影视导航页的统计配置，没配置或格式不对的 ID 返回 null，页面就不注入对应脚本。 */
export const getAnalyticsConfig = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AnalyticsConfig> => {
    const { env } = await import('cloudflare:workers')
    const bindings = env as typeof env & {
      GOOGLE_ANALYTICS_ID?: string
      GOOGLE_TAG_MANAGER_ID?: string
    }
    return {
      gaId: bindings.GOOGLE_ANALYTICS_ID?.match(/^G-[A-Z0-9]+$/i)?.[0] ?? null,
      gtmId: bindings.GOOGLE_TAG_MANAGER_ID?.match(/^GTM-[A-Z0-9]+$/i)?.[0] ?? null,
    }
  },
)

export function analyticsScripts({ gaId, gtmId }: AnalyticsConfig): HeadScript[] {
  const scripts: HeadScript[] = []

  if (gtmId) {
    scripts.push({
      children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
    })
  }

  if (gaId) {
    scripts.push({
      children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`,
    })
    scripts.push({ src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`, async: true })
  }

  return scripts
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/** 把一次交互推进 dataLayer，由 GTM / GA 接住；没配置统计时什么也不做。 */
export function sendGTMEvent(event: Record<string, unknown>) {
  window.dataLayer?.push(event)
}
