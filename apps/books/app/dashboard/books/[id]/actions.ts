'use server'
import { getBook } from '@/actions/books'
import prisma from '@/lib/prisma'

type InsertArticleParams = {
  bookId: string
  title: string
  content: string
  order: number
  wordCount: number
}

type UpdateArticleParams = InsertArticleParams & {
  id: string
}

export async function insertArticle(params: InsertArticleParams) {
  const book = await getBook(params.bookId)
  console.log('book', book)
  if (!book) {
    throw new Error('书籍不存在')
  }
  await prisma.book.update({
    where: {
      id: params.bookId,
    },
    data: {
      wordCount: (book.wordCount ?? 0) + params.wordCount,
      chapters: book.chapters + 1,
    },
  })
  return prisma.article.create({
    data: {
      title: params.title,
      bookId: params.bookId,
      content: params.content,
      order: params.order,
      wordCount: params.wordCount,
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
 * @param prevWordCount 修改之前的章节字数
 */
export async function updateArticle(data: UpdateArticleParams, prevWordCount: number) {
  const book = await getBook(data.bookId)
  if (!book) {
    throw new Error('书籍不存在')
  }
  await prisma.book.update({
    where: {
      id: data.bookId,
    },
    data: {
      wordCount: (book?.wordCount ?? 0) + (data.wordCount - prevWordCount),
    },
  })
  return prisma.article.update({
    where: {
      id: data.id,
    },
    data: data,
  })
}
