/**
 * Steel Design Calculation Engine (AISC 15th Edition ASD / LRFD)
 * Includes ASCE 7 / IBC Wind Net Uplift Combinations (0.6D - 0.6W ASD / 0.9D - 1.0W LRFD)
 * and Net Uplift Reaction Forces (R1_uplift, R2_uplift).
 */

import { AISC_DATABASE } from './aisc_database.js';

export function analyzeSteelBeam(inputs) {
  const method = inputs.method || 'ASD';
  const beamType = inputs.beamType || 'single';
  const L1_ft = inputs.L_ft || 20;
  const L2_ft = inputs.L2_ft || 0;
  const L1_in = L1_ft * 12;
  const Fy = inputs.Fy || 50;

  const section = inputs.section || AISC_DATABASE[0];
  const selfWeight_plf = inputs.includeSelfWeight !== false ? (section.weight || 0) : 0;
  
  let w_dl_plf = 0;
  let w_ll_plf = 0;
  let w_wind_uplift_plf = 0;

  if (inputs.loadMode === 'direct') {
    w_dl_plf = (inputs.w_dl_plf || 0) + selfWeight_plf;
    w_ll_plf = (inputs.w_ll_plf || 0);
    w_wind_uplift_plf = (inputs.w_wind_plf || 0);
  } else {
    // Asymmetric Side A (Left) & Side B (Right) Tributary Loads + Wind
    const tribLeft_ft = inputs.tribLeft_ft || 0;
    const tribRight_ft = inputs.tribRight_ft || 0;
    const dlLeft_psf = inputs.dlLeft_psf !== undefined ? inputs.dlLeft_psf : (inputs.dl_psf || 0);
    const dlRight_psf = inputs.dlRight_psf !== undefined ? inputs.dlRight_psf : (inputs.dl_psf || 0);
    const llLeft_psf = inputs.llLeft_psf !== undefined ? inputs.llLeft_psf : (inputs.ll_psf || 0);
    const llRight_psf = inputs.llRight_psf !== undefined ? inputs.llRight_psf : (inputs.ll_psf || 0);

    w_dl_plf = (dlLeft_psf * tribLeft_ft) + (dlRight_psf * tribRight_ft) + selfWeight_plf;
    w_ll_plf = (llLeft_psf * tribLeft_ft) + (llRight_psf * tribRight_ft);

    const wind_psf = inputs.wind_psf || 0;
    w_wind_uplift_plf = wind_psf * ((tribLeft_ft + tribRight_ft) / 2);
  }

  // Service Gravity Load
  const w_service_plf = w_dl_plf + w_ll_plf;
  const w_service_kft = w_service_plf / 1000;

  // ASCE 7 Wind Uplift Combinations
  // ASD Combo: 0.6 D - 0.6 W
  // LRFD Combo: 0.9 D - 1.0 W
  let w_net_uplift_plf = 0;
  if (w_wind_uplift_plf > 0) {
    if (method === 'ASD') {
      w_net_uplift_plf = (0.6 * w_wind_uplift_plf) - (0.6 * w_dl_plf);
    } else {
      w_net_uplift_plf = (1.0 * w_wind_uplift_plf) - (0.9 * w_dl_plf);
    }
  }
  const isNetUplift = w_net_uplift_plf > 0;
  const w_net_uplift_kft = Math.max(0, w_net_uplift_plf) / 1000;

  const w_factored_plf = (1.2 * w_dl_plf) + (1.6 * w_ll_plf);
  const w_factored_kft = w_factored_plf / 1000;

  const pointLoads = inputs.pointLoads && inputs.pointLoads.length > 0 
    ? inputs.pointLoads 
    : [{ P_dl: 0, P_ll: 0, pos_ft: L1_ft / 2 }];

  let R1_dl_kips = 0, R1_ll_kips = 0;
  let R2_dl_kips = 0, R2_ll_kips = 0;
  let R3_dl_kips = 0, R3_ll_kips = 0;

  let M_point_kipin = 0;
  let V_point_kips = 0;
  let delta_point_live = 0;
  let delta_point_total = 0;

  const E = 29000; // Steel Modulus of Elasticity (ksi)

  if (beamType === 'single') {
    R1_dl_kips += (w_dl_plf * L1_ft / 1000) / 2;
    R2_dl_kips += (w_dl_plf * L1_ft / 1000) / 2;
    R1_ll_kips += (w_ll_plf * L1_ft / 1000) / 2;
    R2_ll_kips += (w_ll_plf * L1_ft / 1000) / 2;
  } else if (beamType === 'cantilever') {
    const M_cant_dl = (w_dl_plf * Math.pow(L2_ft, 2) / 2) / 1000;
    const M_cant_ll = (w_ll_plf * Math.pow(L2_ft, 2) / 2) / 1000;

    R1_dl_kips += (w_dl_plf * L1_ft / 1000) / 2 - (M_cant_dl / L1_ft);
    R2_dl_kips += (w_dl_plf * L1_ft / 1000) / 2 + (M_cant_dl / L1_ft) + (w_dl_plf * L2_ft / 1000);

    R1_ll_kips += (w_ll_plf * L1_ft / 1000) / 2 - (M_cant_ll / L1_ft);
    R2_ll_kips += (w_ll_plf * L1_ft / 1000) / 2 + (M_cant_ll / L1_ft) + (w_ll_plf * L2_ft / 1000);
  } else if (beamType === 'two-span') {
    R1_dl_kips += 0.375 * (w_dl_plf * L1_ft / 1000);
    R2_dl_kips += 1.25 * (w_dl_plf * L1_ft / 1000);
    R3_dl_kips += 0.375 * (w_dl_plf * (L2_ft || L1_ft) / 1000);

    R1_ll_kips += 0.375 * (w_ll_plf * L1_ft / 1000);
    R2_ll_kips += 1.25 * (w_ll_plf * L1_ft / 1000);
    R3_ll_kips += 0.375 * (w_ll_plf * (L2_ft || L1_ft) / 1000);
  }

  pointLoads.forEach(pt => {
    const P_d = pt.P_dl || 0;
    const P_l = pt.P_ll || 0;
    const P_serv = P_d + P_l;

    const a = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
    const b = L1_ft - a;

    if (L1_ft > 0) {
      R1_dl_kips += P_d * (b / L1_ft);
      R2_dl_kips += P_d * (a / L1_ft);
      R1_ll_kips += P_l * (b / L1_ft);
      R2_ll_kips += P_l * (a / L1_ft);

      M_point_kipin += (P_serv * a * b * 12) / L1_ft;
      V_point_kips += P_serv * (b / L1_ft);

      delta_point_live += (P_l * Math.pow(a * 12, 2) * Math.pow(b * 12, 2)) / (3 * E * section.Ix * L1_in);
      delta_point_total += (P_serv * Math.pow(a * 12, 2) * Math.pow(b * 12, 2)) / (3 * E * section.Ix * L1_in);
    }
  });

  const R1_service_kips = R1_dl_kips + R1_ll_kips;
  const R2_service_kips = R2_dl_kips + R2_ll_kips;
  const R3_service_kips = R3_dl_kips + R3_ll_kips;

  // Net Uplift Reaction Forces (ASCE 7 Tension Uplift at Bearing Points)
  const R1_uplift_kips = Math.max(0, (w_net_uplift_plf * L1_ft / 1000) / 2);
  const R2_uplift_kips = Math.max(0, (w_net_uplift_plf * L1_ft / 1000) / 2);

  const R1_factored_kips = (1.2 * R1_dl_kips) + (1.6 * R1_ll_kips);
  const R2_factored_kips = (1.2 * R2_dl_kips) + (1.6 * R2_ll_kips);
  const R3_factored_kips = (1.2 * R3_dl_kips) + (1.6 * R3_ll_kips);

  const w_use_kft = isNetUplift ? w_net_uplift_kft : (method === 'ASD' ? w_service_kft : w_factored_kft);
  let M_max_kipft = (w_use_kft * Math.pow(L1_ft, 2)) / 8 + (M_point_kipin / 12);
  let V_max_kips = Math.max(R1_service_kips, R2_service_kips, R3_service_kips);

  const M_max_kipin = M_max_kipft * 12;

  let allowableStress_ksi = 0;
  let bendingStress_ksi = 0;
  let stressRatio = 0;

  if (method === 'ASD') {
    allowableStress_ksi = 0.66 * Fy;
    bendingStress_ksi = M_max_kipin / section.Sx;
    stressRatio = bendingStress_ksi / allowableStress_ksi;
  } else {
    const phi_b = 0.90;
    const Mn_kipin = Fy * section.Sx;
    const phi_Mn_kipft = (phi_b * Mn_kipin) / 12;
    allowableStress_ksi = phi_Mn_kipft;
    bendingStress_ksi = M_max_kipft;
    stressRatio = M_max_kipft / phi_Mn_kipft;
  }

  const w_ll_kin = (w_ll_plf / 1000) / 12;
  const w_serv_kin = w_service_kft / 12;
  const delta_uniform_live = (5 * w_ll_kin * Math.pow(L1_in, 4)) / (384 * E * section.Ix);
  const delta_uniform_total = (5 * w_serv_kin * Math.pow(L1_in, 4)) / (384 * E * section.Ix);

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
    method,
    beamType,
    sectionName: section.name,
    L_ft: L1_ft,
    L2_ft,
    w_service_kft,
    w_factored_kft,
    w_net_uplift_plf,
    isNetUplift,
    reactions: {
      R1: { dl: R1_dl_kips, ll: R1_ll_kips, service: R1_service_kips, factored: R1_factored_kips, uplift: R1_uplift_kips },
      R2: { dl: R2_dl_kips, ll: R2_ll_kips, service: R2_service_kips, factored: R2_factored_kips, uplift: R2_uplift_kips },
      R3: { dl: R3_dl_kips, ll: R3_ll_kips, service: R3_service_kips, factored: R3_factored_kips, uplift: 0 }
    },
    M_max_kipft,
    V_max_kips,
    bendingStress_ksi,
    allowableStress_ksi,
    stressRatio,
    delta_max_in: delta_total_in,
    delta_live_in,
    delta_total_in,
    L360_in,
    L240_in,
    passStress,
    passLiveDeflect,
    passTotalDeflect,
    isPass
  };
}

