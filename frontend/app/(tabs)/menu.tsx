import { useState, useMemo } from 'react';
import { View, Text, FlatList, Image, Pressable, TouchableOpacity, TextInput, StatusBar, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { MENU_ITEMS, CATEGORIES, getMenuItem } from '../../src/data/menu';
import { useCartStore } from '../../src/store/cartStore';
import { MenuItem } from '../../src/types';

function MenuCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const inCart = cartItems.find((i) => i.menuItemId === item.id);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => addItem(item.id, 1)}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 200 }); }}
      style={{ flex: 1, margin: 6 }}
    >
      <Animated.View
        style={[{
          backgroundColor: Colors.card,
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: inCart ? Colors.primary : Colors.border,
        }, animatedStyle]}
      >
        <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 130 }} resizeMode="cover" />

        {/* Tags */}
        <View style={{ position: 'absolute', top: 8, left: 8, flexDirection: 'row', gap: 4 }}>
          {item.tags.includes('popular') && (
            <View style={{ backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 }}>
              <Text style={{ color: '#1A0A00', fontSize: 10, fontWeight: '800' }}>Popular</Text>
            </View>
          )}
          {item.tags.includes('chef-pick') && (
            <View style={{ backgroundColor: Colors.accent, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>Chef's Pick</Text>
            </View>
          )}
        </View>

        <View style={{ padding: 10 }}>
          <Text style={{ color: Colors.text, fontSize: 13, fontWeight: '700', marginBottom: 3 }} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={{ color: Colors.muted, fontSize: 11, lineHeight: 15, marginBottom: 8 }} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.primary, fontSize: 15, fontWeight: '800' }}>${item.price}</Text>
            <View
              style={{
                backgroundColor: inCart ? Colors.primary : Colors.surface,
                borderRadius: 12,
                width: 28,
                height: 28,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: inCart ? 0 : 1,
                borderColor: Colors.border,
              }}
            >
              {inCart ? (
                <Text style={{ color: '#1A0A00', fontSize: 11, fontWeight: '800' }}>{inCart.quantity}</Text>
              ) : (
                <Ionicons name="add" size={17} color={Colors.muted} />
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function MenuScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const filtered = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (item.id === 'tasting-menu') return false;
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const tastingMenu = getMenuItem('tasting-menu')!;
  const showTastingBanner = useMemo(() => {
    const matchesCategory = activeCategory === 'all' || activeCategory === 'main';
    const matchesSearch = tastingMenu.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  }, [activeCategory, search]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 14 }}>
          <Text style={{ color: Colors.text, fontSize: 24, fontWeight: '700', marginBottom: 14 }}>Our Menu</Text>
          {/* Search */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surface,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: Colors.border,
            gap: 8,
          }}>
            <Ionicons name="search-outline" size={16} color={Colors.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search dishes…"
              placeholderTextColor={Colors.muted}
              style={{ flex: 1, color: Colors.text, fontSize: 14, paddingVertical: 10 }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={Colors.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter */}
        <View style={{ height: 40, marginBottom: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, alignItems: 'center' }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setActiveCategory(cat.key)}
                style={{
                  height: 32,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  marginRight: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: activeCategory === cat.key ? Colors.primary : Colors.card,
                  borderWidth: 1,
                  borderColor: activeCategory === cat.key ? Colors.primary : Colors.border,
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  color: activeCategory === cat.key ? '#1A0A00' : Colors.text,
                  fontSize: 13,
                  fontWeight: '700',
                  lineHeight: 18,
                }}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Grid */}
        <FlatList
          style={{ flex: 1 }}
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 24 }}
          renderItem={({ item }) => <MenuCard item={item} />}
          ListEmptyComponent={
            !showTastingBanner ? (
              <View style={{ alignItems: 'center', paddingTop: 60 }}>
                <Text style={{ fontSize: 36 }}>🍽️</Text>
                <Text style={{ color: Colors.muted, fontSize: 15, marginTop: 12 }}>No dishes found</Text>
              </View>
            ) : null
          }
          ListFooterComponent={showTastingBanner ? (() => {
            const inCart = cartItems.find((i) => i.menuItemId === 'tasting-menu');
            return (
              <TouchableOpacity
                onPress={() => addItem('tasting-menu', 1)}
                activeOpacity={0.85}
                style={{ marginHorizontal: 6, marginTop: 6, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: inCart ? Colors.primary : Colors.border }}
              >
                <Image
                  source={{ uri: tastingMenu.imageUrl }}
                  style={{ width: '100%', height: 160 }}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(15,10,6,0.97)']}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}
                >
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={{ color: Colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>Tonight Only</Text>
                    <Text style={{ color: Colors.text, fontSize: 17, fontWeight: '700' }}>{tastingMenu.name}</Text>
                    <Text style={{ color: Colors.muted, fontSize: 12, marginTop: 2 }} numberOfLines={1}>{tastingMenu.description}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <Text style={{ color: Colors.primary, fontSize: 18, fontWeight: '800' }}>${tastingMenu.price}</Text>
                    <View style={{
                      backgroundColor: inCart ? Colors.primary : Colors.surface,
                      borderRadius: 12, width: 30, height: 30,
                      alignItems: 'center', justifyContent: 'center',
                      borderWidth: inCart ? 0 : 1, borderColor: Colors.border,
                    }}>
                      {inCart
                        ? <Text style={{ color: '#1A0A00', fontSize: 12, fontWeight: '800' }}>{inCart.quantity}</Text>
                        : <Ionicons name="add" size={18} color={Colors.muted} />}
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })() : null}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}
