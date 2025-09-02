import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - обновление заказа
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, status, total } = body

    console.log(`🔍 Updating order ${orderId}:`, body)

    // Находим заказ
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: {
          endsWith: orderId.padStart(4, '0')
        }
      },
      include: {
        user: true
      }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      )
    }

    // Обновляем пользователя
    await prisma.user.update({
      where: { id: existingOrder.user_id },
      data: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      }
    })

    // Обновляем заказ
    await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        status: status.toUpperCase(),
        total_price: total
      }
    })

    console.log(`✅ Order ${orderId} updated successfully`)
    
    return NextResponse.json({
      message: 'Заказ успешно обновлен'
    })

  } catch (error) {
    console.error(`❌ Error updating order:`, error)
    return NextResponse.json(
      { error: 'Ошибка обновления заказа' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - удаление заказа
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    
    console.log(`🔍 Deleting order ${orderId}`)

    // Находим заказ
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: {
          endsWith: orderId.padStart(4, '0')
        }
      }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      )
    }

    // Удаляем связанные элементы заказа
    await prisma.orderItem.deleteMany({
      where: { order_id: existingOrder.id }
    })

    // Удаляем заказ
    await prisma.order.delete({
      where: { id: existingOrder.id }
    })

    console.log(`✅ Order ${orderId} deleted successfully`)
    
    return NextResponse.json({
      message: 'Заказ успешно удален'
    })

  } catch (error) {
    console.error(`❌ Error deleting order:`, error)
    return NextResponse.json(
      { error: 'Ошибка удаления заказа' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
