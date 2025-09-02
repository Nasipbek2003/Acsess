import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Создаем хеш пароля для админа
  const adminPasswordHash = await hash('123456', 10)

  // Удаляем существующие настройки
  await prisma.setting.deleteMany({})
  console.log('Удалены старые настройки')

  // Создаем новые настройки с правильными данными
  const newSettings = await prisma.setting.create({
    data: {
      login_admin: 'admin',
      password_admin: adminPasswordHash,
      description: 'Основные настройки администратора'
    }
  })
  
  console.log('Создана запись в таблице settings:')
  console.log('- ID:', newSettings.id)
  console.log('- Логин:', newSettings.login_admin)
  console.log('- Пароль хеширован:', !!newSettings.password_admin)
  console.log('- Описание:', newSettings.description)

  // Проверяем, есть ли пользователь-администратор
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@acsess.com' }
  })

  if (!existingAdmin) {
    // Создаем администратора в таблице users
    await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@acsess.com',
        password_hash: adminPasswordHash,
        role: 'ADMIN'
      }
    })
    console.log('Создан пользователь-администратор')
  } else {
    console.log('Пользователь-администратор уже существует')
  }

  // Удаляем старые категории и товары для чистоты
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  console.log('Удалены старые категории и товары')

  // Создаем тестовые категории
  const categoriesData = [
    {
      name: 'Витамины',
      description: 'Витаминные комплексы и БАДы',
      type: 'CATALOG' as const
    },
    {
      name: 'Косметика', 
      description: 'Натуральная косметика и уход',
      type: 'CATALOG' as const
    },
    {
      name: 'Спорт',
      description: 'Спортивное питание и аксессуары',
      type: 'CATALOG' as const
    },
    {
      name: 'Уход',
      description: 'Средства для ухода за телом',
      type: 'CATALOG' as const
    }
  ]

  const createdCategories = []
  for (const categoryData of categoriesData) {
    const category = await prisma.category.create({
      data: categoryData
    })
    createdCategories.push(category)
  }

  console.log(`Создано ${createdCategories.length} категорий`)

  // Создаем тестовые товары
  const productsData = [
    {
      name: 'Омега-3 Премиум',
      description: 'Высококачественные капсулы с омега-3 жирными кислотами для поддержания здоровья сердца и мозга',
      price: 1200,
      stock: 50,
      category_id: createdCategories[0].id,
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'
    },
    {
      name: 'Витамин D3',
      description: 'Натуральный витамин D3 для укрепления иммунитета и костной системы',
      price: 850,
      stock: 75,
      category_id: createdCategories[0].id,
      image_url: 'https://images.unsplash.com/photo-1550572017-f8ba8c6c1e90?w=400'
    },
    {
      name: 'Крем для лица увлажняющий',
      description: 'Питательный крем с натуральными компонентами для всех типов кожи',
      price: 950,
      stock: 30,
      category_id: createdCategories[1].id,
      image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'
    },
    {
      name: 'Протеиновый коктейль',
      description: 'Высококачественный белковый коктейль для спортсменов и активных людей',
      price: 2500,
      stock: 25,
      category_id: createdCategories[2].id,
      image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400'
    },
    {
      name: 'Гель для душа натуральный',
      description: 'Мягкий гель для душа с экстрактами трав и натуральными маслами',
      price: 450,
      stock: 60,
      category_id: createdCategories[3].id,
      image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400'
    }
  ]

  const createdProducts = []
  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: productData
    })
    createdProducts.push(product)
  }

  console.log(`Создано ${createdProducts.length} товаров`)

  console.log('\n=== ДАННЫЕ ДЛЯ ВХОДА ===')
  console.log('Логин: admin')
  console.log('Пароль: 123456')
  console.log('========================')
  console.log('Эти данные берутся из таблицы settings (поля login_admin и password_admin)')
  console.log('\n=== ТЕСТОВЫЕ ДАННЫЕ ===')
  console.log(`Категории: ${createdCategories.length}`)
  console.log(`Товары: ${createdProducts.length}`)
  console.log('========================')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })