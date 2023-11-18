'use client'

import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs'
import type Entity from '@ant-design/cssinjs/es/Cache'
import { useServerInsertedHTML } from 'next/navigation'
import React, { FC } from 'react'

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
    return <style id='antd' dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  })
  return <StyleProvider cache={cache}>{children}</StyleProvider>
}

export default StyledComponentsRegistry
