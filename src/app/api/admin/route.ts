import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

// Получить всех админов
export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        login_admin: {
          not: null
        }
      },
      select: {
        id: true,
        login_admin: true,
        description: true,
        created_at: true
      }
    })

    return NextResponse.json({ 
      success: true,
      admins: settings 
    })
  } catch (error) {
    console.error('Ошибка при получении админов:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении данных' },
      { status: 500 }
    )
  }
}

// Добавить нового админа
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { login, password, description } = body

    if (!login || !password) {
      return NextResponse.json(
        { error: 'Логин и пароль обязательны' },
        { status: 400 }
      )
    }

    // Проверяем, не существует ли уже такой логин
    const existingAdmin = await prisma.setting.findFirst({
      where: {
        login_admin: login
      }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Администратор с таким логином уже существует' },
        { status: 400 }
      )
    }

    // Хешируем пароль
    const hashedPassword = await hash(password, 10)

    // Создаем нового админа
    const newAdmin = await prisma.setting.create({
      data: {
        login_admin: login,
        password_admin: hashedPassword,
        description: description || `Администратор ${login}`
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Администратор успешно добавлен',
      admin: {
        id: newAdmin.id,
        login_admin: newAdmin.login_admin,
        description: newAdmin.description
      }
    })
  } catch (error) {
    console.error('Ошибка при добавлении админа:', error)
    return NextResponse.json(
      { error: 'Ошибка при добавлении администратора' },
      { status: 500 }
    )
  }
}













