/**
 * Bijoy Layout to Unicode Bangla Engine
 * Implements standard Bijoy keyboard mapping with state machine for:
 * - Vowels (Shift+F -> অ, G+F -> আ, G+D -> ই, G+Shift+D -> ঈ, G+S -> উ, G+Shift+S -> ঊ, G+A -> ঋ, G+C -> এ, G+Shift+C -> ঐ, X -> ও, G+Shift+X -> ঔ)
 * - Consonants (ক-হ, ড়, ঢ়, য়, ৎ, ং, ঃ, ঁ)
 * - Kar signs (া, ি, ী, ু, ূ, ৃ, ে, ৈ, ো, ৌ)
 * - Pre-consonant & Conjunct Kar re-ordering (ে, ৈ, ি, ো, ৌ)
 * - Phala insertion with preceding Kars (টে + z -> ট্রে)
 * - Ref (Shift+A / A) prefixing
 * - R-phala (z / Z) and Ya-phala (Shift+Z)
 * - Conjuncts (যুক্তবর্ণ) using G (্ হসন্ত)
 */

export interface BijoyEngineState {
  pendingG: boolean; // True when 'g' or 'G' was pressed waiting for vowel kar or conjunct
  pendingRef: boolean; // True when Ref (Shift+A) was pressed waiting for consonant
  pendingPrefixKar: string | null; // Stores prefix kar like 'ে', 'ৈ', 'ি' waiting for consonant
}

export const INITIAL_BIJOY_STATE: BijoyEngineState = {
  pendingG: false,
  pendingRef: false,
  pendingPrefixKar: null,
};

