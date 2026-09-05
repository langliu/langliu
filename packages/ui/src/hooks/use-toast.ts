'use client'

import { toast as toastManager } from '@langliu/ui/ui/toast'

type ToastInput = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

function showToast(input: ToastInput) {
  toastManager.add({
    title: input.title,
    description: input.description,
    type: input.variant === 'destructive' ? 'error' : 'success',
  })
}

export function toast(input: ToastInput) {
  showToast(input)
}

export function useToast() {
  return { toast: showToast }
}
