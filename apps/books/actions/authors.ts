'use server'

import prisma from '@/lib/prisma'
import type { Author } from '@prisma/client'

export async function getAuthors() {
  return prisma.author.findMany()
}

/**
 * 获取作者详情
 * @param id 作者详情
 */
export async function getAuthor(id: string) {
  return prisma.author.findUnique({
    where: {
      id,
    },
  })
}

/**
 * 创建作者
 * @param author
 */
export async function createAuthor(author: Pick<Author, 'name' | 'email'>) {
  return prisma.author.create({
    data: author,
  })
}

/**
 * 更新作者
 * @param id 作家ID
 * @param data 作家信息
 */
export async function updateAuthor(id: string, data: Pick<Author, 'name' | 'email'>) {
  return prisma.author.update({
    where: {
      id,
    },
    data,
  })
}
