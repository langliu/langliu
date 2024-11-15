'use server'
import prisma from '@/lib/prisma'
import type { Book } from '@prisma/client'

export async function getBook(bookId: string): Promise<Book | null> {
  return prisma.book.findUnique({
    where: {
      id: bookId,
    },
  })
}
