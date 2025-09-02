import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - обновление категории
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, type } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Название категории обязательно' },
        { status: 400 }
      )
    }

    // Обновляем категорию
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        description: description || null,
        type
      }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.error('Ошибка обновления категории:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления категории' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - удаление категории
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем, есть ли товары в этой категории
    const productsCount = await prisma.product.count({
      where: { category_id: params.id }
    })

    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Нельзя удалить категорию, в которой есть товары' },
        { status: 400 }
      )
    }

    // Удаляем категорию
    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Ошибка удаления категории:', error)
    return NextResponse.json(
      { error: 'Ошибка удаления категории' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

