/**
 * Reinforced Concrete Pad Footing Engine (ACI 318-19 Standards)
 * Includes ASCE 7 Wind Uplift Resistance & Ballast Stability Check (0.6D + Footing Weight vs 1.0 W_uplift)
 * Supports Rectangular/Square Pad Footings with independent Side 1 (B) x Side 2 (L) x Thickness (t)
 * and Column Pedestal Dimensions (B_col x L_col).
 * Includes Custom Rebar Selection (#3 through #10 @ 4" to 18" spacing).
 */

export function analyzeConcreteFooting(inputs) {
  const P_dead = inputs.P_dead_kips || 40;
  const P_live = inputs.P_live_kips || 25;
  const P_uplift = inputs.P_uplift_kips || 0; // Wind Uplift Tension Load (kips)

  const B_ft = inputs.width_ft || 5;    // Side 1 (Width)
  const L_ft = inputs.length_ft || 5;   // Side 2 (Length)
  const t_in = inputs.thickness_in || 14; // Pad Thickness
  const col_w_in = inputs.col_width_in || 12; // Column Pedestal Width
  const col_l_in = inputs.col_length_in || 12; // Column Pedestal Length
  const q_allow = inputs.q_allowable_ksf || 3.0;
  const fc = inputs.fc_psi || 3000;
  const fy = 60000; // Grade 60 Rebar

  // Concrete Footing Pad Volume & Self-Weight (150 pcf)
  const Area_ft2 = B_ft * L_ft;
  const Volume_ft3 = Area_ft2 * (t_in / 12);
  const Weight_footing_kips = (Volume_ft3 * 150) / 1000;

  // 1. Soil Bearing Capacity Check (Gravity)
  const P_service = P_dead + P_live + Weight_footing_kips;
  const q_service_ksf = P_service / Area_ft2;
  const passBearing = q_service_ksf <= q_allow;
  const bearingRatio = q_service_ksf / q_allow;

  // 2. ASCE 7 Wind Uplift Resistance Check (0.6 D_super + 0.9 D_footing vs 1.0 W_uplift)
  const Resisting_Dead_kips = (0.6 * P_dead) + (0.9 * Weight_footing_kips);
  const Net_Uplift_Tension_kips = Math.max(0, P_uplift - Resisting_Dead_kips);
  const FOS_uplift = P_uplift > 0 ? (Resisting_Dead_kips / P_uplift) : 99.0;
  const passUplift = P_uplift === 0 || FOS_uplift >= 1.5;

  // 3. Factored Ultimate Load (1.2D + 1.6L)
  const P_factored = (1.2 * P_dead) + (1.6 * P_live);
  const q_u_ksf = P_factored / Area_ft2;
  const q_u_psi = (q_u_ksf * 1000) / 144;

  // 4. Cantilever Bending Moments for Side 1 and Side 2
  const cantilever_b_in = ((B_ft * 12) - col_w_in) / 2;
  const cantilever_b_ft = cantilever_b_in / 12;

  const cantilever_l_in = ((L_ft * 12) - col_l_in) / 2;
  const cantilever_l_ft = cantilever_l_in / 12;

  const max_cantilever_ft = Math.max(cantilever_b_ft, cantilever_l_ft);

  const M_u_lbft = (q_u_ksf * 1000 * Math.pow(max_cantilever_ft, 2)) / 2;
  const M_u_kipin = (M_u_lbft * 12) / 1000;
  const M_u_kipft = M_u_lbft / 1000;

  const cover_in = 3.0; // ACI 318 cast against soil
  const d_in = t_in - cover_in - 0.375; // Effective depth

  const phi_b = 0.90;
  const As_req_sqin_per_ft = M_u_kipin / (phi_b * (fy / 1000) * 0.9 * d_in);
  const As_min_per_ft = 0.0018 * 12 * t_in;
  const As_final_req_per_ft = Math.max(As_req_sqin_per_ft, As_min_per_ft);

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

  let rebarSchedule = "";
  if (isCustomRebar) {
    rebarSchedule = `#${barSize} @ ${barSpacing}" o.c. each way (Provided: ${As_provided_per_ft.toFixed(2)} in²/ft | Required: ${As_final_req_per_ft.toFixed(2)} in²/ft)`;
  } else {
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
  }

  // Flexural Capacity Check phi*Mn
  const a_in = (As_provided_per_ft * fy) / (0.85 * fc * 12);
  const Mn_kipin_per_ft = As_provided_per_ft * (fy / 1000) * (d_in - (a_in / 2));
  const phi_Mn_kipft_per_ft = (phi_b * Mn_kipin_per_ft) / 12;

  const passSteel = As_provided_per_ft >= As_final_req_per_ft && phi_Mn_kipft_per_ft >= (M_u_kipft);

  // 5. One-Way & Two-Way Punching Shear Checks
  const V_u_1way_lbs = (q_u_psi * 144) * (max_cantilever_ft - (d_in / 12));
  const phi_Vc_1way_lbs = 0.75 * 2 * Math.sqrt(fc) * 12 * d_in;
  const passOneWayShear = V_u_1way_lbs <= phi_Vc_1way_lbs;

  const bo_in = 2 * (col_w_in + d_in) + 2 * (col_l_in + d_in);
  const col_area_critical_ft2 = ((col_w_in + d_in) / 12) * ((col_l_in + d_in) / 12);
  const V_u_2way_lbs = (q_u_psi * 144) * (Area_ft2 - col_area_critical_ft2);
  const phi_Vc_2way_lbs = 0.75 * 4 * Math.sqrt(fc) * bo_in * d_in;
  const passTwoWayShear = V_u_2way_lbs <= phi_Vc_2way_lbs;

  const isPass = passBearing && passUplift && passSteel && passOneWayShear && passTwoWayShear;

  return {
    B_ft,
    L_ft,
    t_in,
    col_w_in,
    col_l_in,
    Weight_footing_kips,
    P_service,
    P_factored,
    P_uplift,
    Resisting_Dead_kips,
    Net_Uplift_Tension_kips,
    FOS_uplift,
    passUplift,
    q_service_ksf,
    q_allowable_ksf: q_allow,
    bearingRatio,
    passBearing,
    M_u_kipft,
    As_required_sqin_per_ft: As_final_req_per_ft,
    As_provided_sqin_per_ft: As_provided_per_ft,
    phi_Mn_kipft_per_ft,
    rebarRecommendation: rebarSchedule,
    passSteel,
    passOneWayShear,
    passTwoWayShear,
    isPass
  };
}
