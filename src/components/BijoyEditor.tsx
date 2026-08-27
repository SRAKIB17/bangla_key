import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Share,
  useColorScheme,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Animated,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import {
  processBijoyKey,
  handleBijoyTextChangeDiff,
  INITIAL_BIJOY_STATE,
  BijoyEngineState,
} from '@/utils/bijoyEngine';
import { BijoyCheatSheet } from './BijoyCheatSheet';

// Quick symbol chips for fast typing in portrait mode
const QUICK_SYMBOLS = [
  { label: '।', char: '।', name: 'দাঁড়ি' },
  { label: '৳', char: '৳', name: 'টাকা' },
  { label: '্', char: '্', name: 'হসন্ত' },
  { label: 'র্', char: 'র্', name: 'রেফ' },
  { label: '্র', char: '্র', name: 'র-ফলা' },
  { label: '্য', char: '্য', name: 'য-ফলা' },
  { label: 'ঁ', char: 'ঁ', name: 'চন্দ্রবিন্দু' },
  { label: 'ঃ', char: 'ঃ', name: 'বিসর্গ' },
  { label: 'ৎ', char: 'ৎ', name: 'খণ্ড-ত' },
  { label: '‘', char: '‘', name: 'একক উদ্ধৃতি' },
  { label: '’', char: '’', name: 'একক উদ্ধৃতি' },
  { label: '“', char: '“', name: 'দ্বৈত উদ্ধৃতি' },
  { label: '”', char: '”', name: 'দ্বৈত উদ্ধৃতি' },
];

interface BijoyEditorProps {
  isLandscape?: boolean;
  onToggleOrientation?: () => void;
}

