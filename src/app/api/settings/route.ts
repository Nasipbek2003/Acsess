import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - получение публичных настроек сайта
export async function GET() {
  try {
    console.log('🔍 Fetching public site settings...')
    
    const settings = await prisma.setting.findMany({
      where: {
        is_secure: false // Только публичные настройки
      }
    })

    // Преобразуем настройки в удобный формат
    const publicSettings = settings.reduce((acc: any, setting) => {
      // Создаем ключ из описания или используем ID
      const key = setting.description?.toLowerCase().replace(/\s+/g, '_') || `setting_${setting.id}`
      
      acc[key] = {
        id: setting.id,
        description: setting.description,
        // Возвращаем только безопасные данные
        value: setting.description || null
      }
      
      return acc
    }, {})

    console.log(`✅ Found ${settings.length} public settings`)
    return NextResponse.json(publicSettings)

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