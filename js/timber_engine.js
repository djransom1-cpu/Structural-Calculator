/**
 * Timber & Engineered Wood Calculation Engine (NDS 2018 Standards)
 * Includes ASCE 7 / IBC Wind Net Uplift Load Combinations (0.6D - 0.6W ASD / 0.9D - 1.0W LRFD)
 * & Hold-Down Tension Reactions.
 */

export const TIMBER_SPECIES = [
  { name: "DF-L Select Structural", Fb: 1500, Fv: 180, E: 1900000, category: "DF-L" },
  { name: "DF-L No. 1", Fb: 1000, Fv: 180, E: 1700000, category: "DF-L" },
  { name: "DF-L No. 2", Fb: 900, Fv: 180, E: 1600000, category: "DF-L" },
  { name: "DF-L Stud", Fb: 700, Fv: 180, E: 1400000, category: "DF-L" },
  { name: "SYP Select Structural", Fb: 1550, Fv: 175, E: 1800000, category: "SYP" },
  { name: "SYP No. 1", Fb: 1250, Fv: 175, E: 1600000, category: "SYP" },
  { name: "SYP No. 2", Fb: 925, Fv: 175, E: 1400000, category: "SYP" },
  { name: "SYP Prime", Fb: 1100, Fv: 175, E: 1500000, category: "SYP" },
  { name: "Hem-Fir Select Structural", Fb: 1300, Fv: 150, E: 1600000, category: "HF" },
  { name: "Hem-Fir No. 1", Fb: 925, Fv: 150, E: 1500000, category: "HF" },
  { name: "Hem-Fir No. 2", Fb: 850, Fv: 150, E: 1300000, category: "HF" },
  { name: "SPF Select Structural", Fb: 1250, Fv: 135, E: 1500000, category: "SPF" },
  { name: "SPF No. 1/No. 2", Fb: 875, Fv: 135, E: 1400000, category: "SPF" },
  { name: "LVL 2.0E (Microllam/Versa-Lam)", Fb: 2600, Fv: 285, E: 2000000, category: "LVL" },
  { name: "LVL 1.9E", Fb: 2250, Fv: 285, E: 1900000, category: "LVL" },
  { name: "Glulam 24F-V4 (Architectural)", Fb: 2400, Fv: 240, E: 1800000, category: "Glulam" },
  { name: "Glulam 24F-1.8E", Fb: 2400, Fv: 210, E: 1800000, category: "Glulam" },
  { name: "PSL Parallam 2.0E", Fb: 2900, Fv: 290, E: 2000000, category: "PSL" },
  { name: "TJI Engineered Wood I-Joist", Fb: 2100, Fv: 230, E: 1750000, category: "TJI" }
];

export const TIMBER_FAMILIES = {
  'builtup': 'Custom Built-Up Header / Beam (# Plies x Width x Depth)',
  'sawn': 'Dimension Sawn Lumber (2x4 to 4x12)',
  'timber': 'Heavy Timber Posts & Beams (6x6 to 12x12)',
  'lvl': 'LVL Engineered Beams (1-3/4" Plies)',
  'glulam': 'Glulam Architectural Beams',
  'psl': 'PSL Parallam Heavy Beams',
  'ijoist': 'TJI Wood I-Joists'
};

