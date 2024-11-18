'use server'

import prisma from '@/lib/prisma'

export async function getAuthors() {
  return prisma.author.findMany()
}
