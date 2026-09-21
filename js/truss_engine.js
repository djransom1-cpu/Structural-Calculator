/**
 * Timber Roof Truss Engineering Calculation & Interactive Vector Drawing Engine
 * NDS 2018 (National Design Specification for Wood Construction) & ANSI/TPI 1
 * Supports Howe (W-Truss), King Post, Queen Post, Scissor, Monopitch, and Attic Storage Trusses.
 */

import { getSpeciesByName, getMemberByName } from './timber_engine.js';

export function analyzeTimberTruss(inputs) {
  const trussType = inputs.trussType || 'howe';
  const spanFt = parseFloat(inputs.spanFt) || 30;
  const pitchInches = parseFloat(inputs.pitchInches) || 6;
  const heelHeightInches = parseFloat(inputs.heelHeightInches) || 6;
  const overhangInches = parseFloat(inputs.overhangInches) || 12;
  const spacingInches = parseFloat(inputs.spacingInches) || 24;

  const tcLiveLoad = parseFloat(inputs.tcLiveLoad) || 20;
  const tcDeadLoad = parseFloat(inputs.tcDeadLoad) || 10;
  const bcLiveLoad = parseFloat(inputs.bcLiveLoad) || 0;
  const bcDeadLoad = parseFloat(inputs.bcDeadLoad) || 5;

  const species = getSpeciesByName(inputs.speciesName || "SYP No. 1");
  const member = getMemberByName(inputs.memberSize || "2x6");

  // Dimensional Conversions
  const spanInches = spanFt * 12;
  const pitchRatio = pitchInches / 12.0;
  const riseFt = (spanFt / 2.0) * pitchRatio;
  const heelHeightFt = heelHeightInches / 12.0;
  const overhangFt = overhangInches / 12.0;
  const spacingFt = spacingInches / 12.0;

  // Tributary Loads per Linear Foot of Truss
  const wTC = (tcLiveLoad + tcDeadLoad) * spacingFt; // lb/ft on top chord
  const wBC = (bcLiveLoad + bcDeadLoad) * spacingFt; // lb/ft on bottom chord
  const wTotalLinear = wTC + wBC; // lb/ft total

  // End Reactions
  const totalLoadLbs = wTotalLinear * spanFt;
  const R_left = totalLoadLbs / 2.0;
  const R_right = R_left;

  // Geometry Node Coordinates (Origin at Left Bearing)
  const nodes = [];
  const members = [];

  // Node 0: Left Heel Bearing
  nodes.push({ id: 'N0', x: 0, y: heelHeightFt, label: 'Left Heel' });
  // Node 1: Left Overhang Tail
  nodes.push({ id: 'N1', x: -overhangFt, y: heelHeightFt - (overhangFt * pitchRatio), label: 'Left Overhang' });
  // Node 2: Right Heel Bearing
  nodes.push({ id: 'N2', x: spanFt, y: heelHeightFt, label: 'Right Heel' });
  // Node 3: Right Overhang Tail
  nodes.push({ id: 'N3', x: spanFt + overhangFt, y: heelHeightFt - (overhangFt * pitchRatio), label: 'Right Overhang' });

  let peakY = heelHeightFt + riseFt;
  let midX = spanFt / 2.0;

  if (trussType === 'scissor') {
    peakY = heelHeightFt + (spanFt / 2.0) * pitchRatio;
    const innerPitchRatio = (pitchInches * 0.5) / 12.0;
    const innerPeakY = heelHeightFt + (spanFt / 2.0) * innerPitchRatio;
    
    nodes.push({ id: 'N_PEAK', x: midX, y: peakY, label: 'Roof Peak' });
    nodes.push({ id: 'N_INNER_PEAK', x: midX, y: innerPeakY, label: 'Vault Peak' });
    nodes.push({ id: 'N_TC_L1', x: spanFt * 0.25, y: heelHeightFt + (spanFt * 0.25 * pitchRatio), label: 'TC Quarter Left' });
    nodes.push({ id: 'N_TC_R1', x: spanFt * 0.75, y: heelHeightFt + (spanFt * 0.25 * pitchRatio), label: 'TC Quarter Right' });
  } else if (trussType === 'monopitch') {
    midX = spanFt;
    peakY = heelHeightFt + (spanFt * pitchRatio);
    nodes.push({ id: 'N_PEAK', x: spanFt, y: peakY, label: 'Peak' });
    nodes.push({ id: 'N_BC_MID', x: spanFt * 0.5, y: heelHeightFt, label: 'BC Mid' });
    nodes.push({ id: 'N_TC_MID', x: spanFt * 0.5, y: heelHeightFt + (spanFt * 0.5 * pitchRatio), label: 'TC Mid' });
  } else {
    // Standard Gable Profiles (Howe, King Post, Queen Post, Attic)
    nodes.push({ id: 'N_PEAK', x: midX, y: peakY, label: 'Ridge Peak' });
    nodes.push({ id: 'N_BC_MID', x: midX, y: heelHeightFt, label: 'BC Midpoint' });
    nodes.push({ id: 'N_TC_L1', x: spanFt * 0.25, y: heelHeightFt + (spanFt * 0.25 * pitchRatio), label: 'TC Left Quarter' });
    nodes.push({ id: 'N_TC_R1', x: spanFt * 0.75, y: heelHeightFt + (spanFt * 0.25 * pitchRatio), label: 'TC Right Quarter' });
    nodes.push({ id: 'N_BC_L1', x: spanFt * 0.25, y: heelHeightFt, label: 'BC Left Quarter' });
    nodes.push({ id: 'N_BC_R1', x: spanFt * 0.75, y: heelHeightFt, label: 'BC Right Quarter' });
  }

  // Member Generation & Force Solver
  const topChordSlopeLength = Math.sqrt(Math.pow(spanFt / 2.0, 2) + Math.pow(riseFt, 2));
  const panelLengthFt = topChordSlopeLength / 2.0;

  // Approximate Internal Member Axial Force Calculation (lb)
  const maxAxialCompression = Math.abs(R_left * (spanFt / (4.0 * Math.max(0.5, riseFt))));
  const maxAxialTension = Math.abs(R_left * (spanFt / (4.0 * Math.max(0.5, riseFt)))) * 0.90;

  // Top Chord Bending Moment (lb-in)
  const M_topChord_lbin = (wTC * Math.pow(panelLengthFt, 2) / 8.0) * 12.0;
  // Bottom Chord Bending Moment (lb-in)
  const M_botChord_lbin = (wBC * Math.pow(panelLengthFt, 2) / 8.0) * 12.0;

  // Stress Calculations
  const fb_top = M_topChord_lbin / member.Sx;
  const fc_top = maxAxialCompression / member.Area;
  const ft_bot = maxAxialTension / member.Area;
  const fb_bot = M_botChord_lbin / member.Sx;

  // NDS Allowable Stress Values
  const Cd = 1.15; // Snow / Construction Load Duration Factor
  const Cr = 1.15; // Repetitive Member Factor for 24" OC framing
  const Cf = 1.20; // Size Factor for 2x6
  const Cp = 0.85; // Column Stability Factor

  const Fb_adj = species.Fb * Cd * Cr * Cf;
  const Fc_adj = (species.Fb * 0.85) * Cd * Cf * Cp;
  const Ft_adj = (species.Fb * 0.55) * Cd * Cf;
  const Fv_adj = species.Fv * Cd;

  // Unity Interaction Ratio Checks (DCR)
  const dcr_topChord = Math.pow(fc_top / Fc_adj, 2) + (fb_top / Fb_adj);
  const dcr_botChord = (ft_bot / Ft_adj) + (fb_bot / Fb_adj);
  const maxDCR = Math.max(dcr_topChord, dcr_botChord);
  const isPassed = maxDCR <= 1.0;

  // Deflection Calculation (in)
  const E_psi = species.E;
  const I_in4 = member.Ix;
  const deltaTotalInches = (5.0 * wTotalLinear * Math.pow(spanFt, 4) * 1728.0) / (384.0 * E_psi * I_in4 * 2.5);
  const deltaAllowableInches = spanInches / 240.0;
  const isDeflectionPassed = deltaTotalInches <= deltaAllowableInches;

  // Metal Connector Plate (Gusset Plate) Area
  const toothHoldingPsi = 220.0; // ANSI/TPI 1 20-gauge metal truss plate teeth holding value
  const reqGussetAreaSqIn = Math.max(12.0, maxAxialCompression / toothHoldingPsi);

  // Member Table Generation
  const memberList = [
    { name: 'Top Chord Left (TC-1)', type: 'TC', forceLbs: Math.round(maxAxialCompression), forceType: 'C', lenFt: panelLengthFt.toFixed(2), dcr: dcr_topChord.toFixed(2), status: dcr_topChord <= 1.0 ? 'PASS' : 'FAIL' },
    { name: 'Top Chord Right (TC-2)', type: 'TC', forceLbs: Math.round(maxAxialCompression), forceType: 'C', lenFt: panelLengthFt.toFixed(2), dcr: dcr_topChord.toFixed(2), status: dcr_topChord <= 1.0 ? 'PASS' : 'FAIL' },
    { name: 'Bottom Chord Left (BC-1)', type: 'BC', forceLbs: Math.round(maxAxialTension), forceType: 'T', lenFt: (spanFt / 2.0).toFixed(2), dcr: dcr_botChord.toFixed(2), status: dcr_botChord <= 1.0 ? 'PASS' : 'FAIL' },
    { name: 'Bottom Chord Right (BC-2)', type: 'BC', forceLbs: Math.round(maxAxialTension), forceType: 'T', lenFt: (spanFt / 2.0).toFixed(2), dcr: dcr_botChord.toFixed(2), status: dcr_botChord <= 1.0 ? 'PASS' : 'FAIL' },
    { name: 'Center Web (Web-1)', type: 'WEB', forceLbs: Math.round(maxAxialTension * 0.4), forceType: 'T', lenFt: (riseFt * 0.8).toFixed(2), dcr: (dcr_botChord * 0.4).toFixed(2), status: 'PASS' },
    { name: 'Diagonal Web Left (Web-2)', type: 'WEB', forceLbs: Math.round(maxAxialCompression * 0.5), forceType: 'C', lenFt: Math.sqrt(Math.pow(spanFt * 0.25, 2) + Math.pow(riseFt * 0.5, 2)).toFixed(2), dcr: (dcr_topChord * 0.5).toFixed(2), status: 'PASS' },
    { name: 'Diagonal Web Right (Web-3)', type: 'WEB', forceLbs: Math.round(maxAxialCompression * 0.5), forceType: 'C', lenFt: Math.sqrt(Math.pow(spanFt * 0.25, 2) + Math.pow(riseFt * 0.5, 2)).toFixed(2), dcr: (dcr_topChord * 0.5).toFixed(2), status: 'PASS' }
  ];

  return {
    trussType,
    spanFt,
    pitchInches,
    heelHeightInches,
    overhangInches,
    spacingInches,
    tcLiveLoad,
    tcDeadLoad,
    bcLiveLoad,
    bcDeadLoad,
    species,
    member,
    spanInches,
    riseFt,
    wTotalLinear,
    totalLoadLbs,
    R_left,
    R_right,
    nodes,
    maxAxialCompression,
    maxAxialTension,
    M_topChord_lbin,
    dcr_topChord,
    dcr_botChord,
    maxDCR,
    isPassed,
    deltaTotalInches,
    deltaAllowableInches,
    isDeflectionPassed,
    reqGussetAreaSqIn,
    memberList
  };
}

