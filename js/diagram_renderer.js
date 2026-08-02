/**
 * Canvas Interactive Diagram Renderer
 * Draws real-time high-DPI structural engineering diagrams:
 * 1. Beam Model & Loads Elevation
 * 2. Shear Force Diagram V(x)
 * 3. Bending Moment Diagram M(x)
 * 4. Deflection Curve delta(x)
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

  renderBeamAnalysis(results) {
    if (!this.ctx || !results) return;
    this.clear();

    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const isDark = document.body.classList.contains('dark-theme');

    // Colors
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const axisColor = isDark ? '#475569' : '#cbd5e1';
    const beamColor = isDark ? '#3b82f6' : '#2563eb';
    const shearColor = isDark ? '#06b6d4' : '#0284c7';
    const momentColor = isDark ? '#a855f7' : '#9333ea';
    const deflectColor = results.isPass ? (isDark ? '#22c55e' : '#16a34a') : (isDark ? '#ef4444' : '#dc2626');

    // Layout Margins
    const padX = 60;
    const spanW = w - padX * 2;
    const yBeam = 60;
    const yShear = 140;
    const yMoment = 220;
    const yDeflect = 290;

    // 1. BEAM ELEVATION & LOADS
    // Draw Beam Axis
    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = beamColor;
    this.ctx.beginPath();
    this.ctx.moveTo(padX, yBeam);
    this.ctx.lineTo(padX + spanW, yBeam);
    this.ctx.stroke();

    // Supports (Pin Left, Roller Right)
    this.drawSupportPin(padX, yBeam, textColor);
    this.drawSupportRoller(padX + spanW, yBeam, textColor);

    // Uniform Load w Arrows & Block
    if (results.w_kft > 0) {
      this.ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      this.ctx.lineWidth = 1;
      this.ctx.fillRect(padX, yBeam - 30, spanW, 30);
      this.ctx.strokeRect(padX, yBeam - 30, spanW, 30);

      // Load arrows
      const arrowCount = 8;
      for (let i = 0; i <= arrowCount; i++) {
        const ax = padX + (spanW / arrowCount) * i;
        this.drawDownArrow(ax, yBeam - 30, 25, beamColor);
      }
      this.ctx.fillStyle = beamColor;
      this.ctx.font = '11px sans-serif';
      this.ctx.fillText(`w = ${results.w_kft} k/ft`, padX + spanW / 2 - 25, yBeam - 35);
    }

    // Concentrated Point Load P
    if (results.P_kips > 0) {
      const px = padX + spanW / 2;
      this.drawDownArrow(px, yBeam - 45, 40, '#f59e0b', 3);
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.font = 'bold 11px sans-serif';
      this.ctx.fillText(`P = ${results.P_kips} kips`, px - 25, yBeam - 50);
    }

    // Span Text
    this.ctx.fillStyle = textColor;
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText(`L = ${results.L_ft} ft`, padX + spanW / 2 - 20, yBeam + 25);

    // 2. SHEAR FORCE DIAGRAM V(x)
    this.drawDiagramBase(padX, spanW, yShear, axisColor, `Shear V (Max: ${results.V_max_kips.toFixed(2)} kips)`, textColor);
    
    // Draw V(x) polygon
    const maxV = Math.max(results.V_max_kips, 0.001);
    const vScale = 25 / maxV;
    
    this.ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.25)' : 'rgba(2, 132, 199, 0.2)';
    this.ctx.strokeStyle = shearColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(padX, yShear);
    this.ctx.lineTo(padX, yShear - results.V_max_kips * vScale);
    this.ctx.lineTo(padX + spanW / 2, yShear - (results.w_kft ? (results.w_kft * results.L_ft / 2) : 0) * vScale);
    this.ctx.lineTo(padX + spanW / 2, yShear + (results.w_kft ? (results.w_kft * results.L_ft / 2) : 0) * vScale);
    this.ctx.lineTo(padX + spanW, yShear + results.V_max_kips * vScale);
    this.ctx.lineTo(padX + spanW, yShear);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 3. BENDING MOMENT DIAGRAM M(x)
    this.drawDiagramBase(padX, spanW, yMoment, axisColor, `Moment M (Max: ${results.M_max_kipft.toFixed(2)} kip-ft)`, textColor);

    const maxM = Math.max(results.M_max_kipft, 0.001);
    const mScale = 30 / maxM;

    this.ctx.fillStyle = isDark ? 'rgba(168, 85, 247, 0.25)' : 'rgba(147, 51, 234, 0.2)';
    this.ctx.strokeStyle = momentColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(padX, yMoment);
    // Quadratic curve for uniform load, linear for point load
    const midM_y = yMoment + results.M_max_kipft * mScale;
    this.ctx.quadraticCurveTo(padX + spanW / 2, yMoment + results.M_max_kipft * mScale * 1.5, padX + spanW, yMoment);
    this.ctx.lineTo(padX, yMoment);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 4. DEFLECTION CURVE delta(x)
    this.drawDiagramBase(padX, spanW, yDeflect, axisColor, `Deflection \u03B4 (Max: ${results.delta_max_in.toFixed(3)}" vs L/240: ${results.L240_in.toFixed(3)}")`, textColor);

    this.ctx.strokeStyle = deflectColor;
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.moveTo(padX, yDeflect);
    this.ctx.quadraticCurveTo(padX + spanW / 2, yDeflect + 22, padX + spanW, yDeflect);
    this.ctx.stroke();
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

    // Arrowhead
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + length);
    this.ctx.lineTo(x - 4, y + length - 7);
    this.ctx.lineTo(x + 4, y + length - 7);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
