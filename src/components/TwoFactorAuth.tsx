'use client'

import { useState, useRef, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

interface TwoFactorAuthProps {
  phoneNumber: string
  onVerify: (code: string) => Promise<void>
  onResendCode: () => Promise<void>
  onBack: () => void
}

export default function TwoFactorAuth({ phoneNumber, onVerify, onResendCode, onBack }: TwoFactorAuthProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Таймер для повторной отправки
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Автоматический переход к следующему полю
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }

      // Автоматическая отправка при заполнении всех полей
      if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
        handleVerify(newCode.join(''))
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify || code.join('')
    if (verificationCode.length !== 6) {
      setError('Введите 6-значный код')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await onVerify(verificationCode)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный код')
      // Очищаем поля при ошибке
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setError('')
    setIsLoading(true)
    
    try {
      await onResendCode()
      setCountdown(60)
      setCanResend(false)
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки кода')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith('+7')) {
      return `+7 (${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8, 10)}-${phone.slice(10, 12)}`
    }
    return phone
  }

  return (
    <div className="w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-300">
        {/* Theme toggle in top right */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📱</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Двухфакторная аутентификация
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Мы отправили 6-значный код в Telegram на номер
          </p>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
            {formatPhoneNumber(phoneNumber)}
          </p>
        </div>

        <div className="space-y-6">
          {/* Поля для ввода кода */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
              Введите код из Telegram
            </label>
            <div className="flex justify-center space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800 transition-colors duration-300 text-center">
              {error}
            </div>
          )}

          {/* Кнопка повторной отправки */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Не получили код?
            </p>
            <button
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {canResend ? 'Отправить повторно' : `Повторить через ${countdown}с`}
            </button>
          </div>

          {/* Кнопка назад */}
          <button
            onClick={onBack}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Назад к входу
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
              <svg className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Проверка...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
