import { View, Text, FlatList, Image, TouchableOpacity, StatusBar, Modal } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { useCartStore } from '../../src/store/cartStore';
import { CartItem } from '../../src/types';

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.card,
      borderRadius: 14,
      marginHorizontal: 20,
      marginBottom: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: Colors.border,
      gap: 12,
    }}>
      <Image source={{ uri: item.imageUrl }} style={{ width: 64, height: 64, borderRadius: 10 }} resizeMode="cover" />

      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '700', marginBottom: 2 }} numberOfLines={1}>
          {item.name}
        </Text>
        {item.options && (
          <Text style={{ color: Colors.primary, fontSize: 11, fontWeight: '600', marginBottom: 4 }}>
            {Object.values(item.options).filter(Boolean).join(' · ')}
          </Text>
        )}
        <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '800' }}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>

      {/* Quantity Stepper */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.cartItemId, item.quantity - 1)}
          style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border }}
        >
          <Ionicons name="remove" size={14} color={Colors.text} />
        </TouchableOpacity>
        <Text style={{ color: Colors.text, fontSize: 15, fontWeight: '700', minWidth: 22, textAlign: 'center' }}>
          {item.quantity}
        </Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.cartItemId, item.quantity + 1)}
          style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="add" size={14} color="#1A0A00" />
        </TouchableOpacity>
      </View>

      {/* Delete */}
      <TouchableOpacity
        onPress={() => removeItem(item.cartItemId)}
        style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
      >
        <Ionicons name="trash-outline" size={17} color={Colors.muted} />
      </TouchableOpacity>
    </View>
  );
}

export default function CartScreen() {
  const { items, orderType, setOrderType, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber] = useState(() => Math.floor(1000 + Math.random() * 9000));

  const handleCheckout = () => setConfirmed(true);
  const handleDone = () => { setConfirmed(false); clearCart(); };

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg }}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16 }}>
            <Text style={{ color: Colors.text, fontSize: 24, fontWeight: '700' }}>Your Order</Text>
          </View>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
            {/* Illustration */}
            <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
              <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 40 }}>🍽️</Text>
                </View>
              </View>
              {/* Decorative dots */}
              <View style={{ position: 'absolute', top: 8, right: 8, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, opacity: 0.5 }} />
              <View style={{ position: 'absolute', bottom: 10, left: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary, opacity: 0.3 }} />
            </View>

            <Text style={{ color: Colors.text, fontSize: 22, fontWeight: '800', marginBottom: 10, textAlign: 'center' }}>
              Your cart is empty
            </Text>
            <Text style={{ color: Colors.muted, fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 40 }}>
              Browse our menu or tell Bistro AI what you'd like — your cart will update instantly.
            </Text>

            {/* Buttons */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/menu')}
              style={{ backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 36, width: '100%', alignItems: 'center', marginBottom: 12 }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#1A0A00', fontSize: 15, fontWeight: '800' }}>Browse Menu →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/assistant')}
              style={{ backgroundColor: Colors.surface, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 36, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: Colors.border }}
              activeOpacity={0.8}
            >
              <Text style={{ color: Colors.primary, fontSize: 15, fontWeight: '700' }}>✦  Ask Bistro AI</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <StatusBar barStyle="light-content" />

      {/* Confirmation Modal */}
      <Modal visible={confirmed} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <View style={{ backgroundColor: Colors.card, borderRadius: 24, padding: 28, width: '100%', borderWidth: 1, borderColor: Colors.border, alignItems: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.success + '22', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Ionicons name="checkmark-circle" size={40} color={Colors.success} />
            </View>
            <Text style={{ color: Colors.text, fontSize: 20, fontWeight: '800', marginBottom: 6 }}>Order Confirmed!</Text>
            <Text style={{ color: Colors.muted, fontSize: 13, marginBottom: 24 }}>Order #{orderNumber}</Text>

            <View style={{ width: '100%', backgroundColor: Colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 12, marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="time-outline" size={18} color={Colors.primary} />
                <View>
                  <Text style={{ color: Colors.muted, fontSize: 11, fontWeight: '600' }}>PICKUP TIME</Text>
                  <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '700' }}>15 – 20 minutes</Text>
                </View>
              </View>
              <View style={{ height: 1, backgroundColor: Colors.border }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="location-outline" size={18} color={Colors.primary} />
                <View>
                  <Text style={{ color: Colors.muted, fontSize: 11, fontWeight: '600' }}>PICKUP LOCATION</Text>
                  <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '700' }}>The Intelligent Bistro</Text>
                  <Text style={{ color: Colors.muted, fontSize: 12 }}>123 Market Street</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleDone}
              style={{ backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, width: '100%', alignItems: 'center' }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#1A0A00', fontSize: 15, fontWeight: '800' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12 }}>
          <Text style={{ color: Colors.text, fontSize: 24, fontWeight: '700' }}>Your Order</Text>
          <TouchableOpacity onPress={clearCart}>
            <Text style={{ color: Colors.muted, fontSize: 13, fontWeight: '600' }}>Clear all</Text>
          </TouchableOpacity>
        </View>

        {/* Order Type Selector */}
        <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.surface, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: Colors.border }}>
          <TouchableOpacity
            onPress={() => setOrderType('pickup')}
            style={{ flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: orderType === 'pickup' ? Colors.primary : 'transparent', alignItems: 'center' }}
            activeOpacity={0.8}
          >
            <Text style={{ color: orderType === 'pickup' ? '#1A0A00' : Colors.muted, fontSize: 14, fontWeight: '700' }}>
              🏃 Pickup
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOrderType('delivery')}
            style={{ flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: orderType === 'delivery' ? Colors.primary : 'transparent', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
            activeOpacity={0.8}
          >
            <Text style={{ color: orderType === 'delivery' ? '#1A0A00' : Colors.muted, fontSize: 14, fontWeight: '700' }}>
              🛵 Delivery
            </Text>
            <View style={{ backgroundColor: Colors.border, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 }}>
              <Text style={{ color: Colors.muted, fontSize: 9, fontWeight: '700' }}>SOON</Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.cartItemId}
          renderItem={({ item }) => <CartItemRow item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={
            <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
              {/* AI nudge */}
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/assistant')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: Colors.surface,
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  gap: 10,
                  marginBottom: 20,
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="sparkles-outline" size={18} color={Colors.primary} />
                <Text style={{ color: Colors.muted, fontSize: 13, flex: 1 }}>
                  Need changes? <Text style={{ color: Colors.primary, fontWeight: '600' }}>Ask Bistro AI →</Text>
                </Text>
              </TouchableOpacity>

              {/* Price breakdown */}
              <View style={{ backgroundColor: Colors.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: Colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ color: Colors.muted, fontSize: 14 }}>Subtotal</Text>
                  <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '600' }}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
                  <Text style={{ color: Colors.muted, fontSize: 14 }}>Tax (8%)</Text>
                  <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '600' }}>${tax.toFixed(2)}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: Colors.border, marginBottom: 14 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: Colors.text, fontSize: 17, fontWeight: '800' }}>Total</Text>
                  <Text style={{ color: Colors.primary, fontSize: 17, fontWeight: '800' }}>${total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          }
        />

        {/* Checkout Button */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.border }}>
          <TouchableOpacity
            onPress={handleCheckout}
            style={{ backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#1A0A00', fontSize: 16, fontWeight: '800' }}>
              {orderType === 'pickup' ? '🏃 Place Pickup Order' : '🛵 Place Delivery Order'} · ${total.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
