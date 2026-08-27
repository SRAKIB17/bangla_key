import React, { useState, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useColorScheme,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { ThemedText } from './themed-text';

interface BijoyHelpModalProps {
  visible: boolean;
  onClose: () => void;
}

type HelpTab = 'quickstart' | 'mobile_keys' | 'vowels_kars' | 'conjuncts' | 'words' | 'shortcuts';

interface WordExample {
  word: string;
  meaning?: string;
  keystrokes: string[];
  explanation: string;
}

const COMMON_WORD_EXAMPLES: WordExample[] = [
  {
    word: 'বাংলাদেশ',
    keystrokes: ['h', 'f', 'Shift+Q', 'l', 'c', 'Shift+M'],
    explanation: 'ব (h) + া (f) + ং (Shift+Q) + দ (l) + ে (c) + শ (Shift+M)',
  },
  {
    word: 'বিশ্ববিদ্যালয়',
    keystrokes: ['d', 'h', 'Shift+M', 'g', 'h', 'd', 'l', 'Shift+Z', 'f', 'l', 'Shift+W'],
    explanation: 'ি (d) + ব (h) + শ (Shift+M) + ্ (g) + ব (h) + ি (d) + দ (l) + ্য (Shift+Z) + া (f) + ল (V) + য় (Shift+W)',
  },
  {
    word: 'দুঃখ',
    keystrokes: ['l', 's', '/', 'Shift+J'],
    explanation: 'দ (l) + ু (s) + ঃ ( / বা | ) + খ (Shift+J)',
  },
  {
    word: 'উৎসব',
    keystrokes: ['g', 's', '?', 'n', 'h'],
    explanation: 'উ (g+s) + ৎ ( ? বা \\ ) + স (n) + ব (h)',
  },
  {
    word: 'পরীক্ষা',
    keystrokes: ['r', 'v', 'Shift+D', 'j', 'g', 'Shift+N', 'f'],
    explanation: 'প (r) + র (v) + ী (Shift+D) + ক (j) + ্ (g) + ষ (Shift+N) + া (f)',
  },
  {
    word: 'স্বাধীনতা',
    keystrokes: ['n', 'g', 'h', 'f', 'L', 'Shift+D', 'b', 'k', 'f'],
    explanation: 'স (n) + ্ (g) + ব (h) + া (f) + ধ (Shift+L) + ী (Shift+D) + ন (b) + ত (k) + া (f)',
  },
  {
    word: 'ডাক্তার',
    keystrokes: ['e', 'f', 'j', 'g', 'k', 'f', 'v'],
    explanation: 'ড (e) + া (f) + ক (j) + ্ (g) + ত (k) + া (f) + র (v)',
  },
];

export function BijoyHelpModal({ visible, onClose }: BijoyHelpModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<HelpTab>('quickstart');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return COMMON_WORD_EXAMPLES;
    const q = searchQuery.toLowerCase().trim();
    return COMMON_WORD_EXAMPLES.filter(
      (item) =>
        item.word.includes(q) ||
        item.explanation.toLowerCase().includes(q) ||
        item.keystrokes.some((k) => k.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          {/* Header Bar */}
          <View
            style={[
              styles.header,
              {
                borderBottomColor: isDark ? '#1E293B' : '#F1F5F9',
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              },
            ]}
          >
            <View style={styles.headerTitleRow}>
              <View style={styles.helpIconBadge}>
                <Ionicons name="help-buoy" size={20} color="#FFFFFF" />
              </View>
              <View>
                <ThemedText style={styles.headerTitle}>বিজয় বাংলা টাইপিং গাইড</ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                  সহজ নিয়ম, কী-শর্টকাট ও উদাহরণ
                </ThemedText>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.closeButton,
                { backgroundColor: isDark ? '#334155' : '#E2E8F0' },
              ]}
              onPress={onClose}
            >
              <Ionicons name="close" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>
          </View>

          {/* Navigation Category Tabs */}
          <View style={styles.tabScrollContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabScrollContent}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabBtn,
                  activeTab === 'quickstart' && styles.activeTabBtn,
                  { borderColor: isDark ? '#334155' : '#E2E8F0' },
                ]}
                onPress={() => setActiveTab('quickstart')}
              >
                <Ionicons
                  name="flash-outline"
                  size={14}
                  color={activeTab === 'quickstart' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                />
                <ThemedText
                  style={[
                    styles.tabBtnText,
                    activeTab === 'quickstart' && styles.activeTabBtnText,
                  ]}
                >
                  শুরু করার নিয়ম
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabBtn,
                  activeTab === 'mobile_keys' && styles.activeTabBtn,
                  { borderColor: isDark ? '#334155' : '#E2E8F0' },
                ]}
                onPress={() => setActiveTab('mobile_keys')}
              >
                <MaterialCommunityIcons
                  name="cellphone-cog"
                  size={14}
                  color={activeTab === 'mobile_keys' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                />
                <ThemedText
                  style={[
                    styles.tabBtnText,
                    activeTab === 'mobile_keys' && styles.activeTabBtnText,
                  ]}
                >
                  ৎ ও ঃ (মোবাইল / পিসি)
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabBtn,
                  activeTab === 'vowels_kars' && styles.activeTabBtn,
                  { borderColor: isDark ? '#334155' : '#E2E8F0' },
                ]}
                onPress={() => setActiveTab('vowels_kars')}
              >
                <MaterialCommunityIcons
                  name="format-letter-case"
                  size={14}
                  color={activeTab === 'vowels_kars' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                />
                <ThemedText
                  style={[
                    styles.tabBtnText,
                    activeTab === 'vowels_kars' && styles.activeTabBtnText,
                  ]}
                >
                  স্বরবর্ণ ও কার
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabBtn,
                  activeTab === 'conjuncts' && styles.activeTabBtn,
                  { borderColor: isDark ? '#334155' : '#E2E8F0' },
                ]}
                onPress={() => setActiveTab('conjuncts')}
              >
                <Ionicons
                  name="link-outline"
                  size={14}
                  color={activeTab === 'conjuncts' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                />
                <ThemedText
                  style={[
                    styles.tabBtnText,
                    activeTab === 'conjuncts' && styles.activeTabBtnText,
                  ]}
                >
                  যুক্তবর্ণ ও ফলা
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabBtn,
                  activeTab === 'words' && styles.activeTabBtn,
                  { borderColor: isDark ? '#334155' : '#E2E8F0' },
                ]}
                onPress={() => setActiveTab('words')}
              >
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={14}
                  color={activeTab === 'words' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                />
                <ThemedText
                  style={[
                    styles.tabBtnText,
                    activeTab === 'words' && styles.activeTabBtnText,
                  ]}
                >
                  শব্দের উদাহরণ
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabBtn,
                  activeTab === 'shortcuts' && styles.activeTabBtn,
                  { borderColor: isDark ? '#334155' : '#E2E8F0' },
                ]}
                onPress={() => setActiveTab('shortcuts')}
              >
                <Ionicons
                  name="key-outline"
                  size={14}
                  color={activeTab === 'shortcuts' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                />
                <ThemedText
                  style={[
                    styles.tabBtnText,
                    activeTab === 'shortcuts' && styles.activeTabBtnText,
                  ]}
                >
                  শর্টকাট ও টিপস
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Content Area */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* TAB 1: QUICK START */}
            {activeTab === 'quickstart' && (
              <View style={styles.sectionContainer}>
                {/* Step 1 Card */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={styles.stepBadgeRow}>
                    <View style={[styles.stepNumberBadge, { backgroundColor: '#2563EB' }]}>
                      <ThemedText style={styles.stepNumberText}>১</ThemedText>
                    </View>
                    <ThemedText style={styles.cardTitle}>OTG / ব্লুটুথ কিবোর্ড অথবা টাচ স্ক্রিন</ThemedText>
                  </View>
                  <ThemedText style={styles.cardParagraph}>
                    মোবাইলে OTG কনভার্টার দিয়ে যেকোনো স্ট্যান্ডার্ড USB কিবোর্ড অথবা ব্লুটুথ কিবোর্ড যুক্ত করে কম্পিউটারের মতো ফুল স্পিডে টাইপ করতে পারবেন।
                  </ThemedText>
                  <View style={styles.tipBox}>
                    <Ionicons name="information-circle" size={16} color="#2563EB" />
                    <ThemedText style={styles.tipText}>
                      ফিজিক্যাল কিবোর্ড দিয়ে লেখার সময় স্ক্রিনের সফট কিবোর্ড লুকানোর জন্য <ThemedText style={{ fontWeight: '700' }}>'OTG মোড'</ThemedText> বাটনে চাপুন।
                    </ThemedText>
                  </View>
                </View>

                {/* Step 2 Card */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={styles.stepBadgeRow}>
                    <View style={[styles.stepNumberBadge, { backgroundColor: '#10B981' }]}>
                      <ThemedText style={styles.stepNumberText}>২</ThemedText>
                    </View>
                    <ThemedText style={styles.cardTitle}>বিজয় মোড ও ইংলিশ মোড</ThemedText>
                  </View>
                  <ThemedText style={styles.cardParagraph}>
                    উপরে বামে <ThemedText style={{ fontWeight: '700' }}>[বিজয় মোড]</ThemedText> ও <ThemedText style={{ fontWeight: '700' }}>[English]</ThemedText> সুইচ রয়েছে। বিজয় মোড চালু থাকলে কিবোর্ডের ইংরেজি বোতাম চাপলেই স্বয়ংক্রিয়ভাবে ইউনিকোড বাংলা অক্ষরে রূপান্তর হবে।
                  </ThemedText>
                </View>

                {/* Step 3 Card */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={styles.stepBadgeRow}>
                    <View style={[styles.stepNumberBadge, { backgroundColor: '#8B5CF6' }]}>
                      <ThemedText style={styles.stepNumberText}>৩</ThemedText>
                    </View>
                    <ThemedText style={styles.cardTitle}>ফুলস্ক্রিন ল্যান্ডস্কেপ টাইপিং</ThemedText>
                  </View>
                  <ThemedText style={styles.cardParagraph}>
                    উপরে ডানের <ThemedText style={{ fontWeight: '700' }}>রোটেট বাটন</ThemedText> চাপলে অ্যাপটি ল্যান্ডস্কেপ মোডে চলে যাবে এবং পুরো স্ক্রিন জুড়ে কম্পিউটার টাইপরাইটারের মতো চমৎকার ভিউ পাবেন।
                  </ThemedText>
                </View>
              </View>
            )}

            {/* TAB 2: MOBILE VS PC KEYS */}
            {activeTab === 'mobile_keys' && (
              <View style={styles.sectionContainer}>
                <View style={styles.bannerAlert}>
                  <MaterialCommunityIcons name="lightbulb-on" size={18} color="#D97706" />
                  <ThemedText style={styles.bannerAlertText}>
                    অ্যান্ড্রয়েড মোবাইলের কীবোর্ডে <ThemedText style={{ fontWeight: '700' }}>\</ThemedText> ও <ThemedText style={{ fontWeight: '700' }}>|</ThemedText> কি খুঁজে পেতে সমস্যা হলে <ThemedText style={{ fontWeight: '700' }}>/ এবং ?</ThemedText> দিয়ে খুব সহজেই <ThemedText style={{ fontWeight: '700' }}>ঃ ও ৎ</ThemedText> লেখা যায়।
                  </ThemedText>
                </View>

                {/* Mobile Mode Box */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <ThemedText style={styles.cardTitle}>📱 মোবাইল মোডে শর্টকাট (ডিফল্ট সক্রিয়):</ThemedText>
                  
                  <View style={styles.keyExampleRow}>
                    <View style={styles.keyCapMini}><ThemedText style={styles.keyCapEng}>/</ThemedText></View>
                    <ThemedText style={styles.keyResultArrow}>➔</ThemedText>
                    <ThemedText style={styles.keyResultChar}>ঃ (বিসর্গ)</ThemedText>
                    <ThemedText style={styles.keyNote}>যেমন: দুঃখ ( l + s + / + Shift+J )</ThemedText>
                  </View>

                  <View style={styles.keyExampleRow}>
                    <View style={styles.keyCapMini}><ThemedText style={styles.keyCapEng}>? বা Shift + /</ThemedText></View>
                    <ThemedText style={styles.keyResultArrow}>➔</ThemedText>
                    <ThemedText style={styles.keyResultChar}>ৎ (খণ্ড-ত)</ThemedText>
                    <ThemedText style={styles.keyNote}>যেমন: উৎসব ( g+s + ? + n + h )</ThemedText>
                  </View>
                </View>

                {/* Desktop Mode Box */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <ThemedText style={styles.cardTitle}>💻 ডেস্কটপ / পিসির ফিজিক্যাল কিবোর্ডে:</ThemedText>
                  
                  <View style={styles.keyExampleRow}>
                    <View style={styles.keyCapMini}><ThemedText style={styles.keyCapEng}>\</ThemedText></View>
                    <ThemedText style={styles.keyResultArrow}>➔</ThemedText>
                    <ThemedText style={styles.keyResultChar}>ৎ (খণ্ড-ত)</ThemedText>
                    <ThemedText style={styles.keyNote}>স্বাভাবিক ব্যাকস্ল্যাশ কী</ThemedText>
                  </View>

                  <View style={styles.keyExampleRow}>
                    <View style={styles.keyCapMini}><ThemedText style={styles.keyCapEng}>| বা Shift + \</ThemedText></View>
                    <ThemedText style={styles.keyResultArrow}>➔</ThemedText>
                    <ThemedText style={styles.keyResultChar}>ঃ (বিসর্গ)</ThemedText>
                    <ThemedText style={styles.keyNote}>শিফট চেপে ব্যাকস্ল্যাশ</ThemedText>
                  </View>
                </View>

                {/* Quick Chips Tip */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#172554' : '#EFF6FF',
                      borderColor: '#3B82F6',
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <MaterialCommunityIcons name="gesture-tap" size={18} color="#2563EB" />
                    <ThemedText style={[styles.cardTitle, { color: '#2563EB', marginBottom: 0 }]}>
                      কুইক সিম্বল বার (১ ট্যাপ ইনপুট)
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.cardParagraph}>
                    যেকোনো জটিল চিহ্নের জন্য কিবোর্ডের উপরে থাকা <ThemedText style={{ fontWeight: '700' }}>[ ৎ ] [ ঃ ] [ । ] [ ৳ ] [ ঁ ]</ThemedText> বাটনগুলোতে স্পর্শ করলেই সরাসরি লেখা হয়ে যায়।
                  </ThemedText>
                </View>
              </View>
            )}

            {/* TAB 3: VOWELS & KARS */}
            {activeTab === 'vowels_kars' && (
              <View style={styles.sectionContainer}>
                {/* Vowels Table */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <ThemedText style={styles.cardTitle}>স্বরবর্ণ লেখার নিয়ম (G + Vowel Key)</ThemedText>
                  <ThemedText style={styles.cardParagraph}>
                    প্রথমে <ThemedText style={{ fontWeight: '700', color: '#2563EB' }}>G (হসন্ত)</ThemedText> চেপে তারপর নির্দিষ্ট কার বা কি চাপুন:
                  </ThemedText>

                  <View style={styles.tableGrid}>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>অ</ThemedText>
                      <ThemedText style={styles.tableColKey}>Shift + F</ThemedText>
                      <ThemedText style={styles.tableColDesc}>সরাসরি Shift + F</ThemedText>
                    </View>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>আ</ThemedText>
                      <ThemedText style={styles.tableColKey}>G + F</ThemedText>
                      <ThemedText style={styles.tableColDesc}>G চেপে F</ThemedText>
                    </View>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>ই</ThemedText>
                      <ThemedText style={styles.tableColKey}>G + D</ThemedText>
                      <ThemedText style={styles.tableColDesc}>G চেপে D</ThemedText>
                    </View>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>ঈ</ThemedText>
                      <ThemedText style={styles.tableColKey}>G + Shift + D</ThemedText>
                      <ThemedText style={styles.tableColDesc}>G চেপে Shift + D</ThemedText>
                    </View>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>উ</ThemedText>
                      <ThemedText style={styles.tableColKey}>G + S</ThemedText>
                      <ThemedText style={styles.tableColDesc}>G চেপে S</ThemedText>
                    </View>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>ঊ</ThemedText>
                      <ThemedText style={styles.tableColKey}>G + Shift + S</ThemedText>
                      <ThemedText style={styles.tableColDesc}>G চেপে Shift + S</ThemedText>
                    </View>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>ঋ</ThemedText>
                      <ThemedText style={styles.tableColKey}>G + A</ThemedText>
                      <ThemedText style={styles.tableColDesc}>G চেপে A</ThemedText>
                    </View>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>এ</ThemedText>
                      <ThemedText style={styles.tableColKey}>G + C</ThemedText>
                      <ThemedText style={styles.tableColDesc}>G চেপে C</ThemedText>
                    </View>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>ঐ</ThemedText>
                      <ThemedText style={styles.tableColKey}>G + Shift + C</ThemedText>
                      <ThemedText style={styles.tableColDesc}>G চেপে Shift + C</ThemedText>
                    </View>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>ও</ThemedText>
                      <ThemedText style={styles.tableColKey}>X</ThemedText>
                      <ThemedText style={styles.tableColDesc}>সরাসরি X কী</ThemedText>
                    </View>
                    <View style={styles.tableRow}>
                      <ThemedText style={styles.tableColChar}>ঔ</ThemedText>
                      <ThemedText style={styles.tableColKey}>G + Shift + X</ThemedText>
                      <ThemedText style={styles.tableColDesc}>G চেপে Shift + X</ThemedText>
                    </View>
                  </View>
                </View>

                {/* Pre-kar rule */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <ThemedText style={styles.cardTitle}>স্মার্ট প্রি-কার (ে, ৈ, ি) নিয়ম</ThemedText>
                  <ThemedText style={styles.cardParagraph}>
                    বাংলা লেখার স্বাভাবিক নিয়মে আগে কার তারপর ব্যঞ্জনবর্ণ টাইপ করবেন:
                  </ThemedText>
                  <View style={styles.formulaRow}>
                    <ThemedText style={styles.formulaText}>
                      • <ThemedText style={{ color: '#2563EB', fontWeight: '800' }}>C (ে)</ThemedText> + <ThemedText style={{ color: '#10B981', fontWeight: '800' }}>j (ক)</ThemedText> = <ThemedText style={{ fontWeight: '800' }}>কে</ThemedText>
                    </ThemedText>
                  </View>
                  <View style={styles.formulaRow}>
                    <ThemedText style={styles.formulaText}>
                      • <ThemedText style={{ color: '#2563EB', fontWeight: '800' }}>d (ি)</ThemedText> + <ThemedText style={{ color: '#10B981', fontWeight: '800' }}>h (ব)</ThemedText> = <ThemedText style={{ fontWeight: '800' }}>বি</ThemedText>
                    </ThemedText>
                  </View>
                  <View style={styles.formulaRow}>
                    <ThemedText style={styles.formulaText}>
                      • <ThemedText style={{ color: '#2563EB', fontWeight: '800' }}>c (ে)</ThemedText> + <ThemedText style={{ color: '#10B981', fontWeight: '800' }}>j (ক)</ThemedText> + <ThemedText style={{ color: '#F59E0B', fontWeight: '800' }}>f (া)</ThemedText> = <ThemedText style={{ fontWeight: '800' }}>কো</ThemedText> (অথবা j + x = কো)
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}

            {/* TAB 4: CONJUNCTS & PHALA */}
            {activeTab === 'conjuncts' && (
              <View style={styles.sectionContainer}>
                {/* Conjunct Rule Card */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <ThemedText style={styles.cardTitle}>যুক্তবর্ণের মূল সূত্র: (১ম বর্ণ + G + ২য় বর্ণ)</ThemedText>
                  <ThemedText style={styles.cardParagraph}>
                    যেকোনো যুক্তবর্ণের ক্ষেত্রে প্রথম বর্ণের পর <ThemedText style={{ fontWeight: '700', color: '#2563EB' }}>G (হসন্ত)</ThemedText> চেপে দ্বিতীয় বর্ণ দিন:
                  </ThemedText>

                  <View style={styles.conjunctBox}>
                    <ThemedText style={styles.conjunctRowText}>
                      • <ThemedText style={{ fontWeight: '800', color: '#2563EB' }}>ক্ত</ThemedText> = j + g + k ( ক + ্ + ত )
                    </ThemedText>
                    <ThemedText style={styles.conjunctRowText}>
                      • <ThemedText style={{ fontWeight: '800', color: '#2563EB' }}>ক্ষ</ThemedText> = j + g + Shift+N ( ক + ্ + ষ )
                    </ThemedText>
                    <ThemedText style={styles.conjunctRowText}>
                      • <ThemedText style={{ fontWeight: '800', color: '#2563EB' }}>জ্ঞ</ThemedText> = u + g + Shift+I ( জ + ্ + ঞ )
                    </ThemedText>
                    <ThemedText style={styles.conjunctRowText}>
                      • <ThemedText style={{ fontWeight: '800', color: '#2563EB' }}>ঞ্চ</ThemedText> = Shift+I + g + y ( ঞ + ্ + চ )
                    </ThemedText>
                    <ThemedText style={styles.conjunctRowText}>
                      • <ThemedText style={{ fontWeight: '800', color: '#2563EB' }}>স্ট</ThemedText> = n + g + t ( স + ্ + ট )
                    </ThemedText>
                    <ThemedText style={styles.conjunctRowText}>
                      • <ThemedText style={{ fontWeight: '800', color: '#2563EB' }}>ঙ্গ</ThemedText> = q + g + o ( ঙ + ্ + গ )
                    </ThemedText>
                  </View>
                </View>

                {/* Phala Rules Card */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <ThemedText style={styles.cardTitle}>ফলা ও রেফ লেখার নিয়ম</ThemedText>
                  
                  <View style={styles.keyExampleRow}>
                    <View style={styles.keyCapMini}><ThemedText style={styles.keyCapEng}>z</ThemedText></View>
                    <ThemedText style={styles.keyResultArrow}>➔</ThemedText>
                    <ThemedText style={styles.keyResultChar}>র-ফলা ( ্র )</ThemedText>
                    <ThemedText style={styles.keyNote}>যেমন: চক্র ( y + j + z )</ThemedText>
                  </View>

                  <View style={styles.keyExampleRow}>
                    <View style={styles.keyCapMini}><ThemedText style={styles.keyCapEng}>Shift + Z</ThemedText></View>
                    <ThemedText style={styles.keyResultArrow}>➔</ThemedText>
                    <ThemedText style={styles.keyResultChar}>য-ফলা ( ্য )</ThemedText>
                    <ThemedText style={styles.keyNote}>যেমন: বাক্য ( h + f + j + Shift+Z )</ThemedText>
                  </View>

                  <View style={styles.keyExampleRow}>
                    <View style={styles.keyCapMini}><ThemedText style={styles.keyCapEng}>Shift + A</ThemedText></View>
                    <ThemedText style={styles.keyResultArrow}>➔</ThemedText>
                    <ThemedText style={styles.keyResultChar}>রেফ ( র্ )</ThemedText>
                    <ThemedText style={styles.keyNote}>আগে রেফ দিন: Shift+A + k = র্ত</ThemedText>
                  </View>
                </View>
              </View>
            )}

            {/* TAB 5: WORD EXAMPLES */}
            {activeTab === 'words' && (
              <View style={styles.sectionContainer}>
                {/* Search Bar */}
                <View
                  style={[
                    styles.searchBar,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                      borderColor: isDark ? '#334155' : '#CBD5E1',
                    },
                  ]}
                >
                  <Ionicons name="search" size={16} color={isDark ? '#94A3B8' : '#64748B'} />
                  <TextInput
                    style={[
                      styles.searchInput,
                      { color: isDark ? '#F8FAFC' : '#0F172A' },
                    ]}
                    placeholder="শব্দ দিয়ে খুঁজুন (যেমন: বাংলাদেশ, পরীক্ষা)..."
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

                {filteredWords.map((item) => (
                  <View
                    key={item.word}
                    style={[
                      styles.wordCard,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                        borderColor: isDark ? '#334155' : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.wordHeader}>
                      <ThemedText style={styles.wordTitle}>{item.word}</ThemedText>
                    </View>

                    <View style={styles.wordKeycapsRow}>
                      {item.keystrokes.map((key, i) => (
                        <View key={i} style={styles.keystrokeBadge}>
                          <ThemedText style={styles.keystrokeBadgeText}>{key}</ThemedText>
                        </View>
                      ))}
                    </View>

                    <ThemedText style={styles.wordExplanation}>
                      {item.explanation}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}

            {/* TAB 6: SHORTCUTS & PRO TIPS */}
            {activeTab === 'shortcuts' && (
              <View style={styles.sectionContainer}>
                {/* 1. History & Editing Shortcuts */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Ionicons name="flash" size={16} color="#2563EB" />
                    <ThemedText style={[styles.cardTitle, { marginBottom: 0, color: '#2563EB' }]}>
                      ১. হিস্ট্রি ও এডিটিং শর্টকাট (Ctrl + / Ctrl + Shift +)
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Ctrl + Z</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>Undo (আনডু):</ThemedText> ভুল হলে পূর্বের লেখায় ফিরুন
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Ctrl + Shift + Z</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>Redo (রিডু):</ThemedText> আনডু বাতিল করে সামনে এগোন
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Ctrl + A</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>Select All:</ThemedText> পুরো লেখা একসাথে নির্বাচন
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Ctrl + C</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>Copy:</ThemedText> নির্বাচিত লেখা কপি করা
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Ctrl + V</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>Paste:</ThemedText> কপি করা লেখা পেস্ট করা
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Ctrl + X</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>Cut:</ThemedText> নির্বাচিত লেখা কেটে নেওয়া
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Ctrl + Backspace</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>কার্সরের আগের পুরো শব্দ একসাথে মুছুন</ThemedText>
                  </View>
                </View>

                {/* 2. Bangla Symbols & Signs */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <MaterialCommunityIcons name="format-quote-close" size={16} color="#10B981" />
                    <ThemedText style={[styles.cardTitle, { marginBottom: 0, color: '#10B981' }]}>
                      ২. বাংলা বিশেষ চিহ্ন ও যতিচিহ্ন
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Shift + G</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>দাঁড়ি ( । )</ThemedText> — বাক্য সমাপ্তি চিহ্ন
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Shift + 4 (বা $)</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>টাকা চিহ্ন ( ৳ )</ThemedText>
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Shift + 7 (বা & / ~)</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>চন্দ্রবিন্দু ( ঁ )</ThemedText>
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>/ (বা Shift + \)</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>বিসর্গ ( ঃ )</ThemedText> (মোবাইলে / এবং পিসিতে | )
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>? (বা \)</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>খণ্ড-ত ( ৎ )</ThemedText> (মোবাইলে ? এবং পিসিতে \ )
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Shift + A</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>রেফ ( র্ )</ThemedText> (বর্ণের পূর্বে চাপুন)
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>z / Shift + Z</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>
                      <ThemedText style={{ fontWeight: '700' }}>র-ফলা ( ্র ) ও য-ফলা ( ্য )</ThemedText>
                    </ThemedText>
                  </View>
                </View>

                {/* 3. Navigation & Selection */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Ionicons name="navigate-outline" size={16} color="#8B5CF6" />
                    <ThemedText style={[styles.cardTitle, { marginBottom: 0, color: '#8B5CF6' }]}>
                      ৩. দ্রুত নেভিগেশন ও শব্দ নির্বাচন
                    </ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Ctrl + Shift + ← / →</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>পুরো একটি শব্দ সিলেক্ট করতে করতে যান</ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Shift + ← / →</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>একটি একটি করে অক্ষর সিলেক্ট করুন</ThemedText>
                  </View>

                  <View style={styles.shortcutRow}>
                    <ThemedText style={styles.shortcutKey}>Home / End</ThemedText>
                    <ThemedText style={styles.shortcutDesc}>লাইনের একদম শুরুতে বা শেষে যান</ThemedText>
                  </View>
                </View>

                {/* 4. App Features Tip */}
                <View
                  style={[
                    styles.guideCard,
                    {
                      backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
                      borderColor: '#10B981',
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Ionicons name="sparkles" size={18} color="#10B981" />
                    <ThemedText style={[styles.cardTitle, { color: '#059669', marginBottom: 0 }]}>
                      এক ক্লিকে কপি ও শেয়ার
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.cardParagraph}>
                    টাইপিং শেষ হলে নিচের বার থেকে <ThemedText style={{ fontWeight: '700' }}>'কপি'</ThemedText> বা <ThemedText style={{ fontWeight: '700' }}>'শেয়ার'</ThemedText> বাটনে চাপ দিয়ে যেকোনো মেসেঞ্জার, হোয়াটসঅ্যাপ বা নোটে সরাসরি পেস্ট করে পাঠিয়ে দিন।
                  </ThemedText>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Action */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: isDark ? '#1E293B' : '#F1F5F9',
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.gotItButton}
              onPress={onClose}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
              <ThemedText style={styles.gotItButtonText}>বুঝেছি, টাইপিং শুরু করি</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  modalContent: {
    width: '100%',
    maxWidth: 620,
    maxHeight: '88%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  helpIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
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
  tabScrollContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  tabScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeTabBtn: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionContainer: {
    gap: 12,
  },
  guideCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  stepBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardParagraph: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.85,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  tipText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
    color: '#2563EB',
  },
  bannerAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
  },
  bannerAlertText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
    color: '#B45309',
  },
  keyExampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  keyCapMini: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#0F172A',
  },
  keyCapEng: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  keyResultArrow: {
    fontSize: 13,
    opacity: 0.5,
  },
  keyResultChar: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  keyNote: {
    fontSize: 11,
    opacity: 0.6,
    marginLeft: 4,
  },
  tableGrid: {
    marginTop: 8,
    gap: 4,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  tableColChar: {
    fontSize: 15,
    fontWeight: '800',
    width: 30,
  },
  tableColKey: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
    flex: 1,
    marginLeft: 10,
  },
  tableColDesc: {
    fontSize: 11,
    opacity: 0.6,
  },
  formulaRow: {
    marginTop: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  formulaText: {
    fontSize: 13,
  },
  conjunctBox: {
    marginTop: 6,
    gap: 6,
  },
  conjunctRowText: {
    fontSize: 13,
    lineHeight: 22,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    marginBottom: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  wordCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  wordKeycapsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 2,
  },
  keystrokeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#0F172A',
  },
  keystrokeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  wordExplanation: {
    fontSize: 12,
    opacity: 0.75,
  },
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  shortcutKey: {
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  shortcutDesc: {
    fontSize: 12,
    opacity: 0.8,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
  },
  gotItButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
  },
  gotItButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
