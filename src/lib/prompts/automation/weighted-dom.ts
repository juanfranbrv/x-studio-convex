/**
 * Weighted DOM Analysis script for Microlink
 * Calculates color prominence based on area, position, and element type
 */
export const WEIGHTED_DOM_SCRIPT = `
async ({ page }) => {
  return await page.evaluate(() => {
    const results = {};
    const fontResults = {};
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const toHex = (color) => {
      if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return null;
      if (color.startsWith('#')) return color.toUpperCase();
      const match = color.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
      if (!match) return null;
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      const a = match[4] ? parseFloat(match[4]) : 1;
      if (a < 0.1) return null;
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    };

    const cleanFontName = (fontFamily) => {
        if (!fontFamily) return null;
        const primary = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
        if (['inherit', 'initial', 'unset', 'FontAwesome', 'font-awesome', 'sans-serif', 'serif', 'monospace'].includes(primary.toLowerCase())) return null;
        return primary;
    };

    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2 || rect.top > 3000 || rect.bottom < 0) return;

      const style = window.getComputedStyle(el);
      
      const candidates = [
        { val: style.backgroundColor, w: 1.0 },
        { val: style.color, w: 0.15 },
        { val: style.borderColor, w: 0.05 }
      ];

      candidates.forEach(({ val, w }) => {
        const hex = toHex(val);
        if (!hex) return;
        
        const visibleW = Math.min(rect.right, vw) - Math.max(rect.left, 0);
        const visibleH = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        // Be more inclusive: if it's in the top 3000px, count it as visible for color purposes
        const area = Math.max(0, visibleW * visibleH);
        if (area < 5 && rect.top > 3000) return;

        const foldBonus = rect.top < 1000 ? 1.5 : 1.0;
        const totalW = area * w * foldBonus;

        results[hex] = (results[hex] || 0) + totalW;
      });

      // FONTS
      if (el.innerText && el.innerText.trim().length > 0) {
          const font = cleanFontName(style.fontFamily);
          if (font) {
              const visibleW = Math.min(rect.right, vw) - Math.max(rect.left, 0);
              const visibleH = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
              const area = Math.max(0, visibleW * visibleH);
              
              const isHeading = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName);
              const weight = isHeading ? 3.0 : 1.0;
              
              if (fontResults[font]) {
                  fontResults[font] += (area * weight);
              } else {
                  fontResults[font] = (area * weight);
              }
          }
      }
    });

    const sortedColors = Object.entries(results)
      .sort(([, a], [, b]) => (b) - (a))
      .slice(0, 15)
      .map(([hex]) => hex);

    const sortedComputedFonts = Object.entries(fontResults)
      .sort(([, a], [, b]) => (b) - (a))
      .slice(0, 5)
      .map(([font]) => font);

    // Google Fonts scraping via Link tags
    const linkFonts = [];
    document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(link => {
        try {
            const url = new URL(link.href);
            const familyParam = url.searchParams.get('family');
            if (familyParam) {
                const families = familyParam.split('|');
                families.forEach(f => {
                    const cleanName = f.split(':')[0].replace(/\\+/g, ' ');
                    if (cleanName && !linkFonts.includes(cleanName)) {
                        linkFonts.push(cleanName);
                    }
                });
            }
        } catch (e) {}
    });

    // Root Variables
    const variableFonts = [];
    try {
        const computedRoot = window.getComputedStyle(document.documentElement);
        ['--font-sans', '--font-serif', '--font-heading', '--font-primary'].forEach(v => {
            const val = computedRoot.getPropertyValue(v);
            const clean = cleanFontName(val);
            if (clean && !variableFonts.includes(clean)) variableFonts.push(clean);
        });
    } catch(e) {}

    // Logo Candidates
    const logoCandidates = [];
    document.querySelectorAll('img[src*="logo"], img[class*="logo"], img[id*="logo"], img[src*="brand"], [class*="logo"] img, [id*="logo"] img, header img').forEach(el => {
      const src = el.src;
      if (!src) return;
      const rect = el.getBoundingClientRect();
      let score = 50; 
      if (src.toLowerCase().includes('logo')) score += 50;
      if (el.className.toLowerCase().includes('logo') || el.id.toLowerCase().includes('logo')) score += 50;
      if (rect.width > 30 && rect.height > 10) score += 30;
      if (rect.top < 500) score += 40;
      
      logoCandidates.push({ url: src, score, type: 'url' });
    });

    const finalFonts = [...new Set([...linkFonts, ...variableFonts, ...sortedComputedFonts])].slice(0, 5);

    return { colors: sortedColors, fonts: finalFonts, logoCandidates: logoCandidates.sort((a,b) => b.score - a.score).slice(0, 5) };
  });
}
`;
