/**
 * Concrete Foundation & Footing Calculation Engine
 * Handles isolated square/rectangular spread footing analysis:
 * - Soil Bearing Pressure Check
 * - One-Way & Two-Way (Punching) Shear
 * - Flexural Steel Reinforcement Area (As) & Bar Recommendations
 */

export function analyzeConcreteFooting(inputs) {
  // Inputs
  const P_dl = inputs.P_dead_kips || 0;
  const P_ll = inputs.P_live_kips || 0;
  const P_total = P_dl + P_ll; // Service axial load (kips)
  const P_factored = 1.2 * P_dl + 1.6 * P_ll; // Ultimate factored load Pu (kips)

  const B_ft = inputs.width_ft || 4.0; // Footing Width (ft)
  const L_ft = inputs.length_ft || 4.0; // Footing Length (ft)
  const t_in = inputs.thickness_in || 12.0; // Footing Thickness (in)
  const col_in = inputs.column_size_in || 12.0; // Square column width (in)

  const q_allowable_ksf = inputs.q_allowable_ksf || 3.0; // Soil bearing capacity (ksf)
  const fc_psi = inputs.fc_psi || 3000; // Concrete compressive strength (psi)
  const fy_psi = inputs.fy_psi || 60000; // Rebar yield strength (psi)

  // 1. Footing Self-Weight & Gross Soil Bearing Pressure
  const concreteDensity_pcf = 150;
  const footingWeight_kips = (B_ft * L_ft * (t_in / 12) * concreteDensity_pcf) / 1000;
  const Area_sqft = B_ft * L_ft;

  const q_service_ksf = (P_total + footingWeight_kips) / Area_sqft;
  const bearingRatio = q_service_ksf / q_allowable_ksf;
  const passBearing = q_service_ksf <= q_allowable_ksf;

  // 2. Net Factored Soil Pressure (ksf) for structural design
  const q_u_ksf = P_factored / Area_sqft;
  const q_u_psi = (q_u_ksf * 1000) / 144;

  // Effective depth d (inches) - assuming 3" clear cover + #5 rebar
  const d_in = Math.max(t_in - 3.5, 1);

  // 3. Cantilever Bending Moment at Column Face
  // Projection length cantilever c = (L - col) / 2
  const c_ft = (L_ft - col_in / 12) / 2;
  const M_u_kipft = (q_u_ksf * B_ft * Math.pow(c_ft, 2)) / 2; // Factored Moment (kip-ft)
  const M_u_kipin = M_u_kipft * 12;

  // 4. Flexural Steel Reinforcement As (sq in per direction)
  // Mn = phi * As * fy * (d - a/2) where a = As*fy / (0.85 * fc * B)
  // Approximate As = Mu / (0.9 * fy * 0.9 * d)
  const phi = 0.9;
  const As_req_sqin = M_u_kipin / (phi * (fy_psi / 1000) * 0.9 * d_in);
  
  // Temperature & Shrinkage Minimum Steel (0.0018 * B * t)
  const As_min_sqin = 0.0018 * (B_ft * 12) * t_in;
  const As_final_sqin = Math.max(As_req_sqin, As_min_sqin);

  // Rebar Selection Helper (#4, #5, #6 bars)
  const barArea = { "#4": 0.20, "#5": 0.31, "#6": 0.44 };
  const countBar5 = Math.ceil(As_final_sqin / barArea["#5"]);
  const spacingInches = countBar5 > 1 ? Math.floor((B_ft * 12 - 6) / (countBar5 - 1)) : 12;

  // 5. Punching (Two-Way) Shear Check at d/2 from column face
  const bo_in = 4 * (col_in + d_in); // Critical perimeter
  const V_u_punch_kips = P_factored - q_u_ksf * Math.pow((col_in + d_in) / 12, 2);
  const V_c_punch_psi = 4 * Math.sqrt(fc_psi); // 4 * sqrt(fc')
  const phi_shear = 0.75;
  const V_n_punch_kips = (phi_shear * V_c_punch_psi * bo_in * d_in) / 1000;
  const passPunching = V_u_punch_kips <= V_n_punch_kips;

  const isPass = passBearing && passPunching;

  return {
    P_total,
    P_factored,
    footingWeight_kips,
    Area_sqft,
    q_service_ksf,
    q_allowable_ksf,
    bearingRatio,
    passBearing,
    c_ft,
    M_u_kipft,
    As_final_sqin,
    rebarRecommendation: `${countBar5}x #5 Bars @ ${spacingInches}" o.c. (each way)`,
    V_u_punch_kips,
    V_n_punch_kips,
    passPunching,
    isPass
  };
}
