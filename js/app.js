/**
 * Master Application State & Event Controller
 */

import { AISC_DATABASE, getSectionByName } from './aisc_database.js';
import { analyzeSteelBeam, analyzeSteelColumn } from './steel_engine.js';
import { analyzeConcreteFooting } from './concrete_engine.js';
import { analyzeRetainingWall } from './retaining_engine.js';
import { TIMBER_SPECIES, LUMBER_SIZES, analyzeTimberMember } from './timber_engine.js';
import { StructuralDiagramRenderer } from './diagram_renderer.js';

class StructuralApp {
  constructor() {
    this.currentModule = 'steel-beam';
    this.unitSystem = 'imperial';
    this.renderer = null;

    this.init();
  }

  init() {
    this.populateSelects();
    this.setupEventListeners();
    this.renderer = new StructuralDiagramRenderer('analysisCanvas');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Registration:', err));
    }

    this.recalculate();
  }

  populateSelects() {
    const sbSelect = document.getElementById('sb-shape');
    const scSelect = document.getElementById('sc-shape');
    
    AISC_DATABASE.forEach(sec => {
      const opt = document.createElement('option');
      opt.value = sec.name;
      opt.textContent = `${sec.name} (${sec.weight} lb/ft | Ix: ${sec.Ix} in⁴)`;
      sbSelect.appendChild(opt);
      scSelect.appendChild(opt.cloneNode(true));
    });

    sbSelect.value = "W12x26";
    scSelect.value = "HSS6x6x3/8";

    const tbSpeciesSelect = document.getElementById('tb-species');
    TIMBER_SPECIES.forEach(sp => {
      const opt = document.createElement('option');
      opt.value = sp.name;
      opt.textContent = `${sp.name} (Fb: ${sp.Fb} psi)`;
      tbSpeciesSelect.appendChild(opt);
    });

    const tbSizeSelect = document.getElementById('tb-size');
    LUMBER_SIZES.forEach(sz => {
      const opt = document.createElement('option');
      opt.value = sz.name;
      opt.textContent = `${sz.name} (Sx: ${sz.Sx} in³)`;
      tbSizeSelect.appendChild(opt);
    });
  }

  setupEventListeners() {
    // Nav Module Tab switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetModule = e.currentTarget.dataset.module;
        this.switchModule(targetModule);
      });
    });

    // Steel Load Mode Toggle Listener
    const loadModeSelect = document.getElementById('sb-load-mode');
    if (loadModeSelect) {
      loadModeSelect.addEventListener('change', () => {
        const isTrib = loadModeSelect.value === 'tributary';
        document.getElementById('group-trib').style.display = isTrib ? 'grid' : 'none';
        document.getElementById('label-dl').textContent = isTrib ? 'Dead Load (DL) (psf)' : 'Dead Load (DL) (plf)';
        document.getElementById('label-ll').textContent = isTrib ? 'Live Load (LL) (psf)' : 'Live Load (LL) (plf)';
        this.recalculate();
      });
    }

    // Input Change Listeners
    const inputIds = [
      'sb-shape', 'sb-method', 'sb-span', 'sb-fy', 'sb-load-mode',
      'sb-trib-left', 'sb-trib-right', 'sb-dl', 'sb-ll',
      'sb-p-dl', 'sb-p-ll', 'sb-p-pos', 'sb-selfweight',
      'sb-deflect-live', 'sb-deflect-total',
      'sc-shape', 'sc-length', 'sc-k', 'sc-axial',
      'cf-pdead', 'cf-plive', 'cf-width', 'cf-thick', 'cf-qallow', 'cf-fc',
      'rw-height', 'rw-base', 'rw-density', 'rw-phi', 'rw-surcharge',
      'tb-species', 'tb-size', 'tb-span', 'tb-w'
    ];

    inputIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.recalculate());
        el.addEventListener('change', () => this.recalculate());
      }
    });

    // Theme Switch
    document.getElementById('themeToggleBtn').addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      document.body.classList.toggle('light-theme');
      const isDark = document.body.classList.contains('dark-theme');
      document.getElementById('themeIcon').textContent = isDark ? '🌙' : '☀️';
      this.recalculate();
    });

    // Unit Conversion Toggle
    document.getElementById('unitToggleBtn').addEventListener('click', () => {
      this.unitSystem = this.unitSystem === 'imperial' ? 'metric' : 'imperial';
      document.getElementById('unitLabel').textContent = this.unitSystem === 'imperial' ? 'Imperial (US)' : 'Metric (SI)';
      this.recalculate();
    });

    // Print Submittal Report
    document.getElementById('printReportBtn').addEventListener('click', () => {
      this.generatePrintReport();
      window.print();
    });
  }

  switchModule(moduleName) {
    this.currentModule = moduleName;
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.module === moduleName);
    });
    document.querySelectorAll('.module-content').forEach(mc => {
      mc.classList.toggle('active', mc.id === `mod-${moduleName}`);
    });
    this.recalculate();
  }

  recalculate() {
    switch (this.currentModule) {
      case 'steel-beam':
        this.runSteelBeam();
        break;
      case 'steel-column':
        this.runSteelColumn();
        break;
      case 'footing':
        this.runFooting();
        break;
      case 'retaining':
        this.runRetaining();
        break;
      case 'timber':
        this.runTimber();
        break;
    }
  }

  runSteelBeam() {
    const secName = document.getElementById('sb-shape').value;
    const section = getSectionByName(secName);

    const inputs = {
      method: document.getElementById('sb-method').value,
      loadMode: document.getElementById('sb-load-mode').value,
      L_ft: parseFloat(document.getElementById('sb-span').value) || 20,
      Fy_ksi: parseFloat(document.getElementById('sb-fy').value) || 50,
      tribLeft_ft: parseFloat(document.getElementById('sb-trib-left').value) || 0,
      tribRight_ft: parseFloat(document.getElementById('sb-trib-right').value) || 0,
      dl_psf: parseFloat(document.getElementById('sb-dl').value) || 0,
      ll_psf: parseFloat(document.getElementById('sb-ll').value) || 0,
      w_dl_plf: parseFloat(document.getElementById('sb-dl').value) || 0,
      w_ll_plf: parseFloat(document.getElementById('sb-ll').value) || 0,
      P_dl_kips: parseFloat(document.getElementById('sb-p-dl').value) || 0,
      P_ll_kips: parseFloat(document.getElementById('sb-p-ll').value) || 0,
      P_pos_ft: parseFloat(document.getElementById('sb-p-pos').value) || 10,
      includeSelfWeight: document.getElementById('sb-selfweight').checked,
      deflectLimitLive: parseFloat(document.getElementById('sb-deflect-live').value) || 360,
      deflectLimitTotal: parseFloat(document.getElementById('sb-deflect-total').value) || 240,
      section
    };

    const res = analyzeSteelBeam(inputs);
    this.updateStatus(res.isPass, res.stressRatio * 100);

    const loadDesc = inputs.loadMode === 'tributary' 
      ? `Trib: ${res.totalTrib_ft} ft (${inputs.tribLeft_ft}' + ${inputs.tribRight_ft}')`
      : `Line Load: ${res.w_dl_plf.toFixed(0)} DL + ${res.w_ll_plf.toFixed(0)} LL plf`;

    const stressLabel = res.method === 'ASD' ? 'Bending Stress \u03C3' : 'Factored Moment Mu';
    const stressVal = res.method === 'ASD' ? `${res.bendingStress_ksi.toFixed(2)} ksi` : `${res.M_max_kipft.toFixed(1)} kip-ft`;
    const stressSub = res.method === 'ASD' ? `Allowable: ${res.allowableStress_ksi.toFixed(2)} ksi` : `Capacity \u03C6Mn: ${res.allowableStress_ksi.toFixed(1)} kip-ft`;

    this.renderMetrics([
      { label: "Section & Loads", val: res.sectionName, sub: loadDesc },
      { label: "Uniform Load w_total", val: `${(res.w_service_kft * 1000).toFixed(0)} plf`, sub: `Factored w_u: ${(res.w_factored_kft * 1000).toFixed(0)} plf (${res.method})` },
      { label: stressLabel, val: stressVal, sub: stressSub },
      { label: "Deflection Live \u03B4_LL", val: `${res.delta_live_in.toFixed(3)}"`, sub: `Limit L/360: ${res.L360_in.toFixed(3)}" (${res.passLiveDeflect ? 'Pass' : 'FAIL'})` },
      { label: "Deflection Total \u03B4_TL", val: `${res.delta_total_in.toFixed(3)}"`, sub: `Limit L/240: ${res.L240_in.toFixed(3)}" (${res.passTotalDeflect ? 'Pass' : 'FAIL'})` }
    ]);

    // Canvas Diagram
    this.renderer.renderBeamAnalysis({
      w_kft: res.w_service_kft,
      P_kips: res.P_dl + res.P_ll,
      L_ft: res.L_ft,
      V_max_kips: res.V_max_kips,
      M_max_kipft: res.M_max_kipft,
      delta_max_in: res.delta_total_in,
      L240_in: res.L240_in,
      isPass: res.isPass
    });
  }

  runSteelColumn() {
    const secName = document.getElementById('sc-shape').value;
    const section = getSectionByName(secName);

    const inputs = {
      L_ft: parseFloat(document.getElementById('sc-length').value) || 12,
      K: parseFloat(document.getElementById('sc-k').value) || 1.0,
      P_axial_kips: parseFloat(document.getElementById('sc-axial').value) || 35,
      section
    };

    const res = analyzeSteelColumn(inputs);
    this.updateStatus(res.isPass, res.capacityRatio * 100);

    this.renderMetrics([
      { label: "Column Shape", val: section.name, sub: `Area: ${section.A} in\u00B2` },
      { label: "Slenderness (KL/r)", val: res.KLr_max.toFixed(1), sub: res.slendernessPass ? "Pass (\u2264 200)" : "Exceeds 200 Limit" },
      { label: "Euler Buckling P_cr", val: `${res.P_cr_kips.toFixed(1)} kips`, sub: `Critical Stress: ${res.Fe_ksi.toFixed(1)} ksi` },
      { label: "Allowable Axial Load", val: `${res.P_allowable_kips.toFixed(1)} kips`, sub: `Applied: ${res.P_applied} kips` }
    ]);

    this.renderer.clear();
  }

  runFooting() {
    const inputs = {
      P_dead_kips: parseFloat(document.getElementById('cf-pdead').value) || 40,
      P_live_kips: parseFloat(document.getElementById('cf-plive').value) || 25,
      width_ft: parseFloat(document.getElementById('cf-width').value) || 5,
      length_ft: parseFloat(document.getElementById('cf-width').value) || 5,
      thickness_in: parseFloat(document.getElementById('cf-thick').value) || 14,
      q_allowable_ksf: parseFloat(document.getElementById('cf-qallow').value) || 3.0,
      fc_psi: parseFloat(document.getElementById('cf-fc').value) || 3000
    };

    const res = analyzeConcreteFooting(inputs);
    this.updateStatus(res.isPass, res.bearingRatio * 100);

    this.renderMetrics([
      { label: "Service Pressure", val: `${res.q_service_ksf.toFixed(2)} ksf`, sub: `Allowable: ${res.q_allowable_ksf} ksf` },
      { label: "Factored Moment Mu", val: `${res.M_u_kipft.toFixed(1)} kip-ft`, sub: `Factored Load Pu: ${res.P_factored} kips` },
      { label: "Flexural Steel As", val: `${res.As_final_sqin.toFixed(2)} in\u00B2`, sub: "Required steel area" },
      { label: "Rebar Schedule", val: res.rebarRecommendation, sub: "Bottom mat each way" }
    ]);

    this.renderer.clear();
  }

  runRetaining() {
    const inputs = {
      wall_height_ft: parseFloat(document.getElementById('rw-height').value) || 10,
      base_width_ft: parseFloat(document.getElementById('rw-base').value) || 6.5,
      soil_density_pcf: parseFloat(document.getElementById('rw-density').value) || 120,
      friction_angle_deg: parseFloat(document.getElementById('rw-phi').value) || 30,
      surcharge_psf: parseFloat(document.getElementById('rw-surcharge').value) || 0
    };

    const res = analyzeRetainingWall(inputs);
    this.updateStatus(res.isPass, (1.5 / Math.min(res.FOS_overturning, res.FOS_sliding)) * 100);

    this.renderMetrics([
      { label: "Active Coeff Ka", val: res.Ka.toFixed(3), sub: `Soil Bottom Pressure: ${res.q_soil_bottom_psf.toFixed(0)} psf` },
      { label: "Lateral Force P", val: `${res.P_total_lateral_lb.toFixed(0)} lbs/ft`, sub: `Overturning Moment: ${res.M_ot_lbft.toFixed(0)} lb-ft` },
      { label: "Overturning FOS", val: res.FOS_overturning.toFixed(2), sub: res.passOverturning ? "Pass (\u2265 1.5)" : "FAIL (< 1.5)" },
      { label: "Sliding FOS", val: res.FOS_sliding.toFixed(2), sub: res.passSliding ? "Pass (\u2265 1.5)" : "FAIL (< 1.5)" }
    ]);

    this.renderer.clear();
  }

  runTimber() {
    const inputs = {
      speciesName: document.getElementById('tb-species').value,
      sizeName: document.getElementById('tb-size').value,
      L_ft: parseFloat(document.getElementById('tb-span').value) || 14,
      w_plf: parseFloat(document.getElementById('tb-w').value) || 120
    };

    const res = analyzeTimberMember(inputs);
    this.updateStatus(res.isPass, res.stressRatio * 100);

    this.renderMetrics([
      { label: "Member Size", val: res.sizeName, sub: res.speciesName },
      { label: "Bending Moment", val: `${res.M_max_lbft.toFixed(0)} lb-ft`, sub: `Stress fb: ${res.fb_psi.toFixed(0)} psi` },
      { label: "Allowable Stress Fb'", val: `${res.Fb_prime_psi.toFixed(0)} psi`, sub: res.passStress ? "Stress Pass" : "Overstressed" },
      { label: "Deflection \u03B4", val: `${res.delta_max_in.toFixed(3)}"`, sub: `Limit L/240: ${res.L240_in.toFixed(3)}"` }
    ]);

    this.renderer.clear();
  }

  updateStatus(isPass, utilPercent) {
    const badge = document.getElementById('statusBadge');
    badge.className = `status-badge ${isPass ? 'pass' : 'fail'}`;
    badge.querySelector('.status-icon').textContent = isPass ? '✓' : '✕';
    badge.querySelector('.status-text').textContent = isPass ? 'STATUS: PASS' : 'STATUS: OVERSTRESSED';

    const boundedUtil = Math.min(Math.max(utilPercent, 0), 100);
    document.getElementById('utilPercent').textContent = `${boundedUtil.toFixed(1)}%`;
    const fill = document.getElementById('utilFill');
    fill.style.width = `${boundedUtil}%`;
    fill.style.backgroundColor = isPass ? (boundedUtil > 85 ? 'var(--warn-color)' : 'var(--pass-color)') : 'var(--fail-color)';
  }

  renderMetrics(metrics) {
    const grid = document.getElementById('metricsGrid');
    grid.innerHTML = '';
    metrics.forEach(m => {
      const card = document.createElement('div');
      card.className = 'metric-card';
      card.innerHTML = `
        <div class="metric-label">${m.label}</div>
        <div class="metric-value">${m.val}</div>
        <div class="metric-sub">${m.sub}</div>
      `;
      grid.appendChild(card);
    });
  }

  generatePrintReport() {
    document.getElementById('printDate').textContent = new Date().toLocaleDateString();
    const body = document.getElementById('printBody');

    const metricsCards = Array.from(document.querySelectorAll('.metric-card')).map(card => {
      const label = card.querySelector('.metric-label').textContent;
      const val = card.querySelector('.metric-value').textContent;
      const sub = card.querySelector('.metric-sub').textContent;
      return `<tr><td><strong>${label}</strong></td><td>${val}</td><td>${sub}</td></tr>`;
    }).join('');

    body.innerHTML = `
      <h3>Active Analysis Module: ${this.currentModule.toUpperCase()}</h3>
      <table class="print-table">
        <thead>
          <tr>
            <th>Parameter / Check</th>
            <th>Value</th>
            <th>Notes / Limits</th>
          </tr>
        </thead>
        <tbody>
          ${metricsCards}
        </tbody>
      </table>
    `;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new StructuralApp();
});
