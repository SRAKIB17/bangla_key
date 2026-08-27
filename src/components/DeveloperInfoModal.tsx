import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
  useColorScheme,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface DeveloperInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DeveloperInfoModal({ visible, onClose }: DeveloperInfoModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('Error opening URL:', err)
    );
  };

  const handleCall = () => {
    Linking.openURL('tel:+8801873989651');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/8801873989651');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          {/* Header with Close */}
          <View style={styles.topBar}>
            <ThemedText style={styles.headerLabel}>ডেভেলপার প্রোফাইল</ThemedText>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.closeBtn,
                { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
              ]}
              onPress={onClose}
            >
              <Ionicons name="close" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Avatar & Main Info */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarGlow}>
                <View style={styles.avatarBox}>
                  <ThemedText style={styles.avatarText}>RI</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.devName}>MD Rakibul Islam</ThemedText>
              <ThemedText style={styles.devRole}>Software Developer • App Creator</ThemedText>
            </View>

            {/* Contact & Social Links List */}
            <View style={styles.linksContainer}>
              {/* Phone Card */}
              <View
                style={[
                  styles.linkCard,
                  {
                    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
              >
                <View style={styles.linkLeft}>
                  <View style={[styles.iconBadge, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="call" size={18} color="#16A34A" />
                  </View>
                  <View style={styles.linkInfo}>
                    <ThemedText style={styles.linkTitle}>ফোন নম্বর</ThemedText>
                    <ThemedText style={styles.linkValue}>+8801873989651</ThemedText>
                  </View>
                </View>

                <View style={styles.callActions}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.smallActionBtn, { backgroundColor: '#22C55E' }]}
                    onPress={handleCall}
                  >
                    <Ionicons name="call-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.smallActionBtn, { backgroundColor: '#25D366' }]}
                    onPress={handleWhatsApp}
                  >
                    <Ionicons name="logo-whatsapp" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* GitHub Card */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.linkCard,
                  {
                    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
                onPress={() => handleOpenLink('https://github.com/SRAKIB17')}
              >
                <View style={styles.linkLeft}>
                  <View style={[styles.iconBadge, { backgroundColor: isDark ? '#334155' : '#181717' }]}>
                    <MaterialCommunityIcons name="github" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.linkInfo}>
                    <ThemedText style={styles.linkTitle}>GitHub</ThemedText>
                    <ThemedText style={styles.linkValue}>github.com/SRAKIB17</ThemedText>
                  </View>
                </View>
                <Feather name="external-link" size={16} color="#64748B" />
              </TouchableOpacity>

              {/* LinkedIn Card */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.linkCard,
                  {
                    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
                onPress={() => handleOpenLink('https://www.linkedin.com/in/srakib17')}
              >
                <View style={styles.linkLeft}>
                  <View style={[styles.iconBadge, { backgroundColor: '#0077B5' }]}>
                    <MaterialCommunityIcons name="linkedin" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.linkInfo}>
                    <ThemedText style={styles.linkTitle}>LinkedIn</ThemedText>
                    <ThemedText style={styles.linkValue}>linkedin.com/in/srakib17</ThemedText>
                  </View>
                </View>
                <Feather name="external-link" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* App Info Footer */}
            <View style={styles.footerBox}>
              <ThemedText style={styles.footerVersion}>
                বিজয় বাংলা কিপ্যাড স্টুডিও • Version 1.0.0
              </ThemedText>
              <ThemedText style={styles.footerCopy}>
                Developed with ❤️ by MD Rakibul Islam
              </ThemedText>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    maxHeight: '90%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    opacity: 0.6,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 10,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarGlow: {
    padding: 4,
    borderRadius: 36,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    marginBottom: 10,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  devName: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 2,
  },
  devRole: {
    fontSize: 12,
    opacity: 0.65,
    fontWeight: '600',
  },
  linksContainer: {
    gap: 10,
    marginTop: 14,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 11,
    opacity: 0.6,
    fontWeight: '600',
  },
  linkValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  callActions: {
    flexDirection: 'row',
    gap: 6,
  },
  smallActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBox: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(100, 116, 139, 0.2)',
    gap: 2,
  },
  footerVersion: {
    fontSize: 11,
    opacity: 0.5,
    fontWeight: '600',
  },
  footerCopy: {
    fontSize: 11,
    opacity: 0.7,
    fontWeight: '600',
    color: '#2563EB',
  },
});
