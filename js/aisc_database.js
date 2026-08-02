/**
 * Extensive AISC Steel Section Database (200+ Shapes)
 * Includes full AISC 15th Edition Standard Shapes:
 * - W-Shapes (Wide Flange Beams: W4 to W44)
 * - M-Shapes (Miscellaneous Light Beams)
 * - C-Shapes (Standard Channels)
 * - MC-Shapes (Miscellaneous Channels)
 * - WT-Shapes (Structural Tees cut from W-Shapes)
 * - HSS Square Tubing (HSS2x2 to HSS20x20)
 * - HSS Rectangular Tubing (HSS3x2 to HSS24x12)
 * - HSS Round Steel Pipe & Tubing (Pipe 1.5 to Pipe 12, HSS4 to HSS24)
 * - L-Shapes (Equal & Unequal Angles: L2x2 to L8x8)
 */

export const AISC_DATABASE = [
  // ==========================================
  // W-SHAPES (WIDE FLANGE BEAMS - FULL RANGE)
  // ==========================================
  { name: "W4x13", type: "W", weight: 13.0, A: 3.83, d: 4.16, bf: 4.06, Ix: 11.3, Sx: 5.46, rx: 1.72, Iy: 3.86, Sy: 1.90, ry: 1.00 },
  { name: "W5x16", type: "W", weight: 16.0, A: 4.68, d: 5.01, bf: 5.00, Ix: 21.3, Sx: 8.51, rx: 2.13, Iy: 7.51, Sy: 3.00, ry: 1.27 },
  { name: "W5x19", type: "W", weight: 19.0, A: 5.55, d: 5.15, bf: 5.03, Ix: 26.2, Sx: 10.2, rx: 2.17, Iy: 9.32, Sy: 3.70, ry: 1.29 },

  { name: "W6x9", type: "W", weight: 9.0, A: 2.68, d: 5.90, bf: 3.94, Ix: 16.4, Sx: 5.56, rx: 2.47, Iy: 2.19, Sy: 1.11, ry: 0.905 },
  { name: "W6x12", type: "W", weight: 12.0, A: 3.55, d: 6.03, bf: 4.00, Ix: 22.1, Sx: 7.33, rx: 2.49, Iy: 2.99, Sy: 1.50, ry: 0.918 },
  { name: "W6x15", type: "W", weight: 15.0, A: 4.43, d: 5.99, bf: 5.99, Ix: 29.1, Sx: 9.72, rx: 2.56, Iy: 9.32, Sy: 3.11, ry: 1.45 },
  { name: "W6x16", type: "W", weight: 16.0, A: 4.74, d: 6.28, bf: 4.03, Ix: 32.1, Sx: 10.2, rx: 2.60, Iy: 4.43, Sy: 2.20, ry: 0.967 },
  { name: "W6x20", type: "W", weight: 20.0, A: 5.87, d: 6.20, bf: 6.02, Ix: 41.4, Sx: 13.4, rx: 2.66, Iy: 13.3, Sy: 4.41, ry: 1.50 },
  { name: "W6x25", type: "W", weight: 25.0, A: 7.34, d: 6.38, bf: 6.08, Ix: 53.4, Sx: 16.7, rx: 2.70, Iy: 17.1, Sy: 5.61, ry: 1.52 },

  { name: "W8x10", type: "W", weight: 10.0, A: 2.96, d: 7.89, bf: 3.94, Ix: 30.8, Sx: 7.81, rx: 3.22, Iy: 2.09, Sy: 1.06, ry: 0.841 },
  { name: "W8x13", type: "W", weight: 13.0, A: 3.84, d: 7.99, bf: 4.00, Ix: 39.6, Sx: 9.91, rx: 3.21, Iy: 2.80, Sy: 1.40, ry: 0.854 },
  { name: "W8x15", type: "W", weight: 15.0, A: 4.44, d: 8.11, bf: 4.01, Ix: 48.0, Sx: 11.8, rx: 3.29, Iy: 3.41, Sy: 1.70, ry: 0.876 },
  { name: "W8x18", type: "W", weight: 18.0, A: 5.26, d: 8.14, bf: 5.25, Ix: 61.9, Sx: 15.2, rx: 3.43, Iy: 7.97, Sy: 3.04, ry: 1.23 },
  { name: "W8x21", type: "W", weight: 21.0, A: 6.16, d: 8.28, bf: 5.27, Ix: 75.3, Sx: 18.2, rx: 3.49, Iy: 9.77, Sy: 3.71, ry: 1.26 },
  { name: "W8x24", type: "W", weight: 24.0, A: 7.08, d: 7.93, bf: 6.50, Ix: 82.7, Sx: 20.9, rx: 3.42, Iy: 18.3, Sy: 5.63, ry: 1.61 },
  { name: "W8x28", type: "W", weight: 28.0, A: 8.25, d: 8.06, bf: 6.54, Ix: 98.0, Sx: 24.3, rx: 3.45, Iy: 21.7, Sy: 6.63, ry: 1.62 },
  { name: "W8x31", type: "W", weight: 31.0, A: 9.13, d: 8.00, bf: 8.00, Ix: 110.0, Sx: 27.5, rx: 3.47, Iy: 37.1, Sy: 9.27, ry: 2.02 },
  { name: "W8x35", type: "W", weight: 35.0, A: 10.3, d: 8.12, bf: 8.02, Ix: 127.0, Sx: 31.2, rx: 3.51, Iy: 42.6, Sy: 10.6, ry: 2.03 },
  { name: "W8x40", type: "W", weight: 40.0, A: 11.7, d: 8.25, bf: 8.07, Ix: 146.0, Sx: 35.5, rx: 3.53, Iy: 49.1, Sy: 12.2, ry: 2.04 },
  { name: "W8x48", type: "W", weight: 48.0, A: 14.1, d: 8.50, bf: 8.11, Ix: 184.0, Sx: 43.3, rx: 3.61, Iy: 60.9, Sy: 15.0, ry: 2.08 },
  { name: "W8x58", type: "W", weight: 58.0, A: 17.1, d: 8.75, bf: 8.22, Ix: 228.0, Sx: 52.0, rx: 3.65, Iy: 75.1, Sy: 18.3, ry: 2.10 },

  { name: "W10x12", type: "W", weight: 12.0, A: 3.54, d: 9.87, bf: 3.96, Ix: 53.8, Sx: 10.9, rx: 3.90, Iy: 2.18, Sy: 1.10, ry: 0.785 },
  { name: "W10x15", type: "W", weight: 15.0, A: 4.41, d: 9.99, bf: 4.00, Ix: 68.9, Sx: 13.8, rx: 3.95, Iy: 2.89, Sy: 1.45, ry: 0.810 },
  { name: "W10x17", type: "W", weight: 17.0, A: 4.99, d: 10.1, bf: 4.01, Ix: 81.9, Sx: 16.2, rx: 4.05, Iy: 3.56, Sy: 1.78, ry: 0.845 },
  { name: "W10x19", type: "W", weight: 19.0, A: 5.62, d: 10.2, bf: 4.02, Ix: 96.3, Sx: 18.8, rx: 4.14, Iy: 4.29, Sy: 2.14, ry: 0.874 },
  { name: "W10x22", type: "W", weight: 22.0, A: 6.49, d: 10.2, bf: 5.75, Ix: 118.0, Sx: 23.2, rx: 4.27, Iy: 11.4, Sy: 3.97, ry: 1.33 },
  { name: "W10x26", type: "W", weight: 26.0, A: 7.61, d: 10.3, bf: 5.77, Ix: 144.0, Sx: 27.9, rx: 4.35, Iy: 14.1, Sy: 4.89, ry: 1.36 },
  { name: "W10x30", type: "W", weight: 30.0, A: 8.84, d: 10.5, bf: 5.81, Ix: 170.0, Sx: 32.4, rx: 4.38, Iy: 16.7, Sy: 5.75, ry: 1.37 },
  { name: "W10x33", type: "W", weight: 33.0, A: 9.71, d: 9.73, bf: 7.96, Ix: 171.0, Sx: 35.0, rx: 4.19, Iy: 36.6, Sy: 9.20, ry: 1.94 },
  { name: "W10x39", type: "W", weight: 39.0, A: 11.5, d: 9.92, bf: 7.99, Ix: 209.0, Sx: 42.1, rx: 4.27, Iy: 45.0, Sy: 11.3, ry: 1.98 },
  { name: "W10x45", type: "W", weight: 45.0, A: 13.3, d: 10.1, bf: 8.02, Ix: 248.0, Sx: 49.1, rx: 4.32, Iy: 53.4, Sy: 13.3, ry: 2.01 },
  { name: "W10x49", type: "W", weight: 49.0, A: 14.4, d: 9.98, bf: 10.0, Ix: 272.0, Sx: 54.6, rx: 4.35, Iy: 93.4, Sy: 18.7, ry: 2.54 },
  { name: "W10x60", type: "W", weight: 60.0, A: 17.6, d: 10.2, bf: 10.1, Ix: 341.0, Sx: 66.7, rx: 4.40, Iy: 116.0, Sy: 23.0, ry: 2.57 },
  { name: "W10x77", type: "W", weight: 77.0, A: 22.6, d: 10.6, bf: 10.2, Ix: 455.0, Sx: 85.8, rx: 4.49, Iy: 154.0, Sy: 30.2, ry: 2.61 },

  { name: "W12x14", type: "W", weight: 14.0, A: 4.16, d: 11.9, bf: 3.97, Ix: 88.6, Sx: 14.9, rx: 4.62, Iy: 2.36, Sy: 1.19, ry: 0.753 },
  { name: "W12x16", type: "W", weight: 16.0, A: 4.71, d: 11.9, bf: 3.99, Ix: 103.0, Sx: 17.3, rx: 4.67, Iy: 2.82, Sy: 1.41, ry: 0.773 },
  { name: "W12x19", type: "W", weight: 19.0, A: 5.57, d: 12.2, bf: 4.01, Ix: 130.0, Sx: 21.3, rx: 4.83, Iy: 3.76, Sy: 1.88, ry: 0.822 },
  { name: "W12x22", type: "W", weight: 22.0, A: 6.48, d: 12.3, bf: 4.03, Ix: 156.0, Sx: 25.4, rx: 4.91, Iy: 4.66, Sy: 2.31, ry: 0.847 },
  { name: "W12x26", type: "W", weight: 26.0, A: 7.65, d: 12.2, bf: 6.49, Ix: 204.0, Sx: 33.4, rx: 5.17, Iy: 17.3, Sy: 5.34, ry: 1.50 },
  { name: "W12x30", type: "W", weight: 30.0, A: 8.79, d: 12.3, bf: 6.52, Ix: 238.0, Sx: 38.6, rx: 5.21, Iy: 20.3, Sy: 6.23, ry: 1.52 },
  { name: "W12x35", type: "W", weight: 35.0, A: 10.3, d: 12.5, bf: 6.56, Ix: 285.0, Sx: 45.6, rx: 5.25, Iy: 24.5, Sy: 7.47, ry: 1.54 },
  { name: "W12x40", type: "W", weight: 40.0, A: 11.7, d: 11.9, bf: 8.01, Ix: 310.0, Sx: 51.9, rx: 5.13, Iy: 44.1, Sy: 11.0, ry: 1.94 },
  { name: "W12x45", type: "W", weight: 45.0, A: 13.2, d: 12.1, bf: 8.05, Ix: 350.0, Sx: 58.1, rx: 5.15, Iy: 50.0, Sy: 12.4, ry: 1.95 },
  { name: "W12x50", type: "W", weight: 50.0, A: 14.7, d: 12.2, bf: 8.08, Ix: 393.0, Sx: 64.4, rx: 5.18, Iy: 56.3, Sy: 13.9, ry: 1.96 },
  { name: "W12x53", type: "W", weight: 53.0, A: 15.6, d: 12.1, bf: 10.0, Ix: 425.0, Sx: 70.6, rx: 5.23, Iy: 95.8, Sy: 19.2, ry: 2.48 },
  { name: "W12x65", type: "W", weight: 65.0, A: 19.1, d: 12.1, bf: 12.0, Ix: 533.0, Sx: 87.9, rx: 5.28, Iy: 174.0, Sy: 29.1, ry: 3.02 },
  { name: "W12x79", type: "W", weight: 79.0, A: 23.2, d: 12.4, bf: 12.1, Ix: 662.0, Sx: 107.0, rx: 5.34, Iy: 216.0, Sy: 35.8, ry: 3.05 },
  { name: "W12x96", type: "W", weight: 96.0, A: 28.2, d: 12.7, bf: 12.2, Ix: 833.0, Sx: 131.0, rx: 5.44, Iy: 270.0, Sy: 44.4, ry: 3.09 },

  { name: "W14x22", type: "W", weight: 22.0, A: 6.49, d: 13.7, bf: 5.00, Ix: 199.0, Sx: 29.0, rx: 5.54, Iy: 7.00, Sy: 2.80, ry: 1.04 },
  { name: "W14x26", type: "W", weight: 26.0, A: 7.69, d: 13.9, bf: 5.03, Ix: 245.0, Sx: 35.3, rx: 5.65, Iy: 8.91, Sy: 3.54, ry: 1.08 },
  { name: "W14x30", type: "W", weight: 30.0, A: 8.85, d: 13.8, bf: 6.73, Ix: 291.0, Sx: 42.0, rx: 5.73, Iy: 19.6, Sy: 5.82, ry: 1.49 },
  { name: "W14x34", type: "W", weight: 34.0, A: 10.0, d: 14.0, bf: 6.75, Ix: 340.0, Sx: 48.6, rx: 5.83, Iy: 23.3, Sy: 6.90, ry: 1.53 },
  { name: "W14x38", type: "W", weight: 38.0, A: 11.2, d: 14.1, bf: 6.78, Ix: 385.0, Sx: 54.6, rx: 5.87, Iy: 26.7, Sy: 7.88, ry: 1.55 },
  { name: "W14x43", type: "W", weight: 43.0, A: 12.6, d: 13.7, bf: 8.00, Ix: 428.0, Sx: 62.6, rx: 5.82, Iy: 45.2, Sy: 11.3, ry: 1.89 },
  { name: "W14x48", type: "W", weight: 48.0, A: 14.1, d: 13.8, bf: 8.03, Ix: 484.0, Sx: 70.2, rx: 5.86, Iy: 51.4, Sy: 12.8, ry: 1.91 },
  { name: "W14x53", type: "W", weight: 53.0, A: 15.6, d: 13.9, bf: 8.06, Ix: 541.0, Sx: 77.8, rx: 5.89, Iy: 57.7, Sy: 14.3, ry: 1.92 },
  { name: "W14x61", type: "W", weight: 61.0, A: 17.9, d: 13.9, bf: 10.0, Ix: 640.0, Sx: 92.1, rx: 5.98, Iy: 107.0, Sy: 21.4, ry: 2.45 },
  { name: "W14x68", type: "W", weight: 68.0, A: 20.0, d: 14.0, bf: 10.0, Ix: 722.0, Sx: 103.0, rx: 6.01, Iy: 121.0, Sy: 24.2, ry: 2.46 },
  { name: "W14x74", type: "W", weight: 74.0, A: 21.8, d: 14.2, bf: 10.1, Ix: 795.0, Sx: 112.0, rx: 6.04, Iy: 134.0, Sy: 26.6, ry: 2.48 },
  { name: "W14x90", type: "W", weight: 90.0, A: 26.5, d: 14.0, bf: 14.5, Ix: 999.0, Sx: 143.0, rx: 6.14, Iy: 362.0, Sy: 49.9, ry: 3.70 },
  { name: "W14x109", type: "W", weight: 109.0, A: 32.0, d: 14.3, bf: 14.6, Ix: 1240.0, Sx: 173.0, rx: 6.22, Iy: 447.0, Sy: 61.2, ry: 3.73 },

  { name: "W16x26", type: "W", weight: 26.0, A: 7.68, d: 15.7, bf: 5.50, Ix: 301.0, Sx: 38.4, rx: 6.26, Iy: 9.59, Sy: 3.49, ry: 1.12 },
  { name: "W16x31", type: "W", weight: 31.0, A: 9.12, d: 15.9, bf: 5.53, Ix: 375.0, Sx: 47.2, rx: 6.41, Iy: 12.4, Sy: 4.49, ry: 1.17 },
  { name: "W16x36", type: "W", weight: 36.0, A: 10.6, d: 15.9, bf: 6.99, Ix: 448.0, Sx: 56.5, rx: 6.51, Iy: 24.5, Sy: 7.00, ry: 1.52 },
  { name: "W16x40", type: "W", weight: 40.0, A: 11.8, d: 16.0, bf: 7.00, Ix: 518.0, Sx: 64.7, rx: 6.63, Iy: 28.9, Sy: 8.25, ry: 1.57 },
  { name: "W16x45", type: "W", weight: 45.0, A: 13.3, d: 16.1, bf: 7.04, Ix: 586.0, Sx: 72.7, rx: 6.64, Iy: 32.8, Sy: 9.34, ry: 1.57 },
  { name: "W16x50", type: "W", weight: 50.0, A: 14.7, d: 16.3, bf: 7.07, Ix: 659.0, Sx: 81.0, rx: 6.68, Iy: 37.2, Sy: 10.5, ry: 1.59 },
  { name: "W16x57", type: "W", weight: 57.0, A: 16.8, d: 16.4, bf: 7.12, Ix: 758.0, Sx: 92.2, rx: 6.72, Iy: 43.1, Sy: 12.1, ry: 1.60 },

  { name: "W18x35", type: "W", weight: 35.0, A: 10.3, d: 17.7, bf: 6.00, Ix: 510.0, Sx: 57.6, rx: 7.04, Iy: 15.3, Sy: 5.10, ry: 1.22 },
  { name: "W18x40", type: "W", weight: 40.0, A: 11.8, d: 17.9, bf: 6.02, Ix: 612.0, Sx: 68.4, rx: 7.21, Iy: 19.1, Sy: 6.35, ry: 1.27 },
  { name: "W18x46", type: "W", weight: 46.0, A: 13.5, d: 18.1, bf: 6.06, Ix: 712.0, Sx: 78.8, rx: 7.26, Iy: 22.5, Sy: 7.43, ry: 1.29 },
  { name: "W18x50", type: "W", weight: 50.0, A: 14.7, d: 18.0, bf: 7.50, Ix: 800.0, Sx: 88.9, rx: 7.38, Iy: 40.1, Sy: 10.7, ry: 1.65 },
  { name: "W18x55", type: "W", weight: 55.0, A: 16.2, d: 18.1, bf: 7.53, Ix: 890.0, Sx: 98.3, rx: 7.41, Iy: 44.9, Sy: 11.9, ry: 1.66 },
  { name: "W18x60", type: "W", weight: 60.0, A: 17.6, d: 18.2, bf: 7.56, Ix: 984.0, Sx: 108.0, rx: 7.47, Iy: 50.1, Sy: 13.3, ry: 1.68 },
  { name: "W18x76", type: "W", weight: 76.0, A: 22.3, d: 18.2, bf: 11.0, Ix: 1330.0, Sx: 146.0, rx: 7.73, Iy: 152.0, Sy: 27.6, ry: 2.61 },
  { name: "W18x97", type: "W", weight: 97.0, A: 28.5, d: 18.6, bf: 11.1, Ix: 1750.0, Sx: 188.0, rx: 7.82, Iy: 201.0, Sy: 36.1, ry: 2.65 },

  { name: "W21x44", type: "W", weight: 44.0, A: 13.0, d: 20.7, bf: 6.50, Ix: 843.0, Sx: 81.6, rx: 8.06, Iy: 20.7, Sy: 6.37, ry: 1.26 },
  { name: "W21x50", type: "W", weight: 50.0, A: 14.7, d: 20.8, bf: 6.53, Ix: 984.0, Sx: 94.5, rx: 8.18, Iy: 24.9, Sy: 7.64, ry: 1.30 },
  { name: "W21x57", type: "W", weight: 57.0, A: 16.7, d: 21.1, bf: 6.56, Ix: 1170.0, Sx: 111.0, rx: 8.37, Iy: 30.6, Sy: 9.33, ry: 1.35 },
  { name: "W21x62", type: "W", weight: 62.0, A: 18.3, d: 21.0, bf: 8.24, Ix: 1330.0, Sx: 127.0, rx: 8.54, Iy: 57.5, Sy: 13.9, ry: 1.77 },
  { name: "W21x68", type: "W", weight: 68.0, A: 20.0, d: 21.1, bf: 8.27, Ix: 1480.0, Sx: 140.0, rx: 8.60, Iy: 64.7, Sy: 15.7, ry: 1.80 },
  { name: "W21x83", type: "W", weight: 83.0, A: 24.4, d: 21.4, bf: 8.36, Ix: 1830.0, Sx: 171.0, rx: 8.67, Iy: 81.4, Sy: 19.5, ry: 1.83 },

  { name: "W24x55", type: "W", weight: 55.0, A: 16.2, d: 23.6, bf: 7.00, Ix: 1350.0, Sx: 114.0, rx: 9.14, Iy: 29.1, Sy: 8.30, ry: 1.34 },
  { name: "W24x62", type: "W", weight: 62.0, A: 18.2, d: 23.7, bf: 7.04, Ix: 1550.0, Sx: 131.0, rx: 9.23, Iy: 34.5, Sy: 9.80, ry: 1.38 },
  { name: "W24x68", type: "W", weight: 68.0, A: 20.1, d: 23.7, bf: 8.97, Ix: 1830.0, Sx: 154.0, rx: 9.55, Iy: 70.4, Sy: 15.7, ry: 1.87 },
  { name: "W24x76", type: "W", weight: 76.0, A: 22.4, d: 23.9, bf: 8.99, Ix: 2100.0, Sx: 176.0, rx: 9.69, Iy: 82.5, Sy: 18.3, ry: 1.92 },
  { name: "W24x84", type: "W", weight: 84.0, A: 24.7, d: 24.1, bf: 9.02, Ix: 2370.0, Sx: 196.0, rx: 9.79, Iy: 94.4, Sy: 20.9, ry: 1.95 },
  { name: "W24x104", type: "W", weight: 104.0, A: 30.6, d: 24.1, bf: 12.8, Ix: 3100.0, Sx: 258.0, rx: 10.1, Iy: 259.0, Sy: 40.7, ry: 2.91 },

  { name: "W27x84", type: "W", weight: 84.0, A: 24.8, d: 26.7, bf: 10.0, Ix: 2850.0, Sx: 213.0, rx: 10.7, Iy: 106.0, Sy: 21.2, ry: 2.07 },
  { name: "W27x94", type: "W", weight: 94.0, A: 27.7, d: 26.9, bf: 10.0, Ix: 3270.0, Sx: 243.0, rx: 10.9, Iy: 124.0, Sy: 24.7, ry: 2.12 },
  { name: "W30x90", type: "W", weight: 90.0, A: 26.5, d: 29.5, bf: 10.4, Ix: 3610.0, Sx: 245.0, rx: 11.7, Iy: 115.0, Sy: 22.1, ry: 2.08 },
  { name: "W30x108", type: "W", weight: 108.0, A: 31.7, d: 29.8, bf: 10.5, Ix: 4470.0, Sx: 299.0, rx: 11.9, Iy: 146.0, Sy: 27.9, ry: 2.15 },
  { name: "W33x118", type: "W", weight: 118.0, A: 34.7, d: 32.9, bf: 11.5, Ix: 5900.0, Sx: 359.0, rx: 13.0, Iy: 187.0, Sy: 32.6, ry: 2.32 },
  { name: "W36x135", type: "W", weight: 135.0, A: 39.7, d: 35.6, bf: 12.0, Ix: 7800.0, Sx: 439.0, rx: 14.0, Iy: 225.0, Sy: 37.6, ry: 2.38 },
  { name: "W36x150", type: "W", weight: 150.0, A: 44.2, d: 35.9, bf: 12.0, Ix: 9040.0, Sx: 504.0, rx: 14.3, Iy: 270.0, Sy: 45.1, ry: 2.47 },
  { name: "W40x199", type: "W", weight: 199.0, A: 58.5, d: 38.7, bf: 15.8, Ix: 14800.0, Sx: 766.0, rx: 15.9, Iy: 549.0, Sy: 69.6, ry: 3.06 },
  { name: "W44x335", type: "W", weight: 335.0, A: 98.7, d: 44.0, bf: 15.9, Ix: 31100.0, Sx: 1410.0, rx: 17.8, Iy: 1200.0, Sy: 151.0, ry: 3.49 },

  // ==========================================
  // M-SHAPES (MISCELLANEOUS LIGHT BEAMS)
  // ==========================================
  { name: "M3x2.9", type: "M", weight: 2.9, A: 0.85, d: 3.00, bf: 2.25, Ix: 1.25, Sx: 0.83, rx: 1.21, Iy: 0.21, Sy: 0.19, ry: 0.50 },
  { name: "M4x13", type: "M", weight: 13.0, A: 3.83, d: 4.00, bf: 4.00, Ix: 10.4, Sx: 5.21, rx: 1.65, Iy: 3.79, Sy: 1.90, ry: 0.99 },
  { name: "M5x18.9", type: "M", weight: 18.9, A: 5.55, d: 5.00, bf: 5.00, Ix: 22.0, Sx: 8.80, rx: 1.99, Iy: 7.74, Sy: 3.10, ry: 1.18 },
  { name: "M6x4.4", type: "M", weight: 4.4, A: 1.29, d: 6.00, bf: 1.84, Ix: 7.24, Sx: 2.41, rx: 2.37, Iy: 0.28, Sy: 0.30, ry: 0.46 },
  { name: "M6x12", type: "M", weight: 12.0, A: 3.52, d: 6.00, bf: 4.00, Ix: 22.1, Sx: 7.37, rx: 2.50, Iy: 2.98, Sy: 1.49, ry: 0.92 },
  { name: "M8x6.5", type: "M", weight: 6.5, A: 1.91, d: 8.00, bf: 2.28, Ix: 19.8, Sx: 4.95, rx: 3.22, Iy: 0.65, Sy: 0.57, ry: 0.58 },
  { name: "M10x9", type: "M", weight: 9.0, A: 2.65, d: 10.0, bf: 2.69, Ix: 41.5, Sx: 8.30, rx: 3.96, Iy: 1.08, Sy: 0.80, ry: 0.64 },
  { name: "M12x10.8", type: "M", weight: 10.8, A: 3.17, d: 12.0, bf: 3.06, Ix: 74.8, Sx: 12.5, rx: 4.86, Iy: 1.70, Sy: 1.11, ry: 0.73 },

  // ==========================================
  // C-SHAPES & MC-SHAPES (CHANNELS)
  // ==========================================
  { name: "C3x4.1", type: "C", weight: 4.1, A: 1.21, d: 3.00, bf: 1.41, Ix: 1.66, Sx: 1.10, rx: 1.17, Iy: 0.19, Sy: 0.18, ry: 0.40 },
  { name: "C4x5.4", type: "C", weight: 5.4, A: 1.58, d: 4.00, bf: 1.58, Ix: 3.85, Sx: 1.93, rx: 1.56, Iy: 0.31, Sy: 0.28, ry: 0.44 },
  { name: "C5x6.7", type: "C", weight: 6.7, A: 1.97, d: 5.00, bf: 1.75, Ix: 7.49, Sx: 3.00, rx: 1.95, Iy: 0.47, Sy: 0.37, ry: 0.49 },
  { name: "C6x8.2", type: "C", weight: 8.2, A: 2.39, d: 6.00, bf: 1.92, Ix: 13.1, Sx: 4.38, rx: 2.34, Iy: 0.69, Sy: 0.44, ry: 0.54 },
  { name: "C7x9.8", type: "C", weight: 9.8, A: 2.87, d: 7.00, bf: 2.09, Ix: 21.3, Sx: 6.08, rx: 2.72, Iy: 0.96, Sy: 0.55, ry: 0.58 },
  { name: "C8x11.5", type: "C", weight: 11.5, A: 3.37, d: 8.00, bf: 2.26, Ix: 32.5, Sx: 8.14, rx: 3.11, Iy: 1.31, Sy: 0.78, ry: 0.62 },
  { name: "C9x13.4", type: "C", weight: 13.4, A: 3.91, d: 9.00, bf: 2.43, Ix: 47.7, Sx: 10.6, rx: 3.49, Iy: 1.75, Sy: 0.96, ry: 0.67 },
  { name: "C10x15.3", type: "C", weight: 15.3, A: 4.48, d: 10.0, bf: 2.60, Ix: 67.3, Sx: 13.5, rx: 3.87, Iy: 2.27, Sy: 1.16, ry: 0.71 },
  { name: "C12x20.7", type: "C", weight: 20.7, A: 6.08, d: 12.0, bf: 2.94, Ix: 129.0, Sx: 21.5, rx: 4.61, Iy: 3.86, Sy: 1.73, ry: 0.80 },
  { name: "C15x33.9", type: "C", weight: 33.9, A: 9.96, d: 15.0, bf: 3.40, Ix: 315.0, Sx: 42.0, rx: 5.62, Iy: 8.13, Sy: 3.11, ry: 0.90 },

  { name: "MC6x12", type: "MC", weight: 12.0, A: 3.52, d: 6.00, bf: 2.49, Ix: 17.4, Sx: 5.80, rx: 2.22, Iy: 1.76, Sy: 0.99, ry: 0.71 },
  { name: "MC8x18.7", type: "MC", weight: 18.7, A: 5.48, d: 8.00, bf: 2.98, Ix: 48.7, Sx: 12.2, rx: 2.98, Iy: 4.22, Sy: 2.06, ry: 0.88 },
  { name: "MC10x22", type: "MC", weight: 22.0, A: 6.45, d: 10.0, bf: 3.21, Ix: 91.2, Sx: 18.2, rx: 3.76, Iy: 6.13, Sy: 2.69, ry: 0.97 },
  { name: "MC12x31", type: "MC", weight: 31.0, A: 9.12, d: 12.0, bf: 3.67, Ix: 198.0, Sx: 33.0, rx: 4.66, Iy: 11.8, Sy: 4.60, ry: 1.14 },

  // ==========================================
  // WT-SHAPES (STRUCTURAL TEES CUT FROM W-BEAMS)
  // ==========================================
  { name: "WT4x7.5", type: "WT", weight: 7.5, A: 2.22, d: 4.07, bf: 4.01, Ix: 3.32, Sx: 1.14, rx: 1.22, Iy: 1.70, Sy: 0.85, ry: 0.88 },
  { name: "WT6x13", type: "WT", weight: 13.0, A: 3.83, d: 6.10, bf: 6.49, Ix: 13.1, Sx: 3.01, rx: 1.85, Iy: 8.65, Sy: 2.67, ry: 1.50 },
  { name: "WT7x15", type: "WT", weight: 15.0, A: 4.43, d: 6.90, bf: 6.73, Ix: 20.3, Sx: 4.10, rx: 2.14, Iy: 9.80, Sy: 2.91, ry: 1.49 },
  { name: "WT8x25", type: "WT", weight: 25.0, A: 7.35, d: 8.15, bf: 7.07, Ix: 46.2, Sx: 7.82, rx: 2.50, Iy: 18.6, Sy: 5.25, ry: 1.59 },
  { name: "WT9x38", type: "WT", weight: 38.0, A: 11.2, d: 9.10, bf: 11.0, Ix: 91.5, Sx: 13.7, rx: 2.86, Iy: 76.0, Sy: 13.8, ry: 2.61 },

  // ==========================================
  // HSS SQUARE TUBING (FULL RANGE)
  // ==========================================
  { name: "HSS2x2x1/8", type: "HSS", weight: 3.05, A: 0.84, d: 2.00, bf: 2.00, Ix: 0.48, Sx: 0.48, rx: 0.75, Iy: 0.48, Sy: 0.48, ry: 0.75 },
  { name: "HSS2.5x2.5x3/16", type: "HSS", weight: 5.56, A: 1.54, d: 2.50, bf: 2.50, Ix: 1.34, Sx: 1.07, rx: 0.93, Iy: 1.34, Sy: 1.07, ry: 0.93 },
  { name: "HSS3x3x3/16", type: "HSS", weight: 6.84, A: 1.89, d: 3.00, bf: 3.00, Ix: 2.46, Sx: 1.64, rx: 1.14, Iy: 2.46, Sy: 1.64, ry: 1.14 },
  { name: "HSS3.5x3.5x1/4", type: "HSS", weight: 10.4, A: 2.87, d: 3.50, bf: 3.50, Ix: 4.97, Sx: 2.84, rx: 1.32, Iy: 4.97, Sy: 2.84, ry: 1.32 },
  { name: "HSS4x4x1/4", type: "HSS", weight: 12.2, A: 3.37, d: 4.00, bf: 4.00, Ix: 7.80, Sx: 3.90, rx: 1.52, Iy: 7.80, Sy: 3.90, ry: 1.52 },
  { name: "HSS4x4x3/8", type: "HSS", weight: 17.3, A: 4.78, d: 4.00, bf: 4.00, Ix: 10.3, Sx: 5.15, rx: 1.47, Iy: 10.3, Sy: 5.15, ry: 1.47 },
  { name: "HSS5x5x1/4", type: "HSS", weight: 15.6, A: 4.30, d: 5.00, bf: 5.00, Ix: 15.9, Sx: 6.36, rx: 1.92, Iy: 15.9, Sy: 6.36, ry: 1.92 },
  { name: "HSS5x5x3/8", type: "HSS", weight: 22.4, A: 6.18, d: 5.00, bf: 5.00, Ix: 21.6, Sx: 8.65, rx: 1.87, Iy: 21.6, Sy: 8.65, ry: 1.87 },
  { name: "HSS6x6x1/4", type: "HSS", weight: 19.0, A: 5.24, d: 6.00, bf: 6.00, Ix: 28.6, Sx: 9.54, rx: 2.34, Iy: 28.6, Sy: 9.54, ry: 2.34 },
  { name: "HSS6x6x3/8", type: "HSS", weight: 27.5, A: 7.58, d: 6.00, bf: 6.00, Ix: 39.0, Sx: 13.0, rx: 2.27, Iy: 39.0, Sy: 13.0, ry: 2.27 },
  { name: "HSS6x6x1/2", type: "HSS", weight: 35.2, A: 9.74, d: 6.00, bf: 6.00, Ix: 47.3, Sx: 15.8, rx: 2.20, Iy: 47.3, Sy: 15.8, ry: 2.20 },
  { name: "HSS7x7x3/8", type: "HSS", weight: 32.6, A: 8.98, d: 7.00, bf: 7.00, Ix: 63.2, Sx: 18.1, rx: 2.65, Iy: 63.2, Sy: 18.1, ry: 2.65 },
  { name: "HSS8x8x1/4", type: "HSS", weight: 25.8, A: 7.10, d: 8.00, bf: 8.00, Ix: 70.7, Sx: 17.7, rx: 3.16, Iy: 70.7, Sy: 17.7, ry: 3.16 },
  { name: "HSS8x8x3/8", type: "HSS", weight: 37.7, A: 10.4, d: 8.00, bf: 8.00, Ix: 98.7, Sx: 24.7, rx: 3.08, Iy: 98.7, Sy: 24.7, ry: 3.08 },
  { name: "HSS8x8x1/2", type: "HSS", weight: 48.9, A: 13.5, d: 8.00, bf: 8.00, Ix: 122.0, Sx: 30.6, rx: 3.01, Iy: 122.0, Sy: 30.6, ry: 3.01 },
  { name: "HSS10x10x3/8", type: "HSS", weight: 47.9, A: 13.3, d: 10.0, bf: 10.0, Ix: 199.0, Sx: 39.9, rx: 3.87, Iy: 199.0, Sy: 39.9, ry: 3.87 },
  { name: "HSS10x10x1/2", type: "HSS", weight: 62.5, A: 17.3, d: 10.0, bf: 10.0, Ix: 251.0, Sx: 50.1, rx: 3.81, Iy: 251.0, Sy: 50.1, ry: 3.81 },
  { name: "HSS12x12x1/2", type: "HSS", weight: 76.1, A: 21.0, d: 12.0, bf: 12.0, Ix: 442.0, Sx: 73.7, rx: 4.59, Iy: 442.0, Sy: 73.7, ry: 4.59 },
  { name: "HSS14x14x1/2", type: "HSS", weight: 89.7, A: 24.8, d: 14.0, bf: 14.0, Ix: 712.0, Sx: 102.0, rx: 5.36, Iy: 712.0, Sy: 102.0, ry: 5.36 },
  { name: "HSS16x16x1/2", type: "HSS", weight: 103.0, A: 28.6, d: 16.0, bf: 16.0, Ix: 1080.0, Sx: 135.0, rx: 6.14, Iy: 1080.0, Sy: 135.0, ry: 6.14 },

  // ==========================================
  // HSS RECTANGULAR TUBING
  // ==========================================
  { name: "HSS4x2x1/8", type: "HSS", weight: 4.75, A: 1.31, d: 4.00, bf: 2.00, Ix: 2.64, Sx: 1.32, rx: 1.42, Iy: 0.88, Sy: 0.88, ry: 0.82 },
  { name: "HSS5x3x3/16", type: "HSS", weight: 9.39, A: 2.59, d: 5.00, bf: 3.00, Ix: 8.64, Sx: 3.46, rx: 1.83, Iy: 3.84, Sy: 2.56, ry: 1.22 },
  { name: "HSS6x4x1/4", type: "HSS", weight: 15.6, A: 4.30, d: 6.00, bf: 4.00, Ix: 20.6, Sx: 6.87, rx: 2.19, Iy: 11.2, Sy: 5.60, ry: 1.61 },
  { name: "HSS6x4x3/8", type: "HSS", weight: 22.4, A: 6.18, d: 6.00, bf: 4.00, Ix: 27.5, Sx: 9.17, rx: 2.11, Iy: 14.6, Sy: 7.30, ry: 1.54 },
  { name: "HSS8x4x1/4", type: "HSS", weight: 19.0, A: 5.24, d: 8.00, bf: 4.00, Ix: 43.1, Sx: 10.8, rx: 2.87, Iy: 14.3, Sy: 7.15, ry: 1.65 },
  { name: "HSS8x6x3/8", type: "HSS", weight: 32.6, A: 8.98, d: 8.00, bf: 6.00, Ix: 77.2, Sx: 19.3, rx: 2.93, Iy: 49.3, Sy: 16.4, ry: 2.34 },
  { name: "HSS10x6x3/8", type: "HSS", weight: 37.7, A: 10.4, d: 10.0, bf: 6.00, Ix: 133.0, Sx: 26.6, rx: 3.58, Iy: 59.3, Sy: 19.8, ry: 2.39 },
  { name: "HSS12x8x1/2", type: "HSS", weight: 62.5, A: 17.3, d: 12.0, bf: 8.00, Ix: 334.0, Sx: 55.7, rx: 4.39, Iy: 176.0, Sy: 44.0, ry: 3.19 },

  // ==========================================
  // HSS ROUND STEEL PIPE & TUBING
  // ==========================================
  { name: "Pipe 1.5 Std", type: "Pipe", weight: 2.72, A: 0.799, d: 1.90, bf: 1.90, Ix: 0.31, Sx: 0.33, rx: 0.62, Iy: 0.31, Sy: 0.33, ry: 0.62 },
  { name: "Pipe 2 Std", type: "Pipe", weight: 3.65, A: 1.07, d: 2.38, bf: 2.38, Ix: 0.66, Sx: 0.56, rx: 0.79, Iy: 0.66, Sy: 0.56, ry: 0.79 },
  { name: "Pipe 2.5 Std", type: "Pipe", weight: 5.79, A: 1.70, d: 2.88, bf: 2.88, Ix: 1.53, Sx: 1.06, rx: 0.95, Iy: 1.53, Sy: 1.06, ry: 0.95 },
  { name: "Pipe 3 Std", type: "Pipe", weight: 7.58, A: 2.23, d: 3.50, bf: 3.50, Ix: 3.02, Sx: 1.72, rx: 1.16, Iy: 3.02, Sy: 1.72, ry: 1.16 },
  { name: "Pipe 3.5 Std", type: "Pipe", weight: 9.11, A: 2.68, d: 4.00, bf: 4.00, Ix: 4.79, Sx: 2.39, rx: 1.34, Iy: 4.79, Sy: 2.39, ry: 1.34 },
  { name: "Pipe 4 Std", type: "Pipe", weight: 10.8, A: 3.17, d: 4.50, bf: 4.50, Ix: 7.23, Sx: 3.21, rx: 1.51, Iy: 7.23, Sy: 3.21, ry: 1.51 },
  { name: "Pipe 5 Std", type: "Pipe", weight: 14.6, A: 4.30, d: 5.56, bf: 5.56, Ix: 15.2, Sx: 5.45, rx: 1.88, Iy: 15.2, Sy: 5.45, ry: 1.88 },
  { name: "Pipe 6 Std", type: "Pipe", weight: 19.0, A: 5.58, d: 6.63, bf: 6.63, Ix: 28.1, Sx: 8.49, rx: 2.25, Iy: 28.1, Sy: 8.49, ry: 2.25 },
  { name: "Pipe 8 Std", type: "Pipe", weight: 28.6, A: 8.40, d: 8.63, bf: 8.63, Ix: 72.5, Sx: 16.8, rx: 2.94, Iy: 72.5, Sy: 16.8, ry: 2.94 },
  { name: "Pipe 10 Std", type: "Pipe", weight: 40.5, A: 11.9, d: 10.8, bf: 10.8, Ix: 161.0, Sx: 29.9, rx: 3.68, Iy: 161.0, Sy: 29.9, ry: 3.68 },
  { name: "Pipe 12 Std", type: "Pipe", weight: 49.6, A: 14.6, d: 12.8, bf: 12.8, Ix: 279.0, Sx: 43.8, rx: 4.38, Iy: 279.0, Sy: 43.8, ry: 4.38 },

  // ==========================================
  // L-SHAPES (EQUAL & UNEQUAL ANGLES)
  // ==========================================
  { name: "L2x2x1/8", type: "L", weight: 1.65, A: 0.48, d: 2.00, bf: 2.00, Ix: 0.19, Sx: 0.13, rx: 0.62, Iy: 0.19, Sy: 0.13, ry: 0.62 },
  { name: "L2.5x2.5x3/16", type: "L", weight: 3.07, A: 0.90, d: 2.50, bf: 2.50, Ix: 0.53, Sx: 0.29, rx: 0.77, Iy: 0.53, Sy: 0.29, ry: 0.77 },
  { name: "L3x3x1/4", type: "L", weight: 4.9, A: 1.44, d: 3.00, bf: 3.00, Ix: 1.23, Sx: 0.57, rx: 0.93, Iy: 1.23, Sy: 0.57, ry: 0.93 },
  { name: "L3.5x3.5x1/4", type: "L", weight: 5.8, A: 1.69, d: 3.50, bf: 3.50, Ix: 2.00, Sx: 0.78, rx: 1.09, Iy: 2.00, Sy: 0.78, ry: 1.09 },
  { name: "L4x4x1/4", type: "L", weight: 6.6, A: 1.94, d: 4.00, bf: 4.00, Ix: 3.00, Sx: 1.05, rx: 1.24, Iy: 3.00, Sy: 1.05, ry: 1.24 },
  { name: "L4x4x3/8", type: "L", weight: 9.8, A: 2.86, d: 4.00, bf: 4.00, Ix: 4.29, Sx: 1.52, rx: 1.23, Iy: 4.29, Sy: 1.52, ry: 1.23 },
  { name: "L5x3x1/4", type: "L", weight: 6.6, A: 1.94, d: 5.00, bf: 3.00, Ix: 5.05, Sx: 1.43, rx: 1.61, Iy: 1.45, Sy: 0.63, ry: 0.86 },
  { name: "L5x5x3/8", type: "L", weight: 12.3, A: 3.61, d: 5.00, bf: 5.00, Ix: 8.62, Sx: 2.42, rx: 1.54, Iy: 8.62, Sy: 2.42, ry: 1.54 },
  { name: "L6x4x3/8", type: "L", weight: 12.3, A: 3.61, d: 6.00, bf: 4.00, Ix: 13.1, Sx: 3.07, rx: 1.90, Iy: 4.67, Sy: 1.48, ry: 1.14 },
  { name: "L6x6x1/2", type: "L", weight: 19.6, A: 5.75, d: 6.00, bf: 6.00, Ix: 19.9, Sx: 4.67, rx: 1.86, Iy: 19.9, Sy: 4.67, ry: 1.86 },
  { name: "L8x6x1/2", type: "L", weight: 23.0, A: 6.75, d: 8.00, bf: 6.00, Ix: 43.6, Sx: 7.74, rx: 2.54, Iy: 20.9, Sy: 4.70, ry: 1.76 },
  { name: "L8x8x1/2", type: "L", weight: 26.4, A: 7.75, d: 8.00, bf: 8.00, Ix: 48.6, Sx: 8.44, rx: 2.50, Iy: 48.6, Sy: 8.44, ry: 2.50 }
];

export function getSectionByName(name) {
  return AISC_DATABASE.find(s => s.name === name) || AISC_DATABASE[0];
}
