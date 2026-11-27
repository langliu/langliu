import { env } from 'cloudflare:workers'

/**
 * 只声明用到的 R2 表面（put/get），避免引入 workers-types 依赖；
 * 运行时对象是平台提供的完整 R2Bucket。
 */
type CoverBucket = {
  put(
    key: string,
    value: Blob,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>
  get(key: string): Promise<{
    body: ReadableStream
    httpMetadata?: { contentType?: string }
    size: number
  } | null>
}

/** 小说封面对象存储；void.config 里声明为 COVERS 绑定，未配置时返回 null。 */
export function getCoverBucket(): CoverBucket | null {
  return (env as { COVERS?: CoverBucket }).COVERS ?? null
}
