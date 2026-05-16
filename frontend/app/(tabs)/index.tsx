import { ScrollView, View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { MENU_ITEMS, FEATURED_IDS } from '../../src/data/menu';
import { useCartStore } from '../../src/store/cartStore';

const CATEGORY_CHIPS = [
  { key: 'starter', label: 'Starters', icon: '🥗' },
  { key: 'main',    label: 'Mains',    icon: '🍔' },
  { key: 'drink',   label: 'Drinks',   icon: '🍹' },
  { key: 'dessert', label: 'Desserts', icon: '🍫' },
  { key: 'side',    label: 'Sides',    icon: '🍟' },
];

const featured = MENU_ITEMS.filter((m) => FEATURED_IDS.includes(m.id));

export default function HomeScreen() {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ color: Colors.muted, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Good evening</Text>
              <Text style={{ color: Colors.text, fontSize: 28, fontWeight: '700', marginTop: 2 }}>The Intelligent</Text>
              <Text style={{ color: Colors.primary, fontSize: 28, fontWeight: '700', fontStyle: 'italic' }}>Bistro ✦</Text>
            </View>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border, marginTop: 6 }}>
              <Ionicons name="person-outline" size={18} color={Colors.muted} />
            </View>
          </View>

          {/* AI CTA Card */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/assistant')}
            style={{ marginHorizontal: 20, marginBottom: 28, borderRadius: 18, overflow: 'hidden' }}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.primaryDk, Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'rgba(26,10,0,0.7)', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
                  Bistro AI
                </Text>
                <Text style={{ color: '#1A0A00', fontSize: 18, fontWeight: '800', lineHeight: 24 }}>
                  Tell me what you want…
                </Text>
                <Text style={{ color: 'rgba(26,10,0,0.65)', fontSize: 13, marginTop: 5, fontStyle: 'italic' }}>
                  "Add two spicy chicken sandwiches"
                </Text>
              </View>
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(0,0,0,0.12)', alignItems: 'center', justifyContent: 'center', marginLeft: 12 }}>
                <Ionicons name="sparkles" size={22} color="#1A0A00" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Chef's Picks */}
          <View style={{ marginBottom: 28 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 }}>
              <Text style={{ color: Colors.text, fontSize: 19, fontWeight: '700' }}>Chef's Picks</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/menu')}>
                <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: '600' }}>See all →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}>
              {featured.map((item) => {
                const inCart = cartItems.find((i) => i.menuItemId === item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.82}
                    onPress={() => addItem(item.id, 1)}
                    style={{
                      width: 186,
                      marginRight: 12,
                      backgroundColor: Colors.card,
                      borderRadius: 16,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: inCart ? Colors.primary : Colors.border,
                    }}
                  >
                    <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 120 }} resizeMode="cover" />
                    <LinearGradient colors={['transparent', 'rgba(15,10,6,0.8)']} style={{ position: 'absolute', top: 60, left: 0, right: 0, height: 60 }} />
                    <View style={{ padding: 12 }}>
                      <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '700', marginBottom: 6 }} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '800' }}>${item.price}</Text>
                        <View style={{
                          backgroundColor: inCart ? Colors.primary : Colors.surface,
                          borderRadius: 12,
                          width: 26,
                          height: 26,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: inCart ? 0 : 1,
                          borderColor: Colors.border,
                        }}>
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
              })}
            </ScrollView>
          </View>

          {/* Browse by Category */}
          <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
            <Text style={{ color: Colors.text, fontSize: 19, fontWeight: '700', marginBottom: 14 }}>Browse Menu</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {CATEGORY_CHIPS.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => router.push('/(tabs)/menu')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.card,
                    borderRadius: 24,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderWidth: 1,
                    borderColor: Colors.border,
                    gap: 6,
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
                  <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '600' }}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tonight's Special Banner */}
          <View style={{ marginHorizontal: 20, marginBottom: 40, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border }}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80' }}
              style={{ width: '100%', height: 148 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(15,10,6,0.96)']}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18 }}
            >
              <Text style={{ color: Colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' }}>Tonight Only</Text>
              <Text style={{ color: Colors.text, fontSize: 18, fontWeight: '700', marginTop: 3 }}>5-Course Tasting Menu</Text>
              <Text style={{ color: Colors.muted, fontSize: 13, marginTop: 3 }}>Ask Bistro AI for details →</Text>
            </LinearGradient>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
