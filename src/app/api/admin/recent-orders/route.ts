import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🔍 Fetching recent orders...')
    
    // Получаем последние 5 заказов
    const orders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    console.log(`✅ Found ${orders.length} recent orders`)

    return NextResponse.json(orders)

  } catch (error) {
    console.error('❌ Error fetching recent orders:', error)
    return NextResponse.json(
      { error: 'Ошибка получения последних заказов' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}