export function BijoyEditor({
  isLandscape = false,
  onToggleOrientation,
}: BijoyEditorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [text, setText] = useState<string>('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isBijoyMode, setIsBijoyMode] = useState<boolean>(true);
  const [mobileCompatMode, setMobileCompatMode] = useState<boolean>(Platform.OS !== 'web');
  const [hideSoftKeyboard, setHideSoftKeyboard] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(isLandscape ? 20 : 18);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [engineState, setEngineState] = useState<BijoyEngineState>(INITIAL_BIJOY_STATE);
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null);

  const toastAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const stateRef = useRef({
    text,
    selection,
    isBijoyMode,
    mobileCompatMode,
    engineState,
    history,
    historyIndex,
  });

  useEffect(() => {
    stateRef.current = {
      text,
      selection,
      isBijoyMode,
      mobileCompatMode,
      engineState,
      history,
      historyIndex,
    };
  }, [text, selection, isBijoyMode, mobileCompatMode, engineState, history, historyIndex]);

  const showToast = (message: string, icon: string = 'checkmark-circle') => {
    setToast({ message, icon });
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setToast(null));
  };

  const updateTextWithHistory = useCallback((newText: string) => {
    setText(newText);
    setHistory((prev) => {
      const sliced = prev.slice(0, stateRef.current.historyIndex + 1);
      return [...sliced, newText];
    });
    setHistoryIndex((prev) => prev + 1);
  }, []);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setText(history[newIdx]);
      showToast('আনডু করা হয়েছে', 'arrow-undo');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setText(history[newIdx]);
      showToast('রিডু করা হয়েছে', 'arrow-redo');
    }
  };

  // Robust Backspace Handler for OTG & Virtual Keyboards
  const handleBackspace = useCallback(() => {
    const currentText = stateRef.current.text;
    const currentSel = stateRef.current.selection;
    const currentState = stateRef.current.engineState;

    // If any Bijoy modifier was pending (e.g. 'g' or 'c' was pressed), cancel pending state first
    if (currentState.pendingG || currentState.pendingPrefixKar || currentState.pendingRef) {
      setEngineState(INITIAL_BIJOY_STATE);
      return;
    }

    if (currentText.length === 0) return;

    const start = currentSel.start;
    const end = currentSel.end;

    if (start !== end) {
      // Range selected: delete range
      const updated = currentText.substring(0, start) + currentText.substring(end);
      updateTextWithHistory(updated);
      setSelection({ start, end: start });
    } else if (start > 0) {
      // Delete 1 character before cursor
      const updated = currentText.substring(0, start - 1) + currentText.substring(start);
      const newPos = start - 1;
      updateTextWithHistory(updated);
      setSelection({ start: newPos, end: newPos });
    } else {
      // Cursor at 0 or fallback: remove last char
      const updated = currentText.slice(0, -1);
      updateTextWithHistory(updated);
      setSelection({ start: updated.length, end: updated.length });
    }
    setEngineState(INITIAL_BIJOY_STATE);
  }, [updateTextWithHistory]);

  // High-Speed Single Source of Truth text change handler
  const handleTextChange = (newText: string) => {
    const currentText = stateRef.current.text;

    // If text got shorter (Backspace/Delete via input event)
    if (newText.length < currentText.length) {
      setEngineState(INITIAL_BIJOY_STATE);
      updateTextWithHistory(newText);
      return;
    }

    if (!isBijoyMode) {
      updateTextWithHistory(newText);
      return;
    }

    const currentState = stateRef.current.engineState;
    const diffResult = handleBijoyTextChangeDiff(
      currentText,
      newText,
      currentState,
      { mobileCompatMode: stateRef.current.mobileCompatMode }
    );
    setEngineState(diffResult.newState);
    updateTextWithHistory(diffResult.text);
  };

  // Hardware key press handler for Android OTG
  const handleNativeKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;

    if (key === 'Backspace') {
      handleBackspace();
      return;
    }

    if (key === 'Delete') {
      setEngineState(INITIAL_BIJOY_STATE);
      return;
    }
  };

  // Web Hardware Keyboard listener
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        if (e.key === 'z' || e.key === 'Z') {
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          e.preventDefault();
        }
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleBackspace]);

  // Manual key/symbol tap insert (from on-screen chips or modal)
  const handleManualInsert = useCallback((charToInsert: string) => {
    const currentText = stateRef.current.text;
    const currentSel = stateRef.current.selection;
    const start = currentSel.start;
    const end = currentSel.end;

    const updated = currentText.substring(0, start) + charToInsert + currentText.substring(end);
    const newPos = start + charToInsert.length;

    updateTextWithHistory(updated);
    setSelection({ start: newPos, end: newPos });
    setEngineState(INITIAL_BIJOY_STATE);
  }, [updateTextWithHistory]);

  const handleCopy = async () => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    showToast('টেক্সট ক্লিপবোর্ডে কপি করা হয়েছে!', 'copy');
  };

  const handleClear = () => {
    if (!text) return;
    Alert.alert('টেক্সট ক্লিয়ার করবেন?', 'আপনার লেখা সমস্ত টেক্সট মুছে ফেলা হবে।', [
      { text: 'বাতিল', style: 'cancel' },
      {
        text: 'মুছুন',
        style: 'destructive',
        onPress: () => {
          updateTextWithHistory('');
          setEngineState(INITIAL_BIJOY_STATE);
          setSelection({ start: 0, end: 0 });
          showToast('সব মুছে ফেলা হয়েছে', 'trash');
        },
      },
    ]);
  };

  const handleShare = async () => {
    if (!text) return;
    try {
      await Share.share({
        message: text,
        title: 'বিজয় বাংলা নোট',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const lineCount = text ? text.split('\n').length : 1;

  return (
    <ThemedView
      style={[
        styles.container,
        isLandscape && styles.landscapeContainer,
      ]}
    >
      {/* Toast Alert */}
      {toast && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
              backgroundColor: isDark ? '#1E293B' : '#0F172A',
            },
          ]}
        >
          <Ionicons name={toast.icon as any} size={16} color="#60A5FA" style={{ marginRight: 6 }} />
          <ThemedText style={styles.toastText}>{toast.message}</ThemedText>
        </Animated.View>
      )}

      {/* Portrait Top Controls Card */}
      {!isLandscape && (
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          {/* Segmented Mode Selector */}
          <View style={styles.modeSegment}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.segmentBtn,
                isBijoyMode && styles.activeSegmentBtn,
              ]}
              onPress={() => {
                setIsBijoyMode(true);
                setEngineState(INITIAL_BIJOY_STATE);
              }}
            >
              <MaterialCommunityIcons
                name="keyboard-outline"
                size={14}
                color={isBijoyMode ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                style={{ marginRight: 4 }}
              />
              <ThemedText
                style={[
                  styles.segmentText,
                  isBijoyMode && styles.activeSegmentText,
                ]}
              >
                বিজয় মোড
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.segmentBtn,
                !isBijoyMode && styles.activeSegmentBtn,
              ]}
              onPress={() => {
                setIsBijoyMode(false);
                setEngineState(INITIAL_BIJOY_STATE);
              }}
            >
              <Feather
                name="type"
                size={13}
                color={!isBijoyMode ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                style={{ marginRight: 4 }}
              />
              <ThemedText
                style={[
                  styles.segmentText,
                  !isBijoyMode && styles.activeSegmentText,
                ]}
              >
                English
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Action Badges */}
          <View style={styles.headerBadges}>
            {/* OTG Soft Keyboard Toggle */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.pillBtn,
                {
                  backgroundColor: hideSoftKeyboard
                    ? isDark ? '#064E3B' : '#DCFCE7'
                    : isDark ? '#334155' : '#F1F5F9',
                  borderColor: hideSoftKeyboard ? '#10B981' : '#CBD5E1',
                },
              ]}
              onPress={() => {
                const next = !hideSoftKeyboard;
                setHideSoftKeyboard(next);
                showToast(
                  next
                    ? 'OTG মোড: অন-স্ক্রিন কীবোর্ড বন্ধ'
                    : 'টাচ মোড: অন-স্ক্রিন কীবোর্ড দৃশ্যমান',
                  next ? 'hardware-chip-outline' : 'keypad-outline'
                );
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
            >
              <MaterialCommunityIcons
                name={hideSoftKeyboard ? 'usb' : 'cellphone-text'}
                size={13}
                color={hideSoftKeyboard ? '#10B981' : isDark ? '#94A3B8' : '#64748B'}
              />
              <ThemedText
                style={[
                  styles.pillText,
                  {
                    color: hideSoftKeyboard
                      ? '#10B981'
                      : isDark ? '#CBD5E1' : '#475569',
                  },
                ]}
              >
                {hideSoftKeyboard ? 'OTG' : 'টাচ'}
              </ThemedText>
            </TouchableOpacity>

            {/* Mobile / PC Layout Toggle */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.pillBtn,
                {
                  backgroundColor: mobileCompatMode
                    ? isDark ? '#1E1B4B' : '#EEF2FF'
                    : isDark ? '#334155' : '#F1F5F9',
                  borderColor: mobileCompatMode ? '#6366F1' : '#CBD5E1',
                },
              ]}
              onPress={() => {
                const next = !mobileCompatMode;
                setMobileCompatMode(next);
                showToast(
                  next
                    ? 'মোবাইল মোড সক্রিয়: / ও ? দিয়ে ঃ ও ৎ'
                    : 'ডেস্কটপ মোড সক্রিয়: \\ ও | দিয়ে ৎ ও ঃ',
                  next ? 'phone-portrait-outline' : 'desktop-outline'
                );
              }}
            >
              <MaterialCommunityIcons
                name={mobileCompatMode ? 'cellphone' : 'laptop'}
                size={13}
                color={mobileCompatMode ? '#6366F1' : isDark ? '#94A3B8' : '#64748B'}
              />
              <ThemedText
                style={[
                  styles.pillText,
                  {
                    color: mobileCompatMode
                      ? '#6366F1'
                      : isDark ? '#CBD5E1' : '#475569',
                  },
                ]}
              >
                {mobileCompatMode ? '/ ?' : '\\ |'}
              </ThemedText>
            </TouchableOpacity>

            {/* Guide Modal Trigger */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.pillBtn,
                styles.guidePill,
                {
                  backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF',
                  borderColor: isDark ? '#4338CA' : '#818CF8',
                },
              ]}
              onPress={() => setShowCheatSheet(true)}
            >
              <Ionicons name="book-outline" size={13} color="#6366F1" />
              <ThemedText style={[styles.pillText, { color: '#6366F1' }]}>
                চিটশিট
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Portrait Quick Symbol Chips */}
      {!isLandscape && (
        <View style={styles.quickSymbolsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickSymbolsContent}
          >
            {QUICK_SYMBOLS.map((item) => (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.7}
                style={[
                  styles.symbolChip,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
                onPress={() => handleManualInsert(item.char)}
              >
                <ThemedText style={styles.symbolChar}>{item.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Main Typing Canvas / Full Screen Textarea in Landscape */}
      <View
        style={[
          styles.editorCanvas,
          isLandscape && styles.landscapeCanvas,
          {
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderColor: isLandscape ? 'transparent' : isDark ? '#1E293B' : '#E2E8F0',
          },
        ]}
      >
        {/* Landscape Floating Mini Control Strip */}
        {isLandscape && (
          <View style={styles.landscapeFloatControls}>
            {/* Mode Switch Pill */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.landscapeMiniPill,
                { backgroundColor: isBijoyMode ? '#2563EB' : '#475569' },
              ]}
              onPress={() => {
                const next = !isBijoyMode;
                setIsBijoyMode(next);
                setEngineState(INITIAL_BIJOY_STATE);
                showToast(next ? 'বিজয় মোড সক্রিয়' : 'English Mode Active', 'swap-horizontal');
              }}
            >
              <ThemedText style={styles.landscapePillText}>
                {isBijoyMode ? '🇧🇩 বিজয়' : '🔤 EN'}
              </ThemedText>
            </TouchableOpacity>

            {/* Quick Copy Pill */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.landscapeMiniPill,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                  borderColor: isDark ? '#334155' : '#CBD5E1',
                  borderWidth: 1,
                },
              ]}
              onPress={handleCopy}
            >
              <Ionicons name="copy-outline" size={13} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>

            {/* Mobile / PC Layout Toggle Pill */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.landscapeMiniPill,
                {
                  backgroundColor: mobileCompatMode ? (isDark ? '#1E1B4B' : '#EEF2FF') : (isDark ? '#1E293B' : '#F1F5F9'),
                  borderColor: mobileCompatMode ? '#6366F1' : isDark ? '#334155' : '#CBD5E1',
                  borderWidth: 1,
                },
              ]}
              onPress={() => {
                const next = !mobileCompatMode;
                setMobileCompatMode(next);
                showToast(
                  next
                    ? 'মোবাইল মোড: / ও ? দিয়ে ঃ ও ৎ'
                    : 'ডেস্কটপ মোড: \\ ও | দিয়ে ৎ ও ঃ',
                  next ? 'phone-portrait-outline' : 'desktop-outline'
                );
              }}
            >
              <MaterialCommunityIcons
                name={mobileCompatMode ? 'cellphone' : 'laptop'}
                size={13}
                color={mobileCompatMode ? '#6366F1' : isDark ? '#94A3B8' : '#64748B'}
              />
            </TouchableOpacity>

            {/* Guide Pill */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.landscapeMiniPill,
                {
                  backgroundColor: isDark ? '#312E81' : '#EEF2FF',
                  borderColor: '#6366F1',
                  borderWidth: 1,
                },
              ]}
              onPress={() => setShowCheatSheet(true)}
            >
              <Ionicons name="book-outline" size={13} color="#6366F1" />
            </TouchableOpacity>

            {/* Rotate Back to Portrait Button */}
            {onToggleOrientation && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.landscapeMiniPill,
                  styles.rotateExitPill,
                ]}
                onPress={onToggleOrientation}
              >
                <MaterialCommunityIcons name="phone-rotate-portrait" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* High-Speed OTG Textarea */}
        <TextInput
          ref={inputRef}
          style={[
            styles.textInput,
            isLandscape && styles.landscapeTextInput,
            {
              fontSize,
              lineHeight: Math.round(fontSize * 1.6),
              color: isDark ? '#F8FAFC' : '#0F172A',
            },
          ]}
          multiline
          placeholder={
            isBijoyMode
              ? 'OTG কীবোর্ড দিয়ে দ্রুত টাইপ করুন (যেমন: J = ক, J+G+K = ক্ত, G+F = আ, C+J = কে)...'
              : 'Type in English here...'
          }
          placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
          value={text}
          onChangeText={handleTextChange}
          onKeyPress={handleNativeKeyPress}
          onSelectionChange={(e) => {
            setSelection(e.nativeEvent.selection);
          }}
          showSoftInputOnFocus={!hideSoftKeyboard}
          autoCapitalize="none"
          autoCorrect={false}
          textAlignVertical="top"
          autoFocus={isLandscape}
        />

        {/* Portrait Floating Action Toolbar */}
        {!isLandscape && (
          <View
            style={[
              styles.canvasToolbar,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)',
                borderTopColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            {/* History Controls */}
            <View style={styles.toolGroup}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.toolIconBtn, historyIndex <= 0 && styles.disabledToolBtn]}
                onPress={handleUndo}
                disabled={historyIndex <= 0}
              >
                <Ionicons
                  name="arrow-undo-outline"
                  size={16}
                  color={isDark ? '#F8FAFC' : '#0F172A'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.toolIconBtn,
                  historyIndex >= history.length - 1 && styles.disabledToolBtn,
                ]}
                onPress={handleRedo}
                disabled={historyIndex >= history.length - 1}
              >
                <Ionicons
                  name="arrow-redo-outline"
                  size={16}
                  color={isDark ? '#F8FAFC' : '#0F172A'}
                />
              </TouchableOpacity>
            </View>

            {/* Typography Stepper */}
            <View style={styles.toolGroup}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.toolIconBtn}
                onPress={() => setFontSize((prev) => Math.max(12, prev - 2))}
              >
                <Feather name="minus" size={14} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TouchableOpacity>

              <View style={styles.fontSizePill}>
                <ThemedText style={styles.fontSizeText}>{fontSize}px</ThemedText>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.toolIconBtn}
                onPress={() => setFontSize((prev) => Math.min(40, prev + 2))}
              >
                <Feather name="plus" size={14} color={isDark ? '#F8FAFC' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            {/* Action Buttons: Copy, Share, Clear */}
            <View style={styles.toolGroup}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.actionPillBtn}
                onPress={handleCopy}
              >
                <Ionicons name="copy-outline" size={14} color="#2563EB" />
                <ThemedText style={[styles.actionBtnText, { color: '#2563EB' }]}>
                  কপি
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.actionPillBtn}
                onPress={handleShare}
              >
                <Ionicons name="share-social-outline" size={14} color="#059669" />
                <ThemedText style={[styles.actionBtnText, { color: '#059669' }]}>
                  শেয়ার
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.actionPillBtn, styles.deleteActionPill]}
                onPress={handleClear}
              >
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Portrait Footer Statistics */}
      {!isLandscape && (
        <View style={styles.footer}>
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Ionicons name="document-text-outline" size={13} color="#2563EB" />
              <ThemedText style={styles.statLabel}>শব্দ:</ThemedText>
              <ThemedText style={styles.statNumber}>{wordCount}</ThemedText>
            </View>

            <View style={styles.statBadge}>
              <Ionicons name="text-outline" size={13} color="#7C3AED" />
              <ThemedText style={styles.statLabel}>অক্ষর:</ThemedText>
              <ThemedText style={styles.statNumber}>{charCount}</ThemedText>
            </View>

            <View style={styles.statBadge}>
              <Ionicons name="reorder-four-outline" size={13} color="#059669" />
              <ThemedText style={styles.statLabel}>লাইন:</ThemedText>
              <ThemedText style={styles.statNumber}>{lineCount}</ThemedText>
            </View>
          </View>

          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: hideSoftKeyboard ? '#10B981' : '#F59E0B' },
              ]}
            />
            <ThemedText style={styles.statusLabel}>
              {hideSoftKeyboard ? 'OTG সক্রিয়' : 'টাচ সক্রিয়'}
            </ThemedText>
          </View>
        </View>
      )}

      {/* Cheat Sheet & Visual Keyboard Modal */}
      <BijoyCheatSheet
        visible={showCheatSheet}
        onClose={() => setShowCheatSheet(false)}
        mobileCompatMode={mobileCompatMode}
        onSelectCharacter={(char) => {
          handleManualInsert(char);
          setShowCheatSheet(false);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  landscapeContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  toast: {
    position: 'absolute',
    top: 6,
    left: '12%',
    right: '12%',
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  headerCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  modeSegment: {
    flexDirection: 'row',
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    borderRadius: 8,
    padding: 2,
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  activeSegmentBtn: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.7,
  },
  activeSegmentText: {
    color: '#FFFFFF',
    opacity: 1,
    fontWeight: '700',
  },
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    gap: 3,
  },
  guidePill: {
    paddingHorizontal: 8,
  },
  pillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  quickSymbolsContainer: {
    marginBottom: 8,
  },
  quickSymbolsContent: {
    gap: 6,
    paddingVertical: 2,
  },
  symbolChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  symbolChar: {
    fontSize: 13,
    fontWeight: '700',
  },
  editorCanvas: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  landscapeCanvas: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
  },
  landscapeFloatControls: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  landscapeMiniPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateExitPill: {
    backgroundColor: '#059669',
  },
  landscapePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    padding: 16,
  },
  landscapeTextInput: {
    paddingHorizontal: 22,
    paddingTop: 46,
    paddingBottom: 16,
  },
  canvasToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    flexWrap: 'wrap',
    gap: 6,
  },
  toolGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  toolIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(100, 116, 139, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledToolBtn: {
    opacity: 0.25,
  },
  fontSizePill: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeText: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.8,
  },
  actionPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(100, 116, 139, 0.12)',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteActionPill: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.6,
  },
  statNumber: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.6,
  },
});
