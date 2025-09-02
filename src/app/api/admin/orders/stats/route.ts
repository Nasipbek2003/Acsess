import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🔍 Fetching order statistics...')
    
    // Получаем статистику заказов по статусам
    const [
      newOrders,
      processingOrders,
      completedOrders,
      canceledOrders
    ] = await Promise.all([
      // Новые заказы
      prisma.order.count({
        where: { status: 'NEW' }
      }),
      
      // В обработке
      prisma.order.count({
        where: { status: 'PROCESSING' }
      }),
      
      // Завершенные
      prisma.order.count({
        where: { status: 'COMPLETED' }
      }),
      
      // Отмененные
      prisma.order.count({
        where: { status: 'CANCELED' }
      })
    ])

    const statsResult = {
      new: newOrders,
      processing: processingOrders, 
      completed: completedOrders,
      canceled: canceledOrders
    }
    
    console.log('✅ Order stats:', statsResult)
    return NextResponse.json(statsResult)

  } catch (error) {
    console.error('❌ Error fetching order statistics:', error)
    return NextResponse.json(
      { error: 'Ошибка получения статистики заказов' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

