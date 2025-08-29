'use client'

import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

interface PhoneNumberInputProps {
  onSubmit: (phoneNumber: string) => Promise<void>
  onBack: () => void
}

export default function PhoneNumberInput({ onSubmit, onBack }: PhoneNumberInputProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const formatPhoneNumber = (value: string) => {
    // Удаляем все кроме цифр
    const digits = value.replace(/\D/g, '')
    
    // Ограничиваем длину (996 + 9 цифр = 12 цифр всего)
    const maxLength = 12
    const truncated = digits.slice(0, maxLength)
    
    // Форматируем как +996 (XXX) XX-XX-XX
    if (truncated.length === 0) return ''
    if (truncated.length <= 3) return `+996`
    if (truncated.length <= 6) return `+996 (${truncated.slice(3)})`
    if (truncated.length <= 8) return `+996 (${truncated.slice(3, 6)}) ${truncated.slice(6)}`
    if (truncated.length <= 10) return `+996 (${truncated.slice(3, 6)}) ${truncated.slice(6, 8)}-${truncated.slice(8)}`
    return `+996 (${truncated.slice(3, 6)}) ${truncated.slice(6, 8)}-${truncated.slice(8, 10)}-${truncated.slice(10)}`
  }

  const getRawPhoneNumber = (formatted: string) => {
    const digits = formatted.replace(/\D/g, '')
    return digits.startsWith('996') ? `+${digits}` : `+996${digits}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const rawPhone = getRawPhoneNumber(phoneNumber)
    if (rawPhone.length < 13) { // +996 + 9 цифр = 13 символов
      setError('Введите полный номер телефона')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await onSubmit(rawPhone)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки кода')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-300">
        {/* Theme toggle in top right */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📱</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Номер телефона
          </h2>
                     <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
             Введите номер телефона для получения кода в Telegram
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 mb-2">
              Номер телефона
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phoneNumber}
              onChange={handleInputChange}
              placeholder="+996 (___) __-__-__"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-lg text-center font-mono text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200"
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Убедитесь, что у вас есть доступ к Telegram на этом номере
            </p>
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800 transition-colors duration-300 text-center">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
                             disabled={isLoading || phoneNumber.replace(/\D/g, '').length < 12} // 996 + 9 цифр = 12 цифр
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка кода...
                </span>
              ) : (
                'Отправить код в Telegram'
              )}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Назад к логину
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
