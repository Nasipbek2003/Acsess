import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { JWT_SECRET } from './lib/constants'

// Функция для проверки JWT токена
async function verifyToken(token: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const decoded = await jwtVerify(token, encoder.encode(JWT_SECRET))
    console.log('Token verified successfully:', decoded)
    return true
  } catch (error) {
    console.error('Token verification failed:', error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  // Защищенные пути, требующие авторизации
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isAdminApiPath = request.nextUrl.pathname.startsWith('/api/admin')
  const isLoginPath = request.nextUrl.pathname === '/admin/login'

  // Если это страница логина, пропускаем
  if (isLoginPath) {
    return NextResponse.next()
  }

  // Если путь не требует защиты, пропускаем
  if (!isAdminPath && !isAdminApiPath) {
    return NextResponse.next()
  }

  // Получаем токен из куки
  const token = request.cookies.get('admin-token')?.value
  console.log('Checking token:', token)

  // Если нет токена - редиректим на логин
  if (!token) {
    console.log('No token found, redirecting to login')
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Проверяем токен
  const isValid = await verifyToken(token)
  if (!isValid) {
    console.log('Invalid token, redirecting to login')
    // Если токен невалидный - редиректим на логин
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin-token')
    return response
  }

  // Если все проверки пройдены - пропускаем запрос
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}