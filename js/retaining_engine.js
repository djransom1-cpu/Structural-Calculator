/**
 * Retaining Wall & Basement Soil Pressure Engine
 * Rankine Lateral Earth Pressure Analysis
 * Overturning & Sliding Factors of Safety (FOS)
 */

export function analyzeRetainingWall(inputs) {
  const H_ft = inputs.wall_height_ft || 10.0; // Wall height (ft)
  const gamma_pcf = inputs.soil_density_pcf || 120.0; // Soil unit weight (pcf)
  const phi_deg = inputs.friction_angle_deg || 30.0; // Soil internal friction angle (degrees)
  const surcharge_psf = inputs.surcharge_psf || 0; // Uniform surcharge load on soil surface (psf)
  const mu = inputs.base_friction_coeff || 0.40; // Friction coefficient at base

  // Wall Footing Dimensions
  const B_base_ft = inputs.base_width_ft || 6.5; // Base footing width (ft)
  const stem_t_in = inputs.stem_thickness_in || 12.0; // Stem thickness (in)
  const toe_ft = inputs.toe_length_ft || 1.5; // Toe projection (ft)
  const heel_ft = B_base_ft - toe_ft - (stem_t_in / 12); // Heel projection (ft)

  // Rankine Active Earth Pressure Coefficient Ka = (1 - sin phi) / (1 + sin phi)
  const phi_rad = (phi_deg * Math.PI) / 180;
  const Ka = (1 - Math.sin(phi_rad)) / (1 + Math.sin(phi_rad));

  // Active Earth Pressure at Base q_active (psf)
  const q_soil_bottom_psf = Ka * gamma_pcf * H_ft;
  const q_surcharge_psf = Ka * surcharge_psf;

  // Lateral Force Resultant P_active (lbs per linear foot of wall)
  // P_soil = 0.5 * Ka * gamma * H^2
  // P_surcharge = Ka * q_surcharge * H
  const P_soil_lb = 0.5 * Ka * gamma_pcf * Math.pow(H_ft, 2);
  const P_surcharge_lb = q_surcharge_psf * H_ft;
  const P_total_lateral_lb = P_soil_lb + P_surcharge_lb;

  // Overturning Moment M_overturning (lb-ft per ft of wall)
  // Lever arms: H/3 for triangular soil load, H/2 for rectangular surcharge
  const M_ot_lbft = P_soil_lb * (H_ft / 3) + P_surcharge_lb * (H_ft / 2);

  // Resisting Vertical Weight & Resisting Moment (lb-ft per ft of wall)
  // Stem weight + Footing weight + Soil weight over heel
  const conc_density_pcf = 150;
  const W_stem_lb = (stem_t_in / 12) * H_ft * conc_density_pcf;
  const W_base_lb = B_base_ft * (stem_t_in / 12) * conc_density_pcf; // Assume base thickness = stem thickness
  const W_soil_heel_lb = Math.max(heel_ft, 0) * H_ft * gamma_pcf;
  const W_total_vertical_lb = W_stem_lb + W_base_lb + W_soil_heel_lb;

  // Lever arms from toe:
  const arm_stem = toe_ft + (stem_t_in / 24);
  const arm_base = B_base_ft / 2;
  const arm_soil = toe_ft + (stem_t_in / 12) + (heel_ft / 2);

  const M_resisting_lbft = (W_stem_lb * arm_stem) + (W_base_lb * arm_base) + (W_soil_heel_lb * arm_soil);

  // Factors of Safety
  const FOS_overturning = M_ot_lbft > 0 ? M_resisting_lbft / M_ot_lbft : 999;
  const F_sliding_resisting_lb = mu * W_total_vertical_lb;
  const FOS_sliding = P_total_lateral_lb > 0 ? F_sliding_resisting_lb / P_total_lateral_lb : 999;

  // Soil Pressure under Footing Resultant Location e = B/2 - (M_res - M_ot)/W_total
  const x_bar_ft = (M_resisting_lbft - M_ot_lbft) / W_total_vertical_lb;
  const eccentricity_ft = (B_base_ft / 2) - x_bar_ft;

  const passOverturning = FOS_overturning >= 1.5;
  const passSliding = FOS_sliding >= 1.5;
  const isPass = passOverturning && passSliding;

  return {
    Ka,
    q_soil_bottom_psf,
    P_total_lateral_lb,
    M_ot_lbft,
    M_resisting_lbft,
    W_total_vertical_lb,
    FOS_overturning,
    FOS_sliding,
    eccentricity_ft,
    passOverturning,
    passSliding,
    isPass
  };
}
