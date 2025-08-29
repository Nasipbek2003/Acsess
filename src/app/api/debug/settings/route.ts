import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Получаем все настройки для диагностики
    const settings = await prisma.setting.findMany({
      select: {
        id: true,
        login_admin: true,
        password_admin: true, // Временно для диагностики
        telegram_key: true,
        is_secure: true,
        description: true,
        created_at: true
      }
    })

    return NextResponse.json({
      count: settings.length,
      settings: settings.map(setting => ({
        ...setting,
        telegram_key: setting.telegram_key ? 'PRESENT' : 'MISSING',
        chat_id: (setting as any).chat_id ? 'PRESENT' : 'MISSING'
      }))
    })

  } catch (error) {
    console.error('Ошибка получения настроек:', error)
    return NextResponse.json(
      { error: 'Ошибка получения настроек', details: error },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
