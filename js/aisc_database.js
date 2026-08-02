/**
 * Comprehensive AISC Steel Section Database
 * Includes:
 * - W-Shapes (Wide Flange)
 * - M-Shapes (Miscellaneous Light Beams)
 * - C-Shapes (Standard Channels)
 * - MC-Shapes (Miscellaneous Channels)
 * - HSS Square Tubing
 * - HSS Rectangular Tubing
 * - HSS Round / Steel Pipe
 * - L-Shapes (Equal Angles)
 */

export const AISC_DATABASE = [
  // ==========================================
  // W-SHAPES (WIDE FLANGE BEAMS)
  // ==========================================
  { name: "W4x13", type: "W", weight: 13.0, A: 3.83, d: 4.16, bf: 4.06, Ix: 11.3, Sx: 5.46, rx: 1.72, Iy: 3.86, Sy: 1.90, ry: 1.00 },
  { name: "W6x9", type: "W", weight: 9.0, A: 2.68, d: 5.90, bf: 3.94, Ix: 16.4, Sx: 5.56, rx: 2.47, Iy: 2.19, Sy: 1.11, ry: 0.905 },
  { name: "W6x12", type: "W", weight: 12.0, A: 3.55, d: 6.03, bf: 4.00, Ix: 22.1, Sx: 7.33, rx: 2.49, Iy: 2.99, Sy: 1.50, ry: 0.918 },
  { name: "W6x16", type: "W", weight: 16.0, A: 4.74, d: 6.28, bf: 4.03, Ix: 32.1, Sx: 10.2, rx: 2.60, Iy: 4.43, Sy: 2.20, ry: 0.967 },
  { name: "W6x20", type: "W", weight: 20.0, A: 5.87, d: 6.20, bf: 6.02, Ix: 41.4, Sx: 13.4, rx: 2.66, Iy: 13.3, Sy: 4.41, ry: 1.50 },
  
  { name: "W8x10", type: "W", weight: 10.0, A: 2.96, d: 7.89, bf: 3.94, Ix: 30.8, Sx: 7.81, rx: 3.22, Iy: 2.09, Sy: 1.06, ry: 0.841 },
  { name: "W8x13", type: "W", weight: 13.0, A: 3.84, d: 7.99, bf: 4.00, Ix: 39.6, Sx: 9.91, rx: 3.21, Iy: 2.80, Sy: 1.40, ry: 0.854 },
  { name: "W8x15", type: "W", weight: 15.0, A: 4.44, d: 8.11, bf: 4.01, Ix: 48.0, Sx: 11.8, rx: 3.29, Iy: 3.41, Sy: 1.70, ry: 0.876 },
  { name: "W8x18", type: "W", weight: 18.0, A: 5.26, d: 8.14, bf: 5.25, Ix: 61.9, Sx: 15.2, rx: 3.43, Iy: 7.97, Sy: 3.04, ry: 1.23 },
  { name: "W8x21", type: "W", weight: 21.0, A: 6.16, d: 8.28, bf: 5.27, Ix: 75.3, Sx: 18.2, rx: 3.49, Iy: 9.77, Sy: 3.71, ry: 1.26 },
  { name: "W8x24", type: "W", weight: 24.0, A: 7.08, d: 7.93, bf: 6.50, Ix: 82.7, Sx: 20.9, rx: 3.42, Iy: 18.3, Sy: 5.63, ry: 1.61 },
  { name: "W8x31", type: "W", weight: 31.0, A: 9.13, d: 8.00, bf: 8.00, Ix: 110.0, Sx: 27.5, rx: 3.47, Iy: 37.1, Sy: 9.27, ry: 2.02 },

  { name: "W10x12", type: "W", weight: 12.0, A: 3.54, d: 9.87, bf: 3.96, Ix: 53.8, Sx: 10.9, rx: 3.90, Iy: 2.18, Sy: 1.10, ry: 0.785 },
  { name: "W10x15", type: "W", weight: 15.0, A: 4.41, d: 9.99, bf: 4.00, Ix: 68.9, Sx: 13.8, rx: 3.95, Iy: 2.89, Sy: 1.45, ry: 0.810 },
  { name: "W10x19", type: "W", weight: 19.0, A: 5.62, d: 10.2, bf: 4.02, Ix: 96.3, Sx: 18.8, rx: 4.14, Iy: 4.29, Sy: 2.14, ry: 0.874 },
  { name: "W10x22", type: "W", weight: 22.0, A: 6.49, d: 10.2, bf: 5.75, Ix: 118.0, Sx: 23.2, rx: 4.27, Iy: 11.4, Sy: 3.97, ry: 1.33 },
  { name: "W10x26", type: "W", weight: 26.0, A: 7.61, d: 10.3, bf: 5.77, Ix: 144.0, Sx: 27.9, rx: 4.35, Iy: 14.1, Sy: 4.89, ry: 1.36 },
  { name: "W10x30", type: "W", weight: 30.0, A: 8.84, d: 10.5, bf: 5.81, Ix: 170.0, Sx: 32.4, rx: 4.38, Iy: 16.7, Sy: 5.75, ry: 1.37 },
  { name: "W10x33", type: "W", weight: 33.0, A: 9.71, d: 9.73, bf: 7.96, Ix: 171.0, Sx: 35.0, rx: 4.19, Iy: 36.6, Sy: 9.20, ry: 1.94 },
  { name: "W10x49", type: "W", weight: 49.0, A: 14.4, d: 9.98, bf: 10.0, Ix: 272.0, Sx: 54.6, rx: 4.35, Iy: 93.4, Sy: 18.7, ry: 2.54 },

  { name: "W12x14", type: "W", weight: 14.0, A: 4.16, d: 11.9, bf: 3.97, Ix: 88.6, Sx: 14.9, rx: 4.62, Iy: 2.36, Sy: 1.19, ry: 0.753 },
  { name: "W12x16", type: "W", weight: 16.0, A: 4.71, d: 11.9, bf: 3.99, Ix: 103.0, Sx: 17.3, rx: 4.67, Iy: 2.82, Sy: 1.41, ry: 0.773 },
  { name: "W12x19", type: "W", weight: 19.0, A: 5.57, d: 12.2, bf: 4.01, Ix: 130.0, Sx: 21.3, rx: 4.83, Iy: 3.76, Sy: 1.88, ry: 0.822 },
  { name: "W12x22", type: "W", weight: 22.0, A: 6.48, d: 12.3, bf: 4.03, Ix: 156.0, Sx: 25.4, rx: 4.91, Iy: 4.66, Sy: 2.31, ry: 0.847 },
  { name: "W12x26", type: "W", weight: 26.0, A: 7.65, d: 12.2, bf: 6.49, Ix: 204.0, Sx: 33.4, rx: 5.17, Iy: 17.3, Sy: 5.34, ry: 1.50 },
  { name: "W12x30", type: "W", weight: 30.0, A: 8.79, d: 12.3, bf: 6.52, Ix: 238.0, Sx: 38.6, rx: 5.21, Iy: 20.3, Sy: 6.23, ry: 1.52 },
  { name: "W12x35", type: "W", weight: 35.0, A: 10.3, d: 12.5, bf: 6.56, Ix: 285.0, Sx: 45.6, rx: 5.25, Iy: 24.5, Sy: 7.47, ry: 1.54 },
  { name: "W12x40", type: "W", weight: 40.0, A: 11.7, d: 11.9, bf: 8.01, Ix: 310.0, Sx: 51.9, rx: 5.13, Iy: 44.1, Sy: 11.0, ry: 1.94 },
  { name: "W12x53", type: "W", weight: 53.0, A: 15.6, d: 12.1, bf: 10.0, Ix: 425.0, Sx: 70.6, rx: 5.23, Iy: 95.8, Sy: 19.2, ry: 2.48 },

  { name: "W14x22", type: "W", weight: 22.0, A: 6.49, d: 13.7, bf: 5.00, Ix: 199.0, Sx: 29.0, rx: 5.54, Iy: 7.00, Sy: 2.80, ry: 1.04 },
  { name: "W14x26", type: "W", weight: 26.0, A: 7.69, d: 13.9, bf: 5.03, Ix: 245.0, Sx: 35.3, rx: 5.65, Iy: 8.91, Sy: 3.54, ry: 1.08 },
  { name: "W14x30", type: "W", weight: 30.0, A: 8.85, d: 13.8, bf: 6.73, Ix: 291.0, Sx: 42.0, rx: 5.73, Iy: 19.6, Sy: 5.82, ry: 1.49 },
  { name: "W14x34", type: "W", weight: 34.0, A: 10.0, d: 14.0, bf: 6.75, Ix: 340.0, Sx: 48.6, rx: 5.83, Iy: 23.3, Sy: 6.90, ry: 1.53 },
  { name: "W14x43", type: "W", weight: 43.0, A: 12.6, d: 13.7, bf: 8.00, Ix: 428.0, Sx: 62.6, rx: 5.82, Iy: 45.2, Sy: 11.3, ry: 1.89 },
  { name: "W14x68", type: "W", weight: 68.0, A: 20.0, d: 14.0, bf: 10.0, Ix: 722.0, Sx: 103.0, rx: 6.01, Iy: 121.0, Sy: 24.2, ry: 2.46 },

  { name: "W16x26", type: "W", weight: 26.0, A: 7.68, d: 15.7, bf: 5.50, Ix: 301.0, Sx: 38.4, rx: 6.26, Iy: 9.59, Sy: 3.49, ry: 1.12 },
  { name: "W16x31", type: "W", weight: 31.0, A: 9.12, d: 15.9, bf: 5.53, Ix: 375.0, Sx: 47.2, rx: 6.41, Iy: 12.4, Sy: 4.49, ry: 1.17 },
  { name: "W16x40", type: "W", weight: 40.0, A: 11.8, d: 16.0, bf: 7.00, Ix: 518.0, Sx: 64.7, rx: 6.63, Iy: 28.9, Sy: 8.25, ry: 1.57 },
  { name: "W16x50", type: "W", weight: 50.0, A: 14.7, d: 16.3, bf: 7.07, Ix: 659.0, Sx: 81.0, rx: 6.68, Iy: 37.2, Sy: 10.5, ry: 1.59 },

  { name: "W18x35", type: "W", weight: 35.0, A: 10.3, d: 17.7, bf: 6.00, Ix: 510.0, Sx: 57.6, rx: 7.04, Iy: 15.3, Sy: 5.10, ry: 1.22 },
  { name: "W18x50", type: "W", weight: 50.0, A: 14.7, d: 18.0, bf: 7.50, Ix: 800.0, Sx: 88.9, rx: 7.38, Iy: 40.1, Sy: 10.7, ry: 1.65 },
  { name: "W18x76", type: "W", weight: 76.0, A: 22.3, d: 18.2, bf: 11.0, Ix: 1330.0, Sx: 146.0, rx: 7.73, Iy: 152.0, Sy: 27.6, ry: 2.61 },

  { name: "W21x44", type: "W", weight: 44.0, A: 13.0, d: 20.7, bf: 6.50, Ix: 843.0, Sx: 81.6, rx: 8.06, Iy: 20.7, Sy: 6.37, ry: 1.26 },
  { name: "W21x50", type: "W", weight: 50.0, A: 14.7, d: 20.8, bf: 6.53, Ix: 984.0, Sx: 94.5, rx: 8.18, Iy: 24.9, Sy: 7.64, ry: 1.30 },
  { name: "W24x55", type: "W", weight: 55.0, A: 16.2, d: 23.6, bf: 7.00, Ix: 1350.0, Sx: 114.0, rx: 9.14, Iy: 29.1, Sy: 8.30, ry: 1.34 },
  { name: "W24x68", type: "W", weight: 68.0, A: 20.1, d: 23.7, bf: 8.97, Ix: 1830.0, Sx: 154.0, rx: 9.55, Iy: 70.4, Sy: 15.7, ry: 1.87 },

  // ==========================================
  // M-SHAPES (MISCELLANEOUS BEAMS)
  // ==========================================
  { name: "M4x13", type: "M", weight: 13.0, A: 3.83, d: 4.00, bf: 4.00, Ix: 10.4, Sx: 5.21, rx: 1.65, Iy: 3.79, Sy: 1.90, ry: 0.99 },
  { name: "M6x4.4", type: "M", weight: 4.4, A: 1.29, d: 6.00, bf: 1.84, Ix: 7.24, Sx: 2.41, rx: 2.37, Iy: 0.28, Sy: 0.30, ry: 0.46 },
  { name: "M6x12", type: "M", weight: 12.0, A: 3.52, d: 6.00, bf: 4.00, Ix: 22.1, Sx: 7.37, rx: 2.50, Iy: 2.98, Sy: 1.49, ry: 0.92 },
  { name: "M8x6.5", type: "M", weight: 6.5, A: 1.91, d: 8.00, bf: 2.28, Ix: 19.8, Sx: 4.95, rx: 3.22, Iy: 0.65, Sy: 0.57, ry: 0.58 },

  // ==========================================
  // C-SHAPES & MC-SHAPES (STANDARD CHANNELS)
  // ==========================================
  { name: "C3x4.1", type: "C", weight: 4.1, A: 1.21, d: 3.00, bf: 1.41, Ix: 1.66, Sx: 1.10, rx: 1.17, Iy: 0.19, Sy: 0.18, ry: 0.40 },
  { name: "C4x5.4", type: "C", weight: 5.4, A: 1.58, d: 4.00, bf: 1.58, Ix: 3.85, Sx: 1.93, rx: 1.56, Iy: 0.31, Sy: 0.28, ry: 0.44 },
  { name: "C6x8.2", type: "C", weight: 8.2, A: 2.39, d: 6.00, bf: 1.92, Ix: 13.1, Sx: 4.38, rx: 2.34, Iy: 0.69, Sy: 0.44, ry: 0.54 },
  { name: "C8x11.5", type: "C", weight: 11.5, A: 3.37, d: 8.00, bf: 2.26, Ix: 32.5, Sx: 8.14, rx: 3.11, Iy: 1.31, Sy: 0.78, ry: 0.62 },
  { name: "C10x15.3", type: "C", weight: 15.3, A: 4.48, d: 10.0, bf: 2.60, Ix: 67.3, Sx: 13.5, rx: 3.87, Iy: 2.27, Sy: 1.16, ry: 0.71 },
  { name: "C12x20.7", type: "C", weight: 20.7, A: 6.08, d: 12.0, bf: 2.94, Ix: 129.0, Sx: 21.5, rx: 4.61, Iy: 3.86, Sy: 1.73, ry: 0.80 },

  // ==========================================
  // HSS SQUARE & RECTANGULAR TUBING
  // ==========================================
  { name: "HSS2x2x1/8", type: "HSS", weight: 3.05, A: 0.84, d: 2.00, bf: 2.00, Ix: 0.48, Sx: 0.48, rx: 0.75, Iy: 0.48, Sy: 0.48, ry: 0.75 },
  { name: "HSS3x3x3/16", type: "HSS", weight: 6.84, A: 1.89, d: 3.00, bf: 3.00, Ix: 2.46, Sx: 1.64, rx: 1.14, Iy: 2.46, Sy: 1.64, ry: 1.14 },
  { name: "HSS4x4x1/4", type: "HSS", weight: 12.2, A: 3.37, d: 4.00, bf: 4.00, Ix: 7.80, Sx: 3.90, rx: 1.52, Iy: 7.80, Sy: 3.90, ry: 1.52 },
  { name: "HSS4x4x3/8", type: "HSS", weight: 17.3, A: 4.78, d: 4.00, bf: 4.00, Ix: 10.3, Sx: 5.15, rx: 1.47, Iy: 10.3, Sy: 5.15, ry: 1.47 },
  { name: "HSS6x4x1/4", type: "HSS", weight: 15.6, A: 4.30, d: 6.00, bf: 4.00, Ix: 20.6, Sx: 6.87, rx: 2.19, Iy: 11.2, Sy: 5.60, ry: 1.61 },
  { name: "HSS6x6x1/4", type: "HSS", weight: 19.0, A: 5.24, d: 6.00, bf: 6.00, Ix: 28.6, Sx: 9.54, rx: 2.34, Iy: 28.6, Sy: 9.54, ry: 2.34 },
  { name: "HSS6x6x3/8", type: "HSS", weight: 27.5, A: 7.58, d: 6.00, bf: 6.00, Ix: 39.0, Sx: 13.0, rx: 2.27, Iy: 39.0, Sy: 13.0, ry: 2.27 },
  { name: "HSS8x4x1/4", type: "HSS", weight: 19.0, A: 5.24, d: 8.00, bf: 4.00, Ix: 43.1, Sx: 10.8, rx: 2.87, Iy: 14.3, Sy: 7.15, ry: 1.65 },
  { name: "HSS8x8x3/8", type: "HSS", weight: 37.7, A: 10.4, d: 8.00, bf: 8.00, Ix: 98.7, Sx: 24.7, rx: 3.08, Iy: 98.7, Sy: 24.7, ry: 3.08 },
  { name: "HSS10x10x1/2", type: "HSS", weight: 62.5, A: 17.3, d: 10.0, bf: 10.0, Ix: 251.0, Sx: 50.1, rx: 3.81, Iy: 251.0, Sy: 50.1, ry: 3.81 },
  { name: "HSS12x8x1/2", type: "HSS", weight: 62.5, A: 17.3, d: 12.0, bf: 8.00, Ix: 334.0, Sx: 55.7, rx: 4.39, Iy: 176.0, Sy: 44.0, ry: 3.19 },

  // ==========================================
  // HSS ROUND PIPE & STEEL TUBING
  // ==========================================
  { name: "Pipe 2 Std", type: "Pipe", weight: 3.65, A: 1.07, d: 2.38, bf: 2.38, Ix: 0.66, Sx: 0.56, rx: 0.79, Iy: 0.66, Sy: 0.56, ry: 0.79 },
  { name: "Pipe 3 Std", type: "Pipe", weight: 7.58, A: 2.23, d: 3.50, bf: 3.50, Ix: 3.02, Sx: 1.72, rx: 1.16, Iy: 3.02, Sy: 1.72, ry: 1.16 },
  { name: "Pipe 4 Std", type: "Pipe", weight: 10.8, A: 3.17, d: 4.50, bf: 4.50, Ix: 7.23, Sx: 3.21, rx: 1.51, Iy: 7.23, Sy: 3.21, ry: 1.51 },
  { name: "Pipe 6 Std", type: "Pipe", weight: 19.0, A: 5.58, d: 6.63, bf: 6.63, Ix: 28.1, Sx: 8.49, rx: 2.25, Iy: 28.1, Sy: 8.49, ry: 2.25 },
  { name: "Pipe 8 Std", type: "Pipe", weight: 28.6, A: 8.40, d: 8.63, bf: 8.63, Ix: 72.5, Sx: 16.8, rx: 2.94, Iy: 72.5, Sy: 16.8, ry: 2.94 },

  // ==========================================
  // L-SHAPES (EQUAL ANGLES)
  // ==========================================
  { name: "L3x3x1/4", type: "L", weight: 4.9, A: 1.44, d: 3.00, bf: 3.00, Ix: 1.23, Sx: 0.57, rx: 0.93, Iy: 1.23, Sy: 0.57, ry: 0.93 },
  { name: "L4x4x1/4", type: "L", weight: 6.6, A: 1.94, d: 4.00, bf: 4.00, Ix: 3.00, Sx: 1.05, rx: 1.24, Iy: 3.00, Sy: 1.05, ry: 1.24 },
  { name: "L4x4x3/8", type: "L", weight: 9.8, A: 2.86, d: 4.00, bf: 4.00, Ix: 4.29, Sx: 1.52, rx: 1.23, Iy: 4.29, Sy: 1.52, ry: 1.23 },
  { name: "L6x6x1/2", type: "L", weight: 19.6, A: 5.75, d: 6.00, bf: 6.00, Ix: 19.9, Sx: 4.67, rx: 1.86, Iy: 19.9, Sy: 4.67, ry: 1.86 }
];

export function getSectionByName(name) {
  return AISC_DATABASE.find(s => s.name === name) || AISC_DATABASE[0];
}
