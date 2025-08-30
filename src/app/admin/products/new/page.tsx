'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'

interface Category {
  id: string
  name: string
  description?: string
  type: 'CATALOG' | 'TARGET_GROUP' | 'PURPOSE'
}

export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [catalogCategories, setCatalogCategories] = useState<Category[]>([])
  const [targetGroups, setTargetGroups] = useState<Category[]>([])
  const [purposes, setPurposes] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')

  // Загружаем категории при загрузке страницы
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Загружаем каталог
        const catalogResponse = await fetch('/api/admin/categories?type=CATALOG')
        if (catalogResponse.ok) {
          const catalogData = await catalogResponse.json()
          setCatalogCategories(catalogData)
        }

        // Загружаем целевые группы
        const targetResponse = await fetch('/api/admin/categories?type=TARGET_GROUP')
        if (targetResponse.ok) {
          const targetData = await targetResponse.json()
          setTargetGroups(targetData)
        }

        // Загружаем назначения
        const purposeResponse = await fetch('/api/admin/categories?type=PURPOSE')
        if (purposeResponse.ok) {
          const purposeData = await purposeResponse.json()
          setPurposes(purposeData)
        }
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Обработка выбора файла
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Создаем превью
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Загрузка изображения в S3
  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        return data.imageUrl
      } else {
        const error = await response.json()
        throw new Error(error.error)
      }
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error)
      alert('Ошибка загрузки изображения: ' + error)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Сначала загружаем изображение, если оно выбрано
      let imageUrl = formData.image_url
      if (selectedFile) {
        const uploadedImageUrl = await uploadImage()
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl
        } else {
          throw new Error('Не удалось загрузить изображение')
        }
      }

      // Отправляем данные товара
      const productData = {
        ...formData,
        image_url: imageUrl,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Включаем куки с токеном
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        alert('Товар успешно добавлен!')
        router.push('/admin/products')
      } else {
        const error = await response.json()
        throw new Error(error.error)
      }
    } catch (error) {
      console.error('Ошибка добавления товара:', error)
      alert('Ошибка: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Добавить новый товар
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Заполните информацию о товаре
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Название товара */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Название товара *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Введите название товара"
              />
            </div>

            {/* Описание */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Введите описание товара"
              />
            </div>

            {/* Основная категория */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Каталог *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Выберите категорию</option>
                {catalogCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Дополнительные поля пока скрыты - будут добавлены после миграции базы данных */}

            {/* Цена и количество */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Цена *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Количество на складе *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Загрузка изображения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Изображение товара
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div className="mb-4">
                      <img src={previewImage} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
                    </div>
                  ) : (
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Загрузить файл</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="pl-1">или перетащите сюда</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF до 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* URL изображения (альтернативный способ) */}
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Или введите URL изображения
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Кнопка отправки */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isLoading || uploadingImage}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Добавление...' : uploadingImage ? 'Загрузка изображения...' : 'Добавить товар'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}