'use client'

import ClientLayout from '@/components/client/ClientLayout'

export default function AboutPage() {
  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            ℹ️ О компании Siberian Wellness
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Более 20 лет мы помогаем людям жить здоровой и активной жизнью, предлагая качественные продукты для здоровья и красоты
          </p>
        </div>
      </section>

      {/* Наша история */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                📚 Наша история
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Компания Siberian Wellness была основана в 1996 году с простой, но важной миссией — 
                  сделать здоровый образ жизни доступным для каждого человека.
                </p>
                <p>
                  Мы начали как небольшая команда энтузиастов, которые верили в силу натуральных продуктов 
                  и их способность улучшать качество жизни людей. За годы работы мы выросли в международную 
                  компанию, работающую в 25+ странах мира.
                </p>
                <p>
                  Сегодня наша продукция помогает миллионам людей поддерживать здоровье, красоту и активность. 
                  Мы продолжаем развиваться, внедряя новые технологии и расширяя ассортимент.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                20+ лет опыта
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Два десятилетия инноваций в области здоровья и красоты
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Наши ценности */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              💎 Наши ценности
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Принципы, которыми мы руководствуемся в работе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🌿',
                title: 'Натуральность',
                description: 'Используем только натуральные и экологически чистые ингредиенты'
              },
              {
                icon: '🔬',
                title: 'Инновации',
                description: 'Постоянно исследуем и внедряем новые технологии'
              },
              {
                icon: '🏆',
                title: 'Качество',
                description: 'Строгий контроль качества на всех этапах производства'
              },
              {
                icon: '❤️',
                title: 'Забота',
                description: 'Искренне заботимся о здоровье и благополучии наших клиентов'
              }
            ].map((value, index) => (
              <div key={index} className="text-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Достижения */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🏆 Наши достижения
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Цифры, которые говорят о нашем успехе
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '25+', label: 'стран присутствия', icon: '🌍' },
              { number: '500+', label: 'продуктов в линейке', icon: '🧴' },
              { number: '1M+', label: 'довольных клиентов', icon: '😊' },
              { number: '50+', label: 'международных наград', icon: '🏅' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              👥 Наша команда
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Профессионалы, которые делают компанию успешной
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Александр Петров',
                role: 'Генеральный директор',
                experience: '15 лет в индустрии здоровья',
                avatar: '👨‍💼'
              },
              {
                name: 'Мария Сидорова',
                role: 'Директор по исследованиям',
                experience: 'PhD в области биохимии',
                avatar: '👩‍🔬'
              },
              {
                name: 'Дмитрий Козлов',
                role: 'Директор по маркетингу',
                experience: '12 лет в сетевом маркетинге',
                avatar: '👨‍💻'
              }
            ].map((person, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
                <div className="text-6xl mb-4">{person.avatar}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {person.name}
                </h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                  {person.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {person.experience}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Сертификаты и награды */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🏅 Сертификаты и награды
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Международное признание качества нашей продукции
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'ISO 9001', icon: '📜' },
              { name: 'ISO 22000', icon: '🔒' },
              { name: 'GMP', icon: '✅' },
              { name: 'HACCP', icon: '🛡️' },
              { name: 'Халяль', icon: '🌙' },
              { name: 'Кошерный', icon: '✡️' }
            ].map((cert, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">{cert.icon}</div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {cert.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Миссия и видение */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">🎯 Наша миссия</h2>
          <p className="text-xl mb-12 opacity-90">
            Делать здоровый образ жизни доступным и привлекательным для каждого человека, 
            предлагая качественные натуральные продукты и создавая возможности для личностного 
            и финансового роста наших партнеров.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">🌟 Наше видение</h3>
              <p className="opacity-90">
                Стать ведущей мировой компанией в области здоровья и красоты, 
                известной своими инновационными продуктами и этичными принципами ведения бизнеса.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">🚀 Наши цели</h3>
              <p className="opacity-90">
                Постоянно совершенствовать продукцию, расширять географию присутствия 
                и создавать новые возможности для развития наших партнеров и клиентов.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ClientLayout>
  )
}

