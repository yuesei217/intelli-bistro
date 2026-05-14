# The Intelligent Bistro — System Design Document

**Version:** 1.0  
**Date:** 2026-05-13  
**Status:** Draft

---

## 1. High-Level Architecture

```
┌──────────────────────────────────────────┐
│           React Native (Expo)            │
│  ┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │  Home  │ │ Menu │ │  AI  │ │ Cart │  │
│  └────────┘ └──────┘ └──────┘ └──────┘  │
│         Expo Router (tab navigation)     │
│  ┌─────────────────────────────────────┐ │
│  │        Zustand (cart store)         │ │
│  └─────────────────────────────────────┘ │
└──────────────────────┬───────────────────┘
                       │ HTTP/JSON (REST)
                       ▼
┌──────────────────────────────────────────┐
│           Node.js / Express              │
│  GET /api/menu       POST /api/ai/order  │
│  ┌─────────────┐   ┌───────────────────┐ │
│  │ Menu Service│   │    AI Service     │ │
│  │ (static)    │   │ (prompt builder + │ │
│  └─────────────┘   │  JSON validator)  │ │
│                    └────────┬──────────┘ │
└─────────────────────────────┼────────────┘
                              │ Anthropic SDK
                              ▼
                  ┌───────────────────────┐
                  │  Claude API           │
                  │  claude-haiku-4-5     │
                  └───────────────────────┘
```

---

## 2. Frontend Architecture

### Tech Stack

| Concern | Library |
|---------|---------|
| Framework | React Native + Expo SDK 52 |
| Language | TypeScript (strict) |
| Routing | Expo Router (file-based, bottom tabs) |
| Styling | NativeWind v4 (Tailwind for RN) |
| State | Zustand |
| Animations | React Native Reanimated |
| Icons | @expo/vector-icons |
| Gradients | expo-linear-gradient |

### Folder Structure

```
frontend/
├── app/
│   ├── _layout.tsx          # Root layout, tab navigator
│   ├── (tabs)/
│   │   ├── index.tsx        # Home screen
│   │   ├── menu.tsx         # Menu screen
│   │   ├── assistant.tsx    # AI assistant screen
│   │   └── cart.tsx         # Cart screen
│   └── modal/
│       └── item-detail.tsx  # Item detail bottom sheet
├── components/
│   ├── MenuCard.tsx
│   ├── CartItemRow.tsx
│   ├── ChatBubble.tsx
│   ├── TypingIndicator.tsx
│   ├── CategoryChip.tsx
│   └── EmptyState.tsx
├── store/
│   └── cartStore.ts         # Zustand cart store
├── services/
│   └── aiService.ts         # API call + action dispatcher
├── data/
│   └── menu.ts              # Static menu (mirrors backend)
├── types/
│   └── index.ts             # Shared TypeScript types
├── constants/
│   ├── colors.ts            # Design tokens
│   └── config.ts            # API base URL, etc.
└── assets/
    └── images/
```

### Cart Item Identity (Critical Design Decision)

Cart items are uniquely identified by **`menuItemId` + normalized options combination**, not `menuItemId` alone.

This handles cases like:
```
2× Spicy Chicken Sandwich (Hot)     ← cartItemId: "spicy-chicken-sandwich__spiceLevel:Hot"
1× Spicy Chicken Sandwich (Mild)    ← cartItemId: "spicy-chicken-sandwich__spiceLevel:Mild"
```
These are **two separate cart rows**, not one row with quantity 3.

```typescript
// Deterministic key — same options always produce same key
function getCartItemKey(menuItemId: string, options?: ItemOptions): string {
  if (!options || Object.keys(options).length === 0) return menuItemId;
  const normalized = Object.keys(options)
    .sort()
    .map((k) => `${k}:${options[k as keyof ItemOptions]}`)
    .join('|');
  return `${menuItemId}__${normalized}`;
}
```

### Cart Store (Zustand)

```typescript
// store/cartStore.ts

interface CartItem {
  cartItemId: string;    // computed: getCartItemKey(menuItemId, options)
  menuItemId: string;    // reference back to menu data
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  options?: ItemOptions;
}

interface CartStore {
  items: CartItem[];

  // Mutations — all keyed by cartItemId
  addItem: (menuItemId: string, quantity: number, options?: ItemOptions) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  modifyItem: (cartItemId: string, options: ItemOptions) => void;
  clearCart: () => void;

  // Derived
  itemCount: number;   // total unit count (for tab badge)
  subtotal: number;
  tax: number;         // subtotal * 0.08
  total: number;
}
```

**Design principles:**
- `addItem` computes `cartItemId` and increments if that exact key exists, else inserts new row
- `updateQuantity` to 0 auto-removes the item
- AI actions pass `menuItemId` + `options`; dispatcher computes `cartItemId` before calling store

### Items with Options (MVP Scope)

Only these 3 items support options — all others have `options: undefined`:

