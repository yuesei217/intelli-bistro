import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'truffle-fries', name: 'Truffle Parmesan Fries', description: 'Crispy golden fries with black truffle oil, aged parmesan & fresh herbs', price: 14, category: 'starter', imageUrl: '', tags: ['popular', 'vegetarian'] },
  { id: 'crispy-calamari', name: 'Crispy Calamari', description: 'Hand-breaded calamari rings with house marinara and lemon aioli', price: 16, category: 'starter', imageUrl: '', tags: ['popular'] },
  { id: 'burrata', name: 'Burrata & Heirloom Tomato', description: 'Fresh burrata, heirloom tomatoes, basil oil & aged balsamic', price: 18, category: 'starter', imageUrl: '', tags: ['vegetarian'] },
  { id: 'wagyu-burger', name: 'Wagyu Smash Burger', description: 'Double smash patties, aged cheddar, caramelized onions & bistro sauce', price: 28, category: 'main', imageUrl: '', tags: ['popular', 'chef-pick'] },
  { id: 'grilled-salmon', name: 'Grilled Atlantic Salmon', description: 'Herb-crusted salmon, lemon beurre blanc & seasonal vegetables', price: 34, category: 'main', imageUrl: '', tags: ['chef-pick'] },
  {
    id: 'spicy-chicken-sandwich',
    name: 'Spicy Chicken Sandwich',
    description: 'Crispy chicken, ghost pepper aioli, pickled jalapeños & brioche bun',
    price: 19, category: 'main', imageUrl: '', tags: ['popular', 'spicy'],
    options: { spiceLevel: ['Mild', 'Medium', 'Hot'] },
  },
  { id: 'mushroom-risotto', name: 'Wild Mushroom Risotto', description: 'Arborio rice, mixed wild mushrooms, truffle oil & aged parmesan', price: 26, category: 'main', imageUrl: '', tags: ['vegetarian', 'chef-pick'] },
  { id: 'caesar-salad', name: 'Classic Caesar Salad', description: 'Romaine hearts, house caesar dressing, parmesan crisp & croutons', price: 15, category: 'salad', imageUrl: '', tags: ['vegetarian'] },
  { id: 'beet-salad', name: 'Roasted Beet Salad', description: 'Golden & red beets, whipped goat cheese, candied walnuts & honey vinaigrette', price: 16, category: 'salad', imageUrl: '', tags: ['vegetarian'] },
  { id: 'sweet-potato-fries', name: 'Sweet Potato Fries', description: 'Seasoned sweet potato fries with chipotle dipping sauce', price: 10, category: 'side', imageUrl: '', tags: ['vegetarian'] },
  { id: 'garlic-bread', name: 'Garlic Herb Bread', description: 'Sourdough with roasted garlic compound butter & fresh herbs', price: 8, category: 'side', imageUrl: '', tags: ['vegetarian'] },
  {
    id: 'lemonade', name: 'House-Made Lemonade', description: 'Fresh-squeezed lemonade with mint & a hint of honey',
    price: 6, category: 'drink', imageUrl: '', tags: ['vegetarian'],
    options: { size: ['Regular', 'Large'] },
  },
  {
    id: 'sparkling-water', name: 'Sparkling Water', description: 'Premium Italian sparkling mineral water',
    price: 4, category: 'drink', imageUrl: '', tags: ['vegetarian'],
    options: { size: ['Regular', 'Large'] },
  },
  { id: 'craft-ipa', name: 'Craft IPA', description: 'Local brewery selection — rotating seasonal draft', price: 10, category: 'drink', imageUrl: '', tags: [] },
  { id: 'tasting-menu', name: "Chef's 5-Course Tasting Menu", description: "A curated journey — amuse-bouche, seasonal starter, bisque, wagyu main & dessert pairing", price: 89, category: 'main', imageUrl: '', tags: ['chef-pick', 'popular'] },
  { id: 'lava-cake', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center & vanilla bean ice cream', price: 14, category: 'dessert', imageUrl: '', tags: ['popular', 'vegetarian'] },
  { id: 'creme-brulee', name: 'Vanilla Crème Brûlée', description: 'Classic French custard with caramelized sugar & fresh berries', price: 12, category: 'dessert', imageUrl: '', tags: ['vegetarian'] },
];

export const MENU_LOOKUP = new Map(MENU_ITEMS.map((item) => [item.id, item]));
