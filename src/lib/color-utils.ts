/**
 * Color Utilities for Advanced Consensus & Branding
 */

export interface RGB { r: number; g: number; b: number; }
export interface LAB { l: number; a: number; b: number; }

export function hexToRgb(hex: string): RGB {
    // Validate input
    if (!hex || typeof hex !== 'string') {
        return { r: 0, g: 0, b: 0 };
    }

    // Ensure hex starts with #
    const cleanHex = hex.startsWith('#') ? hex : '#' + hex;

    // Validate hex length
    if (cleanHex.length !== 7) {
        return { r: 0, g: 0, b: 0 };
    }

    const r = parseInt(cleanHex.slice(1, 3), 16);
    const g = parseInt(cleanHex.slice(3, 5), 16);
    const b = parseInt(cleanHex.slice(5, 7), 16);

    // Validate parsed values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return { r: 0, g: 0, b: 0 };
    }

    return { r, g, b };
}

export function rgbToLab(rgb: RGB): LAB {
    // 1. Normalize RGB
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    r *= 100;
    g *= 100;
    b *= 100;

    // 2. RGB to XYZ
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    // 3. XYZ to LAB
    let xNorm = x / 95.047;
    let yNorm = y / 100.000;
    let zNorm = z / 108.883;

    xNorm = xNorm > 0.008856 ? Math.pow(xNorm, 1 / 3) : (7.787 * xNorm) + (16 / 116);
    yNorm = yNorm > 0.008856 ? Math.pow(yNorm, 1 / 3) : (7.787 * yNorm) + (16 / 116);
    zNorm = zNorm > 0.008856 ? Math.pow(zNorm, 1 / 3) : (7.787 * zNorm) + (16 / 116);

    const l = (116 * yNorm) - 16;
    const a = 500 * (xNorm - yNorm);
    const bLab = 200 * (yNorm - zNorm);

    return { l, a, b: bLab };
}

/**
 * Delta E (CIE76) - Simple but effective perceptual distance
 */
export function deltaE(hex1: string, hex2: string): number {
    const lab1 = rgbToLab(hexToRgb(hex1));
    const lab2 = rgbToLab(hexToRgb(hex2));

    return Math.sqrt(
        Math.pow(lab2.l - lab1.l, 2) +
        Math.pow(lab2.a - lab1.a, 2) +
        Math.pow(lab2.b - lab1.b, 2)
    );
}

/**
 * Hierarchical clustering based on Delta E distance
 */
export function clusterColors(colorsWithWeights: { hex: string, weight: number }[], threshold = 10): { representative: string, score: number, originalColors: string[] }[] {
    const clusters: { representative: string, score: number, originalColors: string[] }[] = [];

    // Sort by weight to prioritize strongest signals as representatives
    const sorted = [...colorsWithWeights].sort((a, b) => b.weight - a.weight);

    for (const item of sorted) {
        let foundCluster = false;
        for (const cluster of clusters) {
            if (deltaE(item.hex, cluster.representative) < threshold) {
                // Add weight and color to existing cluster
                cluster.score += item.weight;
                if (!cluster.originalColors.includes(item.hex)) {
                    cluster.originalColors.push(item.hex);
                }
                foundCluster = true;
                break;
            }
        }

        if (!foundCluster) {
            clusters.push({
                representative: item.hex,
                score: item.weight,
                originalColors: [item.hex]
            });
        }
    }

    return clusters.sort((a, b) => b.score - a.score);
}

/**
 * Categorize a color into a brand role
 */
export function categorizeColorRole(hex: string, allConsensusColors: { color: string, score: number }[]): string {
    const { l, a, b } = rgbToLab(hexToRgb(hex));
    const chroma = Math.sqrt(a * a + b * b);

    // Very light or very dark
    if (l > 92) return 'Background';
    if (l < 12) return 'Text';

    // Filter out neutrals for Primary/Secondary detection
    const nonNeutral = allConsensusColors.filter(c => {
        const lab = rgbToLab(hexToRgb(c.color));
        const cChroma = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
        return lab.l > 12 && lab.l < 92 && cChroma > 10;
    });

    if (hex === nonNeutral[0]?.color) return 'Primary';
    if (hex === nonNeutral[1]?.color) return 'Secondary';

    if (chroma > 25) return 'Accent';

    return 'Neutral';
}

/**
 * Basic harmony check
 */
export function getHarmonyBonus(hex1: string, hex2: string): number {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    const hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
    const hsl2 = rgbToHsl(rgb2.r, rgb2.g, rgb2.b);

    const hueDiff = Math.abs(hsl1.h - hsl2.h);
    const normalizedDiff = hueDiff > 180 ? 360 - hueDiff : hueDiff;

    // Complementary (~180 deg)
    if (Math.abs(normalizedDiff - 180) < 25) return 0.2;
    // Analogous (~30 deg)
    if (normalizedDiff > 5 && normalizedDiff < 35) return 0.1;
    // Triadic (~120 deg)
    if (Math.abs(normalizedDiff - 120) < 20) return 0.15;

    return 0;
}

function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s, l: l * 100 };
}
