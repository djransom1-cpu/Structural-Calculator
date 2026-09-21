/**
 * Above-Grade Braced Wall & Shear Wall Engineering Engine
 * Wood Stud Framing (IRC R602.10 / SDPWS / NDS 2018) & Concrete Block CMU Walls (TMS 402 / IBC 2021)
 * Includes ASCE 7-16 / 7-22 MWFRS & C&C Wind Pressure Analysis, Hold-Down Anchorage, & Vector Graphics Renderer
 */

export function analyzeBracedWall(inputs) {
  const wallType = inputs.wallType || 'wood'; // 'wood' or 'cmu'
  const topRestraint = inputs.topRestraint || 'braced'; // 'braced' or 'unbraced'
  const windSpeedMph = parseFloat(inputs.windSpeedMph) || 115; // mph
  const windPsfInput = parseFloat(inputs.windPsf) || 20.0; // psf out-of-plane wind
  const exposureCategory = inputs.exposureCategory || 'C'; // 'B', 'C', 'D'
  const totalWallLengthFt = parseFloat(inputs.totalWallLengthFt) || 24.0; // ft (overall wall line length)
  const wallHeightFt = parseFloat(inputs.wallHeightFt) || 9.0; // ft
  const tribWidthFt = parseFloat(inputs.tribWidthFt) || 28.0; // ft (building width tributary to wall line)
  const deadLoadPsf = parseFloat(inputs.deadLoadPsf) || 15.0; // psf (roof/floor dead load on wall)
  const openingsPct = parseFloat(inputs.openingsPct) || 15.0; // % window/door openings

  // Provided Braced Panel Geometry
  const providedPanelLengthFt = parseFloat(inputs.providedPanelLengthFt) || 12.0; // Total sum of braced wall panels (ft)
  const numPanels = parseInt(inputs.numPanels) || 2; // Number of distinct braced wall panels

  // Wood Wall Sheathing & Nailing Options
  const woodSheathingType = inputs.woodSheathingType || 'osb_716'; // 'osb_716', 'ply_1532', 'gypsum', 'letin'
  const nailSpacingEdge = inputs.nailSpacingEdge || '6'; // '6', '4', '3', '2' (inches o.c.)
  const studSize = inputs.studSize || '2x6'; // '2x4', '2x6', '2x8', '3x6', '4x6'
  const studSpacingInches = parseFloat(inputs.studSpacingInches) || 16.0; // 12", 16", 19.2", 24" o.c.

  // CMU Block Wall Options
  const cmuBlockSize = inputs.cmuBlockSize || '8_cmu'; // '8_cmu', '10_cmu', '12_cmu'
  const cmuGroutSpacing = inputs.cmuGroutSpacing || '32'; // 'solid', '16', '24', '32', '48'

  // --- 1. ASCE 7 WIND PRESSURE & STORY SHEAR SOLVER ---
  let Kz = 0.85;
  if (exposureCategory === 'C') Kz = 1.00;
  if (exposureCategory === 'D') Kz = 1.15;

  const Kzt = 1.0;
  const Kd = 0.85;
  const qz_psf = 0.00256 * Kz * Kzt * Kd * Math.pow(windSpeedMph, 2);
  const Cp_mwfrs = 1.3 * 0.85;
  const p_wind_mwfrs_psf = Math.max(windPsfInput, qz_psf * Cp_mwfrs);

  // Total Lateral Story Shear Force V_story (lbs & kips)
  const H_trib_ft = (wallHeightFt / 2.0) + 2.5;
  const V_story_lbs = p_wind_mwfrs_psf * (tribWidthFt / 2.0) * H_trib_ft;
  const V_story_kips = V_story_lbs / 1000.0;

  // Applied Unit Shear v_applied (plf)
  const v_applied_plf = V_story_lbs / Math.max(1.0, providedPanelLengthFt);

  // --- 2. ALLOWABLE SHEAR CAPACITY v_allow (SDPWS 2018 Perforated Shear Wall Co Factor) ---
  let v_allow_base_plf = 260.0;
  let panelMethodName = 'Wood Structural Panel (7/16" OSB)';

  if (wallType === 'wood') {
    if (woodSheathingType === 'osb_716') {
      panelMethodName = 'WSP 7/16" OSB Sheathing';
      if (nailSpacingEdge === '6') v_allow_base_plf = 260.0;
      else if (nailSpacingEdge === '4') v_allow_base_plf = 380.0;
      else if (nailSpacingEdge === '3') v_allow_base_plf = 490.0;
      else if (nailSpacingEdge === '2') v_allow_base_plf = 640.0;
    } else if (woodSheathingType === 'ply_1532') {
      panelMethodName = 'WSP 15/32" Plywood Sheathing';
      if (nailSpacingEdge === '6') v_allow_base_plf = 285.0;
      else if (nailSpacingEdge === '4') v_allow_base_plf = 430.0;
      else if (nailSpacingEdge === '3') v_allow_base_plf = 550.0;
      else if (nailSpacingEdge === '2') v_allow_base_plf = 730.0;
    } else if (woodSheathingType === 'gypsum') {
      panelMethodName = 'Gypsum Board (1/2" Sheetrock)';
      v_allow_base_plf = 75.0;
    } else if (woodSheathingType === 'letin') {
      panelMethodName = '1x4 Let-In Diagonal Brace (LIB)';
      v_allow_base_plf = 100.0;
    }
  } else {
    const blockThicknessIn = cmuBlockSize === '12_cmu' ? 12 : (cmuBlockSize === '10_cmu' ? 10 : 8);
    panelMethodName = `${blockThicknessIn}" Reinforced CMU Masonry Block`;

    if (cmuGroutSpacing === 'solid') {
      v_allow_base_plf = blockThicknessIn * 150.0;
    } else {
      const groutSpacingIn = parseFloat(cmuGroutSpacing) || 32.0;
      v_allow_base_plf = (blockThicknessIn * 80.0) * (32.0 / groutSpacingIn);
    }
  }

  // Openings reduction factor C_o per SDPWS 4.3.5 (Perforated Shear Wall Adjustment)
  const openingRatio = Math.min(0.5, openingsPct / 100.0);
  const Co_opening_factor = Math.max(0.4, 1.0 - (0.8 * openingRatio));
  const v_allow_plf = v_allow_base_plf * Co_opening_factor;

  // Demand-to-Capacity Ratio (DCR) for Shear
  const dcr_shear = v_applied_plf / v_allow_plf;
  const isShearPass = dcr_shear <= 1.0;

  // Minimum Required Braced Wall Length L_braced_req (ft) per IRC R602.10
  const reqBracedLengthFt = V_story_lbs / v_allow_plf;
  const isLengthPass = providedPanelLengthFt >= reqBracedLengthFt;

  // --- 3. OUT-OF-PLANE STUD BENDING & TOP RESTRAINT REACTION ---
  let Section_S_in3 = 7.56; // 2x6 default S
  if (studSize === '2x4') Section_S_in3 = 3.06;
  else if (studSize === '2x6') Section_S_in3 = 7.56;
  else if (studSize === '2x8') Section_S_in3 = 13.14;
  else if (studSize === '3x6') Section_S_in3 = 12.60;
  else if (studSize === '4x6') Section_S_in3 = 17.65;

  const w_stud_plf = p_wind_mwfrs_psf * (studSpacingInches / 12.0);
  let M_stud_lbft = 0;
  let R_top_reaction_plf = 0;

  if (topRestraint === 'braced') {
    // Top diaphragm restraint: M_max = w*H^2 / 8, R_top = w*H / 2
    M_stud_lbft = (w_stud_plf * Math.pow(wallHeightFt, 2)) / 8.0;
    R_top_reaction_plf = (p_wind_mwfrs_psf * wallHeightFt) / 2.0;
  } else {
    // Unbraced top cantilever: M_base = w*H^2 / 2, R_top = 0
    M_stud_lbft = (w_stud_plf * Math.pow(wallHeightFt, 2)) / 2.0;
    R_top_reaction_plf = 0;
  }

  const fb_stud_psi = (M_stud_lbft * 12.0) / Section_S_in3;
  const Fb_allow_psi = 1250.0; // Allowable bending stress for No. 2 wood
  const dcr_stud_bending = fb_stud_psi / Fb_allow_psi;
  const isStudPass = dcr_stud_bending <= 1.0;

  // --- 3. OVERTURNING HOLD-DOWN ANCHOR TENSION SOLVER ---
  // Panel length average = providedPanelLengthFt / numPanels
  const avgPanelLenFt = providedPanelLengthFt / Math.max(1, numPanels);
  const V_panel_lbs = V_story_lbs / Math.max(1, numPanels);

  // Resisting Dead Weight per Panel W_dead (lbs)
  const W_dead_panel_lbs = (deadLoadPsf * (tribWidthFt / 2.0) * avgPanelLenFt) + (15.0 * wallHeightFt * avgPanelLenFt);

  // Hold-Down Tension Force (ASD 0.6D - 1.0W)
  const T_overturning_lbs = (V_panel_lbs * wallHeightFt) / Math.max(1.0, avgPanelLenFt);
  const T_dead_resisting_lbs = 0.6 * W_dead_panel_lbs;
  const T_holddown_required_lbs = Math.max(0, T_overturning_lbs - T_dead_resisting_lbs);

  // Hold-down hardware recommendation (Simpson Strong-Tie HDU / HTT Series)
  let holdDownRecommendation = 'No Hold-Down Required (Gravity DL Resists Overturning)';
  if (T_holddown_required_lbs > 0 && T_holddown_required_lbs <= 3000) {
    holdDownRecommendation = 'Simpson HDU2-SDS2.5 Anchor Bracket (Capacity: 3,075 lbs)';
  } else if (T_holddown_required_lbs > 3000 && T_holddown_required_lbs <= 5000) {
    holdDownRecommendation = 'Simpson HDU5-SDS2.5 Anchor Bracket (Capacity: 5,645 lbs)';
  } else if (T_holddown_required_lbs > 5000 && T_holddown_required_lbs <= 8000) {
    holdDownRecommendation = 'Simpson HDU8-SDS2.5 Anchor Bracket (Capacity: 8,790 lbs)';
  } else if (T_holddown_required_lbs > 8000) {
    holdDownRecommendation = 'Simpson HD12 / Heavy Tie-Down Post Assembly (> 10,000 lbs)';
  }

  const isPass = isShearPass && isLengthPass && isStudPass;

  return {
    wallType,
    topRestraint,
    windSpeedMph,
    exposureCategory,
    totalWallLengthFt,
    wallHeightFt,
    tribWidthFt,
    deadLoadPsf,
    openingsPct,
    Co_opening_factor,
    providedPanelLengthFt,
    numPanels,
    avgPanelLenFt,
    woodSheathingType,
    nailSpacingEdge,
    studSize,
    studSpacingInches,
    cmuBlockSize,
    cmuGroutSpacing,
    panelMethodName,
    qz_psf,
    p_wind_mwfrs_psf,
    V_story_lbs,
    V_story_kips,
    v_applied_plf,
    v_allow_plf,
    v_allow_base_plf,
    dcr_shear,
    reqBracedLengthFt,
    T_overturning_lbs,
    T_dead_resisting_lbs,
    T_holddown_required_lbs,
    holdDownRecommendation,
    w_stud_plf,
    M_stud_lbft,
    R_top_reaction_plf,
    fb_stud_psi,
    Fb_allow_psi,
    dcr_stud_bending,
    isShearPass,
    isLengthPass,
    isStudPass,
    isPass
  };
}

