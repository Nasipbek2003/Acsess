import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Получить все настройки
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')
    
    const settings = await prisma.setting.findMany({
      where: group ? { group } : undefined,
      select: {
        id: true,
        key: true,
        value: true,
        description: true,
        group: true,
        is_secure: true,
        created_at: true,
        updated_at: true,
      },
    })

    // Скрываем значения для безопасных настроек
    return NextResponse.json(
      settings.map(setting => ({
        ...setting,
        value: setting.is_secure ? '******' : setting.value
      }))
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении настроек' },
      { status: 500 }
    )
  }
}

// Создать или обновить настройку
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { key, value, description, is_secure, group } = body

    // Проверяем существование настройки
    const existingSetting = await prisma.setting.findUnique({
      where: { key },
    })

    if (existingSetting) {
      // Обновляем существующую настройку
      const updatedSetting = await prisma.setting.update({
        where: { key },
        data: {
          value,
          description,
          is_secure: is_secure ?? existingSetting.is_secure,
          group: group ?? existingSetting.group,
        },
      })
      return NextResponse.json(updatedSetting)
    }

    // Создаем новую настройку
    const newSetting = await prisma.setting.create({
      data: {
        key,
        value,
        description,
        is_secure: is_secure ?? false,
        group: group ?? 'general',
      },
    })

    return NextResponse.json(newSetting)
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при сохранении настройки' },
      { status: 500 }
    )
  }
}

// Удалить настройку
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Ключ настройки не указан' },
        { status: 400 }
      )
    }

    await prisma.setting.delete({
      where: { key },
    })

    return NextResponse.json({ message: 'Настройка успешно удалена' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при удалении настройки' },
      { status: 500 }
    )
  }
}