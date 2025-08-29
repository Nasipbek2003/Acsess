import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Получаем все настройки из базы данных
    const settings = await prisma.setting.findMany()
    
    return NextResponse.json({
      success: true,
      settings: settings.map(setting => ({
        id: setting.id,
        login_admin: setting.login_admin,
        has_password: !!setting.password_admin,
        description: setting.description,
        created_at: setting.created_at
      }))
    })
  } catch (error) {
    console.error('Ошибка при получении настроек:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении данных' },
      { status: 500 }
    )
  }
}