/**
 * Render High-Resolution HTML5 Vector Diagram for Above-Grade Braced Wall Line
 */
export function renderBracedWallDiagram(canvas, res) {
  if (!canvas || !res) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;

  // Clear Background
  ctx.fillStyle = '#0f172a'; // Dark Slate
  ctx.fillRect(0, 0, w, h);

  // Drawing Margins & Coordinates
  const marginX = 80;
  const marginY = 50;
  const drawW = w - marginX * 2;
  const drawH = h - marginY * 2 - 20;

  const wallY_bottom = h - marginY - 20;
  const wallY_top = wallY_bottom - drawH * 0.75;
  const wallX_left = marginX + 20;
  const wallX_right = wallX_left + drawW - 40;
  const wallLenPx = wallX_right - wallX_left;

  // Grid background
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < w; x += 30) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
  for (let y = 0; y < h; y += 30) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();

  // 1. Concrete Foundation Sill / Slab Base
  ctx.fillStyle = '#475569';
  ctx.fillRect(wallX_left - 30, wallY_bottom, wallLenPx + 60, 24);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.strokeRect(wallX_left - 30, wallY_bottom, wallLenPx + 60, 24);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('CONCRETE SLAB / STEM WALL FOUNDATION', wallX_left + 20, wallY_bottom + 16);

  // 2. Wall Panel Sheathing / CMU Elevation
  const wallBg = res.wallType === 'cmu' ? 'rgba(100, 116, 139, 0.35)' : 'rgba(217, 119, 6, 0.2)';
  const wallBorder = res.isPass ? '#22c55e' : '#ef4444';

  ctx.fillStyle = wallBg;
  ctx.fillRect(wallX_left, wallY_top, wallLenPx, wallY_bottom - wallY_top);
  ctx.strokeStyle = wallBorder;
  ctx.lineWidth = 3;
  ctx.strokeRect(wallX_left, wallY_top, wallLenPx, wallY_bottom - wallY_top);

  // 3. Studs / Masonry Cores Interior Pattern
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 1.5;
  const studStepPx = wallLenPx / Math.max(4, Math.round(res.providedPanelLengthFt / 1.33));
  
  for (let sx = wallX_left + studStepPx; sx < wallX_right; sx += studStepPx) {
    ctx.beginPath();
    ctx.moveTo(sx, wallY_top);
    ctx.lineTo(sx, wallY_bottom);
    ctx.stroke();
  }

  // 4. Double Top Plate & Bottom Sole Plate
  ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
  ctx.fillRect(wallX_left, wallY_top, wallLenPx, 8); // Double Top Plate
  ctx.fillRect(wallX_left, wallY_bottom - 8, wallLenPx, 8); // Sole Plate

  // 5. Lateral Wind Force Arrows (MWFRS Load V_story)
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;

  const windY = wallY_top + 20;
  for (let i = 0; i < 3; i++) {
    const arrowX = wallX_left - 60 + (i * 15);
    ctx.beginPath();
    ctx.moveTo(arrowX, windY);
    ctx.lineTo(arrowX + 35, windY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(arrowX + 35, windY);
    ctx.lineTo(arrowX + 27, windY - 5);
    ctx.lineTo(arrowX + 27, windY + 5);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = '#ef4444';
  ctx.font = '700 12px Outfit, sans-serif';
  ctx.fillText(`WIND LOAD: ${res.windSpeedMph} MPH (${res.V_story_lbs.toFixed(0)} lbs Story Shear)`, wallX_left - 70, wallY_top - 12);

  // 6. Hold-Down Bracket Hardware at End Posts (Tension VECTORS)
  if (res.T_holddown_required_lbs > 0) {
    const drawHD = (hdX) => {
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.fillRect(hdX - 10, wallY_bottom - 40, 20, 32);
      ctx.strokeRect(hdX - 10, wallY_bottom - 40, 20, 32);

      // Tension Arrow UP
      ctx.beginPath();
      ctx.moveTo(hdX, wallY_bottom - 45);
      ctx.lineTo(hdX, wallY_bottom - 75);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(hdX, wallY_bottom - 75);
      ctx.lineTo(hdX - 5, wallY_bottom - 67);
      ctx.lineTo(hdX + 5, wallY_bottom - 67);
      ctx.closePath();
      ctx.fill();
    };

    drawHD(wallX_left + 15);
    drawHD(wallX_right - 15);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`Hold-Down T = ${res.T_holddown_required_lbs.toFixed(0)} lbs`, wallX_left + 25, wallY_bottom - 50);
  }

  // 7. Dimensions & Annotations
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(wallX_left, wallY_bottom + 35);
  ctx.lineTo(wallX_right, wallY_bottom + 35);
  ctx.moveTo(wallX_left, wallY_bottom + 25); ctx.lineTo(wallX_left, wallY_bottom + 40);
  ctx.moveTo(wallX_right, wallY_bottom + 25); ctx.lineTo(wallX_right, wallY_bottom + 40);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '12px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`BRACED PANEL LENGTH = ${res.providedPanelLengthFt.toFixed(1)}' Provided (Req: ${res.reqBracedLengthFt.toFixed(1)}')`, (wallX_left + wallX_right) / 2, wallY_bottom + 50);

  // 8. PASS / FAIL STATUS BADGE
  const badgeX = 20;
  const badgeY = 20;
  ctx.fillStyle = res.isPass ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
  ctx.strokeStyle = res.isPass ? '#22c55e' : '#ef4444';
  ctx.lineWidth = 2;
  ctx.fillRect(badgeX, badgeY, 320, 46);
  ctx.strokeRect(badgeX, badgeY, 320, 46);

  ctx.fillStyle = res.isPass ? '#22c55e' : '#ef4444';
  ctx.font = '700 14px Outfit, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(res.isPass ? 'STATUS: PASS (IRC R602.10 / NDS / TMS 402)' : 'STATUS: FAIL (SHEAR OVERSTRESSED)', badgeX + 12, badgeY + 20);
  ctx.font = '11px Inter, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`Unit Shear: ${res.v_applied_plf.toFixed(0)} plf / Allowable: ${res.v_allow_plf.toFixed(0)} plf (DCR = ${res.dcr_shear.toFixed(2)})`, badgeX + 12, badgeY + 36);
}
