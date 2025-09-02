'use client'

import { useState } from 'react'

interface ProductImageProps {
  src?: string
  alt: string
  category: string
  className?: string
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Витамины':
      return '💊'
    case 'Косметика':
      return '✨'
    case 'Спорт':
      return '💪'
    case 'Уход':
      return '🧴'
    default:
      return '🌿'
  }
}

export default function ProductImage({ src, alt, category, className = '' }: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  if (!src || imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-6xl">
          {getCategoryIcon(category)}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-700 dark:to-teal-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => {
          console.log('❌ Ошибка загрузки изображения:', src)
          setImageError(true)
          setImageLoading(false)
        }}
        onLoad={() => {
          console.log('✅ Изображение загружено:', src)
          setImageLoading(false)
        }}
      />
    </div>
  )
}