// Base mapping for unshifted / single keys
export const BIJOY_KEY_MAP: Record<string, string> = {
  // Consonants
  j: 'ক',
  J: 'খ',
  o: 'গ',
  O: 'ঘ',
  q: 'ঙ',
  Q: 'ং',
  y: 'চ',
  Y: 'ছ',
  u: 'জ',
  U: 'ঝ',
  t: 'ট',
  T: 'ঠ',
  e: 'ড',
  E: 'ঢ',
  b: 'ন',
  B: 'ণ',
  k: 'ত',
  K: 'থ',
  l: 'দ',
  L: 'ধ',
  r: 'প',
  R: 'ফ',
  h: 'ব',
  H: 'ভ',
  m: 'ম',
  M: 'শ',
  w: 'য',
  W: 'য়',
  v: 'র',
  V: 'ল',
  n: 'স',
  N: 'ষ',
  i: 'হ',
  I: 'ঞ',
  p: 'ড়',
  P: 'ঢ়',

  // Special characters & Vowels
  F: 'অ',
  x: 'ও',
  X: 'ৌ',
  '/': 'ঃ',
  '?': 'ৎ',
  '\\': 'ৎ',
  '|': 'ঃ',
  '$': '৳',
  '~': 'ঁ',
  '`': '‘',
  '^': '’',
  '&': 'ঁ',
  '{': '\u200C', // ZWNJ
  '}': '\u200D', // ZWJ

  // Kars (when typed standalone or normally)
  f: 'া',
  d: 'ি',
  D: 'ী',
  s: 'ু',
  S: 'ূ',
  a: 'ৃ',
  c: 'ে',
  C: 'ৈ',
  z: '্র', // র-ফলা
  Z: '্য', // য-ফলা

  // Numerals
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

// Vowels mapped when 'g' or 'G' precedes the key
export const G_VOWEL_MAP: Record<string, string> = {
  f: 'আ',
  F: 'আ',
  d: 'ই',
  D: 'ঈ',
  s: 'উ',
  S: 'ঊ',
  a: 'ঋ',
  A: 'ঋ',
  c: 'এ',
  C: 'ঐ',
  x: 'ঔ',
  X: 'ঔ',
};

// Check if character is a Bengali consonant
export function isBengaliConsonant(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (code >= 0x0995 && code <= 0x09b9) || code === 0x09dc || code === 0x09dd || code === 0x09df;
}

// Check if character is a Bengali Kar
export function isBengaliKar(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (code >= 0x09be && code <= 0x09cc) || code === 0x09d7;
}

export interface ProcessKeyResult {
  textToInsert: string;
  deleteCount: number; // characters to remove before inserting
  newState: BijoyEngineState;
}

/**
 * Process a single key event in Bijoy mode
 * @param key The key string (e.g. 'j', 'J', 'g', 'G', etc.)
 * @param lastChar The character immediately before the cursor
 * @param state Current engine state
 */
export function processBijoyKey(
  key: string,
  lastChar: string | null,
  state: BijoyEngineState
): ProcessKeyResult {
  // If key is Shift+G (G in uppercase) -> দাড়ি '।'
  if (key === 'G' && !state.pendingG) {
    return {
      textToInsert: '।',
      deleteCount: 0,
      newState: { ...state, pendingG: false, pendingRef: false, pendingPrefixKar: null },
    };
  }

  // If key is 'g' or 'G' (হসন্ত / link key)
  if (key === 'g' || key === 'G') {
    if (state.pendingG) {
      // Pressed 'g' twice -> output visible হসন্ত '্'
      return {
        textToInsert: '্',
        deleteCount: 0,
        newState: { ...state, pendingG: false },
      };
    }

    // If the last character was a Kar placed after a consonant (e.g. ি/ে from prefix typing),
    // and now user presses 'g' to form a conjunct (e.g. 'd' + 'N' + 'g' + 't' -> 'ষ্টি'),
    // temporarily lift the kar and attach it to the end of the conjunct!
    if (lastChar && isBengaliKar(lastChar)) {
      return {
        textToInsert: '',
        deleteCount: 1, // remove the kar temporarily
        newState: { ...state, pendingG: true, pendingPrefixKar: lastChar },
      };
    }

    return {
      textToInsert: '',
      deleteCount: 0,
      newState: { ...state, pendingG: true },
    };
  }

  // If 'g' was pending:
  if (state.pendingG) {
    // Check if key is a vowel kar
    if (G_VOWEL_MAP[key] && !state.pendingPrefixKar) {
      const vowel = G_VOWEL_MAP[key];
      return {
        textToInsert: vowel,
        deleteCount: 0,
        newState: { ...state, pendingG: false },
      };
    }

    // If key maps to a consonant, form a conjunct (e.g., ক + ্ + ত)
    const mapped = BIJOY_KEY_MAP[key];
    if (mapped && isBengaliConsonant(mapped)) {
      let insert = '্' + mapped;
      let nextPrefixKar = state.pendingPrefixKar;
      if (nextPrefixKar) {
        insert += nextPrefixKar;
        nextPrefixKar = null;
      }
      return {
        textToInsert: insert,
        deleteCount: 0,
        newState: { ...state, pendingG: false, pendingPrefixKar: nextPrefixKar },
      };
    }

    // If not a vowel and not a conjunct consonant, insert '্' plus whatever key is
    const resolved = BIJOY_KEY_MAP[key] || key;
    let insert = '্' + resolved;
    if (state.pendingPrefixKar) {
      insert += state.pendingPrefixKar;
    }
    return {
      textToInsert: insert,
      deleteCount: 0,
      newState: { ...state, pendingG: false, pendingPrefixKar: null },
    };
  }

  // If key is Ref (Shift+A or 'A')
  if (key === 'A') {
    return {
      textToInsert: '',
      deleteCount: 0,
      newState: { ...state, pendingRef: true },
    };
  }

  // If user types 'f' (া) right after 'ে' (e-kar), merge into 'ো' (o-kar)
  if (key === 'f' && lastChar === 'ে') {
    return {
      textToInsert: 'ো',
      deleteCount: 1,
      newState: { ...state },
    };
  }

  // If user types 'X' / 'x' (ৌ) right after 'ে' (e-kar), merge into 'ৌ' (ou-kar)
  if ((key === 'X' || key === 'x') && lastChar === 'ে') {
    return {
      textToInsert: 'ৌ',
      deleteCount: 1,
      newState: { ...state },
    };
  }

  // If user types 'x' right after a consonant, produce 'ো' (o-kar)
  if (key === 'x' && lastChar && isBengaliConsonant(lastChar)) {
    return {
      textToInsert: 'ো',
      deleteCount: 0,
      newState: { ...state },
    };
  }

  // If user types 'X' right after a consonant, produce 'ৌ' (ou-kar)
  if (key === 'X' && lastChar && isBengaliConsonant(lastChar)) {
    return {
      textToInsert: 'ৌ',
      deleteCount: 0,
      newState: { ...state },
    };
  }

  // R-phala (z) after a Kar (e.g. টে + z -> ট্রে)
  if (key === 'z') {
    if (lastChar && isBengaliKar(lastChar)) {
      return {
        textToInsert: '্' + 'র' + lastChar,
        deleteCount: 1,
        newState: { ...state },
      };
    }
    return {
      textToInsert: '্' + 'র', // ্র
      deleteCount: 0,
      newState: { ...state },
    };
  }

  // Ya-phala (Z / Shift+Z) after a Kar (e.g. টে + Z -> ট্যে)
  if (key === 'Z') {
    if (lastChar && isBengaliKar(lastChar)) {
      return {
        textToInsert: '্' + 'য' + lastChar,
        deleteCount: 1,
        newState: { ...state },
      };
    }
    return {
      textToInsert: '্' + 'য', // ্য
      deleteCount: 0,
      newState: { ...state },
    };
  }

  // If key is prefix Kar: 'c' (ে), 'C' (ৈ), 'd' (ি)
  if ((key === 'c' || key === 'C' || key === 'd') && !state.pendingPrefixKar) {
    const karMap: Record<string, string> = {
      c: 'ে',
      C: 'ৈ',
      d: 'ি',
    };
    return {
      textToInsert: '',
      deleteCount: 0,
      newState: { ...state, pendingPrefixKar: karMap[key] },
    };
  }

  // If a prefix Kar was pending, and now user types a consonant:
  if (state.pendingPrefixKar) {
    const prefixKar = state.pendingPrefixKar;
    const mapped = BIJOY_KEY_MAP[key] || key;

    // Check if user types 'f' (া) right after 'c' (ে) -> ও-কার 'ো'
    if (prefixKar === 'ে' && key === 'f') {
      return {
        textToInsert: '',
        deleteCount: 0,
        newState: { ...state, pendingPrefixKar: 'ো' },
      };
    }
    // Check if user types 'X' / 'x' right after 'c' (ে) -> ঔ-কার 'ৌ'
    if (prefixKar === 'ে' && (key === 'X' || key === 'x')) {
      return {
        textToInsert: '',
        deleteCount: 0,
        newState: { ...state, pendingPrefixKar: 'ৌ' },
      };
    }

    if (isBengaliConsonant(mapped)) {
      let finalInsert = mapped + prefixKar;
      if (state.pendingRef) {
        finalInsert = 'র্' + finalInsert;
      }
      return {
        textToInsert: finalInsert,
        deleteCount: 0,
        newState: { ...state, pendingPrefixKar: null, pendingRef: false },
      };
    } else {
      // User pressed something else; flush the pending kar then the key
      return {
        textToInsert: prefixKar + mapped,
        deleteCount: 0,
        newState: { ...state, pendingPrefixKar: null },
      };
    }
  }

  // If Ref was pending:
  if (state.pendingRef) {
    const mapped = BIJOY_KEY_MAP[key] || key;
    return {
      textToInsert: 'র্' + mapped,
      deleteCount: 0,
      newState: { ...state, pendingRef: false },
    };
  }

  // General Key Map
  if (BIJOY_KEY_MAP[key] !== undefined) {
    const mapped = BIJOY_KEY_MAP[key];
    return {
      textToInsert: mapped,
      deleteCount: 0,
      newState: { ...state },
    };
  }

  // Space, Enter, or any unmapped character
  return {
    textToInsert: key,
    deleteCount: 0,
    newState: INITIAL_BIJOY_STATE,
  };
}

/**
 * Handle diff when text changes via onChangeText (Single Source of Truth)
 * Eliminates race conditions and duplicate keystrokes on Android OTG keyboards.
 */
export function handleBijoyTextChangeDiff(
  prevText: string,
  newText: string,
  state: BijoyEngineState
): { text: string; newState: BijoyEngineState } {
  let start = 0;
  while (
    start < prevText.length &&
    start < newText.length &&
    prevText[start] === newText[start]
  ) {
    start++;
  }

  let prevEnd = prevText.length;
  let newEnd = newText.length;
  while (
    prevEnd > start &&
    newEnd > start &&
    prevText[prevEnd - 1] === newText[newEnd - 1]
  ) {
    prevEnd--;
    newEnd--;
  }

  const inserted = newText.substring(start, newEnd);
  if (inserted.length === 0) {
    // Text was deleted / backspaced
    return { text: newText, newState: INITIAL_BIJOY_STATE };
  }

  let currentText = prevText.substring(0, start);
  let currentState = state;

  for (let i = 0; i < inserted.length; i++) {
    const char = inserted[i];
    const lastChar = currentText.length > 0 ? currentText[currentText.length - 1] : null;
    const res = processBijoyKey(char, lastChar, currentState);
    currentState = res.newState;

    if (res.deleteCount > 0) {
      currentText = currentText.slice(0, -res.deleteCount);
    }
    currentText += res.textToInsert;
  }

  const finalText = currentText + prevText.substring(prevEnd);
  return { text: finalText, newState: currentState };
}

/**
 * Convert an entire English Bijoy keystroke string to Unicode Bangla
 */
export function convertBijoyKeystrokesToUnicode(input: string): string {
  let state = INITIAL_BIJOY_STATE;
  let result = '';

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const lastChar = result.length > 0 ? result[result.length - 1] : null;
    const res = processBijoyKey(char, lastChar, state);
    state = res.newState;

    if (res.deleteCount > 0) {
      result = result.slice(0, -res.deleteCount);
    }
    result += res.textToInsert;
  }

  // Flush any remaining state
  if (state.pendingPrefixKar) {
    result += state.pendingPrefixKar;
  }
  if (state.pendingRef) {
    result += 'র্';
  }
  if (state.pendingG) {
    result += '্';
  }

  return result;
}