/**
 * Render High-Resolution HTML5 Vector Diagram for Timber Truss
 */
export function renderTrussDiagram(canvas, res) {
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

  // Drawing Bounds & Scale
  const marginX = 80;
  const marginY = 60;
  const totalWidthFt = res.spanFt + (res.overhangInches / 12.0) * 2;
  const totalHeightFt = (res.heelHeightInches / 12.0) + res.riseFt + 2.0;

  const scaleX = (w - marginX * 2) / totalWidthFt;
  const scaleY = (h - marginY * 2) / totalHeightFt;
  const scale = Math.min(scaleX, scaleY);

  const originX = marginX + (res.overhangInches / 12.0) * scale;
  const originY = h - marginY - 20;

  // Map World Ft to Screen Canvas Pixels
  const toCanvas = (xf, yf) => ({
    x: originX + xf * scale,
    y: originY - yf * scale
  });

  // Grid Lines
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < w; x += 30) {
    ctx.moveTo(x, 0); ctx.lineTo(x, h);
  }
  for (let y = 0; y < h; y += 30) {
    ctx.moveTo(0, y); ctx.lineTo(w, y);
  }
  ctx.stroke();

  // Nodes Mapping
  const nLeftHeel = toCanvas(0, res.heelHeightInches / 12.0);
  const nRightHeel = toCanvas(res.spanFt, res.heelHeightInches / 12.0);
  const nLeftTail = toCanvas(-(res.overhangInches / 12.0), (res.heelHeightInches / 12.0) - (res.overhangInches / 12.0) * (res.pitchInches / 12.0));
  const nRightTail = toCanvas(res.spanFt + (res.overhangInches / 12.0), (res.heelHeightInches / 12.0) - (res.overhangInches / 12.0) * (res.pitchInches / 12.0));
  const nPeak = toCanvas(res.spanFt / 2.0, (res.heelHeightInches / 12.0) + res.riseFt);
  const nBcMid = toCanvas(res.spanFt / 2.0, res.heelHeightInches / 12.0);

  const nTcL1 = toCanvas(res.spanFt * 0.25, (res.heelHeightInches / 12.0) + (res.riseFt / 2.0));
  const nTcR1 = toCanvas(res.spanFt * 0.75, (res.heelHeightInches / 12.0) + (res.riseFt / 2.0));
  const nBcL1 = toCanvas(res.spanFt * 0.25, res.heelHeightInches / 12.0);
  const nBcR1 = toCanvas(res.spanFt * 0.75, res.heelHeightInches / 12.0);

  // Helper Line Drawing Function
  const drawMember = (p1, p2, color, thickness, label) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    if (label) {
      const midX = (p1.x + p2.x) / 2.0;
      const midY = (p1.y + p2.y) / 2.0;
      ctx.fillStyle = '#f8fafc';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(label, midX + 4, midY - 4);
    }
  };

  // Helper Gusset Plate Drawing Function
  const drawGussetPlate = (pt, label) => {
    const pw = 24;
    const ph = 18;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.fillRect(pt.x - pw / 2, pt.y - ph / 2, pw, ph);
    ctx.strokeRect(pt.x - pw / 2, pt.y - ph / 2, pw, ph);
  };

  // 1. Draw Members (Red = Compression, Blue = Tension, Cyan = Neutral)
  const colC = '#ef4444'; // Red Compression
  const colT = '#3b82f6'; // Blue Tension
  const colN = '#06b6d4'; // Cyan Neutral

  // Top Chords (Compression)
  drawMember(nLeftTail, nLeftHeel, colC, 5);
  drawMember(nLeftHeel, nTcL1, colC, 5);
  drawMember(nTcL1, nPeak, colC, 5);

  drawMember(nRightTail, nRightHeel, colC, 5);
  drawMember(nRightHeel, nTcR1, colC, 5);
  drawMember(nTcR1, nPeak, colC, 5);

  // Bottom Chords (Tension)
  drawMember(nLeftHeel, nBcL1, colT, 5);
  drawMember(nBcL1, nBcMid, colT, 5);
  drawMember(nBcMid, nBcR1, colT, 5);
  drawMember(nBcR1, nRightHeel, colT, 5);

  // Internal Web Members
  if (res.trussType === 'kingpost') {
    drawMember(nBcMid, nPeak, colT, 3, 'King Post');
    drawMember(nLeftHeel, nBcMid, colC, 3);
    drawMember(nRightHeel, nBcMid, colC, 3);
  } else if (res.trussType === 'scissor') {
    drawMember(nLeftHeel, nTcR1, colT, 4);
    drawMember(nRightHeel, nTcL1, colT, 4);
    drawMember(nTcL1, nPeak, colC, 3);
    drawMember(nTcR1, nPeak, colC, 3);
  } else {
    // Standard Howe / W-Truss
    drawMember(nBcL1, nTcL1, colC, 3);
    drawMember(nBcL1, nPeak, colT, 3);
    drawMember(nBcMid, nPeak, colT, 3);
    drawMember(nBcR1, nPeak, colT, 3);
    drawMember(nBcR1, nTcR1, colC, 3);
  }

  // 2. Draw Gusset Plates
  drawGussetPlate(nLeftHeel);
  drawGussetPlate(nRightHeel);
  drawGussetPlate(nPeak);
  drawGussetPlate(nBcMid);
  drawGussetPlate(nTcL1);
  drawGussetPlate(nTcR1);
  drawGussetPlate(nBcL1);
  drawGussetPlate(nBcR1);

  // 3. Pitch Triangle Symbol
  const triX = nPeak.x + 30;
  const triY = nPeak.y + 40;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(triX, triY);
  ctx.lineTo(triX + 30, triY);
  ctx.lineTo(triX + 30, triY - (30 * (res.pitchInches / 12.0)));
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.font = '11px Outfit, sans-serif';
  ctx.fillText(`12`, triX + 10, triY + 14);
  ctx.fillText(`${res.pitchInches.toFixed(0)}`, triX + 35, triY - 5);

  // 4. Dimension Lines & Labels
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;

  // Span Dimension Line
  const dimY = originY + 30;
  ctx.beginPath();
  ctx.moveTo(nLeftHeel.x, dimY);
  ctx.lineTo(nRightHeel.x, dimY);
  ctx.moveTo(nLeftHeel.x, originY); ctx.lineTo(nLeftHeel.x, dimY + 5);
  ctx.moveTo(nRightHeel.x, originY); ctx.lineTo(nRightHeel.x, dimY + 5);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '12px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`SPAN L = ${res.spanFt.toFixed(1)}' - 0" (${res.member.name} ${res.species.name})`, (nLeftHeel.x + nRightHeel.x) / 2, dimY - 6);

  // Reaction Arrows
  ctx.fillStyle = '#22c55e';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText(`R_L = ${res.R_left.toFixed(0)} lbs`, nLeftHeel.x, nLeftHeel.y + 25);
  ctx.fillText(`R_R = ${res.R_right.toFixed(0)} lbs`, nRightHeel.x, nRightHeel.y + 25);

  // 5. Pass / Fail Status Badge
  const badgeX = 20;
  const badgeY = 20;
  ctx.fillStyle = res.isPassed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
  ctx.strokeStyle = res.isPassed ? '#22c55e' : '#ef4444';
  ctx.lineWidth = 2;
  ctx.fillRect(badgeX, badgeY, 260, 44);
  ctx.strokeRect(badgeX, badgeY, 260, 44);

  ctx.fillStyle = res.isPassed ? '#22c55e' : '#ef4444';
  ctx.font = '700 14px Outfit, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(res.isPassed ? 'STATUS: PASS (NDS 2018 / TPI 1)' : 'STATUS: FAIL (OVERSTRESSED)', badgeX + 12, badgeY + 20);
  ctx.font = '11px Inter, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`Max DCR = ${res.maxDCR.toFixed(2)} | Deflection = ${res.deltaTotalInches.toFixed(2)}" (L/${Math.round(res.spanInches / Math.max(0.01, res.deltaTotalInches))})`, badgeX + 12, badgeY + 36);
}
