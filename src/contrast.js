function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return null;
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function getLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) throw new Error('Código Hexadecimal inválido.');

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);

  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (brighter + 0.05) / (darker + 0.05);
  const formattedRatio = parseFloat(ratio.toFixed(2));

  return {
    ratio: formattedRatio,
    wcagAA: formattedRatio >= 4.5,
    wcagAAA: formattedRatio >= 7.0
  };
}

module.exports = { calculateContrastRatio, hexToRgb };