| Item | Option | Values |
|------|--------|--------|
| Spicy Chicken Sandwich | `spiceLevel` | `"Mild"` \| `"Medium"` \| `"Hot"` |
| Sparkling Water | `size` | `"Regular"` \| `"Large"` |
| House-Made Lemonade | `size` | `"Regular"` \| `"Large"` |

### AI Action Dispatcher

After receiving the backend response, the frontend calls the dispatcher:

```typescript
// services/aiService.ts

function dispatchActions(actions: CartAction[], cartStore: CartStore) {
  for (const action of actions) {
    switch (action.type) {
      case "ADD_ITEM":
        cartStore.addItem(action.itemId, action.quantity, action.options);
        break;
      case "REMOVE_ITEM":
        cartStore.removeItem(action.itemId);
        break;
      case "UPDATE_QUANTITY":
        cartStore.updateQuantity(action.itemId, action.quantity);
        break;
      case "MODIFY_ITEM":
        cartStore.modifyItem(action.itemId, action.options);
        break;
      case "CLEAR_CART":
        cartStore.clearCart();
        break;
    }
  }
}
```

### Design System

**Color Palette (Dark Theme):**

```typescript
// constants/colors.ts
export const Colors = {
  bg:          '#0F0A06',   // main background
  surface:     '#1C1108',   // cards, modals
  card:        '#251C10',   // elevated card
  primary:     '#D4A040',   // gold — buttons, highlights
  primaryDark: '#B8852A',   // pressed state
  accent:      '#C03520',   // red — labels, badges
  text:        '#F2E4CC',   // primary text
  muted:       '#8A7060',   // secondary text
  border:      '#3A2818',   // dividers
  success:     '#52A060',   // confirmation
} as const;
```

**Typography:**
- Headings: `Georgia` (system serif — premium feel)
- Body: System default
- Price/label: `font-bold`, `tracking-wide`

---

## 3. Backend Architecture

### Tech Stack

| Concern | Library |
|---------|---------|
| Runtime | Node.js 20 |
| Framework | Express |
| Language | TypeScript |
| AI SDK | `@anthropic-ai/sdk` |
| Schema validation | `zod` |
| Dev server | `ts-node-dev` |

### Folder Structure

```
backend/
├── src/
│   ├── index.ts             # Express server entry point
│   ├── routes/
│   │   ├── menu.ts          # GET /api/menu
│   │   └── ai.ts            # POST /api/ai/order
│   ├── services/
│   │   └── aiService.ts     # Claude API call + prompt builder
│   ├── data/
│   │   └── menu.ts          # Static menu data (source of truth)
│   └── types/
│       └── index.ts         # Shared types
├── .env                     # ANTHROPIC_API_KEY, PORT
├── .env.example
├── tsconfig.json
└── package.json
```

### API Endpoints

#### `GET /api/menu`
Returns the full menu.

**Response:**
```json
{
  "items": [
    {
      "id": "wagyu-burger",
      "name": "Wagyu Smash Burger",
      "description": "Double smash patties, aged cheddar, caramelized onions, bistro sauce",
      "price": 28.00,
      "category": "main",
      "imageUrl": "https://...",
      "tags": ["popular"],
      "options": {}
    }
  ]
}
```

---

#### `POST /api/ai/order`
Processes a natural language message and returns a reply + cart actions.

**Request:**
```json
{
  "message": "Add two spicy chicken sandwiches and a large water",
  "cart": [
    { "menuItemId": "wagyu-burger", "quantity": 1 }
  ],
  "history": [
    { "role": "user", "content": "What's popular here?" },
    { "role": "assistant", "content": "{\"reply\": \"Our Wagyu Burger is a fan favorite!\", \"actions\": []}" }
  ]
}
```

**Response:**
```json
{
  "reply": "Done! I've added 2 Spicy Chicken Sandwiches (Hot) and 1 Large Sparkling Water. Your cart now has 3 items.",
  "actions": [
    { "type": "ADD_ITEM", "itemId": "spicy-chicken-sandwich", "quantity": 2, "options": { "spiceLevel": "Hot" } },
    { "type": "ADD_ITEM", "itemId": "sparkling-water", "quantity": 1, "options": { "size": "Large" } }
  ]
}
```

**Error Response (AI parse failure):**
```json
{
  "reply": "Sorry, I didn't quite catch that. Could you rephrase? For example: 'Add 2 burgers' or 'Remove the fries'.",
  "actions": []
}
```

---

### AI Service — Claude Integration

```typescript
// services/aiService.ts

const SYSTEM_PROMPT = (menuItems: MenuItem[]) => `
You are Aria, the friendly AI server at The Intelligent Bistro.

MENU:
${menuItems.map(item =>
  `- ${item.id}: ${item.name} — $${item.price} | ${item.description}`
).join('\n')}

RULES:
1. Always respond with valid JSON in this exact shape:
   { "reply": "<string>", "actions": [<CartAction>] }
2. Only reference itemIds that exist in the menu above.
3. If the user asks for a recommendation, set actions to [] and reply naturally.
4. If you cannot fulfill a request, explain why in reply and return actions: [].
5. Be warm, concise, and helpful — like a real restaurant server.

