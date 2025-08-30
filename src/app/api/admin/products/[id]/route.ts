import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Ошибка при удалении товара:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении товара' },
      { status: 500 }
    )
  }
}

