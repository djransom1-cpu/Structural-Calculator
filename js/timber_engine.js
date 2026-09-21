/**
 * Timber & Engineered Wood Calculation Engine (NDS 2018 Standards)
 * Includes NDS Table 4A Size Factor (CF), Duration Factor (CD), Repetitive Factor (Cr),
 * exact piecewise moment, shear, and deflection solvers,
 * ASCE 7 / IBC Wind Net Uplift Load Combinations (0.6D - 0.6W ASD / 0.9D - 1.0W LRFD)
 * & Hold-Down Tension Reactions.
 */

export const TIMBER_SPECIES = [
  { name: "DF-L Select Structural", Fb: 1500, Fv: 180, E: 1900000, category: "DF-L" },
  { name: "DF-L No. 1", Fb: 1000, Fv: 180, E: 1700000, category: "DF-L" },
  { name: "DF-L No. 2", Fb: 900, Fv: 180, E: 1600000, category: "DF-L" },
  { name: "DF-L Stud", Fb: 700, Fv: 180, E: 1400000, category: "DF-L" },
  { name: "SYP Select Structural", Fb: 1550, Fv: 175, E: 1800000, category: "SYP" },
  { name: "SYP No. 1", Fb: 1250, Fv: 175, E: 1600000, category: "SYP" },
  { name: "SYP No. 2", Fb: 925, Fv: 175, E: 1400000, category: "SYP" },
  { name: "SYP Prime", Fb: 1100, Fv: 175, E: 1500000, category: "SYP" },
  { name: "Hem-Fir Select Structural", Fb: 1300, Fv: 150, E: 1600000, category: "HF" },
  { name: "Hem-Fir No. 1", Fb: 925, Fv: 150, E: 1500000, category: "HF" },
  { name: "Hem-Fir No. 2", Fb: 850, Fv: 150, E: 1300000, category: "HF" },
  { name: "SPF Select Structural", Fb: 1250, Fv: 135, E: 1500000, category: "SPF" },
  { name: "SPF No. 1/No. 2", Fb: 875, Fv: 135, E: 1400000, category: "SPF" },
  { name: "Western Red Cedar (WRC) Select Struct", Fb: 1000, Fv: 140, E: 1100000, category: "Cedar" },
  { name: "Western Red Cedar (WRC) No. 1/No. 2", Fb: 700, Fv: 140, E: 1000000, category: "Cedar" },
  { name: "Alaska Yellow Cedar No. 1", Fb: 1250, Fv: 180, E: 1400000, category: "Cedar" },
  { name: "Northern White Cedar", Fb: 575, Fv: 115, E: 800000, category: "Cedar" },
  { name: "LVL 2.0E (Microllam/Versa-Lam)", Fb: 2600, Fv: 285, E: 2000000, category: "LVL" },
  { name: "LVL 1.9E", Fb: 2250, Fv: 285, E: 1900000, category: "LVL" },
  { name: "Glulam 24F-V4 (Architectural)", Fb: 2400, Fv: 240, E: 1800000, category: "Glulam" },
  { name: "Glulam 24F-1.8E", Fb: 2400, Fv: 210, E: 1800000, category: "Glulam" },
  { name: "PSL Parallam 2.0E", Fb: 2900, Fv: 290, E: 2000000, category: "PSL" },
  { name: "TJI Engineered Wood I-Joist", Fb: 2100, Fv: 230, E: 1750000, category: "TJI" }
];

export const TIMBER_FAMILIES = {
  'builtup': 'Custom Built-Up Header / Beam (# Plies x Width x Depth)',
  'sawn': 'Dimension Sawn Lumber (2x4 to 4x12)',
  'timber': 'Heavy Timber Posts & Beams (4x4 to 12x12)',
  'lvl': 'LVL Engineered Beams (1-3/4" Plies)',
  'glulam': 'Glulam Architectural Beams',
  'psl': 'PSL Parallam Heavy Beams',
  'ijoist': 'TJI Wood I-Joists'
};

