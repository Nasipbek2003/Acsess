'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  image_url?: string
  created_at: string
  category: {
    name: string
  }
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Функции для работы с товарами
  const handleEdit = (id: string) => {
    router.push(`/admin/products/edit/${id}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        alert('Ошибка при удалении товара')
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error)
      alert('Ошибка при удалении товара')
    }
  }

  // Функции для импорта/экспорта
  const handleImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        console.log('Прочитанные данные из Excel:', jsonData)
        console.log('Первая строка данных:', jsonData[0])
        console.log('Колонки в первой строке:', Object.keys(jsonData[0] as any))

        // Проверяем формат файла
        if (jsonData.length === 0) {
          alert('Файл пуст или имеет неверный формат')
          return
        }

        // Проверяем наличие обязательных колонок
        const firstRow = jsonData[0] as any
        const requiredColumns = ['Название товара', 'Цена', 'Каталог']
        const missingColumns = requiredColumns.filter(col => !(col in firstRow))
        
        if (missingColumns.length > 0) {
          alert(`Отсутствуют обязательные колонки: ${missingColumns.join(', ')}\n\nТребуемые колонки:\n- ID (если указан - заменит существующий товар, если пуст - создаст новый)\n- Название товара (обязательно)\n- Описание (необязательно)\n- Каталог (обязательно)\n- Цена (обязательно)\n- Количество на складе (необязательно)\n- Ссылки на изображение (необязательно)`)
          return
        }

        const response = await fetch('/api/admin/products/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: jsonData }),
        })

        const result = await response.json()

        if (response.ok) {
          let message = result.message
          if (result.results.errors.length > 0) {
            message += '\n\nОшибки:\n' + result.results.errors.slice(0, 5).join('\n')
            if (result.results.errors.length > 5) {
              message += `\n... и еще ${result.results.errors.length - 5} ошибок`
            }
          }
          alert(message)
          window.location.reload()
        } else {
          alert(`Ошибка при импорте: ${result.error}`)
        }
      } catch (error) {
        console.error('Ошибка при импорте:', error)
        alert('Ошибка при импорте файла. Проверьте формат файла.')
      }
    }

    input.click()
  }

  const handleExport = () => {
    const exportData = products.map((product) => ({
      'ID': product.id,
      'Название товара': product.name,
      'Описание': product.description || '',
      'Каталог': product.category.name,
      'Цена': product.price,
      'Количество на складе': product.stock,
      'Ссылки на изображение': product.image_url || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
    
    // Настройка ширины колонок
    const wscols = [
      { wch: 10 }, // ID
      { wch: 30 }, // Название товара
      { wch: 50 }, // Описание
      { wch: 20 }, // Каталог
      { wch: 10 }, // Цена
      { wch: 15 }, // Количество на складе
      { wch: 50 }  // Ссылки на изображение
    ]
    worksheet['!cols'] = wscols
    
    XLSX.writeFile(workbook, 'products.xlsx')
  }

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'ID': 'prod-001',
        'Название товара': 'Омега-3 капсулы',
        'Описание': 'Высококачественные капсулы с омега-3 жирными кислотами',
        'Каталог': 'Витамины',
        'Цена': 1200,
        'Количество на складе': 100,
        'Ссылки на изображение': 'https://example.com/omega3.jpg'
      },
      {
        'ID': 'prod-002',
        'Название товара': 'Крем для лица увлажняющий',
        'Описание': 'Питательный крем с натуральными компонентами',
        'Каталог': 'Косметика',
        'Цена': 850,
        'Количество на складе': 75,
        'Ссылки на изображение': 'https://example.com/cream.jpg'
      },
      {
        'ID': '',
        'Название товара': 'Протеиновый коктейль',
        'Описание': 'Белковый коктейль для спортсменов (без ID - создастся новый)',
        'Каталог': 'Спорт',
        'Цена': 2500,
        'Количество на складе': 30,
        'Ссылки на изображение': 'https://example.com/protein.jpg'
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products_Template')
    
    // Настройка ширины колонок
    const wscols = [
      { wch: 15 }, // ID
      { wch: 35 }, // Название товара
      { wch: 60 }, // Описание
      { wch: 20 }, // Каталог
      { wch: 12 }, // Цена
      { wch: 20 }, // Количество на складе
      { wch: 60 }  // Ссылки на изображение
    ]
    worksheet['!cols'] = wscols
    
    XLSX.writeFile(workbook, 'products_template.xlsx')
  }

  // Загружаем товары при загрузке страницы
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getStatusBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Нет в наличии</span>
    }
    if (stock > 10) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">В наличии</span>
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Мало товара</span>
  }

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Получаем уникальные категории для фильтра
  const categories = Array.from(new Set(products.map(product => product.category.name)))

  if (isLoading) {
    return (
      <AdminLayout title="Управление товарами">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Управление товарами">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all duration-200"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
          >
            <option value="all">Все категории</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDownloadTemplate}
            className="px-4 py-2 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-200 flex items-center gap-2"
            title="Скачать шаблон Excel для импорта"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Шаблон
          </button>
          <button 
            onClick={handleImport}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Импорт
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Экспорт
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            ➕ Добавить товар
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Товар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Остаток
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {product.image_url ? (
                          <img
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                            src={product.image_url}
                            alt={product.name}
                            onError={(e) => {
                              // Если изображение не загрузилось, показываем placeholder
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
                          <span className="text-gray-400">📦</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {product.id.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ₽{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className={product.stock === 0 ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                      {product.stock} шт.
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.stock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => handleEdit(product.id)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="Редактировать товар"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Удалить товар"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {products.length === 0 ? 'Товаров пока нет' : 'Товары не найдены по заданным критериям'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 transition-colors duration-300">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              Предыдущая
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              Следующая
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано <span className="font-medium">1</span> до <span className="font-medium">3</span> из{' '}
                <span className="font-medium">3</span> результатов
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  ◀
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
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

