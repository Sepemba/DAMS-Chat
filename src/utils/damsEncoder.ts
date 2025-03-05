// DAMS Encoder/Decoder (2nd Variant)

// Quadro Padrão
const standardTable: Record<string, number> = {
  'd': 2, 'D': 2, 'u': 2, 'U': 2, 'y': 2, 'Y': 2, 'ú': 2, 'Ú': 2,
  'o': 3, 'O': 3, 'q': 3, 'Q': 3, 'a': 3, 'A': 3, 'ó': 3, 'Ó': 3, 'ô': 3, 'Ô': 3, 'ö': 3, 'Ö': 3, 'á': 3, 'Á': 3, 'â': 3, 'Â': 3, 'ã': 3, 'Ã': 3, 'à': 3, 'À': 3,
  'b': 4, 'B': 4, 'v': 4, 'V': 4, 'e': 4, 'E': 4, 'é': 4, 'É': 4, 'ê': 4, 'Ê': 4,
  'w': 5, 'W': 5, 'm': 5, 'M': 5, 'h': 5, 'H': 5,
  'i': 6, 'I': 6, 'z': 6, 'Z': 6, 't': 6, 'T': 6, 'c': 6, 'C': 6, 'í': 6, 'Í': 6, 'ç': 6, 'Ç': 6,
  'k': 7, 'K': 7, 'p': 7, 'P': 7, 'f': 7, 'F': 7, 'g': 7, 'G': 7,
  'l': 8, 'L': 8, 'n': 8, 'N': 8, 'r': 8, 'R': 8,
  'x': 9, 'X': 9, 's': 9, 'S': 9, 'j': 9, 'J': 9
};

// Tabela de pontuação
const punctuationTable: Record<string, string> = {
  '.': 'X|0',
  ',': 'XV|0',
  ';': 'XI|0',
  ':': 'XII|0',
  '!': 'XIII|0',
  '?': 'XIV|0',
  '-': 'XVI|0',
  '_': 'XVII|0',
  '(': 'XVIII|0',
  ')': 'XIX|0',
  '[': 'XX|0',
  ']': 'XXI|0',
  '{': 'XXII|0',
  '}': 'XXIII|0',
  '<': 'XXIV|0',
  '>': 'XXV|0',
  '/': 'XXVI|0',
  '\\': 'XXVII|0',
  '|': 'XXVIII|0',
  '@': 'XXIX|0',
  '#': 'XXX|0',
  '$': 'XXXI|0',
  '%': 'XXXII|0',
  '^': 'XXXIII|0',
  '&': 'XXXIV|0',
  '*': 'XXXV|0',
  '+': 'XXXVI|0',
  '=': 'XXXVII|0',
  '~': 'XXXVIII|0',
  '`': 'XXXIX|0',
  '"': 'XL|0',
  "'": 'XLI|0'
};

// Função para converter número para romano
function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  
  let result = '';
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

