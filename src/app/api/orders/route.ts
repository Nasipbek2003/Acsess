import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - создание заказа с клиентской части
export async function POST(request: Request) {
  try {
    console.log('🛒 Creating new order from client...')
    const body = await request.json()
    console.log('📦 Received order data:', body)
    
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerAddress, 
      items, 
      totalPrice 
    } = body

    // Валидация обязательных полей
    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      )
    }

    // Проверяем наличие товаров и их остатки
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Товар с ID ${item.id} не найден` },
          { status: 400 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Недостаточно товара "${product.name}" на складе. Доступно: ${product.stock}, запрошено: ${item.quantity}` },
          { status: 400 }
        )
      }
    }

    // Создаем пользователя или находим существующего
    let user = await prisma.user.findUnique({
      where: { email: customerEmail || `${customerPhone}@temp.com` }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: customerName,
          email: customerEmail || `${customerPhone}@temp.com`,
          phone: customerPhone,
          password_hash: 'temp', // Временный хэш для клиентов без регистрации
          role: 'CLIENT'
        }
      })
    }

    // Создаем заказ
    const order = await prisma.order.create({
      data: {
        user_id: user.id,
        status: 'NEW',
        total_price: totalPrice,
        items: {
          create: items.map((item: any) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    })

    // Обновляем остатки товаров
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    // Создаем запись о доставке если указан адрес
    if (customerAddress) {
      await prisma.delivery.create({
        data: {
          order_id: order.id,
          address: customerAddress,
          status: 'PENDING'
        }
      })
    }

    // Создаем уведомление для админа
    await prisma.notification.create({
      data: {
        title: 'Новый заказ',
        message: `Поступил новый заказ #${order.id} от ${customerName} на сумму ${totalPrice}₽`,
        type: 'info'
      }
    })

    console.log('✅ Order created successfully:', order.id)
    return NextResponse.json({ 
      orderId: order.id, 
      status: 'success',
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
