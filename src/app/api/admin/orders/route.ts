import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - получение всех заказов
export async function GET() {
  try {
    console.log('🔍 Fetching all orders...')
    
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Преобразуем данные в нужный формат
    const formattedOrders = orders.map(order => ({
      id: parseInt(order.id.slice(-4)), // Берем последние 4 символа ID как число
      customer: order.user.name,
      email: order.user.email,
      phone: order.user.phone || '',
      total: order.total_price,
      status: order.status.toLowerCase(),
      date: order.created_at.toISOString().split('T')[0],
      items: order.items.length
    }))

    console.log(`✅ Found ${formattedOrders.length} orders`)
    return NextResponse.json(formattedOrders)

  } catch (error) {
    console.error('❌ Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Ошибка получения заказов' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST - создание нового заказа
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, items, status, total } = body

    console.log('🔍 Creating new order:', body)

    // Сначала создаем или находим пользователя
    let user = await prisma.user.findUnique({
      where: { email: customerEmail }
    })

    if (!user) {
      // Создаем нового пользователя
      user = await prisma.user.create({
        data: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          password_hash: 'temp_hash', // Временный хеш
          role: 'CLIENT'
        }
      })
    }

    // Создаем заказ
    const order = await prisma.order.create({
      data: {
        user_id: user.id,
        status: status.toUpperCase(),
        total_price: total
      }
    })

    console.log(`✅ Order created with ID: ${order.id}`)
    
    return NextResponse.json({
      id: parseInt(order.id.slice(-4)),
      message: 'Заказ успешно создан'
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error creating order:', error)
    return NextResponse.json(
      { error: 'Ошибка создания заказа' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

