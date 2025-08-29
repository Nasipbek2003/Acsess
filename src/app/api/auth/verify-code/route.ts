import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sign } from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

export async function POST(request: Request) {
  try {
    const { sessionId, code } = await request.json()

    if (!sessionId || !code) {
      return NextResponse.json(
        { error: 'Session ID и код обязательны' },
        { status: 400 }
      )
    }

    // Получаем сессию из базы данных
    const session = await prisma.twoFactorSession.findUnique({
      where: {
        id: sessionId
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Сессия не найдена или истекла' },
        { status: 404 }
      )
    }

    // Проверяем срок действия
    if (new Date() > session.expires_at) {
      // Удаляем истекшую сессию
      await prisma.twoFactorSession.delete({
        where: { id: sessionId }
      })
      return NextResponse.json(
        { error: 'Код истек. Запросите новый код' },
        { status: 410 }
      )
    }

    // Проверяем код
    if (session.code !== code) {
      return NextResponse.json(
        { error: 'Неверный код' },
        { status: 401 }
      )
    }

    // Удаляем использованную сессию
    await prisma.twoFactorSession.delete({
      where: { id: sessionId }
    })

    // Создаем JWT токен
    const token = sign(
      { 
        authorized: true, 
        phone: session.phone,
        timestamp: Date.now()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Создаем ответ с установкой куки
    const response = NextResponse.json({
      success: true,
      message: 'Аутентификация успешна'
    })

    // Устанавливаем HTTP-only куку с токеном
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 часа
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Ошибка проверки кода:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
