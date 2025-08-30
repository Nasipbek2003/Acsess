import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '@/lib/auth'

const prisma = new PrismaClient()

// GET не требует авторизации
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // CATALOG, TARGET_GROUP, PURPOSE

    // Получаем категории по типу или все
    const where = type ? { type: type as any } : {}
    
    const categories = await prisma.category.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        type: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(categories)

  } catch (error) {
    console.error('Ошибка получения категорий:', error)
    return NextResponse.json(
      { error: 'Ошибка получения категорий' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST требует авторизации
export const POST = withAuth(async (request: Request) => {
  try {
    const body = await request.json()
    const { name, description, type = 'CATALOG' } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Название категории обязательно' },
        { status: 400 }
      )
    }

    // Создаем новую категорию
    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        type
      }
    })

    return NextResponse.json(category, { status: 201 })

  } catch (error) {
    console.error('Ошибка создания категории:', error)
    return NextResponse.json(
      { error: 'Ошибка создания категории' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
})