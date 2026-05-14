# The Intelligent Bistro — 3-Day Execution Plan

**Target:** A recordable, demo-ready product in 3 days  
**Mindset:** Delivery mode, not learning mode. Use AI tools aggressively.

---

## Core Strategy

You have no React Native experience. That is fine — this assignment explicitly evaluates:

> *"how effectively you leverage AI coding tools"*

Do not learn React Native from scratch. Use Claude Code / Cursor to generate every component. Your job is to direct, review, and integrate — not to memorize APIs.

**Time allocation:**
| Layer | Weight | Reason |
|-------|--------|--------|
| UI polish | 40% | First impression is everything |
| AI flow + cart state | 35% | Core differentiator |
| Backend | 15% | One endpoint, keep it simple |
| README + Loom prep | 10% | Huge signal to reviewer |

---

## Day 1 — Shell + Visual Layer

**Goal:** App runs on device. Looks professional even with fake data.

### Morning — Project Setup

**Step 1: Initialize Expo project**
```bash
npx create-expo-app@latest bistro-app --template blank-typescript
cd bistro-app
```

**Step 2: Install all dependencies at once**
```bash
# Navigation + layout
npx expo install expo-router react-native-safe-area-context \
  react-native-screens react-native-reanimated expo-linear-gradient

# UI + state
npm install nativewind tailwindcss zustand

# Icons are bundled with Expo — @expo/vector-icons, no install needed
```

**Step 3: Configure NativeWind v4 (3 required files)**

Do not write these manually — prompt Claude Code:
```
Configure NativeWind v4 for Expo SDK 52. Generate:
metro.config.js, babel.config.js, tailwind.config.js, global.css, nativewind-env.d.ts.
Custom colors: bg #0F0A06, surface #1C1108, card #251C10,
primary #D4A040, accent #C03520, text #F2E4CC, muted #8A7060, border #3A2818.
```

**Step 4: Verify it works**
```bash
npx expo start
# Must open on simulator or phone before proceeding
```

---

### Afternoon — Tab Structure + Screen Skeletons

**File structure to create:**
```
app/
  _layout.tsx          ← Root layout (fonts, safe area)
  (tabs)/
    _layout.tsx        ← Tab bar config (colors, icons, cart badge)
    index.tsx          ← Home screen
    menu.tsx           ← Menu screen
    assistant.tsx      ← AI Assistant screen
    cart.tsx           ← Cart screen
```

**Generate each screen with Claude Code. Example prompt for Home:**
```
Build a premium dark-mode restaurant Home screen in React Native with NativeWind.
Colors: bg #0F0A06, card #251C10, gold #D4A040, text #F2E4CC.
Include:
- Header: "Good evening" greeting + subtitle
- Horizontal scroll: 3 featured item cards with image, name, price
- Category chips row: Starters / Mains / Salads / Drinks / Desserts
- AI entry card: "Tell Bistro AI what you want..." with arrow icon
All data hardcoded. Use @expo/vector-icons (Ionicons).
```

Use a similar prompt for Menu (grid of item cards) and Cart (empty state + item rows).

**Do not design from scratch.** Find a reference on Dribbble (search: "food ordering app dark UI") and describe it to Claude Code.

---

### Day 1 Completion Checklist
- [ ] `npx expo start` opens on simulator/phone without errors
- [ ] All 4 tabs navigate correctly
- [ ] Home screen looks premium (real food images from Unsplash URLs)
- [ ] Menu screen shows item grid with prices
- [ ] Cart tab has basic layout (even if empty state only)
- [ ] Tab bar has correct icons and dark background

---

## Day 2 — State + Full Flow + Backend

**Goal:** Complete end-to-end flow works. AI input → backend → cart update.

### Morning — Zustand Cart Store + Menu→Cart

**Step 1: Build the cart store**

This is the most important piece of state in the app. Key design: cart items are identified by `cartItemId = menuItemId + normalized options`. Two "Spicy Chicken Sandwich (Hot)" and "Spicy Chicken Sandwich (Mild)" are separate cart rows.

```typescript
// store/cartStore.ts

function getCartItemKey(menuItemId: string, options?: ItemOptions): string {
  if (!options || Object.keys(options).length === 0) return menuItemId;
  const normalized = Object.keys(options).sort()
    .map(k => `${k}:${options[k]}`).join('|');
  return `${menuItemId}__${normalized}`;
}

// CartStore interface: items[], addItem, removeItem, updateQuantity,
// modifyItem, clearCart, itemCount (derived), subtotal, tax, total
```

Prompt Claude Code with the full interface from `SYSTEM_DESIGN.md` and ask it to implement the Zustand store.

**Step 2: Wire Menu → Cart**

"Add to Cart" button in Menu calls `cartStore.addItem()`. Cart tab badge shows `itemCount`. This must work before moving to AI.

**Step 3: Build Cart screen properly**

- Item rows: thumbnail, name, options label, quantity stepper (−/+), price, delete button
- Subtotal / Tax (8%) / Total footer
- "Place Order" button → confirmation modal (non-functional, just UI)
- Empty state: icon + "Your cart is empty" + "Browse Menu" link

---

### Afternoon First Half — AI Assistant UI + Fake AI

**Step 1: Build Chat UI**

Prompt Claude Code:
```
Build a chat screen in React Native with NativeWind. Dark theme.
Messages list using FlatList inverted. User bubbles right (gold bg #D4A040),
AI bubbles left (surface #1C1108). Show sender name "Aria" on AI bubbles.
Typing indicator: 3 animated dots using Reanimated.
Text input at bottom with send button. Safe area aware.
```

**Step 2: Wire a fake AI response (do this first, not real Claude)**

