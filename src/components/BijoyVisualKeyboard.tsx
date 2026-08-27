import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { ThemedText } from './themed-text';

interface KeyCapProps {
  eng: string;
  normalBangla: string;
  shiftBangla?: string;
  linkBangla?: string;
  widthFlex?: number;
  onPress?: () => void;
  isDark?: boolean;
}

function KeyCap({
  eng,
  normalBangla,
  shiftBangla,
  linkBangla,
  widthFlex = 1,
  onPress,
  isDark,
}: KeyCapProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.keyCap,
        {
          flex: widthFlex,
          backgroundColor: isDark ? '#1E293B' : '#FFFDF7',
          borderColor: isDark ? '#334155' : '#D1D5DB',
        },
      ]}
      onPress={onPress}
    >
      {/* Top Row: Link Bangla (left) & Shift Bangla (right) */}
      <View style={styles.keyRow}>
        <ThemedText style={[styles.linkText, { color: '#2563EB' }]}>
          {linkBangla || ''}
        </ThemedText>
        <ThemedText style={[styles.shiftText, { color: '#DC2626' }]}>
          {shiftBangla || ''}
        </ThemedText>
      </View>

      {/* Bottom Row: English (left) & Normal Bangla (right) */}
      <View style={styles.keyRow}>
        <ThemedText style={[styles.engText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          {eng}
        </ThemedText>
        <ThemedText style={[styles.normalText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          {normalBangla}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

interface BijoyVisualKeyboardProps {
  onKeyClick?: (char: string) => void;
  mobileCompatMode?: boolean;
}

export function BijoyVisualKeyboard({
  onKeyClick,
  mobileCompatMode = true,
}: BijoyVisualKeyboardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const send = (c: string) => {
    if (onKeyClick) onKeyClick(c);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#E2E8F0' }]}>
      {/* Legend Header */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#2563EB' }]} />
          <ThemedText style={styles.legendLabel}>লিংক/G বাংলা (উপরে-বামে)</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#DC2626' }]} />
          <ThemedText style={styles.legendLabel}>শিফট বাংলা (উপরে-ডানে)</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#0F172A' }]} />
          <ThemedText style={styles.legendLabel}>স্বাভাবিক বাংলা (নিচে-ডানে)</ThemedText>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.boardScroll}>
        <View style={styles.board}>
          {/* Row 1: Numbers */}
          <View style={styles.keyboardRow}>
            <KeyCap eng="~" normalBangla="‘" shiftBangla="~" isDark={isDark} onPress={() => send('~')} />
            <KeyCap eng="1" normalBangla="১" shiftBangla="!" isDark={isDark} onPress={() => send('1')} />
            <KeyCap eng="2" normalBangla="২" shiftBangla="@" isDark={isDark} onPress={() => send('2')} />
            <KeyCap eng="3" normalBangla="৩" shiftBangla="#" isDark={isDark} onPress={() => send('3')} />
            <KeyCap eng="4" normalBangla="৪" shiftBangla="৳" isDark={isDark} onPress={() => send('4')} />
            <KeyCap eng="5" normalBangla="৫" shiftBangla="%" isDark={isDark} onPress={() => send('5')} />
            <KeyCap eng="6" normalBangla="৬" shiftBangla="^" isDark={isDark} onPress={() => send('6')} />
            <KeyCap eng="7" normalBangla="৭" shiftBangla="ঁ" isDark={isDark} onPress={() => send('7')} />
            <KeyCap eng="8" normalBangla="৮" shiftBangla="*" isDark={isDark} onPress={() => send('8')} />
            <KeyCap eng="9" normalBangla="৯" shiftBangla="(" isDark={isDark} onPress={() => send('9')} />
            <KeyCap eng="0" normalBangla="০" shiftBangla=")" isDark={isDark} onPress={() => send('0')} />
            <KeyCap eng="-" normalBangla="-" shiftBangla="_" isDark={isDark} onPress={() => send('-')} />
            <KeyCap eng="=" normalBangla="=" shiftBangla="+" isDark={isDark} onPress={() => send('=')} />
            <KeyCap eng="\" normalBangla="ৎ" shiftBangla="ঃ" isDark={isDark} onPress={() => send('\\')} />
          </View>

          {/* Row 2: Q W E R T Y U I O P */}
          <View style={styles.keyboardRow}>
            <KeyCap eng="Q" normalBangla="ঙ" shiftBangla="ং" isDark={isDark} onPress={() => send('q')} />
            <KeyCap eng="W" normalBangla="য" shiftBangla="য়" isDark={isDark} onPress={() => send('w')} />
            <KeyCap eng="E" normalBangla="ড" shiftBangla="ঢ" isDark={isDark} onPress={() => send('e')} />
            <KeyCap eng="R" normalBangla="প" shiftBangla="ফ" isDark={isDark} onPress={() => send('r')} />
            <KeyCap eng="T" normalBangla="ট" shiftBangla="ঠ" isDark={isDark} onPress={() => send('t')} />
            <KeyCap eng="Y" normalBangla="চ" shiftBangla="ছ" isDark={isDark} onPress={() => send('y')} />
            <KeyCap eng="U" normalBangla="জ" shiftBangla="ঝ" isDark={isDark} onPress={() => send('u')} />
            <KeyCap eng="I" normalBangla="হ" shiftBangla="ঞ" isDark={isDark} onPress={() => send('i')} />
            <KeyCap eng="O" normalBangla="গ" shiftBangla="ঘ" isDark={isDark} onPress={() => send('o')} />
            <KeyCap eng="P" normalBangla="ড়" shiftBangla="ঢ়" isDark={isDark} onPress={() => send('p')} />
            <KeyCap eng="[" normalBangla="[" shiftBangla="{" isDark={isDark} onPress={() => send('[')} />
            <KeyCap eng="]" normalBangla="]" shiftBangla="}" isDark={isDark} onPress={() => send(']')} />
          </View>

          {/* Row 3: A S D F G H J K L */}
          <View style={styles.keyboardRow}>
            <KeyCap eng="A" normalBangla="ৃ" shiftBangla="র্" linkBangla="ঋ" isDark={isDark} onPress={() => send('a')} />
            <KeyCap eng="S" normalBangla="ু" shiftBangla="ূ" linkBangla="উ" isDark={isDark} onPress={() => send('s')} />
            <KeyCap eng="D" normalBangla="ি" shiftBangla="ী" linkBangla="ই" isDark={isDark} onPress={() => send('d')} />
            <KeyCap eng="F" normalBangla="া" shiftBangla="অ" linkBangla="আ" isDark={isDark} onPress={() => send('f')} />
            <KeyCap eng="G" normalBangla="্" shiftBangla="।" linkBangla="" isDark={isDark} onPress={() => send('g')} />
            <KeyCap eng="H" normalBangla="ব" shiftBangla="ভ" isDark={isDark} onPress={() => send('h')} />
            <KeyCap eng="J" normalBangla="ক" shiftBangla="খ" isDark={isDark} onPress={() => send('j')} />
            <KeyCap eng="K" normalBangla="ত" shiftBangla="থ" isDark={isDark} onPress={() => send('k')} />
            <KeyCap eng="L" normalBangla="দ" shiftBangla="ধ" isDark={isDark} onPress={() => send('l')} />
            <KeyCap eng=";" normalBangla=";" shiftBangla=":" isDark={isDark} onPress={() => send(';')} />
            <KeyCap eng="'" normalBangla="'" shiftBangla='"' isDark={isDark} onPress={() => send("'")} />
          </View>

          {/* Row 4: Z X C V B N M */}
          <View style={styles.keyboardRow}>
            <KeyCap eng="Z" normalBangla="্র" shiftBangla="্য" isDark={isDark} onPress={() => send('z')} />
            <KeyCap eng="X" normalBangla="ও" shiftBangla="ৌ" linkBangla="ঔ" isDark={isDark} onPress={() => send('x')} />
            <KeyCap eng="C" normalBangla="ে" shiftBangla="ৈ" linkBangla="এ" isDark={isDark} onPress={() => send('c')} />
            <KeyCap eng="V" normalBangla="র" shiftBangla="ল" isDark={isDark} onPress={() => send('v')} />
            <KeyCap eng="B" normalBangla="ন" shiftBangla="ণ" isDark={isDark} onPress={() => send('b')} />
            <KeyCap eng="N" normalBangla="স" shiftBangla="ষ" isDark={isDark} onPress={() => send('n')} />
            <KeyCap eng="M" normalBangla="ম" shiftBangla="শ" isDark={isDark} onPress={() => send('m')} />
            <KeyCap eng="," normalBangla="," shiftBangla="<" isDark={isDark} onPress={() => send(',')} />
            <KeyCap eng="." normalBangla="." shiftBangla=">" isDark={isDark} onPress={() => send('.')} />
            {mobileCompatMode ? (
              <KeyCap eng="/" normalBangla="ঃ" shiftBangla="ৎ" isDark={isDark} onPress={() => send('/')} />
            ) : (
              <KeyCap eng="/" normalBangla="/" shiftBangla="?" isDark={isDark} onPress={() => send('/')} />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  boardScroll: {
    paddingVertical: 4,
  },
  board: {
    minWidth: 540,
    gap: 5,
  },
  keyboardRow: {
    flexDirection: 'row',
    gap: 4,
  },
  keyCap: {
    minWidth: 38,
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    padding: 3,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  shiftText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  engText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  normalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
