'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface OrderStats {
  new: number
  processing: number
  completed: number
  canceled: number
}

interface Order {
  id: number
  customer: string
  email: string
  phone: string
  total: number
  status: string
  date: string
  items: number
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [orderStats, setOrderStats] = useState<OrderStats>({
    new: 0,
    processing: 0,
    completed: 0,
    canceled: 0
  })
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false)
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false)
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [{ productId: '', quantity: 1, price: 0 }],
    status: 'new'
  })
  const [editOrderForm, setEditOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [{ productId: '', quantity: 1, price: 0 }],
    status: 'new'
  })
  const [ordersData, setOrdersData] = useState<Order[]>([])

  // Загрузка статистики заказов
  const fetchOrderStats = async () => {
    try {
      const response = await fetch('/api/admin/orders/stats')
      if (response.ok) {
        const data = await response.json()
        setOrderStats(data)
      }
    } catch (error) {
      console.error('Ошибка загрузки статистики заказов:', error)
    }
  }

  // Загрузка заказов из базы данных
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        
        // Убеждаемся, что ID уникальны
        const uniqueOrders = data.filter((order: Order, index: number, self: Order[]) => 
          index === self.findIndex((o: Order) => o.id === order.id)
        )
        
        setOrdersData(uniqueOrders)
      } else {
        console.error('Ошибка загрузки заказов')
        // Устанавливаем пустой массив при ошибке
        setOrdersData([])
      }
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error)
      // Устанавливаем пустой массив при ошибке
      setOrdersData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderStats()
    fetchOrders()
  }, [])

  // Функции для управления заказами
  const handleDeleteOrder = async (orderId: number) => {
    const order = ordersData.find(o => o.id === orderId)
    if (!order) return
    
    if (confirm(`Вы уверены, что хотите удалить заказ #${order.id}?\nКлиент: ${order.customer}\nСумма: ₽${order.total.toLocaleString()}`)) {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // Удаляем из локального состояния только после успешного удаления в БД
          setOrdersData(prev => prev.filter(o => o.id !== orderId))
          alert(`✅ Заказ #${orderId} был успешно удален из базы данных`)
          
          // Обновляем статистику
          fetchOrderStats()
        } else {
          const errorData = await response.json()
          alert(`❌ Ошибка удаления заказа: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Ошибка удаления заказа:', error)
        alert('❌ Ошибка подключения к серверу')
      }
    }
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const statusText = newStatus === 'new' ? 'Новый' : 
                      newStatus === 'processing' ? 'В обработке' : 
                      newStatus === 'completed' ? 'Завершён' : 'Отменён'
    
    if (confirm(`Изменить статус заказа #${orderId} на "${statusText}"?`)) {
      try {
        const order = ordersData.find(o => o.id === orderId)
        if (!order) return

        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerName: order.customer,
            customerEmail: order.email,
            customerPhone: order.phone,
            status: newStatus,
            total: order.total
          })
        })
        
        if (response.ok) {
          // Обновляем локальное состояние только после успешного обновления в БД
          setOrdersData(prev => prev.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          ))
          alert(`✅ Статус заказа #${orderId} изменен на "${statusText}" в базе данных`)
          
          // Обновляем статистику
          fetchOrderStats()
        } else {
          const errorData = await response.json()
          alert(`❌ Ошибка изменения статуса: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Ошибка изменения статуса:', error)
        alert('❌ Ошибка подключения к серверу')
      }
    }
  }

  const handleEditOrder = (orderId: number) => {
    const order = ordersData.find(o => o.id === orderId)
    if (!order) return
    
    // Заполняем форму редактирования данными заказа
    setEditOrderForm({
      customerName: order.customer,
      customerEmail: order.email,
      customerPhone: order.phone,
      items: [{ productId: '', quantity: order.items, price: order.total / order.items }],
      status: order.status
    })
    
    setEditingOrderId(orderId)
    setIsEditOrderModalOpen(true)
  }

  const handleSaveEditOrder = async () => {
    if (!editingOrderId) return
    
    // Валидация
    if (!editOrderForm.customerName.trim()) {
      alert('Пожалуйста, введите имя клиента')
      return
    }
    
    if (!editOrderForm.customerEmail.trim()) {
      alert('Пожалуйста, введите email клиента')
      return
    }
    
    if (!editOrderForm.customerPhone.trim()) {
      alert('Пожалуйста, введите телефон клиента')
      return
    }
    
    // Проверка email формата
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editOrderForm.customerEmail)) {
      alert('Пожалуйста, введите корректный email')
      return
    }
    
    // Расчет общей суммы
    const totalAmount = editOrderForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    
    try {
      const response = await fetch(`/api/admin/orders/${editingOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: editOrderForm.customerName,
          customerEmail: editOrderForm.customerEmail,
          customerPhone: editOrderForm.customerPhone,
          status: editOrderForm.status,
          total: totalAmount
        })
      })
      
      if (response.ok) {
        // Обновляем локальное состояние только после успешного обновления в БД
        setOrdersData(prev => prev.map(order => 
          order.id === editingOrderId ? {
            ...order,
            customer: editOrderForm.customerName,
            email: editOrderForm.customerEmail,
            phone: editOrderForm.customerPhone,
            total: totalAmount,
            status: editOrderForm.status,
            items: editOrderForm.items.length
          } : order
        ))
        
        alert(`✅ Заказ #${editingOrderId} успешно обновлен в базе данных!`)
        
        // Обновляем статистику
        fetchOrderStats()
        
        // Закрыть модальное окно
        setIsEditOrderModalOpen(false)
        setEditingOrderId(null)
        setEditOrderForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          items: [{ productId: '', quantity: 1, price: 0 }],
          status: 'new'
        })
      } else {
        const errorData = await response.json()
        alert(`❌ Ошибка обновления заказа: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Ошибка обновления заказа:', error)
      alert('❌ Ошибка подключения к серверу')
    }
  }

  // Фильтрация заказов
  const filteredOrders = ordersData.filter(order => {
    // Фильтр по поиску
    const searchMatch = searchTerm === '' || 
      order.id.toString().includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Фильтр по статусу
    const statusMatch = statusFilter === 'all' || order.status === statusFilter
    
    // Фильтр по датам
    const orderDate = new Date(order.date)
    const fromDate = dateFrom ? new Date(dateFrom) : null
    const toDate = dateTo ? new Date(dateTo) : null
    
    const dateMatch = (!fromDate || orderDate >= fromDate) && 
                     (!toDate || orderDate <= toDate)
    
    return searchMatch && statusMatch && dateMatch
  })

  const orders = filteredOrders

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', text: 'Новый' },
      processing: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', text: 'В обработке' },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: 'Завершён' },
      canceled: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', text: 'Отменён' }
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
      {/* Modern Header & Filters */}
      <div className="mb-8">
        {/* Search and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Поиск по номеру заказа, клиенту или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all duration-200"
              />
            </div>
          </div>
          
          <button 
            onClick={() => setIsNewOrderModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Новый заказ
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Статус:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200 min-w-[140px]"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="processing">В обработке</option>
            <option value="completed">Завершённые</option>
              <option value="canceled">Отменённые</option>
          </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Период:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm"
              placeholder="От"
            />
            <span className="text-gray-500 dark:text-gray-400">-</span>
          <input
            type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm"
              placeholder="До"
          />
        </div>

          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setDateFrom('')
              setDateTo('')
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 text-sm"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      {/* Modern Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: 'Новые', 
            count: orderStats.new, 
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            icon: '🆕'
          },
          { 
            title: 'В обработке', 
            count: orderStats.processing, 
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            textColor: 'text-yellow-600 dark:text-yellow-400',
            icon: '⏳'
          },
          { 
            title: 'Завершённые', 
            count: orderStats.completed, 
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            textColor: 'text-green-600 dark:text-green-400',
            icon: '✅'
          },
          { 
            title: 'Отменённые', 
            count: orderStats.canceled, 
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            textColor: 'text-red-600 dark:text-red-400',
            icon: '❌'
          }
        ].map((stat, index) => (
          <div key={index} className="relative group">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} mb-4`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                  <div className={`text-3xl font-bold ${stat.textColor}`}>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    ) : (
                      stat.count
                    )}
                  </div>
              </div>
                <div className="ml-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              </div>
              </div>
              
              {/* Decorative gradient border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Заказ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order, index) => (
                <tr key={`order-${order.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">#{order.id}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.items} товара</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customer}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(order.date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ₽{order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => handleEditOrder(order.id)}
                          className="inline-flex items-center p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200" 
                          title="Редактировать заказ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                      </button>
                        
                        <button 
                          onClick={() => {
                            // Генерация и печать заказа
                            const printContent = `
                              ЗАКАЗ #${order.id}
                              Дата: ${new Date(order.date).toLocaleDateString('ru-RU')}
                              
                              Клиент: ${order.customer}
                              Email: ${order.email}
                              Телефон: ${order.phone}
                              
                              Товары: ${order.items} шт.
                              Сумма: ₽${order.total.toLocaleString()}
                              Статус: ${order.status === 'new' ? 'Новый' : order.status === 'processing' ? 'В обработке' : order.status === 'completed' ? 'Завершён' : 'Отменён'}
                            `
                            
                            // Создать новое окно для печати
                            const printWindow = window.open('', '_blank', 'width=600,height=400')
                            if (printWindow) {
                              printWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Заказ #${order.id}</title>
                                    <style>
                                      body { font-family: Arial, sans-serif; padding: 20px; }
                                      h1 { color: #333; }
                                      .info { margin: 10px 0; }
                                      .status { 
                                        padding: 5px 10px; 
                                        border-radius: 5px; 
                                        background: #f0f0f0; 
                                        display: inline-block; 
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <h1>ЗАКАЗ #${order.id}</h1>
                                    <div class="info"><strong>Дата:</strong> ${new Date(order.date).toLocaleDateString('ru-RU')}</div>
                                    <div class="info"><strong>Клиент:</strong> ${order.customer}</div>
                                    <div class="info"><strong>Email:</strong> ${order.email}</div>
                                    <div class="info"><strong>Телефон:</strong> ${order.phone}</div>
                                    <div class="info"><strong>Товары:</strong> ${order.items} шт.</div>
                                    <div class="info"><strong>Сумма:</strong> ₽${order.total.toLocaleString()}</div>
                                    <div class="info"><strong>Статус:</strong> 
                                      <span class="status">${order.status === 'new' ? 'Новый' : order.status === 'processing' ? 'В обработке' : order.status === 'completed' ? 'Завершён' : 'Отменён'}</span>
                                    </div>
                                  </body>
                                </html>
                              `)
                              printWindow.document.close()
                              printWindow.print()
                            }
                          }}
                          className="inline-flex items-center p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200" 
                          title="Печать заказа"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                      </button>
                        
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="inline-flex items-center p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200" 
                          title="Удалить заказ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                      </button>
                      </div>
                      
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      >
                        <option value="new">Новый</option>
                        <option value="processing">В обработке</option>
                        <option value="completed">Завершён</option>
                        <option value="canceled">Отменён</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Показано <span className="font-medium">1</span> до <span className="font-medium">3</span> из{' '}
                <span className="font-medium">3</span> результатов
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                  ◀
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                  ▶
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Создать новый заказ</h3>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя клиента
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.customerName}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Введите имя клиента"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newOrderForm.customerEmail}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={newOrderForm.customerPhone}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="+7 999 123-45-67"
                  required
                />
              </div>

              {/* Order Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Товары в заказе
                </label>
                <div className="space-y-3">
                  {newOrderForm.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Название товара"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...newOrderForm.items]
                            newItems[index].quantity = parseInt(e.target.value) || 1
                            setNewOrderForm({ ...newOrderForm, items: newItems })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Кол-во"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => {
                            const newItems = [...newOrderForm.items]
                            newItems[index].price = parseFloat(e.target.value) || 0
                            setNewOrderForm({ ...newOrderForm, items: newItems })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Цена"
                        />
                      </div>
                      {newOrderForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = newOrderForm.items.filter((_, i) => i !== index)
                            setNewOrderForm({ ...newOrderForm, items: newItems })
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setNewOrderForm({
                      ...newOrderForm,
                      items: [...newOrderForm.items, { productId: '', quantity: 1, price: 0 }]
                    })
                  }}
                  className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить товар
                </button>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Статус заказа
                </label>
                <select
                  value={newOrderForm.status}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="new">Новый</option>
                  <option value="processing">В обработке</option>
                  <option value="completed">Завершён</option>
                  <option value="canceled">Отменён</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewOrderModalOpen(false)
                    setNewOrderForm({
                      customerName: '',
                      customerEmail: '',
                      customerPhone: '',
                      items: [{ productId: '', quantity: 1, price: 0 }],
                      status: 'new'
                    })
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  onClick={async (e) => {
                    e.preventDefault()
                    
                    // Валидация формы
                    if (!newOrderForm.customerName.trim()) {
                      alert('Пожалуйста, введите имя клиента')
                      return
                    }
                    
                    if (!newOrderForm.customerEmail.trim()) {
                      alert('Пожалуйста, введите email клиента')
                      return
                    }
                    
                    if (!newOrderForm.customerPhone.trim()) {
                      alert('Пожалуйста, введите телефон клиента')
                      return
                    }
                    
                    // Проверка email формата
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (!emailRegex.test(newOrderForm.customerEmail)) {
                      alert('Пожалуйста, введите корректный email')
                      return
                    }
                    
                    // Расчет общей суммы заказа
                    const totalAmount = newOrderForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
                    
                    // Создание нового заказа
                    const newOrderId = Math.floor(Math.random() * 9000) + 1000 // Генерация ID
                    const orderData = {
                      id: newOrderId,
                      customer: newOrderForm.customerName,
                      email: newOrderForm.customerEmail,
                      phone: newOrderForm.customerPhone,
                      total: totalAmount,
                      status: newOrderForm.status,
                      date: new Date().toISOString().split('T')[0],
                      items: newOrderForm.items.length
                    }
                    
                    try {
                      // Отправляем заказ на сервер
                      const response = await fetch('/api/admin/orders', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          customerName: newOrderForm.customerName,
                          customerEmail: newOrderForm.customerEmail,
                          customerPhone: newOrderForm.customerPhone,
                          items: newOrderForm.items,
                          status: newOrderForm.status,
                          total: totalAmount
                        })
                      })
                      
                      if (response.ok) {
                        const result = await response.json()
                        
                        // Добавить заказ в список с ID от сервера
                        const newOrderData = {
                          ...orderData,
                          id: result.id
                        }
                        setOrdersData(prev => [newOrderData, ...prev])
                        
                        // Показать успешное сообщение
                        alert(`✅ Заказ успешно создан в базе данных!
                        
📋 Детали заказа:
• Номер: #${result.id}
• Клиент: ${newOrderForm.customerName}
• Email: ${newOrderForm.customerEmail}
• Телефон: ${newOrderForm.customerPhone}
• Товаров: ${newOrderForm.items.length} шт.
• Сумма: ₽${totalAmount.toLocaleString()}
• Статус: ${newOrderForm.status === 'new' ? 'Новый' : newOrderForm.status === 'processing' ? 'В обработке' : newOrderForm.status === 'completed' ? 'Завершён' : 'Отменён'}`)
                        
                        // Обновляем статистику
                        fetchOrderStats()
                        
                        // Закрыть модальное окно и сбросить форму
                        setIsNewOrderModalOpen(false)
                        setNewOrderForm({
                          customerName: '',
                          customerEmail: '',
                          customerPhone: '',
                          items: [{ productId: '', quantity: 1, price: 0 }],
                          status: 'new'
                        })
                      } else {
                        const errorData = await response.json()
                        alert(`❌ Ошибка создания заказа: ${errorData.error}`)
                      }
                    } catch (error) {
                      console.error('Ошибка создания заказа:', error)
                      alert('❌ Ошибка подключения к серверу')
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  Создать заказ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditOrderModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Редактировать заказ #{editingOrderId}
              </h3>
              <button
                onClick={() => {
                  setIsEditOrderModalOpen(false)
                  setEditingOrderId(null)
                  setEditOrderForm({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    items: [{ productId: '', quantity: 1, price: 0 }],
                    status: 'new'
                  })
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя клиента
                  </label>
                  <input
                    type="text"
                    value={editOrderForm.customerName}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Введите имя клиента"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editOrderForm.customerEmail}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={editOrderForm.customerPhone}
                  onChange={(e) => setEditOrderForm({ ...editOrderForm, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="+7 999 123-45-67"
                  required
                />
              </div>

              {/* Order Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Товары в заказе
                </label>
                <div className="space-y-3">
                  {editOrderForm.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Название товара"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...editOrderForm.items]
                            newItems[index].quantity = parseInt(e.target.value) || 1
                            setEditOrderForm({ ...editOrderForm, items: newItems })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Кол-во"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => {
                            const newItems = [...editOrderForm.items]
                            newItems[index].price = parseFloat(e.target.value) || 0
                            setEditOrderForm({ ...editOrderForm, items: newItems })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Цена"
                        />
                      </div>
                      {editOrderForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = editOrderForm.items.filter((_, i) => i !== index)
                            setEditOrderForm({ ...editOrderForm, items: newItems })
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setEditOrderForm({
                      ...editOrderForm,
                      items: [...editOrderForm.items, { productId: '', quantity: 1, price: 0 }]
                    })
                  }}
                  className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить товар
                </button>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Статус заказа
                </label>
                <select
                  value={editOrderForm.status}
                  onChange={(e) => setEditOrderForm({ ...editOrderForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="new">Новый</option>
                  <option value="processing">В обработке</option>
                  <option value="completed">Завершён</option>
                  <option value="canceled">Отменён</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOrderModalOpen(false)
                    setEditingOrderId(null)
                    setEditOrderForm({
                      customerName: '',
                      customerEmail: '',
                      customerPhone: '',
                      items: [{ productId: '', quantity: 1, price: 0 }],
                      status: 'new'
                    })
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditOrder}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}