export const TIMBER_MEMBERS = [
  { name: "2x4", category: "sawn", b: 1.5, d: 3.5, Area: 5.25, Sx: 3.06, Ix: 5.36, weight: 1.5, CF: 1.5 },
  { name: "2x6", category: "sawn", b: 1.5, d: 5.5, Area: 8.25, Sx: 7.56, Ix: 20.80, weight: 2.3, CF: 1.3 },
  { name: "2x8", category: "sawn", b: 1.5, d: 7.25, Area: 10.88, Sx: 13.14, Ix: 47.63, weight: 3.1, CF: 1.2 },
  { name: "2x10", category: "sawn", b: 1.5, d: 9.25, Area: 13.88, Sx: 21.39, Ix: 98.93, weight: 4.0, CF: 1.1 },
  { name: "2x12", category: "sawn", b: 1.5, d: 11.25, Area: 16.88, Sx: 31.64, Ix: 177.98, weight: 4.8, CF: 1.0 },
  { name: "3x6", category: "sawn", b: 2.5, d: 5.5, Area: 13.75, Sx: 12.60, Ix: 34.66, weight: 3.9, CF: 1.3 },
  { name: "3x8", category: "sawn", b: 2.5, d: 7.25, Area: 18.13, Sx: 21.90, Ix: 79.39, weight: 5.2, CF: 1.2 },
  { name: "3x10", category: "sawn", b: 2.5, d: 9.25, Area: 23.13, Sx: 35.65, Ix: 164.89, weight: 6.6, CF: 1.1 },
  { name: "3x12", category: "sawn", b: 2.5, d: 11.25, Area: 28.13, Sx: 52.73, Ix: 296.63, weight: 8.0, CF: 1.0 },
  { name: "4x4", category: "timber", b: 3.5, d: 3.5, Area: 12.25, Sx: 7.15, Ix: 12.51, weight: 3.6, CF: 1.5 },
  { name: "4x6", category: "timber", b: 3.5, d: 5.5, Area: 19.25, Sx: 17.65, Ix: 48.53, weight: 5.5, CF: 1.3 },
  { name: "4x8", category: "timber", b: 3.5, d: 7.25, Area: 25.38, Sx: 30.66, Ix: 111.15, weight: 7.2, CF: 1.2 },
  { name: "4x10", category: "timber", b: 3.5, d: 9.25, Area: 32.38, Sx: 49.91, Ix: 230.84, weight: 9.2, CF: 1.1 },
  { name: "4x12", category: "timber", b: 3.5, d: 11.25, Area: 39.38, Sx: 73.83, Ix: 415.28, weight: 11.2, CF: 1.0 },
  { name: "6x6", category: "timber", b: 5.5, d: 5.5, Area: 30.25, Sx: 27.73, Ix: 76.26, weight: 8.6, CF: 1.0 },
  { name: "6x8", category: "timber", b: 5.5, d: 7.5, Area: 41.25, Sx: 51.56, Ix: 193.36, weight: 11.8, CF: 1.0 },
  { name: "6x10", category: "timber", b: 5.5, d: 9.5, Area: 52.25, Sx: 82.73, Ix: 392.96, weight: 14.9, CF: 1.0 },
  { name: "6x12", category: "timber", b: 5.5, d: 11.5, Area: 63.25, Sx: 121.23, Ix: 697.07, weight: 18.0, CF: 1.0 },
  { name: "8x8", category: "timber", b: 7.5, d: 7.5, Area: 56.25, Sx: 70.31, Ix: 263.67, weight: 16.0, CF: 1.0 },
  { name: "8x10", category: "timber", b: 7.5, d: 9.5, Area: 71.25, Sx: 112.81, Ix: 535.86, weight: 20.3, CF: 1.0 },
  { name: "8x12", category: "timber", b: 7.5, d: 11.5, Area: 86.25, Sx: 165.31, Ix: 950.55, weight: 24.6, CF: 1.0 },
  { name: "10x10", category: "timber", b: 9.5, d: 9.5, Area: 90.25, Sx: 142.90, Ix: 678.76, weight: 25.7, CF: 1.0 },
  { name: "12x12", category: "timber", b: 11.5, d: 11.5, Area: 132.25, Sx: 253.48, Ix: 1457.51, weight: 37.7, CF: 1.0 },
  { name: "LVL 1-3/4x7-1/4", category: "lvl", b: 1.75, d: 7.25, Area: 12.69, Sx: 15.33, Ix: 55.57, weight: 3.7, CF: 1.0 },
  { name: "LVL 1-3/4x9-1/4", category: "lvl", b: 1.75, d: 9.25, Area: 16.19, Sx: 24.96, Ix: 115.42, weight: 4.7, CF: 1.0 },
  { name: "LVL 1-3/4x9-1/2", category: "lvl", b: 1.75, d: 9.50, Area: 16.63, Sx: 26.32, Ix: 125.04, weight: 4.8, CF: 1.0 },
  { name: "LVL 1-3/4x11-1/4", category: "lvl", b: 1.75, d: 11.25, Area: 19.69, Sx: 36.91, Ix: 207.64, weight: 5.7, CF: 1.0 },
  { name: "LVL 1-3/4x11-7/8", category: "lvl", b: 1.75, d: 11.875, Area: 20.78, Sx: 41.13, Ix: 244.22, weight: 6.0, CF: 1.0 },
  { name: "LVL 1-3/4x14", category: "lvl", b: 1.75, d: 14.0, Area: 24.50, Sx: 57.17, Ix: 400.17, weight: 7.1, CF: 1.0 },
  { name: "LVL 1-3/4x16", category: "lvl", b: 1.75, d: 16.0, Area: 28.00, Sx: 74.67, Ix: 597.33, weight: 8.1, CF: 1.0 },
  { name: "LVL 1-3/4x18", category: "lvl", b: 1.75, d: 18.0, Area: 31.50, Sx: 94.50, Ix: 850.50, weight: 9.1, CF: 1.0 },
  { name: "LVL 1-3/4x20", category: "lvl", b: 1.75, d: 20.0, Area: 35.00, Sx: 116.67, Ix: 1166.67, weight: 10.1, CF: 1.0 },
  { name: "LVL 1-3/4x22", category: "lvl", b: 1.75, d: 22.0, Area: 38.50, Sx: 141.17, Ix: 1552.83, weight: 11.1, CF: 1.0 },
  { name: "LVL 1-3/4x24", category: "lvl", b: 1.75, d: 24.0, Area: 42.00, Sx: 168.00, Ix: 2016.00, weight: 12.1, CF: 1.0 },
  { name: "Glulam 3-1/8x9", category: "glulam", b: 3.125, d: 9, Area: 28.13, Sx: 42.19, Ix: 189.84, weight: 6.8, CF: 1.0 },
  { name: "Glulam 5-1/8x9", category: "glulam", b: 5.125, d: 9, Area: 46.13, Sx: 69.19, Ix: 311.34, weight: 11.2, CF: 1.0 },
  { name: "Glulam 6-3/4x9", category: "glulam", b: 6.75, d: 9, Area: 60.75, Sx: 91.13, Ix: 410.06, weight: 14.8, CF: 1.0 },
  { name: "Glulam 8-3/4x9", category: "glulam", b: 8.75, d: 9, Area: 78.75, Sx: 118.13, Ix: 531.56, weight: 19.1, CF: 1.0 },
  { name: "Glulam 10-3/4x9", category: "glulam", b: 10.75, d: 9, Area: 96.75, Sx: 145.13, Ix: 653.06, weight: 23.5, CF: 1.0 },
  { name: "Glulam 3-1/8x10-1/2", category: "glulam", b: 3.125, d: 10.5, Area: 32.81, Sx: 57.42, Ix: 301.46, weight: 8.0, CF: 1.0 },
  { name: "Glulam 5-1/8x10-1/2", category: "glulam", b: 5.125, d: 10.5, Area: 53.81, Sx: 94.17, Ix: 494.40, weight: 13.1, CF: 1.0 },
  { name: "Glulam 6-3/4x10-1/2", category: "glulam", b: 6.75, d: 10.5, Area: 70.88, Sx: 124.03, Ix: 651.16, weight: 17.2, CF: 1.0 },
  { name: "Glulam 8-3/4x10-1/2", category: "glulam", b: 8.75, d: 10.5, Area: 91.88, Sx: 160.78, Ix: 844.10, weight: 22.3, CF: 1.0 },
  { name: "Glulam 10-3/4x10-1/2", category: "glulam", b: 10.75, d: 10.5, Area: 112.88, Sx: 197.53, Ix: 1037.04, weight: 27.4, CF: 1.0 },
  { name: "Glulam 3-1/8x12", category: "glulam", b: 3.125, d: 12, Area: 37.50, Sx: 75.00, Ix: 450.00, weight: 9.1, CF: 1.0 },
  { name: "Glulam 5-1/8x12", category: "glulam", b: 5.125, d: 12, Area: 61.50, Sx: 123.00, Ix: 738.00, weight: 14.9, CF: 1.0 },
  { name: "Glulam 6-3/4x12", category: "glulam", b: 6.75, d: 12, Area: 81.00, Sx: 162.00, Ix: 972.00, weight: 19.7, CF: 1.0 },
  { name: "Glulam 8-3/4x12", category: "glulam", b: 8.75, d: 12, Area: 105.00, Sx: 210.00, Ix: 1260.00, weight: 25.5, CF: 1.0 },
  { name: "Glulam 10-3/4x12", category: "glulam", b: 10.75, d: 12, Area: 129.00, Sx: 258.00, Ix: 1548.00, weight: 31.4, CF: 1.0 },
  { name: "Glulam 3-1/8x13-1/2", category: "glulam", b: 3.125, d: 13.5, Area: 42.19, Sx: 94.92, Ix: 640.72, weight: 10.3, CF: 1.0 },
  { name: "Glulam 5-1/8x13-1/2", category: "glulam", b: 5.125, d: 13.5, Area: 69.19, Sx: 155.67, Ix: 1050.79, weight: 16.8, CF: 1.0 },
  { name: "Glulam 6-3/4x13-1/2", category: "glulam", b: 6.75, d: 13.5, Area: 91.13, Sx: 205.03, Ix: 1383.96, weight: 22.1, CF: 1.0 },
  { name: "Glulam 8-3/4x13-1/2", category: "glulam", b: 8.75, d: 13.5, Area: 118.13, Sx: 265.78, Ix: 1794.02, weight: 28.7, CF: 1.0 },
  { name: "Glulam 10-3/4x13-1/2", category: "glulam", b: 10.75, d: 13.5, Area: 145.13, Sx: 326.53, Ix: 2204.09, weight: 35.3, CF: 1.0 },
  { name: "Glulam 3-1/8x15", category: "glulam", b: 3.125, d: 15, Area: 46.88, Sx: 117.19, Ix: 878.91, weight: 11.4, CF: 1.0 },
  { name: "Glulam 5-1/8x15", category: "glulam", b: 5.125, d: 15, Area: 76.88, Sx: 192.19, Ix: 1441.41, weight: 18.7, CF: 1.0 },
  { name: "Glulam 6-3/4x15", category: "glulam", b: 6.75, d: 15, Area: 101.25, Sx: 253.13, Ix: 1898.44, weight: 24.6, CF: 1.0 },
  { name: "Glulam 8-3/4x15", category: "glulam", b: 8.75, d: 15, Area: 131.25, Sx: 328.13, Ix: 2460.94, weight: 31.9, CF: 1.0 },
  { name: "Glulam 10-3/4x15", category: "glulam", b: 10.75, d: 15, Area: 161.25, Sx: 403.13, Ix: 3023.44, weight: 39.2, CF: 1.0 },
  { name: "Glulam 3-1/8x16-1/2", category: "glulam", b: 3.125, d: 16.5, Area: 51.56, Sx: 141.80, Ix: 1169.82, weight: 12.5, CF: 1.0 },
  { name: "Glulam 5-1/8x16-1/2", category: "glulam", b: 5.125, d: 16.5, Area: 84.56, Sx: 232.55, Ix: 1918.51, weight: 20.6, CF: 1.0 },
  { name: "Glulam 6-3/4x16-1/2", category: "glulam", b: 6.75, d: 16.5, Area: 111.38, Sx: 306.28, Ix: 2526.82, weight: 27.1, CF: 1.0 },
  { name: "Glulam 8-3/4x16-1/2", category: "glulam", b: 8.75, d: 16.5, Area: 144.38, Sx: 397.03, Ix: 3275.51, weight: 35.1, CF: 1.0 },
  { name: "Glulam 10-3/4x16-1/2", category: "glulam", b: 10.75, d: 16.5, Area: 177.38, Sx: 487.78, Ix: 4024.20, weight: 43.1, CF: 1.0 },
  { name: "Glulam 3-1/8x18", category: "glulam", b: 3.125, d: 18, Area: 56.25, Sx: 168.75, Ix: 1518.75, weight: 13.7, CF: 1.0 },
  { name: "Glulam 5-1/8x18", category: "glulam", b: 5.125, d: 18, Area: 92.25, Sx: 276.75, Ix: 2490.75, weight: 22.4, CF: 1.0 },
  { name: "Glulam 6-3/4x18", category: "glulam", b: 6.75, d: 18, Area: 121.50, Sx: 364.50, Ix: 3280.50, weight: 29.5, CF: 1.0 },
  { name: "Glulam 8-3/4x18", category: "glulam", b: 8.75, d: 18, Area: 157.50, Sx: 472.50, Ix: 4252.50, weight: 38.3, CF: 1.0 },
  { name: "Glulam 10-3/4x18", category: "glulam", b: 10.75, d: 18, Area: 193.50, Sx: 580.50, Ix: 5224.50, weight: 47.0, CF: 1.0 },
  { name: "Glulam 3-1/8x19-1/2", category: "glulam", b: 3.125, d: 19.5, Area: 60.94, Sx: 198.05, Ix: 1930.96, weight: 14.8, CF: 1.0 },
  { name: "Glulam 5-1/8x19-1/2", category: "glulam", b: 5.125, d: 19.5, Area: 99.94, Sx: 324.80, Ix: 3166.77, weight: 24.3, CF: 1.0 },
  { name: "Glulam 6-3/4x19-1/2", category: "glulam", b: 6.75, d: 19.5, Area: 131.63, Sx: 427.78, Ix: 4170.87, weight: 32.0, CF: 1.0 },
  { name: "Glulam 8-3/4x19-1/2", category: "glulam", b: 8.75, d: 19.5, Area: 170.63, Sx: 554.53, Ix: 5406.68, weight: 41.5, CF: 1.0 },
  { name: "Glulam 10-3/4x19-1/2", category: "glulam", b: 10.75, d: 19.5, Area: 209.63, Sx: 681.28, Ix: 6642.49, weight: 51.0, CF: 1.0 },
  { name: "Glulam 3-1/8x21", category: "glulam", b: 3.125, d: 21, Area: 65.63, Sx: 229.69, Ix: 2411.72, weight: 16.0, CF: 1.0 },
  { name: "Glulam 5-1/8x21", category: "glulam", b: 5.125, d: 21, Area: 107.63, Sx: 376.69, Ix: 3955.22, weight: 26.2, CF: 1.0 },
  { name: "Glulam 6-3/4x21", category: "glulam", b: 6.75, d: 21, Area: 141.75, Sx: 496.13, Ix: 5209.31, weight: 34.5, CF: 1.0 },
  { name: "Glulam 8-3/4x21", category: "glulam", b: 8.75, d: 21, Area: 183.75, Sx: 643.13, Ix: 6752.81, weight: 44.7, CF: 1.0 },
  { name: "Glulam 10-3/4x21", category: "glulam", b: 10.75, d: 21, Area: 225.75, Sx: 790.13, Ix: 8296.31, weight: 54.9, CF: 1.0 },
  { name: "Glulam 3-1/8x24", category: "glulam", b: 3.125, d: 24, Area: 75.00, Sx: 300.00, Ix: 3600.00, weight: 18.2, CF: 1.0 },
  { name: "Glulam 5-1/8x24", category: "glulam", b: 5.125, d: 24, Area: 123.00, Sx: 492.00, Ix: 5904.00, weight: 29.9, CF: 1.0 },
  { name: "Glulam 6-3/4x24", category: "glulam", b: 6.75, d: 24, Area: 162.00, Sx: 648.00, Ix: 7776.00, weight: 39.4, CF: 1.0 },
  { name: "Glulam 8-3/4x24", category: "glulam", b: 8.75, d: 24, Area: 210.00, Sx: 840.00, Ix: 10080.00, weight: 51.0, CF: 1.0 },
  { name: "Glulam 10-3/4x24", category: "glulam", b: 10.75, d: 24, Area: 258.00, Sx: 1032.00, Ix: 12384.00, weight: 62.7, CF: 1.0 },
  { name: "Glulam 3-1/8x27", category: "glulam", b: 3.125, d: 27, Area: 84.38, Sx: 379.69, Ix: 5125.78, weight: 20.5, CF: 1.0 },
  { name: "Glulam 5-1/8x27", category: "glulam", b: 5.125, d: 27, Area: 138.38, Sx: 622.69, Ix: 8406.28, weight: 33.6, CF: 1.0 },
  { name: "Glulam 6-3/4x27", category: "glulam", b: 6.75, d: 27, Area: 182.25, Sx: 820.13, Ix: 11071.69, weight: 44.3, CF: 1.0 },
  { name: "Glulam 8-3/4x27", category: "glulam", b: 8.75, d: 27, Area: 236.25, Sx: 1063.13, Ix: 14352.19, weight: 57.4, CF: 1.0 },
  { name: "Glulam 10-3/4x27", category: "glulam", b: 10.75, d: 27, Area: 290.25, Sx: 1306.13, Ix: 17632.69, weight: 70.5, CF: 1.0 },
  { name: "Glulam 3-1/8x30", category: "glulam", b: 3.125, d: 30, Area: 93.75, Sx: 468.75, Ix: 7031.25, weight: 22.8, CF: 1.0 },
  { name: "Glulam 5-1/8x30", category: "glulam", b: 5.125, d: 30, Area: 153.75, Sx: 768.75, Ix: 11531.25, weight: 37.4, CF: 1.0 },
  { name: "Glulam 6-3/4x30", category: "glulam", b: 6.75, d: 30, Area: 202.50, Sx: 1012.50, Ix: 15187.50, weight: 49.2, CF: 1.0 },
  { name: "Glulam 8-3/4x30", category: "glulam", b: 8.75, d: 30, Area: 262.50, Sx: 1312.50, Ix: 19687.50, weight: 63.8, CF: 1.0 },
  { name: "Glulam 10-3/4x30", category: "glulam", b: 10.75, d: 30, Area: 322.50, Sx: 1612.50, Ix: 24187.50, weight: 78.4, CF: 1.0 },
  { name: "PSL 3-1/2x9-1/4", category: "psl", b: 3.5, d: 9.25, Area: 32.38, Sx: 49.91, Ix: 230.84, weight: 9.4, CF: 1.0 },
  { name: "PSL 5-1/4x9-1/4", category: "psl", b: 5.25, d: 9.25, Area: 48.56, Sx: 74.87, Ix: 346.26, weight: 14.2, CF: 1.0 },
  { name: "PSL 7x9-1/4", category: "psl", b: 7, d: 9.25, Area: 64.75, Sx: 99.82, Ix: 461.68, weight: 18.9, CF: 1.0 },
  { name: "PSL 9-1/2x9-1/4", category: "psl", b: 9.5, d: 9.25, Area: 87.88, Sx: 135.47, Ix: 626.57, weight: 25.6, CF: 1.0 },
  { name: "PSL 3-1/2x11-7/8", category: "psl", b: 3.5, d: 11.875, Area: 41.56, Sx: 82.26, Ix: 488.41, weight: 12.1, CF: 1.0 },
  { name: "PSL 5-1/4x11-7/8", category: "psl", b: 5.25, d: 11.875, Area: 62.34, Sx: 123.39, Ix: 732.62, weight: 18.2, CF: 1.0 },
  { name: "PSL 7x11-7/8", category: "psl", b: 7, d: 11.875, Area: 83.13, Sx: 164.52, Ix: 976.83, weight: 24.2, CF: 1.0 },
  { name: "PSL 9-1/2x11-7/8", category: "psl", b: 9.5, d: 11.875, Area: 112.81, Sx: 223.27, Ix: 1325.69, weight: 32.9, CF: 1.0 },
  { name: "PSL 3-1/2x14", category: "psl", b: 3.5, d: 14, Area: 49.00, Sx: 114.33, Ix: 800.33, weight: 14.3, CF: 1.0 },
  { name: "PSL 5-1/4x14", category: "psl", b: 5.25, d: 14, Area: 73.50, Sx: 171.50, Ix: 1200.50, weight: 21.4, CF: 1.0 },
  { name: "PSL 7x14", category: "psl", b: 7, d: 14, Area: 98.00, Sx: 228.67, Ix: 1600.67, weight: 28.6, CF: 1.0 },
  { name: "PSL 9-1/2x14", category: "psl", b: 9.5, d: 14, Area: 133.00, Sx: 310.33, Ix: 2172.33, weight: 38.8, CF: 1.0 },
  { name: "PSL 3-1/2x16", category: "psl", b: 3.5, d: 16, Area: 56.00, Sx: 149.33, Ix: 1194.67, weight: 16.3, CF: 1.0 },
  { name: "PSL 5-1/4x16", category: "psl", b: 5.25, d: 16, Area: 84.00, Sx: 224.00, Ix: 1792.00, weight: 24.5, CF: 1.0 },
  { name: "PSL 7x16", category: "psl", b: 7, d: 16, Area: 112.00, Sx: 298.67, Ix: 2389.33, weight: 32.7, CF: 1.0 },
  { name: "PSL 9-1/2x16", category: "psl", b: 9.5, d: 16, Area: 152.00, Sx: 405.33, Ix: 3242.67, weight: 44.3, CF: 1.0 },
  { name: "PSL 3-1/2x18", category: "psl", b: 3.5, d: 18, Area: 63.00, Sx: 189.00, Ix: 1701.00, weight: 18.4, CF: 1.0 },
  { name: "PSL 5-1/4x18", category: "psl", b: 5.25, d: 18, Area: 94.50, Sx: 283.50, Ix: 2551.50, weight: 27.6, CF: 1.0 },
  { name: "PSL 7x18", category: "psl", b: 7, d: 18, Area: 126.00, Sx: 378.00, Ix: 3402.00, weight: 36.8, CF: 1.0 },
  { name: "PSL 9-1/2x18", category: "psl", b: 9.5, d: 18, Area: 171.00, Sx: 513.00, Ix: 4617.00, weight: 49.9, CF: 1.0 },
  { name: "PSL 3-1/2x20", category: "psl", b: 3.5, d: 20, Area: 70.00, Sx: 233.33, Ix: 2333.33, weight: 20.4, CF: 1.0 },
  { name: "PSL 5-1/4x20", category: "psl", b: 5.25, d: 20, Area: 105.00, Sx: 350.00, Ix: 3500.00, weight: 30.6, CF: 1.0 },
  { name: "PSL 7x20", category: "psl", b: 7, d: 20, Area: 140.00, Sx: 466.67, Ix: 4666.67, weight: 40.8, CF: 1.0 },
  { name: "PSL 9-1/2x20", category: "psl", b: 9.5, d: 20, Area: 190.00, Sx: 633.33, Ix: 6333.33, weight: 55.4, CF: 1.0 },
  { name: "PSL 3-1/2x24", category: "psl", b: 3.5, d: 24, Area: 84.00, Sx: 336.00, Ix: 4032.00, weight: 24.5, CF: 1.0 },
  { name: "PSL 5-1/4x24", category: "psl", b: 5.25, d: 24, Area: 126.00, Sx: 504.00, Ix: 6048.00, weight: 36.8, CF: 1.0 },
  { name: "PSL 7x24", category: "psl", b: 7, d: 24, Area: 168.00, Sx: 672.00, Ix: 8064.00, weight: 49.0, CF: 1.0 },
  { name: "PSL 9-1/2x24", category: "psl", b: 9.5, d: 24, Area: 228.00, Sx: 912.00, Ix: 10944.00, weight: 66.5, CF: 1.0 },
  // I-Joist entries below are NOT manufacturer-published values. Real TJI/I-joist Sx/Ix come from
  // proprietary flange-web geometry published only in the maker's spec sheets (e.g. Weyerhaeuser
  // TJ-4000). These are a generic idealized flange+web section (1.75" x 1.25" flanges, 0.375" OSB
  // web) computed for a plausible order-of-magnitude estimate. Verify against actual product data
  // before using for a real design.
  { name: "I-Joist 9-1/2 in Depth (Approx - Verify Mfr Spec)", category: "ijoist", b: 1.75, d: 9.5, Area: 7.00, Sx: 18.05, Ix: 85.73, weight: 2.0, CF: 1.0 },
  { name: "I-Joist 11-7/8 in Depth (Approx - Verify Mfr Spec)", category: "ijoist", b: 1.75, d: 11.875, Area: 7.89, Sx: 25.23, Ix: 149.79, weight: 2.3, CF: 1.0 },
  { name: "I-Joist 14 in Depth (Approx - Verify Mfr Spec)", category: "ijoist", b: 1.75, d: 14, Area: 8.69, Sx: 32.27, Ix: 225.90, weight: 2.5, CF: 1.0 },
  { name: "I-Joist 16 in Depth (Approx - Verify Mfr Spec)", category: "ijoist", b: 1.75, d: 16, Area: 9.44, Sx: 39.43, Ix: 315.42, weight: 2.8, CF: 1.0 },
  { name: "I-Joist 18 in Depth (Approx - Verify Mfr Spec)", category: "ijoist", b: 1.75, d: 18, Area: 10.19, Sx: 47.09, Ix: 423.81, weight: 3.0, CF: 1.0 },
  { name: "I-Joist 20 in Depth (Approx - Verify Mfr Spec)", category: "ijoist", b: 1.75, d: 20, Area: 10.94, Sx: 55.26, Ix: 552.57, weight: 3.2, CF: 1.0 },
  { name: "I-Joist 24 in Depth (Approx - Verify Mfr Spec)", category: "ijoist", b: 1.75, d: 24, Area: 12.44, Sx: 73.10, Ix: 877.23, weight: 3.6, CF: 1.0 }
];

