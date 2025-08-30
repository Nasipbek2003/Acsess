import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '@/lib/auth'

const prisma = new PrismaClient()

// Временно убираем авторизацию для отладки
export async function GET() {
  try {
    console.log('🔍 Fetching admin statistics...')
    
    // Получаем общую статистику
    const [
      totalOrders,
      totalClients, 
      totalProducts,
      newOrdersLastMonth,
      newClientsLastMonth,
      newProductsLastMonth
    ] = await Promise.all([
      // Общее количество заказов
      prisma.order.count(),
      
      // Общее количество клиентов
      prisma.user.count({
        where: {
          role: 'CLIENT'
        }
      }),
      
      // Общее количество товаров
      prisma.product.count(),
      
      // Новые заказы за последний месяц
      prisma.order.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 дней назад
          }
        }
      }),
      
      // Новые клиенты за последний месяц
      prisma.user.count({
        where: {
          role: 'CLIENT',
          created_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 дней назад
          }
        }
      }),
      
      // Новые товары за последний месяц
      prisma.product.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 дней назад
          }
        }
      })
    ])

    const statsResult = {
      orders: totalOrders,
      newOrders: newOrdersLastMonth,
      clients: totalClients,
      newClients: newClientsLastMonth,
      products: totalProducts,
      newProducts: newProductsLastMonth
    }
    
    console.log('✅ Statistics result:', statsResult)
    return NextResponse.json(statsResult)

  } catch (error) {
    console.error('Ошибка получения статистики:', error)
    return NextResponse.json(
      { error: 'Ошибка получения статистики' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}