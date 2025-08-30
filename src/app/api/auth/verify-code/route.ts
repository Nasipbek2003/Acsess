import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { SignJWT } from 'jose'
import { JWT_SECRET } from '@/lib/constants'

const prisma = new PrismaClient()

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
    const encoder = new TextEncoder()
    const token = await new SignJWT({ 
      authorized: true,
      phone: session.phone,
      timestamp: Date.now()
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(encoder.encode(JWT_SECRET))

    console.log('Generated token:', token)

    // Создаем ответ
    const response = NextResponse.json({
      success: true,
      message: 'Аутентификация успешна'
    })

    // Устанавливаем куки
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 часа
      path: '/'
    })

    console.log('Set cookie:', response.cookies.get('admin-token'))

    return response

  } catch (error) {
    console.error('Ошибка проверки кода:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}