export const TIMBER_CUSTOM_SIZE_VALUE = "__custom__";

// Restricts the Wood Species & Grade dropdown to the categories that are
// actually valid for each family, so e.g. a Glulam section can't be paired
// with a solid-sawn DF-L grade (each engineered wood product has its own
// fixed, proprietary design values — it isn't available "in" other species).
export const TIMBER_FAMILY_SPECIES_CATEGORIES = {
  'builtup': ['DF-L', 'SYP', 'HF', 'SPF', 'Cedar'],
  'sawn': ['DF-L', 'SYP', 'HF', 'SPF', 'Cedar'],
  'timber': ['DF-L', 'SYP', 'HF', 'SPF', 'Cedar'],
  'lvl': ['LVL'],
  'glulam': ['Glulam'],
  'psl': ['PSL'],
  'ijoist': ['TJI']
};

export function getSpeciesByName(name) {
  return TIMBER_SPECIES.find(s => s.name === name) || TIMBER_SPECIES[0];
}

export function getMemberByName(name) {
  return TIMBER_MEMBERS.find(m => m.name === name) || TIMBER_MEMBERS[0];
}

export function analyzeTimberBeam(inputs) {
  const beamType = inputs.beamType || 'single';
  const L1_ft = Number(inputs.L_ft) || 14;
  const L2_ft = Number(inputs.L2_ft) || 0;
  const L1_in = L1_ft * 12;
  const species = getSpeciesByName(inputs.speciesName);

  let member = null;

  const numPlies = Number(inputs.numPlies) || 1;

  if (inputs.isBuiltUp) {
    const plyWidth = Number(inputs.plyWidth) || 1.5;
    const depth = Number(inputs.depth) || 9.25;

    const totalWidth = numPlies * plyWidth;
    const Area = totalWidth * depth;
    const Sx = (totalWidth * Math.pow(depth, 2)) / 6;
    const Ix = (totalWidth * Math.pow(depth, 3)) / 12;
    const weight = (Area / 144) * 35;

    // Size Factor CF per NDS Table 4A
    let CF = 1.0;
    if (depth <= 4.0) CF = 1.5;
    else if (depth <= 6.0) CF = 1.3;
    else if (depth <= 8.0) CF = 1.2;
    else if (depth <= 10.0) CF = 1.1;
    else CF = 1.0;

    member = {
      name: `${numPlies}-Ply (${numPlies}x${plyWidth}" x ${depth}")`,
      b: totalWidth,
      d: depth,
      Area,
      Sx,
      Ix,
      weight,
      numPlies,
      plyWidth,
      CF
    };
  } else if (inputs.sizeName === TIMBER_CUSTOM_SIZE_VALUE) {
    const baseWidth = Number(inputs.customWidth) || 5.125;
    const depth = Number(inputs.customDepth) || 12;
    const totalWidth = numPlies * baseWidth;
    const Area = totalWidth * depth;
    const Sx = (totalWidth * Math.pow(depth, 2)) / 6;
    const Ix = (totalWidth * Math.pow(depth, 3)) / 12;
    const weight = (Area / 144) * 35;

    // Size Factor CF per NDS Table 4A
    let CF = 1.0;
    if (depth <= 4.0) CF = 1.5;
    else if (depth <= 6.0) CF = 1.3;
    else if (depth <= 8.0) CF = 1.2;
    else if (depth <= 10.0) CF = 1.1;
    else CF = 1.0;

    member = {
      name: numPlies > 1 ? `${numPlies}-Ply Custom (${numPlies}x${baseWidth}" x ${depth}")` : `Custom ${baseWidth}" x ${depth}"`,
      b: totalWidth,
      d: depth,
      Area,
      Sx,
      Ix,
      weight,
      numPlies,
      CF
    };
  } else {
    const baseMember = getMemberByName(inputs.sizeName);
    const totalWidth = numPlies * baseMember.b;
    const Area = numPlies * baseMember.Area;
    const Sx = numPlies * baseMember.Sx;
    const Ix = numPlies * baseMember.Ix;
    const weight = numPlies * (baseMember.weight || 0);

    const displayName = numPlies > 1
      ? `${numPlies}-Ply ${baseMember.name} (${numPlies}x${baseMember.b}" x ${baseMember.d}")`
      : baseMember.name;

    member = {
      ...baseMember,
      name: displayName,
      b: totalWidth,
      Area,
      Sx,
      Ix,
      weight,
      numPlies,
      CF: baseMember.CF || 1.0
    };
  }

  const selfWeight_plf = inputs.includeSelfWeight !== false ? (member.weight || 0) : 0;
  
  let w_dl_plf = 0;
  let w_ll_plf = 0;
  let w_wind_uplift_plf = 0;

  if (inputs.loadMode === 'direct') {
    w_dl_plf = (Number(inputs.w_dl_plf) || 0) + selfWeight_plf;
    w_ll_plf = (Number(inputs.w_ll_plf) || 0);
    w_wind_uplift_plf = (Number(inputs.w_wind_plf) || 0);
  } else {
    const tribLeft_ft = Number(inputs.tribLeft_ft) || 0;
    const tribRight_ft = Number(inputs.tribRight_ft) || 0;
    const dlLeft_psf = inputs.dlLeft_psf !== undefined ? Number(inputs.dlLeft_psf) : (Number(inputs.dl_psf) || 0);
    const dlRight_psf = inputs.dlRight_psf !== undefined ? Number(inputs.dlRight_psf) : (Number(inputs.dl_psf) || 0);
    const llLeft_psf = inputs.llLeft_psf !== undefined ? Number(inputs.llLeft_psf) : (Number(inputs.ll_psf) || 0);
    const llRight_psf = inputs.llRight_psf !== undefined ? Number(inputs.llRight_psf) : (Number(inputs.ll_psf) || 0);

    w_dl_plf = (dlLeft_psf * tribLeft_ft) + (dlRight_psf * tribRight_ft) + selfWeight_plf;
    w_ll_plf = (llLeft_psf * tribLeft_ft) + (llRight_psf * tribRight_ft);

    const wind_psf = Number(inputs.wind_psf) || 0;
    w_wind_uplift_plf = wind_psf * ((tribLeft_ft + tribRight_ft) / 2);
  }

  const w_service_plf = w_dl_plf + w_ll_plf;
  const w_service_kft = w_service_plf / 1000;

  // ASCE 7 ASD Net Wind Uplift Combo: 0.6 D - 0.6 W
  const w_net_uplift_plf = w_wind_uplift_plf > 0 ? ((0.6 * w_wind_uplift_plf) - (0.6 * w_dl_plf)) : 0;
  const isNetUplift = w_net_uplift_plf > 0;

  const pointLoads = (inputs.pointLoads && inputs.pointLoads.length > 0)
    ? inputs.pointLoads.map(pt => ({
        P_dl: Number(pt.P_dl) || 0,
        P_ll: Number(pt.P_ll) || 0,
        pos_ft: Number(pt.pos_ft) || 0
      }))
    : [{ P_dl: 0, P_ll: 0, pos_ft: L1_ft / 2 }];

  let R1_dl_lbs = 0, R1_ll_lbs = 0;
  let R2_dl_lbs = 0, R2_ll_lbs = 0;
  let R3_dl_lbs = 0, R3_ll_lbs = 0;

  const E = species.E;

  if (beamType === 'single') {
    R1_dl_lbs += (w_dl_plf * L1_ft) / 2;
    R2_dl_lbs += (w_dl_plf * L1_ft) / 2;
    R1_ll_lbs += (w_ll_plf * L1_ft) / 2;
    R2_ll_lbs += (w_ll_plf * L1_ft) / 2;

    pointLoads.forEach(pt => {
      const P_d = pt.P_dl * 1000;
      const P_l = pt.P_ll * 1000;
      const a = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
      const b = L1_ft - a;
      if (L1_ft > 0) {
        R1_dl_lbs += P_d * (b / L1_ft);
        R2_dl_lbs += P_d * (a / L1_ft);
        R1_ll_lbs += P_l * (b / L1_ft);
        R2_ll_lbs += P_l * (a / L1_ft);
      }
    });
  } else if (beamType === 'cantilever') {
    const M_cant_dl = (w_dl_plf * Math.pow(L2_ft, 2)) / 2;
    const M_cant_ll = (w_ll_plf * Math.pow(L2_ft, 2)) / 2;

    R1_dl_lbs += (w_dl_plf * L1_ft) / 2 - (M_cant_dl / L1_ft);
    R2_dl_lbs += (w_dl_plf * L1_ft) / 2 + (M_cant_dl / L1_ft) + (w_dl_plf * L2_ft);

    R1_ll_lbs += (w_ll_plf * L1_ft) / 2 - (M_cant_ll / L1_ft);
    R2_ll_lbs += (w_ll_plf * L1_ft) / 2 + (M_cant_ll / L1_ft) + (w_ll_plf * L2_ft);

    pointLoads.forEach(pt => {
      const P_d = pt.P_dl * 1000;
      const P_l = pt.P_ll * 1000;
      const a = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
      const b = L1_ft - a;
      if (L1_ft > 0) {
        R1_dl_lbs += P_d * (b / L1_ft);
        R2_dl_lbs += P_d * (a / L1_ft);
        R1_ll_lbs += P_l * (b / L1_ft);
        R2_ll_lbs += P_l * (a / L1_ft);
      }
    });
  } else if (beamType === 'two-span') {
    const L2_span = L2_ft || L1_ft;
    R1_dl_lbs += 0.375 * w_dl_plf * L1_ft;
    R2_dl_lbs += 1.25 * w_dl_plf * L1_ft;
    R3_dl_lbs += 0.375 * w_dl_plf * L2_span;

    R1_ll_lbs += 0.375 * w_ll_plf * L1_ft;
    R2_ll_lbs += 1.25 * w_ll_plf * L1_ft;
    R3_ll_lbs += 0.375 * w_ll_plf * L2_span;

    pointLoads.forEach(pt => {
      const P_d = pt.P_dl * 1000;
      const P_l = pt.P_ll * 1000;
      const a = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
      const b = L1_ft - a;
      if (L1_ft > 0) {
        R1_dl_lbs += P_d * (b / L1_ft);
        R2_dl_lbs += P_d * (a / L1_ft);
        R1_ll_lbs += P_l * (b / L1_ft);
        R2_ll_lbs += P_l * (a / L1_ft);
      }
    });
  }

  const R1_service_lbs = R1_dl_lbs + R1_ll_lbs;
  const R2_service_lbs = R2_dl_lbs + R2_ll_lbs;
  const R3_service_lbs = R3_dl_lbs + R3_ll_lbs;

  const R1_uplift_lbs = Math.max(0, (w_net_uplift_plf * L1_ft) / 2);
  const R2_uplift_lbs = Math.max(0, (w_net_uplift_plf * L1_ft) / 2);

  // Exact Piecewise Analysis for Timber
  const numSteps = 400;
  let max_M_service_lbft = 0;
  let max_M_uplift_lbft = 0;
  let max_V_service_lbs = 0;
  let max_delta_live_in = 0;
  let max_delta_total_in = 0;

  const w_serv_plf = w_service_plf;
  const w_up_plf = w_net_uplift_plf;

  const w_ll_in = (w_ll_plf / 12);
  const w_total_in = (w_service_plf / 12);

  if (beamType === 'single') {
    for (let i = 0; i <= numSteps; i++) {
      const x_ft = (i / numSteps) * L1_ft;
      const x_in = x_ft * 12;

      let Vx_serv = R1_service_lbs - (w_serv_plf * x_ft);
      let Mx_serv = (R1_service_lbs * x_ft) - (0.5 * w_serv_plf * Math.pow(x_ft, 2));
      let Mx_up = (R1_uplift_lbs * x_ft) - (0.5 * w_up_plf * Math.pow(x_ft, 2));

      pointLoads.forEach(pt => {
        const a_ft = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
        const P_serv = (pt.P_dl + pt.P_ll) * 1000;
        if (x_ft >= a_ft) {
          Vx_serv -= P_serv;
          Mx_serv -= P_serv * (x_ft - a_ft);
        }
      });

      max_M_service_lbft = Math.max(max_M_service_lbft, Math.abs(Mx_serv));
      max_M_uplift_lbft = Math.max(max_M_uplift_lbft, Math.abs(Mx_up));
      max_V_service_lbs = Math.max(max_V_service_lbs, Math.abs(Vx_serv));

      // Elastic Deflections
      let dx_live = 0;
      let dx_total = 0;

      if (L1_in > 0 && member.Ix > 0) {
        const unif_factor = (x_in * (L1_in - x_in) * (Math.pow(L1_in, 2) + (x_in * (L1_in - x_in)))) / (24 * E * member.Ix);
        dx_live += w_ll_in * unif_factor;
        dx_total += w_total_in * unif_factor;

        pointLoads.forEach(pt => {
          const a_in = Math.min(Math.max(pt.pos_ft, 0), L1_ft) * 12;
          const b_in = L1_in - a_in;

          const P_l = pt.P_ll * 1000;
          const P_t = (pt.P_dl + pt.P_ll) * 1000;

          let pt_defl_factor = 0;
          if (x_in <= a_in) {
            pt_defl_factor = (b_in * x_in * (Math.pow(L1_in, 2) - Math.pow(b_in, 2) - Math.pow(x_in, 2))) / (6 * E * member.Ix * L1_in);
          } else {
            pt_defl_factor = (a_in * (L1_in - x_in) * (2 * L1_in * x_in - Math.pow(x_in, 2) - Math.pow(a_in, 2))) / (6 * E * member.Ix * L1_in);
          }

          dx_live += P_l * pt_defl_factor;
          dx_total += P_t * pt_defl_factor;
        });
      }

      max_delta_live_in = Math.max(max_delta_live_in, Math.abs(dx_live));
      max_delta_total_in = Math.max(max_delta_total_in, Math.abs(dx_total));
    }
  } else {
    max_M_service_lbft = (w_serv_plf * Math.pow(L1_ft, 2)) / 8;
    max_V_service_lbs = Math.max(R1_service_lbs, R2_service_lbs, R3_service_lbs);
    max_delta_live_in = (5 * w_ll_in * Math.pow(L1_in, 4)) / (384 * E * member.Ix);
    max_delta_total_in = (5 * w_total_in * Math.pow(L1_in, 4)) / (384 * E * member.Ix);
  }

  const M_use_lbft = isNetUplift ? max_M_uplift_lbft : max_M_service_lbft;
  const M_use_lbin = M_use_lbft * 12;
  const M_max_kipft = M_use_lbft / 1000;
  const V_max_kips = max_V_service_lbs / 1000;

  // NDS Adjustment Factors: CD, Cr, CF
  const CD = isNetUplift ? 1.6 : (inputs.CD || 1.15);
  const Cr = inputs.Cr || 1.15;
  const CF = member.CF || 1.0;
  const Fb_prime_psi = species.Fb * CD * Cr * CF;

  const fb_psi = M_use_lbin / member.Sx;
  const stressRatio = fb_psi / Fb_prime_psi;

  // NDS Shear Check Fv' = Fv * CD
  const Fv_prime_psi = species.Fv * CD;
  const fv_psi = (1.5 * max_V_service_lbs) / member.Area;
  const shearRatio = fv_psi / Fv_prime_psi;
  const passShear = shearRatio <= 1.0;

  const limitLiveDivider = inputs.deflectLimitLive || 360;
  const limitTotalDivider = inputs.deflectLimitTotal || 240;

  const L360_in = L1_in / limitLiveDivider;
  const L240_in = L1_in / limitTotalDivider;

  const passLiveDeflect = max_delta_live_in <= L360_in;
  const passTotalDeflect = max_delta_total_in <= L240_in;
  const passStress = stressRatio <= 1.0;
  const isPass = passStress && passShear && passLiveDeflect && passTotalDeflect;

  return {
    beamType,
    speciesName: species.name,
    sizeName: member.name,
    L_ft: L1_ft,
    L2_ft,
    w_service_plf,
    w_service_kft,
    w_net_uplift_plf,
    isNetUplift,
    reactions: {
      R1: { dl: R1_dl_lbs / 1000, ll: R1_ll_lbs / 1000, service: R1_service_lbs / 1000, uplift: R1_uplift_lbs / 1000 },
      R2: { dl: R2_dl_lbs / 1000, ll: R2_ll_lbs / 1000, service: R2_service_lbs / 1000, uplift: R2_uplift_lbs / 1000 },
      R3: { dl: R3_dl_lbs / 1000, ll: R3_ll_lbs / 1000, service: R3_service_lbs / 1000, uplift: 0 }
    },
    M_max_lbft: max_M_service_lbft,
    M_max_kipft,
    V_max_kips,
    fb_psi,
    Fb_prime_psi,
    fv_psi,
    Fv_prime_psi,
    shearRatio,
    passShear,
    stressRatio,
    delta_max_in: max_delta_total_in,
    delta_live_in: max_delta_live_in,
    delta_total_in: max_delta_total_in,
    L360_in,
    L240_in,
    passStress,
    passLiveDeflect,
    passTotalDeflect,
    isPass
  };
}

