import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🔍 Fetching popular products...')
    
    // Получаем товары с основной информацией
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Добавляем поля sales и revenue для совместимости с интерфейсом
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      sales: Math.floor(Math.random() * 50) + 1, // Временные данные
      revenue: product.price * Math.floor(Math.random() * 50 + 1) // Временные данные
    }))

    console.log(`✅ Found ${transformedProducts.length} products for popular section`)

    return NextResponse.json(transformedProducts)

  } catch (error) {
    console.error('❌ Error fetching popular products:', error)
    return NextResponse.json(
      { error: 'Ошибка получения популярных товаров' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}