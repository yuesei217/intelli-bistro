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

const DELIVERY_FEE = 3.99;

export default function CartScreen() {
  const { items, orderType, setOrderType, clearCart, confirmOrder } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;
  const [reviewing, setReviewing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber] = useState(() => Math.floor(1000 + Math.random() * 9000));

  const handleCheckout = () => setReviewing(true);
  const handleCancel = () => setReviewing(false);
  const handleConfirm = () => { setReviewing(false); setConfirmed(true); };
  const handleDone = () => { setConfirmed(false); confirmOrder(); };

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

      {/* Review Modal */}
      <Modal visible={reviewing} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: Colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, borderWidth: 1, borderColor: Colors.border }}>
            <Text style={{ color: Colors.text, fontSize: 19, fontWeight: '800', marginBottom: 4 }}>
              {orderType === 'pickup' ? '🏃 Confirm Pickup' : '🛵 Confirm Delivery'}
            </Text>
            <Text style={{ color: Colors.muted, fontSize: 13, marginBottom: 20 }}>
              {orderType === 'pickup' ? '123 Market Street · ~15–20 min' : '456 Elm Avenue, Apt 3B · ~35–50 min'}
            </Text>

            {/* Item list */}
            <View style={{ gap: 8, marginBottom: 20 }}>
              {items.map((i) => (
                <View key={i.cartItemId} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: Colors.text, fontSize: 14 }} numberOfLines={1}>
                    {i.quantity}× {i.name}
                  </Text>
                  <Text style={{ color: Colors.muted, fontSize: 14 }}>${(i.price * i.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>

            <View style={{ height: 1, backgroundColor: Colors.border, marginBottom: 16 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
              <Text style={{ color: Colors.text, fontSize: 16, fontWeight: '800' }}>Total</Text>
              <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '800' }}>${total.toFixed(2)}</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={handleCancel}
                style={{ flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface }}
                activeOpacity={0.8}
              >
                <Text style={{ color: Colors.text, fontSize: 15, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={{ flex: 2, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: Colors.primary }}
                activeOpacity={0.85}
              >
                <Text style={{ color: '#1A0A00', fontSize: 15, fontWeight: '800' }}>Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                  <Text style={{ color: Colors.muted, fontSize: 11, fontWeight: '600' }}>
                    {orderType === 'pickup' ? 'PICKUP TIME' : 'ESTIMATED DELIVERY'}
                  </Text>
                  <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '700' }}>
                    {orderType === 'pickup' ? '15 – 20 minutes' : '35 – 50 minutes'}
                  </Text>
                </View>
              </View>
              <View style={{ height: 1, backgroundColor: Colors.border }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name={orderType === 'pickup' ? 'location-outline' : 'home-outline'} size={18} color={Colors.primary} />
                <View>
                  <Text style={{ color: Colors.muted, fontSize: 11, fontWeight: '600' }}>
                    {orderType === 'pickup' ? 'PICKUP LOCATION' : 'DELIVERING TO'}
                  </Text>
                  {orderType === 'pickup' ? (
                    <>
                      <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '700' }}>The Intelligent Bistro</Text>
                      <Text style={{ color: Colors.muted, fontSize: 12 }}>123 Market Street</Text>
                    </>
                  ) : (
                    <>
                      <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '700' }}>Your Location</Text>
                      <Text style={{ color: Colors.muted, fontSize: 12 }}>via GPS · Delivery fee ${DELIVERY_FEE.toFixed(2)}</Text>
                    </>
                  )}
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
            style={{ flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: orderType === 'delivery' ? Colors.primary : 'transparent', alignItems: 'center' }}
            activeOpacity={0.8}
          >
            <Text style={{ color: orderType === 'delivery' ? '#1A0A00' : Colors.muted, fontSize: 14, fontWeight: '700' }}>
              🛵 Delivery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delivery address strip */}
        {orderType === 'delivery' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 12, gap: 8 }}>
            <Ionicons name="location-outline" size={14} color={Colors.primary} />
            <Text style={{ color: Colors.muted, fontSize: 13 }}>
              Delivering to <Text style={{ color: Colors.text, fontWeight: '600' }}>456 Elm Avenue, Apt 3B</Text>
            </Text>
          </View>
        )}

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
                {orderType === 'delivery' && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ color: Colors.muted, fontSize: 14 }}>Delivery fee</Text>
                    <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '600' }}>${DELIVERY_FEE.toFixed(2)}</Text>
                  </View>
                )}
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
