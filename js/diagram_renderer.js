/**
 * Universal Visual Diagram Renderer
 * Renders real-time high-DPI engineering graphics for:
 * 1. Steel Beams (Load Elevation, Shear V(x), Moment M(x), Deflection)
 * 2. Steel Columns (Buckling Curve, Support Fixity, Axial Load Arrow)
 * 3. Concrete Footings (Footing Cross-section, Rebar Mat, Soil Pressure Block)
 * 4. Retaining Walls (Stem Wall, Footing, Triangular Soil Pressure Ka)
 * 5. Timber Framing (Joist Elevation & Deflection)
 */

export class StructuralDiagramRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = 340 * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `340px`;
    this.ctx.scale(dpr, dpr);
  }

  clear() {
    if (!this.ctx) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.ctx.clearRect(0, 0, width, height);
  }

  // 1. STEEL BEAM DIAGRAM
  renderBeamAnalysis(results) {
    if (!this.ctx || !results) return;
    this.clear();

    const w = this.canvas.clientWidth;
    const isDark = document.body.classList.contains('dark-theme');

    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const axisColor = isDark ? '#475569' : '#cbd5e1';
    const beamColor = isDark ? '#3b82f6' : '#2563eb';
    const shearColor = isDark ? '#06b6d4' : '#0284c7';
    const momentColor = isDark ? '#a855f7' : '#9333ea';
    const deflectColor = results.isPass ? (isDark ? '#22c55e' : '#16a34a') : (isDark ? '#ef4444' : '#dc2626');

    const padX = 60;
    const spanW = w - padX * 2;
    const yBeam = 60;
    const yShear = 140;
    const yMoment = 220;
    const yDeflect = 290;

    // Beam Elevation & Supports
    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = beamColor;
    this.ctx.beginPath();
    this.ctx.moveTo(padX, yBeam);
    this.ctx.lineTo(padX + spanW, yBeam);
    this.ctx.stroke();

    this.drawSupportPin(padX, yBeam, textColor);
    this.drawSupportRoller(padX + spanW, yBeam, textColor);

    if (results.w_kft > 0) {
      this.ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      this.ctx.lineWidth = 1;
      this.ctx.fillRect(padX, yBeam - 30, spanW, 30);
      this.ctx.strokeRect(padX, yBeam - 30, spanW, 30);

      const arrowCount = 8;
      for (let i = 0; i <= arrowCount; i++) {
        const ax = padX + (spanW / arrowCount) * i;
        this.drawDownArrow(ax, yBeam - 30, 25, beamColor);
      }
      this.ctx.fillStyle = beamColor;
      this.ctx.font = '11px sans-serif';
      this.ctx.fillText(`w = ${(results.w_kft * 1000).toFixed(0)} plf`, padX + spanW / 2 - 30, yBeam - 35);
    }

    if (results.P_kips > 0) {
      const px = padX + spanW / 2;
      this.drawDownArrow(px, yBeam - 45, 40, '#f59e0b', 3);
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.font = 'bold 11px sans-serif';
      this.ctx.fillText(`P = ${results.P_kips.toFixed(1)} k`, px - 25, yBeam - 50);
    }

    this.ctx.fillStyle = textColor;
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText(`L = ${results.L_ft} ft`, padX + spanW / 2 - 20, yBeam + 25);

    // Shear V(x)
    this.drawDiagramBase(padX, spanW, yShear, axisColor, `Shear V (Max: ${results.V_max_kips.toFixed(2)} kips)`, textColor);
    const maxV = Math.max(results.V_max_kips, 0.001);
    const vScale = 25 / maxV;
    
    this.ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.25)' : 'rgba(2, 132, 199, 0.2)';
    this.ctx.strokeStyle = shearColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(padX, yShear);
    this.ctx.lineTo(padX, yShear - results.V_max_kips * vScale);
    this.ctx.lineTo(padX + spanW / 2, yShear);
    this.ctx.lineTo(padX + spanW, yShear + results.V_max_kips * vScale);
    this.ctx.lineTo(padX + spanW, yShear);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Moment M(x)
    this.drawDiagramBase(padX, spanW, yMoment, axisColor, `Moment M (Max: ${results.M_max_kipft.toFixed(1)} kip-ft)`, textColor);
    const maxM = Math.max(results.M_max_kipft, 0.001);
    const mScale = 30 / maxM;

    this.ctx.fillStyle = isDark ? 'rgba(168, 85, 247, 0.25)' : 'rgba(147, 51, 234, 0.2)';
    this.ctx.strokeStyle = momentColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(padX, yMoment);
    this.ctx.quadraticCurveTo(padX + spanW / 2, yMoment + results.M_max_kipft * mScale * 1.5, padX + spanW, yMoment);
    this.ctx.lineTo(padX, yMoment);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Deflection
    this.drawDiagramBase(padX, spanW, yDeflect, axisColor, `Deflection \u03B4 (Max: ${results.delta_max_in.toFixed(3)}" vs Limit: ${results.L240_in.toFixed(3)}")`, textColor);
    this.ctx.strokeStyle = deflectColor;
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.moveTo(padX, yDeflect);
    this.ctx.quadraticCurveTo(padX + spanW / 2, yDeflect + 22, padX + spanW, yDeflect);
    this.ctx.stroke();
  }

  // 2. STEEL COLUMN BUCKLING DIAGRAM
  renderColumnAnalysis(results) {
    if (!this.ctx || !results) return;
    this.clear();

    const w = this.canvas.clientWidth;
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const colColor = isDark ? '#3b82f6' : '#2563eb';
    const buckleColor = results.isPass ? (isDark ? '#22c55e' : '#16a34a') : (isDark ? '#ef4444' : '#dc2626');

    const cx = w / 2;
    const yTop = 50;
    const yBot = 280;
    const colH = yBot - yTop;

    // Column Base Supports
    this.drawSupportPin(cx, yBot, textColor);
    this.drawSupportPin(cx, yTop, textColor);

    // Straight Unbuckled Centerline
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([4, 4]);
    this.ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, yTop);
    this.ctx.lineTo(cx, yBot);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Buckled Curve
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = buckleColor;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, yTop);
    this.ctx.quadraticCurveTo(cx + 35, yTop + colH / 2, cx, yBot);
    this.ctx.stroke();

    // Axial Load Arrow Top
    this.drawDownArrow(cx, yTop - 35, 30, '#ef4444', 3);
    this.ctx.fillStyle = textColor;
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.fillText(`P_axial = ${results.P_applied} kips`, cx + 15, yTop - 15);
    this.ctx.fillText(`Allowable: ${results.P_allowable_kips.toFixed(1)} kips`, cx + 15, yTop + 5);

    this.ctx.font = '11px sans-serif';
    this.ctx.fillText(`Slenderness KL/r = ${results.KLr_max.toFixed(1)}`, cx - 120, yTop + colH / 2);
    this.ctx.fillText(`Euler Buckling P_cr = ${results.P_cr_kips.toFixed(1)} kips`, cx - 140, yTop + colH / 2 + 18);
  }

  // 3. CONCRETE FOOTING DIAGRAM
  renderFootingAnalysis(results) {
    if (!this.ctx || !results) return;
    this.clear();

    const w = this.canvas.clientWidth;
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const concBg = isDark ? '#334155' : '#cbd5e1';
    const soilBg = isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.15)';

    const cx = w / 2;
    const yFootingTop = 150;
    const footingW = 220;
    const footingH = 60;
    const colW = 50;
    const colH = 60;

    // Soil Block underneath
    this.ctx.fillStyle = soilBg;
    this.ctx.fillRect(cx - footingW / 2 - 20, yFootingTop + footingH, footingW + 40, 50);

    // Footing Slab
    this.ctx.fillStyle = concBg;
    this.ctx.strokeStyle = isDark ? '#64748b' : '#475569';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(cx - footingW / 2, yFootingTop, footingW, footingH);
    this.ctx.strokeRect(cx - footingW / 2, yFootingTop, footingW, footingH);

    // Column Stem
    this.ctx.fillRect(cx - colW / 2, yFootingTop - colH, colW, colH);
    this.ctx.strokeRect(cx - colW / 2, yFootingTop - colH, colW, colH);

    // Axial Load Arrow
    this.drawDownArrow(cx, yFootingTop - colH - 30, 25, '#ef4444', 3);

    // Rebar Mat Dots inside Footing
    this.ctx.fillStyle = '#ef4444';
    const rebarY = yFootingTop + footingH - 15;
    for (let rx = cx - footingW / 2 + 20; rx <= cx + footingW / 2 - 20; rx += 25) {
      this.ctx.beginPath();
      this.ctx.arc(rx, rebarY, 4, 0, 2 * Math.PI);
      this.ctx.fill();
    }

    // Text Annotations
    this.ctx.fillStyle = textColor;
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText(`Service Soil Pressure: ${results.q_service_ksf.toFixed(2)} ksf`, cx - 90, yFootingTop + footingH + 30);
    this.ctx.fillText(`Allowable Capacity: ${results.q_allowable_ksf} ksf`, cx - 80, yFootingTop + footingH + 46);
    this.ctx.fillText(`Flexural Steel: ${results.rebarRecommendation}`, cx - 110, yFootingTop + footingH / 2 + 4);
  }

  // 4. RETAINING WALL DIAGRAM
  renderRetainingAnalysis(results) {
    if (!this.ctx || !results) return;
    this.clear();

    const w = this.canvas.clientWidth;
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const wallBg = isDark ? '#334155' : '#94a3b8';
    const soilBg = isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(217, 119, 6, 0.2)';

    const wallX = 140;
    const yTop = 50;
    const yBase = 220;
    const stemT = 25;
    const baseW = 140;
    const baseH = 30;

    // Soil Wedge behind wall
    this.ctx.fillStyle = soilBg;
    this.ctx.beginPath();
    this.ctx.moveTo(wallX + stemT, yTop);
    this.ctx.lineTo(w - 60, yTop);
    this.ctx.lineTo(w - 60, yBase);
    this.ctx.lineTo(wallX + stemT, yBase);
    this.ctx.closePath();
    this.ctx.fill();

    // Triangular Pressure Distribution Vector
    this.ctx.strokeStyle = '#ef4444';
    this.ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    this.ctx.beginPath();
    this.ctx.moveTo(wallX + stemT, yTop);
    this.ctx.lineTo(wallX + stemT + 70, yBase);
    this.ctx.lineTo(wallX + stemT, yBase);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Wall Stem & Base
    this.ctx.fillStyle = wallBg;
    this.ctx.strokeStyle = isDark ? '#64748b' : '#475569';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(wallX, yTop, stemT, yBase - yTop);
    this.ctx.strokeRect(wallX, yTop, stemT, yBase - yTop);

    this.ctx.fillRect(wallX - 35, yBase, baseW, baseH);
    this.ctx.strokeRect(wallX - 35, yBase, baseW, baseH);

    // Annotations
    this.ctx.fillStyle = textColor;
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText(`Ka = ${results.Ka.toFixed(3)}`, wallX + stemT + 80, yTop + 40);
    this.ctx.fillText(`Max Pressure: ${results.q_soil_bottom_psf.toFixed(0)} psf`, wallX + stemT + 80, yBase - 10);
    this.ctx.fillText(`Overturning FOS: ${results.FOS_overturning.toFixed(2)} (${results.passOverturning ? 'Pass' : 'FAIL'})`, wallX + 160, yBase + 40);
    this.ctx.fillText(`Sliding FOS: ${results.FOS_sliding.toFixed(2)} (${results.passSliding ? 'Pass' : 'FAIL'})`, wallX + 160, yBase + 60);
  }

  // 5. TIMBER FRAMING DIAGRAM
  renderTimberAnalysis(results) {
    if (!this.ctx || !results) return;
    this.clear();

    const w = this.canvas.clientWidth;
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const woodColor = '#d97706';

    const padX = 60;
    const spanW = w - padX * 2;
    const yBeam = 100;

    // Joist Elevation
    this.ctx.lineWidth = 12;
    this.ctx.strokeStyle = woodColor;
    this.ctx.beginPath();
    this.ctx.moveTo(padX, yBeam);
    this.ctx.lineTo(padX + spanW, yBeam);
    this.ctx.stroke();

    this.drawSupportPin(padX, yBeam + 6, textColor);
    this.drawSupportRoller(padX + spanW, yBeam + 6, textColor);

    // Uniform Load
    this.ctx.fillStyle = 'rgba(217, 119, 6, 0.15)';
    this.ctx.fillRect(padX, yBeam - 40, spanW, 34);

    this.ctx.fillStyle = textColor;
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText(`Timber Member: ${results.sizeName} (${results.speciesName})`, padX + 10, yBeam - 50);
    this.ctx.fillText(`Span L = ${results.L_ft} ft | Stress fb: ${results.fb_psi.toFixed(0)} psi / Allowable Fb': ${results.Fb_prime_psi.toFixed(0)} psi`, padX + 10, yBeam + 50);
    this.ctx.fillText(`Max Deflection: ${results.delta_max_in.toFixed(3)}" vs Code Limit L/240: ${results.L240_in.toFixed(3)}"`, padX + 10, yBeam + 70);
  }

  drawDiagramBase(padX, spanW, y, axisColor, label, textColor) {
    this.ctx.strokeStyle = axisColor;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(padX, y);
    this.ctx.lineTo(padX + spanW, y);
    this.ctx.stroke();

    this.ctx.fillStyle = textColor;
    this.ctx.font = '11px sans-serif';
    this.ctx.fillText(label, padX + 5, y - 5);
  }

  drawSupportPin(x, y, color) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x - 8, y + 14);
    this.ctx.lineTo(x + 8, y + 14);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawSupportRoller(x, y, color) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y + 8, 7, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  drawDownArrow(x, y, length, color, width = 1.5) {
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y + length);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(x, y + length);
    this.ctx.lineTo(x - 4, y + length - 7);
    this.ctx.lineTo(x + 4, y + length - 7);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
