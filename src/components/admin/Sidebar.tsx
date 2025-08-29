'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    name: 'Панель управления',
    href: '/admin',
    icon: '📊'
  },
  {
    name: 'Товары',
    href: '/admin/products',
    icon: '📦',
    children: [
      { name: 'Все товары', href: '/admin/products' },
      { name: 'Категории', href: '/admin/products/categories' },
      { name: 'Добавить товар', href: '/admin/products/new' }
    ]
  },
  {
    name: 'Заказы',
    href: '/admin/orders',
    icon: '🛒'
  },
  {
    name: 'Клиенты',
    href: '/admin/users',
    icon: '👥'
  },
  {
    name: 'Скидки и акции',
    href: '/admin/promotions',
    icon: '🎁'
  },
  {
    name: 'Аналитика',
    href: '/admin/analytics',
    icon: '📈'
  },
  {
    name: 'Настройки',
    href: '/admin/settings',
    icon: '⚙️',
    children: [
      { name: 'Общие', href: '/admin/settings/general' },
      { name: 'SEO', href: '/admin/settings/seo' },
      { name: 'Интеграции', href: '/admin/settings/integrations' }
    ]
  }
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-indigo-600 dark:bg-indigo-800 transition-colors duration-300">
          <h1 className="text-xl font-semibold text-white">Acsess Admin</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white hover:text-gray-200 transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive(item.href) 
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </div>
                    <span className={`
                      transform transition-transform duration-200
                      ${expandedItems.includes(item.name) ? 'rotate-90' : ''}
                    `}>
                      ▶
                    </span>
                  </button>
                  
                  <div className={`
                    ml-8 mt-2 space-y-1 transition-all duration-300 overflow-hidden
                    ${expandedItems.includes(item.name) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`
                          block px-4 py-2 text-sm rounded-md transition-all duration-200
                          ${isActive(child.href)
                            ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border-l-2 border-indigo-600 dark:border-indigo-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          }
                        `}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                    ${isActive(item.href)
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors duration-300">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Администратор</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}