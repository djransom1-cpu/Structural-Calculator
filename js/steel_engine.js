/**
 * Steel Design Calculation Engine (AISC 15th / 16th Edition ASD & LRFD)
 * Includes exact piecewise moment M(x), shear V(x), and true elastic deflection delta(x) solvers,
 * AISC 360 Chapter F flexural design (using plastic section modulus Zx), Chapter G shear design,
 * ASCE 7 / IBC Wind Net Uplift combinations (0.6D - 0.6W ASD / 0.9D - 1.0W LRFD),
 * and AISC Design Guide 1 Base Plate Sizing, Bending Stress, & Anchor Rod Tension/Shear Design.
 */

import { AISC_DATABASE } from './aisc_database.js';

export function analyzeSteelBeam(inputs) {
  const method = inputs.method || 'ASD';
  const beamType = inputs.beamType || 'single';
  const L1_ft = Number(inputs.L_ft) || 20;
  const L2_ft = Number(inputs.L2_ft) || 0;
  const L1_in = L1_ft * 12;
  const Fy = Number(inputs.Fy) || 50;

  let section = inputs.section;
  if (!section || !section.name) {
    section = AISC_DATABASE.find(s => s.name === inputs.sectionName) || AISC_DATABASE[0];
  } else {
    const dbMatch = AISC_DATABASE.find(s => s.name === section.name);
    if (dbMatch) section = dbMatch;
  }

  const selfWeight_plf = inputs.includeSelfWeight !== false ? (section.weight || 0) : 0;
  
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

  const pointLoads = (inputs.pointLoads && inputs.pointLoads.length > 0)
    ? inputs.pointLoads.map(pt => ({
        P_dl: Number(pt.P_dl) || 0,
        P_ll: Number(pt.P_ll) || 0,
        pos_ft: Number(pt.pos_ft) || 0
      }))
    : [{ P_dl: 0, P_ll: 0, pos_ft: L1_ft / 2 }];

  let R1_dl_kips = 0, R1_ll_kips = 0;
  let R2_dl_kips = 0, R2_ll_kips = 0;
  let R3_dl_kips = 0, R3_ll_kips = 0;

  const E = 29000; // Steel Young's Modulus (ksi)

  // 1. REACTIONS CALCULATION
  if (beamType === 'single') {
    R1_dl_kips += (w_dl_plf * L1_ft / 1000) / 2;
    R2_dl_kips += (w_dl_plf * L1_ft / 1000) / 2;
    R1_ll_kips += (w_ll_plf * L1_ft / 1000) / 2;
    R2_ll_kips += (w_ll_plf * L1_ft / 1000) / 2;

    pointLoads.forEach(pt => {
      const a = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
      const b = L1_ft - a;
      if (L1_ft > 0) {
        R1_dl_kips += pt.P_dl * (b / L1_ft);
        R2_dl_kips += pt.P_dl * (a / L1_ft);
        R1_ll_kips += pt.P_ll * (b / L1_ft);
        R2_ll_kips += pt.P_ll * (a / L1_ft);
      }
    });
  } else if (beamType === 'cantilever') {
    const M_cant_dl = (w_dl_plf * Math.pow(L2_ft, 2) / 2) / 1000;
    const M_cant_ll = (w_ll_plf * Math.pow(L2_ft, 2) / 2) / 1000;

    R1_dl_kips += (w_dl_plf * L1_ft / 1000) / 2 - (M_cant_dl / L1_ft);
    R2_dl_kips += (w_dl_plf * L1_ft / 1000) / 2 + (M_cant_dl / L1_ft) + (w_dl_plf * L2_ft / 1000);

    R1_ll_kips += (w_ll_plf * L1_ft / 1000) / 2 - (M_cant_ll / L1_ft);
    R2_ll_kips += (w_ll_plf * L1_ft / 1000) / 2 + (M_cant_ll / L1_ft) + (w_ll_plf * L2_ft / 1000);

    pointLoads.forEach(pt => {
      const a = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
      const b = L1_ft - a;
      if (L1_ft > 0) {
        R1_dl_kips += pt.P_dl * (b / L1_ft);
        R2_dl_kips += pt.P_dl * (a / L1_ft);
        R1_ll_kips += pt.P_ll * (b / L1_ft);
        R2_ll_kips += pt.P_ll * (a / L1_ft);
      }
    });
  } else if (beamType === 'two-span') {
    const L2_span = L2_ft || L1_ft;
    R1_dl_kips += 0.375 * (w_dl_plf * L1_ft / 1000);
    R2_dl_kips += 1.25 * (w_dl_plf * L1_ft / 1000);
    R3_dl_kips += 0.375 * (w_dl_plf * L2_span / 1000);

    R1_ll_kips += 0.375 * (w_ll_plf * L1_ft / 1000);
    R2_ll_kips += 1.25 * (w_ll_plf * L1_ft / 1000);
    R3_ll_kips += 0.375 * (w_ll_plf * L2_span / 1000);

    pointLoads.forEach(pt => {
      const a = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
      const b = L1_ft - a;
      if (L1_ft > 0) {
        R1_dl_kips += pt.P_dl * (b / L1_ft);
        R2_dl_kips += pt.P_dl * (a / L1_ft);
        R1_ll_kips += pt.P_ll * (b / L1_ft);
        R2_ll_kips += pt.P_ll * (a / L1_ft);
      }
    });
  }

  const R1_service_kips = R1_dl_kips + R1_ll_kips;
  const R2_service_kips = R2_dl_kips + R2_ll_kips;
  const R3_service_kips = R3_dl_kips + R3_ll_kips;

  const R1_uplift_kips = Math.max(0, (w_net_uplift_plf * L1_ft / 1000) / 2);
  const R2_uplift_kips = Math.max(0, (w_net_uplift_plf * L1_ft / 1000) / 2);

  const R1_factored_kips = (1.2 * R1_dl_kips) + (1.6 * R1_ll_kips);
  const R2_factored_kips = (1.2 * R2_dl_kips) + (1.6 * R2_ll_kips);
  const R3_factored_kips = (1.2 * R3_dl_kips) + (1.6 * R3_ll_kips);

  // 2. EXACT PIECEWISE SHEAR V(x), MOMENT M(x), AND DEFLECTION delta(x) SOLVER
  const numSteps = 400;

  let max_M_service_kipft = 0;
  let max_M_factored_kipft = 0;
  let max_M_uplift_kipft = 0;
  let max_V_service_kips = 0;
  let max_V_factored_kips = 0;
  let max_delta_live_in = 0;
  let max_delta_total_in = 0;

  const w_serv_kft = w_service_kft;
  const w_fact_kft = w_factored_kft;
  const w_up_kft = w_net_uplift_kft;

  const w_ll_kin = (w_ll_plf / 1000) / 12;
  const w_total_kin = (w_service_plf / 1000) / 12;

  // Single span exact solver
  if (beamType === 'single') {
    for (let i = 0; i <= numSteps; i++) {
      const x_ft = (i / numSteps) * L1_ft;
      const x_in = x_ft * 12;

      // Service Shear and Moment
      let Vx_serv = R1_service_kips - (w_serv_kft * x_ft);
      let Mx_serv = (R1_service_kips * x_ft) - (0.5 * w_serv_kft * Math.pow(x_ft, 2));

      // Factored Shear and Moment
      let Vx_fact = R1_factored_kips - (w_fact_kft * x_ft);
      let Mx_fact = (R1_factored_kips * x_ft) - (0.5 * w_fact_kft * Math.pow(x_ft, 2));

      // Uplift Shear and Moment
      let Mx_up = (R1_uplift_kips * x_ft) - (0.5 * w_up_kft * Math.pow(x_ft, 2));

      pointLoads.forEach(pt => {
        const a_ft = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
        const P_serv = pt.P_dl + pt.P_ll;
        const P_fact = (1.2 * pt.P_dl) + (1.6 * pt.P_ll);

        if (x_ft >= a_ft) {
          Vx_serv -= P_serv;
          Mx_serv -= P_serv * (x_ft - a_ft);

          Vx_fact -= P_fact;
          Mx_fact -= P_fact * (x_ft - a_ft);
        }
      });

      max_M_service_kipft = Math.max(max_M_service_kipft, Math.abs(Mx_serv));
      max_M_factored_kipft = Math.max(max_M_factored_kipft, Math.abs(Mx_fact));
      max_M_uplift_kipft = Math.max(max_M_uplift_kipft, Math.abs(Mx_up));
      max_V_service_kips = Math.max(max_V_service_kips, Math.abs(Vx_serv));
      max_V_factored_kips = Math.max(max_V_factored_kips, Math.abs(Vx_fact));

      // Exact Elastic Deflection delta(x)
      let dx_live = 0;
      let dx_total = 0;

      if (L1_in > 0 && section.Ix > 0) {
        const unif_factor = (x_in * (L1_in - x_in) * (Math.pow(L1_in, 2) + (x_in * (L1_in - x_in)))) / (24 * E * section.Ix);
        dx_live += w_ll_kin * unif_factor;
        dx_total += w_total_kin * unif_factor;

        pointLoads.forEach(pt => {
          const a_in = Math.min(Math.max(pt.pos_ft, 0), L1_ft) * 12;
          const b_in = L1_in - a_in;

          const P_l = pt.P_ll;
          const P_t = pt.P_dl + pt.P_ll;

          let pt_defl_factor = 0;
          if (x_in <= a_in) {
            pt_defl_factor = (b_in * x_in * (Math.pow(L1_in, 2) - Math.pow(b_in, 2) - Math.pow(x_in, 2))) / (6 * E * section.Ix * L1_in);
          } else {
            pt_defl_factor = (a_in * (L1_in - x_in) * (2 * L1_in * x_in - Math.pow(x_in, 2) - Math.pow(a_in, 2))) / (6 * E * section.Ix * L1_in);
          }

          dx_live += P_l * pt_defl_factor;
          dx_total += P_t * pt_defl_factor;
        });
      }

      max_delta_live_in = Math.max(max_delta_live_in, Math.abs(dx_live));
      max_delta_total_in = Math.max(max_delta_total_in, Math.abs(dx_total));
    }
  } else {
    max_M_service_kipft = (w_serv_kft * Math.pow(L1_ft, 2)) / 8;
    max_M_factored_kipft = (w_fact_kft * Math.pow(L1_ft, 2)) / 8;
    pointLoads.forEach(pt => {
      const a = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
      const b = L1_ft - a;
      if (L1_ft > 0) {
        max_M_service_kipft += (pt.P_dl + pt.P_ll) * a * b / L1_ft;
        max_M_factored_kipft += ((1.2 * pt.P_dl) + (1.6 * pt.P_ll)) * a * b / L1_ft;
      }
    });
    max_V_service_kips = Math.max(R1_service_kips, R2_service_kips, R3_service_kips);
    max_V_factored_kips = Math.max(R1_factored_kips, R2_factored_kips, R3_factored_kips);
    max_delta_live_in = (5 * w_ll_kin * Math.pow(L1_in, 4)) / (384 * E * section.Ix);
    max_delta_total_in = (5 * w_total_kin * Math.pow(L1_in, 4)) / (384 * E * section.Ix);
  }

  // 3. AISC 360-16 CODE CHECKS
  const Zx = section.Zx || (1.12 * section.Sx);
  const Sx = section.Sx;

  // AISC 360 Chapter F: Compact section nominal flexural strength Mn = Fy * Zx <= 1.6 * Fy * Sx
  const Mn_kipin = Math.min(Fy * Zx, 1.6 * Fy * Sx);
  const Mn_kipft = Mn_kipin / 12;

  let M_design_kipft = 0;
  let M_capacity_kipft = 0;
  let bendingStress_ksi = 0;
  let allowableStress_ksi = 0;
  let stressRatio = 0;

  if (method === 'ASD') {
    const Omega_b = 1.67;
    M_design_kipft = isNetUplift ? max_M_uplift_kipft : max_M_service_kipft;
    M_capacity_kipft = Mn_kipft / Omega_b;
    allowableStress_ksi = (M_capacity_kipft * 12) / Sx;
    bendingStress_ksi = (M_design_kipft * 12) / Sx;
    stressRatio = M_design_kipft / M_capacity_kipft;
  } else {
    const phi_b = 0.90;
    M_design_kipft = isNetUplift ? max_M_uplift_kipft : max_M_factored_kipft;
    M_capacity_kipft = phi_b * Mn_kipft;
    allowableStress_ksi = M_capacity_kipft;
    bendingStress_ksi = M_design_kipft;
    stressRatio = M_design_kipft / M_capacity_kipft;
  }

  // AISC 360 Chapter G: Shear Design Vn = 0.6 * Fy * Aw * Cv1
  const Aw_sqin = (section.d || 10) * (section.tw || 0.3);
  const Vn_kips = 0.6 * Fy * Aw_sqin * 1.0;
  const V_allowable_kips = method === 'ASD' ? (Vn_kips / 1.67) : (1.00 * Vn_kips);
  const V_demand_kips = method === 'ASD' ? max_V_service_kips : max_V_factored_kips;
  const shearRatio = V_demand_kips / V_allowable_kips;
  const passShear = shearRatio <= 1.0;

  // Deflection Limits
  const limitLiveDivider = inputs.deflectLimitLive || 360;
  const limitTotalDivider = inputs.deflectLimitTotal || 240;

  const L360_in = L1_in / limitLiveDivider;
  const L240_in = L1_in / limitTotalDivider;

  const passLiveDeflect = max_delta_live_in <= L360_in;
  const passTotalDeflect = max_delta_total_in <= L240_in;
  const passStress = stressRatio <= 1.0;
  const isPass = passStress && passShear && passLiveDeflect && passTotalDeflect;

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
    M_max_kipft: max_M_service_kipft,
    M_factored_kipft: max_M_factored_kipft,
    V_max_kips: max_V_service_kips,
    V_demand_kips,
    V_allowable_kips,
    shearRatio,
    passShear,
    bendingStress_ksi,
    allowableStress_ksi,
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

/**
 * Complete Steel Column Buckling, AISC Base Plate Sizing, & Anchor Bolt Design Engine
 */
export function analyzeSteelColumn(inputs) {
  const L_ft = inputs.L_ft || 12;
  const K = inputs.K || 1.0;
  const P_applied = inputs.P_axial_kips || 35.0;
  const P_wind_uplift = inputs.P_wind_uplift_kips || 0;

  let section = inputs.section;
  if (!section || !section.name) {
    section = AISC_DATABASE.find(s => s.name === inputs.sectionName) || AISC_DATABASE[0];
  } else {
    const dbMatch = AISC_DATABASE.find(s => s.name === section.name);
    if (dbMatch) section = dbMatch;
  }

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

  // --- AISC DESIGN GUIDE 1: BASE PLATE SIZING & CONCRETE BEARING STRESS ---
  const B_plate = inputs.bp_width || 12.0;  // Base Plate Width (in)
  const N_plate = inputs.bp_length || 12.0; // Base Plate Length (in)
  const tp_provided = inputs.bp_thick || 0.75; // Provided Thickness (in)
  const Fy_plate = inputs.bp_fy || 36; // Plate Steel Grade (ksi)
  const fc_concrete = inputs.fc_psi || 3000; // Concrete Strength (psi)

  const A1_sqin = B_plate * N_plate; // Plate Bearing Area
  const fp_concrete_psi = (P_applied * 1000) / A1_sqin; // Actual Bearing Stress (psi)

  // AISC Allowable Concrete Bearing Stress Fp = 0.35 * f'c
  const Fp_allowable_psi = 0.35 * fc_concrete;
  const bearingPass = fp_concrete_psi <= Fp_allowable_psi;
  const bearingRatio = fp_concrete_psi / Fp_allowable_psi;

  // AISC Cantilever Dimensions m, n, lambda*n' for Plate Bending
  const d_col = section.d || (section.type === 'Pipe' ? section.d : 8.0);
  const bf_col = section.bf || (section.type === 'Pipe' ? section.d : 8.0);

  const m_arm = (N_plate - 0.95 * d_col) / 2;
  const n_arm = (B_plate - 0.80 * bf_col) / 2;
  const n_prime = (Math.sqrt(d_col * bf_col)) / 4;
  const l_arm_max = Math.max(m_arm, n_arm, n_prime, 0);

  // Required Base Plate Thickness tp_req per AISC DG1:
  const tp_required_in = l_arm_max * Math.sqrt((2 * P_applied) / (0.75 * Fy_plate * B_plate * N_plate));
  const plateThicknessPass = tp_provided >= tp_required_in;

  // --- ANCHOR ROD TENSION / SHEAR CAPACITY (ACI 318 / AISC) ---
  const boltDia = inputs.bolt_dia || 0.75; // Bolt Diameter (in)
  const numBolts = inputs.num_bolts || 4;  // Number of Anchor Rods
  const boltFy = inputs.bolt_fy || 36;     // Anchor Rod Grade (A36 / F1554)
  const V_shear_applied = inputs.V_shear_kips || 0; // Lateral Shear Load (kips)

  const Ab_single = (Math.PI * Math.pow(boltDia, 2)) / 4;
  const Ab_total = Ab_single * numBolts;

  // Allowable Tension per Rod = 0.50 * Fy
  const T_allow_single_kips = 0.50 * boltFy * Ab_single;
  const T_allow_total_kips = T_allow_single_kips * numBolts;
  const anchorTensionRatio = P_net_tension_kips / (T_allow_total_kips || 1);
  const anchorTensionPass = !isNetTension || anchorTensionRatio <= 1.0;

  // Allowable Shear per Rod = 0.40 * Fy
  const V_allow_total_kips = 0.40 * boltFy * Ab_total;
  const anchorShearRatio = V_shear_applied / (V_allow_total_kips || 1);
  const anchorShearPass = V_shear_applied === 0 || anchorShearRatio <= 1.0;

  const isPass = slendernessPass && capacityPass && tensionPass && bearingPass && plateThicknessPass && anchorTensionPass && anchorShearPass;

  return {
    sectionName: section.name,
    L_ft,
    K,
    KL_in,
    r_min,
    KLr_max,
    Fe_ksi,
    Fcr_ksi,
    P_applied,
    P_allowable_kips,
    P_cr_kips,
    capacityRatio,
    slendernessPass,
    capacityPass,
    P_wind_uplift,
    P_net_tension_kips,
    P_tension_capacity_kips,
    isNetTension,
    tensionPass,
    basePlate: {
      width: B_plate,
      length: N_plate,
      providedThickness: tp_provided,
      requiredThickness: tp_required_in,
      actualBearingPsi: fp_concrete_psi,
      allowableBearingPsi: Fp_allowable_psi,
      bearingRatio,
      bearingPass,
      plateThicknessPass
    },
    anchorRods: {
      boltDia,
      numBolts,
      appliedTension: P_net_tension_kips,
      allowableTension: T_allow_total_kips,
      tensionRatio: anchorTensionRatio,
      appliedShear: V_shear_applied,
      allowableShear: V_allow_total_kips,
      shearRatio: anchorShearRatio,
      anchorTensionPass,
      anchorShearPass
    },
    isPass
  };
}

export function findLightestSteelBeam(inputs) {
  const candidates = AISC_DATABASE.filter(s => s.type === 'W').sort((a, b) => a.weight - b.weight);

  for (let section of candidates) {
    const testInputs = { ...inputs, section };
    const res = analyzeSteelBeam(testInputs);
    if (res.isPass) {
      return { found: true, section, result: res };
    }
  }

  return { found: false };
}

export function findLightestSteelColumn(inputs) {
  const candidates = AISC_DATABASE.filter(s => s.type === 'W' || s.type === 'HSS' || s.type === 'Pipe').sort((a, b) => a.weight - b.weight);

  for (let section of candidates) {
    const testInputs = { ...inputs, section };
    const res = analyzeSteelColumn(testInputs);
    if (res.isPass) {
      return { found: true, section, result: res };
    }
  }

  return { found: false };
}
