import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { MENU_ITEMS, MENU_LOOKUP } from '../data/menu';
import { AIOrderRequest, AIOrderResponse } from '../types';

const client = new Anthropic();

// Zod schema — validates Claude's output before it touches the frontend
const ItemOptionsSchema = z.object({
  size: z.enum(['Regular', 'Large']).optional(),
  spiceLevel: z.enum(['Mild', 'Medium', 'Hot']).optional(),
});

const CartActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ADD_ITEM'),        itemId: z.string(), quantity: z.number().int().positive(), options: ItemOptionsSchema.optional() }),
  z.object({ type: z.literal('REMOVE_ITEM'),     itemId: z.string() }),
  z.object({ type: z.literal('UPDATE_QUANTITY'), itemId: z.string(), quantity: z.number().int().nonnegative() }),
  z.object({ type: z.literal('MODIFY_ITEM'),     itemId: z.string(), options: ItemOptionsSchema }),
  z.object({ type: z.literal('CLEAR_CART') }),
  z.object({ type: z.literal('SET_ORDER_TYPE'),  orderType: z.enum(['pickup', 'delivery']) }),
]);

const AIResponseSchema = z.object({
  reply: z.string().min(1),
  actions: z.array(CartActionSchema),
});

function buildSystemPrompt(cartSummary: string): string {
  const menuList = MENU_ITEMS.map((item) => {
    const opts = item.options
      ? ` [options: ${[
          item.options.spiceLevel ? `spiceLevel: ${item.options.spiceLevel.join('/')}` : '',
          item.options.size ? `size: ${item.options.size.join('/')}` : '',
        ].filter(Boolean).join(', ')}]`
      : '';
    return `- ${item.id}: ${item.name} — $${item.price} | ${item.description}${opts}`;
  }).join('\n');

  return `You are Aria, the warm and knowledgeable AI server at The Intelligent Bistro, a premium modern restaurant.

CURRENT CART:
${cartSummary || 'Empty'}

MENU:
${menuList}

RULES:
1. Always respond with ONLY valid JSON in this exact shape — no markdown, no explanation, no extra text:
   { "reply": "<your message to the guest>", "actions": [<CartAction>] }
2. Only reference itemIds that exist in the menu above.
3. For recommendations, set actions to [] and reply naturally.
4. If you cannot fulfill a request, explain in reply and return actions: [].
5. Be warm, concise, and professional — like a knowledgeable restaurant server.
6. When adding items with options not specified by the guest, use sensible defaults (e.g. spiceLevel: "Medium").
7. Confirm what you added/removed in your reply message.

VALID ACTION TYPES:
- { "type": "ADD_ITEM", "itemId": string, "quantity": number, "options"?: { "size"?: "Regular"|"Large", "spiceLevel"?: "Mild"|"Medium"|"Hot" } }
- { "type": "REMOVE_ITEM", "itemId": string }
- { "type": "UPDATE_QUANTITY", "itemId": string, "quantity": number }
- { "type": "MODIFY_ITEM", "itemId": string, "options": { ... } }
- { "type": "CLEAR_CART" }
- { "type": "SET_ORDER_TYPE", "orderType": "pickup"|"delivery" } — use when the guest mentions pickup or delivery`;
}

function buildCartSummary(cart: AIOrderRequest['cart']): string {
  if (cart.length === 0) return 'Empty';
  return cart.map((item) => {
    const opts = item.options ? ` (${Object.values(item.options).filter(Boolean).join(', ')})` : '';
    return `${item.quantity}× ${item.name}${opts}`;
  }).join(', ');
}

const FALLBACK_RESPONSE: AIOrderResponse = {
  reply: "I'm having a moment — could you try again? You can also browse the menu tab and add items manually.",
  actions: [],
};

export async function processOrder(req: AIOrderRequest): Promise<AIOrderResponse> {
  const cartSummary = buildCartSummary(req.cart);

  const messages: Anthropic.MessageParam[] = [
    ...req.history.slice(-10).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: req.message },
  ];

  console.log(`[aiService] calling Claude | cart: "${cartSummary}" | msgs: ${messages.length}`);
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: buildSystemPrompt(cartSummary),
      messages,
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log(`[aiService] raw Claude response: ${rawText.slice(0, 120)}`);

    // Strip markdown code fences if Claude wraps in ```json
    const cleaned = rawText.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();

    const parsed = JSON.parse(cleaned);
    const validated = AIResponseSchema.parse(parsed);

    // Filter out any actions with unknown itemIds
    validated.actions = validated.actions.filter(
      (a) => !('itemId' in a) || MENU_LOOKUP.has((a as { itemId: string }).itemId)
    );

    console.log(`[aiService] ✅ success | actions: ${validated.actions.length}`);
    return validated;
  } catch (err) {
    console.error('[aiService] ❌ error:', err);
    return FALLBACK_RESPONSE;
  }
}
