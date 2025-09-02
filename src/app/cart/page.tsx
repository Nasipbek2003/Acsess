'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ClientLayout from '@/components/client/ClientLayout'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderData, setOrderData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: ''
  })

  // Загрузка корзины из localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setIsLoading(false)
  }, [])

  // Сохранение корзины в localStorage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items)
    localStorage.setItem('cart', JSON.stringify(items))
  }

  // Обновление количества товара
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    saveCart(updatedItems)
  }

  // Удаление товара из корзины
  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id)
    saveCart(updatedItems)
  }

  // Очистка корзины
  const clearCart = () => {
    saveCart([])
  }

  // Расчет общей суммы
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Создание заказа
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsOrdering(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
          customerAddress: orderData.customerAddress,
          items: cartItems,
          totalPrice: totalAmount
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Заказ успешно создан! Номер заказа: ${result.orderId}`)
        // Очищаем корзину
        localStorage.removeItem('cart')
        setCartItems([])
        setShowOrderForm(false)
        setOrderData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerAddress: ''
        })
      } else {
        alert(`Ошибка создания заказа: ${result.error}`)
      }
    } catch (error) {
      console.error('Ошибка создания заказа:', error)
      alert('Произошла ошибка при создании заказа')
    } finally {
      setIsOrdering(false)
    }
  }

  if (isLoading) {
    return (
      <ClientLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🛒 Корзина покупок
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {totalItems > 0 ? `У вас ${totalItems} товаров в корзине` : 'Ваша корзина пуста'}
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Список товаров */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-center space-x-4">
                    {/* Изображение товара */}
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-2xl">🌿</span>
                      )}
                    </div>

                    {/* Информация о товаре */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {item.name}
                      </h3>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.price.toLocaleString()} ₽ за единицу
                      </p>
                    </div>

                    {/* Управление количеством */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      
                      <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* Сумма за товар */}
                    <div className="text-right min-w-[100px]">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {(item.price * item.quantity).toLocaleString()} ₽
                      </p>
                    </div>

                    {/* Кнопка удаления */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center justify-center"
                      title="Удалить товар"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {/* Кнопка очистки корзины */}
              <div className="pt-4">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  🗑️ Очистить корзину
                </button>
              </div>
            </div>

            {/* Итоговая информация */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  📊 Итого
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Товаров:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{totalItems} шт.</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Стоимость товаров:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {totalAmount.toLocaleString()} ₽
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Доставка:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Бесплатно</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-xl">
                      <span className="font-bold text-gray-900 dark:text-white">Итого:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {totalAmount.toLocaleString()} ₽
                      </span>
                    </div>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="space-y-3">
                                  <button 
                  onClick={() => setShowOrderForm(true)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300"
                >
                  💳 Оформить заказ
                </button>
                  
                  <Link
                    href="/shop"
                    className="block w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
                  >
                    🛍️ Продолжить покупки
                  </Link>
                </div>

                {/* Информация о доставке */}
                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                    🚚 Бесплатная доставка
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    При заказе от 1000 ₽ доставка по России бесплатно!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Пустая корзина */
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ваша корзина пуста
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Добавьте товары в корзину, чтобы оформить заказ и начать путь к здоровью!
            </p>
            
            <div className="space-y-4">
              <Link
                href="/shop"
                className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🛍️ Перейти в магазин
              </Link>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
                {[
                  { name: 'Витамины', icon: '💊', link: '/shop?category=Витамины' },
                  { name: 'Косметика', icon: '✨', link: '/shop?category=Косметика' },
                  { name: 'Спорт питание', icon: '💪', link: '/shop?category=Спорт' },
                  { name: 'Уход за телом', icon: '🧴', link: '/shop?category=Уход' }
                ].map((category) => (
                  <Link
                    key={category.name}
                    href={category.link}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center group"
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {category.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Форма оформления заказа */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Оформление заказа</h3>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя и фамилия *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderData.customerName}
                    onChange={(e) => setOrderData({ ...orderData, customerName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={orderData.customerPhone}
                    onChange={(e) => setOrderData({ ...orderData, customerPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+7 999 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={orderData.customerEmail}
                    onChange={(e) => setOrderData({ ...orderData, customerEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Адрес доставки
                  </label>
                  <textarea
                    value={orderData.customerAddress}
                    onChange={(e) => setOrderData({ ...orderData, customerAddress: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Укажите адрес доставки"
                  />
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                    Итого к оплате
                  </h4>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {totalAmount.toLocaleString()} ₽
                  </p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Товаров: {totalItems} шт.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isOrdering}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOrdering ? 'Оформляем заказ...' : '🛒 Подтвердить заказ'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  )
}