```typescript
async function fakeProcessMessage(text: string): Promise<AIResponse> {
  await new Promise(r => setTimeout(r, 900)); // simulate latency
  if (text.toLowerCase().includes("burger")) {
    return {
      reply: "Added a Wagyu Smash Burger to your cart! Anything else?",
      actions: [{ type: "ADD_ITEM", itemId: "wagyu-burger", quantity: 1 }]
    };
  }
  return {
    reply: "I can help you order! Try: 'Add two spicy chicken sandwiches'",
    actions: []
  };
}
```

**Why:** Guarantee the full UI→state flow works before adding the real API. Debug UI problems without API noise.

---

### Afternoon Second Half — Backend + Real Claude

**Step 1: Scaffold backend**
```bash
mkdir backend && cd backend
npm init -y
npm install express cors dotenv @anthropic-ai/sdk zod
npm install -D typescript ts-node-dev @types/express @types/cors @types/node
```

**Step 2: One endpoint only**
```
POST /api/ai/order
Body: { message, cart, history }
Returns: { reply, actions[] }
```

Implement with Claude Haiku + Zod validation (see `SYSTEM_DESIGN.md` for the full schema and system prompt template).

**Step 3: Swap fake AI for real API**

Replace `fakeProcessMessage` with a real `fetch` to `http://localhost:3001/api/ai/order`. Done.

**Step 4: Smoke test the key demo interaction**
```
"Add two spicy chicken sandwiches and a large sparkling water"
→ Cart shows: 2× Spicy Chicken Sandwich, 1× Sparkling Water (Large)
```

---

### Day 2 Completion Checklist
- [ ] Menu → Cart manual flow works completely
- [ ] Cart quantity stepper and delete work
- [ ] AI Assistant chat UI renders correctly
- [ ] Typing indicator shows while waiting for response
- [ ] Backend running on port 3001, returns valid JSON
- [ ] AI input → backend → cart update works end-to-end
- [ ] Demo sentence works: `"Add two spicy chicken sandwiches and a large water"`

---

## Day 3 — Polish + README + Loom

**Goal:** Make it feel like a real product. Reviewer remembers the impression, not the internals.

### Morning — UI Polish (Most Important Day)

Work through this list in order. Stop when time runs out — earlier items have higher reviewer impact.

**Priority 1: Typing indicator animation**
Three dots that animate up/down sequentially using Reanimated. Show whenever AI is processing.

**Priority 2: Cart badge animation**
Tab badge number updates with a small scale bounce when items are added via AI.

**Priority 3: Menu card interaction feedback**
Press scale animation on menu cards (`useAnimatedStyle` + `withSpring`). Makes the app feel native.

**Priority 4: Loading skeleton**
Shimmer placeholders while menu loads. One `SkeletonCard` component, used in a grid.

**Priority 5: Error state in AI chat**
If API call fails: `"Bistro AI is unavailable right now. Please try again."` — never a blank crash.

**Priority 6: Empty cart state**
A proper illustration (use an SVG or emoji-based layout), "Your cart is empty", "Browse Menu →" button.

**Priority 7: Consistent design pass**
- All border radii consistent (use `rounded-2xl` everywhere)
- All spacing consistent (use Tailwind spacing scale only, no magic numbers)
- All interactive elements have press feedback

---

### Afternoon — README + Loom Prep

**README structure (this is a signal to the reviewer):**

```markdown
# The Intelligent Bistro

> A premium AI-powered restaurant ordering app.
> Browse the menu or just tell the AI what you want — the cart updates automatically.

## Screenshots
[3 screenshots: Home, Menu, AI chat with cart update]

## Features
- Premium dark-mode mobile UI
- Full menu browsing with category filters
- Shopping cart with quantity management
- Conversational AI ordering (natural language → structured actions)
- Structured JSON action schema (typed, Zod-validated)

## Tech Stack
[table: Frontend / Backend / AI / State / Styling]

## AI Action Flow
[1-paragraph explanation + the request/response JSON example]

## Run Locally
[backend setup, frontend setup — exact commands]
```

---

### Loom Recording (5 minutes)

**Script:**

| Time | Content |
|------|---------|
| 0:00–1:00 | Open app, walk through Home screen, describe what the app is |
| 1:00–2:30 | Go to Menu, browse categories, manually add a Wagyu Burger |
| 2:30–4:00 | Go to AI Assistant, type the key demo sentence, show Cart update in real time. Then: remove an item via AI. |
| 4:00–5:00 | Show code: folder structure → Zustand store → backend AI route → action schema |

**Recording tips:**
- Use iOS Simulator (cleaner than Android for recording)
- Increase font size in terminal before showing code
- Don't apologize for anything — narrate confidently

---

### Day 3 Completion Checklist
- [ ] No visible layout bugs or crashes
- [ ] Animations feel smooth (not janky)
- [ ] README looks like a real startup repo
- [ ] `.env` is NOT committed — `.env.example` is
- [ ] GitHub repo is clean (no debug logs, no commented-out code)
- [ ] Loom recorded and link ready

---

## The One Rule

> When you don't know a React Native API, **prompt Claude Code immediately**.  
> Do not google. Do not read docs. Time is the constraint.  
> This is what the assignment is actually testing.

---

## Reference: Key Architecture Decisions

See `SYSTEM_DESIGN.md` for full detail. Critical points to remember while coding:

1. **Cart identity:** `cartItemId = menuItemId + options hash` — never use `menuItemId` alone as the cart key
2. **Zod validation:** Validate every Claude response with `AIResponseSchema.parse()` before dispatching actions
3. **Options scope:** Only 3 items have options (Spicy Chicken Sandwich, Sparkling Water, Lemonade). Do not expand this.
4. **AI model:** `claude-haiku-4-5-20251001` — fast, cheap, good JSON adherence
5. **Home screen:** Visual only. No business logic.
