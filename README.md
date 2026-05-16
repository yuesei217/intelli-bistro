# The Intelligent Bistro

A premium AI-powered restaurant ordering app. Browse the menu or tell the AI what you want — the cart updates automatically.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native + Expo SDK 54 |
| Styling | NativeWind v4 (Tailwind CSS) |
| State | Zustand |
| Routing | Expo Router |
| Backend | Node.js + Express + TypeScript |
| AI | Claude Haiku (Anthropic) |
| Validation | Zod |

---

## Project Structure

```
bistro/
├── frontend/          # Expo React Native app
│   ├── app/           # Expo Router screens (tabs)
│   ├── src/
│   │   ├── components/
│   │   ├── constants/ # Colors, API config
│   │   ├── data/      # Static menu data
│   │   ├── store/     # Zustand cart store
│   │   └── types/
│   └── ...
├── backend/           # Node.js API
│   ├── src/
│   │   ├── routes/    # /api/menu, /api/ai/order
│   │   ├── services/  # Claude integration + Zod validation
│   │   └── data/      # Menu data
│   └── ...
└── docs/              # PRD, System Design, Execution Plan
```

---

## Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)
- Expo Go app installed on your phone (iOS or Android)

---

## Setup & Run

### 1. Clone the repo

```bash
git clone <repo-url>
cd bistro
```

### 2. Backend — install dependencies

```bash
cd backend
npm install
```

### 3. Backend — create your `.env` file

```bash
cp .env.example .env
```

Open `backend/.env` and fill in your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
```

### 4. Frontend — install dependencies

```bash
cd ../frontend
npm install
```

### 5. Frontend — backend URL

No manual config needed. The start scripts automatically detect your Mac's current LAN IP:

```bash
npm run dev        # IP injected automatically via $(ipconfig getifaddr en0)
```

> **iOS Simulator only:** If running on simulator instead of a physical device, edit `frontend/.env` and set `EXPO_PUBLIC_API_URL=http://localhost:3001`.

### 6. Run both servers

**Option A — One command (from the repo root):**
```bash
cd bistro   # repo root
npm run dev
```
This starts both backend and frontend simultaneously using `concurrently`.
> Note: the QR code is hidden in this mode. **First time:** use Option B to scan the QR code — Expo Go will remember the project. **After that:** use `npm run dev` from root, then tap the project in Expo Go's Recent list to reconnect.

**Option B — Two terminal windows (shows QR code):**

Terminal 1:
```bash
cd backend && npm run dev
# → Bistro backend running on http://localhost:3001
```

Terminal 2:
```bash
cd frontend && npx expo start
# → Scan the QR code with your phone's camera app to open in Expo Go
```

---

## AI Ordering — How It Works

When a user sends a natural language message, the backend calls Claude with a structured system prompt and returns typed JSON:

**Request:**
```json
{
  "message": "Add two spicy chicken sandwiches and a large sparkling water",
  "cart": [],
  "history": []
}
```

**Response:**
```json
{
  "reply": "Done! I've added 2 Spicy Chicken Sandwiches and 1 Large Sparkling Water.",
  "actions": [
    { "type": "ADD_ITEM", "itemId": "spicy-chicken-sandwich", "quantity": 2, "options": { "spiceLevel": "Hot" } },
    { "type": "ADD_ITEM", "itemId": "sparkling-water", "quantity": 1, "options": { "size": "Large" } }
  ]
}
```

The frontend dispatches each action to the Zustand cart store, which updates the UI instantly.

---

## AI Capabilities

The assistant (Aria) can:

- Add items to cart — *"Add a wagyu burger"*
- Remove items — *"Remove the fries"*
- Update quantity — *"Change the sandwiches to 3"*
- Modify options — *"Make the chicken sandwich extra hot"*
- Clear cart — *"Start over"*
- Recommend dishes — *"What's popular tonight?"*

---

## Key Design Decisions

**Cart identity:** Items are keyed by `menuItemId + options`, so a Spicy Chicken (Hot) and Spicy Chicken (Mild) are separate cart rows — never merged incorrectly.

**Zod validation:** Every Claude response is parsed with a typed Zod schema before touching the cart. Unknown item IDs are filtered out.

**Graceful fallback:** If the backend is unreachable, the AI assistant falls back to local mock responses — the app never crashes.
