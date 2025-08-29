import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Получаем топ-5 товаров по количеству продаж
    // Считаем количество продаж и выручку по каждому товару
    const popularProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            order_items: true
          }
        },
        order_items: {
          select: {
            quantity: true,
            price: true
          }
        }
      },
      orderBy: {
        order_items: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Преобразуем данные в нужный формат
    const formattedProducts = popularProducts.map(product => {
      const totalSales = product.order_items.reduce((sum, item) => sum + item.quantity, 0)
      const totalRevenue = product.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        id: product.id,
        name: product.name,
        sales: totalSales,
        revenue: totalRevenue
      }
    }).filter(product => product.sales > 0) // Показываем только товары с продажами

    return NextResponse.json(formattedProducts)

  } catch (error) {
    console.error('Ошибка получения популярных товаров:', error)
    return NextResponse.json(
      { error: 'Ошибка получения популярных товаров' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

