import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    await prisma.notification.updateMany({
      where: {
        read: false
      },
      data: {
        read: true
      }
    })

    return NextResponse.json({ message: 'Все уведомления отмечены как прочитанные' })
  } catch (error) {
    console.error('Ошибка при обновлении уведомлений:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении уведомлений' },
      { status: 500 }
    )
  }
}

