export type MenuCategory = 'starter' | 'main' | 'salad' | 'side' | 'drink' | 'dessert';

export interface ItemOptions {
  size?: 'Regular' | 'Large';
  spiceLevel?: 'Mild' | 'Medium' | 'Hot';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  tags: string[];
  options?: {
    size?: Array<'Regular' | 'Large'>;
    spiceLevel?: Array<'Mild' | 'Medium' | 'Hot'>;
  };
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  options?: ItemOptions;
}

export type OrderType = 'pickup' | 'delivery';

export type CartActionType =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'UPDATE_QUANTITY'
  | 'MODIFY_ITEM'
  | 'CLEAR_CART'
  | 'SET_ORDER_TYPE';

export type CartAction =
  | { type: 'ADD_ITEM'; itemId: string; quantity: number; options?: ItemOptions }
  | { type: 'REMOVE_ITEM'; itemId: string; options?: ItemOptions }
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number; options?: ItemOptions }
  | { type: 'MODIFY_ITEM'; itemId: string; options: ItemOptions }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ORDER_TYPE'; orderType: OrderType };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isError?: boolean;
}

export interface AIRequest {
  message: string;
  cart: CartItem[];
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AIResponse {
  reply: string;
  actions: CartAction[];
}
