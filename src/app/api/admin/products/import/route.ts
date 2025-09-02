import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json()

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Неверный формат данных' },
        { status: 400 }
      )
    }

    const results = {
      success: 0,
      failed: 0,
      replaced: 0,
      created: 0,
      errors: [] as string[]
    }

    for (const productData of products) {
      try {
        console.log('Обрабатываем товар:', productData)
        
        // Проверяем обязательные поля
        const requiredFields = ['Название товара', 'Цена', 'Каталог']
        const missingFields = requiredFields.filter(field => !productData[field])
        
        if (missingFields.length > 0) {
          results.failed++
          results.errors.push(`Товар пропущен: отсутствуют поля ${missingFields.join(', ')}`)
          continue
        }

        // Находим или создаем категорию
        const categoryName = productData['Каталог'] || productData['Категория'] || productData['category']
        
        if (!categoryName) {
          results.failed++
          results.errors.push(`Товар "${productData['Название товара'] || 'Неизвестный'}": отсутствует категория`)
          continue
        }

        let category = await prisma.category.findFirst({
          where: { name: categoryName }
        })

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: categoryName,
              type: 'other', // По умолчанию
              description: `Категория ${categoryName}`
            }
          })
        }

        // Подготавливаем данные для создания товара
        const price = parseFloat(productData['Цена'])
        const stock = parseInt(productData['Количество на складе'])
        const imageUrl = productData['Ссылки на изображение'] || productData['image_url'] || productData['Ссылка на изображение'] || null
        
        console.log('Данные изображения:', {
          'Ссылки на изображение': productData['Ссылки на изображение'],
          'image_url': productData['image_url'],
          'Ссылка на изображение': productData['Ссылка на изображение'],
          'final imageUrl': imageUrl
        })
        
        const productCreateData = {
          name: productData['Название товара'],
          description: productData['Описание'] || null,
          price: isNaN(price) ? 0 : price,
          stock: isNaN(stock) ? 0 : stock,
          image_url: imageUrl,
          category_id: category.id
        }
        
        console.log('Данные для создания товара:', productCreateData)

        // Если есть ID, заменяем существующий товар
        if (productData['ID']) {
          // Проверяем, существует ли товар с таким ID
          const existingProduct = await prisma.product.findUnique({
            where: { id: productData['ID'] }
          })

          if (existingProduct) {
            // Удаляем старый товар
            await prisma.product.delete({
              where: { id: productData['ID'] }
            })
            results.replaced++
            console.log(`Заменен товар с ID: ${productData['ID']}`)
          } else {
            results.created++
            console.log(`Создан новый товар с ID: ${productData['ID']}`)
          }

          // Создаем новый товар с указанным ID
          await prisma.product.create({
            data: {
              id: productData['ID'],
              ...productCreateData
            }
          })
        } else {
          // Создаем новый товар без указания ID (автогенерация)
          await prisma.product.create({
            data: productCreateData
          })
          results.created++
          console.log(`Создан новый товар: ${productData['Название товара']}`)
        }

        results.success++

      } catch (error) {
        results.failed++
        results.errors.push(`Ошибка при обработке товара "${productData['Название товара'] || 'Неизвестный'}": ${error}`)
        console.error('Ошибка при импорте товара:', error)
      }
    }

    const message = `Импорт завершен! Всего обработано: ${results.success} товаров. Создано новых: ${results.created}, Заменено: ${results.replaced}, Ошибок: ${results.failed}`

    return NextResponse.json({
      message,
      results
    })

  } catch (error) {
    console.error('Ошибка при импорте:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера при импорте' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}