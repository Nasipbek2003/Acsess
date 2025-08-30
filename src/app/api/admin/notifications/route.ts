import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        read: false
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error)
    return NextResponse.json(
      { error: 'Ошибка получения уведомлений' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}