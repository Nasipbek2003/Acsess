import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json()

    console.log('🔍 Проверка логина:', { login, passwordLength: password?.length })

    if (!login || !password) {
      return NextResponse.json(
        { error: 'Логин и пароль обязательны' },
        { status: 400 }
      )
    }

    // Получаем настройки из базы данных
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

    return NextResponse.json({
      success: true,
      message: 'Данные верны, можно переходить к вводу телефона'
    })

  } catch (error) {
    console.error('Ошибка проверки логина:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
