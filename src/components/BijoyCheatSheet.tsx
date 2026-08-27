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

  const filteredConjuncts = useMemo(() => {
    if (!searchQuery.trim()) return BIJOY_CONJUNCTS;
    const q = searchQuery.toLowerCase().trim();
    return BIJOY_CONJUNCTS.filter(
      (item) =>
        item.char.includes(q) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        item.keys.toLowerCase().includes(q) ||
        (item.example && item.example.includes(q))
    );
  }, [searchQuery]);

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
          <ThemedText style={styles.charName}>{item.name}</ThemedText>
        ) : null}
        <View style={styles.keyBadge}>
          <Feather name="command" size={10} color="#D97706" style={{ marginRight: 3 }} />
          <ThemedText style={styles.keyText}>{item.keys}</ThemedText>
        </View>
        {item.example ? (
          <ThemedText style={styles.exampleText}>
            যেমন: <ThemedText style={styles.exampleHighlight}>{item.example}</ThemedText>
          </ThemedText>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
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
                স্বরবর্ণ
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
                ব্যঞ্জনবর্ণ
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
                কার ও চিহ্ন
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Search Field for Conjuncts */}
        {activeTab === 'conjuncts' && (
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
              placeholder="যুক্তবর্ণ, কী (যেমন: J+G+K) বা শব্দ দিয়ে খুঁজুন..."
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
              data={BIJOY_VOWELS}
              keyExtractor={(item) => item.char}
              renderItem={renderKeyItem}
              contentContainerStyle={styles.listContent}
              numColumns={2}
              columnWrapperStyle={styles.rowWrapper}
            />
          )}

          {activeTab === 'consonants' && (
            <FlatList
              data={BIJOY_CONSONANTS}
              keyExtractor={(item) => item.char}
              renderItem={renderKeyItem}
              contentContainerStyle={styles.listContent}
              numColumns={2}
              columnWrapperStyle={styles.rowWrapper}
            />
          )}

          {activeTab === 'kars' && (
            <FlatList
              data={BIJOY_KARS}
              keyExtractor={(item) => item.char}
              renderItem={renderKeyItem}
              contentContainerStyle={styles.listContent}
              numColumns={2}
              columnWrapperStyle={styles.rowWrapper}
            />
          )}
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    opacity: 0.65,
    marginTop: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  tabScrollContent: {
    gap: 6,
    paddingVertical: 2,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 116, 139, 0.12)',
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
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
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
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  charBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  charText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  infoBox: {
    flex: 1,
  },
  charName: {
    fontSize: 11,
    opacity: 0.8,
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
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    fontFamily: 'monospace',
  },
  exampleText: {
    fontSize: 10,
    opacity: 0.65,
    marginTop: 2,
  },
  exampleHighlight: {
    fontWeight: 'bold',
    color: '#059669',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    opacity: 0.6,
  },
});
