import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - получение настроек
export async function GET() {
  try {
    console.log('🔍 Fetching settings...')
    
    const settings = await prisma.setting.findMany()
    
    // Преобразуем настройки в удобный формат
    const settingsObject = settings.reduce((acc, setting) => {
      if (setting.login_admin && setting.password_admin) {
        // Админские настройки не возвращаем
        return acc
      }
      
      // Обрабатываем JSON строки
      if (setting.description?.startsWith('{')) {
        try {
          acc[setting.description] = JSON.parse(setting.description)
        } catch (e) {
          // Если не JSON, используем как есть
        }
      }
      
      return acc
    }, {} as any)

    // Настройки по умолчанию
    const defaultSettings = {
      phone: '',
      email: '',
      address: '',
      socialLinks: {
        telegram: '',
        whatsapp: '',
        instagram: '',
        vk: ''
      },
      siteTitle: 'Acsess Admin',
      siteDescription: 'Система управления интернет-магазином',
      keywords: '',
      metaDescription: '',
      logoUrl: '',
      bannerUrl: '',
      welcomeText: '',
      aboutText: '',
      emailNotifications: true,
      telegramNotifications: false,
      telegramBotToken: '',
      telegramChatId: '',
      notificationEmail: ''
    }

    // Объединяем с настройками из БД
    const result = { ...defaultSettings, ...settingsObject }
    
    console.log('✅ Settings loaded')
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Ошибка получения настроек' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST - сохранение настроек
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('🔍 Saving settings:', body)

    // Очищаем старые настройки (кроме админских)
    await prisma.setting.deleteMany({
      where: {
        AND: [
          { login_admin: null },
          { password_admin: null }
        ]
      }
    })

    // Сохраняем новые настройки
    const settingsToSave = []
    
    // Основные настройки
    if (body.phone) {
      settingsToSave.push({
        description: 'phone',
        telegram_key: body.phone
      })
    }
    
    if (body.email) {
      settingsToSave.push({
        description: 'email',
        telegram_key: body.email
      })
    }
    
    if (body.address) {
      settingsToSave.push({
        description: 'address',
        telegram_key: body.address
      })
    }

    // Социальные сети
    if (body.socialLinks) {
      settingsToSave.push({
        description: 'socialLinks',
        telegram_key: JSON.stringify(body.socialLinks)
      })
    }

    // SEO настройки
    if (body.siteTitle) {
      settingsToSave.push({
        description: 'siteTitle',
        telegram_key: body.siteTitle
      })
    }
    
    if (body.siteDescription) {
      settingsToSave.push({
        description: 'siteDescription',
        telegram_key: body.siteDescription
      })
    }
    
    if (body.keywords) {
      settingsToSave.push({
        description: 'keywords',
        telegram_key: body.keywords
      })
    }
    
    if (body.metaDescription) {
      settingsToSave.push({
        description: 'metaDescription',
        telegram_key: body.metaDescription
      })
    }

    // Брендинг
    if (body.logoUrl) {
      settingsToSave.push({
        description: 'logoUrl',
        telegram_key: body.logoUrl
      })
    }
    
    if (body.bannerUrl) {
      settingsToSave.push({
        description: 'bannerUrl',
        telegram_key: body.bannerUrl
      })
    }
    
    if (body.welcomeText) {
      settingsToSave.push({
        description: 'welcomeText',
        telegram_key: body.welcomeText
      })
    }
    
    if (body.aboutText) {
      settingsToSave.push({
        description: 'aboutText',
        telegram_key: body.aboutText
      })
    }

    // Уведомления
    settingsToSave.push({
      description: 'emailNotifications',
      telegram_key: body.emailNotifications ? 'true' : 'false'
    })
    
    settingsToSave.push({
      description: 'telegramNotifications',
      telegram_key: body.telegramNotifications ? 'true' : 'false'
    })
    
    if (body.telegramBotToken) {
      settingsToSave.push({
        description: 'telegramBotToken',
        telegram_key: body.telegramBotToken
      })
    }
    
    if (body.telegramChatId) {
      settingsToSave.push({
        description: 'telegramChatId',
        telegram_key: body.telegramChatId
      })
    }
    
    if (body.notificationEmail) {
      settingsToSave.push({
        description: 'notificationEmail',
        telegram_key: body.notificationEmail
      })
    }

    // Создаем все настройки
    for (const setting of settingsToSave) {
      await prisma.setting.create({
        data: setting
      })
    }

    console.log('✅ Settings saved successfully')
    return NextResponse.json({ message: 'Настройки успешно сохранены' })

  } catch (error) {
    console.error('❌ Error saving settings:', error)
    return NextResponse.json(
      { error: 'Ошибка сохранения настроек' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

