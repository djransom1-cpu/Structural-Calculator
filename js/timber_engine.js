/**
 * Comprehensive Timber & Engineered Wood Engine
 * Supports:
 * - Dimension Lumber (Douglas Fir, Southern Pine, SPF, Hem-Fir)
 * - LVL (Laminated Veneer Lumber - 1.7E, 1.9E, 2.0E Versa-Lam / Microllam)
 * - Glulam (Glued Laminated Timber - 24F-V4 / 24F-1.8E)
 * - PSL (Parallel Strand Lumber / Parallam)
 * - Wood I-Joists (TJI 110, 210, 360, 560 series)
 */

export const TIMBER_SPECIES = [
  // Dimension Lumber
  { name: "Douglas Fir-Larch #2", type: "sawn", Fb: 900, Ft: 575, Fv: 180, Fc: 1350, E: 1600000 },
  { name: "Southern Pine #2", type: "sawn", Fb: 1100, Ft: 675, Fv: 175, Fc: 1450, E: 1400000 },
  { name: "Spruce-Pine-Fir (SPF) #2", type: "sawn", Fb: 875, Ft: 450, Fv: 135, Fc: 1150, E: 1400000 },
  { name: "Hem-Fir #1/#2", type: "sawn", Fb: 850, Ft: 525, Fv: 150, Fc: 1300, E: 1500000 },

  // Engineered Wood - LVL (Laminated Veneer Lumber)
  { name: "1.9E LVL (Microllam / Versa-Lam)", type: "lvl", Fb: 2800, Ft: 1550, Fv: 285, Fc: 2500, E: 1900000 },
  { name: "2.0E LVL (High-Cap Header)", type: "lvl", Fb: 2900, Ft: 1650, Fv: 290, Fc: 2600, E: 2000000 },
  { name: "1.7E LVL (Standard Beam)", type: "lvl", Fb: 2600, Ft: 1400, Fv: 275, Fc: 2400, E: 1700000 },

  // Glulam (Glued Laminated Timber)
  { name: "Glulam 24F-V4 (Southern Pine)", type: "glulam", Fb: 2400, Ft: 1150, Fv: 240, Fc: 1650, E: 1800000 },
  { name: "Glulam 24F-1.8E (Doug Fir)", type: "glulam", Fb: 2400, Ft: 1100, Fv: 265, Fc: 1600, E: 1800000 },

  // PSL (Parallel Strand Lumber / Parallam)
  { name: "2.0E PSL (Parallam Heavy Post/Beam)", type: "psl", Fb: 2900, Ft: 2025, Fv: 290, Fc: 2900, E: 2000000 }
];

