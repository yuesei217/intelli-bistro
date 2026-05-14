# The Intelligent Bistro — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** 2026-05-13  
**Author:** Yuxi Wang  
**Status:** Draft

---

## 1. Product Overview

### Product Name

The Intelligent Bistro

### Vision

A premium AI-powered restaurant ordering app that combines a polished mobile UI with conversational commerce. Users can browse the menu and manage their cart the traditional way, or simply tell the AI what they want in plain English — the cart updates automatically.

### Core Value Proposition

> Not just a food app. A demonstration that AI can be a first-class UI element — not a chatbot bolted on the side.

### Key Differentiators

- Natural language order management ("Add two spicy chicken sandwiches and skip the onions")
- Structured AI responses with typed action schemas — not freeform text
- State always consistent between UI interactions and AI commands
- Production-quality visual design, not a prototype aesthetic

---

## 2. Goals & Success Criteria

### Primary Goals

1. **Visual Excellence** — The app looks and feels like a real product on first glance
2. **Conversational Ordering** — AI correctly parses order intents and updates the cart
3. **Reliable State** — Cart state never desyncs between UI and AI updates
4. **Clean Architecture** — Code is structured for a real team, not a hackathon

### Success Criteria (Reviewer Checklist)

| Criterion                                    | Target             |
| -------------------------------------------- | ------------------ |
| App opens and feels premium                  | ✓ First impression |
| Menu browsable with category filter          | ✓ Working          |
| Manual cart add/remove/update                | ✓ Working          |
| AI parses natural language into cart actions | ✓ Working          |
| Cart stays consistent after AI update        | ✓ No desyncs       |
| Backend returns structured JSON              | ✓ Typed schema     |
| Repo is organized and readable               | ✓ Clean structure  |

---

## 3. Target Users

### Primary User

A diner placing an order through a restaurant's mobile app.

### Reviewer Audience (Equally Important)

An engineering interviewer evaluating:

- Product thinking and scope management
- AI integration quality
- Frontend architecture and UI craft
- System design clarity

---

## 4. Navigation Structure

**Bottom Tab Navigation — 4 tabs:**

```
[ Home ]  [ Menu ]  [ AI Assistant ]  [ Cart (badge) ]
```

### Tab: Home

**Purpose:** First impression screen — establishes premium vibe and surfaces key entry points.

**Content:**

- Greeting header: `Good evening, Yuxi ✦`
- Featured banner: "Chef's Picks" horizontal scroll cards
- Quick-access category chips: Burgers / Sandwiches / Drinks / Desserts / Sides
- AI entry card: `"Tell Bistro AI what you want..."`
- Today's specials horizontal scroll

**Design:** Dark background, large rounded cards, food photography, gold accent color.

---

### Tab: Menu

**Purpose:** Full menu browsing with filtering — demonstrates traditional ordering capability.

**Content:**

- Search bar (filters in-place)
- Category filter chips (horizontal scroll)
- Item grid/list: image, name, short description, price, `+ Add` button
- Item detail modal/sheet: full description, options (size, spice level), quantity selector, `Add to Cart`

**Item Options (MVP scope):**

```
size: ["Regular", "Large"]          // drinks only
spiceLevel: ["Mild", "Medium", "Hot"]  // relevant items only
```

---

### Tab: AI Assistant

**Purpose:** Core differentiator — conversational cart management.

**Interface:** Chat UI (user bubbles right, AI bubbles left)

**Supported Intents:**

| Intent             | Example Input                      |
| ------------------ | ---------------------------------- |
| Add item           | "Add two spicy chicken sandwiches" |
| Add with options   | "A large lemonade please"          |
| Remove item        | "Remove the fries"                 |
| Update quantity    | "Change the burgers to 3"          |
| Modify option      | "Make the sandwich extra hot"      |
| View cart          | "What's in my cart?"               |
| Get recommendation | "What's good and not too spicy?"   |
| Clear cart         | "Start over"                       |

**UX Details:**

- Typing indicator (animated dots) while AI processes
- Cart update animation on the Cart tab badge after AI action
- Quick suggestion chips on empty state: `"What's popular?"`, `"Surprise me"`, `"Show the menu"`
- Error state message if AI call fails

---

### Tab: Cart

**Purpose:** Review and finalize the order.

**Content:**

- List of cart items: thumbnail, name, selected options, quantity stepper (−/+), price, delete button
- Subtotal / Tax (8%) / Total breakdown
- `Place Order` CTA button (non-functional for MVP — shows confirmation modal)
- Footer nudge: _"Need changes? Ask Bistro AI →"_

**Empty state:** Illustration + `"Your cart is empty"` + `Browse Menu` button

---

