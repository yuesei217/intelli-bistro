import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence,
  withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useCartStore } from '../../src/store/cartStore';
import { ChatMessage, AIResponse } from '../../src/types';
import { API_BASE_URL } from '../../src/constants/config';

const QUICK_SUGGESTIONS = [
  "What's popular?",
  'Add a Wagyu Burger',
  'Show me vegetarian options',
  'Add two sparkling waters',
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm Aria, your Bistro AI. I can help you order, modify your cart, or recommend dishes. What can I get for you tonight? ✦",
  timestamp: Date.now(),
};

// Fake fallback when backend is unreachable
async function fakeAI(message: string): Promise<AIResponse> {
  await new Promise((r) => setTimeout(r, 900));
  const lower = message.toLowerCase();
  if (lower.includes('burger') || lower.includes('wagyu')) {
    return { reply: "Great choice! I've added a Wagyu Smash Burger to your cart. Anything else?", actions: [{ type: 'ADD_ITEM', itemId: 'wagyu-burger', quantity: 1 }] };
  }
  if (lower.includes('fries') || lower.includes('truffle')) {
    return { reply: "Added Truffle Parmesan Fries! A perfect pairing.", actions: [{ type: 'ADD_ITEM', itemId: 'truffle-fries', quantity: 1 }] };
  }
  if (lower.includes('water') || lower.includes('sparkling')) {
    return { reply: "Added a Sparkling Water for you!", actions: [{ type: 'ADD_ITEM', itemId: 'sparkling-water', quantity: 1 }] };
  }
  if (lower.includes('clear') || lower.includes('start over') || lower.includes('empty')) {
    return { reply: "Done! I've cleared your cart. Let's start fresh — what would you like?", actions: [{ type: 'CLEAR_CART' }] };
  }
  if (lower.includes('popular') || lower.includes('recommend') || lower.includes('best')) {
    return { reply: "Our most loved dishes right now: 🍔 Wagyu Smash Burger ($28), 🌶️ Spicy Chicken Sandwich ($19), and 🍫 Chocolate Lava Cake ($14). Want me to add any of these?", actions: [] };
  }
  return { reply: "I can help you order, modify your cart, or recommend dishes. Try: 'Add two spicy chicken sandwiches' or 'What do you recommend?'", actions: [] };
}

async function sendToBackend(message: string, cart: ReturnType<typeof useCartStore.getState>['items'], history: ChatMessage[]): Promise<AIResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        cart: cart.map((i) => ({ menuItemId: i.menuItemId, name: i.name, quantity: i.quantity, options: i.options })),
        history: history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    clearTimeout(timer);
    return fakeAI(message);
  }
}

function Dot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 300, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) }),
          withTiming(0, { duration: 200 }),
        ),
        -1,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View
      style={[{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.muted, marginHorizontal: 2 }, style]}
    />
  );
}

function TypingIndicator() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="sparkles" size={14} color="#1A0A00" />
      </View>
      <View style={{ backgroundColor: Colors.surface, borderRadius: 16, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: Colors.border, flexDirection: 'row', alignItems: 'center' }}>
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </View>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isError = message.isError === true;
  return (
    <View style={{
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingBottom: 12,
      gap: 8,
    }}>
      {!isUser && (
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: isError ? Colors.accent : Colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Ionicons name={isError ? 'warning-outline' : 'sparkles'} size={14} color={isError ? '#fff' : '#1A0A00'} />
        </View>
      )}
      <View style={{
        maxWidth: '75%',
        backgroundColor: isUser ? Colors.primary : Colors.surface,
        borderRadius: 18,
        borderBottomRightRadius: isUser ? 4 : 18,
        borderBottomLeftRadius: isUser ? 18 : 4,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: isUser ? 0 : 1,
        borderColor: isError ? Colors.accent : Colors.border,
      }}>
        <Text style={{ color: isUser ? '#1A0A00' : isError ? Colors.accent : Colors.text, fontSize: 14, lineHeight: 20 }}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

export default function AssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { items, dispatchAIActions, chatResetKey } = useCartStore();

  useEffect(() => {
    if (chatResetKey === 0) return;
    setMessages([WELCOME_MESSAGE]);
  }, [chatResetKey]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput('');

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: trimmed, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendToBackend(trimmed, items, messages);
      const aiMsg: ChatMessage = { id: `a-${Date.now()}`, role: 'assistant', content: response.reply, timestamp: Date.now() };
      setMessages((prev) => [...prev, aiMsg]);
      if (response.actions?.length > 0) {
        dispatchAIActions(response.actions);
      }
    } catch {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Bistro AI is unavailable right now. Please try again.',
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    }
    setIsLoading(false);
  }, [isLoading, items, messages, dispatchAIActions]);

  const renderItem = useCallback(({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} />
  ), []);

  const showSuggestions = messages.length <= 1;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 14, gap: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="sparkles" size={18} color="#1A0A00" />
            </View>
            <View>
              <Text style={{ color: Colors.text, fontSize: 17, fontWeight: '700' }}>Bistro AI</Text>
              <Text style={{ color: Colors.success, fontSize: 11, fontWeight: '600' }}>● Online · 123 Market Street</Text>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 4 }}
            ListFooterComponent={isLoading ? <TypingIndicator /> : null}
          />

          {/* Quick Suggestions */}
          {showSuggestions && (
            <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {QUICK_SUGGESTIONS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => send(s)}
                    style={{ backgroundColor: Colors.card, borderRadius: 20, paddingVertical: 7, paddingHorizontal: 13, borderWidth: 1, borderColor: Colors.border }}
                    activeOpacity={0.75}
                  >
                    <Text style={{ color: Colors.text, fontSize: 12, fontWeight: '600' }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Input Bar */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            gap: 10,
          }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Add a burger, remove the fries…"
              placeholderTextColor={Colors.muted}
              style={{
                flex: 1,
                backgroundColor: Colors.surface,
                borderRadius: 22,
                paddingHorizontal: 16,
                paddingVertical: 10,
                color: Colors.text,
                fontSize: 14,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
              multiline
              maxLength={300}
              onSubmitEditing={() => send(input)}
              returnKeyType="send"
              blurOnSubmit
            />
            <TouchableOpacity
              onPress={() => send(input)}
              disabled={!input.trim() || isLoading}
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: input.trim() && !isLoading ? Colors.primary : Colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: input.trim() && !isLoading ? 0 : 1,
                borderColor: Colors.border,
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-up" size={20} color={input.trim() && !isLoading ? '#1A0A00' : Colors.muted} />
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
