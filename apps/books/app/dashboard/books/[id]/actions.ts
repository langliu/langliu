'use server'
import prisma from '@/lib/prisma'
import { getWordCount } from '@/lib/utils'

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
      wordCount: getWordCount(params.content),
    },
  })
}

/**
 * 获取章节详情
 * @param id 章节ID
 */
export async function getArticle(id: string) {
  return prisma.article.findUnique({
    where: {
      id: id,
    },
  })
}

/**
 * 获取章节详情
 * @param data 章节ID
 */
export async function updateArticle(data: Record<string, string | number>) {
  return prisma.article.update({
    where: {
      id: data.id as string,
    },
    data: data,
  })
}