## 5. AI Interaction Design

### Request Schema

```typescript
interface AIOrderRequest {
  message: string;
  cart: CartItem[]; // current cart state for context
  history: Message[]; // last N conversation turns (for context)
}
```

### Response Schema

```typescript
interface AIOrderResponse {
  reply: string; // natural language confirmation
  actions: CartAction[]; // structured cart operations
}

type CartAction =
  | {
      type: "ADD_ITEM";
      itemId: string;
      quantity: number;
      options?: ItemOptions;
    }
  | { type: "REMOVE_ITEM"; itemId: string }
  | { type: "UPDATE_QUANTITY"; itemId: string; quantity: number }
  | { type: "MODIFY_ITEM"; itemId: string; options: ItemOptions }
  | { type: "CLEAR_CART" };

interface ItemOptions {
  size?: "Regular" | "Large";
  spiceLevel?: "Mild" | "Medium" | "Hot";
}
```

### Example Interaction

**User:** `"Add two spicy chicken sandwiches and a large water"`

**AI Response:**

```json
{
  "reply": "Done! I've added 2 Spicy Chicken Sandwiches (Hot) and 1 Large Water to your cart. Anything else?",
  "actions": [
    {
      "type": "ADD_ITEM",
      "itemId": "spicy-chicken-sandwich",
      "quantity": 2,
      "options": { "spiceLevel": "Hot" }
    },
    {
      "type": "ADD_ITEM",
      "itemId": "sparkling-water",
      "quantity": 1,
      "options": { "size": "Large" }
    }
  ]
}
```

### AI Provider

**Claude (Anthropic)** — `claude-haiku-4-5-20251001` for low latency on order parsing.  
System prompt instructs Claude to always respond in valid JSON matching the schema above.

---

## 6. Menu Data (MVP)

16 items across 6 categories. All data is static/mocked.

| Category | Items                                                                                      |
| -------- | ------------------------------------------------------------------------------------------ |
| Starters | Truffle Parmesan Fries, Crispy Calamari, Burrata & Heirloom Tomato                         |
| Mains    | Wagyu Smash Burger, Grilled Atlantic Salmon, Spicy Chicken Sandwich, Wild Mushroom Risotto |
| Salads   | Classic Caesar Salad, Roasted Beet Salad                                                   |
| Sides    | Sweet Potato Fries, Garlic Herb Bread                                                      |
| Drinks   | House-Made Lemonade, Sparkling Water, Craft IPA                                            |
| Desserts | Chocolate Lava Cake, Vanilla Crème Brûlée                                                  |

Item schema:

```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "starter" | "main" | "salad" | "side" | "drink" | "dessert";
  imageUrl: string;
  tags: string[]; // ["popular", "spicy", "vegetarian"]
  options?: {
    size?: string[];
    spiceLevel?: string[];
  };
}
```

---

## 7. Non-Functional Requirements

| Requirement            | Target                            |
| ---------------------- | --------------------------------- |
| AI response time       | < 3 seconds (Haiku model is fast) |
| UI frame rate          | 60fps — no janky animations       |
| Cart state consistency | Zero desyncs between AI and UI    |
| TypeScript coverage    | Full — no `any` in business logic |
| Error recovery         | Graceful messages on API failure  |

---

## 8. Out of Scope (MVP)

The following are explicitly excluded to hit the 1-week deadline:

- Real payment processing
- User authentication / accounts
- Order history / persistence
- Database (all data in-memory)
- Admin dashboard
- Delivery tracking
- Voice input
- Real restaurant APIs
- Multi-language support

---

## 9. Demo Flow (Loom Script)

1. **Open Home** — show the premium UI, scroll through recommendations
2. **Go to Menu** — browse categories, filter by "Mains", open Wagyu Burger detail, add to cart manually
3. **Go to AI Assistant** — type: `"Add two spicy chicken sandwiches and a large sparkling water"`
4. **Switch to Cart** — show 3 items updated, modify quantity with stepper
5. **Return to AI** — type: `"Remove one chicken sandwich and what do you recommend for dessert?"`
6. **Cart updates**, AI recommends a dessert
7. **Brief code walkthrough:** folder structure → Zustand store → backend AI route → action schema

---

## 10. Timeline (7 Days)

| Day | Deliverable                                          |
| --- | ---------------------------------------------------- |
| 1   | Project scaffolding, design system, navigation shell |
| 2   | Home screen + Menu screen UI                         |
| 3   | Cart screen + Zustand store                          |
| 4   | Backend API + Claude integration                     |
| 5   | AI Assistant screen + action → cart wiring           |
| 6   | Polish: animations, error states, edge cases         |
| 7   | README, Loom recording, GitHub cleanup               |