export const TIMBER_MEMBERS = [
  { name: "2x4", category: "sawn", b: 1.5, d: 3.5, Area: 5.25, Sx: 3.06, Ix: 5.36, weight: 1.5 },
  { name: "2x6", category: "sawn", b: 1.5, d: 5.5, Area: 8.25, Sx: 7.56, Ix: 20.80, weight: 2.3 },
  { name: "2x8", category: "sawn", b: 1.5, d: 7.25, Area: 10.88, Sx: 13.14, Ix: 47.63, weight: 3.1 },
  { name: "2x10", category: "sawn", b: 1.5, d: 9.25, Area: 13.88, Sx: 21.39, Ix: 98.93, weight: 4.0 },
  { name: "2x12", category: "sawn", b: 1.5, d: 11.25, Area: 16.88, Sx: 31.64, Ix: 177.98, weight: 4.8 },
  { name: "3x6", category: "sawn", b: 2.5, d: 5.5, Area: 13.75, Sx: 12.60, Ix: 34.66, weight: 3.9 },
  { name: "3x8", category: "sawn", b: 2.5, d: 7.25, Area: 18.13, Sx: 21.90, Ix: 79.39, weight: 5.2 },
  { name: "3x10", category: "sawn", b: 2.5, d: 9.25, Area: 23.13, Sx: 35.65, Ix: 164.89, weight: 6.6 },
  { name: "3x12", category: "sawn", b: 2.5, d: 11.25, Area: 28.13, Sx: 52.73, Ix: 296.63, weight: 8.0 },
  { name: "4x6", category: "sawn", b: 3.5, d: 5.5, Area: 19.25, Sx: 17.65, Ix: 48.53, weight: 5.5 },
  { name: "4x8", category: "sawn", b: 3.5, d: 7.25, Area: 25.38, Sx: 30.66, Ix: 111.15, weight: 7.2 },
  { name: "4x10", category: "sawn", b: 3.5, d: 9.25, Area: 32.38, Sx: 49.91, Ix: 230.84, weight: 9.2 },
  { name: "4x12", category: "sawn", b: 3.5, d: 11.25, Area: 39.38, Sx: 73.83, Ix: 415.28, weight: 11.2 },
  { name: "6x6", category: "timber", b: 5.5, d: 5.5, Area: 30.25, Sx: 27.73, Ix: 76.26, weight: 8.6 },
  { name: "6x8", category: "timber", b: 5.5, d: 7.5, Area: 41.25, Sx: 51.56, Ix: 193.36, weight: 11.8 },
  { name: "6x10", category: "timber", b: 5.5, d: 9.5, Area: 52.25, Sx: 82.73, Ix: 392.96, weight: 14.9 },
  { name: "6x12", category: "timber", b: 5.5, d: 11.5, Area: 63.25, Sx: 121.23, Ix: 697.07, weight: 18.0 },
  { name: "8x8", category: "timber", b: 7.5, d: 7.5, Area: 56.25, Sx: 70.31, Ix: 263.67, weight: 16.0 },
  { name: "8x10", category: "timber", b: 7.5, d: 9.5, Area: 71.25, Sx: 112.81, Ix: 535.86, weight: 20.3 },
  { name: "8x12", category: "timber", b: 7.5, d: 11.5, Area: 86.25, Sx: 165.31, Ix: 950.55, weight: 24.6 },
  { name: "10x10", category: "timber", b: 9.5, d: 9.5, Area: 90.25, Sx: 142.90, Ix: 678.76, weight: 25.7 },
  { name: "12x12", category: "timber", b: 11.5, d: 11.5, Area: 132.25, Sx: 253.48, Ix: 1457.51, weight: 37.7 },
  { name: "LVL 1-3/4x7-1/4", category: "lvl", b: 1.75, d: 7.25, Area: 12.69, Sx: 15.33, Ix: 55.57, weight: 3.7 },
  { name: "LVL 1-3/4x9-1/4", category: "lvl", b: 1.75, d: 9.25, Area: 16.19, Sx: 24.96, Ix: 115.42, weight: 4.7 },
  { name: "LVL 1-3/4x9-1/2", category: "lvl", b: 1.75, d: 9.50, Area: 16.63, Sx: 26.32, Ix: 125.04, weight: 4.8 },
  { name: "LVL 1-3/4x11-1/4", category: "lvl", b: 1.75, d: 11.25, Area: 19.69, Sx: 36.91, Ix: 207.64, weight: 5.7 },
  { name: "LVL 1-3/4x11-7/8", category: "lvl", b: 1.75, d: 11.875, Area: 20.78, Sx: 41.13, Ix: 244.22, weight: 6.0 },
  { name: "LVL 1-3/4x14", category: "lvl", b: 1.75, d: 14.0, Area: 24.50, Sx: 57.17, Ix: 400.17, weight: 7.1 },
  { name: "LVL 1-3/4x16", category: "lvl", b: 1.75, d: 16.0, Area: 28.00, Sx: 74.67, Ix: 597.33, weight: 8.1 },
  { name: "LVL 1-3/4x18", category: "lvl", b: 1.75, d: 18.0, Area: 31.50, Sx: 94.50, Ix: 850.50, weight: 9.1 },
  { name: "LVL 1-3/4x20", category: "lvl", b: 1.75, d: 20.0, Area: 35.00, Sx: 116.67, Ix: 1166.67, weight: 10.1 },
  { name: "LVL 1-3/4x22", category: "lvl", b: 1.75, d: 22.0, Area: 38.50, Sx: 141.17, Ix: 1552.83, weight: 11.1 },
  { name: "LVL 1-3/4x24", category: "lvl", b: 1.75, d: 24.0, Area: 42.00, Sx: 168.00, Ix: 2016.00, weight: 12.1 }
];

export function getSpeciesByName(name) {
  return TIMBER_SPECIES.find(s => s.name === name) || TIMBER_SPECIES[0];
}

export function getMemberByName(name) {
  return TIMBER_MEMBERS.find(m => m.name === name) || TIMBER_MEMBERS[0];
}

