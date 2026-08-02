/**
 * Timber & Roof Framing Calculation Engine
 * NDS Design Logic for Sawn Lumber & Heavy Timber
 */

export const TIMBER_SPECIES = [
  { name: "Douglas Fir-Larch #2", Fb: 900, Ft: 575, Fv: 180, Fc: 1350, E: 1600000 },
  { name: "Southern Pine #2", Fb: 1100, Ft: 675, Fv: 175, Fc: 1450, E: 1400000 },
  { name: "Spruce-Pine-Fir (SPF) #2", Fb: 875, Ft: 450, Fv: 135, Fc: 1150, E: 1400000 },
  { name: "Hem-Fir #1/#2", Fb: 850, Ft: 525, Fv: 150, Fc: 1300, E: 1500000 }
];

export const LUMBER_SIZES = [
  { name: "2x4", b: 1.5, d: 3.5, A: 5.25, Sx: 3.06, Ix: 5.36 },
  { name: "2x6", b: 1.5, d: 5.5, A: 8.25, Sx: 7.56, Ix: 20.80 },
  { name: "2x8", b: 1.5, d: 7.25, A: 10.88, Sx: 13.14, Ix: 47.63 },
  { name: "2x10", b: 1.5, d: 9.25, A: 13.88, Sx: 21.39, Ix: 98.93 },
  { name: "2x12", b: 1.5, d: 11.25, A: 16.88, Sx: 31.64, Ix: 177.98 },
  { name: "4x6", b: 3.5, d: 5.5, A: 19.25, Sx: 17.65, Ix: 48.53 },
  { name: "4x8", b: 3.5, d: 7.25, A: 25.38, Sx: 30.66, Ix: 111.13 },
  { name: "4x10", b: 3.5, d: 9.25, A: 32.38, Sx: 49.91, Ix: 230.84 },
  { name: "6x6", b: 5.5, d: 5.5, A: 30.25, Sx: 27.73, Ix: 76.26 },
  { name: "6x8", b: 5.5, d: 7.25, A: 39.88, Sx: 48.18, Ix: 174.67 }
];

export function analyzeTimberMember(inputs) {
  const species = TIMBER_SPECIES.find(s => s.name === inputs.speciesName) || TIMBER_SPECIES[0];
  const size = LUMBER_SIZES.find(s => s.name === inputs.sizeName) || LUMBER_SIZES[3]; // Default 2x10

  const L_ft = inputs.L_ft || 12.0; // Span in feet
  const w_plf = inputs.w_plf || 100; // Uniform load in lbs/ft
  const Cd = inputs.Cd || 1.15; // Load duration factor (1.15 for snow load, 1.0 for normal)
  const Cr = inputs.Cr || 1.15; // Repetitive member factor (1.15 for joists 24" o.c.)

  const L_in = L_ft * 12;

  // Maximum Bending Moment M_max (lb-in)
  const M_max_lbin = (w_plf * Math.pow(L_ft, 2) * 12) / 8;
  const M_max_lbft = M_max_lbin / 12;

  // Actual Bending Stress fb (psi)
  const fb_psi = M_max_lbin / size.Sx;

  // Adjusted Allowable Bending Stress Fb' (psi)
  const Fb_prime_psi = species.Fb * Cd * Cr;
  const stressRatio = fb_psi / Fb_prime_psi;

  // Deflection Calculation (inches)
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
