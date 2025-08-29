import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Проверяем, есть ли уже категории
    const existingCategories = await prisma.category.count()
    
    if (existingCategories > 0) {
      return NextResponse.json({
        message: 'Тестовые данные уже существуют',
        categories: existingCategories
      })
    }

    // Создаем тестовые категории
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Витамины',
          description: 'Витаминные комплексы и отдельные витамины'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Минералы',
          description: 'Минеральные добавки и микроэлементы'
        }
      }),
      prisma.category.create({
        data: {
          name: 'БАДы',
          description: 'Биологически активные добавки'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Протеины',
          description: 'Протеиновые добавки и аминокислоты'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Для здоровья',
          description: 'Общеукрепляющие и профилактические средства'
        }
      })
    ])

    return NextResponse.json({
      message: 'Тестовые данные успешно созданы',
      categories: categories.length,
      data: categories
    }, { status: 201 })

  } catch (error) {
    console.error('Ошибка создания тестовых данных:', error)
    return NextResponse.json(
      { error: 'Ошибка создания тестовых данных' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

