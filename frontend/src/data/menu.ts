import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // Starters
  {
    id: 'truffle-fries',
    name: 'Truffle Parmesan Fries',
    description: 'Crispy golden fries with black truffle oil, aged parmesan & fresh herbs',
    price: 14,
    category: 'starter',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80',
    tags: ['popular', 'vegetarian'],
  },
  {
    id: 'crispy-calamari',
    name: 'Crispy Calamari',
    description: 'Hand-breaded calamari rings with house marinara and lemon aioli',
    price: 16,
    category: 'starter',
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
    tags: ['popular'],
  },
  {
    id: 'burrata',
    name: 'Burrata & Heirloom Tomato',
    description: 'Fresh burrata, heirloom tomatoes, basil oil & aged balsamic',
    price: 18,
    category: 'starter',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80',
    tags: ['vegetarian'],
  },

  // Mains
  {
    id: 'wagyu-burger',
    name: 'Wagyu Smash Burger',
    description: 'Double smash patties, aged cheddar, caramelized onions & bistro sauce',
    price: 28,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    tags: ['popular', 'chef-pick'],
  },
  {
    id: 'grilled-salmon',
    name: 'Grilled Atlantic Salmon',
    description: 'Herb-crusted salmon, lemon beurre blanc & seasonal vegetables',
    price: 34,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    tags: ['chef-pick'],
  },
  {
    id: 'spicy-chicken-sandwich',
    name: 'Spicy Chicken Sandwich',
    description: 'Crispy chicken, ghost pepper aioli, pickled jalapeños & brioche bun',
    price: 19,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80',
    tags: ['popular', 'spicy'],
    options: {
      spiceLevel: ['Mild', 'Medium', 'Hot'],
    },
  },
  {
    id: 'mushroom-risotto',
    name: 'Wild Mushroom Risotto',
    description: 'Arborio rice, mixed wild mushrooms, truffle oil & aged parmesan',
    price: 26,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80',
    tags: ['vegetarian', 'chef-pick'],
  },

  // Salads
  {
    id: 'caesar-salad',
    name: 'Classic Caesar Salad',
    description: 'Romaine hearts, house caesar dressing, parmesan crisp & croutons',
    price: 15,
    category: 'salad',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    tags: ['vegetarian'],
  },
  {
    id: 'beet-salad',
    name: 'Roasted Beet Salad',
    description: 'Golden & red beets, whipped goat cheese, candied walnuts & honey vinaigrette',
    price: 16,
    category: 'salad',
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&q=80',
    tags: ['vegetarian'],
  },

  // Sides
  {
    id: 'sweet-potato-fries',
    name: 'Sweet Potato Fries',
    description: 'Seasoned sweet potato fries with chipotle dipping sauce',
    price: 10,
    category: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&q=80',
    tags: ['vegetarian'],
  },
  {
    id: 'garlic-bread',
    name: 'Garlic Herb Bread',
    description: 'Sourdough with roasted garlic compound butter & fresh herbs',
    price: 8,
    category: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&q=80',
    tags: ['vegetarian'],
  },

  // Drinks
  {
    id: 'lemonade',
    name: 'House-Made Lemonade',
    description: 'Fresh-squeezed lemonade with mint & a hint of honey',
    price: 6,
    category: 'drink',
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80',
    tags: ['vegetarian'],
    options: {
      size: ['Regular', 'Large'],
    },
  },
  {
    id: 'sparkling-water',
    name: 'Sparkling Water',
    description: 'Premium Italian sparkling mineral water',
    price: 4,
    category: 'drink',
    imageUrl: 'https://images.unsplash.com/photo-1543253687-c931c8e981d5?w=600&q=80',
    tags: ['vegetarian'],
    options: {
      size: ['Regular', 'Large'],
    },
  },
  {
    id: 'craft-ipa',
    name: 'Craft IPA',
    description: 'Local brewery selection — rotating seasonal draft',
    price: 10,
    category: 'drink',
    imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&q=80',
    tags: [],
  },

  // Desserts
  {
    id: 'lava-cake',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center & vanilla bean ice cream',
    price: 14,
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    tags: ['popular', 'vegetarian'],
  },
  {
    id: 'creme-brulee',
    name: 'Vanilla Crème Brûlée',
    description: 'Classic French custard with caramelized sugar & fresh berries',
    price: 12,
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80',
    tags: ['vegetarian'],
  },
];

export const CATEGORIES = [
  { key: 'all',     label: 'All' },
  { key: 'starter', label: 'Starters' },
  { key: 'main',    label: 'Mains' },
  { key: 'salad',   label: 'Salads' },
  { key: 'side',    label: 'Sides' },
  { key: 'drink',   label: 'Drinks' },
  { key: 'dessert', label: 'Desserts' },
] as const;

export const FEATURED_IDS = ['wagyu-burger', 'grilled-salmon', 'lava-cake', 'mushroom-risotto'];

export const getMenuItem = (id: string) => MENU_ITEMS.find((item) => item.id === id);
