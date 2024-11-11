'use server'
import prisma from '@/lib/prisma'

export async function insertArticle(params: {
  bookId: string
  content: string
  title: string
  serial: number
}) {
  return prisma.article.create({
    data: {
      title: params.title,
      bookId: params.bookId,
      content: params.content,
      order: params.serial,
      wordCount: params.content.length || 0,
    },
  })
}
