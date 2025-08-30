'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import StatsCard from '@/components/admin/StatsCard'

interface Stats {
  orders: number
  newOrders: number
  clients: number
  newClients: number
  products: number
  newProducts: number
}

interface Order {
  id: string
  total_price: number
  created_at: string
  status: string
  user: {
    name: string
  }
}

interface Product {
  id: string
  name: string
  sales: number
  revenue: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    orders: 0,
    newOrders: 0,
    clients: 0,
    newClients: 0,
    products: 0,
    newProducts: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [popularProducts, setPopularProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем статистику
        const statsResponse = await fetch('/api/admin/stats', {
          credentials: 'include'
        })
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Получаем последние заказы
        const ordersResponse = await fetch('/api/admin/recent-orders', {
          credentials: 'include'
        })
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setRecentOrders(ordersData)
        }

        // Получаем популярные товары
        const productsResponse = await fetch('/api/admin/popular-products', {
          credentials: 'include'
        })
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setPopularProducts(productsData)
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <AdminLayout title="Панель управления">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Заказов"
          value={stats.orders.toString()}
          change={`+${stats.newOrders} новых`}
          changeType="increase"
          icon="🛒"
          color="blue"
        />
        <StatsCard
          title="Клиентов"
          value={stats.clients.toString()}
          change={`+${stats.newClients} новых`}
          changeType="increase"
          icon="👥"
          color="purple"
        />
        <StatsCard
          title="Товаров"
          value={stats.products.toString()}
          change={`+${stats.newProducts} новых`}
          changeType="neutral"
          icon="📦"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Последние заказы</h3>
            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors">
              Смотреть все
            </button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.length > 0 ? recentOrders.map((order, index) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-4">
                    <span className="text-indigo-600 dark:text-indigo-300 font-medium">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Заказ #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Клиент: {order.user.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">₽{order.total_price.toLocaleString()}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'NEW' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {order.status === 'NEW' ? 'Новый' :
                     order.status === 'PROCESSING' ? 'В обработке' :
                     order.status === 'COMPLETED' ? 'Завершен' : 'Отменен'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Пока нет заказов
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Популярные товары</h3>
            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors">
              Смотреть все
            </button>
          </div>
          
          <div className="space-y-4">
            {popularProducts.length > 0 ? popularProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 dark:text-blue-300 font-medium">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.sales} продаж</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">₽{product.revenue.toLocaleString()}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Пока нет данных о товарах
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Добавить товар', icon: '➕', href: '/admin/products/new', color: 'bg-green-500' },
            { title: 'Новый заказ', icon: '🛒', href: '/admin/orders/new', color: 'bg-blue-500' },
            { title: 'Написать в блог', icon: '📝', href: '/admin/blog/new', color: 'bg-purple-500' },
            { title: 'Настройки', icon: '⚙️', href: '/admin/settings', color: 'bg-gray-500' }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => router.push(action.href)}
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-3`}>
                <span className="text-2xl">{action.icon}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</span>
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}