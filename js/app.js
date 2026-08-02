/**
 * Master Application State & Event Controller
 * Features:
 * - Bearing Support Reactions (R1, R2, R3) for Dead, Live, Total Service & Factored loads
 * - Graphical Beam Drawing Embedded in Printable PDF Submittal Reports
 * - Member Auto-Optimizers for Beams & Columns
 * - Project Save / Load Persistence
 */

import { AISC_DATABASE, getSectionByName } from './aisc_database.js';
import { analyzeSteelBeam, analyzeSteelColumn, findLightestSteelBeam, findLightestSteelColumn } from './steel_engine.js';
import { analyzeConcreteFooting } from './concrete_engine.js';
import { analyzeRetainingWall } from './retaining_engine.js';
import { TIMBER_SPECIES, LUMBER_SIZES, analyzeTimberMember } from './timber_engine.js';
import { StructuralDiagramRenderer } from './diagram_renderer.js';

class StructuralApp {
  constructor() {
    this.currentModule = 'steel-beam';
    this.unitSystem = 'imperial';
    this.renderer = null;
    this.lastResult = null;
    this.pointLoads = [
      { P_dl: 1.5, P_ll: 3.0, pos_ft: 10.0 }
    ];

    this.init();
  }

  init() {
    this.populateSelects();
    this.renderPointLoadsUI();
    this.setupEventListeners();
    this.renderer = new StructuralDiagramRenderer('analysisCanvas');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Registration:', err));
    }

