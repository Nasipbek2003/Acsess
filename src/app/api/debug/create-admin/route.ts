import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE() {
  try {
    // Удаляем только записи, созданные для тестирования
    const deleted = await prisma.setting.deleteMany({
      where: {
        OR: [
          { login_admin: 'admin' },
          { description: 'Настройки администратора для входа' }
        ]
      }
    })

    return NextResponse.json({
      success: true,
      message: `Удалено ${deleted.count} тестовых записей`,
      deletedCount: deleted.count
    })

  } catch (error) {
    console.error('Ошибка удаления тестовых настроек:', error)
    return NextResponse.json(
      { error: 'Ошибка удаления настроек', details: error },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: Request) {
  try {
    const { telegram_key } = await request.json()

    if (!telegram_key) {
      return NextResponse.json(
        { error: 'Telegram key обязателен' },
        { status: 400 }
      )
    }

    // Обновляем токен Telegram в первой найденной записи настроек
    const settings = await prisma.setting.findFirst()
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Настройки не найдены. Сначала создайте их через POST запрос' },
        { status: 404 }
      )
    }

    const updatedSettings = await prisma.setting.update({
      where: { id: settings.id },
      data: { telegram_key }
    })

    return NextResponse.json({
      success: true,
      message: 'Telegram токен обновлен',
      settings: {
        id: updatedSettings.id,
        login_admin: updatedSettings.login_admin,
        hasPassword: !!updatedSettings.password_admin,
        hasTelegramKey: !!updatedSettings.telegram_key,
        updated_at: updatedSettings.updated_at
      }
    })

  } catch (error) {
    console.error('Ошибка обновления Telegram токена:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления токена', details: error },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
