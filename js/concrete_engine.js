/**
 * Reinforced Concrete Spread Footing Engine (ACI 318-19 Standards)
 * Includes Custom Rebar Reinforcement Selection (#3 through #10 @ 4" to 18" spacing)
 * & Auto-Required Rebar Calculation.
 */

export function analyzeConcreteFooting(inputs) {
  const P_dead = inputs.P_dead_kips || 40;
  const P_live = inputs.P_live_kips || 25;
  const B_ft = inputs.width_ft || 5;
  const L_ft = inputs.length_ft || B_ft;
  const t_in = inputs.thickness_in || 14;
  const q_allow = inputs.q_allowable_ksf || 3.0;
  const fc = inputs.fc_psi || 3000;
  const fy = 60000; // Grade 60 Rebar

  // 1. Soil Bearing Capacity Check
  const P_service = P_dead + P_live;
  const Area_ft2 = B_ft * L_ft;
  const q_service_ksf = P_service / Area_ft2;
  const passBearing = q_service_ksf <= q_allow;
  const bearingRatio = q_service_ksf / q_allow;

  // 2. Factored Ultimate Load (1.2D + 1.6L)
  const P_factored = (1.2 * P_dead) + (1.6 * P_live);
  const q_u_ksf = P_factored / Area_ft2;
  const q_u_psi = (q_u_ksf * 1000) / 144;

  // 3. Cantilever Bending Moment & Required Steel Area As
  const col_width_in = 12; // 12x12 Column
  const cantilever_in = ((B_ft * 12) - col_width_in) / 2;
  const cantilever_ft = cantilever_in / 12;

  const M_u_lbft = (q_u_ksf * 1000 * Math.pow(cantilever_ft, 2)) / 2; // per ft width
  const M_u_kipin = (M_u_lbft * 12) / 1000;
  const M_u_kipft = M_u_lbft / 1000;

  const cover_in = 3.0; // ACI 318 cast against soil
  const d_in = t_in - cover_in - 0.375; // Effective depth

  const phi_b = 0.90;
  const As_req_sqin_per_ft = M_u_kipin / (phi_b * (fy / 1000) * 0.9 * d_in);
  const As_min_per_ft = 0.0018 * 12 * t_in;
  const As_final_req_per_ft = Math.max(As_req_sqin_per_ft, As_min_per_ft);
  const As_total_req = As_final_req_per_ft * B_ft;

  // Rebar Data Lookup
  const rebarAreas = {
    3: 0.11,
    4: 0.20,
    5: 0.31,
    6: 0.44,
    7: 0.60,
    8: 0.79,
    9: 1.00,
    10: 1.27
  };

  let barSize = parseInt(inputs.customBarSize) || 5;
  let barSpacing = parseFloat(inputs.customBarSpacing) || 12;
  let isCustomRebar = inputs.rebarMode === 'custom';

  let barArea = rebarAreas[barSize] || 0.31;
  let As_provided_per_ft = (12 / barSpacing) * barArea;
  let As_total_provided = As_provided_per_ft * B_ft;

  let rebarSchedule = "";
  if (isCustomRebar) {
    rebarSchedule = `#${barSize} @ ${barSpacing}" o.c. (Provided: ${As_provided_per_ft.toFixed(2)} in²/ft | Required: ${As_final_req_per_ft.toFixed(2)} in²/ft)`;
  } else {
    // Auto recommendation
    if (As_final_req_per_ft <= 0.31) {
      rebarSchedule = `#4 @ 8" o.c. bottom mat each way`;
      barSize = 4; barSpacing = 8;
    } else if (As_final_req_per_ft <= 0.45) {
      rebarSchedule = `#5 @ 8" o.c. bottom mat each way`;
      barSize = 5; barSpacing = 8;
    } else {
      rebarSchedule = `#6 @ 8" o.c. bottom mat each way`;
      barSize = 6; barSpacing = 8;
    }
    barArea = rebarAreas[barSize];
    As_provided_per_ft = (12 / barSpacing) * barArea;
    As_total_provided = As_provided_per_ft * B_ft;
  }

  // Flexural Capacity Check phi*Mn
  const a_in = (As_provided_per_ft * fy) / (0.85 * fc * 12);
  const Mn_kipin_per_ft = As_provided_per_ft * (fy / 1000) * (d_in - (a_in / 2));
  const phi_Mn_kipft_per_ft = (phi_b * Mn_kipin_per_ft) / 12;

  const passSteel = As_provided_per_ft >= As_final_req_per_ft && phi_Mn_kipft_per_ft >= (M_u_kipft);

  // 4. One-Way & Two-Way Punching Shear Checks
  const V_u_1way_lbs = (q_u_psi * 144) * (cantilever_ft - (d_in / 12));
  const phi_Vc_1way_lbs = 0.75 * 2 * Math.sqrt(fc) * 12 * d_in;
  const passOneWayShear = V_u_1way_lbs <= phi_Vc_1way_lbs;

  const bo_in = 4 * (col_width_in + d_in);
  const V_u_2way_lbs = (q_u_psi * 144) * (Area_ft2 - Math.pow((col_width_in + d_in) / 12, 2));
  const phi_Vc_2way_lbs = 0.75 * 4 * Math.sqrt(fc) * bo_in * d_in;
  const passTwoWayShear = V_u_2way_lbs <= phi_Vc_2way_lbs;

  const isPass = passBearing && passSteel && passOneWayShear && passTwoWayShear;

  return {
    P_service,
    P_factored,
    q_service_ksf,
    q_allowable_ksf: q_allow,
    bearingRatio,
    passBearing,
    M_u_kipft,
    As_required_sqin_per_ft: As_final_req_per_ft,
    As_provided_sqin_per_ft: As_provided_per_ft,
    As_final_sqin: As_total_provided,
    phi_Mn_kipft_per_ft,
    rebarRecommendation: rebarSchedule,
    passSteel,
    passOneWayShear,
    passTwoWayShear,
    isPass
  };
}
