/**
 * Retaining Wall & Braced Basement Soil Pressure Engine
 * Supports Unbraced Cantilever (Rankine Ka) & Braced / Restrained Basement Walls (At-Rest K0 & Diaphragm Tie Anchors)
 * IBC 2021 & ACI 318 Standards
 */

export function analyzeRetainingWall(inputs) {
  const H_ft = parseFloat(inputs.wall_height_ft) || 10.0; // Wall height (ft)
  const gamma_pcf = parseFloat(inputs.soil_density_pcf) || 120.0; // Soil unit weight (pcf)
  const phi_deg = parseFloat(inputs.friction_angle_deg) || 30.0; // Soil internal friction angle (deg)
  const surcharge_psf = parseFloat(inputs.surcharge_psf) || 0; // Uniform surcharge load (psf)
  const mu = parseFloat(inputs.base_friction_coeff) || 0.40; // Base friction coefficient
  const wallCondition = inputs.wall_condition || 'cantilever'; // 'cantilever' or 'braced'
  const braceSpacingInches = parseFloat(inputs.brace_spacing_in) || 24.0; // Joist / Brace anchor spacing (in)

  // Footing & Stem Dimensions
  const B_base_ft = parseFloat(inputs.base_width_ft) || 6.5; // Base width (ft)
  const stem_t_in = parseFloat(inputs.stem_thickness_in) || 12.0; // Stem thickness (in)
  const toe_ft = parseFloat(inputs.toe_length_ft) || 1.5; // Toe projection (ft)
  const heel_ft = Math.max(0, B_base_ft - toe_ft - (stem_t_in / 12.0)); // Heel projection (ft)

  // Rankine Soil Coefficients
  const phi_rad = (phi_deg * Math.PI) / 180.0;
  const Ka = (1.0 - Math.sin(phi_rad)) / (1.0 + Math.sin(phi_rad)); // Active Earth Pressure
  const K0 = 1.0 - Math.sin(phi_rad); // At-Rest Earth Pressure

  // Design Coefficient K_design
  const K_design = (wallCondition === 'braced') ? K0 : Ka;

  // Lateral Soil Pressures (psf)
  const q_soil_bottom_psf = K_design * gamma_pcf * H_ft;
  const q_surcharge_psf = K_design * surcharge_psf;

  // Resultant Lateral Forces (lbs per linear foot of wall)
  const P_soil_lb = 0.5 * K_design * gamma_pcf * Math.pow(H_ft, 2);
  const P_surcharge_lb = q_surcharge_psf * H_ft;
  const P_total_lateral_lb = P_soil_lb + P_surcharge_lb;

  let R_top_lbft = 0;
  let R_base_lbft = 0;
  let T_brace_anchor_lb = 0;
  let M_ot_lbft = 0;
  let M_max_lbft = 0;

  const braceSpacingFt = braceSpacingInches / 12.0;

  if (wallCondition === 'braced') {
    // Braced Wall Pinned-Pinned Beam Model (Restrained at Top Floor Diaphragm)
    R_top_lbft = (P_soil_lb / 3.0) + (P_surcharge_lb / 2.0); // Top diaphragm tie reaction (lb/ft)
    R_base_lbft = P_total_lateral_lb - R_top_lbft; // Base footing shear reaction (lb/ft)
    T_brace_anchor_lb = R_top_lbft * braceSpacingFt; // Diaphragm Anchor Tension Force per Joist/Brace (lbs)
    M_max_lbft = (0.128 * K_design * gamma_pcf * Math.pow(H_ft, 3)) + (q_surcharge_psf * Math.pow(H_ft, 2) / 8.0);
    M_ot_lbft = 0; // Top restraint prevents overturning
  } else {
    // Cantilever Retaining Wall (Free Top, Overturning at Base)
    M_ot_lbft = P_soil_lb * (H_ft / 3.0) + P_surcharge_lb * (H_ft / 2.0);
    M_max_lbft = M_ot_lbft;
    R_base_lbft = P_total_lateral_lb;
  }

  // Resisting Vertical Weight (lb per ft of wall)
  const conc_density_pcf = 150.0;
  const W_stem_lb = (stem_t_in / 12.0) * H_ft * conc_density_pcf;
  const W_base_lb = B_base_ft * (stem_t_in / 12.0) * conc_density_pcf;
  const W_soil_heel_lb = heel_ft * H_ft * gamma_pcf;
  const W_total_vertical_lb = W_stem_lb + W_base_lb + W_soil_heel_lb;

  // Lever arms from toe:
  const arm_stem = toe_ft + (stem_t_in / 24.0);
  const arm_base = B_base_ft / 2.0;
  const arm_soil = toe_ft + (stem_t_in / 12.0) + (heel_ft / 2.0);

  const M_resisting_lbft = (W_stem_lb * arm_stem) + (W_base_lb * arm_base) + (W_soil_heel_lb * arm_soil);

  // Factors of Safety
  const FOS_overturning = (wallCondition === 'braced') ? 999.0 : (M_ot_lbft > 0 ? M_resisting_lbft / M_ot_lbft : 999.0);
  const F_sliding_resisting_lb = mu * W_total_vertical_lb;
  const FOS_sliding = R_base_lbft > 0 ? F_sliding_resisting_lb / R_base_lbft : 999.0;

  // Stem Flexural Bending Stress (psi)
  const Sx_stem = (12.0 * Math.pow(stem_t_in, 2)) / 6.0; // in^3 per foot
  const fb_stem_psi = (M_max_lbft * 12.0) / Sx_stem;
  const Fb_stem_allow_psi = 1200.0; // Allowable masonry / concrete flexural stress

  const passOverturning = wallCondition === 'braced' ? true : (FOS_overturning >= 1.5);
  const passSliding = FOS_sliding >= 1.5;
  const passStemBending = fb_stem_psi <= Fb_stem_allow_psi;
  const passBraceAnchor = wallCondition === 'braced' ? (T_brace_anchor_lb <= 3500.0) : true; // Simpson / Hold-down anchor limit

  const isPass = passOverturning && passSliding && passStemBending && passBraceAnchor;

  return {
    wallCondition,
    H_ft,
    gamma_pcf,
    phi_deg,
    surcharge_psf,
    Ka,
    K0,
    K_design,
    q_soil_bottom_psf,
    P_total_lateral_lb,
    R_top_lbft,
    R_base_lbft,
    braceSpacingInches,
    T_brace_anchor_lb,
    M_ot_lbft,
    M_max_lbft,
    M_resisting_lbft,
    W_total_vertical_lb,
    FOS_overturning,
    FOS_sliding,
    fb_stem_psi,
    Fb_stem_allow_psi,
    passOverturning,
    passSliding,
    passStemBending,
    passBraceAnchor,
    isPass
  };
}
