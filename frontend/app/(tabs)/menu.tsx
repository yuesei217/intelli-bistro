import { useState, useMemo } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { MENU_ITEMS, CATEGORIES } from '../../src/data/menu';
import { useCartStore } from '../../src/store/cartStore';
import { MenuItem } from '../../src/types';

function MenuCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const inCart = cartItems.find((i) => i.menuItemId === item.id);

  return (
    <TouchableOpacity
      onPress={() => addItem(item.id, 1)}
      activeOpacity={0.82}
      style={{
        flex: 1,
        margin: 6,
        backgroundColor: Colors.card,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: inCart ? Colors.primary : Colors.border,
      }}
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
    </TouchableOpacity>
  );
}

export default function MenuScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 14, gap: 8 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setActiveCategory(cat.key)}
              style={{
                paddingVertical: 7,
                paddingHorizontal: 16,
                borderRadius: 20,
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
              }}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grid */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 24 }}
          renderItem={({ item }) => <MenuCard item={item} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ fontSize: 36 }}>🍽️</Text>
              <Text style={{ color: Colors.muted, fontSize: 15, marginTop: 12 }}>No dishes found</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}
