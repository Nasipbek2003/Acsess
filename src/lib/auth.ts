import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

export async function validateToken(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value

  if (!token) {
    return NextResponse.json(
      { error: 'Требуется авторизация' },
      { status: 401 }
    )
  }

  try {
    const decoded = verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return NextResponse.json(
      { error: 'Недействительный токен' },
      { status: 401 }
    )
  }
}

export function withAuth(handler: Function) {
  return async function(request: NextRequest, ...args: any[]) {
    const result = await validateToken(request)
    
    if (result instanceof NextResponse) {
      return result
    }

    return handler(request, ...args)
  }
}