ACTION TYPES (use only these):
- { "type": "ADD_ITEM", "itemId": string, "quantity": number, "options"?: {...} }
- { "type": "REMOVE_ITEM", "itemId": string }
- { "type": "UPDATE_QUANTITY", "itemId": string, "quantity": number }
- { "type": "MODIFY_ITEM", "itemId": string, "options": {...} }
- { "type": "CLEAR_CART" }
`;

// Zod schemas — validates Claude's output before it reaches the frontend
const ItemOptionsSchema = z.object({
  size: z.enum(["Regular", "Large"]).optional(),
  spiceLevel: z.enum(["Mild", "Medium", "Hot"]).optional(),
});

const CartActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("ADD_ITEM"),        itemId: z.string(), quantity: z.number().positive().int(), options: ItemOptionsSchema.optional() }),
  z.object({ type: z.literal("REMOVE_ITEM"),     itemId: z.string() }),
  z.object({ type: z.literal("UPDATE_QUANTITY"), itemId: z.string(), quantity: z.number().nonnegative().int() }),
  z.object({ type: z.literal("MODIFY_ITEM"),     itemId: z.string(), options: ItemOptionsSchema }),
  z.object({ type: z.literal("CLEAR_CART") }),
]);

const AIResponseSchema = z.object({
  reply: z.string().min(1),
  actions: z.array(CartActionSchema),
});

async function processOrder(req: AIOrderRequest): Promise<AIOrderResponse> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT(menuItems),
    messages: [
      ...req.history.slice(-10),   // last 10 turns for context
      { role: "user", content: req.message }
    ],
  });

  try {
    const raw = JSON.parse(response.content[0].text);
    const validated = AIResponseSchema.parse(raw);
    // Drop any actions referencing unknown itemIds
    validated.actions = validated.actions.filter(
      (a) => !("itemId" in a) || menuItems.some((m) => m.id === a.itemId)
    );
    return validated;
  } catch {
    return {
      reply: "Sorry, I had trouble understanding that. Could you try rephrasing?",
      actions: [],
    };
  }
}
```

---

## 4. Data Flow — AI Order Sequence

```
User types message
      │
      ▼
chatStore.sendMessage(text)
      │
      ├── append user message to history
      ├── set isLoading = true
      │
      ▼
POST /api/ai/order
{ message, cart, history }
      │
      ▼
Backend: build prompt + call Claude
      │
      ▼
Claude returns JSON string
      │
      ├── parse JSON → { reply, actions }
      ├── validate action types
      │
      ▼
Return { reply, actions } to frontend
      │
      ├── append AI reply to chat history
      ├── dispatchActions(actions, cartStore)
      │     └── each action → cartStore mutation
      ├── set isLoading = false
      │
      ▼
UI re-renders: chat + cart tab badge
```

---

## 5. Cart State Consistency Rules

The frontend's Zustand store is the **single source of truth** for cart state.

- AI actions never directly mutate cart — they go through the same Zustand mutations as UI interactions
- `addItem` with an existing `menuItemId` increments quantity (never duplicates)
- `updateQuantity(id, 0)` is equivalent to `removeItem(id)`
- Cart is passed to every AI request so Claude has full context

---

## 6. Error Handling

| Scenario | Behavior |
|----------|----------|
| Claude API timeout | Show `"Bistro AI is busy right now, try again in a moment."` |
| Invalid JSON from Claude | Return fallback error reply, `actions: []` |
| Unknown `itemId` in action | Skip that action, log warning |
| Network error (frontend) | Show inline error in chat, don't clear input |
| Menu load failure | Show cached static data (hardcoded fallback) |

---

## 7. Environment Configuration

**Backend `.env`:**
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
```

**Frontend `constants/config.ts`:**
```typescript
// For iOS Simulator: localhost works fine
// For physical device: use your machine's LAN IP (e.g., 192.168.1.x)
export const API_BASE_URL = __DEV__
  ? "http://localhost:3001"
  : "https://your-production-url.com";
```

---

## 8. Repository Structure

```
bistro/
├── docs/
│   ├── PRD.md
│   └── SYSTEM_DESIGN.md
├── frontend/           # Expo React Native app
├── backend/            # Node.js Express API
└── README.md
```

---

## 9. Deployment (Post-MVP)

| Layer | Service |
|-------|---------|
| Frontend | Expo EAS Build + App Store |
| Backend | Railway / Render / Fly.io |
| AI | Anthropic Claude API |

---

## 10. Open Questions / Decisions Needed

| # | Question | Default / Recommendation |
|---|----------|--------------------------|
| 1 | Include item `options` (size/spice) in MVP? | Yes — adds realism to AI demos |
| 2 | Persist cart across sessions? | No — in-memory only (AsyncStorage can be added later) |
| 3 | Show conversation history in AI tab? | Yes — standard chat UI with last N messages |
| 4 | Max conversation history sent to Claude? | Last 10 messages (5 turns) |
| 5 | Light mode / dark mode toggle? | Dark mode only for MVP |
