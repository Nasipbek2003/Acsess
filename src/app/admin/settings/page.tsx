'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Settings {
  // Контакты
  phone: string
  email: string
  address: string
  socialLinks: {
    telegram: string
    whatsapp: string
    instagram: string
    vk: string
  }
  
  // SEO
  siteTitle: string
  siteDescription: string
  keywords: string
  metaDescription: string
  
  // Брендинг
  logoUrl: string
  bannerUrl: string
  welcomeText: string
  aboutText: string
  
  // Уведомления
  emailNotifications: boolean
  telegramNotifications: boolean
  telegramBotToken: string
  telegramChatId: string
  notificationEmail: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('contacts')
  const [settings, setSettings] = useState<Settings>({
    phone: '',
    email: '',
    address: '',
    socialLinks: {
      telegram: '',
      whatsapp: '',
      instagram: '',
      vk: ''
    },
    siteTitle: '',
    siteDescription: '',
    keywords: '',
    metaDescription: '',
    logoUrl: '',
    bannerUrl: '',
    welcomeText: '',
    aboutText: '',
    emailNotifications: true,
    telegramNotifications: false,
    telegramBotToken: '',
    telegramChatId: '',
    notificationEmail: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'contacts', name: 'Контакты', icon: '📞' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'branding', name: 'Брендинг', icon: '🎨' },
    { id: 'notifications', name: 'Уведомления', icon: '🔔' }
  ]

  // Загрузка настроек
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error)
    } finally {
      setLoading(false)
    }
  }

  // Сохранение настроек
  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        alert('✅ Настройки успешно сохранены!')
      } else {
        const errorData = await response.json()
        alert(`❌ Ошибка сохранения: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error)
      alert('❌ Ошибка подключения к серверу')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  if (loading) {
    return (
      <AdminLayout title="Настройки сайта">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Настройки сайта">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <span className="text-lg mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Контакты */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Управление контактами
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+7 999 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="info@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Адрес
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Адрес вашей организации"
                />
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Социальные сети</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telegram
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks.telegram}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        socialLinks: { ...settings.socialLinks, telegram: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://t.me/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks.whatsapp}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        socialLinks: { ...settings.socialLinks, whatsapp: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://wa.me/79991234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks.instagram}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://instagram.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      VK
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks.vk}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        socialLinks: { ...settings.socialLinks, vk: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://vk.com/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                SEO настройки
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Заголовок сайта (Title)
                </label>
                <input
                  type="text"
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Название вашего сайта"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Описание сайта
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Краткое описание вашего сайта для поисковых систем"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ключевые слова
                </label>
                <input
                  type="text"
                  value={settings.keywords}
                  onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="ключевые, слова, через, запятую"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Мета-описание для поисковых систем (рекомендуется 150-160 символов)"
                />
              </div>
            </div>
          )}

          {/* Брендинг */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Брендинг и контент
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL логотипа
                  </label>
                  <input
                    type="url"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL баннера
                  </label>
                  <input
                    type="url"
                    value={settings.bannerUrl}
                    onChange={(e) => setSettings({ ...settings, bannerUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Приветственный текст
                </label>
                <textarea
                  value={settings.welcomeText}
                  onChange={(e) => setSettings({ ...settings, welcomeText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Приветственный текст на главной странице"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  О компании
                </label>
                <textarea
                  value={settings.aboutText}
                  onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  rows={5}
                  placeholder="Подробное описание вашей компании"
                />
              </div>
            </div>
          )}

          {/* Уведомления */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Настройки уведомлений
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Включить email уведомления
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="telegramNotifications"
                    checked={settings.telegramNotifications}
                    onChange={(e) => setSettings({ ...settings, telegramNotifications: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="telegramNotifications" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Включить Telegram уведомления
                  </label>
                </div>
              </div>

              {settings.emailNotifications && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email для уведомлений
                  </label>
                  <input
                    type="email"
                    value={settings.notificationEmail}
                    onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="admin@example.com"
                  />
                </div>
              )}

              {settings.telegramNotifications && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telegram Bot Token
                    </label>
                    <input
                      type="text"
                      value={settings.telegramBotToken}
                      onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chat ID
                    </label>
                    <input
                      type="text"
                      value={settings.telegramChatId}
                      onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="-123456789"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Кнопка сохранения */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </>
              ) : (
                '💾 Сохранить настройки'
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

