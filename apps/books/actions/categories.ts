'use server'

import prisma from '@/lib/prisma'
import type { Category } from '@prisma/client'

export async function getCategories() {
  const categories = await prisma.category.findMany()
  return {
    categories,
  }
}

export async function getCategoriesById(id: string) {
  return prisma.category.findUnique({
    where: {
      id,
    },
  })
}

/**
 * 创建标签
 * @param category
 */
export async function createCategory(category: Pick<Category, 'name'>) {
  return prisma.category.create({
    data: category,
  })
}

export async function updateCategory(id: string, category: Pick<Category, 'name'>) {
  return prisma.category.update({
    where: {
      id,
    },
    data: category,
  })
}
