import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - получение популярных продуктов для главной страницы
export async function GET() {
  try {
    console.log('🔍 Fetching featured products...')
    
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      where: {
        stock: {
          gt: 0 // Только товары в наличии
        }
      },
      orderBy: [
        { created_at: 'desc' },
        { name: 'asc' }
      ],
      take: 12 // Берем первые 12 продуктов
    })

    // Преобразуем продукты в формат для клиентов
    const featuredProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || undefined,
      category: product.category?.name || 'Без категории'
    }))

    console.log(`✅ Found ${featuredProducts.length} featured products`)
    return NextResponse.json(featuredProducts)

  } catch (error) {
    console.error('❌ Error fetching featured products:', error)
    return NextResponse.json(
      { error: 'Ошибка получения популярных продуктов' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
