import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Получаем все категории
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

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
        description: description || null
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
}

