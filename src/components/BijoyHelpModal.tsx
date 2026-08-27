import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
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

interface BijoyHelpModalProps {
  visible: boolean;
  onClose: () => void;
}

type HelpTab = 'quickstart' | 'mobile_keys';

export function BijoyHelpModal({ visible, onClose }: BijoyHelpModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<HelpTab>('quickstart');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                borderBottomColor: isDark ? '#1E293B' : '#E2E8F0',
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              },
            ]}
          >
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBox}>
                <Ionicons name="help-buoy" size={20} color="#2563EB" />
              </View>
              <View>
                <ThemedText style={styles.headerTitle}>টাইপিং সাহায্য ও গাইড</ThemedText>
                <ThemedText style={styles.headerSubtitle}>সহজ আইকন গাইড</ThemedText>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.closeButton,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
              onPress={onClose}
            >
              <Ionicons name="close" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>
          </View>

          {/* Icon-Based Tab Bar */}
          <View
            style={[
              styles.tabBarWrapper,
              {
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                borderBottomColor: isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            <View
              style={[
                styles.tabTrack,
                { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabButton,
                  activeTab === 'quickstart' && [
                    styles.activeTabButton,
                    { backgroundColor: isDark ? '#2563EB' : '#FFFFFF' },
                  ],
                ]}
                onPress={() => setActiveTab('quickstart')}
              >
                <Ionicons
                  name="flash"
                  size={16}
                  color={
                    activeTab === 'quickstart'
                      ? isDark
                        ? '#FFFFFF'
                        : '#2563EB'
                      : isDark
                      ? '#94A3B8'
                      : '#64748B'
                  }
                />
                <ThemedText
                  style={[
                    styles.tabButtonText,
                    activeTab === 'quickstart' && [
                      styles.activeTabButtonText,
                      { color: isDark ? '#FFFFFF' : '#2563EB' },
                    ],
                  ]}
                >
                  শুরু করার নিয়ম
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabButton,
                  activeTab === 'mobile_keys' && [
                    styles.activeTabButton,
                    { backgroundColor: isDark ? '#2563EB' : '#FFFFFF' },
                  ],
                ]}
                onPress={() => setActiveTab('mobile_keys')}
              >
                <MaterialCommunityIcons
                  name="cellphone-key"
                  size={17}
                  color={
                    activeTab === 'mobile_keys'
                      ? isDark
                        ? '#FFFFFF'
                        : '#2563EB'
                      : isDark
                      ? '#94A3B8'
                      : '#64748B'
                  }
                />
                <ThemedText
                  style={[
                    styles.tabButtonText,
                    activeTab === 'mobile_keys' && [
                      styles.activeTabButtonText,
                      { color: isDark ? '#FFFFFF' : '#2563EB' },
                    ],
                  ]}
                >
                  ৎ ও ঃ শর্টকাট
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* TAB 1: ICON-BASED QUICK START */}
            {activeTab === 'quickstart' && (
              <View style={styles.iconList}>
                {/* Item 1: USB Connection */}
                <View
                  style={[
                    styles.iconCard,
                    {
                      backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={[styles.leadingIcon, { backgroundColor: '#2563EB' }]}>
                    <MaterialCommunityIcons name="usb" size={22} color="#FFFFFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <ThemedText style={styles.itemTitle}>১. কিবোর্ড কানেক্ট করুন</ThemedText>
                    <ThemedText style={styles.itemDesc}>
                      OTG কনভার্টার দিয়ে যেকোনো USB বা ব্লুটুথ কিবোর্ড মোবাইলে লাগান। কোনো বাড়তি অ্যাপ লাগবে না।
                    </ThemedText>
                  </View>
                </View>

                {/* Item 2: Bijoy Mode */}
                <View
                  style={[
                    styles.iconCard,
                    {
                      backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={[styles.leadingIcon, { backgroundColor: '#10B981' }]}>
                    <MaterialCommunityIcons name="keyboard-outline" size={22} color="#FFFFFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <ThemedText style={styles.itemTitle}>২. বিজয় মোডে টাইপ করুন</ThemedText>
                    <ThemedText style={styles.itemDesc}>
                      উপরে [বিজয় মোড] চালু থাকলে ইংরেজি কি চাপলেই স্বয়ংক্রিয়ভাবে বাংলা লেখা হয়ে যাবে।
                    </ThemedText>

                    {/* Mini Chips */}
                    <View style={styles.badgeRow}>
                      <View style={styles.chipPill}>
                        <ThemedText style={styles.chipText}>J ➔ ক</ThemedText>
                      </View>
                      <View style={styles.chipPill}>
                        <ThemedText style={styles.chipText}>Shift+J ➔ খ</ThemedText>
                      </View>
                      <View style={styles.chipPill}>
                        <ThemedText style={styles.chipText}>G+F ➔ আ</ThemedText>
                      </View>
                      <View style={styles.chipPill}>
                        <ThemedText style={styles.chipText}>C+J ➔ কে</ThemedText>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Item 3: Soft Keyboard OTG Toggle */}
                <View
                  style={[
                    styles.iconCard,
                    {
                      backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={[styles.leadingIcon, { backgroundColor: '#F59E0B' }]}>
                    <MaterialCommunityIcons name="cellphone-text" size={22} color="#FFFFFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <ThemedText style={styles.itemTitle}>৩. অন-স্ক্রিন কিবোর্ড লুকানো</ThemedText>
                    <ThemedText style={styles.itemDesc}>
                      ফিজিক্যাল কিবোর্ডে লেখার সময় স্ক্রিনের সফট কিবোর্ড বন্ধ রাখতে উপরের <ThemedText style={{ fontWeight: '700', color: '#10B981' }}>'OTG'</ThemedText> বাটনে চাপুন।
                    </ThemedText>
                  </View>
                </View>

                {/* Item 4: Landscape Fullscreen */}
                <View
                  style={[
                    styles.iconCard,
                    {
                      backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={[styles.leadingIcon, { backgroundColor: '#8B5CF6' }]}>
                    <MaterialCommunityIcons name="phone-rotate-landscape" size={22} color="#FFFFFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <ThemedText style={styles.itemTitle}>৪. ফুলস্ক্রিন ল্যান্ডস্কেপ ভিউ</ThemedText>
                    <ThemedText style={styles.itemDesc}>
                      হেডারের <ThemedText style={{ fontWeight: '700' }}>রোটেট বাটন</ThemedText> চাপলে মোবাইলটি আড়াআড়ি হয়ে কম্পিউটার মনিটরের মতো টাইপরাইটার ভিউ পাবেন।
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}

            {/* TAB 2: ICON-BASED SHORTCUTS */}
            {activeTab === 'mobile_keys' && (
              <View style={styles.iconList}>
                {/* Mobile Section Header Card */}
                <View
                  style={[
                    styles.iconCard,
                    {
                      backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={[styles.leadingIcon, { backgroundColor: '#2563EB' }]}>
                    <Ionicons name="phone-portrait" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.titleWithBadge}>
                      <ThemedText style={styles.itemTitle}>📱 মোবাইল শর্টকাট</ThemedText>
                      <View style={styles.activeTag}>
                        <ThemedText style={styles.activeTagText}>ডিফল্ট অন</ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.itemDesc}>
                      মোবাইলে ব্যাকস্ল্যাশ কী সহজে না থাকায় এই সহজ শর্টকাট রাখা হয়েছে:
                    </ThemedText>

                    {/* Visual Key Rows */}
                    <View style={styles.keyRowBox}>
                      <View style={styles.keyPair}>
                        <View style={styles.keyTag}><ThemedText style={styles.keyTagText}>/</ThemedText></View>
                        <ThemedText style={styles.arrowIcon}>➔</ThemedText>
                        <ThemedText style={styles.outputLetter}>ঃ (বিসর্গ)</ThemedText>
                      </View>
                      <ThemedText style={styles.exampleWord}>যেমন: দুঃখ = l + s + / + Shift+J</ThemedText>
                    </View>

                    <View style={[styles.keyRowBox, { marginTop: 6 }]}>
                      <View style={styles.keyPair}>
                        <View style={styles.keyTag}><ThemedText style={styles.keyTagText}>?</ThemedText></View>
                        <ThemedText style={styles.arrowIcon}>➔</ThemedText>
                        <ThemedText style={styles.outputLetter}>ৎ (খণ্ড-ত)</ThemedText>
                      </View>
                      <ThemedText style={styles.exampleWord}>যেমন: উৎসব = g+s + ? + n + h</ThemedText>
                    </View>
                  </View>
                </View>

                {/* PC Section Card */}
                <View
                  style={[
                    styles.iconCard,
                    {
                      backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={[styles.leadingIcon, { backgroundColor: '#6366F1' }]}>
                    <MaterialCommunityIcons name="laptop" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <ThemedText style={styles.itemTitle}>💻 পিসির কিবোর্ড শর্টকাট</ThemedText>
                    <ThemedText style={styles.itemDesc}>
                      কম্পিউটারের ফিজিক্যাল কিবোর্ড দিয়ে স্ট্যান্ডার্ড টাইপিংয়ের নিয়ম:
                    </ThemedText>

                    <View style={styles.keyRowBox}>
                      <View style={styles.keyPair}>
                        <View style={styles.keyTag}><ThemedText style={styles.keyTagText}>\</ThemedText></View>
                        <ThemedText style={styles.arrowIcon}>➔</ThemedText>
                        <ThemedText style={styles.outputLetter}>ৎ (খণ্ড-ত)</ThemedText>
                      </View>
                    </View>

                    <View style={[styles.keyRowBox, { marginTop: 6 }]}>
                      <View style={styles.keyPair}>
                        <View style={styles.keyTag}><ThemedText style={styles.keyTagText}>Shift + \</ThemedText></View>
                        <ThemedText style={styles.arrowIcon}>➔</ThemedText>
                        <ThemedText style={styles.outputLetter}>ঃ (বিসর্গ)</ThemedText>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Quick 1-Tap Bar */}
                <View
                  style={[
                    styles.iconCard,
                    {
                      backgroundColor: isDark ? '#172554' : '#EFF6FF',
                      borderColor: isDark ? '#1E3A8A' : '#BFDBFE',
                    },
                  ]}
                >
                  <View style={[styles.leadingIcon, { backgroundColor: '#2563EB' }]}>
                    <MaterialCommunityIcons name="gesture-tap" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <ThemedText style={[styles.itemTitle, { color: '#2563EB' }]}>
                      ১ ট্যাপ ইনপুট (টিপস)
                    </ThemedText>
                    <ThemedText style={[styles.itemDesc, { color: isDark ? '#DBEAFE' : '#1E3A8A' }]}>
                      শর্টকাট চাপতে না চাইলে কিবোর্ডের উপরে থাকা বোতামগুলোতে স্পর্শ করলেই সরাসরি লেখা হয়ে যায়:
                    </ThemedText>

                    <View style={styles.chipsDisplay}>
                      {['ৎ', 'ঃ', '।', '৳', 'ঁ', '‘', '’'].map((char) => (
                        <View
                          key={char}
                          style={[
                            styles.chipBtn,
                            {
                              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                              borderColor: isDark ? '#3B82F6' : '#93C5FD',
                            },
                          ]}
                        >
                          <ThemedText style={styles.chipBtnChar}>{char}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Action */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: isDark ? '#1E293B' : '#E2E8F0',
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionButton}
              onPress={onClose}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>বুঝেছি, শুরু করি</ThemedText>
            </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 1,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  tabTrack: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTabButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  activeTabButtonText: {
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  iconList: {
    gap: 12,
  },
  iconCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  leadingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  activeTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#16A34A',
  },
  itemTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  itemDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    opacity: 0.8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chipPill: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  keyRowBox: {
    backgroundColor: 'rgba(100, 116, 139, 0.08)',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
    gap: 2,
  },
  keyPair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  keyTag: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  keyTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  arrowIcon: {
    fontSize: 12,
    opacity: 0.4,
  },
  outputLetter: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  exampleWord: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  chipsDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 6,
  },
  chipBtn: {
    width: 32,
    height: 32,
    borderRadius: 7,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipBtnChar: {
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
