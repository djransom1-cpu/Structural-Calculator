/**
 * AISC 15th / 16th Edition Steel Database (Standard W, HSS, Pipe, and Angle Shapes)
 * Properties derived from official AISC Shapes Database v15.0:
 * - A: Gross Cross-Sectional Area (in^2)
 * - d: Depth (in)
 * - bf: Flange Width (in)
 * - tf: Flange Thickness (in)
 * - tw: Web Thickness (in)
 * - Ix: Strong-axis Moment of Inertia (in^4)
 * - Sx: Strong-axis Elastic Section Modulus (in^3)
 * - Zx: Strong-axis Plastic Section Modulus (in^3)
 * - rx: Strong-axis Radius of Gyration (in)
 * - Iy: Weak-axis Moment of Inertia (in^4)
 * - Sy: Weak-axis Elastic Section Modulus (in^3)
 * - Zy: Weak-axis Plastic Section Modulus (in^3)
 * - ry: Weak-axis Radius of Gyration (in)
 */

export const AISC_DATABASE = [
  // --- W4 SHAPES ---
  { name: "W4x13", type: "W", weight: 13, A: 3.83, d: 4.16, bf: 4.06, tf: 0.345, tw: 0.280, Ix: 11.3, Sx: 5.46, Zx: 6.28, rx: 1.72, Iy: 3.86, Sy: 1.90, Zy: 2.96, ry: 1.00 },

  // --- W5 SHAPES ---
  { name: "W5x16", type: "W", weight: 16, A: 4.68, d: 5.01, bf: 5.00, tf: 0.360, tw: 0.240, Ix: 21.4, Sx: 8.55, Zx: 9.71, rx: 2.14, Iy: 7.51, Sy: 3.00, Zy: 4.67, ry: 1.27 },
  { name: "W5x19", type: "W", weight: 19, A: 5.56, d: 5.15, bf: 5.03, tf: 0.430, tw: 0.270, Ix: 26.2, Sx: 10.2, Zx: 11.7, rx: 2.17, Iy: 9.13, Sy: 3.63, Zy: 5.69, ry: 1.28 },

  // --- W6 SHAPES ---
  { name: "W6x9", type: "W", weight: 9, A: 2.68, d: 5.90, bf: 3.94, tf: 0.215, tw: 0.170, Ix: 16.4, Sx: 5.56, Zx: 6.23, rx: 2.47, Iy: 2.19, Sy: 1.11, Zy: 1.76, ry: 0.905 },
  { name: "W6x12", type: "W", weight: 12, A: 3.55, d: 6.03, bf: 4.00, tf: 0.280, tw: 0.230, Ix: 22.1, Sx: 7.33, Zx: 8.30, rx: 2.49, Iy: 2.99, Sy: 1.50, Zy: 2.38, ry: 0.918 },
  { name: "W6x15", type: "W", weight: 15, A: 4.43, d: 5.99, bf: 5.99, tf: 0.260, tw: 0.230, Ix: 29.1, Sx: 9.72, Zx: 10.8, rx: 2.56, Iy: 9.32, Sy: 3.11, Zy: 4.79, ry: 1.45 },
  { name: "W6x16", type: "W", weight: 16, A: 4.74, d: 6.28, bf: 4.03, tf: 0.405, tw: 0.260, Ix: 32.1, Sx: 10.2, Zx: 11.7, rx: 2.60, Iy: 4.43, Sy: 2.20, Zy: 3.47, ry: 0.967 },
  { name: "W6x20", type: "W", weight: 20, A: 5.87, d: 6.20, bf: 6.02, tf: 0.365, tw: 0.260, Ix: 41.4, Sx: 13.4, Zx: 14.9, rx: 2.66, Iy: 13.3, Sy: 4.41, Zy: 6.78, ry: 1.50 },
  { name: "W6x25", type: "W", weight: 25, A: 7.34, d: 6.38, bf: 6.08, tf: 0.455, tw: 0.320, Ix: 53.4, Sx: 16.7, Zx: 18.9, rx: 2.70, Iy: 17.1, Sy: 5.63, Zy: 8.67, ry: 1.52 },

  // --- W8 SHAPES ---
  { name: "W8x10", type: "W", weight: 10, A: 2.96, d: 7.89, bf: 3.94, tf: 0.205, tw: 0.170, Ix: 30.8, Sx: 7.81, Zx: 8.87, rx: 3.22, Iy: 2.09, Sy: 1.06, Zy: 1.69, ry: 0.841 },
  { name: "W8x13", type: "W", weight: 13, A: 3.84, d: 7.99, bf: 4.00, tf: 0.255, tw: 0.230, Ix: 39.6, Sx: 9.91, Zx: 11.4, rx: 3.21, Iy: 2.73, Sy: 1.37, Zy: 2.18, ry: 0.843 },
  { name: "W8x15", type: "W", weight: 15, A: 4.44, d: 8.11, bf: 4.02, tf: 0.315, tw: 0.245, Ix: 48.0, Sx: 11.8, Zx: 13.6, rx: 3.29, Iy: 3.41, Sy: 1.70, Zy: 2.71, ry: 0.876 },
  { name: "W8x18", type: "W", weight: 18, A: 5.26, d: 8.14, bf: 5.25, tf: 0.330, tw: 0.230, Ix: 61.9, Sx: 15.2, Zx: 17.0, rx: 3.43, Iy: 7.97, Sy: 3.04, Zy: 4.71, ry: 1.23 },
  { name: "W8x21", type: "W", weight: 21, A: 6.16, d: 8.28, bf: 5.27, tf: 0.400, tw: 0.250, Ix: 75.3, Sx: 18.2, Zx: 20.4, rx: 3.49, Iy: 9.77, Sy: 3.71, Zy: 5.76, ry: 1.26 },
  { name: "W8x24", type: "W", weight: 24, A: 7.08, d: 7.93, bf: 6.50, tf: 0.400, tw: 0.245, Ix: 82.7, Sx: 20.9, Zx: 23.2, rx: 3.42, Iy: 18.3, Sy: 5.63, Zy: 8.63, ry: 1.61 },
  { name: "W8x28", type: "W", weight: 28, A: 8.25, d: 8.06, bf: 6.54, tf: 0.465, tw: 0.285, Ix: 98.0, Sx: 24.3, Zx: 27.2, rx: 3.45, Iy: 21.7, Sy: 6.64, Zy: 10.2, ry: 1.62 },
  { name: "W8x31", type: "W", weight: 31, A: 9.13, d: 8.00, bf: 8.00, tf: 0.435, tw: 0.285, Ix: 110.0, Sx: 27.5, Zx: 30.4, rx: 3.47, Iy: 37.1, Sy: 9.27, Zy: 14.1, ry: 2.02 },
  { name: "W8x35", type: "W", weight: 35, A: 10.3, d: 8.12, bf: 8.02, tf: 0.495, tw: 0.310, Ix: 127.0, Sx: 31.2, Zx: 34.7, rx: 3.51, Iy: 42.6, Sy: 10.6, Zy: 16.3, ry: 2.03 },
  { name: "W8x40", type: "W", weight: 40, A: 11.7, d: 8.25, bf: 8.07, tf: 0.560, tw: 0.360, Ix: 146.0, Sx: 35.5, Zx: 39.8, rx: 3.53, Iy: 49.1, Sy: 12.2, Zy: 18.7, ry: 2.04 },
  { name: "W8x48", type: "W", weight: 48, A: 14.1, d: 8.50, bf: 8.11, tf: 0.685, tw: 0.400, Ix: 184.0, Sx: 43.2, Zx: 49.0, rx: 3.61, Iy: 60.9, Sy: 15.0, Zy: 23.2, ry: 2.08 },
  { name: "W8x58", type: "W", weight: 58, A: 17.1, d: 8.75, bf: 8.22, tf: 0.810, tw: 0.510, Ix: 228.0, Sx: 52.0, Zx: 60.1, rx: 3.65, Iy: 75.1, Sy: 18.3, Zy: 28.5, ry: 2.10 },
  { name: "W8x67", type: "W", weight: 67, A: 19.7, d: 9.00, bf: 8.28, tf: 0.935, tw: 0.570, Ix: 272.0, Sx: 60.4, Zx: 70.9, rx: 3.72, Iy: 88.6, Sy: 21.4, Zy: 33.5, ry: 2.12 },

  // --- W10 SHAPES ---
  { name: "W10x12", type: "W", weight: 12, A: 3.54, d: 9.87, bf: 3.96, tf: 0.210, tw: 0.190, Ix: 53.8, Sx: 10.9, Zx: 12.6, rx: 3.90, Iy: 2.18, Sy: 1.10, Zy: 1.75, ry: 0.785 },
  { name: "W10x15", type: "W", weight: 15, A: 4.41, d: 9.99, bf: 4.00, tf: 0.270, tw: 0.230, Ix: 68.9, Sx: 13.8, Zx: 16.0, rx: 3.95, Iy: 2.89, Sy: 1.45, Zy: 2.30, ry: 0.810 },
  { name: "W10x17", type: "W", weight: 17, A: 4.99, d: 10.1, bf: 4.01, tf: 0.330, tw: 0.240, Ix: 81.9, Sx: 16.2, Zx: 18.7, rx: 4.05, Iy: 3.56, Sy: 1.78, Zy: 2.82, ry: 0.845 },
  { name: "W10x19", type: "W", weight: 19, A: 5.62, d: 10.2, bf: 4.02, tf: 0.395, tw: 0.250, Ix: 96.3, Sx: 18.8, Zx: 21.6, rx: 4.14, Iy: 4.29, Sy: 2.14, Zy: 3.38, ry: 0.874 },
  { name: "W10x22", type: "W", weight: 22, A: 6.49, d: 10.2, bf: 5.75, tf: 0.360, tw: 0.240, Ix: 118.0, Sx: 23.2, Zx: 26.0, rx: 4.27, Iy: 11.4, Sy: 3.97, Zy: 6.21, ry: 1.33 },
  { name: "W10x26", type: "W", weight: 26, A: 7.61, d: 10.3, bf: 5.77, tf: 0.440, tw: 0.260, Ix: 144.0, Sx: 27.9, Zx: 31.3, rx: 4.35, Iy: 14.1, Sy: 4.89, Zy: 7.62, ry: 1.36 },
  { name: "W10x30", type: "W", weight: 30, A: 8.84, d: 10.5, bf: 5.81, tf: 0.510, tw: 0.300, Ix: 170.0, Sx: 32.4, Zx: 36.6, rx: 4.38, Iy: 16.7, Sy: 5.75, Zy: 8.98, ry: 1.37 },
  { name: "W10x33", type: "W", weight: 33, A: 9.71, d: 9.73, bf: 7.96, tf: 0.435, tw: 0.290, Ix: 171.0, Sx: 35.0, Zx: 38.8, rx: 4.19, Iy: 36.6, Sy: 9.20, Zy: 14.0, ry: 1.94 },
  { name: "W10x39", type: "W", weight: 39, A: 11.5, d: 9.92, bf: 7.99, tf: 0.530, tw: 0.315, Ix: 209.0, Sx: 42.1, Zx: 46.8, rx: 4.27, Iy: 45.0, Sy: 11.3, Zy: 17.2, ry: 1.98 },
  { name: "W10x45", type: "W", weight: 45, A: 13.3, d: 10.1, bf: 8.02, tf: 0.620, tw: 0.350, Ix: 248.0, Sx: 49.1, Zx: 54.9, rx: 4.32, Iy: 53.4, Sy: 13.3, Zy: 20.4, ry: 2.01 },
  { name: "W10x49", type: "W", weight: 49, A: 14.4, d: 9.98, bf: 10.0, tf: 0.560, tw: 0.340, Ix: 272.0, Sx: 54.6, Zx: 60.4, rx: 4.35, Iy: 93.4, Sy: 18.7, Zy: 28.3, ry: 2.54 },
  { name: "W10x54", type: "W", weight: 54, A: 15.8, d: 10.1, bf: 10.0, tf: 0.615, tw: 0.370, Ix: 303.0, Sx: 60.0, Zx: 66.6, rx: 4.37, Iy: 103.0, Sy: 20.6, Zy: 31.2, ry: 2.56 },
  { name: "W10x60", type: "W", weight: 60, A: 17.6, d: 10.2, bf: 10.1, tf: 0.680, tw: 0.420, Ix: 341.0, Sx: 66.7, Zx: 74.6, rx: 4.39, Iy: 116.0, Sy: 23.0, Zy: 35.0, ry: 2.57 },
  { name: "W10x68", type: "W", weight: 68, A: 20.0, d: 10.4, bf: 10.1, tf: 0.770, tw: 0.470, Ix: 394.0, Sx: 75.7, Zx: 85.3, rx: 4.44, Iy: 134.0, Sy: 26.4, Zy: 40.3, ry: 2.59 },
  { name: "W10x77", type: "W", weight: 77, A: 22.7, d: 10.6, bf: 10.2, tf: 0.870, tw: 0.530, Ix: 455.0, Sx: 85.9, Zx: 97.6, rx: 4.49, Iy: 154.0, Sy: 30.1, Zy: 46.3, ry: 2.60 },
  { name: "W10x88", type: "W", weight: 88, A: 25.9, d: 10.8, bf: 10.3, tf: 0.990, tw: 0.605, Ix: 534.0, Sx: 98.5, Zx: 113.0, rx: 4.54, Iy: 179.0, Sy: 34.8, Zy: 53.8, ry: 2.63 },
  { name: "W10x100", type: "W", weight: 100, A: 29.4, d: 11.1, bf: 10.4, tf: 1.120, tw: 0.680, Ix: 623.0, Sx: 112.0, Zx: 130.0, rx: 4.60, Iy: 207.0, Sy: 39.9, Zy: 62.2, ry: 2.65 },
  { name: "W10x112", type: "W", weight: 112, A: 32.9, d: 11.4, bf: 10.4, tf: 1.250, tw: 0.755, Ix: 716.0, Sx: 126.0, Zx: 147.0, rx: 4.66, Iy: 236.0, Sy: 45.3, Zy: 71.1, ry: 2.68 },

  // --- W12 SHAPES ---
  { name: "W12x14", type: "W", weight: 14, A: 4.16, d: 11.9, bf: 3.97, tf: 0.225, tw: 0.200, Ix: 88.6, Sx: 14.9, Zx: 17.4, rx: 4.62, Iy: 2.36, Sy: 1.19, Zy: 1.90, ry: 0.753 },
  { name: "W12x16", type: "W", weight: 16, A: 4.71, d: 12.0, bf: 3.99, tf: 0.265, tw: 0.220, Ix: 103.0, Sx: 17.1, Zx: 20.1, rx: 4.67, Iy: 2.82, Sy: 1.41, Zy: 2.26, ry: 0.773 },
  { name: "W12x19", type: "W", weight: 19, A: 5.57, d: 12.2, bf: 4.01, tf: 0.350, tw: 0.235, Ix: 130.0, Sx: 21.3, Zx: 24.7, rx: 4.82, Iy: 3.76, Sy: 1.88, Zy: 2.99, ry: 0.822 },
  { name: "W12x22", type: "W", weight: 22, A: 6.48, d: 12.3, bf: 4.03, tf: 0.425, tw: 0.260, Ix: 156.0, Sx: 25.4, Zx: 29.3, rx: 4.91, Iy: 4.66, Sy: 2.31, Zy: 3.66, ry: 0.848 },
  { name: "W12x26", type: "W", weight: 26, A: 7.65, d: 12.2, bf: 6.49, tf: 0.380, tw: 0.230, Ix: 204.0, Sx: 33.4, Zx: 37.2, rx: 5.17, Iy: 17.3, Sy: 5.34, Zy: 8.30, ry: 1.51 },
  { name: "W12x30", type: "W", weight: 30, A: 8.79, d: 12.3, bf: 6.52, tf: 0.440, tw: 0.260, Ix: 238.0, Sx: 38.6, Zx: 43.1, rx: 5.21, Iy: 20.3, Sy: 6.24, Zy: 9.66, ry: 1.52 },
  { name: "W12x35", type: "W", weight: 35, A: 10.3, d: 12.5, bf: 6.56, tf: 0.520, tw: 0.300, Ix: 285.0, Sx: 45.6, Zx: 51.2, rx: 5.25, Iy: 24.5, Sy: 7.47, Zy: 11.6, ry: 1.54 },
  { name: "W12x40", type: "W", weight: 40, A: 11.8, d: 11.9, bf: 8.01, tf: 0.515, tw: 0.295, Ix: 307.0, Sx: 51.5, Zx: 57.5, rx: 5.13, Iy: 44.1, Sy: 11.0, Zy: 16.8, ry: 1.94 },
  { name: "W12x45", type: "W", weight: 45, A: 13.2, d: 12.1, bf: 8.05, tf: 0.575, tw: 0.335, Ix: 350.0, Sx: 58.1, Zx: 64.7, rx: 5.15, Iy: 50.0, Sy: 12.4, Zy: 19.0, ry: 1.95 },
  { name: "W12x50", type: "W", weight: 50, A: 14.7, d: 12.2, bf: 8.08, tf: 0.640, tw: 0.370, Ix: 394.0, Sx: 64.7, Zx: 72.4, rx: 5.18, Iy: 56.3, Sy: 13.9, Zy: 21.4, ry: 1.96 },
  { name: "W12x53", type: "W", weight: 53, A: 15.6, d: 12.1, bf: 10.0, tf: 0.575, tw: 0.345, Ix: 425.0, Sx: 70.6, Zx: 77.9, rx: 5.23, Iy: 95.8, Sy: 19.2, Zy: 29.1, ry: 2.48 },
  { name: "W12x58", type: "W", weight: 58, A: 17.0, d: 12.2, bf: 10.0, tf: 0.640, tw: 0.360, Ix: 475.0, Sx: 78.0, Zx: 86.4, rx: 5.28, Iy: 107.0, Sy: 21.4, Zy: 32.5, ry: 2.51 },
  { name: "W12x65", type: "W", weight: 65, A: 19.1, d: 12.1, bf: 12.0, tf: 0.605, tw: 0.390, Ix: 533.0, Sx: 87.9, Zx: 96.8, rx: 5.28, Iy: 174.0, Sy: 29.1, Zy: 44.1, ry: 3.02 },
  { name: "W12x72", type: "W", weight: 72, A: 21.1, d: 12.25, bf: 12.04, tf: 0.670, tw: 0.430, Ix: 597.0, Sx: 97.4, Zx: 108.0, rx: 5.31, Iy: 195.0, Sy: 32.4, Zy: 49.2, ry: 3.04 },
  { name: "W12x79", type: "W", weight: 79, A: 23.2, d: 12.4, bf: 12.1, tf: 0.735, tw: 0.470, Ix: 662.0, Sx: 107.0, Zx: 119.0, rx: 5.34, Iy: 216.0, Sy: 35.8, Zy: 54.5, ry: 3.05 },
  { name: "W12x87", type: "W", weight: 87, A: 25.6, d: 12.5, bf: 12.1, tf: 0.810, tw: 0.515, Ix: 740.0, Sx: 118.0, Zx: 133.0, rx: 5.38, Iy: 241.0, Sy: 39.7, Zy: 60.8, ry: 3.07 },
  { name: "W12x96", type: "W", weight: 96, A: 28.2, d: 12.7, bf: 12.2, tf: 0.900, tw: 0.550, Ix: 833.0, Sx: 131.0, Zx: 149.0, rx: 5.44, Iy: 270.0, Sy: 44.4, Zy: 68.2, ry: 3.09 },
  { name: "W12x106", type: "W", weight: 106, A: 31.2, d: 12.9, bf: 12.2, tf: 0.990, tw: 0.610, Ix: 933.0, Sx: 145.0, Zx: 166.0, rx: 5.47, Iy: 301.0, Sy: 49.3, Zy: 76.1, ry: 3.11 },
  { name: "W12x120", type: "W", weight: 120, A: 35.3, d: 13.1, bf: 12.3, tf: 1.105, tw: 0.710, Ix: 1070.0, Sx: 163.0, Zx: 188.0, rx: 5.51, Iy: 345.0, Sy: 56.0, Zy: 87.0, ry: 3.13 },
  { name: "W12x136", type: "W", weight: 136, A: 39.9, d: 13.4, bf: 12.4, tf: 1.250, tw: 0.790, Ix: 1240.0, Sx: 186.0, Zx: 216.0, rx: 5.58, Iy: 398.0, Sy: 64.2, Zy: 101.0, ry: 3.16 },
  { name: "W12x152", type: "W", weight: 152, A: 44.7, d: 13.7, bf: 12.5, tf: 1.400, tw: 0.870, Ix: 1430.0, Sx: 209.0, Zx: 245.0, rx: 5.65, Iy: 454.0, Sy: 72.7, Zy: 115.0, ry: 3.19 },
  { name: "W12x170", type: "W", weight: 170, A: 50.0, d: 14.0, bf: 12.6, tf: 1.560, tw: 0.960, Ix: 1650.0, Sx: 235.0, Zx: 279.0, rx: 5.74, Iy: 517.0, Sy: 82.2, Zy: 131.0, ry: 3.22 },
  { name: "W12x190", type: "W", weight: 190, A: 55.8, d: 14.4, bf: 12.7, tf: 1.735, tw: 1.060, Ix: 1890.0, Sx: 263.0, Zx: 317.0, rx: 5.82, Iy: 589.0, Sy: 92.9, Zy: 149.0, ry: 3.25 },

  // --- W14 SHAPES ---
  { name: "W14x22", type: "W", weight: 22, A: 6.49, d: 13.7, bf: 5.00, tf: 0.335, tw: 0.230, Ix: 199.0, Sx: 29.0, Zx: 33.2, rx: 5.54, Iy: 7.00, Sy: 2.80, Zy: 4.40, ry: 1.04 },
  { name: "W14x26", type: "W", weight: 26, A: 7.68, d: 13.9, bf: 5.03, tf: 0.420, tw: 0.255, Ix: 245.0, Sx: 35.3, Zx: 40.2, rx: 5.65, Iy: 8.91, Sy: 3.54, Zy: 5.54, ry: 1.08 },
  { name: "W14x30", type: "W", weight: 30, A: 8.85, d: 13.8, bf: 6.73, tf: 0.385, tw: 0.270, Ix: 291.0, Sx: 42.0, Zx: 47.3, rx: 5.73, Iy: 19.6, Sy: 5.82, Zy: 9.03, ry: 1.49 },
  { name: "W14x34", type: "W", weight: 34, A: 10.0, d: 14.0, bf: 6.75, tf: 0.455, tw: 0.285, Ix: 340.0, Sx: 48.6, Zx: 54.6, rx: 5.83, Iy: 23.3, Sy: 6.91, Zy: 10.7, ry: 1.53 },
  { name: "W14x38", type: "W", weight: 38, A: 11.2, d: 14.1, bf: 6.77, tf: 0.515, tw: 0.310, Ix: 385.0, Sx: 54.6, Zx: 61.2, rx: 5.87, Iy: 26.7, Sy: 7.88, Zy: 12.2, ry: 1.55 },
  { name: "W14x43", type: "W", weight: 43, A: 12.6, d: 13.7, bf: 8.00, tf: 0.530, tw: 0.305, Ix: 428.0, Sx: 62.6, Zx: 69.6, rx: 5.82, Iy: 45.2, Sy: 11.3, Zy: 17.3, ry: 1.89 },
  { name: "W14x48", type: "W", weight: 48, A: 14.1, d: 13.8, bf: 8.03, tf: 0.595, tw: 0.340, Ix: 484.0, Sx: 70.2, Zx: 78.4, rx: 5.85, Iy: 51.4, Sy: 12.8, Zy: 19.6, ry: 1.91 },
  { name: "W14x53", type: "W", weight: 53, A: 15.6, d: 13.9, bf: 8.06, tf: 0.660, tw: 0.370, Ix: 541.0, Sx: 77.8, Zx: 87.1, rx: 5.89, Iy: 57.7, Sy: 14.3, Zy: 22.0, ry: 1.92 },
  { name: "W14x61", type: "W", weight: 61, A: 17.9, d: 13.9, bf: 10.0, tf: 0.645, tw: 0.375, Ix: 640.0, Sx: 92.1, Zx: 102.0, rx: 5.98, Iy: 107.0, Sy: 21.5, Zy: 32.8, ry: 2.45 },
  { name: "W14x68", type: "W", weight: 68, A: 20.0, d: 14.0, bf: 10.0, tf: 0.720, tw: 0.415, Ix: 722.0, Sx: 103.0, Zx: 115.0, rx: 6.01, Iy: 121.0, Sy: 24.1, Zy: 36.9, ry: 2.46 },
  { name: "W14x74", type: "W", weight: 74, A: 21.8, d: 14.2, bf: 10.1, tf: 0.785, tw: 0.450, Ix: 795.0, Sx: 112.0, Zx: 126.0, rx: 6.04, Iy: 134.0, Sy: 26.6, Zy: 40.7, ry: 2.48 },
  { name: "W14x82", type: "W", weight: 82, A: 24.0, d: 14.3, bf: 10.1, tf: 0.855, tw: 0.510, Ix: 881.0, Sx: 123.0, Zx: 139.0, rx: 6.05, Iy: 148.0, Sy: 29.3, Zy: 45.0, ry: 2.48 },
  { name: "W14x90", type: "W", weight: 90, A: 26.5, d: 14.0, bf: 14.5, tf: 0.710, tw: 0.440, Ix: 999.0, Sx: 143.0, Zx: 157.0, rx: 6.14, Iy: 362.0, Sy: 49.9, Zy: 75.6, ry: 3.70 },
  { name: "W14x99", type: "W", weight: 99, A: 29.1, d: 14.2, bf: 14.6, tf: 0.780, tw: 0.485, Ix: 1110.0, Sx: 157.0, Zx: 173.0, rx: 6.17, Iy: 402.0, Sy: 55.2, Zy: 83.6, ry: 3.71 },
  { name: "W14x109", type: "W", weight: 109, A: 32.0, d: 14.3, bf: 14.6, tf: 0.860, tw: 0.525, Ix: 1240.0, Sx: 173.0, Zx: 192.0, rx: 6.22, Iy: 447.0, Sy: 61.2, Zy: 92.7, ry: 3.73 },
  { name: "W14x120", type: "W", weight: 120, A: 35.3, d: 14.5, bf: 14.7, tf: 0.940, tw: 0.590, Ix: 1380.0, Sx: 190.0, Zx: 212.0, rx: 6.24, Iy: 495.0, Sy: 67.5, Zy: 103.0, ry: 3.74 },
  { name: "W14x132", type: "W", weight: 132, A: 38.8, d: 14.7, bf: 14.7, tf: 1.030, tw: 0.645, Ix: 1530.0, Sx: 209.0, Zx: 234.0, rx: 6.28, Iy: 548.0, Sy: 74.5, Zy: 113.0, ry: 3.76 },

  // --- W16 SHAPES ---
  { name: "W16x26", type: "W", weight: 26, A: 7.68, d: 15.7, bf: 5.50, tf: 0.345, tw: 0.250, Ix: 301.0, Sx: 38.4, Zx: 44.2, rx: 6.26, Iy: 9.59, Sy: 3.49, Zy: 5.52, ry: 1.12 },
  { name: "W16x31", type: "W", weight: 31, A: 9.12, d: 15.9, bf: 5.53, tf: 0.440, tw: 0.275, Ix: 375.0, Sx: 47.2, Zx: 54.0, rx: 6.41, Iy: 12.4, Sy: 4.49, Zy: 7.08, ry: 1.17 },
  { name: "W16x36", type: "W", weight: 36, A: 10.6, d: 15.9, bf: 6.99, tf: 0.430, tw: 0.295, Ix: 448.0, Sx: 56.5, Zx: 64.0, rx: 6.51, Iy: 24.5, Sy: 7.00, Zy: 11.0, ry: 1.52 },
  { name: "W16x40", type: "W", weight: 40, A: 11.8, d: 16.0, bf: 7.00, tf: 0.505, tw: 0.305, Ix: 518.0, Sx: 64.7, Zx: 73.0, rx: 6.63, Iy: 28.9, Sy: 8.25, Zy: 12.9, ry: 1.57 },
  { name: "W16x45", type: "W", weight: 45, A: 13.3, d: 16.1, bf: 7.04, tf: 0.565, tw: 0.345, Ix: 586.0, Sx: 72.7, Zx: 82.3, rx: 6.65, Iy: 32.8, Sy: 9.34, Zy: 14.6, ry: 1.57 },
  { name: "W16x50", type: "W", weight: 50, A: 14.7, d: 16.3, bf: 7.07, tf: 0.630, tw: 0.380, Ix: 659.0, Sx: 81.0, Zx: 92.0, rx: 6.68, Iy: 37.2, Sy: 10.5, Zy: 16.6, ry: 1.59 },
  { name: "W16x57", type: "W", weight: 57, A: 16.8, d: 16.4, bf: 7.12, tf: 0.715, tw: 0.430, Ix: 758.0, Sx: 92.2, Zx: 105.0, rx: 6.72, Iy: 43.1, Sy: 12.1, Zy: 19.1, ry: 1.60 },

  // --- W18 SHAPES ---
  { name: "W18x35", type: "W", weight: 35, A: 10.3, d: 17.7, bf: 6.00, tf: 0.425, tw: 0.300, Ix: 510.0, Sx: 57.6, Zx: 66.5, rx: 7.04, Iy: 15.3, Sy: 5.12, Zy: 8.06, ry: 1.22 },
  { name: "W18x40", type: "W", weight: 40, A: 11.8, d: 17.9, bf: 6.02, tf: 0.525, tw: 0.315, Ix: 612.0, Sx: 68.4, Zx: 78.4, rx: 7.21, Iy: 19.1, Sy: 6.35, Zy: 9.98, ry: 1.27 },
  { name: "W18x46", type: "W", weight: 46, A: 13.5, d: 18.1, bf: 6.06, tf: 0.605, tw: 0.360, Ix: 712.0, Sx: 78.8, Zx: 90.7, rx: 7.26, Iy: 22.5, Sy: 7.43, Zy: 11.7, ry: 1.29 },
  { name: "W18x50", type: "W", weight: 50, A: 14.7, d: 18.0, bf: 7.50, tf: 0.570, tw: 0.355, Ix: 800.0, Sx: 88.9, Zx: 101.0, rx: 7.38, Iy: 40.1, Sy: 10.7, Zy: 16.6, ry: 1.65 },
  { name: "W18x55", type: "W", weight: 55, A: 16.2, d: 18.1, bf: 7.53, tf: 0.630, tw: 0.390, Ix: 890.0, Sx: 98.3, Zx: 112.0, rx: 7.41, Iy: 44.9, Sy: 11.9, Zy: 18.5, ry: 1.66 },
  { name: "W18x60", type: "W", weight: 60, A: 17.6, d: 18.2, bf: 7.56, tf: 0.695, tw: 0.415, Ix: 984.0, Sx: 108.0, Zx: 123.0, rx: 7.47, Iy: 50.1, Sy: 13.3, Zy: 20.6, ry: 1.68 },
  { name: "W18x65", type: "W", weight: 65, A: 19.1, d: 18.4, bf: 7.59, tf: 0.750, tw: 0.450, Ix: 1070.0, Sx: 117.0, Zx: 133.0, rx: 7.49, Iy: 54.8, Sy: 14.4, Zy: 22.5, ry: 1.69 },
  { name: "W18x71", type: "W", weight: 71, A: 20.8, d: 18.5, bf: 7.64, tf: 0.810, tw: 0.495, Ix: 1170.0, Sx: 127.0, Zx: 146.0, rx: 7.50, Iy: 60.3, Sy: 15.8, Zy: 24.7, ry: 1.70 },
  { name: "W18x76", type: "W", weight: 76, A: 22.3, d: 18.2, bf: 11.0, tf: 0.680, tw: 0.425, Ix: 1330.0, Sx: 146.0, Zx: 163.0, rx: 7.73, Iy: 152.0, Sy: 27.6, Zy: 42.2, ry: 2.61 },
  { name: "W18x86", type: "W", weight: 86, A: 25.3, d: 18.4, bf: 11.1, tf: 0.770, tw: 0.480, Ix: 1530.0, Sx: 166.0, Zx: 186.0, rx: 7.77, Iy: 175.0, Sy: 31.6, Zy: 48.4, ry: 2.63 },
  { name: "W18x97", type: "W", weight: 97, A: 28.5, d: 18.6, bf: 11.1, tf: 0.870, tw: 0.535, Ix: 1750.0, Sx: 188.0, Zx: 211.0, rx: 7.82, Iy: 201.0, Sy: 36.0, Zy: 55.3, ry: 2.65 },

  // --- W21 SHAPES ---
  { name: "W21x44", type: "W", weight: 44, A: 13.0, d: 20.7, bf: 6.50, tf: 0.450, tw: 0.350, Ix: 843.0, Sx: 81.6, Zx: 95.4, rx: 8.06, Iy: 20.7, Sy: 6.37, Zy: 10.0, ry: 1.26 },
  { name: "W21x48", type: "W", weight: 48, A: 14.1, d: 20.6, bf: 8.14, tf: 0.430, tw: 0.340, Ix: 959.0, Sx: 93.0, Zx: 107.0, rx: 8.24, Iy: 38.7, Sy: 9.51, Zy: 14.9, ry: 1.66 },
  { name: "W21x50", type: "W", weight: 50, A: 14.7, d: 20.8, bf: 6.53, tf: 0.535, tw: 0.380, Ix: 984.0, Sx: 94.5, Zx: 110.0, rx: 8.18, Iy: 24.9, Sy: 7.64, Zy: 12.0, ry: 1.30 },
  { name: "W21x55", type: "W", weight: 55, A: 16.2, d: 20.8, bf: 8.22, tf: 0.522, tw: 0.375, Ix: 1140.0, Sx: 110.0, Zx: 126.0, rx: 8.40, Iy: 48.4, Sy: 11.8, Zy: 18.4, ry: 1.73 },
  { name: "W21x62", type: "W", weight: 62, A: 18.3, d: 21.0, bf: 8.24, tf: 0.615, tw: 0.400, Ix: 1330.0, Sx: 127.0, Zx: 144.0, rx: 8.54, Iy: 57.5, Sy: 14.0, Zy: 21.8, ry: 1.77 },
  { name: "W21x68", type: "W", weight: 68, A: 20.0, d: 21.1, bf: 8.27, tf: 0.685, tw: 0.430, Ix: 1480.0, Sx: 140.0, Zx: 160.0, rx: 8.60, Iy: 64.7, Sy: 15.7, Zy: 24.4, ry: 1.80 },
  { name: "W21x73", type: "W", weight: 73, A: 21.5, d: 21.2, bf: 8.30, tf: 0.740, tw: 0.455, Ix: 1600.0, Sx: 151.0, Zx: 172.0, rx: 8.64, Iy: 70.6, Sy: 17.0, Zy: 26.6, ry: 1.81 },
  { name: "W21x83", type: "W", weight: 83, A: 24.3, d: 21.4, bf: 8.36, tf: 0.835, tw: 0.515, Ix: 1830.0, Sx: 171.0, Zx: 196.0, rx: 8.67, Iy: 81.4, Sy: 19.5, Zy: 30.5, ry: 1.83 },
  { name: "W21x93", type: "W", weight: 93, A: 27.3, d: 21.6, bf: 8.42, tf: 0.930, tw: 0.580, Ix: 2070.0, Sx: 192.0, Zx: 221.0, rx: 8.70, Iy: 92.9, Sy: 22.1, Zy: 34.7, ry: 1.84 },

  // --- W24 SHAPES ---
  { name: "W24x55", type: "W", weight: 55, A: 16.2, d: 23.6, bf: 7.01, tf: 0.505, tw: 0.395, Ix: 1350.0, Sx: 114.0, Zx: 134.0, rx: 9.14, Iy: 29.1, Sy: 8.30, Zy: 13.1, ry: 1.34 },
  { name: "W24x62", type: "W", weight: 62, A: 18.2, d: 23.7, bf: 7.04, tf: 0.590, tw: 0.430, Ix: 1550.0, Sx: 131.0, Zx: 153.0, rx: 9.23, Iy: 34.5, Sy: 9.80, Zy: 15.4, ry: 1.38 },
  { name: "W24x68", type: "W", weight: 68, A: 20.1, d: 23.7, bf: 8.97, tf: 0.585, tw: 0.415, Ix: 1830.0, Sx: 154.0, Zx: 177.0, rx: 9.55, Iy: 70.4, Sy: 15.7, Zy: 24.5, ry: 1.87 },
  { name: "W24x76", type: "W", weight: 76, A: 22.4, d: 23.9, bf: 8.99, tf: 0.680, tw: 0.440, Ix: 2100.0, Sx: 176.0, Zx: 200.0, rx: 9.69, Iy: 82.5, Sy: 18.4, Zy: 28.6, ry: 1.92 },
  { name: "W24x84", type: "W", weight: 84, A: 24.7, d: 24.1, bf: 9.02, tf: 0.770, tw: 0.470, Ix: 2370.0, Sx: 196.0, Zx: 224.0, rx: 9.79, Iy: 94.4, Sy: 20.9, Zy: 32.6, ry: 1.95 },
  { name: "W24x94", type: "W", weight: 94, A: 27.7, d: 24.3, bf: 9.07, tf: 0.875, tw: 0.515, Ix: 2700.0, Sx: 222.0, Zx: 254.0, rx: 9.87, Iy: 109.0, Sy: 24.0, Zy: 37.6, ry: 1.98 },
  { name: "W24x104", type: "W", weight: 104, A: 30.6, d: 24.1, bf: 12.8, tf: 0.750, tw: 0.500, Ix: 3100.0, Sx: 258.0, Zx: 289.0, rx: 10.1, Iy: 259.0, Sy: 40.7, Zy: 62.8, ry: 2.91 },
  { name: "W24x117", type: "W", weight: 117, A: 34.4, d: 24.3, bf: 12.8, tf: 0.850, tw: 0.550, Ix: 3540.0, Sx: 291.0, Zx: 327.0, rx: 10.1, Iy: 298.0, Sy: 46.6, Zy: 71.9, ry: 2.94 },
  { name: "W24x131", type: "W", weight: 131, A: 38.5, d: 24.5, bf: 12.9, tf: 0.960, tw: 0.605, Ix: 4020.0, Sx: 329.0, Zx: 370.0, rx: 10.2, Iy: 340.0, Sy: 52.9, Zy: 81.9, ry: 2.97 },

  // --- W27 SHAPES ---
  { name: "W27x84", type: "W", weight: 84, A: 24.8, d: 26.7, bf: 10.0, tf: 0.640, tw: 0.460, Ix: 2850.0, Sx: 213.0, Zx: 244.0, rx: 10.7, Iy: 106.0, Sy: 21.2, Zy: 33.2, ry: 2.07 },
  { name: "W27x94", type: "W", weight: 94, A: 27.7, d: 26.9, bf: 10.0, tf: 0.745, tw: 0.490, Ix: 3270.0, Sx: 243.0, Zx: 278.0, rx: 10.9, Iy: 124.0, Sy: 24.8, Zy: 38.8, ry: 2.12 },
  { name: "W27x102", type: "W", weight: 102, A: 30.0, d: 27.1, bf: 10.0, tf: 0.830, tw: 0.515, Ix: 3620.0, Sx: 267.0, Zx: 305.0, rx: 11.0, Iy: 139.0, Sy: 27.7, Zy: 43.3, ry: 2.15 },
  { name: "W27x114", type: "W", weight: 114, A: 33.5, d: 27.3, bf: 10.1, tf: 0.930, tw: 0.570, Ix: 4090.0, Sx: 299.0, Zx: 343.0, rx: 11.1, Iy: 159.0, Sy: 31.6, Zy: 49.4, ry: 2.18 },

  // --- W30 SHAPES ---
  { name: "W30x90", type: "W", weight: 90, A: 26.4, d: 29.5, bf: 10.4, tf: 0.610, tw: 0.470, Ix: 3610.0, Sx: 245.0, Zx: 283.0, rx: 11.7, Iy: 115.0, Sy: 22.1, Zy: 35.0, ry: 2.08 },
  { name: "W30x99", type: "W", weight: 99, A: 29.1, d: 29.7, bf: 10.5, tf: 0.670, tw: 0.520, Ix: 3990.0, Sx: 269.0, Zx: 312.0, rx: 11.7, Iy: 128.0, Sy: 24.5, Zy: 38.8, ry: 2.10 },
  { name: "W30x108", type: "W", weight: 108, A: 31.7, d: 29.8, bf: 10.5, tf: 0.760, tw: 0.545, Ix: 4470.0, Sx: 299.0, Zx: 346.0, rx: 11.9, Iy: 146.0, Sy: 27.9, Zy: 44.1, ry: 2.15 },
  { name: "W30x116", type: "W", weight: 116, A: 34.2, d: 30.0, bf: 10.5, tf: 0.850, tw: 0.565, Ix: 4930.0, Sx: 329.0, Zx: 378.0, rx: 12.0, Iy: 164.0, Sy: 31.3, Zy: 49.4, ry: 2.19 },
  { name: "W30x124", type: "W", weight: 124, A: 36.5, d: 30.2, bf: 10.5, tf: 0.930, tw: 0.585, Ix: 5360.0, Sx: 355.0, Zx: 408.0, rx: 12.1, Iy: 180.0, Sy: 34.3, Zy: 54.2, ry: 2.22 },

  // --- W33 & W36 SHAPES ---
  { name: "W33x118", type: "W", weight: 118, A: 34.7, d: 32.9, bf: 11.5, tf: 0.740, tw: 0.550, Ix: 5900.0, Sx: 359.0, Zx: 415.0, rx: 13.0, Iy: 187.0, Sy: 32.6, Zy: 51.5, ry: 2.32 },
  { name: "W33x130", type: "W", weight: 130, A: 38.3, d: 33.1, bf: 11.5, tf: 0.855, tw: 0.580, Ix: 6710.0, Sx: 406.0, Zx: 467.0, rx: 13.2, Iy: 218.0, Sy: 37.8, Zy: 59.7, ry: 2.39 },
  { name: "W33x141", type: "W", weight: 141, A: 41.6, d: 33.3, bf: 11.5, tf: 0.960, tw: 0.605, Ix: 7450.0, Sx: 448.0, Zx: 514.0, rx: 13.4, Iy: 245.0, Sy: 42.6, Zy: 67.1, ry: 2.43 },
  { name: "W36x135", type: "W", weight: 135, A: 39.7, d: 35.6, bf: 12.0, tf: 0.790, tw: 0.600, Ix: 7800.0, Sx: 439.0, Zx: 509.0, rx: 14.0, Iy: 225.0, Sy: 37.7, Zy: 59.7, ry: 2.38 },
  { name: "W36x150", type: "W", weight: 150, A: 44.2, d: 35.9, bf: 12.0, tf: 0.940, tw: 0.625, Ix: 9040.0, Sx: 504.0, Zx: 581.0, rx: 14.3, Iy: 270.0, Sy: 45.1, Zy: 71.2, ry: 2.47 },
  { name: "W36x160", type: "W", weight: 160, A: 47.0, d: 36.0, bf: 12.0, tf: 1.020, tw: 0.650, Ix: 9750.0, Sx: 542.0, Zx: 624.0, rx: 14.4, Iy: 295.0, Sy: 49.1, Zy: 77.6, ry: 2.50 },
  { name: "W36x182", type: "W", weight: 182, A: 53.6, d: 36.3, bf: 12.1, tf: 1.180, tw: 0.725, Ix: 11300.0, Sx: 623.0, Zx: 718.0, rx: 14.5, Iy: 346.0, Sy: 57.4, Zy: 90.9, ry: 2.54 },

  // --- HSS SQUARE SECTIONS ---
  { name: "HSS3x3x3/16", type: "HSS", weight: 6.84, A: 1.89, d: 3.00, bf: 3.00, tf: 0.174, tw: 0.174, Ix: 2.46, Sx: 1.64, Zx: 1.95, rx: 1.14, Iy: 2.46, Sy: 1.64, Zy: 1.95, ry: 1.14 },
  { name: "HSS3.5x3.5x1/4", type: "HSS", weight: 10.4, A: 2.87, d: 3.50, bf: 3.50, tf: 0.233, tw: 0.233, Ix: 4.97, Sx: 2.84, Zx: 3.42, rx: 1.32, Iy: 4.97, Sy: 2.84, Zy: 3.42, ry: 1.32 },
  { name: "HSS4x4x1/4", type: "HSS", weight: 12.2, A: 3.37, d: 4.00, bf: 4.00, tf: 0.233, tw: 0.233, Ix: 7.80, Sx: 3.90, Zx: 4.67, rx: 1.52, Iy: 7.80, Sy: 3.90, Zy: 4.67, ry: 1.52 },
  { name: "HSS4x4x3/8", type: "HSS", weight: 17.3, A: 4.78, d: 4.00, bf: 4.00, tf: 0.349, tw: 0.349, Ix: 10.3, Sx: 5.15, Zx: 6.36, rx: 1.47, Iy: 10.3, Sy: 5.15, Zy: 6.36, ry: 1.47 },
  { name: "HSS5x5x1/4", type: "HSS", weight: 15.6, A: 4.30, d: 5.00, bf: 5.00, tf: 0.233, tw: 0.233, Ix: 15.9, Sx: 6.36, Zx: 7.55, rx: 1.92, Iy: 15.9, Sy: 6.36, Zy: 7.55, ry: 1.92 },
  { name: "HSS5x5x3/8", type: "HSS", weight: 22.4, A: 6.18, d: 5.00, bf: 5.00, tf: 0.349, tw: 0.349, Ix: 21.6, Sx: 8.65, Zx: 10.6, rx: 1.87, Iy: 21.6, Sy: 8.65, Zy: 10.6, ry: 1.87 },
  { name: "HSS6x6x1/4", type: "HSS", weight: 19.0, A: 5.24, d: 6.00, bf: 6.00, tf: 0.233, tw: 0.233, Ix: 28.6, Sx: 9.54, Zx: 11.2, rx: 2.34, Iy: 28.6, Sy: 9.54, Zy: 11.2, ry: 2.34 },
  { name: "HSS6x6x3/8", type: "HSS", weight: 27.5, A: 7.58, d: 6.00, bf: 6.00, tf: 0.349, tw: 0.349, Ix: 39.0, Sx: 13.0, Zx: 15.7, rx: 2.27, Iy: 39.0, Sy: 13.0, Zy: 15.7, ry: 2.27 },
  { name: "HSS6x6x1/2", type: "HSS", weight: 35.2, A: 9.74, d: 6.00, bf: 6.00, tf: 0.465, tw: 0.465, Ix: 47.3, Sx: 15.8, Zx: 19.6, rx: 2.20, Iy: 47.3, Sy: 15.8, Zy: 19.6, ry: 2.20 },
  { name: "HSS7x7x3/8", type: "HSS", weight: 32.6, A: 8.98, d: 7.00, bf: 7.00, tf: 0.349, tw: 0.349, Ix: 63.2, Sx: 18.1, rx: 2.65, Iy: 63.2, Sy: 18.1, ry: 2.65 },
  { name: "HSS8x8x1/4", type: "HSS", weight: 25.8, A: 7.10, d: 8.00, bf: 8.00, tf: 0.233, tw: 0.233, Ix: 70.7, Sx: 17.7, Zx: 20.6, rx: 3.16, Iy: 70.7, Sy: 17.7, Zy: 20.6, ry: 3.16 },
  { name: "HSS8x8x3/8", type: "HSS", weight: 37.7, A: 10.4, d: 8.00, bf: 8.00, tf: 0.349, tw: 0.349, Ix: 98.7, Sx: 24.7, Zx: 29.4, rx: 3.08, Iy: 98.7, Sy: 24.7, Zy: 29.4, ry: 3.08 },
  { name: "HSS8x8x1/2", type: "HSS", weight: 48.9, A: 13.5, d: 8.00, bf: 8.00, tf: 0.465, tw: 0.465, Ix: 122.0, Sx: 30.6, Zx: 37.3, rx: 3.01, Iy: 122.0, Sy: 30.6, Zy: 37.3, ry: 3.01 },
  { name: "HSS10x10x3/8", type: "HSS", weight: 47.9, A: 13.3, d: 10.0, bf: 10.0, tf: 0.349, tw: 0.349, Ix: 199.0, Sx: 39.9, Zx: 47.2, rx: 3.87, Iy: 199.0, Sy: 39.9, Zy: 47.2, ry: 3.87 },
  { name: "HSS10x10x1/2", type: "HSS", weight: 62.5, A: 17.3, d: 10.0, bf: 10.0, tf: 0.465, tw: 0.465, Ix: 251.0, Sx: 50.1, Zx: 60.5, rx: 3.81, Iy: 251.0, Sy: 50.1, Zy: 60.5, ry: 3.81 },
  { name: "HSS12x12x1/2", type: "HSS", weight: 76.1, A: 21.0, d: 12.0, bf: 12.0, tf: 0.465, tw: 0.465, Ix: 442.0, Sx: 73.7, Zx: 88.5, rx: 4.59, Iy: 442.0, Sy: 73.7, Zy: 88.5, ry: 4.59 },

  // --- HSS RECTANGULAR SECTIONS ---
  { name: "HSS6x4x1/4", type: "HSS", weight: 15.6, A: 4.30, d: 6.00, bf: 4.00, tf: 0.233, tw: 0.233, Ix: 20.6, Sx: 6.87, Zx: 8.35, rx: 2.19, Iy: 11.2, Sy: 5.60, Zy: 6.55, ry: 1.61 },
  { name: "HSS6x4x3/8", type: "HSS", weight: 22.4, A: 6.18, d: 6.00, bf: 4.00, tf: 0.349, tw: 0.349, Ix: 27.5, Sx: 9.17, Zx: 11.5, rx: 2.11, Iy: 14.6, Sy: 7.30, Zy: 8.90, ry: 1.54 },
  { name: "HSS8x4x1/4", type: "HSS", weight: 19.0, A: 5.24, d: 8.00, bf: 4.00, tf: 0.233, tw: 0.233, Ix: 43.1, Sx: 10.8, Zx: 13.5, rx: 2.87, Iy: 14.3, Sy: 7.15, Zy: 8.27, ry: 1.65 },
  { name: "HSS8x6x3/8", type: "HSS", weight: 32.6, A: 8.98, d: 8.00, bf: 6.00, tf: 0.349, tw: 0.349, Ix: 77.2, Sx: 19.3, Zx: 23.9, rx: 2.93, Iy: 49.3, Sy: 16.4, Zy: 19.8, ry: 2.34 },
  { name: "HSS10x6x3/8", type: "HSS", weight: 37.7, A: 10.4, d: 10.0, bf: 6.00, tf: 0.349, tw: 0.349, Ix: 133.0, Sx: 26.6, Zx: 33.3, rx: 3.58, Iy: 59.3, Sy: 19.8, Zy: 23.6, ry: 2.39 },
  { name: "HSS12x8x1/2", type: "HSS", weight: 62.5, A: 17.3, d: 12.0, bf: 8.00, tf: 0.465, tw: 0.465, Ix: 334.0, Sx: 55.7, Zx: 70.1, rx: 4.39, Iy: 176.0, Sy: 44.0, Zy: 52.8, ry: 3.19 },

  // --- STANDARD PIPE SECTIONS ---
  { name: "Pipe 2 Std", type: "Pipe", weight: 3.65, A: 1.07, d: 2.38, bf: 2.38, tf: 0.154, tw: 0.154, Ix: 0.66, Sx: 0.56, Zx: 0.77, rx: 0.79, Iy: 0.66, Sy: 0.56, Zy: 0.77, ry: 0.79 },
  { name: "Pipe 3 Std", type: "Pipe", weight: 7.58, A: 2.23, d: 3.50, bf: 3.50, tf: 0.216, tw: 0.216, Ix: 3.02, Sx: 1.72, Zx: 2.34, rx: 1.16, Iy: 3.02, Sy: 1.72, Zy: 2.34, ry: 1.16 },
  { name: "Pipe 4 Std", type: "Pipe", weight: 10.8, A: 3.17, d: 4.50, bf: 4.50, tf: 0.237, tw: 0.237, Ix: 7.23, Sx: 3.21, Zx: 4.31, rx: 1.51, Iy: 7.23, Sy: 3.21, Zy: 4.31, ry: 1.51 },
  { name: "Pipe 6 Std", type: "Pipe", weight: 19.0, A: 5.58, d: 6.63, bf: 6.63, tf: 0.280, tw: 0.280, Ix: 28.1, Sx: 8.49, Zx: 11.3, rx: 2.25, Iy: 28.1, Sy: 8.49, Zy: 11.3, ry: 2.25 },
  { name: "Pipe 8 Std", type: "Pipe", weight: 28.6, A: 8.40, d: 8.63, bf: 8.63, tf: 0.322, tw: 0.322, Ix: 72.5, Sx: 16.8, Zx: 22.3, rx: 2.94, Iy: 72.5, Sy: 16.8, Zy: 22.3, ry: 2.94 },

  // --- EQUAL / UNEQUAL ANGLES (L) ---
  { name: "L3x3x1/4", type: "L", weight: 4.9, A: 1.44, d: 3.00, bf: 3.00, tf: 0.250, tw: 0.250, Ix: 1.23, Sx: 0.57, Zx: 1.05, rx: 0.93, Iy: 1.23, Sy: 0.57, Zy: 1.05, ry: 0.93 },
  { name: "L3.5x3.5x1/4", type: "L", weight: 5.8, A: 1.69, d: 3.50, bf: 3.50, tf: 0.250, tw: 0.250, Ix: 2.00, Sx: 0.78, Zx: 1.44, rx: 1.09, Iy: 2.00, Sy: 0.78, Zy: 1.44, ry: 1.09 },
  { name: "L4x4x1/4", type: "L", weight: 6.6, A: 1.94, d: 4.00, bf: 4.00, tf: 0.250, tw: 0.250, Ix: 3.00, Sx: 1.05, Zx: 1.90, rx: 1.24, Iy: 3.00, Sy: 1.05, Zy: 1.90, ry: 1.24 },
  { name: "L4x4x3/8", type: "L", weight: 9.8, A: 2.86, d: 4.00, bf: 4.00, tf: 0.375, tw: 0.375, Ix: 4.29, Sx: 1.52, Zx: 2.76, rx: 1.23, Iy: 4.29, Sy: 1.52, Zy: 2.76, ry: 1.23 },
  { name: "L5x3x1/4", type: "L", weight: 6.6, A: 1.94, d: 5.00, bf: 3.00, tf: 0.250, tw: 0.250, Ix: 5.05, Sx: 1.43, Zx: 2.50, rx: 1.61, Iy: 1.45, Sy: 0.63, Zy: 1.10, ry: 0.86 },
  { name: "L6x4x3/8", type: "L", weight: 12.3, A: 3.61, d: 6.00, bf: 4.00, tf: 0.375, tw: 0.375, Ix: 13.1, Sx: 3.07, Zx: 5.38, rx: 1.90, Iy: 4.67, Sy: 1.48, Zy: 2.56, ry: 1.14 },
  { name: "L6x6x1/2", type: "L", weight: 19.6, A: 5.75, d: 6.00, bf: 6.00, tf: 0.500, tw: 0.500, Ix: 19.9, Sx: 4.67, Zx: 8.35, rx: 1.86, Iy: 19.9, Sy: 4.67, Zy: 8.35, ry: 1.86 }
];

export function getSectionByName(name) {
  return AISC_DATABASE.find(s => s.name === name) || AISC_DATABASE[0];
}
