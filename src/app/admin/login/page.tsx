'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import PhoneNumberInput from '@/components/PhoneNumberInput'
import TwoFactorAuth from '@/components/TwoFactorAuth'
import AnimatedBackground from '@/components/AnimatedBackground'
import NoSSR from '@/components/NoSSR'

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'login' | 'phone' | '2fa'>('login')
  const [loginData, setLoginData] = useState<{
    login: string
    password: string
  } | null>(null)
  const [sessionData, setSessionData] = useState<{
    sessionId: string
    phoneNumber: string
  } | null>(null)

  const handleLogin = async (login: string, password: string) => {
    try {
      // Сначала проверяем логин и пароль в базе данных
      const response = await fetch('/api/auth/validate-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка проверки данных')
      }

      // Если данные верны, сохраняем их и переходим к вводу телефона
      setLoginData({ login, password })
      setStep('phone')
    } catch (error) {
      // Пробрасываем ошибку в LoginForm для отображения
      throw error
    }
  }

  const handlePhoneSubmit = async (phoneNumber: string) => {
    if (!loginData) {
      throw new Error('Данные логина не найдены')
    }

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          login: loginData.login, 
          password: loginData.password,
          phoneNumber 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отправки кода')
      }

      // Переходим к этапу двухфакторной аутентификации
      setSessionData({
        sessionId: data.sessionId,
        phoneNumber: data.phoneNumber
      })
      setStep('2fa')
    } catch (error) {
      throw error
    }
  }

  const handleVerifyCode = async (code: string) => {
    if (!sessionData) {
      throw new Error('Сессия не найдена')
    }

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sessionId: sessionData.sessionId, 
          code 
        }),
      })

      const data = await response.json()
      console.log('Verify code response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка проверки кода')
      }

      if (data.success) {
        // Добавляем небольшую задержку перед редиректом
        await new Promise(resolve => setTimeout(resolve, 500))
        router.push('/admin')
        router.refresh()
      } else {
        throw new Error(data.error || 'Ошибка при проверке кода')
      }
    } catch (error) {
      throw error
    }
  }

  const handleResendCode = async () => {
    if (!sessionData) {
      throw new Error('Сессия не найдена')
    }

    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sessionId: sessionData.sessionId
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка повторной отправки')
      }
    } catch (error) {
      throw error
    }
  }

  const handleBackToLogin = () => {
    setStep('login')
    setLoginData(null)
    setSessionData(null)
  }

  const handleBackToPhone = () => {
    setStep('phone')
    setSessionData(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gray-900 dark:bg-gray-950 transition-colors duration-300">
      <NoSSR>
        <AnimatedBackground />
      </NoSSR>
      
      {step === 'login' && (
        <LoginForm onSubmit={handleLogin} />
      )}
      
      {step === 'phone' && (
        <PhoneNumberInput
          onSubmit={handlePhoneSubmit}
          onBack={handleBackToLogin}
        />
      )}
      
      {step === '2fa' && sessionData && (
        <TwoFactorAuth
          phoneNumber={sessionData.phoneNumber}
          onVerify={handleVerifyCode}
          onResendCode={handleResendCode}
          onBack={handleBackToPhone}
        />
      )}
    </div>
  )
}