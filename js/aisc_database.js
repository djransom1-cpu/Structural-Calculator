/**
 * AISC Steel Section Database
 * Includes standard Wide-Flange (W-Shapes) and Square/Rectangular HSS Tubing.
 * Properties:
 *  name: Section designation
 *  type: 'W' or 'HSS'
 *  weight: lb/ft
 *  A: Area (in^2)
 *  d: Depth (in)
 *  bf: Flange width / width (in)
 *  Ix: Moment of Inertia x-axis (in^4)
 *  Sx: Elastic Section Modulus x-axis (in^3)
 *  rx: Radius of Gyration x-axis (in)
 *  Iy: Moment of Inertia y-axis (in^4)
 *  Sy: Elastic Section Modulus y-axis (in^3)
 *  ry: Radius of Gyration y-axis (in)
 */

export const AISC_DATABASE = [
  // Wide Flange W-Shapes
  { name: "W8x10", type: "W", weight: 10.0, A: 2.96, d: 7.89, bf: 3.94, Ix: 30.8, Sx: 7.81, rx: 3.22, Iy: 2.09, Sy: 1.06, ry: 0.841 },
  { name: "W8x15", type: "W", weight: 15.0, A: 4.44, d: 8.11, bf: 4.01, Ix: 48.0, Sx: 11.8, rx: 3.29, Iy: 3.41, Sy: 1.70, ry: 0.876 },
  { name: "W8x21", type: "W", weight: 21.0, A: 6.16, d: 8.28, bf: 5.27, Ix: 75.3, Sx: 18.2, rx: 3.49, Iy: 9.77, Sy: 3.71, ry: 1.26 },
  { name: "W8x31", type: "W", weight: 31.0, A: 9.13, d: 8.00, bf: 8.00, Ix: 110.0, Sx: 27.5, rx: 3.47, Iy: 37.1, Sy: 9.27, ry: 2.02 },
  
  { name: "W10x15", type: "W", weight: 15.0, A: 4.41, d: 9.99, bf: 4.00, Ix: 68.9, Sx: 13.8, rx: 3.95, Iy: 2.89, Sy: 1.45, ry: 0.810 },
  { name: "W10x19", type: "W", weight: 19.0, A: 5.62, d: 10.2, bf: 4.02, Ix: 96.3, Sx: 18.8, rx: 4.14, Iy: 4.29, Sy: 2.14, ry: 0.874 },
  { name: "W10x26", type: "W", weight: 26.0, A: 7.61, d: 10.3, bf: 5.77, Ix: 144.0, Sx: 27.9, rx: 4.35, Iy: 14.1, Sy: 4.89, ry: 1.36 },
  { name: "W10x33", type: "W", weight: 33.0, A: 9.71, d: 9.73, bf: 7.96, Ix: 171.0, Sx: 35.0, rx: 4.19, Iy: 36.6, Sy: 9.20, ry: 1.94 },
  { name: "W10x49", type: "W", weight: 49.0, A: 14.4, d: 9.98, bf: 10.0, Ix: 272.0, Sx: 54.6, rx: 4.35, Iy: 93.4, Sy: 18.7, ry: 2.54 },

  { name: "W12x16", type: "W", weight: 16.0, A: 4.71, d: 11.9, bf: 3.99, Ix: 103.0, Sx: 17.3, rx: 4.67, Iy: 2.82, Sy: 1.41, ry: 0.773 },
  { name: "W12x22", type: "W", weight: 22.0, A: 6.48, d: 12.3, bf: 4.03, Ix: 156.0, Sx: 25.4, rx: 4.91, Iy: 4.66, Sy: 2.31, ry: 0.847 },
  { name: "W12x26", type: "W", weight: 26.0, A: 7.65, d: 12.2, bf: 6.49, Ix: 204.0, Sx: 33.4, rx: 5.17, Iy: 17.3, Sy: 5.34, ry: 1.50 },
  { name: "W12x35", type: "W", weight: 35.0, A: 10.3, d: 12.5, bf: 6.56, Ix: 285.0, Sx: 45.6, rx: 5.25, Iy: 24.5, Sy: 7.47, ry: 1.54 },
  { name: "W12x53", type: "W", weight: 53.0, A: 15.6, d: 12.1, bf: 10.0, Ix: 425.0, Sx: 70.6, rx: 5.23, Iy: 95.8, Sy: 19.2, ry: 2.48 },

  { name: "W14x22", type: "W", weight: 22.0, A: 6.49, d: 13.7, bf: 5.00, Ix: 199.0, Sx: 29.0, rx: 5.54, Iy: 7.00, Sy: 2.80, ry: 1.04 },
  { name: "W14x30", type: "W", weight: 30.0, A: 8.85, d: 13.8, bf: 6.73, Ix: 291.0, Sx: 42.0, rx: 5.73, Iy: 19.6, Sy: 5.82, ry: 1.49 },
  { name: "W14x43", type: "W", weight: 43.0, A: 12.6, d: 13.7, bf: 8.00, Ix: 428.0, Sx: 62.6, rx: 5.82, Iy: 45.2, Sy: 11.3, ry: 1.89 },
  { name: "W14x68", type: "W", weight: 68.0, A: 20.0, d: 14.0, bf: 10.0, Ix: 722.0, Sx: 103.0, rx: 6.01, Iy: 121.0, Sy: 24.2, ry: 2.46 },

  { name: "W16x26", type: "W", weight: 26.0, A: 7.68, d: 15.7, bf: 5.50, Ix: 301.0, Sx: 38.4, rx: 6.26, Iy: 9.59, Sy: 3.49, ry: 1.12 },
  { name: "W16x40", type: "W", weight: 40.0, A: 11.8, d: 16.0, bf: 7.00, Ix: 518.0, Sx: 64.7, rx: 6.63, Iy: 28.9, Sy: 8.25, ry: 1.57 },
  { name: "W16x50", type: "W", weight: 50.0, A: 14.7, d: 16.3, bf: 7.07, Ix: 659.0, Sx: 81.0, rx: 6.68, Iy: 37.2, Sy: 10.5, ry: 1.59 },

  { name: "W18x35", type: "W", weight: 35.0, A: 10.3, d: 17.7, bf: 6.00, Ix: 510.0, Sx: 57.6, rx: 7.04, Iy: 15.3, Sy: 5.10, ry: 1.22 },
  { name: "W18x50", type: "W", weight: 50.0, A: 14.7, d: 18.0, bf: 7.50, Ix: 800.0, Sx: 88.9, rx: 7.38, Iy: 40.1, Sy: 10.7, ry: 1.65 },
  { name: "W18x76", type: "W", weight: 76.0, A: 22.3, d: 18.2, bf: 11.0, Ix: 1330.0, Sx: 146.0, rx: 7.73, Iy: 152.0, Sy: 27.6, ry: 2.61 },

  // HSS Square & Rectangular Tubing
  { name: "HSS4x4x1/4", type: "HSS", weight: 12.2, A: 3.37, d: 4.00, bf: 4.00, Ix: 7.80, Sx: 3.90, rx: 1.52, Iy: 7.80, Sy: 3.90, ry: 1.52 },
  { name: "HSS4x4x3/8", type: "HSS", weight: 17.3, A: 4.78, d: 4.00, bf: 4.00, Ix: 10.3, Sx: 5.15, rx: 1.47, Iy: 10.3, Sy: 5.15, ry: 1.47 },
  { name: "HSS6x6x1/4", type: "HSS", weight: 19.0, A: 5.24, d: 6.00, bf: 6.00, Ix: 28.6, Sx: 9.54, rx: 2.34, Iy: 28.6, Sy: 9.54, ry: 2.34 },
  { name: "HSS6x6x3/8", type: "HSS", weight: 27.5, A: 7.58, d: 6.00, bf: 6.00, Ix: 39.0, Sx: 13.0, rx: 2.27, Iy: 39.0, Sy: 13.0, ry: 2.27 },
  { name: "HSS6x6x1/2", type: "HSS", weight: 35.2, A: 9.74, d: 6.00, bf: 6.00, Ix: 47.3, Sx: 15.8, rx: 2.20, Iy: 47.3, Sy: 15.8, ry: 2.20 },
  { name: "HSS8x8x1/4", type: "HSS", weight: 25.8, A: 7.10, d: 8.00, bf: 8.00, Ix: 70.7, Sx: 17.7, rx: 3.16, Iy: 70.7, Sy: 17.7, ry: 3.16 },
  { name: "HSS8x8x3/8", type: "HSS", weight: 37.7, A: 10.4, d: 8.00, bf: 8.00, Ix: 98.7, Sx: 24.7, rx: 3.08, Iy: 98.7, Sy: 24.7, ry: 3.08 },
  { name: "HSS8x8x1/2", type: "HSS", weight: 48.9, A: 13.5, d: 8.00, bf: 8.00, Ix: 122.0, Sx: 30.6, rx: 3.01, Iy: 122.0, Sy: 30.6, ry: 3.01 },
  { name: "HSS10x10x3/8", type: "HSS", weight: 47.9, A: 13.3, d: 10.0, bf: 10.0, Ix: 199.0, Sx: 39.9, rx: 3.87, Iy: 199.0, Sy: 39.9, ry: 3.87 },
  { name: "HSS10x10x1/2", type: "HSS", weight: 62.5, A: 17.3, d: 10.0, bf: 10.0, Ix: 251.0, Sx: 50.1, rx: 3.81, Iy: 251.0, Sy: 50.1, ry: 3.81 },
  { name: "HSS12x12x1/2", type: "HSS", weight: 76.1, A: 21.0, d: 12.0, bf: 12.0, Ix: 442.0, Sx: 73.7, rx: 4.59, Iy: 442.0, Sy: 73.7, ry: 4.59 }
];

export function getSectionByName(name) {
  return AISC_DATABASE.find(s => s.name === name) || AISC_DATABASE[0];
}
