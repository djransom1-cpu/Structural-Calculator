/**
 * Steel Structural Calculation Engine
 * Handles Simply Supported Beams & Axial Column Buckling
 * Supports Tributary Widths, Dead/Live Load separation, ASD & LRFD combinations.
 */

export const STEEL_CONSTANTS = {
  E_PSI: 29000000,      // Modulus of Elasticity (psi)
  E_KSI: 29000,         // Modulus of Elasticity (ksi)
  DEFAULT_FY_KSI: 50.0, // Grade A992 standard yield strength (ksi)
};

/**
 * Perform structural analysis for a steel beam with Tributary Width & Dead/Live load separation
 */
export function analyzeSteelBeam(inputs) {
  const L_ft = inputs.L_ft || 20;
  const L_in = L_ft * 12;
  const section = inputs.section;
  const Fy = inputs.Fy_ksi || STEEL_CONSTANTS.DEFAULT_FY_KSI;
  const method = inputs.method || 'ASD'; // 'ASD' or 'LRFD'

  // 1. Calculate Distributed Loads from Area Load (PSF) and Tributary Widths
  const tribLeft_ft = inputs.tribLeft_ft || 0;
  const tribRight_ft = inputs.tribRight_ft || 0;
  const totalTrib_ft = tribLeft_ft + tribRight_ft;

  const dl_psf = inputs.dl_psf || 0;
  const ll_psf = inputs.ll_psf || 0;

  // Convert PSF + Tributary Width to plf (lb/ft) and add beam self-weight
  const selfWeight_plf = inputs.includeSelfWeight ? (section.weight || 0) : 0;
  
  let w_dl_plf = inputs.loadMode === 'direct' 
    ? (inputs.w_dl_plf || 0) + selfWeight_plf
    : (dl_psf * totalTrib_ft) + selfWeight_plf;

  let w_ll_plf = inputs.loadMode === 'direct'
    ? (inputs.w_ll_plf || 0)
    : (ll_psf * totalTrib_ft);

  // Convert to kips/ft (k/ft)
  const w_dl_kft = w_dl_plf / 1000;
  const w_ll_kft = w_ll_plf / 1000;
  const w_service_kft = w_dl_kft + w_ll_kft;

  // Factored Uniform Load (k/ft)
  const w_factored_kft = method === 'LRFD' 
    ? (1.2 * w_dl_kft + 1.6 * w_ll_kft)
    : w_service_kft;

  // 2. Point Loads
  const P_dl = inputs.P_dl_kips || 0;
  const P_ll = inputs.P_ll_kips || 0;
  const P_service = P_dl + P_ll;
  const P_factored = method === 'LRFD' ? (1.2 * P_dl + 1.6 * P_ll) : P_service;
  const P_pos_ft = inputs.P_pos_ft !== undefined ? inputs.P_pos_ft : L_ft / 2;

  // 3. Reactions & Shear Force (kips)
  // Simple span reactions
  const R_dl = (w_dl_kft * L_ft) / 2 + P_dl * (1 - P_pos_ft / L_ft);
  const R_ll = (w_ll_kft * L_ft) / 2 + P_ll * (1 - P_pos_ft / L_ft);
  const R_factored = (w_factored_kft * L_ft) / 2 + P_factored * (1 - P_pos_ft / L_ft);
  const V_max_kips = R_factored;

  // 4. Maximum Bending Moment (kip-in & kip-ft)
  // M_uniform = w * L^2 / 8
  // M_point = P * a * b / L
  const a = P_pos_ft;
  const b = L_ft - a;
  const M_uniform_factored = (w_factored_kft * Math.pow(L_ft, 2) * 12) / 8;
  const M_point_factored = (P_factored * a * b * 12) / L_ft;
  const M_max_kipin = M_uniform_factored + M_point_factored;
  const M_max_kipft = M_max_kipin / 12;

  // 5. Stress Checks (ASD vs LRFD)
  let bendingStress_ksi = 0;
  let allowableStress_ksi = 0;
  let stressRatio = 0;

  if (method === 'ASD') {
    bendingStress_ksi = M_max_kipin / section.Sx;
    allowableStress_ksi = 0.66 * Fy; // AISC ASD compact allowable
    stressRatio = bendingStress_ksi / allowableStress_ksi;
  } else {
    // LRFD Flexural Strength Mn = Fy * Zx (approx 1.1 * Sx for W shapes)
    const Zx = section.Sx * 1.1;
    const Mn_kipin = Fy * Zx;
    const phiMn_kipft = (0.90 * Mn_kipin) / 12;
    bendingStress_ksi = M_max_kipft; // Use Mu (kip-ft)
    allowableStress_ksi = phiMn_kipft; // Use phiMn (kip-ft)
    stressRatio = M_max_kipft / phiMn_kipft;
  }

  // 6. Deflection Analysis (Service Loads ONLY)
  const E = STEEL_CONSTANTS.E_KSI; // 29,000 ksi
  const w_ll_kin = w_ll_kft / 12;
  const w_service_kin = w_service_kft / 12;

  // Live Load Deflection (in)
  const delta_ll_uniform = (5 * w_ll_kin * Math.pow(L_in, 4)) / (384 * E * section.Ix);
  const delta_ll_point = (P_ll * Math.pow(a * 12, 2) * Math.pow(b * 12, 2)) / (3 * E * section.Ix * L_in);
  const delta_live_in = delta_ll_uniform + delta_ll_point;

  // Total Load Deflection (in)
  const delta_tot_uniform = (5 * w_service_kin * Math.pow(L_in, 4)) / (384 * E * section.Ix);
  const delta_tot_point = (P_service * Math.pow(a * 12, 2) * Math.pow(b * 12, 2)) / (3 * E * section.Ix * L_in);
  const delta_total_in = delta_tot_uniform + delta_tot_point;

  // Code Deflection Limits
  const limitLiveDivider = inputs.deflectLimitLive || 360;
  const limitTotalDivider = inputs.deflectLimitTotal || 240;

  const L360_in = L_in / limitLiveDivider;
  const L240_in = L_in / limitTotalDivider;

  const passLiveDeflect = delta_live_in <= L360_in;
  const passTotalDeflect = delta_total_in <= L240_in;
  const passStress = stressRatio <= 1.0;
  const isPass = passStress && passLiveDeflect && passTotalDeflect;

  return {
    method,
    L_ft,
    totalTrib_ft,
    tribLeft_ft,
    tribRight_ft,
    w_dl_plf,
    w_ll_plf,
    w_service_kft,
    w_factored_kft,
    P_dl,
    P_ll,
    P_pos_ft,
    V_max_kips,
    M_max_kipft,
    M_max_kipin,
    bendingStress_ksi,
    allowableStress_ksi,
    stressRatio,
    delta_live_in,
    delta_total_in,
    L360_in,
    L240_in,
    passStress,
    passLiveDeflect,
    passTotalDeflect,
    isPass,
    sectionName: section.name,
    weight_lbft: section.weight
  };
}

export function analyzeSteelColumn(inputs) {
  const L_in = inputs.L_ft * 12;
  const K = inputs.K || 1.0;
  const P_applied = inputs.P_axial_kips || 0;
  const section = inputs.section;
  const Fy = inputs.Fy_ksi || STEEL_CONSTANTS.DEFAULT_FY_KSI;
  const E = STEEL_CONSTANTS.E_KSI;

  const KLr_x = (K * L_in) / section.rx;
  const KLr_y = (K * L_in) / section.ry;
  const KLr_max = Math.max(KLr_x, KLr_y);

  const Fe_ksi = (Math.pow(Math.PI, 2) * E) / Math.pow(KLr_max, 2);
  const P_cr_kips = Fe_ksi * section.A;

  const slendernessLimit = 4.71 * Math.sqrt(E / Fy);
  let Fcr_ksi = 0;

  if (KLr_max <= slendernessLimit) {
    Fcr_ksi = Math.pow(0.658, Fy / Fe_ksi) * Fy;
  } else {
    Fcr_ksi = 0.877 * Fe_ksi;
  }

  const P_allowable_kips = (Fcr_ksi * section.A) / 1.67;
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
