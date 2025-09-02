'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Магазин', href: '/shop' },
    { name: 'О нас', href: '/about' },
    { name: 'Контакты', href: '/contacts' }
  ]

  const categories = [
    { name: 'Витамины и БАДы', href: '/shop?category=vitamins' },
    { name: 'Косметика', href: '/shop?category=cosmetics' },
    { name: 'Уход за телом', href: '/shop?category=body-care' },
    { name: 'Спорт и фитнес', href: '/shop?category=fitness' }
  ]

  const socialLinks = [
    { name: 'Telegram', href: '#', icon: '📱' },
    { name: 'WhatsApp', href: '#', icon: '💬' },
    { name: 'Instagram', href: '#', icon: '📸' },
    { name: 'VK', href: '#', icon: '🔷' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Основной контент футера */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* О компании */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🌿</span>
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Siberian Wellness
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ваш надежный партнер в мире здоровья и красоты. Качественные продукты 
              для активной и здоровой жизни.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title={social.name}
                >
                  <span className="text-sm">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Навигация</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/earn"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm"
                >
                  Зарабатывай с нами
                </Link>
              </li>

            </ul>
          </div>

          {/* Категории товаров */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Категории</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контактная информация */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Контакты</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-emerald-400 mt-0.5">📞</span>
                <div>
                  <p className="text-gray-400">Телефон:</p>
                  <a href="tel:+79991234567" className="text-white hover:text-emerald-400 transition-colors">
                    +7 999 123-45-67
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-emerald-400 mt-0.5">✉️</span>
                <div>
                  <p className="text-gray-400">Email:</p>
                  <a href="mailto:info@siberian-wellness.ru" className="text-white hover:text-emerald-400 transition-colors">
                    info@siberian-wellness.ru
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-emerald-400 mt-0.5">🕒</span>
                <div>
                  <p className="text-gray-400">Режим работы:</p>
                  <p className="text-white">Пн-Пт: 9:00-18:00</p>
                  <p className="text-white">Сб-Вс: 10:00-16:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя часть футера */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} Siberian Wellness. Все права защищены.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Условия использования
              </Link>
              <Link href="/returns" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Возврат и обмен
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