export function analyzeTimberBeam(inputs) {
  const beamType = inputs.beamType || 'single';
  const L1_ft = inputs.L_ft || 14;
  const L2_ft = inputs.L2_ft || 0;
  const L1_in = L1_ft * 12;
  const species = getSpeciesByName(inputs.speciesName);

  let member = null;

  if (inputs.isBuiltUp) {
    const numPlies = inputs.numPlies || 2;
    const plyWidth = inputs.plyWidth || 1.5;
    const depth = inputs.depth || 9.25;

    const totalWidth = numPlies * plyWidth;
    const Area = totalWidth * depth;
    const Sx = (totalWidth * Math.pow(depth, 2)) / 6;
    const Ix = (totalWidth * Math.pow(depth, 3)) / 12;
    const weight = (Area / 144) * 35;

    member = {
      name: `${numPlies}-Ply (${numPlies}x${plyWidth}" x ${depth}")`,
      b: totalWidth,
      d: depth,
      Area,
      Sx,
      Ix,
      weight,
      numPlies,
      plyWidth
    };
  } else {
    member = getMemberByName(inputs.sizeName);
  }

  const selfWeight_plf = inputs.includeSelfWeight !== false ? (member.weight || 0) : 0;
  
  let w_dl_plf = 0;
  let w_ll_plf = 0;
  let w_wind_uplift_plf = 0;

  if (inputs.loadMode === 'direct') {
    w_dl_plf = (inputs.w_dl_plf || 0) + selfWeight_plf;
    w_ll_plf = (inputs.w_ll_plf || 0);
    w_wind_uplift_plf = (inputs.w_wind_plf || 0);
  } else {
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

  const w_service_plf = w_dl_plf + w_ll_plf;
  const w_service_kft = w_service_plf / 1000;

  // ASCE 7 ASD Net Wind Uplift Combo: 0.6 D - 0.6 W
  const w_net_uplift_plf = w_wind_uplift_plf > 0 ? ((0.6 * w_wind_uplift_plf) - (0.6 * w_dl_plf)) : 0;
  const isNetUplift = w_net_uplift_plf > 0;

  const pointLoads = inputs.pointLoads && inputs.pointLoads.length > 0
    ? inputs.pointLoads
    : [{ P_dl: 0, P_ll: 0, pos_ft: L1_ft / 2 }];

  let R1_dl_lbs = 0, R1_ll_lbs = 0;
  let R2_dl_lbs = 0, R2_ll_lbs = 0;
  let R3_dl_lbs = 0, R3_ll_lbs = 0;

  const E = species.E;

  let M_point_lbin = 0;
  let V_point_lbs = 0;
  let delta_point_live = 0;
  let delta_point_total = 0;

  if (beamType === 'single') {
    R1_dl_lbs += (w_dl_plf * L1_ft) / 2;
    R2_dl_lbs += (w_dl_plf * L1_ft) / 2;
    R1_ll_lbs += (w_ll_plf * L1_ft) / 2;
    R2_ll_lbs += (w_ll_plf * L1_ft) / 2;
  } else if (beamType === 'cantilever') {
    const M_cant_dl = (w_dl_plf * Math.pow(L2_ft, 2)) / 2;
    const M_cant_ll = (w_ll_plf * Math.pow(L2_ft, 2)) / 2;

    R1_dl_lbs += (w_dl_plf * L1_ft) / 2 - (M_cant_dl / L1_ft);
    R2_dl_lbs += (w_dl_plf * L1_ft) / 2 + (M_cant_dl / L1_ft) + (w_dl_plf * L2_ft);

    R1_ll_lbs += (w_ll_plf * L1_ft) / 2 - (M_cant_ll / L1_ft);
    R2_ll_lbs += (w_ll_plf * L1_ft) / 2 + (M_cant_ll / L1_ft) + (w_ll_plf * L2_ft);
  } else if (beamType === 'two-span') {
    R1_dl_lbs += 0.375 * w_dl_plf * L1_ft;
    R2_dl_lbs += 1.25 * w_dl_plf * L1_ft;
    R3_dl_lbs += 0.375 * w_dl_plf * (L2_ft || L1_ft);

    R1_ll_lbs += 0.375 * w_ll_plf * L1_ft;
    R2_ll_lbs += 1.25 * w_ll_plf * L1_ft;
    R3_ll_lbs += 0.375 * w_ll_plf * (L2_ft || L1_ft);
  }

  pointLoads.forEach(pt => {
    const P_d = (pt.P_dl || 0) * 1000;
    const P_l = (pt.P_ll || 0) * 1000;
    const P_serv = P_d + P_l;

    const a = Math.min(Math.max(pt.pos_ft, 0), L1_ft);
    const b = L1_ft - a;

    if (L1_ft > 0) {
      R1_dl_lbs += P_d * (b / L1_ft);
      R2_dl_lbs += P_d * (a / L1_ft);
      R1_ll_lbs += P_l * (b / L1_ft);
      R2_ll_lbs += P_l * (a / L1_ft);

      M_point_lbin += (P_serv * a * b * 12) / L1_ft;
      V_point_lbs += P_serv * (b / L1_ft);

      delta_point_live += (P_l * Math.pow(a * 12, 2) * Math.pow(b * 12, 2)) / (3 * E * member.Ix * L1_in);
      delta_point_total += (P_serv * Math.pow(a * 12, 2) * Math.pow(b * 12, 2)) / (3 * E * member.Ix * L1_in);
    }
  });

  const R1_service_lbs = R1_dl_lbs + R1_ll_lbs;
  const R2_service_lbs = R2_dl_lbs + R2_ll_lbs;
  const R3_service_lbs = R3_dl_lbs + R3_ll_lbs;

  const R1_uplift_lbs = Math.max(0, (w_net_uplift_plf * L1_ft) / 2);
  const R2_uplift_lbs = Math.max(0, (w_net_uplift_plf * L1_ft) / 2);

  const w_use_plf = isNetUplift ? w_net_uplift_plf : w_service_plf;
  let M_max_lbin = (w_use_plf * Math.pow(L1_ft, 2) * 12) / 8 + M_point_lbin;
  let V_max_lbs = Math.max(R1_service_lbs, R2_service_lbs, R3_service_lbs);

  const M_max_lbft = M_max_lbin / 12;
  const M_max_kipft = M_max_lbft / 1000;
  const V_max_kips = V_max_lbs / 1000;

  // NDS Load Duration Factor CD (1.6 for Wind Load)
  const CD = isNetUplift ? 1.6 : (inputs.CD || 1.15);
  const Cr = inputs.Cr || 1.15;
  const Fb_prime_psi = species.Fb * CD * Cr;

  const fb_psi = M_max_lbin / member.Sx;
  const stressRatio = fb_psi / Fb_prime_psi;

  const w_ll_in = w_ll_plf / 12;
  const w_serv_in = w_service_plf / 12;
  const delta_uniform_live = (5 * w_ll_in * Math.pow(L1_in, 4)) / (384 * E * member.Ix);
  const delta_uniform_total = (5 * w_serv_in * Math.pow(L1_in, 4)) / (384 * E * member.Ix);

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
    speciesName: species.name,
    sizeName: member.name,
    L_ft: L1_ft,
    L2_ft,
    w_service_plf,
    w_service_kft,
    w_net_uplift_plf,
    isNetUplift,
    reactions: {
      R1: { dl: R1_dl_lbs / 1000, ll: R1_ll_lbs / 1000, service: R1_service_lbs / 1000, uplift: R1_uplift_lbs / 1000 },
      R2: { dl: R2_dl_lbs / 1000, ll: R2_ll_lbs / 1000, service: R2_service_lbs / 1000, uplift: R2_uplift_lbs / 1000 },
      R3: { dl: R3_dl_lbs / 1000, ll: R3_ll_lbs / 1000, service: R3_service_lbs / 1000, uplift: 0 }
    },
    M_max_lbft,
    M_max_kipft,
    V_max_kips,
    fb_psi,
    Fb_prime_psi,
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

export function findLightestTimberBeam(inputs) {
  const family = inputs.family || 'builtup';

  if (family === 'builtup') {
    const plies = [1, 2, 3, 4, 5, 6];
    const depths = [5.5, 7.25, 9.25, 9.5, 11.25, 11.875, 14.0, 16.0, 18.0, 20.0, 22.0, 24.0];
    const plyWidth = inputs.plyWidth || 1.5;

    for (let d of depths) {
      for (let p of plies) {
        const testInputs = { ...inputs, isBuiltUp: true, numPlies: p, plyWidth, depth: d };
        const res = analyzeTimberBeam(testInputs);
        if (res.isPass) {
          return {
            found: true,
            member: { name: `${p}-Ply (${p}x${plyWidth}" x ${d}")`, weight: (p * plyWidth * d / 144) * 35 },
            result: res,
            builtUpParams: { numPlies: p, plyWidth, depth: d }
          };
        }
      }
    }
  } else {
    const candidates = TIMBER_MEMBERS.filter(m => m.category === family).sort((a, b) => a.weight - b.weight);

    for (let mem of candidates) {
      const testInputs = { ...inputs, sizeName: mem.name };
      const res = analyzeTimberBeam(testInputs);
      if (res.isPass) {
        return { found: true, member: mem, result: res };
      }
    }
  }

  return { found: false };
}