export function findLightestTimberBeam(inputs) {
  const family = inputs.family || 'builtup';

  if (family === 'builtup') {
    const plies = [1, 2, 3, 4, 5, 6];
    const depths = [5.5, 7.25, 9.25, 9.5, 11.25, 11.875, 14.0, 16.0, 18.0, 20.0, 22.0, 24.0];
    const plyWidth = inputs.plyWidth || 1.5;

    for (let d of depths) {
      for (let p of plies) {
        const testInputs = { ...inputs, isBuiltUp: true, numPlies: p, plyWidth, depth: d };
        const res = analyzeTimberBeam(testInputs);
        if (res.isPass) {
          return {
            found: true,
            member: { name: `${p}-Ply (${p}x${plyWidth} x ${d})`, weight: (p * plyWidth * d / 144) * 35 },
            result: res,
            builtUpParams: { numPlies: p, plyWidth, depth: d }
          };
        }
      }
    }
  } else {
    const candidates = TIMBER_MEMBERS.filter(m => m.category === family);
    const plies = [1, 2, 3, 4];
    const combos = [];

    for (let p of plies) {
      for (let mem of candidates) {
        combos.push({ mem, p, totalWeight: p * mem.weight });
      }
    }
    combos.sort((a, b) => a.totalWeight - b.totalWeight);

    for (let item of combos) {
      const testInputs = { ...inputs, sizeName: item.mem.name, numPlies: item.p, isBuiltUp: false };
      const res = analyzeTimberBeam(testInputs);
      if (res.isPass) {
        return {
          found: true,
          member: { name: item.mem.name, weight: item.totalWeight },
          numPlies: item.p,
          result: res
        };
      }
    }
  }

  return { found: false };
}
