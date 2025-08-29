import { prisma } from '@/lib/prisma'
import { compare } from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { login, password } = body

    console.log('Попытка входа с логином:', login)

    // Ищем администратора с указанным логином
    const admin = await prisma.setting.findFirst({
      where: {
        login_admin: login
      }
    })

    console.log('Найден админ:', admin ? 'Да' : 'Нет')
    
    if (!admin) {
      console.log('Администратор с логином', login, 'не найден')
      return NextResponse.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      )
    }

    console.log('Логин из БД:', admin.login_admin)
    console.log('Есть ли пароль в БД:', !!admin.password_admin)

    // Проверяем, есть ли пароль у этого админа
    if (!admin.password_admin) {
      console.log('Пароль не установлен для этого админа')
      return NextResponse.json(
        { error: 'Пароль не установлен' },
        { status: 500 }
      )
    }

    console.log('Проверяем пароль...')
    
    // Проверяем пароль
    const isPasswordValid = await compare(password, admin.password_admin)
    
    console.log('Пароль правильный:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('Неверный пароль для админа', login)
      return NextResponse.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      )
    }

    console.log('Успешная аутентификация для админа:', login)
    
    // Успешная аутентификация
    return NextResponse.json({ 
      success: true,
      message: 'Успешная аутентификация',
      admin: {
        id: admin.id,
        login: admin.login_admin,
        description: admin.description
      }
    })

  } catch (error) {
    console.error('Ошибка аутентификации:', error)
    return NextResponse.json(
      { error: 'Ошибка при аутентификации' },
      { status: 500 }
    )
  }
}