// Função para verificar se um caractere é acentuado
function isAccented(char: string): boolean {
  return /[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(char);
}

// Função para obter o valor NAC para caracteres acentuados
function getNAC(char: string): number {
  const accentMap: Record<string, number> = {
    'á': 4, 'Á': 4, 'à': 5, 'À': 5, 'â': 3, 'Â': 3, 'ã': 2, 'Ã': 2,
    'é': 4, 'É': 4, 'è': 5, 'È': 5, 'ê': 3, 'Ê': 3,
    'í': 2, 'Í': 2, 'ì': 5, 'Ì': 5, 'î': 3, 'Î': 3,
    'ó': 5, 'Ó': 5, 'ò': 4, 'Ò': 4, 'ô': 3, 'Ô': 3, 'õ': 2, 'Õ': 2,
    'ú': 5, 'Ú': 5, 'ù': 4, 'Ù': 4, 'û': 3, 'Û': 3,
    'ç': 2, 'Ç': 2
  };
  
  return accentMap[char] || 0;
}

// Função para codificar uma letra
function encodeChar(char: string): string {
  // Verificar se é um número
  if (/[0-9]/.test(char)) {
    return numberTable[char];
  }
  
  // Verificar se é uma pontuação
  if (punctuationTable[char]) {
    return punctuationTable[char];
  }
  
  // Obter o NUDAL do caractere
  const nudal = standardTable[char.toLowerCase()];
  if (!nudal) {
    return char; // Retorna o caractere original se não estiver na tabela
  }
  
  // Verificar se é maiúscula ou minúscula
  const isUpperCase = char === char.toUpperCase() && char !== char.toLowerCase();
  
  // Verificar se é acentuado
  const hasAccent = isAccented(char);
  
  let encoded = '';
  
  if (isUpperCase) {
    if (hasAccent) {
      // Maiúscula acentuada: NUDAL|NOL NOL NAC
      encoded = `${nudal}|11${getNAC(char)}`;
    } else {
      // Maiúscula: NUDAL|NOL NOL
      encoded = `${nudal}|11`;
    }
  } else {
    if (hasAccent) {
      // Minúscula acentuada: NOL|NUDAL NUSEP NAC
      encoded = `1|${nudal}0${getNAC(char)}`;
    } else {
      // Minúscula: NOL|NUDAL
      encoded = `1|${nudal}`;
    }
  }
  
  return encoded;
}

// Tabela de números
const numberTable: Record<string, string> = {
  '0': '100',
  '1': '101',
  '2': '204',
  '3': '206',
  '4': '208',
  '5': '409',
  '6': '309',
  '7': '209',
  '8': '109',
  '9': '0909'
};

// Função para obter o NEDAB de um número codificado
function getNEDAB(encodedNumber: string): number {
  return parseInt(encodedNumber[0]);
}

// Função para codificar uma string completa
export function encodeDAMS(text: string): string {
  if (!text) return '';
  
  let result = '';
  let prevNudal: number | undefined;
  let prevNedab: number | undefined;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === ' ') {
      // Processar espaço - precisamos do caractere anterior e posterior
      if (i > 0 && i < text.length - 1) {
        const prevChar = text[i - 1];
        const nextChar = text[i + 1];
        
        // Verificar se os caracteres são números
        const isPrevNumber = /[0-9]/.test(prevChar);
        const isNextNumber = /[0-9]/.test(nextChar);
        
        if (isPrevNumber && isNextNumber) {
          // Espaço entre números
          const prevCode = numberTable[prevChar];
          const nextCode = numberTable[nextChar];
          const diff = Math.abs(getNEDAB(prevCode) - getNEDAB(nextCode));
          result += toRoman(diff);
        } else if (isPrevNumber) {
          // Espaço entre número e letra
          const prevCode = numberTable[prevChar];
          const nextNudal = standardTable[nextChar.toLowerCase()] || 0;
          const diff = Math.abs(getNEDAB(prevCode) - nextNudal);
          result += toRoman(diff);
        } else if (isNextNumber) {
          // Espaço entre letra e número
          const prevNudal = standardTable[prevChar.toLowerCase()] || 0;
          const nextCode = numberTable[nextChar];
          const diff = Math.abs(prevNudal - getNEDAB(nextCode));
          result += 'I';
        } else {
          // Espaço entre letras (comportamento existente)
          const prevNudalValue = standardTable[prevChar.toLowerCase()] || 0;
          const nextNudalValue = standardTable[nextChar.toLowerCase()] || 0;
          const diff = Math.abs(prevNudalValue - nextNudalValue);
          result += toRoman(diff);
        }
      }
    } else {
      // Verificar se é um número
      if (/[0-9]/.test(char)) {
        if (i > 0 && text[i - 1] !== ' ') {
          result += 'I';
        }
        result += numberTable[char];
      } else {
        const encoded = encodeChar(char);
        if (i > 0 && text[i - 1] !== ' ' && !encoded.includes('|0')) {
          result += '|';
        }
        result += encoded;
      }
    }
  }
  
  return result;
}

// Função para decodificar uma string DAMS
export function decodeDAMS(encoded: string): string {
  if (!encoded) return '';

  const parts = encoded.split(/(?=[IVX]+|\d{3}|\|)/g);
  let decoded = '';
  let i = 0;

  while (i < parts.length) {
    const part = parts[i].trim();

    // Verificar se é um número codificado
    const isEncodedNumber = Object.values(numberTable).includes(part);
    if (isEncodedNumber) {
      for (const [num, code] of Object.entries(numberTable)) {
        if (code === part) {
          decoded += num;
          break;
        }
      }
      i++;
      continue;
    }

    // Verificar se é um espaço (numerais romanos)
    if (/^[IVXLCDM]+$/.test(part)) {
      decoded += ' ';
      i++;
      continue;
    }

    // Verificar se é pontuação
    if (part.endsWith('0')) {
      for (const [char, code] of Object.entries(punctuationTable)) {
        if (code === `${part}|0`) {
          decoded += char;
          break;
        }
      }
      i++;
      continue;
    }

    // Processar caractere normal
    if (part.startsWith('|')) {
      const nol = parts[i].includes('1|');
      const nudal = parseInt(nol ? parts[i + 1] : parts[i].replace('|', ''));
      const hasAccent = parts[i + 2] && /^\d+$/.test(parts[i + 2]);

      for (const [char, value] of Object.entries(standardTable)) {
        if (value === nudal) {
          let resultChar = char;
          if (nol) {
            resultChar = char.toLowerCase();
          } else {
            resultChar = char.toUpperCase();
          }
          decoded += resultChar;
          break;
        }
      }

      i += nol ? 2 : 1;
      if (hasAccent) i++;
    } else {
      i++;
    }
  }

  return decoded;
}