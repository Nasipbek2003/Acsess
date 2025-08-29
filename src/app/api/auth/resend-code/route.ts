import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Функция генерации 6-значного кода
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Функция отправки сообщения в Telegram
async function sendTelegramMessage(phone: string, code: string): Promise<boolean> {
  try {
    // Получаем токен бота из настроек
    const settings = await prisma.setting.findFirst({
      where: {
        telegram_key: {
          not: null
        }
      }
    })

    if (!settings?.telegram_key) {
      console.error('Telegram bot token не найден в настройках')
      return false
    }

    const message = `🔐 Новый код для входа в админ панель: ${code}\n\nКод действителен 5 минут.`
    
    // Для демонстрации просто логируем
    console.log(`Telegram message (resend) for ${phone}: ${message}`)
    
    // Имитация успешной отправки
    return true

  } catch (error) {
    console.error('Ошибка повторной отправки Telegram сообщения:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID обязателен' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли сессия в базе данных
    const session = await prisma.twoFactorSession.findUnique({
      where: {
        id: sessionId
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Сессия не найдена' },
        { status: 404 }
      )
    }

    // Генерируем новый код
    const newCode = generateCode()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 минут

    // Обновляем код в базе данных
    await prisma.twoFactorSession.update({
      where: { id: sessionId },
      data: {
        code: newCode,
        expires_at: expiresAt
      }
    })

    // Отправляем новый код в Telegram
    const sent = await sendTelegramMessage(session.phone, newCode)

    if (!sent) {
      return NextResponse.json(
        { error: 'Ошибка отправки кода в Telegram' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Новый код отправлен в Telegram'
    })

  } catch (error) {
    console.error('Ошибка повторной отправки кода:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
