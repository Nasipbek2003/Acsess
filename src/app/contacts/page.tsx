'use client'

import { useState } from 'react'
import ClientLayout from '@/components/client/ClientLayout'

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет отправка данных на сервер
    alert('Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время. 📞')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            📞 Контакты
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь вам и ответить на ваши вопросы
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Контактная информация */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                📍 Как с нами связаться
              </h2>
              
              <div className="space-y-6">
                {/* Телефон */}
                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Телефон
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Горячая линия работает 24/7
                    </p>
                    <a 
                      href="tel:+78001234567" 
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      8 (800) 123-45-67
                    </a>
                    <br />
                    <a 
                      href="tel:+74951234567" 
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      +7 (495) 123-45-67
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Ответим в течение 24 часов
                    </p>
                    <a 
                      href="mailto:info@siberian-wellness.ru" 
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      info@siberian-wellness.ru
                    </a>
                    <br />
                    <a 
                      href="mailto:support@siberian-wellness.ru" 
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      support@siberian-wellness.ru
                    </a>
                  </div>
                </div>

                {/* Адрес */}
                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Главный офис
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      г. Москва, ул. Тверская, д. 123<br />
                      БЦ "Центральный", офис 456<br />
                      125009, Россия
                    </p>
                  </div>
                </div>

                {/* Социальные сети */}
                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Социальные сети
                    </h3>
                    <div className="flex space-x-3">
                      {[
                        { name: 'Telegram', icon: '📱', href: '#' },
                        { name: 'WhatsApp', icon: '💬', href: '#' },
                        { name: 'Instagram', icon: '📸', href: '#' },
                        { name: 'VK', icon: '🔷', href: '#' }
                      ].map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg flex items-center justify-center transition-colors duration-200"
                          title={social.name}
                        >
                          <span className="text-lg">{social.icon}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Режим работы */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                🕒 Режим работы
              </h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Понедельник - Пятница:</span>
                  <span className="font-semibold">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Суббота:</span>
                  <span className="font-semibold">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Воскресенье:</span>
                  <span className="font-semibold">Выходной</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span>Горячая линия:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              💬 Напишите нам
            </h2>
            
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="+7 999 123-45-67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Тема обращения *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Выберите тему</option>
                  <option value="product-question">Вопрос о продукции</option>
                  <option value="order-support">Поддержка по заказу</option>
                  <option value="partnership">Вопросы партнерства</option>
                  <option value="technical-support">Техническая поддержка</option>
                  <option value="complaint">Жалоба</option>
                  <option value="suggestion">Предложение</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Сообщение *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Опишите ваш вопрос или предложение..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                📤 Отправить сообщение
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Отправляя сообщение, вы соглашаетесь с нашей политикой конфиденциальности
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Часто задаваемые вопросы */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ❓ Часто задаваемые вопросы
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Возможно, ответ на ваш вопрос уже есть здесь
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'Как сделать заказ?',
                answer: 'Выберите товары в нашем магазине, добавьте их в корзину и оформите заказ. Мы свяжемся с вами для подтверждения.'
              },
              {
                question: 'Какие способы оплаты доступны?',
                answer: 'Мы принимаем оплату банковскими картами, через электронные кошельки и наличными при получении.'
              },
              {
                question: 'Сколько времени занимает доставка?',
                answer: 'Доставка по Москве - 1-2 дня, по России - 3-7 дней в зависимости от региона.'
              },
              {
                question: 'Можно ли вернуть товар?',
                answer: 'Да, в течение 14 дней с момента покупки при сохранении упаковки и товарного вида.'
              },
              {
                question: 'Как стать партнером?',
                answer: 'Заполните форму на странице "Зарабатывай с нами", и наш менеджер свяжется с вами для консультации.'
              }
            ].map((faq, index) => (
              <details key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <summary className="p-6 cursor-pointer font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {faq.question}
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Карта */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🗺️ Как нас найти
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Наш офис находится в центре Москвы
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-6">🗺️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Интерактивная карта
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Здесь будет размещена интерактивная карта с местоположением нашего офиса
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              📍 г. Москва, ул. Тверская, д. 123, БЦ "Центральный", офис 456
            </p>
          </div>
        </div>
      </section>
    </ClientLayout>
  )
}

