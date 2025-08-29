import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Проверяем, есть ли уже настройки
    const existingSettings = await prisma.setting.findFirst()
    
    if (existingSettings) {
      return NextResponse.json({
        message: 'Настройки уже существуют',
        hasSettings: true
      })
    }

    // Создаем базовые настройки
    const settings = await prisma.setting.create({
      data: {
        login_admin: 'admin',
        password_admin: 'admin123',
        telegram_key: 'DEMO_BOT_TOKEN', // Замените на реальный токен бота
        description: 'Базовые настройки админ панели',
        is_secure: true
      }
    })

    return NextResponse.json({
      message: 'Базовые настройки созданы',
      settings: {
        id: settings.id,
        login_admin: settings.login_admin,
        hasPassword: !!settings.password_admin,
        hasTelegramKey: !!settings.telegram_key,
        created_at: settings.created_at
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Ошибка создания настроек:', error)
    return NextResponse.json(
      { error: 'Ошибка создания настроек' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