export const LUMBER_SIZES = [
  // Sawn Lumber Sizes
  { name: "2x4", category: "sawn", b: 1.5, d: 3.5, A: 5.25, Sx: 3.06, Ix: 5.36 },
  { name: "2x6", category: "sawn", b: 1.5, d: 5.5, A: 8.25, Sx: 7.56, Ix: 20.80 },
  { name: "2x8", category: "sawn", b: 1.5, d: 7.25, A: 10.88, Sx: 13.14, Ix: 47.63 },
  { name: "2x10", category: "sawn", b: 1.5, d: 9.25, A: 13.88, Sx: 21.39, Ix: 98.93 },
  { name: "2x12", category: "sawn", b: 1.5, d: 11.25, A: 16.88, Sx: 31.64, Ix: 177.98 },

  { name: "4x6", category: "sawn", b: 3.5, d: 5.5, A: 19.25, Sx: 17.65, Ix: 48.53 },
  { name: "4x8", category: "sawn", b: 3.5, d: 7.25, A: 25.38, Sx: 30.66, Ix: 111.13 },
  { name: "4x10", category: "sawn", b: 3.5, d: 9.25, A: 32.38, Sx: 49.91, Ix: 230.84 },
  { name: "4x12", category: "sawn", b: 3.5, d: 11.25, A: 39.38, Sx: 73.83, Ix: 415.28 },

  { name: "6x6", category: "sawn", b: 5.5, d: 5.5, A: 30.25, Sx: 27.73, Ix: 76.26 },
  { name: "6x8", category: "sawn", b: 5.5, d: 7.25, A: 39.88, Sx: 48.18, Ix: 174.67 },

  // LVL Single-Ply & Multi-Ply Beams (1-3/4" width per ply)
  { name: "(1-Ply) 1-3/4 x 7-1/4 LVL", category: "lvl", b: 1.75, d: 7.25, A: 12.69, Sx: 15.33, Ix: 55.57 },
  { name: "(1-Ply) 1-3/4 x 9-1/4 LVL", category: "lvl", b: 1.75, d: 9.25, A: 16.19, Sx: 24.96, Ix: 115.42 },
  { name: "(1-Ply) 1-3/4 x 11-7/8 LVL", category: "lvl", b: 1.75, d: 11.875, A: 20.78, Sx: 41.13, Ix: 244.23 },
  { name: "(1-Ply) 1-3/4 x 14 LVL", category: "lvl", b: 1.75, d: 14.0, A: 24.50, Sx: 57.17, Ix: 400.17 },
  { name: "(1-Ply) 1-3/4 x 16 LVL", category: "lvl", b: 1.75, d: 16.0, A: 28.00, Sx: 74.67, Ix: 597.33 },
  { name: "(1-Ply) 1-3/4 x 18 LVL", category: "lvl", b: 1.75, d: 18.0, A: 31.50, Sx: 94.50, Ix: 850.50 },

  { name: "(2-Ply) 3-1/2 x 9-1/4 LVL", category: "lvl", b: 3.5, d: 9.25, A: 32.38, Sx: 49.91, Ix: 230.84 },
  { name: "(2-Ply) 3-1/2 x 11-7/8 LVL", category: "lvl", b: 3.5, d: 11.875, A: 41.56, Sx: 82.26, Ix: 488.46 },
  { name: "(2-Ply) 3-1/2 x 14 LVL", category: "lvl", b: 3.5, d: 14.0, A: 49.00, Sx: 114.33, Ix: 800.33 },
  { name: "(2-Ply) 3-1/2 x 16 LVL", category: "lvl", b: 3.5, d: 16.0, A: 56.00, Sx: 149.33, Ix: 1194.67 },
  { name: "(2-Ply) 3-1/2 x 18 LVL", category: "lvl", b: 3.5, d: 18.0, A: 63.00, Sx: 189.00, Ix: 1701.00 },

  { name: "(3-Ply) 5-1/4 x 11-7/8 LVL", category: "lvl", b: 5.25, d: 11.875, A: 62.34, Sx: 123.39, Ix: 732.69 },
  { name: "(3-Ply) 5-1/4 x 14 LVL", category: "lvl", b: 5.25, d: 14.0, A: 73.50, Sx: 171.50, Ix: 1200.50 },
  { name: "(3-Ply) 5-1/4 x 16 LVL", category: "lvl", b: 5.25, d: 16.0, A: 84.00, Sx: 224.00, Ix: 1792.00 },
  { name: "(3-Ply) 5-1/4 x 18 LVL", category: "lvl", b: 5.25, d: 18.0, A: 94.50, Sx: 283.50, Ix: 2551.50 },

  { name: "(4-Ply) 7 x 14 LVL Header", category: "lvl", b: 7.0, d: 14.0, A: 98.00, Sx: 228.67, Ix: 1600.67 },
  { name: "(4-Ply) 7 x 16 LVL Header", category: "lvl", b: 7.0, d: 16.0, A: 112.00, Sx: 298.67, Ix: 2389.33 },
  { name: "(4-Ply) 7 x 18 LVL Header", category: "lvl", b: 7.0, d: 18.0, A: 126.00, Sx: 378.00, Ix: 3402.00 },

  // Glulam Heavy Architectural Beams
  { name: "3-1/8 x 12 Glulam", category: "glulam", b: 3.125, d: 12.0, A: 37.50, Sx: 75.00, Ix: 450.00 },
  { name: "3-1/2 x 11-7/8 Architectural Glulam", category: "glulam", b: 3.5, d: 11.875, A: 41.56, Sx: 82.26, Ix: 488.46 },
  { name: "5-1/8 x 15 Architectural Glulam", category: "glulam", b: 5.125, d: 15.0, A: 76.88, Sx: 192.19, Ix: 1441.41 },
  { name: "6-3/4 x 18 Heavy Glulam", category: "glulam", b: 6.75, d: 18.0, A: 121.50, Sx: 364.50, Ix: 3280.50 },

  // TJI Wood I-Joist Series
  { name: "9-1/2 TJI 110 I-Joist", category: "ijoist", b: 1.75, d: 9.5, A: 3.5, Sx: 12.4, Ix: 58.9 },
  { name: "11-7/8 TJI 210 I-Joist", category: "ijoist", b: 2.1, d: 11.875, A: 4.8, Sx: 22.8, Ix: 135.5 },
  { name: "14 TJI 360 Heavy I-Joist", category: "ijoist", b: 2.3, d: 14.0, A: 6.2, Sx: 38.5, Ix: 269.5 },
  { name: "16 TJI 560 Heavy I-Joist", category: "ijoist", b: 3.5, d: 16.0, A: 8.5, Sx: 65.2, Ix: 521.6 }
];

export function analyzeTimberMember(inputs) {
  const species = TIMBER_SPECIES.find(s => s.name === inputs.speciesName) || TIMBER_SPECIES[0];
  const size = LUMBER_SIZES.find(s => s.name === inputs.sizeName) || LUMBER_SIZES[3];

  const L_ft = inputs.L_ft || 14.0;
  const w_plf = inputs.w_plf || 120;
  const Cd = inputs.Cd || 1.15;
  const Cr = inputs.Cr || 1.15;

  const L_in = L_ft * 12;

  const M_max_lbin = (w_plf * Math.pow(L_ft, 2) * 12) / 8;
  const M_max_lbft = M_max_lbin / 12;

  const fb_psi = M_max_lbin / size.Sx;
  const Fb_prime_psi = species.Fb * Cd * Cr;
  const stressRatio = fb_psi / Fb_prime_psi;

  const w_pli = w_plf / 12;
  const delta_max_in = (5 * w_pli * Math.pow(L_in, 4)) / (384 * species.E * size.Ix);

  const L360_in = L_in / 360;
  const L240_in = L_in / 240;
  const passStress = fb_psi <= Fb_prime_psi;
  const passDeflection = delta_max_in <= L240_in;
  const isPass = passStress && passDeflection;

  return {
    speciesName: species.name,
    sizeName: size.name,
    L_ft,
    M_max_lbft,
    fb_psi,
    Fb_prime_psi,
    stressRatio,
    delta_max_in,
    L360_in,
    L240_in,
    passStress,
    passDeflection,
    isPass
  };
}
