/**
 * Steel Structural Calculation Engine
 * Handles Simply Supported Beams & Axial Column Buckling
 */

export const STEEL_CONSTANTS = {
  E_PSI: 29000000,      // Modulus of Elasticity (psi)
  E_KSI: 29000,         // Modulus of Elasticity (ksi)
  E_GPA: 200,           // Metric Modulus (GPa)
  DEFAULT_FY_KSI: 50.0, // Grade A992 standard yield strength (ksi)
};

/**
 * Perform structural analysis for a simply supported steel beam with uniform load w and point load P at midspan
 * @param {Object} inputs
 *   L_ft: Span length in feet
 *   w_kft: Uniform load in kips/ft
 *   P_kips: Point load at center in kips
 *   section: Object from AISC_DATABASE
 *   Fy_ksi: Yield strength in ksi (default 50)
 *   deflectLimitLive: Divider for live load limit (e.g. 360 for L/360)
 *   deflectLimitTotal: Divider for total load limit (e.g. 240 for L/240)
 */
export function analyzeSteelBeam(inputs) {
  const L_in = inputs.L_ft * 12; // Span in inches
  const w_kin = (inputs.w_kft || 0) / 12; // Uniform load in kips/inch
  const P = inputs.P_kips || 0; // Point load in kips
  const section = inputs.section;
  const Fy = inputs.Fy_ksi || STEEL_CONSTANTS.DEFAULT_FY_KSI;

  // Maximum Reactions (kips)
  const R_left = (inputs.w_kft * inputs.L_ft) / 2 + P / 2;
  const R_right = R_left;
  const V_max = R_left; // Max shear force (kips)

  // Maximum Bending Moment M_max (kip-in)
  // M_uniform = w * L^2 / 8
  // M_point = P * L / 4
  const M_uniform = (inputs.w_kft * Math.pow(inputs.L_ft, 2) * 12) / 8; // kip-in
  const M_point = (P * inputs.L_ft * 12) / 4; // kip-in
  const M_max_kipin = M_uniform + M_point;
  const M_max_kipft = M_max_kipin / 12;

  // Bending Stress (ksi)
  // sigma = M / Sx
  const bendingStress_ksi = M_max_kipin / section.Sx;

  // Allowable Stress (ksi) - standard 0.66 * Fy for compact sections
  const allowableStress_ksi = 0.66 * Fy;
  const stressRatio = bendingStress_ksi / allowableStress_ksi;

  // Deflection Calculation (inches)
  // delta_uniform = 5 * w * L^4 / (384 * E * I)
  // delta_point = P * L^3 / (48 * E * I)
  const E = STEEL_CONSTANTS.E_KSI; // 29,000 ksi
  const delta_uniform = (5 * w_kin * Math.pow(L_in, 4)) / (384 * E * section.Ix);
  const delta_point = (P * Math.pow(L_in, 3)) / (48 * E * section.Ix);
  const delta_max_in = delta_uniform + delta_point;

  // Deflection Limits (inches)
  const L360_in = L_in / (inputs.deflectLimitLive || 360);
  const L240_in = L_in / (inputs.deflectLimitTotal || 240);
  const deflectionRatio = delta_max_in / L240_in;

  // Combined Pass/Fail Status
  const passStress = bendingStress_ksi <= allowableStress_ksi;
  const passDeflection = delta_max_in <= L240_in;
  const isPass = passStress && passDeflection;

  return {
    L_ft: inputs.L_ft,
    L_in,
    w_kft: inputs.w_kft,
    P_kips: P,
    V_max_kips: V_max,
    M_max_kipft,
    M_max_kipin,
    bendingStress_ksi,
    allowableStress_ksi,
    stressRatio,
    delta_max_in,
    L360_in,
    L240_in,
    deflectionRatio,
    passStress,
    passDeflection,
    isPass,
    sectionName: section.name,
    weight_lbft: section.weight
  };
}

/**
 * Perform axial column buckling calculation
 * @param {Object} inputs
 *   L_ft: Column unbraced length (ft)
 *   K: Effective length factor (default 1.0)
 *   P_axial_kips: Applied axial compression load (kips)
 *   section: AISC section
 *   Fy_ksi: Yield strength (ksi)
 */
export function analyzeSteelColumn(inputs) {
  const L_in = inputs.L_ft * 12;
  const K = inputs.K || 1.0;
  const P_applied = inputs.P_axial_kips || 0;
  const section = inputs.section;
  const Fy = inputs.Fy_ksi || STEEL_CONSTANTS.DEFAULT_FY_KSI;
  const E = STEEL_CONSTANTS.E_KSI;

  // Slenderness Ratio (KL/r) for x and y axes
  const KLr_x = (K * L_in) / section.rx;
  const KLr_y = (K * L_in) / section.ry;
  const KLr_max = Math.max(KLr_x, KLr_y);

  // Critical Euler Buckling Stress Fe = (pi^2 * E) / (KL/r)^2
  const Fe_ksi = (Math.pow(Math.PI, 2) * E) / Math.pow(KLr_max, 2);

  // Critical Euler Axial Load P_cr = Fe * Area
  const P_cr_kips = Fe_ksi * section.A;

  // AISC Column Nominal Compressive Strength P_n
  // Fe = transition slenderness check 4.71 * sqrt(E / Fy)
  const slendernessLimit = 4.71 * Math.sqrt(E / Fy);
  let Fcr_ksi = 0;

  if (KLr_max <= slendernessLimit) {
    Fcr_ksi = Math.pow(0.658, Fy / Fe_ksi) * Fy;
  } else {
    Fcr_ksi = 0.877 * Fe_ksi;
  }

  const P_allowable_kips = (Fcr_ksi * section.A) / 1.67; // Safety factor Omega = 1.67 for ASD
  const capacityRatio = P_applied / P_allowable_kips;
  const isPass = P_applied <= P_allowable_kips && KLr_max <= 200;

  return {
    KLr_x,
    KLr_y,
    KLr_max,
    Fe_ksi,
    P_cr_kips,
    Fcr_ksi,
    P_allowable_kips,
    P_applied,
    capacityRatio,
    isPass,
    slendernessPass: KLr_max <= 200
  };
}
