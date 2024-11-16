'use server'
import prisma from '@/lib/prisma'
import type { Book } from '@prisma/client'

export async function insertBook(data: Pick<Book, 'title' | 'introduction' | 'endStatus'>) {
  return prisma.book.create({
    data: {
      ...data,
      wordCount: 0,
    },
  })
}

/**
 * 更新书籍📚信息
 * @param data 书籍信息
 */
export async function updateBook(
  data: Pick<Book, 'id' | 'title' | 'introduction' | 'authorId' | 'endStatus'>,
) {
  const { id, ...rest } = data
  return prisma.book.update({
    where: {
      id: id,
    },
    data: rest,
  })
}
