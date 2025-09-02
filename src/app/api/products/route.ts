import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - получение всех продуктов для клиентов с поиском и пагинацией
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const skip = (page - 1) * limit

    console.log('🔍 Fetching products for clients...', { search, category, page, limit })
    
    // Строим условия для поиска
    const whereConditions: any = {
      stock: {
        gt: 0 // Только товары в наличии
      }
    }

    // Добавляем поиск по названию и описанию
    if (search) {
      whereConditions.OR = [
        {
          name: {
            contains: search
          }
        },
        {
          description: {
            contains: search
          }
        }
      ]
    }

    // Добавляем фильтр по категории
    if (category) {
      whereConditions.category = {
        name: category
      }
    }

    // Получаем товары с пагинацией
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereConditions,
        include: {
          category: true
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.product.count({
        where: whereConditions
      })
    ])

    // Преобразуем продукты в формат для клиентов
    const clientProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || undefined,
      description: product.description || undefined,
      category: product.category?.name || 'Без категории',
      inStock: product.stock > 0
    }))

    console.log(`✅ Found ${clientProducts.length} products (total: ${totalCount})`)
    return NextResponse.json({
      products: clientProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasMore: skip + products.length < totalCount
      }
    })

  } catch (error) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json(
      { error: 'Ошибка получения продуктов' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
