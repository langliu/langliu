'use client'

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'
import type Entity from '@ant-design/cssinjs/es/Cache'
import { useServerInsertedHTML } from 'next/navigation'
import React, { type FC } from 'react'

export interface StyledComponentsRegistryProps {
  children: React.ReactNode
}

const StyledComponentsRegistry: FC<StyledComponentsRegistryProps> = ({ children }) => {
  const cache = React.useMemo<Entity>(() => createCache(), [])
  const isServerInserted = React.useRef<boolean>(false)
  useServerInsertedHTML(() => {
    // 避免 css 重复插入
    if (isServerInserted.current) {
      return
    }
    isServerInserted.current = true
    // biome-ignore lint/security/noDangerouslySetInnerHtml: Ant Design's server-side renderer returns trusted generated CSS.
    return <style id='antd' dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  })
  return <StyleProvider cache={cache}>{children}</StyleProvider>
}

export default StyledComponentsRegistry
