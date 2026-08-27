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
                backgroundColor: isDark ? '#090D16' : '#FFFFFF',
              },
            ]}
          >
            <View style={styles.headerTitleRow}>
              <View style={styles.sparkleBadge}>
                <Ionicons name="bulb" size={18} color="#F59E0B" />
              </View>
              <View>
                <ThemedText style={styles.headerTitle}>ব্যবহার নির্দেশিকা</ThemedText>
                <ThemedText style={styles.headerSubtitle}>সহজ ৪ ধাপের গাইড</ThemedText>
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

          {/* Capsule Tab Switcher */}
          <View
            style={[
              styles.tabBarWrapper,
              {
                backgroundColor: isDark ? '#090D16' : '#FFFFFF',
                borderBottomColor: isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            <View
              style={[
                styles.capsuleTrack,
                { backgroundColor: isDark ? '#151C2C' : '#F1F5F9' },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.capsuleBtn,
                  activeTab === 'quickstart' && styles.activeCapsuleBtn,
                ]}
                onPress={() => setActiveTab('quickstart')}
              >
                <Ionicons
                  name="git-commit-outline"
                  size={15}
                  color={activeTab === 'quickstart' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                />
                <ThemedText
                  style={[
                    styles.capsuleText,
                    activeTab === 'quickstart' && styles.activeCapsuleText,
                  ]}
                >
                  টাইপিং টাইমলাইন
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.capsuleBtn,
                  activeTab === 'mobile_keys' && styles.activeCapsuleBtn,
                ]}
                onPress={() => setActiveTab('mobile_keys')}
              >
                <MaterialCommunityIcons
                  name="compare"
                  size={16}
                  color={activeTab === 'mobile_keys' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                />
                <ThemedText
                  style={[
                    styles.capsuleText,
                    activeTab === 'mobile_keys' && styles.activeCapsuleText,
                  ]}
                >
                  মোবাইল vs পিসি
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Body */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* TAB 1: CONNECTED TIMELINE FLOW */}
            {activeTab === 'quickstart' && (
              <View style={styles.timelineWrapper}>
                {/* Timeline Item 1 */}
                <View style={styles.timelineRow}>
                  <View style={styles.timelineLeftTrack}>
                    <View style={[styles.timelineNode, { backgroundColor: '#2563EB' }]}>
                      <ThemedText style={styles.nodeNumber}>১</ThemedText>
                    </View>
                    <View style={[styles.timelineLine, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]} />
                  </View>
                  <View
                    style={[
                      styles.timelineCard,
                      {
                        backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                        borderColor: isDark ? '#1E293B' : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.cardHeaderWithIcon}>
                      <MaterialCommunityIcons name="usb-port" size={18} color="#2563EB" />
                      <ThemedText style={styles.cardMainHeading}>কিবোর্ড সংযুক্ত করুন</ThemedText>
                    </View>
                    <ThemedText style={styles.cardParagraph}>
                      একটি সাধারণ OTG অ্যাডাপ্টার দিয়ে আপনার USB বা ব্লুটুথ কিবোর্ড মোবাইলে প্লাগ করুন।
                    </ThemedText>
                  </View>
                </View>

                {/* Timeline Item 2 */}
                <View style={styles.timelineRow}>
                  <View style={styles.timelineLeftTrack}>
                    <View style={[styles.timelineNode, { backgroundColor: '#10B981' }]}>
                      <ThemedText style={styles.nodeNumber}>২</ThemedText>
                    </View>
                    <View style={[styles.timelineLine, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]} />
                  </View>
                  <View
                    style={[
                      styles.timelineCard,
                      {
                        backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                        borderColor: isDark ? '#1E293B' : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.cardHeaderWithIcon}>
                      <MaterialCommunityIcons name="keyboard-outline" size={18} color="#10B981" />
                      <ThemedText style={styles.cardMainHeading}>বিজয় মোডে টাইপ করুন</ThemedText>
                    </View>
                    <ThemedText style={styles.cardParagraph}>
                      বিজয় মোড অন রেখে কিবোর্ডে ইংরেজি চাপলেই ইউনিকোড বাংলায় কনভার্ট হবে।
                    </ThemedText>

                    {/* Flow Pills */}
                    <View style={styles.flowRow}>
                      <View style={styles.flowPill}><ThemedText style={styles.flowKey}>J</ThemedText><ThemedText style={styles.flowResult}>➔ ক</ThemedText></View>
                      <View style={styles.flowPill}><ThemedText style={styles.flowKey}>Shift+J</ThemedText><ThemedText style={styles.flowResult}>➔ খ</ThemedText></View>
                      <View style={styles.flowPill}><ThemedText style={styles.flowKey}>G+F</ThemedText><ThemedText style={styles.flowResult}>➔ আ</ThemedText></View>
                      <View style={styles.flowPill}><ThemedText style={styles.flowKey}>C+J</ThemedText><ThemedText style={styles.flowResult}>➔ কে</ThemedText></View>
                    </View>
                  </View>
                </View>

                {/* Timeline Item 3 */}
                <View style={styles.timelineRow}>
                  <View style={styles.timelineLeftTrack}>
                    <View style={[styles.timelineNode, { backgroundColor: '#F59E0B' }]}>
                      <ThemedText style={styles.nodeNumber}>৩</ThemedText>
                    </View>
                    <View style={[styles.timelineLine, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]} />
                  </View>
                  <View
                    style={[
                      styles.timelineCard,
                      {
                        backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                        borderColor: isDark ? '#1E293B' : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.cardHeaderWithIcon}>
                      <MaterialCommunityIcons name="cellphone-text" size={18} color="#F59E0B" />
                      <ThemedText style={styles.cardMainHeading}>সফট কিবোর্ড লুকান (OTG)</ThemedText>
                    </View>
                    <ThemedText style={styles.cardParagraph}>
                      টাইপিংয়ের সময় স্ক্রিনের অন-স্ক্রিন কীবোর্ড বন্ধ রাখতে উপরের <ThemedText style={{ fontWeight: '800', color: '#10B981' }}>'OTG'</ThemedText> বোতামে স্পর্শ করুন।
                    </ThemedText>
                  </View>
                </View>

                {/* Timeline Item 4 */}
                <View style={styles.timelineRow}>
                  <View style={styles.timelineLeftTrack}>
                    <View style={[styles.timelineNode, { backgroundColor: '#8B5CF6' }]}>
                      <ThemedText style={styles.nodeNumber}>৪</ThemedText>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.timelineCard,
                      {
                        backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                        borderColor: isDark ? '#1E293B' : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.cardHeaderWithIcon}>
                      <MaterialCommunityIcons name="phone-rotate-landscape" size={18} color="#8B5CF6" />
                      <ThemedText style={styles.cardMainHeading}>ল্যান্ডস্কেপ রোটেট ভিউ</ThemedText>
                    </View>
                    <ThemedText style={styles.cardParagraph}>
                      হেডারের <ThemedText style={{ fontWeight: '800' }}>রোটেট বাটন</ThemedText> চাপলে মোবাইল স্ক্রিন আড়াআড়ি হয়ে যাবে এবং ফুলস্ক্রিনে আরামদায়ক টাইপিং উপভোগ করতে পারবেন।
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}

            {/* TAB 2: MOBILE VS PC CARDS */}
            {activeTab === 'mobile_keys' && (
              <View style={styles.compareWrapper}>
                {/* Card 1: Mobile Mode */}
                <View
                  style={[
                    styles.compareCard,
                    {
                      backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={styles.compareCardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Ionicons name="phone-portrait" size={18} color="#2563EB" />
                      <ThemedText style={styles.compareTitle}>মোবাইল মোড</ThemedText>
                    </View>
                    <View style={styles.activePillBadge}>
                      <ThemedText style={styles.activePillBadgeText}>ডিফল্ট অন</ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.compareDesc}>
                    মোবাইলের কিবোর্ডে সহজে <ThemedText style={{ fontWeight: '700' }}>\</ThemedText> ও <ThemedText style={{ fontWeight: '700' }}>|</ThemedText> না থাকায় এই শর্টকাট রাখা হয়েছে:
                  </ThemedText>

                  {/* Flow items */}
                  <View style={styles.keyFlowBox}>
                    <View style={styles.keyFlowItem}>
                      <View style={styles.darkKeycap}><ThemedText style={styles.darkKeycapText}>/</ThemedText></View>
                      <ThemedText style={styles.flowArrowIcon}>➔</ThemedText>
                      <View style={styles.banglaBadge}><ThemedText style={styles.banglaBadgeText}>ঃ (বিসর্গ)</ThemedText></View>
                    </View>
                    <ThemedText style={styles.flowExampleNote}>যেমন: দুঃখ = l + s + / + Shift+J</ThemedText>
                  </View>

                  <View style={[styles.keyFlowBox, { marginTop: 6 }]}>
                    <View style={styles.keyFlowItem}>
                      <View style={styles.darkKeycap}><ThemedText style={styles.darkKeycapText}>? বা Shift+/</ThemedText></View>
                      <ThemedText style={styles.flowArrowIcon}>➔</ThemedText>
                      <View style={styles.banglaBadge}><ThemedText style={styles.banglaBadgeText}>ৎ (খণ্ড-ত)</ThemedText></View>
                    </View>
                    <ThemedText style={styles.flowExampleNote}>যেমন: উৎসব = g+s + ? + n + h</ThemedText>
                  </View>
                </View>

                {/* Card 2: PC Mode */}
                <View
                  style={[
                    styles.compareCard,
                    {
                      backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={styles.compareCardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <MaterialCommunityIcons name="laptop" size={18} color="#6366F1" />
                      <ThemedText style={styles.compareTitle}>পিসি / ডেস্কটপ মোড</ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.compareDesc}>
                    কম্পিউটারের স্ট্যান্ডার্ড ফিজিক্যাল কিবোর্ড ব্যবহার করলে:
                  </ThemedText>

                  {/* Flow items */}
                  <View style={styles.keyFlowBox}>
                    <View style={styles.keyFlowItem}>
                      <View style={styles.darkKeycap}><ThemedText style={styles.darkKeycapText}>\</ThemedText></View>
                      <ThemedText style={styles.flowArrowIcon}>➔</ThemedText>
                      <View style={styles.banglaBadge}><ThemedText style={styles.banglaBadgeText}>ৎ (খণ্ড-ত)</ThemedText></View>
                    </View>
                    <ThemedText style={styles.flowExampleNote}>স্বাভাবিক ব্যাকস্ল্যাশ কী</ThemedText>
                  </View>

                  <View style={[styles.keyFlowBox, { marginTop: 6 }]}>
                    <View style={styles.keyFlowItem}>
                      <View style={styles.darkKeycap}><ThemedText style={styles.darkKeycapText}>Shift + \</ThemedText></View>
                      <ThemedText style={styles.flowArrowIcon}>➔</ThemedText>
                      <View style={styles.banglaBadge}><ThemedText style={styles.banglaBadgeText}>ঃ (বিসর্গ)</ThemedText></View>
                    </View>
                    <ThemedText style={styles.flowExampleNote}>শিফট চেপে ব্যাকস্ল্যাশ</ThemedText>
                  </View>
                </View>

                {/* Card 3: 1-Tap Quick Bar */}
                <View
                  style={[
                    styles.compareCard,
                    {
                      backgroundColor: isDark ? '#172554' : '#EFF6FF',
                      borderColor: isDark ? '#1E3A8A' : '#BFDBFE',
                    },
                  ]}
                >
                  <View style={styles.compareCardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <MaterialCommunityIcons name="gesture-tap" size={18} color="#2563EB" />
                      <ThemedText style={[styles.compareTitle, { color: '#2563EB' }]}>
                        ১ ট্যাপ কুইক সিম্বল বার
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={[styles.compareDesc, { color: isDark ? '#DBEAFE' : '#1E3A8A' }]}>
                    শর্টকাট মনে না থাকলে কীবোর্ডের ঠিক উপরে থাকা বোতামগুলোতে স্পর্শ করলেই সরাসরি লেখা হয়ে যায়:
                  </ThemedText>

                  <View style={styles.chipsDisplayRow}>
                    {['ৎ', 'ঃ', '।', '৳', 'ঁ', '‘', '’'].map((char) => (
                      <View
                        key={char}
                        style={[
                          styles.chipSquare,
                          {
                            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                            borderColor: isDark ? '#3B82F6' : '#93C5FD',
                          },
                        ]}
                      >
                        <ThemedText style={styles.chipSquareChar}>{char}</ThemedText>
                      </View>
                    ))}
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
                backgroundColor: isDark ? '#090D16' : '#FFFFFF',
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionBtn}
              onPress={onClose}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
              <ThemedText style={styles.actionBtnText}>বুঝেছি, টাইপিং শুরু করি</ThemedText>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sparkleBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
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
  capsuleTrack: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 3,
  },
  capsuleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeCapsuleBtn: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  capsuleText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  activeCapsuleText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  timelineWrapper: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineLeftTrack: {
    alignItems: 'center',
    width: 24,
  },
  timelineNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  nodeNumber: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 40,
    marginVertical: 4,
  },
  timelineCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 6,
  },
  cardHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardMainHeading: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  cardParagraph: {
    fontSize: 12.5,
    lineHeight: 18,
    opacity: 0.8,
  },
  flowRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  flowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  flowKey: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  flowResult: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  compareWrapper: {
    gap: 12,
  },
  compareCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  compareCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compareTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  activePillBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  activePillBadgeText: {
    color: '#16A34A',
    fontSize: 8.5,
    fontWeight: '800',
  },
  compareDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    opacity: 0.8,
  },
  keyFlowBox: {
    backgroundColor: 'rgba(100, 116, 139, 0.08)',
    padding: 8,
    borderRadius: 8,
    gap: 2,
  },
  keyFlowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  darkKeycap: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  darkKeycapText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  flowArrowIcon: {
    fontSize: 12,
    opacity: 0.4,
  },
  banglaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  banglaBadgeText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
  },
  flowExampleNote: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  chipsDisplayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 4,
  },
  chipSquare: {
    width: 32,
    height: 32,
    borderRadius: 7,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSquareChar: {
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
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
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
