'use server'

import prisma from '@/lib/prisma'
import type { Author } from '@prisma/client'

export async function getAuthors() {
  return prisma.author.findMany()
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
