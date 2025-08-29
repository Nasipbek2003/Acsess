import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Получаем все товары с информацией о категориях
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json(products)

  } catch (error) {
    console.error('Ошибка получения товаров:', error)
    return NextResponse.json(
      { error: 'Ошибка получения товаров' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, stock, category_id, image_url } = body

    // Валидация обязательных полей
    if (!name) {
      return NextResponse.json(
        { error: 'Название товара обязательно' },
        { status: 400 }
      )
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { error: 'Цена должна быть больше нуля' },
        { status: 400 }
      )
    }

    if (stock === undefined || stock < 0) {
      return NextResponse.json(
        { error: 'Количество на складе не может быть отрицательным' },
        { status: 400 }
      )
    }

    if (!category_id) {
      return NextResponse.json(
        { error: 'Категория обязательна' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли категория
    const categoryExists = await prisma.category.findUnique({
      where: { id: category_id }
    })

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Указанная категория не существует' },
        { status: 400 }
      )
    }

    // Создаем новый товар
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: parseInt(stock),
        category_id,
        image_url: image_url || null
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    console.error('Ошибка создания товара:', error)
    return NextResponse.json(
      { error: 'Ошибка создания товара' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

