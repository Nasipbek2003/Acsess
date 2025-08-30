'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all')

  // Dummy data
  const orders = [
    {
      id: 1001,
      customer: 'Иван Петров',
      email: 'ivan@example.com',
      phone: '+7 999 123-45-67',
      total: 2400,
      status: 'new',
      date: '2024-01-15',
      items: 3
    },
    {
      id: 1002,
      customer: 'Мария Сидорова',
      email: 'maria@example.com',
      phone: '+7 999 234-56-78',
      total: 1800,
      status: 'processing',
      date: '2024-01-14',
      items: 2
    },
    {
      id: 1003,
      customer: 'Алексей Козлов',
      email: 'alex@example.com',
      phone: '+7 999 345-67-89',
      total: 3200,
      status: 'completed',
      date: '2024-01-13',
      items: 5
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', text: 'Новый' },
      processing: { color: 'bg-yellow-100 text-yellow-800', text: 'В обработке' },
      shipped: { color: 'bg-purple-100 text-purple-800', text: 'Отправлен' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Завершён' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Отменён' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  return (
    <AdminLayout title="Управление заказами">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="processing">В обработке</option>
            <option value="shipped">Отправленные</option>
            <option value="completed">Завершённые</option>
            <option value="cancelled">Отменённые</option>
          </select>
          
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200">
            📤 Экспорт
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200">
            ➕ Новый заказ
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Новые', count: 12, color: 'bg-blue-500' },
          { title: 'В обработке', count: 8, color: 'bg-yellow-500' },
          { title: 'Завершённые', count: 156, color: 'bg-green-500' },
          { title: 'Отменённые', count: 3, color: 'bg-red-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10 mr-4`}>
                <div className={`w-6 h-6 rounded-full ${stat.color}`}></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Заказ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      <div className="text-sm text-gray-500">{order.items} товара</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₽{order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900 transition-colors" title="Просмотр">
                        👁️
                      </button>
                      <button className="text-green-600 hover:text-green-900 transition-colors" title="Редактировать">
                        ✏️
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 transition-colors" title="Печать">
                        🖨️
                      </button>
                      <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500">
                        <option value={order.status}>Изменить статус</option>
                        <option value="new">Новый</option>
                        <option value="processing">В обработке</option>
                        <option value="shipped">Отправлен</option>
                        <option value="completed">Завершён</option>
                        <option value="cancelled">Отменён</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано <span className="font-medium">1</span> до <span className="font-medium">3</span> из{' '}
                <span className="font-medium">3</span> результатов
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  ◀
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  ▶
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}








