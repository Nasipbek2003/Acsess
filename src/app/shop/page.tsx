'use client'

import { useState, useEffect } from 'react'
import ClientLayout from '@/components/client/ClientLayout'
import ProductImage from '@/components/ProductImage'

interface Product {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  category: string
  inStock: boolean
}

interface Category {
  id: string
  name: string
  type: string
  description?: string
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
  }
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false
  })

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error)
      }
    }

    fetchCategories()
  }, [])

  // Загрузка продуктов
  const fetchProducts = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9'
      })

      if (searchQuery) {
        params.set('search', searchQuery)
      }
      if (selectedCategory) {
        params.set('category', selectedCategory)
      }

      const response = await fetch(`/api/products?${params}`)
      
      if (response.ok) {
        const data: ProductsResponse = await response.json()
        console.log('🛍️ Загружены товары для магазина:', data.products.length)
        console.log('📷 Изображения товаров:', data.products.map(p => ({ name: p.name, image: p.image })))
        
        if (append) {
          setProducts(prev => [...prev, ...data.products])
        } else {
          setProducts(data.products)
        }
        
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Загрузка продуктов при изменении фильтров
  useEffect(() => {
    fetchProducts(1, false)
  }, [searchQuery, selectedCategory])

  // Загрузка следующей страницы
  const loadMore = () => {
    if (pagination.hasMore && !loadingMore) {
      fetchProducts(pagination.currentPage + 1, true)
    }
  }

  // Добавление в корзину
  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    
    // Показываем уведомление
    alert(`${product.name} добавлен в корзину! 🛒`)
  }

  // Сброс фильтров
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
  }

  if (loading && products.length === 0) {
    return (
      <ClientLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Загрузка продуктов...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            🛍️ Магазин Siberian Wellness
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Откройте для себя широкий ассортимент качественных продуктов для здоровья, красоты и активного образа жизни
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Поиск */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white text-lg"
            />
          </div>
        </div>

        {/* Категории */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🏷️ Категории товаров
          </h2>
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                !selectedCategory
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Все товары
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Результаты поиска */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {searchQuery && `Результаты поиска "${searchQuery}": `}
            {selectedCategory && `Категория "${selectedCategory}": `}
            <span className="font-semibold text-emerald-600">{pagination.totalCount} товаров</span>
          </p>
          
          {(searchQuery || selectedCategory) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              🔄 Сбросить фильтры
            </button>
          )}
        </div>

        {/* Сетка продуктов */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group"
                >
                  {/* Изображение продукта */}
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 relative overflow-hidden">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      category={product.category}
                      className="w-full h-full"
                    />
                    
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-lg">
                          Нет в наличии
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Информация о продукте */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-emerald-600">
                          {product.price.toLocaleString()} ₽
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">за единицу</p>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          product.inStock
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white transform hover:scale-105'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? '🛒 В корзину' : 'Нет в наличии'}
                      </button>
                    </div>

                    {/* Категория */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Кнопка "Ещё" */}
            {pagination.hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                      Загрузка...
                    </>
                  ) : (
                    <>
                      📦 Показать ещё ({pagination.totalCount - products.length} товаров)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Продукты не найдены
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchQuery ? `По запросу "${searchQuery}" ничего не найдено` : 'Попробуйте изменить фильтры'}
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              🔄 Показать все товары
            </button>
          </div>
        )}
      </div>

      {/* Популярные категории */}
      {categories.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                🏷️ Популярные категории
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Быстрый переход к нужной категории товаров
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <div className="text-4xl mb-3">
                    {category.name === 'Витамины' ? '💊' :
                     category.name === 'Косметика' ? '✨' :
                     category.name === 'Спорт' ? '💪' :
                     category.name === 'Уход' ? '🧴' : '🌿'}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {category.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </ClientLayout>
  )
}