export function analyzeSteelColumn(inputs) {
  const L_ft = inputs.L_ft || 12;
  const K = inputs.K || 1.0;
  const P_applied = inputs.P_axial_kips || 35.0;
  const P_wind_uplift = inputs.P_wind_uplift_kips || 0;

  const section = inputs.section || AISC_DATABASE[0];

  const L_in = L_ft * 12;
  const KL_in = K * L_in;

  const rx = section.rx || 1.0;
  const ry = section.ry || rx;
  const r_min = Math.min(rx, ry);

  const KLr_max = KL_in / r_min;

  const E = 29000;
  const Fy = section.Fy || 50;

  const Fe_ksi = (Math.PI * Math.PI * E) / Math.pow(KLr_max, 2);

  let Fcr_ksi = 0;
  if (KLr_max <= 4.71 * Math.sqrt(E / Fy)) {
    Fcr_ksi = Math.pow(0.658, Fy / Fe_ksi) * Fy;
  } else {
    Fcr_ksi = 0.877 * Fe_ksi;
  }

  const Omega_c = 1.67;
  const P_allowable_kips = (Fcr_ksi * section.A) / Omega_c;
  const P_cr_kips = Fe_ksi * section.A;

  // Net Tension Uplift ASCE 7 Check (0.6 D - 1.0 W)
  const P_net_tension_kips = Math.max(0, P_wind_uplift - (0.6 * P_applied));
  const isNetTension = P_net_tension_kips > 0;
  const P_tension_capacity_kips = (Fy * section.A) / 1.67;
  const tensionPass = P_net_tension_kips <= P_tension_capacity_kips;

  const capacityRatio = P_applied / P_allowable_kips;
  const slendernessPass = KLr_max <= 200;
  const capacityPass = capacityRatio <= 1.0;
  const isPass = slendernessPass && capacityPass && tensionPass;

  return {
    sectionName: section.name,
    L_ft,
    K,
    KLr_max,
    Fe_ksi,
    Fcr_ksi,
    P_cr_kips,
    P_allowable_kips,
    P_applied,
    P_wind_uplift,
    P_net_tension_kips,
    isNetTension,
    tensionPass,
    capacityRatio,
    slendernessPass,
    capacityPass,
    isPass
  };
}

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
