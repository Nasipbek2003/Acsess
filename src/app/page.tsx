'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ClientLayout from '@/components/client/ClientLayout'
import ProductImage from '@/components/ProductImage'

interface Product {
  id: string
  name: string
  price: number
  image?: string
  category: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  // Загрузка популярных продуктов
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/featured')
        if (response.ok) {
          const data = await response.json()
          console.log('🏠 Загружены товары для главной страницы:', data)
          console.log('📷 Первый товар с изображением:', data[0]?.image)
          setProducts(data)
        }
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error)
      }
    }

    fetchProducts()
  }, [])

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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in">
            Siberian Wellness
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            🌿 Ваш путь к здоровью и красоте начинается здесь
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Откройте для себя мир натуральных продуктов для здоровья, красоты и активной жизни. 
            Качество, проверенное временем.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/shop"
              className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">🛍️</span>
              Перейти в магазин
              <svg className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link
              href="/earn"
              className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 rounded-2xl font-semibold hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">💰</span>
              Зарабатывай с нами
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-600 dark:border-emerald-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-600 dark:bg-emerald-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Популярные продукты из базы */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🌟 Популярные продукты
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Наши бестселлеры, которые помогают тысячам людей жить здоровой и активной жизнью
            </p>
          </div>

          {/* Реальные товары из базы */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {products.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  {/* Изображение продукта */}
                  <div className="w-full h-40 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-700 dark:to-teal-700 rounded-xl mb-4 overflow-hidden">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      category={product.category}
                      className="w-full h-full"
                    />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {product.price.toLocaleString()} ₽
                  </p>
                  
                  <div className="mt-3">
                    <span className="inline-block px-2 py-1 bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg">
                      {product.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Загрузка продуктов...</p>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/shop"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">👀</span>
              Посмотреть все продукты
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ✨ Почему выбирают нас
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Более 10 лет на рынке здоровья и красоты
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🌿',
                title: 'Натуральные ингредиенты',
                description: 'Только проверенные компоненты из экологически чистых регионов'
              },
              {
                icon: '🔬',
                title: 'Научные исследования',
                description: 'Каждый продукт разработан на основе современных научных достижений'
              },
              {
                icon: '🏆',
                title: 'Высокое качество',
                description: 'Международные сертификаты качества и безопасности'
              },
              {
                icon: '🚚',
                title: 'Быстрая доставка',
                description: 'Доставляем по всей России в кратчайшие сроки'
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{benefit.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            🎯 Начните свой путь к здоровью уже сегодня!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к тысячам довольных клиентов и откройте для себя продукты Siberian Wellness
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-4 bg-white dark:bg-gray-200 text-emerald-600 dark:text-emerald-700 rounded-2xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              🛒 Начать покупки
            </Link>
            <Link
              href="/earn"
              className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-emerald-600 dark:hover:text-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              💼 Стать партнером
            </Link>
          </div>
    </div>
      </section>


    </ClientLayout>
  )
}