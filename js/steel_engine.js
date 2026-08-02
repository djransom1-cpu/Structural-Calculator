/**
 * Steel Structural Calculation Engine - Advanced Beam & Column Analysis
 * Includes Member Auto-Optimizer for Lightest Passing Shapes
 */

export const STEEL_CONSTANTS = {
  E_PSI: 29000000,
  E_KSI: 29000,
  DEFAULT_FY_KSI: 50.0,
};

import { AISC_DATABASE } from './aisc_database.js';

/**
 * Perform comprehensive analysis for steel beams
 */
export function analyzeSteelBeam(inputs) {
  const beamType = inputs.beamType || 'single';
  const L1_ft = inputs.L_ft || 20;
  const L2_ft = inputs.L2_ft || 0;
  const L1_in = L1_ft * 12;
  const section = inputs.section;
  const Fy = inputs.Fy_ksi || STEEL_CONSTANTS.DEFAULT_FY_KSI;
  const method = inputs.method || 'ASD';

  const totalTrib_ft = (inputs.tribLeft_ft || 0) + (inputs.tribRight_ft || 0);
  const selfWeight_plf = inputs.includeSelfWeight ? (section.weight || 0) : 0;
  
  const w_dl_plf = inputs.loadMode === 'direct' 
    ? (inputs.w_dl_plf || 0) + selfWeight_plf
    : ((inputs.dl_psf || 0) * totalTrib_ft) + selfWeight_plf;

  const w_ll_plf = inputs.loadMode === 'direct'
    ? (inputs.w_ll_plf || 0)
    : ((inputs.ll_psf || 0) * totalTrib_ft);

  const w_dl_kft = w_dl_plf / 1000;
  const w_ll_kft = w_ll_plf / 1000;
  const w_service_kft = w_dl_kft + w_ll_kft;

  const w_factored_kft = method === 'LRFD' 
    ? (1.2 * w_dl_kft + 1.6 * w_ll_kft)
    : w_service_kft;

  const pointLoads = inputs.pointLoads && inputs.pointLoads.length > 0
    ? inputs.pointLoads
    : [{ P_dl: inputs.P_dl_kips || 0, P_ll: inputs.P_ll_kips || 0, pos_ft: inputs.P_pos_ft || L1_ft / 2 }];

  let M_point_factored = 0;
  let V_point_factored = 0;
  let delta_point_live = 0;
  let delta_point_total = 0;

  const E = STEEL_CONSTANTS.E_KSI;

  pointLoads.forEach(pt => {
    const P_d = pt.P_dl || 0;
    const P_l = pt.P_ll || 0;
    const P_serv = P_d + P_l;
    const P_fact = method === 'LRFD' ? (1.2 * P_d + 1.6 * P_l) : P_serv;

    const a = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
    const b = L1_ft - a;

    if (L1_ft > 0) {
      M_point_factored += (P_fact * a * b * 12) / L1_ft;
      V_point_factored += P_fact * (b / L1_ft);

      delta_point_live += (P_l * Math.pow(a * 12, 2) * Math.pow(b * 12, 2)) / (3 * E * section.Ix * L1_in);
      delta_point_total += (P_serv * Math.pow(a * 12, 2) * Math.pow(b * 12, 2)) / (3 * E * section.Ix * L1_in);
    }
  });

  let M_max_kipin = 0;
  let V_max_kips = 0;
  let delta_uniform_live = 0;
  let delta_uniform_total = 0;

  if (beamType === 'single') {
    const M_uni_fact = (w_factored_kft * Math.pow(L1_ft, 2) * 12) / 8;
    M_max_kipin = M_uni_fact + M_point_factored;
    V_max_kips = (w_factored_kft * L1_ft) / 2 + V_point_factored;

    const w_ll_kin = w_ll_kft / 12;
    const w_serv_kin = w_service_kft / 12;
    delta_uniform_live = (5 * w_ll_kin * Math.pow(L1_in, 4)) / (384 * E * section.Ix);
    delta_uniform_total = (5 * w_serv_kin * Math.pow(L1_in, 4)) / (384 * E * section.Ix);

  } else if (beamType === 'cantilever') {
    const M_span_fact = (w_factored_kft * Math.pow(L1_ft, 2) * 12) / 8;
    const M_cant_fact = (w_factored_kft * Math.pow(L2_ft, 2) * 12) / 2;
    M_max_kipin = Math.max(M_span_fact, M_cant_fact) + M_point_factored;
    V_max_kips = (w_factored_kft * L1_ft) / 2 + w_factored_kft * L2_ft + V_point_factored;

    const w_ll_kin = w_ll_kft / 12;
    const w_serv_kin = w_service_kft / 12;
    delta_uniform_live = (5 * w_ll_kin * Math.pow(L1_in, 4)) / (384 * E * section.Ix);
    delta_uniform_total = (5 * w_serv_kin * Math.pow(L1_in, 4)) / (384 * E * section.Ix);

  } else if (beamType === 'two-span') {
    const M_neg_fact = (w_factored_kft * Math.pow(L1_ft, 2) * 12) / 8;
    const M_pos_fact = (0.07 * w_factored_kft * Math.pow(L1_ft, 2) * 12);
    M_max_kipin = Math.max(M_neg_fact, M_pos_fact) + M_point_factored;
    V_max_kips = 0.625 * w_factored_kft * L1_ft + V_point_factored;

    const w_ll_kin = w_ll_kft / 12;
    const w_serv_kin = w_service_kft / 12;
    delta_uniform_live = (2 * w_ll_kin * Math.pow(L1_in, 4)) / (384 * E * section.Ix);
    delta_uniform_total = (2 * w_serv_kin * Math.pow(L1_in, 4)) / (384 * E * section.Ix);
  }

  const M_max_kipft = M_max_kipin / 12;

  let bendingStress_ksi = 0;
  let allowableStress_ksi = 0;
  let stressRatio = 0;

  if (method === 'ASD') {
    bendingStress_ksi = M_max_kipin / section.Sx;
    allowableStress_ksi = 0.66 * Fy;
    stressRatio = bendingStress_ksi / allowableStress_ksi;
  } else {
    const Zx = section.Sx * 1.1;
    const Mn_kipin = Fy * Zx;
    const phiMn_kipft = (0.90 * Mn_kipin) / 12;
    bendingStress_ksi = M_max_kipft;
    allowableStress_ksi = phiMn_kipft;
    stressRatio = M_max_kipft / phiMn_kipft;
  }

  const delta_live_in = delta_uniform_live + delta_point_live;
  const delta_total_in = delta_uniform_total + delta_point_total;

  const limitLiveDivider = inputs.deflectLimitLive || 360;
  const limitTotalDivider = inputs.deflectLimitTotal || 240;

  const L360_in = L1_in / limitLiveDivider;
  const L240_in = L1_in / limitTotalDivider;

  const passLiveDeflect = delta_live_in <= L360_in;
  const passTotalDeflect = delta_total_in <= L240_in;
  const passStress = stressRatio <= 1.0;
  const isPass = passStress && passLiveDeflect && passTotalDeflect;

  return {
    beamType,
    method,
    L_ft: L1_ft,
    L2_ft,
    totalTrib_ft,
    w_dl_plf,
    w_ll_plf,
    w_service_kft,
    w_factored_kft,
    pointLoads,
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

/**
 * Auto-Optimizer: Find Lightest Passing Steel Beam Section
 */
export function findLightestSteelBeam(inputs) {
  const family = inputs.family || 'W';
  const candidates = AISC_DATABASE.filter(s => s.type === family).sort((a, b) => a.weight - b.weight);

  for (let sec of candidates) {
    const testInputs = { ...inputs, section: sec };
    const res = analyzeSteelBeam(testInputs);
    if (res.isPass) {
      return { found: true, section: sec, result: res };
    }
  }

  return { found: false };
}

/**
 * Column Buckling Analysis
 */
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

/**
 * Auto-Optimizer: Find Lightest Passing Column Section
 */
export function findLightestSteelColumn(inputs) {
  const family = inputs.family || 'HSS';
  const candidates = AISC_DATABASE.filter(s => s.type === family).sort((a, b) => a.weight - b.weight);

  for (let sec of candidates) {
    const testInputs = { ...inputs, section: sec };
    const res = analyzeSteelColumn(testInputs);
    if (res.isPass) {
      return { found: true, section: sec, result: res };
    }
  }

  return { found: false };
}
