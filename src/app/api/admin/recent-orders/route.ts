import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Получаем последние 5 заказов с информацией о пользователе
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(recentOrders)

  } catch (error) {
    console.error('Ошибка получения последних заказов:', error)
    return NextResponse.json(
      { error: 'Ошибка получения последних заказов' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

