import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - получение всех категорий для клиентов
export async function GET() {
  try {
    console.log('🔍 Fetching categories for clients...')
    
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    // Преобразуем категории в формат для клиентов
    const clientCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      type: category.type,
      description: category.description || undefined
    }))

    console.log(`✅ Found ${clientCategories.length} categories`)
    return NextResponse.json(clientCategories)

  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Ошибка получения категорий' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
