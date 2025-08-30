import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { products } = await request.json()

    // Проверяем формат данных
    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Неверный формат данных' },
        { status: 400 }
      )
    }

    // Создаем товары
    const results = await Promise.all(
      products.map(async (product: any) => {
        try {
          // Находим или создаем категорию
          const category = await prisma.category.upsert({
            where: { name: product.category },
            update: {},
            create: { name: product.category }
          })

          // Создаем товар
          return await prisma.product.create({
            data: {
              name: product.name,
              description: product.description,
              price: parseFloat(product.price),
              stock: parseInt(product.stock),
              image_url: product.image_url,
              category_id: category.id
            }
          })
        } catch (error) {
          console.error('Ошибка при импорте товара:', error)
          return null
        }
      })
    )

    // Фильтруем успешные результаты
    const successfulImports = results.filter(r => r !== null)

    return NextResponse.json({
      message: `Импортировано ${successfulImports.length} товаров`,
      failed: results.length - successfulImports.length
    })
  } catch (error) {
    console.error('Ошибка при импорте:', error)
    return NextResponse.json(
      { error: 'Ошибка при импорте товаров' },
      { status: 500 }
    )
  }
}

