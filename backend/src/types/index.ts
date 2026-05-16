export type MenuCategory = 'starter' | 'main' | 'salad' | 'side' | 'drink' | 'dessert';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  tags: string[];
  options?: {
    size?: string[];
    spiceLevel?: string[];
  };
}

export interface CartItem {
  menuItemId: string;
  name: string;
  quantity: number;
  options?: { size?: string; spiceLevel?: string };
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIOrderRequest {
  message: string;
  cart: CartItem[];
  history: ChatHistoryMessage[];
}

export interface CartAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'MODIFY_ITEM' | 'CLEAR_CART' | 'SET_ORDER_TYPE';
  itemId?: string;
  quantity?: number;
  options?: { size?: string; spiceLevel?: string };
  orderType?: 'pickup' | 'delivery';
}

export interface AIOrderResponse {
  reply: string;
  actions: CartAction[];
}
