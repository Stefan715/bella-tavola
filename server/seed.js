
import { pool } from './db.js'

const dishes = [
  {
    id: 1,
    name: 'Bruschetta',
    category: 'Starters',
    price: 8.5,
    description: 'Toasted bread with fresh tomatoes, basil and olive oil.',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Creamy Mushroom Soup',
    category: 'Starters',
    price: 7.5,
    description: 'A warm, creamy soup made with fresh mushrooms and herbs.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Spaghetti Carbonara',
    category: 'Main Courses',
    price: 16.5,
    description: 'Classic spaghetti with parmesan, egg and crispy pancetta.',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Margherita Pizza',
    category: 'Main Courses',
    price: 14,
    description: 'Tomato sauce, mozzarella, fresh basil and extra virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Lasagna',
    category: 'Main Courses',
    price: 17.5,
    description: 'Traditional baked lasagna with rich meat sauce and cheese.',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Tiramisu',
    category: 'Desserts',
    price: 7,
    description: 'Italian dessert with coffee-soaked biscuits and mascarpone cream.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
  },
]

try {
  for (const dish of dishes) {
    await pool.query(
      `INSERT INTO menu_items (id, name, category, price, description, image)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         category = EXCLUDED.category,
         price = EXCLUDED.price,
         description = EXCLUDED.description,
         image = EXCLUDED.image`,
      [
        dish.id,
        dish.name,
        dish.category,
        dish.price,
        dish.description,
        dish.image,
      ],
    )
  }

  await pool.query(`
    SELECT setval(
      pg_get_serial_sequence('menu_items', 'id'),
      (SELECT MAX(id) FROM menu_items),
      true
    )
  `)

  console.log('Menu seeded successfully!')
  console.log(`${dishes.length} dishes are in the database.`)
} catch (error) {
  console.error('Failed to seed menu:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
