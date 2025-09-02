'use client'

import { useState } from 'react'
import Link from 'next/link'
import ClientLayout from '@/components/client/ClientLayout'

export default function EarnPage() {
  const [selectedPlan, setSelectedPlan] = useState('consultant')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    experience: '',
    motivation: ''
  })

  const plans = [
    {
      id: 'consultant',
      name: 'Консультант по здоровью',
      commission: 'до 25%',
      requirements: 'Регистрация на сайте',
      benefits: [
        'Персональная скидка до 25%',
        'Розничная наценка 25-40%',
        'Доступ к личному кабинету',
        'Обучающие материалы и вебинары',
        'Поддержка менеджера',
        'Сертификат консультанта'
      ],
      color: 'emerald'
    },
    {
      id: 'manager',
      name: 'Менеджер по развитию',
      commission: 'до 40%',
      requirements: 'Оборот группы от 100,000 ₽',
      benefits: [
        'Максимальная скидка до 40%',
        'Командные бонусы 5-15%',
        'Лидерские надбавки',
        'Участие в программе развития',
        'Приглашения на семинары',
        'Дополнительные поощрения'
      ],
      color: 'blue'
    },
    {
      id: 'director',
      name: 'Региональный директор',
      commission: 'до 50%',
      requirements: 'Оборот сети от 500,000 ₽',
      benefits: [
        'Директорская скидка до 50%',
        'Процент с оборота сети до 12%',
        'Автомобильная программа',
        'Зарубежные поездки и конференции',
        'Статус VIP-партнера',
        'Индивидуальное сопровождение'
      ],
      color: 'purple'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет отправка данных на сервер
    alert('Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время. 📞')
  }

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950">
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/30 dark:bg-emerald-700/30 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-teal-200/30 dark:bg-teal-700/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-cyan-200/20 dark:bg-cyan-700/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-emerald-300/20 dark:bg-emerald-600/20 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            💰 Зарабатывай с нами
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Станьте консультантом по здоровью и зарабатывайте на продаже качественных продуктов Siberian Wellness
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            Более 25 лет компания развивает сетевой бизнес по всему миру. Сегодня мы работаем в 25+ странах и предлагаем 
            проверенную систему заработка с реальными результатами наших партнеров.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: '💰', title: 'Скидка до 50%', desc: 'На всю продукцию для партнеров' },
              { icon: '🏆', title: '25+ лет на рынке', desc: 'Проверенная бизнес-модель' },
              { icon: '🌍', title: '25 стран мира', desc: 'Международная компания' }
            ].map((item, index) => (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <a href="#plans" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            🚀 Узнать больше
          </a>
        </div>
      </section>

      {/* Планы партнерства */}
      <section id="plans" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              📊 Планы партнерства
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Выберите уровень, который подходит именно вам. Каждый план открывает новые возможности для заработка и развития
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                  plan.id === 'manager' ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                {plan.id === 'manager' && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                    🌟 Популярный выбор
                  </div>
                )}
                
                <div className="p-8">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                    plan.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900' :
                    plan.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                    'bg-purple-100 dark:bg-purple-900'
                  }`}>
                    <span className="text-2xl">
                      {plan.id === 'consultant' ? '👤' : plan.id === 'manager' ? '👔' : '👑'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="text-center mb-6">
                    <span className={`text-4xl font-bold ${
                      plan.color === 'emerald' ? 'text-emerald-600' :
                      plan.color === 'blue' ? 'text-blue-600' :
                      'text-purple-600'
                    }`}>
                      {plan.commission}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">комиссия</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Требования:</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{plan.requirements}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? `${
                            plan.color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' :
                            plan.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                            'bg-purple-600 hover:bg-purple-700'
                          } text-white`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {selectedPlan === plan.id ? '✓ Выбрано' : 'Выбрать план'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества работы с нами */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ✨ Почему Siberian Wellness?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Мы создали идеальные условия для вашего успеха
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🎓',
                title: 'Бесплатное обучение',
                description: 'Полный курс продаж и маркетинга, вебинары, тренинги'
              },
              {
                icon: '🏆',
                title: '20+ лет на рынке',
                description: 'Проверенная компания с безупречной репутацией'
              },
              {
                icon: '🌍',
                title: 'Международная сеть',
                description: 'Работаем в 25+ странах мира, развитая логистика'
              },
              {
                icon: '💎',
                title: 'Премиум продукты',
                description: 'Высококачественные товары с сертификатами'
              },
              {
                icon: '📱',
                title: 'Цифровые инструменты',
                description: 'Современные CRM, мобильные приложения, автоматизация'
              },
              {
                icon: '🎁',
                title: 'Бонусные программы',
                description: 'Путешествия, призы, дополнительные вознаграждения'
              },
              {
                icon: '👥',
                title: 'Команда профессионалов',
                description: 'Поддержка наставников и опытных партнеров'
              },
              {
                icon: '💳',
                title: 'Быстрые выплаты',
                description: 'Еженедельные выплаты комиссий, прозрачная система'
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Форма регистрации */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              📝 Станьте партнером прямо сейчас
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Заполните форму, и мы свяжемся с вами для обсуждения деталей сотрудничества
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя и фамилия *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Иван Иванов"
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
                    placeholder="ivan@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+7 999 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Город *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Москва"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Опыт в продажах
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Выберите опыт</option>
                  <option value="no-experience">Без опыта</option>
                  <option value="1-2-years">1-2 года</option>
                  <option value="3-5-years">3-5 лет</option>
                  <option value="5-plus-years">Более 5 лет</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Что вас мотивирует?
                </label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Расскажите немного о ваших целях и мотивации..."
                />
              </div>

              <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                  Выбранный план: {plans.find(p => p.id === selectedPlan)?.name}
                </h4>
                <p className="text-emerald-700 dark:text-emerald-400 text-sm">
                  Комиссия: {plans.find(p => p.id === selectedPlan)?.commission}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🚀 Отправить заявку
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Отправляя заявку, вы соглашаетесь с{' '}
                <Link href="/privacy" className="text-emerald-600 hover:underline">
                  политикой конфиденциальности
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Истории успеха */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🌟 Истории успеха
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Узнайте, как наши партнеры достигли финансового успеха
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Мария Волкова',
                role: 'Региональный директор',
                income: 'до 200,000 ₽/мес',
                story: 'За 3 года развития построила сеть в 5 городах. Получила автомобиль по программе компании',
                avatar: '👩‍💼'
              },
              {
                name: 'Дмитрий Орлов',
                role: 'Менеджер по развитию',
                income: 'до 120,000 ₽/мес',
                story: 'Начал как консультант, за 18 месяцев достиг менеджерского уровня благодаря системному подходу',
                avatar: '👨‍💼'
              },
              {
                name: 'Светлана Новикова',
                role: 'Консультант по здоровью',
                income: 'до 60,000 ₽/мес',
                story: 'Совмещаю основную работу с консультированием. Дополнительный доход позволил реализовать мечты',
                avatar: '👩‍⚕️'
              }
            ].map((person, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{person.avatar}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{person.name}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">{person.role}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{person.income}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center italic">
                  "{person.story}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ClientLayout>
  )
}
