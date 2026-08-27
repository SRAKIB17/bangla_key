import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, useColorScheme, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { BijoyEditor } from '@/components/BijoyEditor';
import { DeveloperInfoModal } from '@/components/DeveloperInfoModal';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width, height } = useWindowDimensions();
  const isPhysicalLandscape = width > height;

  const [manualLandscape, setManualLandscape] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const isLandscape = isPhysicalLandscape || manualLandscape;

  // Toggle Screen Orientation programmatically
  const toggleOrientation = async () => {
    try {
      if (isLandscape) {
        setManualLandscape(false);
        if (Platform.OS !== 'web') {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
          await ScreenOrientation.unlockAsync();
        }
      } else {
        setManualLandscape(true);
        if (Platform.OS !== 'web') {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        }
      }
    } catch (err) {
      console.log('Orientation toggle fallback:', err);
      setManualLandscape(!manualLandscape);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'left', 'right', 'bottom']}
      >
        {/* Header Bar - Hidden in Landscape Mode for Full Screen Textarea */}
        {!isLandscape && (
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <View style={styles.logoBadge}>
                <MaterialCommunityIcons name="keyboard-variant" size={24} color="#FFFFFF" />
              </View>
              <View>
                <View style={styles.titleRow}>
                  <ThemedText style={styles.appTitle}>বিজয় বাংলা</ThemedText>
                  <View style={styles.proTag}>
                    <ThemedText style={styles.proTagText}>PRO</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.appSubtitle}>
                  OTG কীবোর্ড ও টাইপিং স্টুডিও
                </ThemedText>
              </View>
            </View>

            {/* Header Action Buttons */}
            <View style={styles.headerRightActions}>
              {/* Landscape / Fullscreen Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.iconHeaderBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
                onPress={toggleOrientation}
              >
                <MaterialCommunityIcons
                  name="phone-rotate-landscape"
                  size={20}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
              </TouchableOpacity>

              {/* Info Icon Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.iconHeaderBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
                onPress={() => setShowInfoModal(true)}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Main Editor Component */}
        <BijoyEditor
          isLandscape={isLandscape}
          onToggleOrientation={toggleOrientation}
        />

        {/* Developer Profile Modal */}
        <DeveloperInfoModal
          visible={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />
      </SafeAreaView>
    </ThemedView>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: -0.3,
  },
  proTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  proTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 12,
    opacity: 0.65,
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
});
