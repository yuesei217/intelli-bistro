import { create } from 'zustand';
import { CartItem, CartAction, ItemOptions } from '../types';
import { getMenuItem } from '../data/menu';

function getCartItemKey(menuItemId: string, options?: ItemOptions): string {
  if (!options || Object.keys(options).length === 0) return menuItemId;
  const normalized = Object.keys(options)
    .sort()
    .map((k) => `${k}:${options[k as keyof ItemOptions]}`)
    .join('|');
  return `${menuItemId}__${normalized}`;
}

interface CartStore {
  items: CartItem[];
  addItem: (menuItemId: string, quantity?: number, options?: ItemOptions) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  modifyItem: (cartItemId: string, options: ItemOptions) => void;
  clearCart: () => void;
  dispatchAIActions: (actions: CartAction[]) => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (menuItemId, quantity = 1, options) => {
    const menuItem = getMenuItem(menuItemId);
    if (!menuItem) return;

    const cartItemId = getCartItemKey(menuItemId, options);

    set((state) => {
      const existing = state.items.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.cartItemId === cartItemId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            cartItemId,
            menuItemId,
            name: menuItem.name,
            price: menuItem.price,
            quantity,
            imageUrl: menuItem.imageUrl,
            options,
          },
        ],
      };
    });
  },

  removeItem: (cartItemId) => {
    set((state) => ({ items: state.items.filter((i) => i.cartItemId !== cartItemId) }));
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity } : i
      ),
    }));
  },

  modifyItem: (cartItemId, options) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, options, cartItemId: getCartItemKey(i.menuItemId, options) } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  dispatchAIActions: (actions) => {
    const { addItem, removeItem, updateQuantity, modifyItem, clearCart } = get();
    actions.forEach((action) => {
      switch (action.type) {
        case 'ADD_ITEM':
          addItem(action.itemId, action.quantity, action.options);
          break;
        case 'REMOVE_ITEM': {
          const cartItemId = getCartItemKey(action.itemId, action.options);
          removeItem(cartItemId);
          break;
        }
        case 'UPDATE_QUANTITY': {
          const cartItemId = getCartItemKey(action.itemId, action.options);
          updateQuantity(cartItemId, action.quantity);
          break;
        }
        case 'MODIFY_ITEM': {
          const cartItemId = getCartItemKey(action.itemId, action.options);
          modifyItem(cartItemId, action.options);
          break;
        }
        case 'CLEAR_CART':
          clearCart();
          break;
      }
    });
  },

  get itemCount() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
  get subtotal() {
    return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },
  get tax() {
    return get().subtotal * 0.08;
  },
  get total() {
    return get().subtotal + get().tax;
  },
}));
