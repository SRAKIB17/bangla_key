import React, { useState, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import {
  BIJOY_VOWELS,
  BIJOY_CONSONANTS,
  BIJOY_KARS,
  BIJOY_CONJUNCTS,
  BijoyKeyItem,
} from '@/constants/bijoyLayoutData';
import { BijoyVisualKeyboard } from './BijoyVisualKeyboard';

interface BijoyCheatSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectCharacter?: (char: string) => void;
  mobileCompatMode?: boolean;
}

type TabType = 'visual' | 'conjuncts' | 'vowels' | 'consonants' | 'kars';

export function BijoyCheatSheet({
  visible,
  onClose,
  onSelectCharacter,
  mobileCompatMode = true,
}: BijoyCheatSheetProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('visual');
  const [searchQuery, setSearchQuery] = useState('');

  const filterItems = (list: BijoyKeyItem[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.char.includes(q) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        item.keys.toLowerCase().includes(q) ||
        (item.example && item.example.includes(q))
    );
  };

  const filteredConjuncts = useMemo(() => filterItems(BIJOY_CONJUNCTS), [searchQuery]);
  const filteredVowels = useMemo(() => filterItems(BIJOY_VOWELS), [searchQuery]);
  const filteredConsonants = useMemo(() => filterItems(BIJOY_CONSONANTS), [searchQuery]);
  const filteredKars = useMemo(() => filterItems(BIJOY_KARS), [searchQuery]);

  const renderKeyItem = ({ item }: { item: BijoyKeyItem }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderColor: isDark ? '#334155' : '#E2E8F0',
        },
      ]}
      onPress={() => {
        if (onSelectCharacter) {
          onSelectCharacter(item.char);
        }
      }}
    >
      <View style={styles.charBox}>
        <ThemedText style={styles.charText}>{item.char}</ThemedText>
      </View>
      <View style={styles.infoBox}>
        {item.name ? (
          <ThemedText style={styles.charName} numberOfLines={1}>{item.name}</ThemedText>
        ) : null}
        <View style={styles.keyBadge}>
          <Feather name="command" size={10} color="#D97706" style={{ marginRight: 3 }} />
          <ThemedText style={styles.keyText}>{item.keys}</ThemedText>
        </View>
        {item.example ? (
          <ThemedText style={styles.exampleText} numberOfLines={1}>
            যেমন: <ThemedText style={styles.exampleHighlight}>{item.example}</ThemedText>
          </ThemedText>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'vowels':
        return 'স্বরবর্ণ, কী (Shift+F, G+D) বা শব্দ দিয়ে খুঁজুন...';
      case 'consonants':
        return 'ব্যঞ্জনবর্ণ, কী (J, K) বা শব্দ দিয়ে খুঁজুন...';
      case 'kars':
        return 'কার, চিহ্ন বা শর্টকাট দিয়ে খুঁজুন...';
      default:
        return 'যুক্তবর্ণ, কী (যেমন: J+G+K) বা শব্দ দিয়ে খুঁজুন...';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          {/* Header Bar */}
          <View
            style={[
              styles.header,
              {
                borderBottomColor: isDark ? '#334155' : '#E2E8F0',
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              },
            ]}
          >
            <View style={styles.headerTitleGroup}>
              <View style={styles.headerIconBadge}>
                <Ionicons name="book" size={18} color="#FFFFFF" />
              </View>
              <View>
                <ThemedText style={styles.title}>বিজয় লেআউট গাইড</ThemedText>
                <ThemedText style={styles.subtitle}>
                  টাইপিং শর্টকাট ও যুক্তবর্ণ ডিরেক্টরি
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.closeButton,
                { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
              ]}
              onPress={onClose}
            >
              <Ionicons name="close" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabItem,
                  activeTab === 'visual' && styles.activeTabItem,
                ]}
                onPress={() => setActiveTab('visual')}
              >
                <MaterialCommunityIcons
                  name="keyboard-variant"
                  size={14}
                  color={activeTab === 'visual' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                  style={{ marginRight: 5 }}
                />
                <ThemedText
                  style={[
                    styles.tabText,
                    activeTab === 'visual' && styles.activeTabText,
                  ]}
                >
                  কীবোর্ড ম্যাপ
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabItem,
                  activeTab === 'conjuncts' && styles.activeTabItem,
                ]}
                onPress={() => setActiveTab('conjuncts')}
              >
                <MaterialCommunityIcons
                  name="set-merge"
                  size={14}
                  color={activeTab === 'conjuncts' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                  style={{ marginRight: 5 }}
                />
                <ThemedText
                  style={[
                    styles.tabText,
                    activeTab === 'conjuncts' && styles.activeTabText,
                  ]}
                >
                  যুক্তবর্ণ ({BIJOY_CONJUNCTS.length})
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabItem,
                  activeTab === 'vowels' && styles.activeTabItem,
                ]}
                onPress={() => setActiveTab('vowels')}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    activeTab === 'vowels' && styles.activeTabText,
                  ]}
                >
                  স্বরবর্ণ ({BIJOY_VOWELS.length})
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabItem,
                  activeTab === 'consonants' && styles.activeTabItem,
                ]}
                onPress={() => setActiveTab('consonants')}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    activeTab === 'consonants' && styles.activeTabText,
                  ]}
                >
                  ব্যঞ্জনবর্ণ ({BIJOY_CONSONANTS.length})
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabItem,
                  activeTab === 'kars' && styles.activeTabItem,
                ]}
                onPress={() => setActiveTab('kars')}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    activeTab === 'kars' && styles.activeTabText,
                  ]}
                >
                  কার ও চিহ্ন ({BIJOY_KARS.length})
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Search Field */}
          {activeTab !== 'visual' && (
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                  borderColor: isDark ? '#334155' : '#CBD5E1',
                },
              ]}
            >
              <Ionicons name="search" size={16} color={isDark ? '#94A3B8' : '#64748B'} style={{ marginRight: 8 }} />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: isDark ? '#F8FAFC' : '#0F172A' },
                ]}
                placeholder={getSearchPlaceholder()}
                placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#EF4444" />
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          {/* Main Content Area */}
          <View style={styles.content}>
            {activeTab === 'visual' && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.visualBanner}>
                  <Ionicons name="information-circle-outline" size={16} color="#2563EB" />
                  <ThemedText style={styles.visualBannerText}>
                    কীবোর্ডের যেকোনো বোতামে ট্যাপ করে টেক্সটে সরাসরি যুক্ত করতে পারেন:
                  </ThemedText>
                </View>
                <BijoyVisualKeyboard
                  mobileCompatMode={mobileCompatMode}
                  onKeyClick={(char) => {
                    if (onSelectCharacter) onSelectCharacter(char);
                  }}
                />
              </ScrollView>
            )}

            {activeTab === 'conjuncts' && (
              <FlatList
                data={filteredConjuncts}
                keyExtractor={(item, index) => item.char + index}
                renderItem={renderKeyItem}
                contentContainerStyle={styles.listContent}
                numColumns={2}
                columnWrapperStyle={styles.rowWrapper}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={32} color="#94A3B8" />
                    <ThemedText style={styles.emptyText}>
                      কোন যুক্তবর্ণ পাওয়া যায়নি
                    </ThemedText>
                  </View>
                }
              />
            )}

            {activeTab === 'vowels' && (
              <FlatList
                data={filteredVowels}
                keyExtractor={(item) => item.char}
                renderItem={renderKeyItem}
                contentContainerStyle={styles.listContent}
                numColumns={2}
                columnWrapperStyle={styles.rowWrapper}
                ListHeaderComponent={
                  <View style={styles.vowelRuleBanner}>
                    <MaterialCommunityIcons name="lightbulb-on" size={16} color="#2563EB" />
                    <ThemedText style={styles.vowelRuleText}>
                      স্বরবর্ণের সূত্র: G (হসন্ত) + সংশ্লিষ্ট কার (যেমন: G + D = ই, G + S = উ)। শুধু 'অ' হলো Shift+F এবং 'ও' হলো X।
                    </ThemedText>
                  </View>
                }
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={32} color="#94A3B8" />
                    <ThemedText style={styles.emptyText}>কোন স্বরবর্ণ পাওয়া যায়নি</ThemedText>
                  </View>
                }
              />
            )}

            {activeTab === 'consonants' && (
              <FlatList
                data={filteredConsonants}
                keyExtractor={(item) => item.char}
                renderItem={renderKeyItem}
                contentContainerStyle={styles.listContent}
                numColumns={2}
                columnWrapperStyle={styles.rowWrapper}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={32} color="#94A3B8" />
                    <ThemedText style={styles.emptyText}>কোন ব্যঞ্জনবর্ণ পাওয়া যায়নি</ThemedText>
                  </View>
                }
              />
            )}

            {activeTab === 'kars' && (
              <FlatList
                data={filteredKars}
                keyExtractor={(item) => item.char}
                renderItem={renderKeyItem}
                contentContainerStyle={styles.listContent}
                numColumns={2}
                columnWrapperStyle={styles.rowWrapper}
                ListHeaderComponent={
                  <View style={styles.vowelRuleBanner}>
                    <MaterialCommunityIcons name="information" size={16} color="#2563EB" />
                    <ThemedText style={styles.vowelRuleText}>
                      প্রি-কার (ি, ে, ৈ) টাইপ করার স্বাভাবিক নিয়মে আগে কার এবং তারপর ব্যঞ্জনবর্ণ টাইপ করবেন (যেমন: C + J = কে, D + J = কি)।
                    </ThemedText>
                  </View>
                }
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={32} color="#94A3B8" />
                    <ThemedText style={styles.emptyText}>কোন কার বা চিহ্ন পাওয়া যায়নি</ThemedText>
                  </View>
                }
              />
            )}
          </View>
        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    opacity: 0.65,
    marginTop: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  tabScrollContent: {
    gap: 6,
    paddingVertical: 2,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  },
  activeTabItem: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  activeTabText: {
    color: '#FFFFFF',
    opacity: 1,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    padding: 0,
  },
  visualBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  visualBannerText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  vowelRuleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  vowelRuleText: {
    fontSize: 11.5,
    color: '#2563EB',
    fontWeight: '600',
    flex: 1,
    lineHeight: 17,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  charBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  charText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  infoBox: {
    flex: 1,
  },
  charName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  keyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginVertical: 2,
  },
  keyText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#D97706',
  },
  exampleText: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 2,
  },
  exampleHighlight: {
    fontWeight: '700',
    opacity: 0.9,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    opacity: 0.6,
  },
});
