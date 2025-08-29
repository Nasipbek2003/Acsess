import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Функция генерации 6-значного кода
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Функция очистки устаревших сессий
async function cleanupExpiredSessions() {
  try {
    await prisma.twoFactorSession.deleteMany({
      where: {
        expires_at: {
          lt: new Date()
        }
      }
    })
  } catch (error) {
    console.error('Ошибка очистки сессий:', error)
  }
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

    // Здесь должна быть логика поиска chat_id по номеру телефона
    // Для демо используем заглушку - в реальном проекте нужна связка phone -> chat_id
    const message = `🔐 Ваш код для входа в админ панель: ${code}\n\nКод действителен 5 минут.`
    
    console.log(`📱 Отправка сообщения в Telegram для ${phone}: ${message}`)
    
    if (!settings.telegram_key || settings.telegram_key === 'YOUR_BOT_TOKEN_HERE' || settings.telegram_key === 'DEMO_BOT_TOKEN' || settings.telegram_key === 'YOUR_REAL_TOKEN_HERE') {
      console.log('⚠️  Используется демо режим - код в консоли:', code)
      console.log('💡 Для реальной отправки добавьте токен бота в базу данных')
      return true
    }

    // Получаем chat_id из базы данных (безопасный доступ)
    const chatId = (settings as any).chat_id
    if (!chatId) {
      console.log('❌ Chat ID не найден в настройках')
      console.log('⚠️  Код для отладки:', code)
      return false
    }
    
    try {
      // Сначала проверим валидность токена
      console.log('🔍 Проверяем токен бота...')
      const botInfoResponse = await fetch(`https://api.telegram.org/bot${settings.telegram_key}/getMe`)
      const botInfo = await botInfoResponse.json()
      
      if (!botInfo.ok) {
        console.log('❌ Неверный токен бота:', botInfo)
        console.log('⚠️  Код для отладки:', code)
        console.log('💡 Проверьте токен в Prisma Studio или создайте нового бота')
        return false
      }
      
      console.log(`✅ Токен валидный! Бот: @${botInfo.result.username}`)
      
      const response = await fetch(`https://api.telegram.org/bot${settings.telegram_key}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      })

      if (response.ok) {
        console.log('✅ Сообщение отправлено в Telegram')
        return true
      } else {
        const errorData = await response.json()
        console.error('❌ Ошибка отправки сообщения:', errorData)
        
        if (errorData.error_code === 400 && errorData.description.includes('chat not found')) {
          console.log('💡 Chat ID неверный. Получите правильный через /start боту')
        }
        
        // В случае ошибки API все равно показываем код в консоли для отладки
        console.log('⚠️  Код для отладки:', code)
        return false
      }
    } catch (apiError) {
      console.error('❌ Ошибка запроса к Telegram:', apiError)
      console.log('⚠️  Код для отладки:', code)
      return false
    }
  } catch (error) {
    console.error('Ошибка отправки Telegram сообщения:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { login, password, phoneNumber } = await request.json()

    console.log('🔍 Попытка входа:', { login, passwordLength: password?.length, phoneNumber })

    if (!login || !password) {
      return NextResponse.json(
        { error: 'Логин и пароль обязательны' },
        { status: 400 }
      )
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Номер телефона обязателен' },
        { status: 400 }
      )
    }

    // Получаем настройки из базы данных (берем первую запись)
    const settings = await prisma.setting.findFirst({
      where: {
        login_admin: {
          not: null
        },
        password_admin: {
          not: null
        }
      }
    })

    console.log('📊 Настройки из базы:', settings ? {
      id: settings.id,
      login: settings.login_admin,
      hasPassword: !!settings.password_admin,
      hasTelegram: !!settings.telegram_key
    } : 'НЕ НАЙДЕНЫ')

    if (!settings) {
      return NextResponse.json(
        { error: 'Настройки админа не найдены в базе данных' },
        { status: 500 }
      )
    }

    // Проверяем логин и пароль
    if (settings.login_admin !== login || settings.password_admin !== password) {
      console.log('❌ Неверные данные:', { 
        inputLogin: login, 
        dbLogin: settings.login_admin,
        passwordMatch: settings.password_admin === password
      })
      return NextResponse.json(
        { error: 'Неверный логин или пароль' },
        { status: 401 }
      )
    }

    console.log('✅ Данные для входа верны!')

    // Очищаем старые сессии
    await cleanupExpiredSessions()

    // Генерируем и сохраняем код
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 минут

    // Сохраняем код в базу данных
    const session = await prisma.twoFactorSession.create({
      data: {
        phone: phoneNumber,
        code,
        expires_at: expiresAt
      }
    })

    // Отправляем код в Telegram
    const sent = await sendTelegramMessage(phoneNumber, code)

    if (!sent) {
      return NextResponse.json(
        { error: 'Ошибка отправки кода в Telegram' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      phoneNumber,
      message: 'Код отправлен в Telegram'
    })

  } catch (error) {
    console.error('Ошибка отправки кода:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Функция очистки истекших кодов
// Функция очистки просроченных кодов (deprecated - используем cleanupExpiredSessions)
export function cleanupExpiredCodes() {
  // Эта функция больше не нужна, но оставляем для совместимости
  console.log('⚠️  cleanupExpiredCodes устарела, используйте cleanupExpiredSessions')
}