    this.loadFromLocalStorage();
    this.recalculate();
  }

  populateSelects() {
    this.updateBeamShapes();
    this.updateColumnShapes();

    const tbSpeciesSelect = document.getElementById('tb-species');
    tbSpeciesSelect.innerHTML = '';
    TIMBER_SPECIES.forEach(sp => {
      const opt = document.createElement('option');
      opt.value = sp.name;
      opt.textContent = `${sp.name} (Fb: ${sp.Fb} psi)`;
      tbSpeciesSelect.appendChild(opt);
    });

    const tbSizeSelect = document.getElementById('tb-size');
    tbSizeSelect.innerHTML = '';

    const woodCats = {
      'sawn': 'Dimension Sawn Lumber',
      'lvl': 'LVL (1-Ply, 2-Ply, 3-Ply, 4-Ply Headers)',
      'glulam': 'Glulam Architectural Beams',
      'ijoist': 'TJI Engineered Wood I-Joists'
    };

    Object.keys(woodCats).forEach(catKey => {
      const grp = document.createElement('optgroup');
      grp.label = woodCats[catKey];
      const sizes = LUMBER_SIZES.filter(sz => sz.category === catKey);
      sizes.forEach(sz => {
        const opt = document.createElement('option');
        opt.value = sz.name;
        opt.textContent = `${sz.name} (Sx: ${sz.Sx} in³)`;
        grp.appendChild(opt);
      });
      if (sizes.length > 0) {
        tbSizeSelect.appendChild(grp);
      }
    });
  }

  updateBeamShapes() {
    const familySelect = document.getElementById('sb-family');
    const shapeSelect = document.getElementById('sb-shape');
    if (!familySelect || !shapeSelect) return;

    const family = familySelect.value || 'W';
    shapeSelect.innerHTML = '';

    const matchingShapes = AISC_DATABASE.filter(s => s.type === family);
    matchingShapes.forEach(sec => {
      const opt = document.createElement('option');
      opt.value = sec.name;
      opt.textContent = `${sec.name} (${sec.weight} lb/ft | Ix: ${sec.Ix} in⁴ | Sx: ${sec.Sx} in³)`;
      shapeSelect.appendChild(opt);
    });

    if (matchingShapes.length > 0) {
      shapeSelect.value = matchingShapes[0].name;
    }
  }

  updateColumnShapes() {
    const familySelect = document.getElementById('sc-family');
    const shapeSelect = document.getElementById('sc-shape');
    if (!familySelect || !shapeSelect) return;

    const family = familySelect.value || 'HSS';
    shapeSelect.innerHTML = '';

    const matchingShapes = AISC_DATABASE.filter(s => s.type === family);
    matchingShapes.forEach(sec => {
      const opt = document.createElement('option');
      opt.value = sec.name;
      opt.textContent = `${sec.name} (${sec.weight} lb/ft | Area: ${sec.A} in² | r: ${sec.rx} in)`;
      shapeSelect.appendChild(opt);
    });

    if (matchingShapes.length > 0) {
      shapeSelect.value = matchingShapes[0].name;
    }
  }

  renderPointLoadsUI() {
    const container = document.getElementById('pointLoadsList');
    if (!container) return;

    container.innerHTML = '';
    this.pointLoads.forEach((pt, idx) => {
      const row = document.createElement('div');
      row.className = 'form-row';
      row.style.alignItems = 'center';
      row.innerHTML = `
        <div style="flex:1;">
          <input type="number" class="form-control pt-pdl" data-idx="${idx}" value="${pt.P_dl}" placeholder="P_DL (k)" step="0.5" min="0">
        </div>
        <div style="flex:1;">
          <input type="number" class="form-control pt-pll" data-idx="${idx}" value="${pt.P_ll}" placeholder="P_LL (k)" step="0.5" min="0">
        </div>
        <div style="flex:1;">
          <input type="number" class="form-control pt-pos" data-idx="${idx}" value="${pt.pos_ft}" placeholder="Pos a (ft)" step="0.5" min="0">
        </div>
        <div>
          <button class="btn btn-outline remove-pt-btn" data-idx="${idx}" style="padding:0.4rem 0.6rem; color:var(--fail-color); border-color:var(--fail-color);">&times;</button>
        </div>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll('.pt-pdl').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        this.pointLoads[idx].P_dl = parseFloat(e.target.value) || 0;
        this.recalculate();
      });
    });

    container.querySelectorAll('.pt-pll').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        this.pointLoads[idx].P_ll = parseFloat(e.target.value) || 0;
        this.recalculate();
      });
    });

    container.querySelectorAll('.pt-pos').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        this.pointLoads[idx].pos_ft = parseFloat(e.target.value) || 0;
        this.recalculate();
      });
    });

    container.querySelectorAll('.remove-pt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        if (this.pointLoads.length > 1) {
          this.pointLoads.splice(idx, 1);
          this.renderPointLoadsUI();
          this.recalculate();
        }
      });
    });
  }

  setupEventListeners() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetModule = e.currentTarget.dataset.module;
        this.switchModule(targetModule);
      });
    });

    const optiBeamBtn = document.getElementById('optiSteelBeamBtn');
    if (optiBeamBtn) {
      optiBeamBtn.addEventListener('click', () => this.autoOptimizeSteelBeam());
    }

    const optiColBtn = document.getElementById('optiSteelColBtn');
    if (optiColBtn) {
      optiColBtn.addEventListener('click', () => this.autoOptimizeSteelColumn());
    }

    document.getElementById('saveProjectBtn').addEventListener('click', () => this.saveToLocalStorage());
    document.getElementById('loadProjectBtn').addEventListener('click', () => this.loadFromLocalStorage());

    const sbFamilySelect = document.getElementById('sb-family');
    if (sbFamilySelect) {
      sbFamilySelect.addEventListener('change', () => {
        this.updateBeamShapes();
        this.recalculate();
      });
    }

    const scFamilySelect = document.getElementById('sc-family');
    if (scFamilySelect) {
      scFamilySelect.addEventListener('change', () => {
        this.updateColumnShapes();
        this.recalculate();
      });
    }

    const presetSelect = document.getElementById('sb-preset');
    if (presetSelect) {
      presetSelect.addEventListener('change', () => {
        const val = presetSelect.value;
        if (val === 'floor') {
          document.getElementById('sb-dl').value = 15;
          document.getElementById('sb-ll').value = 40;
          document.getElementById('sb-deflect-live').value = "360";
          document.getElementById('sb-deflect-total').value = "240";
        } else if (val === 'roof') {
          document.getElementById('sb-dl').value = 15;
          document.getElementById('sb-ll').value = 20;
          document.getElementById('sb-deflect-live').value = "240";
          document.getElementById('sb-deflect-total').value = "180";
        } else if (val === 'plaster') {
          document.getElementById('sb-dl').value = 15;
          document.getElementById('sb-ll').value = 20;
          document.getElementById('sb-deflect-live').value = "480";
          document.getElementById('sb-deflect-total').value = "360";
        } else if (val === 'commercial') {
          document.getElementById('sb-dl').value = 25;
          document.getElementById('sb-ll').value = 100;
          document.getElementById('sb-deflect-live').value = "360";
          document.getElementById('sb-deflect-total').value = "240";
        }
        this.recalculate();
      });
    }

    const beamTypeSelect = document.getElementById('sb-beam-type');
    if (beamTypeSelect) {
      beamTypeSelect.addEventListener('change', () => {
        const type = beamTypeSelect.value;
        const groupSpan2 = document.getElementById('group-span2');
        const labelSpan2 = document.getElementById('label-span2');

        if (type === 'single') {
          groupSpan2.style.display = 'none';
        } else if (type === 'cantilever') {
          groupSpan2.style.display = 'block';
          labelSpan2.textContent = "Cantilever Overhang L2 (ft)";
        } else if (type === 'two-span') {
          groupSpan2.style.display = 'block';
          labelSpan2.textContent = "Span 2 L2 (ft)";
        }
        this.recalculate();
      });
    }

    const addPtBtn = document.getElementById('addPointLoadBtn');
    if (addPtBtn) {
      addPtBtn.addEventListener('click', () => {
        const L = parseFloat(document.getElementById('sb-span').value) || 20;
        this.pointLoads.push({ P_dl: 1.0, P_ll: 2.0, pos_ft: L / 2 });
        this.renderPointLoadsUI();
        this.recalculate();
      });
    }

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

    const inputIds = [
      'sb-shape', 'sb-preset', 'sb-beam-type', 'sb-span', 'sb-span2', 'sb-method', 'sb-load-mode',
      'sb-trib-left', 'sb-trib-right', 'sb-dl', 'sb-ll', 'sb-selfweight',
      'sb-deflect-live', 'sb-deflect-total',
      'sc-shape', 'sc-length', 'sc-k', 'sc-axial',
      'cf-pdead', 'cf-plive', 'cf-width', 'cf-thick', 'cf-qallow', 'cf-fc',
      'rw-height', 'rw-base', 'rw-density', 'rw-phi', 'rw-surcharge',
      'tb-species', 'tb-size', 'tb-span', 'tb-w',
      'rep-engineer', 'rep-company', 'rep-project', 'rep-client'
    ];

    inputIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.recalculate());
        el.addEventListener('change', () => this.recalculate());
      }
    });

    document.getElementById('themeToggleBtn').addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      document.body.classList.toggle('light-theme');
      const isDark = document.body.classList.contains('dark-theme');
      document.getElementById('themeIcon').textContent = isDark ? '🌙' : '☀️';
      this.recalculate();
    });

    document.getElementById('unitToggleBtn').addEventListener('click', () => {
      this.unitSystem = this.unitSystem === 'imperial' ? 'metric' : 'imperial';
      document.getElementById('unitLabel').textContent = this.unitSystem === 'imperial' ? 'Imperial (US)' : 'Metric (SI)';
      this.recalculate();
    });

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

  autoOptimizeSteelBeam() {
    const family = document.getElementById('sb-family').value;
    const inputs = {
      family,
      beamType: document.getElementById('sb-beam-type').value,
      method: document.getElementById('sb-method').value,
      loadMode: document.getElementById('sb-load-mode').value,
      L_ft: parseFloat(document.getElementById('sb-span').value) || 20,
      L2_ft: parseFloat(document.getElementById('sb-span2').value) || 0,
      tribLeft_ft: parseFloat(document.getElementById('sb-trib-left').value) || 0,
      tribRight_ft: parseFloat(document.getElementById('sb-trib-right').value) || 0,
      dl_psf: parseFloat(document.getElementById('sb-dl').value) || 0,
      ll_psf: parseFloat(document.getElementById('sb-ll').value) || 0,
      w_dl_plf: parseFloat(document.getElementById('sb-dl').value) || 0,
      w_ll_plf: parseFloat(document.getElementById('sb-ll').value) || 0,
      pointLoads: this.pointLoads,
      includeSelfWeight: document.getElementById('sb-selfweight').checked,
      deflectLimitLive: parseFloat(document.getElementById('sb-deflect-live').value) || 360,
      deflectLimitTotal: parseFloat(document.getElementById('sb-deflect-total').value) || 240,
    };

    const opt = findLightestSteelBeam(inputs);
    if (opt.found) {
      document.getElementById('sb-shape').value = opt.section.name;
      alert(`✨ Lightest Passing Section Found: ${opt.section.name} (${opt.section.weight} lb/ft | Utilization: ${(opt.result.stressRatio * 100).toFixed(1)}%)`);
      this.recalculate();
    } else {
      alert("⚠️ No passing section found in this family.");
    }
  }

  autoOptimizeSteelColumn() {
    const family = document.getElementById('sc-family').value;
    const inputs = {
      family,
      L_ft: parseFloat(document.getElementById('sc-length').value) || 12,
      K: parseFloat(document.getElementById('sc-k').value) || 1.0,
      P_axial_kips: parseFloat(document.getElementById('sc-axial').value) || 35,
    };

    const opt = findLightestSteelColumn(inputs);
    if (opt.found) {
      document.getElementById('sc-shape').value = opt.section.name;
      alert(`✨ Lightest Passing Column Found: ${opt.section.name} (${opt.section.weight} lb/ft | Utilization: ${(opt.result.capacityRatio * 100).toFixed(1)}%)`);
      this.recalculate();
    } else {
      alert("⚠️ No passing column section found in this family.");
    }
  }

  saveToLocalStorage() {
    const data = {
      sb_family: document.getElementById('sb-family').value,
      sb_shape: document.getElementById('sb-shape').value,
      sb_span: document.getElementById('sb-span').value,
      sc_shape: document.getElementById('sc-shape').value,
      cf_pdead: document.getElementById('cf-pdead').value,
      rw_height: document.getElementById('rw-height').value,
      tb_species: document.getElementById('tb-species').value,
      pointLoads: this.pointLoads
    };
    localStorage.setItem('structural_calc_project', JSON.stringify(data));
    alert('💾 Project state saved locally!');
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('structural_calc_project');
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      if (data.sb_family) document.getElementById('sb-family').value = data.sb_family;
      this.updateBeamShapes();
      if (data.sb_shape) document.getElementById('sb-shape').value = data.sb_shape;
      if (data.sb_span) document.getElementById('sb-span').value = data.sb_span;
      if (data.pointLoads) this.pointLoads = data.pointLoads;
    } catch(e) {}
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
      beamType: document.getElementById('sb-beam-type').value,
      method: document.getElementById('sb-method').value,
      loadMode: document.getElementById('sb-load-mode').value,
      L_ft: parseFloat(document.getElementById('sb-span').value) || 20,
      L2_ft: parseFloat(document.getElementById('sb-span2').value) || 0,
      tribLeft_ft: parseFloat(document.getElementById('sb-trib-left').value) || 0,
      tribRight_ft: parseFloat(document.getElementById('sb-trib-right').value) || 0,
      dl_psf: parseFloat(document.getElementById('sb-dl').value) || 0,
      ll_psf: parseFloat(document.getElementById('sb-ll').value) || 0,
      w_dl_plf: parseFloat(document.getElementById('sb-dl').value) || 0,
      w_ll_plf: parseFloat(document.getElementById('sb-ll').value) || 0,
      pointLoads: this.pointLoads,
      includeSelfWeight: document.getElementById('sb-selfweight').checked,
      deflectLimitLive: parseFloat(document.getElementById('sb-deflect-live').value) || 360,
      deflectLimitTotal: parseFloat(document.getElementById('sb-deflect-total').value) || 240,
      section
    };

    const res = analyzeSteelBeam(inputs);
    this.lastResult = res;
    this.updateStatus(res.isPass, res.stressRatio * 100);

    const totalPointLoad = this.pointLoads.reduce((sum, p) => sum + p.P_dl + p.P_ll, 0);
    const r = res.reactions;

    const stressLabel = res.method === 'ASD' ? 'Bending Stress \u03C3' : 'Factored Moment Mu';
    const stressVal = res.method === 'ASD' ? `${res.bendingStress_ksi.toFixed(2)} ksi` : `${res.M_max_kipft.toFixed(1)} kip-ft`;
    const stressSub = res.method === 'ASD' ? `Allowable: ${res.allowableStress_ksi.toFixed(2)} ksi` : `Capacity \u03C6Mn: ${res.allowableStress_ksi.toFixed(1)} kip-ft`;

    const metrics = [
      { label: "Section & Type", val: res.sectionName, sub: `Type: ${section.type} | Config: ${res.beamType.toUpperCase()}` },
      { label: "Uniform Load w", val: `${(res.w_service_kft * 1000).toFixed(0)} plf`, sub: `Factored: ${(res.w_factored_kft * 1000).toFixed(0)} plf` },
      { label: "Left Support Reaction R1", val: `${r.R1.service.toFixed(2)} kips`, sub: `DL: ${r.R1.dl.toFixed(2)}k | LL: ${r.R1.ll.toFixed(2)}k | Factored: ${r.R1.factored.toFixed(2)}k` },
      { label: "Right Support Reaction R2", val: `${r.R2.service.toFixed(2)} kips`, sub: `DL: ${r.R2.dl.toFixed(2)}k | LL: ${r.R2.ll.toFixed(2)}k | Factored: ${r.R2.factored.toFixed(2)}k` },
      { label: stressLabel, val: stressVal, sub: stressSub },
      { label: "Deflection Live \u03B4_LL", val: `${res.delta_live_in.toFixed(3)}"`, sub: `Limit: ${res.L360_in.toFixed(3)}" (${res.passLiveDeflect ? 'Pass' : 'FAIL'})` },
      { label: "Deflection Total \u03B4_TL", val: `${res.delta_total_in.toFixed(3)}"`, sub: `Limit: ${res.L240_in.toFixed(3)}" (${res.passTotalDeflect ? 'Pass' : 'FAIL'})` }
    ];

    if (res.beamType === 'two-span') {
      metrics.splice(4, 0, { label: "Center Support Reaction R3", val: `${r.R3.service.toFixed(2)} kips`, sub: `DL: ${r.R3.dl.toFixed(2)}k | LL: ${r.R3.ll.toFixed(2)}k | Factored: ${r.R3.factored.toFixed(2)}k` });
    }

    this.renderMetrics(metrics);

    this.renderer.renderBeamAnalysis({
      w_kft: res.w_service_kft,
      P_kips: totalPointLoad,
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
    this.lastResult = res;
    this.updateStatus(res.isPass, res.capacityRatio * 100);

    this.renderMetrics([
      { label: "Column Shape", val: section.name, sub: `Area: ${section.A} in\u00B2` },
      { label: "Slenderness (KL/r)", val: res.KLr_max.toFixed(1), sub: res.slendernessPass ? "Pass (\u2264 200)" : "Exceeds 200 Limit" },
      { label: "Euler Buckling P_cr", val: `${res.P_cr_kips.toFixed(1)} kips`, sub: `Critical Stress: ${res.Fe_ksi.toFixed(1)} ksi` },
      { label: "Allowable Axial Load", val: `${res.P_allowable_kips.toFixed(1)} kips`, sub: `Applied: ${res.P_applied} kips` }
    ]);

    this.renderer.renderColumnAnalysis(res);
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
    this.lastResult = res;
    this.updateStatus(res.isPass, res.bearingRatio * 100);

    this.renderMetrics([
      { label: "Service Pressure", val: `${res.q_service_ksf.toFixed(2)} ksf`, sub: `Allowable: ${res.q_allowable_ksf} ksf` },
      { label: "Factored Moment Mu", val: `${res.M_u_kipft.toFixed(1)} kip-ft`, sub: `Factored Load Pu: ${res.P_factored} kips` },
      { label: "Flexural Steel As", val: `${res.As_final_sqin.toFixed(2)} in\u00B2`, sub: "Required steel area" },
      { label: "Rebar Schedule", val: res.rebarRecommendation, sub: "Bottom mat each way" }
    ]);

    this.renderer.renderFootingAnalysis(res);
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
    this.lastResult = res;
    this.updateStatus(res.isPass, (1.5 / Math.min(res.FOS_overturning, res.FOS_sliding)) * 100);

    this.renderMetrics([
      { label: "Active Coeff Ka", val: res.Ka.toFixed(3), sub: `Soil Bottom Pressure: ${res.q_soil_bottom_psf.toFixed(0)} psf` },
      { label: "Lateral Force P", val: `${res.P_total_lateral_lb.toFixed(0)} lbs/ft`, sub: `Overturning Moment: ${res.M_ot_lbft.toFixed(0)} lb-ft` },
      { label: "Overturning FOS", val: res.FOS_overturning.toFixed(2), sub: res.passOverturning ? "Pass (\u2265 1.5)" : "FAIL (< 1.5)" },
      { label: "Sliding FOS", val: res.FOS_sliding.toFixed(2), sub: res.passSliding ? "Pass (\u2265 1.5)" : "FAIL (< 1.5)" }
    ]);

    this.renderer.renderRetainingAnalysis(res);
  }

  runTimber() {
    const inputs = {
      speciesName: document.getElementById('tb-species').value,
      sizeName: document.getElementById('tb-size').value,
      L_ft: parseFloat(document.getElementById('tb-span').value) || 14,
      w_plf: parseFloat(document.getElementById('tb-w').value) || 120
    };

    const res = analyzeTimberMember(inputs);
    this.lastResult = res;
    this.updateStatus(res.isPass, res.stressRatio * 100);

    this.renderMetrics([
      { label: "Member Size", val: res.sizeName, sub: res.speciesName },
      { label: "Bending Moment", val: `${res.M_max_lbft.toFixed(0)} lb-ft`, sub: `Stress fb: ${res.fb_psi.toFixed(0)} psi` },
      { label: "Allowable Stress Fb'", val: `${res.Fb_prime_psi.toFixed(0)} psi`, sub: res.passStress ? "Stress Pass" : "Overstressed" },
      { label: "Deflection \u03B4", val: `${res.delta_max_in.toFixed(3)}"`, sub: `Limit L/240: ${res.L240_in.toFixed(3)}"` }
    ]);

    this.renderer.renderTimberAnalysis(res);
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
    const eng = document.getElementById('rep-engineer').value || 'John Doe, PE';
    const comp = document.getElementById('rep-company').value || 'Apex Engineering LLC';
    const proj = document.getElementById('rep-project').value || 'Commercial Structure';
    const client = document.getElementById('rep-client').value || 'BuildRight Construction';

    document.getElementById('printMetaInfo').innerHTML = `
      <strong>Engineer / Designer:</strong> ${eng} | <strong>Company:</strong> ${comp} | <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
      <strong>Project Name:</strong> ${proj} | <strong>Client / Contractor:</strong> ${client}
    `;

    const canvas = document.getElementById('analysisCanvas');
    const canvasImgData = canvas ? canvas.toDataURL("image/png") : '';

    let reactionsTableHTML = '';
    if (this.currentModule === 'steel-beam' && this.lastResult && this.lastResult.reactions) {
      const r = this.lastResult.reactions;
      reactionsTableHTML = `
        <h4 style="margin-top:1.25rem; font-size:1rem; color:#1e293b;">BEARING POINT SUPPORT REACTIONS</h4>
        <table class="print-table">
          <thead>
            <tr>
              <th>Support Location</th>
              <th>Dead Load (DL)</th>
              <th>Live Load (LL)</th>
              <th>Total Service Reaction</th>
              <th>Factored Load (LRFD/ASD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Left Bearing Support (R1)</strong></td>
              <td>${r.R1.dl.toFixed(2)} kips</td>
              <td>${r.R1.ll.toFixed(2)} kips</td>
              <td><strong>${r.R1.service.toFixed(2)} kips</strong></td>
              <td>${r.R1.factored.toFixed(2)} kips</td>
            </tr>
            <tr>
              <td><strong>Right Bearing Support (R2)</strong></td>
              <td>${r.R2.dl.toFixed(2)} kips</td>
              <td>${r.R2.ll.toFixed(2)} kips</td>
              <td><strong>${r.R2.service.toFixed(2)} kips</strong></td>
              <td>${r.R2.factored.toFixed(2)} kips</td>
            </tr>
            ${this.lastResult.beamType === 'two-span' ? `
            <tr>
              <td><strong>Center Bearing Support (R3)</strong></td>
              <td>${r.R3.dl.toFixed(2)} kips</td>
              <td>${r.R3.ll.toFixed(2)} kips</td>
              <td><strong>${r.R3.service.toFixed(2)} kips</strong></td>
              <td>${r.R3.factored.toFixed(2)} kips</td>
            </tr>` : ''}
          </tbody>
        </table>
      `;
    }

    const metricsCards = Array.from(document.querySelectorAll('.metric-card')).map(card => {
      const label = card.querySelector('.metric-label').textContent;
      const val = card.querySelector('.metric-value').textContent;
      const sub = card.querySelector('.metric-sub').textContent;
      return `<tr><td><strong>${label}</strong></td><td>${val}</td><td>${sub}</td></tr>`;
    }).join('');

    const body = document.getElementById('printBody');
    body.innerHTML = `
      <h3>Module Analysis Results: ${this.currentModule.toUpperCase()}</h3>
      
      ${reactionsTableHTML}

      <h4 style="margin-top:1.25rem; font-size:1rem; color:#1e293b;">SUMMARY CALCULATION CHECKS</h4>
      <table class="print-table">
        <thead>
          <tr>
            <th>Parameter / Check</th>
            <th>Calculated Value</th>
            <th>Notes / Code Allowables</th>
          </tr>
        </thead>
        <tbody>
          ${metricsCards}
        </tbody>
      </table>

      <div style="margin-top:1.5rem; page-break-inside:avoid;">
        <h4 style="font-size:1rem; color:#1e293b; margin-bottom:0.5rem;">EXPRESSED LOADS & ANALYSIS DIAGRAM DRAWING</h4>
        <img src="${canvasImgData}" style="width:100%; max-height:300px; border:1px solid #cbd5e1; border-radius:6px;">
      </div>
    `;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new StructuralApp();
});
