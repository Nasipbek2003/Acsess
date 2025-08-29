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

  console.log('\n=== ДАННЫЕ ДЛЯ ВХОДА ===')
  console.log('Логин: admin')
  console.log('Пароль: 123456')
  console.log('========================')
  console.log('Эти данные берутся из таблицы settings (поля login_admin и password_admin)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })