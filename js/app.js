/**
 * Master Application State & Event Controller
 * Features:
 * - Cross-Platform PWA & Standalone App Installation Support
 * - Custom Selected Member Print Submittal Package
 * - ASCE 7 Wind Uplift Pressure Calculator Modal (q_z Velocity Pressure & Roof Suction)
 * - Interactive Field Guide & Examples Tab for all Input Fields
 * - AISC DG1 Steel Column Base Plate & Anchor Bolts Design Engine
 * - ASCE 7 / IBC Wind Net Uplift Load Combinations & Hold-Down Tension Checks
 * - Concrete Column Pad Footing (Side 1 x Side 2 x Pad Thickness & Column Pedestal)
 * - Custom Rebar Reinforcement Selection (#3-#10 @ 4"-18" spacing)
 * - Custom File Directory Save As... (window.showSaveFilePicker) & Export/Import (.json)
 * - Multi-Member Project Management (Multiple Named Beams & Columns in 1 Project)
 */

import { AISC_DATABASE, getSectionByName } from './aisc_database.js';
import { analyzeSteelBeam, analyzeSteelColumn, findLightestSteelBeam, findLightestSteelColumn } from './steel_engine.js';
import { analyzeConcreteFooting } from './concrete_engine.js';
import { analyzeRetainingWall } from './retaining_engine.js';
import { TIMBER_SPECIES, TIMBER_MEMBERS, TIMBER_CUSTOM_SIZE_VALUE, TIMBER_FAMILY_SPECIES_CATEGORIES, analyzeTimberBeam, findLightestTimberBeam } from './timber_engine.js';
import { analyzeTimberTruss, renderTrussDiagram } from './truss_engine.js';
import { analyzeBracedWall, renderBracedWallDiagram } from './braced_wall_engine.js';
import { StructuralDiagramRenderer } from './diagram_renderer.js';

class StructuralApp {
  constructor() {
    this.currentModule = 'steel-beam';
    this.unitSystem = 'imperial';
    this.renderer = null;
    this.lastResult = null;
    this.calculatedWindPsf = 0;
    this.deferredInstallPrompt = null;
    this.masterPasscode = localStorage.getItem('structural_suite_passcode') || 'STRUCT2026';
    
    this.projects = this.loadProjectsFromStorage();
    this.activeProjectId = localStorage.getItem('structural_active_proj_id') || null;
    this.activeMemberId = null;

    this.pointLoads = [
      { P_dl: 1.5, P_ll: 3.0, pos_ft: 6.0 }
    ];

    this.tbPointLoads = [
      { P_dl: 0.5, P_ll: 1.0, pos_ft: 5.0 }
    ];

    this.init();
  }

  init() {
    this.setupAuth();
    this.setupPwaInstaller();
    this.setupProjectHub();
    this.setupProjectSidebar();
    this.setupImportExport();
    this.setupMemberManager();
    this.populateSelects();
    this.renderPointLoadsUI();
    this.renderTimberPointLoadsUI();
    this.setupEventListeners();
    this.setupSubnavTabs();
    this.setupWindCalculator();
    this.setupPrintModal();
    this.renderer = new StructuralDiagramRenderer('analysisCanvas');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => reg.unregister());
      });
    }

    if (this.activeProjectId && this.projects[this.activeProjectId]) {
      this.loadProjectState(this.activeProjectId);
    } else {
      this.openProjectHub();
    }

    this.recalculate();
  }

  setupPwaInstaller() {
    const installBtn = document.getElementById('pwaInstallBtn');
    if (!installBtn) return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      installBtn.style.display = 'inline-flex';
    });

    installBtn.addEventListener('click', async () => {
      if (!this.deferredInstallPrompt) return;
      this.deferredInstallPrompt.prompt();
      const { outcome } = await this.deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User installed the PWA app!');
      }
      this.deferredInstallPrompt = null;
      installBtn.style.display = 'none';
    });

    window.addEventListener('appinstalled', () => {
      installBtn.style.display = 'none';
      this.deferredInstallPrompt = null;
    });
  }

  setupPrintModal() {
    const modal = document.getElementById('printOptionsModal');
    const btnOpen = document.getElementById('printReportBtn');
    const btnClose = document.getElementById('closePrintModalBtn');
    const btnConfirm = document.getElementById('confirmPrintSelectedBtn');
    const btnSelectAll = document.getElementById('selectAllPrintBtn');
    const btnDeselectAll = document.getElementById('deselectAllPrintBtn');

    btnOpen.addEventListener('click', () => {
      this.renderPrintMemberChecklistUI();
      modal.classList.remove('hidden');
    });

    btnClose.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    btnSelectAll.addEventListener('click', () => {
      document.querySelectorAll('.print-mem-checkbox').forEach(cb => cb.checked = true);
    });

    btnDeselectAll.addEventListener('click', () => {
      document.querySelectorAll('.print-mem-checkbox').forEach(cb => cb.checked = false);
    });

    btnConfirm.addEventListener('click', () => {
      const selectedIds = Array.from(document.querySelectorAll('.print-mem-checkbox:checked')).map(cb => cb.value);

      if (selectedIds.length === 0) {
        alert("⚠️ Please select at least one structural member to print.");
        return;
      }

      modal.classList.add('hidden');
      this.generateSelectedMembersPrintReport(selectedIds);
      window.print();
    });
  }

  renderPrintMemberChecklistUI() {
    const container = document.getElementById('printMembersChecklist');
    const proj = this.projects[this.activeProjectId];
    if (!container || !proj || !proj.members) return;

    container.innerHTML = '';
    const memIds = Object.keys(proj.members);

    memIds.forEach(id => {
      const m = proj.members[id];
      const label = document.createElement('label');
      label.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.5rem 0.75rem;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85rem;
        color: var(--text-color);
      `;

      const isChecked = id === this.activeMemberId || memIds.length === 1;

      label.innerHTML = `
        <input type="checkbox" class="print-mem-checkbox" value="${id}" ${isChecked ? 'checked' : ''} style="width:1.1rem; height:1.1rem; accent-color:var(--primary-color);">
        <div style="flex:1;">
          <strong style="color:var(--accent-color);">${m.name}</strong>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-left:0.4rem;">(${m.module.toUpperCase()})</span>
        </div>
      `;
      container.appendChild(label);
    });
  }

  setupWindCalculator() {
    const modal = document.getElementById('windCalcModal');
    const btnOpenList = document.querySelectorAll('.open-wind-calc-btn');
    const btnClose = document.getElementById('closeWindCalcBtn');
    const btnApply = document.getElementById('applyWindBtn');

    const inputSpeed = document.getElementById('wind-speed');
    const inputExp = document.getElementById('wind-exposure');
    const inputHeight = document.getElementById('wind-height');
    const inputZone = document.getElementById('wind-zone');

    btnOpenList.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        this.computeWindPressure();
      });
    });

    btnClose.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    [inputSpeed, inputExp, inputHeight, inputZone].forEach(el => {
      if (el) {
        el.addEventListener('input', () => this.computeWindPressure());
        el.addEventListener('change', () => this.computeWindPressure());
      }
    });

    btnApply.addEventListener('click', () => {
      const psfVal = Math.round(this.calculatedWindPsf);
      if (this.currentModule === 'steel-beam') {
        document.getElementById('sb-wind-psf').value = psfVal;
      } else if (this.currentModule === 'timber') {
        document.getElementById('tb-wind-psf').value = psfVal;
      }
      modal.classList.add('hidden');
      alert(`⚡ Applied ${psfVal} psf ASCE 7 Net Wind Uplift to active module!`);
      this.recalculate();
      this.autoSaveActiveProject();
    });
  }

  computeWindPressure() {
    const V = parseFloat(document.getElementById('wind-speed').value) || 115;
    const exp = document.getElementById('wind-exposure').value;
    const h = parseFloat(document.getElementById('wind-height').value) || 20;
    const zone = document.getElementById('wind-zone').value;

    let Kz = 0.85;
    if (exp === 'B') {
      Kz = 0.575 * Math.pow(Math.max(h, 15) / 15, 0.21);
    } else if (exp === 'C') {
      Kz = 0.85 * Math.pow(Math.max(h, 15) / 15, 0.15);
    } else if (exp === 'D') {
      Kz = 1.03 * Math.pow(Math.max(h, 15) / 15, 0.12);
    }

    const Kd = 0.85;
    const Kzt = 1.0;
    const Ke = 1.0;

    const qz = 0.00256 * Kz * Kzt * Kd * Ke * Math.pow(V, 2);

    let coeffNet = 1.38;
    if (zone === 'field') coeffNet = 1.08;
    else if (zone === 'edge') coeffNet = 1.38;
    else if (zone === 'corner') coeffNet = 1.88;

    const W_psf = qz * coeffNet;
    this.calculatedWindPsf = W_psf;

    document.getElementById('res-qz').textContent = `${qz.toFixed(1)} psf`;
    document.getElementById('res-gcp').textContent = `-${coeffNet.toFixed(2)}`;
    document.getElementById('res-w-psf').textContent = `${W_psf.toFixed(1)} psf`;
  }

  setupSubnavTabs() {
    const btnInputs = document.getElementById('tabBtnInputs');
    const btnGuide = document.getElementById('tabBtnGuide');
    const panelInputs = document.getElementById('subpanel-inputs');
    const panelGuide = document.getElementById('subpanel-guide');

    btnInputs.addEventListener('click', () => {
      btnInputs.classList.add('active');
      btnInputs.style.color = 'var(--text-color)';
      btnInputs.style.borderBottomColor = 'var(--primary-color)';

      btnGuide.classList.remove('active');
      btnGuide.style.color = 'var(--text-muted)';
      btnGuide.style.borderBottomColor = 'transparent';

      panelInputs.style.display = 'block';
      panelGuide.style.display = 'none';
    });

    btnGuide.addEventListener('click', () => {
      btnGuide.classList.add('active');
      btnGuide.style.color = 'var(--text-color)';
      btnGuide.style.borderBottomColor = 'var(--primary-color)';

      btnInputs.classList.remove('active');
      btnInputs.style.color = 'var(--text-muted)';
      btnInputs.style.borderBottomColor = 'transparent';

      panelInputs.style.display = 'none';
      panelGuide.style.display = 'flex';

      this.renderFieldGuideContent();
    });
  }

  renderFieldGuideContent() {
    const container = document.getElementById('guideContentList');
    if (!container) return;

    container.innerHTML = '';
    const guides = this.getFieldGuideDataForModule(this.currentModule);

    guides.forEach(g => {
      const card = document.createElement('div');
      card.style.cssText = `
        background: rgba(30, 41, 59, 0.4);
        border: 1px solid var(--panel-border);
        border-radius: 8px;
        padding: 0.85rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      `;
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-weight:700; font-size:0.95rem; color:var(--accent-color);">${g.title}</div>
          <div style="font-size:0.75rem; background:rgba(59, 130, 246, 0.15); color:var(--primary-color); padding:0.15rem 0.5rem; border-radius:4px; font-weight:600;">${g.units}</div>
        </div>
        <div style="font-size:0.85rem; color:var(--text-color); line-height:1.4;">${g.desc}</div>
        <div style="font-size:0.8rem; background:rgba(255,255,255,0.03); border-left:3px solid #10b981; padding:0.4rem 0.6rem; border-radius:0 4px 4px 0; margin-top:0.2rem;">
          <strong style="color:#10b981;">💡 Typical Example:</strong> <span style="color:var(--text-muted);">${g.example}</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  getFieldGuideDataForModule(moduleName) {
    switch (moduleName) {
      case 'steel-beam':
        return [
          { title: "Main Span L1", units: "Feet (ft)", desc: "Clear span distance between primary beam bearing supports.", example: "20 ft for a garage door header or 16 ft for a floor girder." },
          { title: "Side A & Side B Tributary Widths", units: "Feet (ft)", desc: "Distance from beam centerline to mid-span of joists on Left (Side A) and Right (Side B). Allows asymmetric loading.", example: "Side A = 6 ft (left floor joists 12ft span), Side B = 4 ft (right hallway)." },
          { title: "Dead Load (DL)", units: "PSF or PLF", desc: "Permanent structural self-weight of subflooring, joists, drywall, shingles, and mechanical systems.", example: "10-15 psf for wood floor framing; 20-25 psf for concrete deck on metal pan." },
          { title: "Live Load (LL)", units: "PSF or PLF", desc: "Transient occupancy loads from people, furniture, snow, and movable equipment.", example: "40 psf for residential rooms, 50 psf for office, 100 psf for commercial assembly/deck." },
          { title: "Wind Net Uplift Load (W)", units: "PSF or PLF", desc: "ASCE 7 net upward wind suction pressure acting on roof or canopy overhangs.", example: "16-25 psf net uplift in coastal hurricane zones or high roof corners." },
          { title: "Concentrated Point Loads", units: "Kips (k)", desc: "Heavy point loads from intersecting post supports, trimmers, or rooftop HVAC units (1 kip = 1,000 lbs).", example: "P_DL = 1.5 k, P_LL = 3.0 k located at 6.0 ft from left support." },
          { title: "Steel Yield Strength (Fy)", units: "ksi", desc: "Yield stress capacity of structural steel material.", example: "50 ksi for AISC A992 W-Beams, 36 ksi for A36 channels/angles, 46 ksi for HSS tubing." },
          { title: "Deflection Limits (L/360, L/240)", units: "Ratio", desc: "IBC Code limits for serviceability deflection to prevent plaster cracking or sagging floors.", example: "L/360 live load limit = 0.667 in for a 20ft span." }
        ];

      case 'steel-column':
        return [
          { title: "Unbraced Column Height (L)", units: "Feet (ft)", desc: "Total unsupported length of column between lateral bracing levels.", example: "10-12 ft for typical story height." },
          { title: "Effective Length Factor (K)", units: "Ratio", desc: "Buckling length factor based on column end support restraint conditions (AISC Table C-A-7.1).", example: "K = 1.0 for pinned top & bottom; K = 0.8 for fixed base & pinned top; K = 2.1 for cantilever." },
          { title: "Applied Axial Gravity Load (P_axial)", units: "Kips (k)", desc: "Total downward service axial load supported by column top cap plate.", example: "35 kips (35,000 lbs) transferred from roof girders." },
          { title: "Wind Net Uplift Tension (P_uplift)", units: "Kips (k)", desc: "Upward net tension force trying to pull column off foundation during ASCE 7 wind storms.", example: "5.0 kips net tension uplift." },
          { title: "Base Plate Width & Length (B x N)", units: "Inches (in)", desc: "Dimensions of steel base plate welded to column bottom to distribute weight over concrete.", example: "12 in x 12 in base plate for an HSS 6x6 column." },
          { title: "Base Plate Thickness (tp)", units: "Inches (in)", desc: "Thickness of base plate required to prevent plate bending yield from concrete bearing pressure.", example: "3/4 in (0.750 in) thick A36 steel plate." },
          { title: "Anchor Rods (#, Dia, Grade)", units: "Count / Dia / Grade", desc: "Quantity, diameter, and steel specification of anchor bolts embedded in concrete foundation.", example: "(4) 3/4 in diameter F1554 Grade 36 or Grade 55 anchor rods." }
        ];

      case 'footing':
        return [
          { title: "Footing Pad Side 1 & Side 2 (B x L)", units: "Feet (ft)", desc: "Plan dimensions of rectangular or square concrete pad footing resting on soil.", example: "5.0 ft x 5.0 ft pad footing (25 sq. ft bearing area)." },
          { title: "Footing Thickness (t)", units: "Inches (in)", desc: "Depth/thickness of footing pad to resist 2-way punching shear and 1-way flexural shear.", example: "14-16 in depth for standard column footings." },
          { title: "Column Pedestal Size (B_col x L_col)", units: "Inches (in)", desc: "Dimensions of concrete pier or column resting directly on top of footing pad.", example: "12 in x 12 in pedestal." },
          { title: "Allowable Soil Pressure (q_allow)", units: "KSF (k/ft²)", desc: "Maximum allowable net soil bearing capacity recommended in Geotechnical Report.", example: "3.0 ksf (3,000 psf) for firm clay/sand; 1.5 ksf for loose soil." },
          { title: "Concrete Strength (f'c)", units: "PSI", desc: "28-day compressive strength of concrete mix.", example: "3,000 psi for standard footings; 4,000 psi for commercial pads." },
          { title: "Rebar Schedule (# & Spacing)", units: "Size @ Inches", desc: "Flexural steel rebar mat placed at bottom of pad footing (with 3in clear cover).", example: "#5 bars @ 12 in o.c. each way." }
        ];

      case 'retaining':
        return [
          { title: "Retaining Wall Height (H)", units: "Feet (ft)", desc: "Total vertical height of retained earth from top of footing to top of stem wall.", example: "10.0 ft stem wall height." },
          { title: "Footing Base Width (B)", units: "Feet (ft)", desc: "Total width of concrete footing base slab (Toe + Heel). Typically 50%-70% of wall height.", example: "6.5 ft base width for a 10ft wall." },
          { title: "Soil Unit Weight (γ)", units: "PCF (lb/ft³)", desc: "Total moist density of backfill soil behind wall.", example: "120 pcf for compacted sand/gravel." },
          { title: "Internal Friction Angle (φ)", units: "Degrees (°)", desc: "Soil shear strength angle used to calculate Rankine active lateral pressure coefficient (Ka).", example: "30° for well-drained gravelly soil; 25° for clay." },
          { title: "Surcharge Load", units: "PSF", desc: "Uniform live load acting on surface behind wall (driveway, parking lot, slopes).", example: "100 psf for residential driveway traffic." }
        ];

      case 'timber':
        return [
          { title: "Built-Up Plies (# of Plies)", units: "Count", desc: "Number of 2x or LVL plies nailed/bolted together to form a header or beam.", example: "2-Ply or 3-Ply 2x10 header over a garage door." },
          { title: "Ply Width & Depth", units: "Inches (in)", desc: "Actual width and depth of each individual wood ply.", example: "1.5 in width x 9.25 in depth for actual 2x10 lumber." },
          { title: "Wood Species & Grade", units: "Name", desc: "Lumber species classification determining allowable NDS design stresses (Fb, Fv, E).", example: "Douglas Fir-Larch No.2 (Fb = 900 psi, E = 1.6M psi) or Southern Pine No.1." },
          { title: "Engineered Wood Products", units: "Family", desc: "High-performance manufactured wood including LVL (Laminated Veneer Lumber), Glulam, PSL Parallam, and TJI I-Joists.", example: "1-3/4 in x 11-7/8 in LVL 2.0E header." }
        ];

      case 'braced-wall':
        return [
          { title: "Wall Construction Material", units: "Wood vs CMU", desc: "Select Wood Stud framing with structural panel sheathing (IRC R602.10) or Reinforced Concrete Masonry Unit block wall (TMS 402).", example: "Wood Stud framing for residential exterior walls; CMU block for commercial or fire-rated walls." },
          { title: "Basic Wind Speed (V)", units: "MPH", desc: "ASCE 7-16 / 7-22 ultimate design wind speed for project location.", example: "115 mph for inland regions, 140-150 mph for coastal hurricane regions." },
          { title: "Wind Exposure Category", units: "B, C, D", desc: "Ground surface roughness category. Exposure B = suburban/wooded; Exposure C = open flat fields/open terrain; Exposure D = coastal.", example: "Exposure C for rural flat land or open field sites." },
          { title: "Wall Height (H)", units: "Feet (ft)", desc: "Clear vertical story height of braced wall panel from foundation to top plate.", example: "9.0 ft wall height for standard story." },
          { title: "Tributary Building Width", units: "Feet (ft)", desc: "Total width of building tributary to the braced wall line (half of building depth on each side).", example: "28.0 ft building width." },
          { title: "Total Provided Braced Wall Length", units: "Feet (ft)", desc: "Sum of lengths of all full-height qualifying braced wall segments along the wall line.", example: "12.0 ft total braced panel length." },
          { title: "Wood Sheathing & Nailing Edge Spacing", units: "Method / Inches", desc: "Sheathing material (7/16 OSB, 15/32 Plywood, Gypsum Board) and perimeter nail edge spacing (8d common nails @ 6, 4, 3, or 2 in o.c.).", example: "7/16 OSB with 8d @ 4 in o.c. edge nailing yields 380 plf shear capacity." },
          { title: "Hold-Down Tension Force (T_hd)", units: "Lbs", desc: "Overturning tension force at panel end posts requiring Simpson Strong-Tie HDU / HTT anchor brackets.", example: "T = 3,450 lbs requires Simpson HDU5 anchor bracket." }
        ];

      default:
        return [];
    }
  }

  setupAuth() {
    const authOverlay = document.getElementById('authOverlay');
    const authForm = document.getElementById('authForm');
    const passcodeInput = document.getElementById('passcodeInput');
    const errorMsg = document.getElementById('authErrorMsg');

    if (!authOverlay || !authForm) return;

    const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    if (isLocalhost) {
      sessionStorage.setItem('structural_suite_auth', 'true');
    }

    const isAuthenticated = sessionStorage.getItem('structural_suite_auth') === 'true';

    if (isAuthenticated) {
      authOverlay.classList.add('hidden');
      authOverlay.style.display = 'none';
    } else {
      authOverlay.classList.remove('hidden');
      authOverlay.style.display = 'flex';
    }

    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredCode = passcodeInput.value.trim();

      if (enteredCode === this.masterPasscode || enteredCode === 'STRUCT2026' || isLocalhost) {
        sessionStorage.setItem('structural_suite_auth', 'true');
        authOverlay.classList.add('hidden');
        authOverlay.style.display = 'none';
        errorMsg.style.display = 'none';
        passcodeInput.value = '';
        this.recalculate();
      } else {
        errorMsg.style.display = 'block';
        passcodeInput.value = '';
        passcodeInput.focus();
      }
    });

    document.getElementById('lockAppBtn')?.addEventListener('click', () => {
      sessionStorage.removeItem('structural_suite_auth');
      authOverlay.classList.remove('hidden');
      authOverlay.style.display = 'flex';
      passcodeInput.focus();
    });
  }

  loadProjectsFromStorage() {
    try {
      return JSON.parse(localStorage.getItem('structural_suite_projects')) || {};
    } catch(e) {
      return {};
    }
  }

  saveProjectsToStorage() {
    localStorage.setItem('structural_suite_projects', JSON.stringify(this.projects));
  }

  setupImportExport() {
    document.getElementById('exportProjBtn')?.addEventListener('click', () => this.exportProjectFile());
    document.getElementById('saveAsProjBtn')?.addEventListener('click', () => this.saveProjectAsFile());

    const handleFileImport = (fileInput) => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported && imported.id && imported.name) {
            this.projects[imported.id] = imported;
            this.saveProjectsToStorage();
            this.loadProjectState(imported.id);
            this.closeProjectHub();
            alert(`✅ Project "${imported.name}" successfully imported!`);
          } else {
            alert('⚠️ Invalid project file format.');
          }
        } catch(err) {
          alert('⚠️ Error reading project file: ' + err.message);
        }
      };
      reader.readAsText(file);
    };

    document.getElementById('hubImportFileInput')?.addEventListener('change', (e) => handleFileImport(e.target));
    document.getElementById('headerImportFileInput')?.addEventListener('change', (e) => handleFileImport(e.target));
  }

  async saveProjectAsFile() {
    if (!this.activeProjectId || !this.projects[this.activeProjectId]) {
      alert('⚠️ No active project to save.');
      return;
    }
    this.autoSaveActiveProject();
    const proj = this.projects[this.activeProjectId];
    const jsonString = JSON.stringify(proj, null, 2);
    const safeName = proj.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: `${safeName}_project.json`,
          types: [{
            description: 'Structural Calculator Project File (*.json)',
            accept: { 'application/json': ['.json'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(jsonString);
        await writable.close();
        alert(`💾 Project successfully saved to your selected directory!`);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    this.exportProjectFile();
  }

  exportProjectFile() {
    if (!this.activeProjectId || !this.projects[this.activeProjectId]) {
      alert('⚠️ No active project to export.');
      return;
    }
    this.autoSaveActiveProject();
    const proj = this.projects[this.activeProjectId];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proj, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeName = proj.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${safeName}_project.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  setupProjectSidebar() {
    const sidebar = document.getElementById('projectSidebar');
    const overlay = document.getElementById('projectSidebarOverlay');
    const toggleBtn = document.getElementById('toggleProjectSidebarBtn');
    const closeBtn = document.getElementById('closeProjectSidebarBtn');
    const searchInput = document.getElementById('sidebarComponentSearch');
    const addBtn = document.getElementById('sidebarAddMemberBtn');
    const printBtn = document.getElementById('sidebarPrintBtn');

    if (!sidebar || !toggleBtn) return;

    const openSidebar = () => {
      this.renderSidebarComponentsListUI();
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('open');
    };

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    };

    toggleBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.renderSidebarComponentsListUI();
      });
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.addNewMemberToProject();
        this.renderSidebarComponentsListUI();
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        closeSidebar();
        document.getElementById('printReportBtn')?.click();
      });
    }
  }

  renderSidebarComponentsListUI() {
    const container = document.getElementById('sidebarComponentsList');
    const projNameEl = document.getElementById('sidebarProjName');
    const countEl = document.getElementById('sidebarMemCount');
    const searchInput = document.getElementById('sidebarComponentSearch');
    const proj = this.projects[this.activeProjectId];

    if (!container || !proj || !proj.members) return;

    if (projNameEl) projNameEl.textContent = `Active Project: ${proj.name}`;

    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    container.innerHTML = '';

    const memIds = Object.keys(proj.members);
    if (countEl) countEl.textContent = memIds.length;

    const filteredIds = memIds.filter(id => {
      const m = proj.members[id];
      if (!searchQuery) return true;
      return m.name.toLowerCase().includes(searchQuery) || m.module.toLowerCase().includes(searchQuery);
    });

    if (filteredIds.length === 0) {
      container.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem; font-style:italic; padding:1rem; text-align:center;">No matching components found.</div>`;
      return;
    }

    const moduleIcons = {
      'steel-beam': '🌉',
      'steel-column': '🏛️',
      'footing': '🧱',
      'retaining': '📐',
      'timber': '🪵',
      'truss': '🔺',
      'braced-wall': '🛡️'
    };

    const moduleLabels = {
      'steel-beam': 'Steel Beam',
      'steel-column': 'Steel Column',
      'footing': 'Concrete Footing',
      'retaining': 'Retaining Wall',
      'timber': 'Timber Beam',
      'truss': 'Timber Truss',
      'braced-wall': 'Braced Wall'
    };

    filteredIds.forEach(id => {
      const m = proj.members[id];
      const isActive = id === this.activeMemberId;
      const icon = moduleIcons[m.module] || '🧩';
      const label = moduleLabels[m.module] || m.module.toUpperCase();

      const card = document.createElement('div');
      card.className = `sidebar-card ${isActive ? 'active' : ''}`;
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem;">
          <div style="display:flex; align-items:center; gap:0.5rem; flex:1;">
            <span style="font-size:1.25rem;">${icon}</span>
            <div>
              <div style="font-weight:700; font-size:0.9rem; color:var(--text-color);">${m.name}</div>
              <span style="font-size:0.7rem; font-weight:600; background:rgba(59, 130, 246, 0.15); color:var(--primary-color); padding:0.1rem 0.4rem; border-radius:3px;">${label}</span>
            </div>
          </div>
          ${isActive ? '<span style="font-size:0.75rem; color:var(--pass-color); font-weight:700;">● Active</span>' : ''}
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.35rem; margin-top:0.25rem;">
          <button class="btn btn-outline select-mem-btn" data-id="${id}" style="padding:0.25rem 0.5rem; font-size:0.75rem;">Open</button>
          <button class="btn btn-outline dup-mem-btn" data-id="${id}" title="Duplicate Component" style="padding:0.25rem 0.4rem; font-size:0.75rem;">📋</button>
          <button class="btn btn-outline del-mem-btn" data-id="${id}" title="Delete Component" style="padding:0.25rem 0.4rem; font-size:0.75rem; color:var(--fail-color); border-color:var(--fail-color);">&times;</button>
        </div>
      `;

      card.querySelector('.select-mem-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.switchMember(id);
        this.renderSidebarComponentsListUI();
      });

      card.querySelector('.dup-mem-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.duplicateMemberInProject(id);
      });

      card.querySelector('.del-mem-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (memIds.length <= 1) {
          alert("⚠️ A project must have at least one structural member.");
          return;
        }
        if (confirm(`Delete component "${m.name}"?`)) {
          delete proj.members[id];
          if (this.activeMemberId === id) {
            const remaining = Object.keys(proj.members);
            this.switchMember(remaining[0]);
          }
          this.renderSidebarComponentsListUI();
          this.autoSaveActiveProject();
        }
      });

      card.addEventListener('click', () => {
        this.switchMember(id);
        this.renderSidebarComponentsListUI();
      });

      container.appendChild(card);
    });
  }

  duplicateMemberInProject(memId) {
    const proj = this.projects[this.activeProjectId];
    if (!proj || !proj.members || !proj.members[memId]) return;

    const sourceMem = proj.members[memId];
    const newId = 'mem_' + Date.now();
    const newName = `${sourceMem.name} (Copy)`;

    proj.members[newId] = {
      id: newId,
      name: newName,
      module: sourceMem.module,
      data: JSON.parse(JSON.stringify(sourceMem.data || {}))
    };

    this.switchMember(newId);
    this.renderSidebarComponentsListUI();
    this.autoSaveActiveProject();
  }

  setupProjectHub() {
    const hubOverlay = document.getElementById('projectDashboard');
    const newProjForm = document.getElementById('newProjectForm');

    document.getElementById('openHubBtn').addEventListener('click', () => {
      this.openProjectHub();
    });

    newProjForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawName = document.getElementById('newProjName').value.trim();
      const name = rawName || `Project ${Object.keys(this.projects).length + 1}`;
      const client = document.getElementById('newProjClient')?.value?.trim() || '';
      const engineer = document.getElementById('newProjEngineer')?.value?.trim() || '';
      const company = document.getElementById('newProjCompany')?.value?.trim() || '';
      const startModule = document.getElementById('newProjModule')?.value || 'steel-beam';

      const projId = 'proj_' + Date.now();
      const firstMemId = 'mem_1';

      const newProj = {
        id: projId,
        name,
        client,
        engineer,
        company,
        createdAt: new Date().toLocaleDateString(),
        members: {
          [firstMemId]: {
            id: firstMemId,
            name: "B-1 Main Beam",
            module: startModule,
            data: {}
          }
        },
        activeMemberId: firstMemId
      };

      this.projects[projId] = newProj;
      this.saveProjectsToStorage();
      this.activeProjectId = projId;
      localStorage.setItem('structural_active_proj_id', projId);

      if (engineer) document.getElementById('rep-engineer').value = engineer;
      if (company) document.getElementById('rep-company').value = company;
      if (name) document.getElementById('rep-project').value = name;
      if (client) document.getElementById('rep-client').value = client;

      this.loadProjectState(projId);
      this.closeProjectHub();
    });

    this.renderProjectsListUI();
  }

  openProjectHub() {
    this.renderProjectsListUI();
    const el = document.getElementById('projectDashboard');
    if (el) {
      el.classList.remove('hidden');
      el.style.display = 'flex';
    }
  }

  closeProjectHub() {
    const el = document.getElementById('projectDashboard');
    if (el) {
      el.classList.add('hidden');
      el.style.display = 'none';
    }
  }

  renderProjectsListUI() {
    const container = document.getElementById('projectsList');
    if (!container) return;

    container.innerHTML = '';
    const projIds = Object.keys(this.projects);

    if (projIds.length === 0) {
      container.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem; font-style:italic; padding:1rem; text-align:center;">No saved projects yet. Create your first project on the left!</div>`;
      return;
    }

    projIds.reverse().forEach(id => {
      const proj = this.projects[id];
      const memCount = proj.members ? Object.keys(proj.members).length : 1;
      const item = document.createElement('div');
      item.className = 'proj-item';
      item.innerHTML = `
        <div style="flex:1;">
          <div style="font-weight:700; font-size:0.95rem;">${proj.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">
            Members: ${memCount} | Created: ${proj.createdAt} ${proj.client ? '| Client: ' + proj.client : ''}
          </div>
        </div>
        <div style="display:flex; gap:0.4rem;">
          <button class="btn btn-primary load-proj-btn" data-id="${id}" style="padding:0.35rem 0.65rem; font-size:0.8rem;">Open Project</button>
          <button class="btn btn-outline del-proj-btn" data-id="${id}" style="padding:0.35rem 0.5rem; font-size:0.8rem; color:var(--fail-color); border-color:var(--fail-color);">&times;</button>
        </div>
      `;
      container.appendChild(item);
    });

    container.querySelectorAll('.load-proj-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.loadProjectState(id);
        this.closeProjectHub();
      });
    });

    container.querySelectorAll('.del-proj-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (confirm(`Are you sure you want to delete project "${this.projects[id].name}"?`)) {
          delete this.projects[id];
          if (this.activeProjectId === id) {
            this.activeProjectId = null;
            localStorage.removeItem('structural_active_proj_id');
          }
          this.saveProjectsToStorage();
          this.renderProjectsListUI();
        }
      });
    });
  }

  setupMemberManager() {
    const memberSelect = document.getElementById('memberSelector');
    const nameInput = document.getElementById('memberNameInput');
    const addBtn = document.getElementById('addMemberBtn');
    const delBtn = document.getElementById('deleteMemberBtn');

    memberSelect.addEventListener('change', (e) => {
      this.switchMember(e.target.value);
    });

    nameInput.addEventListener('input', (e) => {
      const proj = this.projects[this.activeProjectId];
      if (proj && this.activeMemberId && proj.members[this.activeMemberId]) {
        proj.members[this.activeMemberId].name = e.target.value;
        this.renderMemberSelectorUI();
        this.autoSaveActiveProject();
      }
    });

    addBtn.addEventListener('click', () => {
      this.addNewMemberToProject();
    });

    delBtn.addEventListener('click', () => {
      this.deleteActiveMember();
    });

    document.getElementById('transferR1Btn')?.addEventListener('click', () => this.transferReactionToColumn('R1'));
    document.getElementById('transferR2Btn')?.addEventListener('click', () => this.transferReactionToColumn('R2'));
  }

  addNewMemberToProject(customName = null, customModule = null, initialData = {}) {
    const proj = this.projects[this.activeProjectId];
    if (!proj) return;

    if (!proj.members) proj.members = {};
    const count = Object.keys(proj.members).length + 1;
    const memId = 'mem_' + Date.now();
    const name = customName || `Member M-${count}`;
    const module = customModule || this.currentModule;

    proj.members[memId] = {
      id: memId,
      name,
      module,
      data: initialData
    };

    this.activeMemberId = memId;
    proj.activeMemberId = memId;
    this.renderMemberSelectorUI();
    this.switchMember(memId);
    this.autoSaveActiveProject();
  }

  deleteActiveMember() {
    const proj = this.projects[this.activeProjectId];
    if (!proj || !proj.members) return;

    const memIds = Object.keys(proj.members);
    if (memIds.length <= 1) {
      alert("⚠️ A project must have at least one structural member.");
      return;
    }

    if (confirm(`Delete active member "${proj.members[this.activeMemberId].name}"?`)) {
      delete proj.members[this.activeMemberId];
      const remainingIds = Object.keys(proj.members);
      this.switchMember(remainingIds[0]);
    }
  }

  switchMember(memId) {
    const proj = this.projects[this.activeProjectId];
    if (!proj || !proj.members || !proj.members[memId]) return;

    this.activeMemberId = memId;
    proj.activeMemberId = memId;
    const mem = proj.members[memId];

    document.getElementById('memberNameInput').value = mem.name;

    if (mem.data) {
      this.applyMemberDataToInputs(mem.data);
    }

    this.switchModule(mem.module || 'steel-beam');
    this.renderMemberSelectorUI();
    this.recalculate();
  }

  renderMemberSelectorUI() {
    const select = document.getElementById('memberSelector');
    const proj = this.projects[this.activeProjectId];
    if (!select || !proj || !proj.members) return;

    select.innerHTML = '';
    Object.keys(proj.members).forEach(id => {
      const m = proj.members[id];
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = `${m.name} (${m.module.toUpperCase()})`;
      select.appendChild(opt);
    });

    if (this.activeMemberId) {
      select.value = this.activeMemberId;
    }
    this.renderSidebarComponentsListUI();
  }

  transferReactionToColumn(supportPoint) {
    if (!this.lastResult || !this.lastResult.reactions) {
      alert("⚠️ Please run a beam calculation first to get reaction forces.");
      return;
    }

    const r = this.lastResult.reactions;
    const rxn = r[supportPoint];
    if (!rxn) return;

    const beamMemName = this.projects[this.activeProjectId]?.members[this.activeMemberId]?.name || "Beam";
    const colMemName = `Column for ${beamMemName} (${supportPoint})`;
    const axialLoadKips = rxn.service.toFixed(1);
    const upliftKips = rxn.uplift ? rxn.uplift.toFixed(1) : 0;

    const isSteel = this.currentModule === 'steel-beam';
    const targetModule = isSteel ? 'steel-column' : 'timber';

    this.addNewMemberToProject(colMemName, targetModule, { sc_axial: axialLoadKips, sc_wind_uplift: upliftKips });

    document.getElementById('sc-axial').value = axialLoadKips;
    if (document.getElementById('sc-wind-uplift')) {
      document.getElementById('sc-wind-uplift').value = upliftKips;
    }
    alert(`⚡ Linked Reaction ${supportPoint} (${axialLoadKips} kips gravity | ${upliftKips} kips wind uplift) to new Column "${colMemName}"!`);
    this.recalculate();
  }

  loadProjectState(projId) {
    const proj = this.projects[projId];
    if (!proj) return;

    this.activeProjectId = projId;
    localStorage.setItem('structural_active_proj_id', projId);

    document.getElementById('activeProjName').textContent = proj.name;

    if (proj.engineer) document.getElementById('rep-engineer').value = proj.engineer;
    if (proj.company) document.getElementById('rep-company').value = proj.company;
    if (proj.name) document.getElementById('rep-project').value = proj.name;
    if (proj.client) document.getElementById('rep-client').value = proj.client;

    if (!proj.members || Object.keys(proj.members).length === 0) {
      const firstId = 'mem_1';
      proj.members = {
        [firstId]: { id: firstId, name: "B-1 Main Beam", module: proj.module || 'steel-beam', data: proj.data || {} }
      };
    }

    const activeId = proj.activeMemberId || Object.keys(proj.members)[0];
    this.switchMember(activeId);
  }

  applyMemberDataToInputs(data) {
    if (data.sb_family) document.getElementById('sb-family').value = data.sb_family;
    this.updateBeamShapes();
    if (data.sb_shape) document.getElementById('sb-shape').value = data.sb_shape;
    if (data.sb_span) document.getElementById('sb-span').value = data.sb_span;

    if (data.sb_trib_left) document.getElementById('sb-trib-left').value = data.sb_trib_left;
    if (data.sb_trib_right) document.getElementById('sb-trib-right').value = data.sb_trib_right;
    if (data.sb_dl_left) document.getElementById('sb-dl-left').value = data.sb_dl_left;
    if (data.sb_dl_right) document.getElementById('sb-dl-right').value = data.sb_dl_right;
    if (data.sb_ll_left) document.getElementById('sb-ll-left').value = data.sb_ll_left;
    if (data.sb_ll_right) document.getElementById('sb-ll-right').value = data.sb_ll_right;
    if (data.sb_wind_psf) document.getElementById('sb-wind-psf').value = data.sb_wind_psf;
    if (data.sb_wind_plf) document.getElementById('sb-wind-plf').value = data.sb_wind_plf;

    if (data.sc_axial) document.getElementById('sc-axial').value = data.sc_axial;
    if (data.sc_wind_uplift) document.getElementById('sc-wind-uplift').value = data.sc_wind_uplift;

    if (data.bp_width) document.getElementById('bp-width').value = data.bp_width;
    if (data.bp_length) document.getElementById('bp-length').value = data.bp_length;
    if (data.bp_thick) document.getElementById('bp-thick').value = data.bp_thick;
    if (data.bp_fy) document.getElementById('bp-fy').value = data.bp_fy;

    if (data.ab_qty) document.getElementById('ab-qty').value = data.ab_qty;
    if (data.ab_dia) document.getElementById('ab-dia').value = data.ab_dia;
    if (data.ab_grade) document.getElementById('ab-grade').value = data.ab_grade;
    if (data.ab_embed) document.getElementById('ab-embed').value = data.ab_embed;

    if (data.cf_width) document.getElementById('cf-width').value = data.cf_width;
    if (data.cf_length) document.getElementById('cf-length').value = data.cf_length;
    if (data.cf_thick) document.getElementById('cf-thick').value = data.cf_thick;
    if (data.cf_col_w) document.getElementById('cf-col-w').value = data.cf_col_w;
    if (data.cf_col_l) document.getElementById('cf-col-l').value = data.cf_col_l;
    if (data.cf_puplift) document.getElementById('cf-puplift').value = data.cf_puplift;
    if (data.cf_rebar_mode) document.getElementById('cf-rebar-mode').value = data.cf_rebar_mode;
    if (data.cf_bar_size) document.getElementById('cf-bar-size').value = data.cf_bar_size;
    if (data.cf_bar_spacing) document.getElementById('cf-bar-spacing').value = data.cf_bar_spacing;

    if (data.tb_family) document.getElementById('tb-family').value = data.tb_family;
    this.updateTimberMembers();
    if (data.tb_species) document.getElementById('tb-species').value = data.tb_species;
    if (data.tb_plies) document.getElementById('tb-plies').value = data.tb_plies;
    if (data.tb_ply_width) document.getElementById('tb-ply-width').value = data.tb_ply_width;
    if (data.tb_depth) document.getElementById('tb-depth').value = data.tb_depth;
    if (data.tb_size) document.getElementById('tb-size').value = data.tb_size;
    if (data.tb_custom_width) document.getElementById('tb-custom-width').value = data.tb_custom_width;
    if (data.tb_custom_depth) document.getElementById('tb-custom-depth').value = data.tb_custom_depth;
    this.updateCustomTimberSizeVisibility();

    if (data.tb_trib_left) document.getElementById('tb-trib-left').value = data.tb_trib_left;
    if (data.tb_trib_right) document.getElementById('tb-trib-right').value = data.tb_trib_right;
    if (data.tb_dl_left) document.getElementById('tb-dl-left').value = data.tb_dl_left;
    if (data.tb_dl_right) document.getElementById('tb-dl-right').value = data.tb_dl_right;
    if (data.tb_ll_left) document.getElementById('tb-ll-left').value = data.tb_ll_left;
    if (data.tb_ll_right) document.getElementById('tb-ll-right').value = data.tb_ll_right;
    if (data.tb_wind_psf) document.getElementById('tb-wind-psf').value = data.tb_wind_psf;
    if (data.tb_wind_plf) document.getElementById('tb-wind-plf').value = data.tb_wind_plf;

    if (data.pointLoads) this.pointLoads = data.pointLoads;
    if (data.tbPointLoads) this.tbPointLoads = data.tbPointLoads;

    if (data.bw_wall_type) document.getElementById('bw-wall-type').value = data.bw_wall_type;
    if (data.bw_top_restraint) document.getElementById('bw-top-restraint').value = data.bw_top_restraint;
    if (data.bw_total_length) document.getElementById('bw-total-length').value = data.bw_total_length;
    if (data.bw_openings_pct) document.getElementById('bw-openings-pct').value = data.bw_openings_pct;
    if (data.bw_wind_speed) document.getElementById('bw-wind-speed').value = data.bw_wind_speed;
    if (data.bw_wind_psf) document.getElementById('bw-wind-psf').value = data.bw_wind_psf;
    if (data.bw_exposure) document.getElementById('bw-exposure').value = data.bw_exposure;
    if (data.bw_wall_height) document.getElementById('bw-wall-height').value = data.bw_wall_height;
    if (data.bw_trib_width) document.getElementById('bw-trib-width').value = data.bw_trib_width;
    if (data.bw_dead_load) document.getElementById('bw-dead-load').value = data.bw_dead_load;
    if (data.bw_provided_length) document.getElementById('bw-provided-length').value = data.bw_provided_length;
    if (data.bw_num_panels) document.getElementById('bw-num-panels').value = data.bw_num_panels;
    if (data.bw_sheathing) document.getElementById('bw-sheathing').value = data.bw_sheathing;
    if (data.bw_nail_spacing) document.getElementById('bw-nail-spacing').value = data.bw_nail_spacing;
    if (data.bw_stud_size) document.getElementById('bw-stud-size').value = data.bw_stud_size;
    if (data.bw_stud_spacing) document.getElementById('bw-stud-spacing').value = data.bw_stud_spacing;
    if (data.bw_cmu_size) document.getElementById('bw-cmu-size').value = data.bw_cmu_size;
    if (data.bw_cmu_grout) document.getElementById('bw-cmu-grout').value = data.bw_cmu_grout;
  }

  autoSaveActiveProject() {
    if (!this.activeProjectId || !this.projects[this.activeProjectId]) return;

    const getVal = (id, fallback = '') => {
      const el = document.getElementById(id);
      return el ? el.value : fallback;
    };

    const proj = this.projects[this.activeProjectId];
    if (this.activeMemberId && proj.members && proj.members[this.activeMemberId]) {
      proj.members[this.activeMemberId].module = this.currentModule;
    }

    const data = {
      sb_family: getVal('sb-family'),
      sb_shape: getVal('sb-shape'),
      sb_span: getVal('sb-span'),
      sb_trib_left: getVal('sb-trib-left'),
      sb_trib_right: getVal('sb-trib-right'),
      sb_dl_left: getVal('sb-dl-left'),
      sb_dl_right: getVal('sb-dl-right'),
      sb_ll_left: getVal('sb-ll-left'),
      sb_ll_right: getVal('sb-ll-right'),
      sb_wind_psf: getVal('sb-wind-psf'),
      sb_wind_plf: getVal('sb-wind-plf'),
      sc_shape: getVal('sc-shape'),
      sc_axial: getVal('sc-axial'),
      sc_wind_uplift: getVal('sc-wind-uplift'),
      bp_width: getVal('bp-width'),
      bp_length: getVal('bp-length'),
      bp_thick: getVal('bp-thick'),
      bp_fy: getVal('bp-fy'),
      ab_qty: getVal('ab-qty'),
      ab_dia: getVal('ab-dia'),
      ab_grade: getVal('ab-grade'),
      ab_embed: getVal('ab-embed'),
      cf_pdead: getVal('cf-pdead'),
      cf_plive: getVal('cf-plive'),
      cf_puplift: getVal('cf-puplift'),
      cf_width: getVal('cf-width'),
      cf_length: getVal('cf-length'),
      cf_thick: getVal('cf-thick'),
      cf_col_w: getVal('cf-col-w'),
      cf_col_l: getVal('cf-col-l'),
      cf_qallow: getVal('cf-qallow'),
      cf_fc: getVal('cf-fc'),
      cf_rebar_mode: getVal('cf-rebar-mode'),
      cf_bar_size: getVal('cf-bar-size'),
      cf_bar_spacing: getVal('cf-bar-spacing'),
      rw_height: getVal('rw-height'),
      rw_condition: getVal('rw-condition'),
      rw_brace_spacing: getVal('rw-brace-spacing'),
      rw_material: getVal('rw-material'),
      tb_family: getVal('tb-family'),
      tb_species: getVal('tb-species'),
      tb_plies: getVal('tb-plies'),
      tb_ply_width: getVal('tb-ply-width'),
      tb_depth: getVal('tb-depth'),
      tb_size: getVal('tb-size'),
      tb_custom_width: getVal('tb-custom-width'),
      tb_custom_depth: getVal('tb-custom-depth'),
      tb_trib_left: getVal('tb-trib-left'),
      tb_trib_right: getVal('tb-trib-right'),
      tb_dl_left: getVal('tb-dl-left'),
      tb_dl_right: getVal('tb-dl-right'),
      tb_ll_left: getVal('tb-ll-left'),
      tb_ll_right: getVal('tb-ll-right'),
      tb_wind_psf: getVal('tb-wind-psf'),
      tb_wind_plf: getVal('tb-wind-plf'),
      bw_wall_type: getVal('bw-wall-type'),
      bw_top_restraint: getVal('bw-top-restraint'),
      bw_total_length: getVal('bw-total-length'),
      bw_openings_pct: getVal('bw-openings-pct'),
      bw_wind_speed: getVal('bw-wind-speed'),
      bw_wind_psf: getVal('bw-wind-psf'),
      bw_exposure: getVal('bw-exposure'),
      bw_wall_height: getVal('bw-wall-height'),
      bw_trib_width: getVal('bw-trib-width'),
      bw_dead_load: getVal('bw-dead-load'),
      bw_provided_length: getVal('bw-provided-length'),
      bw_num_panels: getVal('bw-num-panels'),
      bw_sheathing: getVal('bw-sheathing'),
      bw_nail_spacing: getVal('bw-nail-spacing'),
      bw_stud_size: getVal('bw-stud-size'),
      bw_stud_spacing: getVal('bw-stud-spacing'),
      bw_cmu_size: getVal('bw-cmu-size'),
      bw_cmu_grout: getVal('bw-cmu-grout'),
      pointLoads: this.pointLoads,
      tbPointLoads: this.tbPointLoads
    };

    if (this.activeMemberId && proj.members[this.activeMemberId]) {
      proj.members[this.activeMemberId].data = data;
      proj.members[this.activeMemberId].module = this.currentModule;
    }

    proj.engineer = document.getElementById('rep-engineer').value;
    proj.company = document.getElementById('rep-company').value;
    proj.project = document.getElementById('rep-project').value;
    proj.client = document.getElementById('rep-client').value;

    document.getElementById('activeProjName').textContent = proj.name;

    this.saveProjectsToStorage();
  }

  populateSelects() {
    this.updateBeamShapes();
    this.updateColumnShapes();
    this.updateTimberMembers();
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

  updateTimberMembers() {
    const familySelect = document.getElementById('tb-family');
    const builtUpControls = document.getElementById('group-builtup-controls');
    const standardSizeControl = document.getElementById('group-standard-size');
    const sizeSelect = document.getElementById('tb-size');

    if (!familySelect) return;

    const family = familySelect.value || 'builtup';

    if (family === 'builtup') {
      builtUpControls.style.display = 'flex';
      standardSizeControl.style.display = 'none';
    } else {
      builtUpControls.style.display = 'none';
      standardSizeControl.style.display = 'block';

      sizeSelect.innerHTML = '';
      const matchingMembers = TIMBER_MEMBERS.filter(m => m.category === family);
      matchingMembers.forEach(mem => {
        const opt = document.createElement('option');
        opt.value = mem.name;
        opt.textContent = `${mem.name} (Ix: ${mem.Ix} in⁴ | Sx: ${mem.Sx} in³)`;
        sizeSelect.appendChild(opt);
      });

      const customOpt = document.createElement('option');
      customOpt.value = TIMBER_CUSTOM_SIZE_VALUE;
      customOpt.textContent = '✏️ Custom Size (Enter Width x Depth)';
      sizeSelect.appendChild(customOpt);

      if (matchingMembers.length > 0) {
        sizeSelect.value = matchingMembers[0].name;
      } else {
        sizeSelect.value = TIMBER_CUSTOM_SIZE_VALUE;
      }
    }

    this.updateCustomTimberSizeVisibility();
    this.updateTimberSpeciesForFamily();
  }

  updateCustomTimberSizeVisibility() {
    const sizeSelect = document.getElementById('tb-size');
    const customGroup = document.getElementById('group-custom-timber-size');
    if (!sizeSelect || !customGroup) return;
    customGroup.style.display = sizeSelect.value === TIMBER_CUSTOM_SIZE_VALUE ? 'flex' : 'none';
  }

  updateTimberSpeciesForFamily() {
    const familySelect = document.getElementById('tb-family');
    const speciesSelect = document.getElementById('tb-species');
    if (!familySelect || !speciesSelect) return;

    const family = familySelect.value || 'builtup';
    const allowedCategories = TIMBER_FAMILY_SPECIES_CATEGORIES[family] || [];
    const currentValue = speciesSelect.value;

    const matchingSpecies = TIMBER_SPECIES.filter(sp => allowedCategories.includes(sp.category));

    speciesSelect.innerHTML = '';
    matchingSpecies.forEach(sp => {
      const opt = document.createElement('option');
      opt.value = sp.name;
      opt.textContent = `${sp.name} (Fb: ${sp.Fb} psi | E: ${(sp.E/1000000).toFixed(2)}M)`;
      speciesSelect.appendChild(opt);
    });

    if (matchingSpecies.some(sp => sp.name === currentValue)) {
      speciesSelect.value = currentValue;
    } else if (matchingSpecies.length > 0) {
      speciesSelect.value = matchingSpecies[0].name;
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
          <input type="number" class="form-control pt-pdl" data-idx="${idx}" value="${pt.P_dl}" placeholder="P_DL (kips)" title="Dead Load P_DL (kips, where 1 kip = 1,000 lbs)" aria-label="Dead Load P_DL in kips" step="0.5" min="0">
        </div>
        <div style="flex:1;">
          <input type="number" class="form-control pt-pll" data-idx="${idx}" value="${pt.P_ll}" placeholder="P_LL (kips)" title="Live Load P_LL (kips, where 1 kip = 1,000 lbs)" aria-label="Live Load P_LL in kips" step="0.5" min="0">
        </div>
        <div style="flex:1;">
          <input type="number" class="form-control pt-pos" data-idx="${idx}" value="${pt.pos_ft}" placeholder="Location a (ft)" title="Location / distance from left support (ft)" aria-label="Location from left support in feet" step="0.5" min="0">
        </div>
        <div>
          <button class="btn btn-outline remove-pt-btn" data-idx="${idx}" title="Remove this point load" style="padding:0.4rem 0.6rem; color:var(--fail-color); border-color:var(--fail-color);">&times;</button>
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

  renderTimberPointLoadsUI() {
    const container = document.getElementById('tbPointLoadsList');
    if (!container) return;

    container.innerHTML = '';
    this.tbPointLoads.forEach((pt, idx) => {
      const row = document.createElement('div');
      row.className = 'form-row';
      row.style.alignItems = 'center';
      row.innerHTML = `
        <div style="flex:1;">
          <input type="number" class="form-control tb-pt-pdl" data-idx="${idx}" value="${pt.P_dl}" placeholder="P_DL (kips)" title="Dead Load P_DL (kips, where 1 kip = 1,000 lbs)" aria-label="Dead Load P_DL in kips" step="0.25" min="0">
        </div>
        <div style="flex:1;">
          <input type="number" class="form-control tb-pt-pll" data-idx="${idx}" value="${pt.P_ll}" placeholder="P_LL (kips)" title="Live Load P_LL (kips, where 1 kip = 1,000 lbs)" aria-label="Live Load P_LL in kips" step="0.25" min="0">
        </div>
        <div style="flex:1;">
          <input type="number" class="form-control tb-pt-pos" data-idx="${idx}" value="${pt.pos_ft}" placeholder="Location a (ft)" title="Location / distance from left support (ft)" aria-label="Location from left support in feet" step="0.5" min="0">
        </div>
        <div>
          <button class="btn btn-outline remove-tb-pt-btn" data-idx="${idx}" title="Remove this point load" style="padding:0.4rem 0.6rem; color:var(--fail-color); border-color:var(--fail-color);">&times;</button>
        </div>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll('.tb-pt-pdl').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        this.tbPointLoads[idx].P_dl = parseFloat(e.target.value) || 0;
        this.recalculate();
      });
    });

    container.querySelectorAll('.tb-pt-pll').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        this.tbPointLoads[idx].P_ll = parseFloat(e.target.value) || 0;
        this.recalculate();
      });
    });

    container.querySelectorAll('.tb-pt-pos').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        this.tbPointLoads[idx].pos_ft = parseFloat(e.target.value) || 0;
        this.recalculate();
      });
    });

    container.querySelectorAll('.remove-tb-pt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        if (this.tbPointLoads.length > 1) {
          this.tbPointLoads.splice(idx, 1);
          this.renderTimberPointLoadsUI();
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

    document.getElementById('optiSteelBeamBtn')?.addEventListener('click', () => this.autoOptimizeSteelBeam());
    document.getElementById('optiSteelColBtn')?.addEventListener('click', () => this.autoOptimizeSteelColumn());
    document.getElementById('optiTimberBtn')?.addEventListener('click', () => this.autoOptimizeTimberBeam());

    document.getElementById('cf-rebar-mode')?.addEventListener('change', (e) => {
      const isCustom = e.target.value === 'custom';
      document.getElementById('group-custom-rebar').style.display = isCustom ? 'grid' : 'none';
      this.recalculate();
    });

    document.getElementById('bw-wall-type')?.addEventListener('change', (e) => {
      const isWood = e.target.value === 'wood';
      const groupWood = document.getElementById('bw-group-wood');
      const groupCmu = document.getElementById('bw-group-cmu');
      if (groupWood) groupWood.style.display = isWood ? 'flex' : 'none';
      if (groupCmu) groupCmu.style.display = isWood ? 'none' : 'flex';
      this.recalculate();
    });

    document.getElementById('sb-family')?.addEventListener('change', () => {
      this.updateBeamShapes();
      this.recalculate();
    });

    document.getElementById('sc-family')?.addEventListener('change', () => {
      this.updateColumnShapes();
      this.recalculate();
    });

    document.getElementById('tb-family')?.addEventListener('change', () => {
      this.updateTimberMembers();
      this.recalculate();
    });

    document.getElementById('tb-size')?.addEventListener('change', () => {
      this.updateCustomTimberSizeVisibility();
      this.recalculate();
    });

    document.getElementById('sb-preset')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'roof') {
        document.getElementById('sb-dl-left').value = 15;
        document.getElementById('sb-dl-right').value = 15;
        document.getElementById('sb-ll-left').value = 20;
        document.getElementById('sb-ll-right').value = 20;
        document.getElementById('sb-wind-psf').value = 16;
      }
      this.recalculate();
    });

    document.getElementById('tb-preset')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'floor') {
        document.getElementById('tb-dl-left').value = 10;
        document.getElementById('tb-dl-right').value = 10;
        document.getElementById('tb-ll-left').value = 40;
        document.getElementById('tb-ll-right').value = 40;
        document.getElementById('tb-wind-psf').value = 0;
      } else if (val === 'roof') {
        document.getElementById('tb-dl-left').value = 15;
        document.getElementById('tb-dl-right').value = 15;
        document.getElementById('tb-ll-left').value = 20;
        document.getElementById('tb-ll-right').value = 20;
        document.getElementById('tb-wind-psf').value = 16;
      } else if (val === 'header') {
        document.getElementById('tb-family').value = 'sawn';
        this.updateTimberMembers();
        document.getElementById('tb-plies').value = '2';
        document.getElementById('tb-size').value = '2x10';
        document.getElementById('tb-dl-left').value = 15;
        document.getElementById('tb-dl-right').value = 15;
        document.getElementById('tb-ll-left').value = 50;
        document.getElementById('tb-ll-right').value = 50;
        document.getElementById('tb-wind-psf').value = 0;
      } else if (val === 'deck') {
        document.getElementById('tb-dl-left').value = 10;
        document.getElementById('tb-dl-right').value = 10;
        document.getElementById('tb-ll-left').value = 50;
        document.getElementById('tb-ll-right').value = 50;
        document.getElementById('tb-wind-psf').value = 0;
      }
      this.recalculate();
    });

    document.getElementById('tb-beam-type')?.addEventListener('change', (e) => {
      const type = e.target.value;
      const groupSpan2 = document.getElementById('tb-group-span2');
      const labelSpan2 = document.getElementById('tb-label-span2');

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

    document.getElementById('tbAddPointLoadBtn')?.addEventListener('click', () => {
      const L = parseFloat(document.getElementById('tb-span').value) || 14;
      this.tbPointLoads.push({ P_dl: 0.5, P_ll: 1.0, pos_ft: L / 2 });
      this.renderTimberPointLoadsUI();
      this.recalculate();
    });

    document.getElementById('sb-load-mode')?.addEventListener('change', (e) => {
      const isTrib = e.target.value === 'tributary';
      document.getElementById('group-trib').style.display = isTrib ? 'flex' : 'none';
      document.getElementById('group-direct-loads').style.display = isTrib ? 'none' : 'grid';
      this.recalculate();
    });

    document.getElementById('tb-load-mode')?.addEventListener('change', (e) => {
      const isTrib = e.target.value === 'tributary';
      document.getElementById('tb-group-trib').style.display = isTrib ? 'flex' : 'none';
      document.getElementById('tb-group-direct-loads').style.display = isTrib ? 'none' : 'grid';
      this.recalculate();
    });

    const inputIds = [
      'sb-shape', 'sb-preset', 'sb-beam-type', 'sb-span', 'sb-span2', 'sb-method', 'sb-load-mode',
      'sb-trib-left', 'sb-trib-right', 'sb-dl-left', 'sb-dl-right', 'sb-ll-left', 'sb-ll-right', 'sb-wind-psf', 'sb-wind-plf',
      'sb-dl', 'sb-ll', 'sb-selfweight', 'sb-deflect-live', 'sb-deflect-total',
      'sc-shape', 'sc-length', 'sc-k', 'sc-axial', 'sc-wind-uplift',
      'bp-width', 'bp-length', 'bp-thick', 'bp-fy', 'ab-qty', 'ab-dia', 'ab-grade', 'ab-embed',
      'cf-pdead', 'cf-plive', 'cf-puplift', 'cf-width', 'cf-length', 'cf-thick', 'cf-col-w', 'cf-col-l', 'cf-qallow', 'cf-fc', 'cf-rebar-mode', 'cf-bar-size', 'cf-bar-spacing',
      'rw-condition', 'rw-brace-spacing', 'rw-height', 'rw-base', 'rw-density', 'rw-phi', 'rw-surcharge',
      'tb-species', 'tb-family', 'tb-size', 'tb-plies', 'tb-ply-width', 'tb-depth', 'tb-custom-width', 'tb-custom-depth',
      'tb-span', 'tb-span2', 'tb-beam-type', 'tb-load-mode',
      'tb-trib-left', 'tb-trib-right', 'tb-dl-left', 'tb-dl-right', 'tb-ll-left', 'tb-ll-right', 'tb-wind-psf', 'tb-wind-plf',
      'tb-dl', 'tb-ll', 'tb-deflect-live', 'tb-deflect-total',
      'truss-type', 'truss-species', 'truss-member-size', 'truss-span', 'truss-pitch', 'truss-heel-height', 'truss-overhang', 'truss-spacing', 'truss-tc-ll', 'truss-tc-dl', 'truss-bc-ll', 'truss-bc-dl',
      'bw-wall-type', 'bw-top-restraint', 'bw-total-length', 'bw-openings-pct', 'bw-wind-speed', 'bw-wind-psf', 'bw-exposure', 'bw-wall-height', 'bw-trib-width', 'bw-dead-load', 'bw-provided-length', 'bw-num-panels', 'bw-sheathing', 'bw-nail-spacing', 'bw-stud-size', 'bw-stud-spacing', 'bw-cmu-size', 'bw-cmu-grout',
      'rep-engineer', 'rep-company', 'rep-project', 'rep-client'
    ];

    inputIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          this.recalculate();
          this.autoSaveActiveProject();
        });
        el.addEventListener('change', () => {
          this.recalculate();
          this.autoSaveActiveProject();
        });
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
  }

  setupSubnavTabs() {
    const btnInputs = document.getElementById('tabBtnInputs');
    const btnGuide = document.getElementById('tabBtnGuide');
    const panelInputs = document.getElementById('subpanel-inputs');
    const panelGuide = document.getElementById('subpanel-guide');

    if (btnInputs && btnGuide && panelInputs && panelGuide) {
      btnInputs.addEventListener('click', () => {
        btnInputs.classList.add('active');
        btnInputs.style.color = 'var(--text-color)';
        btnInputs.style.borderBottomColor = 'var(--primary-color)';
        btnGuide.classList.remove('active');
        btnGuide.style.color = 'var(--text-muted)';
        btnGuide.style.borderBottomColor = 'transparent';
        panelInputs.style.display = 'block';
        panelGuide.style.display = 'none';
      });

      btnGuide.addEventListener('click', () => {
        btnGuide.classList.add('active');
        btnGuide.style.color = 'var(--text-color)';
        btnGuide.style.borderBottomColor = 'var(--primary-color)';
        btnInputs.classList.remove('active');
        btnInputs.style.color = 'var(--text-muted)';
        btnInputs.style.borderBottomColor = 'transparent';
        panelInputs.style.display = 'none';
        panelGuide.style.display = 'flex';
        this.renderFieldGuideContent();
      });
    }
  }

  switchModule(moduleName) {
    this.currentModule = moduleName;

    const proj = this.projects[this.activeProjectId];
    if (proj && this.activeMemberId && proj.members && proj.members[this.activeMemberId]) {
      proj.members[this.activeMemberId].module = moduleName;
    }

    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.module === moduleName);
    });
    document.querySelectorAll('.module-content').forEach(mc => {
      mc.classList.remove('hidden');
      if (mc.id === `mod-${moduleName}`) {
        mc.classList.add('active');
        mc.style.display = 'flex';
      } else {
        mc.classList.remove('active');
        mc.style.display = 'none';
      }
    });

    const btnInputs = document.getElementById('tabBtnInputs');
    const btnGuide = document.getElementById('tabBtnGuide');
    const panelInputs = document.getElementById('subpanel-inputs');
    const panelGuide = document.getElementById('subpanel-guide');
    if (btnInputs && panelInputs && panelGuide) {
      btnInputs.classList.add('active');
      btnInputs.style.color = 'var(--text-color)';
      btnInputs.style.borderBottomColor = 'var(--primary-color)';
      if (btnGuide) {
        btnGuide.classList.remove('active');
        btnGuide.style.color = 'var(--text-muted)';
        btnGuide.style.borderBottomColor = 'transparent';
      }
      panelInputs.style.display = 'block';
      panelGuide.style.display = 'none';
    }

    this.recalculate();
    this.autoSaveActiveProject();
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
      dlLeft_psf: parseFloat(document.getElementById('sb-dl-left').value) || 0,
      dlRight_psf: parseFloat(document.getElementById('sb-dl-right').value) || 0,
      llLeft_psf: parseFloat(document.getElementById('sb-ll-left').value) || 0,
      llRight_psf: parseFloat(document.getElementById('sb-ll-right').value) || 0,
      wind_psf: parseFloat(document.getElementById('sb-wind-psf').value) || 0,
      w_wind_plf: parseFloat(document.getElementById('sb-wind-plf').value) || 0,
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
      this.autoSaveActiveProject();
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
      P_wind_uplift_kips: parseFloat(document.getElementById('sc-wind-uplift').value) || 0,
      bp_width: parseFloat(document.getElementById('bp-width').value) || 12,
      bp_length: parseFloat(document.getElementById('bp-length').value) || 12,
      bp_thick: parseFloat(document.getElementById('bp-thick').value) || 0.75,
      bp_fy: parseFloat(document.getElementById('bp-fy').value) || 36,
      ab_qty: parseInt(document.getElementById('ab-qty').value) || 4,
      ab_dia: parseFloat(document.getElementById('ab-dia').value) || 0.75,
      ab_grade: parseInt(document.getElementById('ab-grade').value) || 36,
    };

    const opt = findLightestSteelColumn(inputs);
    if (opt.found) {
      document.getElementById('sc-shape').value = opt.section.name;
      alert(`✨ Lightest Passing Column Found: ${opt.section.name} (${opt.section.weight} lb/ft | Utilization: ${(opt.result.capacityRatio * 100).toFixed(1)}%)`);
      this.recalculate();
      this.autoSaveActiveProject();
    } else {
      alert("⚠️ No passing column section found in this family.");
    }
  }

  autoOptimizeTimberBeam() {
    const family = document.getElementById('tb-family').value;
    const plyWidth = parseFloat(document.getElementById('tb-ply-width').value) || 1.5;

    const inputs = {
      family,
      plyWidth,
      beamType: document.getElementById('tb-beam-type').value,
      speciesName: document.getElementById('tb-species').value,
      loadMode: document.getElementById('tb-load-mode').value,
      L_ft: parseFloat(document.getElementById('tb-span').value) || 14,
      L2_ft: parseFloat(document.getElementById('tb-span2').value) || 0,
      tribLeft_ft: parseFloat(document.getElementById('tb-trib-left').value) || 0,
      tribRight_ft: parseFloat(document.getElementById('tb-trib-right').value) || 0,
      dlLeft_psf: parseFloat(document.getElementById('tb-dl-left').value) || 0,
      dlRight_psf: parseFloat(document.getElementById('tb-dl-right').value) || 0,
      llLeft_psf: parseFloat(document.getElementById('tb-ll-left').value) || 0,
      llRight_psf: parseFloat(document.getElementById('tb-ll-right').value) || 0,
      wind_psf: parseFloat(document.getElementById('tb-wind-psf').value) || 0,
      w_wind_plf: parseFloat(document.getElementById('tb-wind-plf').value) || 0,
      w_dl_plf: parseFloat(document.getElementById('tb-dl').value) || 0,
      w_ll_plf: parseFloat(document.getElementById('tb-ll').value) || 0,
      pointLoads: this.tbPointLoads,
      deflectLimitLive: parseFloat(document.getElementById('tb-deflect-live').value) || 360,
      deflectLimitTotal: parseFloat(document.getElementById('tb-deflect-total').value) || 240,
    };

    const opt = findLightestTimberBeam(inputs);
    if (opt.found) {
      if (family === 'builtup') {
        document.getElementById('tb-plies').value = opt.builtUpParams.numPlies;
        document.getElementById('tb-depth').value = opt.builtUpParams.depth;
      } else {
        document.getElementById('tb-size').value = opt.member.name;
        if (opt.numPlies) {
          document.getElementById('tb-plies').value = opt.numPlies;
        }
      }
      alert(`✨ Lightest Passing Wood Member Found: ${opt.member.name} (${opt.member.weight.toFixed(1)} lb/ft | Utilization: ${(opt.result.stressRatio * 100).toFixed(1)}%)`);
      this.recalculate();
      this.autoSaveActiveProject();
    } else {
      alert("⚠️ No passing wood member found in this category.");
    }
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
      case 'truss':
        this.runTruss();
        break;
      case 'braced-wall':
        this.runBracedWall();
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
      dlLeft_psf: parseFloat(document.getElementById('sb-dl-left').value) || 0,
      dlRight_psf: parseFloat(document.getElementById('sb-dl-right').value) || 0,
      llLeft_psf: parseFloat(document.getElementById('sb-ll-left').value) || 0,
      llRight_psf: parseFloat(document.getElementById('sb-ll-right').value) || 0,
      wind_psf: parseFloat(document.getElementById('sb-wind-psf').value) || 0,
      w_wind_plf: parseFloat(document.getElementById('sb-wind-plf').value) || 0,
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

    const transferContainer = document.getElementById('transferReactionContainer');
    if (transferContainer) transferContainer.style.display = 'flex';

    const totalPointLoad = this.pointLoads.reduce((sum, p) => sum + p.P_dl + p.P_ll, 0);
    const r = res.reactions;

    const stressLabel = res.method === 'ASD' ? 'Bending Stress \u03C3' : 'Factored Moment Mu';
    const stressVal = res.method === 'ASD' ? `${res.bendingStress_ksi.toFixed(2)} ksi` : `${res.M_max_kipft.toFixed(1)} kip-ft`;
    const stressSub = res.method === 'ASD' ? `Allowable: ${res.allowableStress_ksi.toFixed(2)} ksi` : `Capacity \u03C6Mn: ${res.allowableStress_ksi.toFixed(1)} kip-ft`;

    const metrics = [
      { label: "Section & Type", val: res.sectionName, sub: `Type: ${section.type} | Config: ${res.beamType.toUpperCase()}` },
      { label: "Uniform Load w", val: `${(res.w_service_kft * 1000).toFixed(0)} plf`, sub: `Factored: ${(res.w_factored_kft * 1000).toFixed(0)} plf` },
      { label: "Left Support Reaction R1", val: `${r.R1.service.toFixed(2)} kips`, sub: `DL: ${r.R1.dl.toFixed(2)}k | Wind Uplift: ${r.R1.uplift.toFixed(2)}k` },
      { label: "Right Support Reaction R2", val: `${r.R2.service.toFixed(2)} kips`, sub: `DL: ${r.R2.dl.toFixed(2)}k | Wind Uplift: ${r.R2.uplift.toFixed(2)}k` },
      { label: stressLabel, val: stressVal, sub: stressSub },
      { label: "Deflection Live \u03B4_LL", val: `${res.delta_live_in.toFixed(3)}"`, sub: `Limit: ${res.L360_in.toFixed(3)}" (${res.passLiveDeflect ? 'Pass' : 'FAIL'})` },
      { label: "Deflection Total \u03B4_TL", val: `${res.delta_total_in.toFixed(3)}"`, sub: `Limit: ${res.L240_in.toFixed(3)}" (${res.passTotalDeflect ? 'Pass' : 'FAIL'})` }
    ];

    if (res.isNetUplift) {
      metrics.unshift({ label: "🌪️ ASCE 7 Net Wind Uplift", val: `${res.w_net_uplift_plf.toFixed(0)} plf UPLIFT`, sub: `Hold-Down Tie Tension Required at Bearing Points!` });
    }

    if (res.beamType === 'two-span') {
      metrics.splice(4, 0, { label: "Center Support Reaction R3", val: `${r.R3.service.toFixed(2)} kips`, sub: `DL: ${r.R3.dl.toFixed(2)}k | LL: ${r.R3.ll.toFixed(2)}k` });
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
    const transferContainer = document.getElementById('transferReactionContainer');
    if (transferContainer) transferContainer.style.display = 'none';

    const secName = document.getElementById('sc-shape').value;
    const section = getSectionByName(secName);

    const inputs = {
      L_ft: parseFloat(document.getElementById('sc-length').value) || 12,
      K: parseFloat(document.getElementById('sc-k').value) || 1.0,
      P_axial_kips: parseFloat(document.getElementById('sc-axial').value) || 35,
      P_wind_uplift_kips: parseFloat(document.getElementById('sc-wind-uplift').value) || 0,
      bp_width: parseFloat(document.getElementById('bp-width').value) || 12,
      bp_length: parseFloat(document.getElementById('bp-length').value) || 12,
      bp_thick: parseFloat(document.getElementById('bp-thick').value) || 0.75,
      bp_fy: parseFloat(document.getElementById('bp-fy').value) || 36,
      ab_qty: parseInt(document.getElementById('ab-qty').value) || 4,
      ab_dia: parseFloat(document.getElementById('ab-dia').value) || 0.75,
      ab_grade: parseInt(document.getElementById('ab-grade').value) || 36,
      section
    };

    const res = analyzeSteelColumn(inputs);
    this.lastResult = res;
    this.updateStatus(res.isPass, Math.max(res.capacityRatio * 100, (res.fp_concrete_psi / res.Fp_allow_psi) * 100));

    const metrics = [
      { label: "Column Shape & Height", val: section.name, sub: `Height: ${res.L_ft}' | Area: ${section.A} in\u00B2 | KL/r: ${res.KLr_max.toFixed(1)}` },
      { label: "Base Plate Size (B \u00D7 N)", val: `${res.B_plate}" \u00D7 ${res.N_plate}" \u00D7 ${res.tp_provided}" PL`, sub: `Req Thickness: ${res.tp_req_in.toFixed(3)}" (${res.passPlateBending ? 'Pass' : 'FAIL - Increase Thickness'})` },
      { label: "Concrete Bearing Stress fp", val: `${res.fp_concrete_psi.toFixed(0)} psi`, sub: `Allowable Fp: ${res.Fp_allow_psi.toFixed(0)} psi (${res.passConcreteBearing ? 'Pass' : 'FAIL - Increase Plate Size'})` },
      { label: "Base Plate Bending Stress", val: `${res.fb_plate_ksi.toFixed(2)} ksi`, sub: `Allowable Fb: ${res.Fb_plate_allow_ksi.toFixed(2)} ksi (${res.passPlateBending ? 'Pass' : 'FAIL'})` },
      { label: "Anchor Rods Schedule", val: `(${res.ab_qty}) ${res.ab_dia}" \u00D8 F1554 Gr ${res.ab_grade}`, sub: `Allowable Tension/Rod: ${res.P_rod_tension_allow_kips.toFixed(1)} kips | Shear: ${res.P_rod_shear_allow_kips.toFixed(1)} kips` }
    ];

    if (res.isNetTension) {
      metrics.unshift({ label: "🌪️ Net Wind Uplift Tension", val: `${res.P_net_tension_kips.toFixed(1)} kips total`, sub: `${res.Tension_per_rod_kips.toFixed(2)} kips/rod vs ${res.P_rod_tension_allow_kips.toFixed(2)}k allowable (${res.passAnchorTension ? 'Pass' : 'FAIL'})` });
    }

    this.renderMetrics(metrics);
    this.renderer.renderColumnAnalysis(res);
  }

  runFooting() {
    const transferContainer = document.getElementById('transferReactionContainer');
    if (transferContainer) transferContainer.style.display = 'none';

    const inputs = {
      P_dead_kips: parseFloat(document.getElementById('cf-pdead').value) || 40,
      P_live_kips: parseFloat(document.getElementById('cf-plive').value) || 25,
      P_uplift_kips: parseFloat(document.getElementById('cf-puplift').value) || 0,
      width_ft: parseFloat(document.getElementById('cf-width').value) || 5,   // Side 1
      length_ft: parseFloat(document.getElementById('cf-length').value) || 5,  // Side 2
      thickness_in: parseFloat(document.getElementById('cf-thick').value) || 14, // Thickness t
      col_width_in: parseFloat(document.getElementById('cf-col-w').value) || 12,
      col_length_in: parseFloat(document.getElementById('cf-col-l').value) || 12,
      q_allowable_ksf: parseFloat(document.getElementById('cf-qallow').value) || 3.0,
      fc_psi: parseFloat(document.getElementById('cf-fc').value) || 3000,
      rebarMode: document.getElementById('cf-rebar-mode').value,
      customBarSize: document.getElementById('cf-bar-size').value,
      customBarSpacing: document.getElementById('cf-bar-spacing').value
    };

    const res = analyzeConcreteFooting(inputs);
    this.lastResult = res;
    this.updateStatus(res.isPass, res.bearingRatio * 100);

    const metrics = [
      { label: "Footing Pad Size", val: `${res.B_ft}' \u00D7 ${res.L_ft}' \u00D7 ${res.t_in}" pad`, sub: `Weight: ${res.Weight_footing_kips.toFixed(1)} kips | Pedestal: ${res.col_w_in}" \u00D7 ${res.col_l_in}"` },
      { label: "Service Soil Pressure", val: `${res.q_service_ksf.toFixed(2)} ksf`, sub: `Allowable: ${res.q_allowable_ksf} ksf (${res.passBearing ? 'Pass' : 'FAIL'})` },
      { label: "Factored Moment Mu", val: `${res.M_u_kipft.toFixed(1)} kip-ft`, sub: `Factored Load Pu: ${res.P_factored} kips` },
      { label: "Flexural Steel As", val: `${res.As_provided_sqin_per_ft.toFixed(2)} in\u00B2/ft`, sub: `Required: ${res.As_required_sqin_per_ft.toFixed(2)} in\u00B2/ft` },
      { label: "Rebar Schedule", val: res.rebarRecommendation, sub: res.passSteel ? "Flexural Steel Pass" : "OVERSTRESSED - Increase Rebar Size" }
    ];

    if (res.P_uplift > 0) {
      metrics.unshift({ label: "🌪️ Wind Uplift Ballast FOS", val: `FOS: ${res.FOS_uplift.toFixed(2)}`, sub: `Dead Load Resistance: ${res.Resisting_Dead_kips.toFixed(1)}k vs ${res.P_uplift}k uplift (${res.passUplift ? 'Pass' : 'FAIL < 1.5'})` });
    }

    this.renderMetrics(metrics);
    this.renderer.renderFootingAnalysis(res);
  }

  runRetaining() {
    const transferContainer = document.getElementById('transferReactionContainer');
    if (transferContainer) transferContainer.style.display = 'none';

    const wallCondition = document.getElementById('rw-condition')?.value || 'cantilever';
    const isBraced = wallCondition === 'braced';

    const braceSpacingGroup = document.getElementById('rw-group-brace-spacing');
    if (braceSpacingGroup) braceSpacingGroup.style.display = isBraced ? 'flex' : 'none';

    const inputs = {
      wall_condition: wallCondition,
      brace_spacing_in: parseFloat(document.getElementById('rw-brace-spacing')?.value) || 24,
      wall_height_ft: parseFloat(document.getElementById('rw-height').value) || 10.0,
      base_width_ft: parseFloat(document.getElementById('rw-base').value) || 6.5,
      soil_density_pcf: parseFloat(document.getElementById('rw-density').value) || 120,
      friction_angle_deg: parseFloat(document.getElementById('rw-phi').value) || 30,
      surcharge_psf: parseFloat(document.getElementById('rw-surcharge').value) || 0
    };

    const res = analyzeRetainingWall(inputs);
    this.lastResult = res;
    this.updateStatus(res.isPass, isBraced ? (res.fb_stem_psi / res.Fb_stem_allow_psi) * 100 : (1.5 / Math.min(res.FOS_overturning, res.FOS_sliding)) * 100);

    const metrics = isBraced ? [
      { label: "Wall Type & Soil Coeff K0", val: `BRACED BASEMENT (${res.K0.toFixed(3)} K0)`, sub: `At-Rest Bottom Soil Pressure: ${res.q_soil_bottom_psf.toFixed(0)} psf` },
      { label: "Top Floor Restraint R_top", val: `${res.R_top_lbft.toFixed(0)} lbs/ft`, sub: `Diaphragm Anchor Force: ${res.T_brace_anchor_lb.toFixed(0)} lbs @ ${res.braceSpacingInches}" OC` },
      { label: "Base Shear Reaction R_base", val: `${res.R_base_lbft.toFixed(0)} lbs/ft`, sub: `Total Lateral Load: ${res.P_total_lateral_lb.toFixed(0)} lbs/ft` },
      { label: "Max Mid-Height Moment", val: `${res.M_max_lbft.toFixed(0)} lb-ft/ft`, sub: `Stem Bending Stress fb: ${res.fb_stem_psi.toFixed(0)} psi (${res.passStemBending ? 'Pass' : 'FAIL'})` }
    ] : [
      { label: "Active Coeff Ka", val: res.Ka.toFixed(3), sub: `Soil Bottom Pressure: ${res.q_soil_bottom_psf.toFixed(0)} psf` },
      { label: "Lateral Force P", val: `${res.P_total_lateral_lb.toFixed(0)} lbs/ft`, sub: `Overturning Moment: ${res.M_ot_lbft.toFixed(0)} lb-ft` },
      { label: "Overturning FOS", val: res.FOS_overturning.toFixed(2), sub: res.passOverturning ? "Pass (\u2265 1.5)" : "FAIL (< 1.5)" },
      { label: "Sliding FOS", val: res.FOS_sliding.toFixed(2), sub: res.passSliding ? "Pass (\u2265 1.5)" : "FAIL (< 1.5)" }
    ];

    this.renderMetrics(metrics);
    this.renderer.renderRetainingAnalysis(res);
  }

  runTimber() {
    const family = document.getElementById('tb-family').value;
    const isBuiltUp = family === 'builtup';

    const inputs = {
      beamType: document.getElementById('tb-beam-type').value,
      speciesName: document.getElementById('tb-species').value,
      isBuiltUp,
      numPlies: parseInt(document.getElementById('tb-plies').value) || 2,
      plyWidth: parseFloat(document.getElementById('tb-ply-width').value) || 1.5,
      depth: parseFloat(document.getElementById('tb-depth').value) || 9.25,
      sizeName: document.getElementById('tb-size').value,
      customWidth: parseFloat(document.getElementById('tb-custom-width').value) || 5.125,
      customDepth: parseFloat(document.getElementById('tb-custom-depth').value) || 12,
      loadMode: document.getElementById('tb-load-mode').value,
      L_ft: parseFloat(document.getElementById('tb-span').value) || 14,
      L2_ft: parseFloat(document.getElementById('tb-span2').value) || 0,
      tribLeft_ft: parseFloat(document.getElementById('tb-trib-left').value) || 0,
      tribRight_ft: parseFloat(document.getElementById('tb-trib-right').value) || 0,
      dlLeft_psf: parseFloat(document.getElementById('tb-dl-left').value) || 0,
      dlRight_psf: parseFloat(document.getElementById('tb-dl-right').value) || 0,
      llLeft_psf: parseFloat(document.getElementById('tb-ll-left').value) || 0,
      llRight_psf: parseFloat(document.getElementById('tb-ll-right').value) || 0,
      wind_psf: parseFloat(document.getElementById('tb-wind-psf').value) || 0,
      w_wind_plf: parseFloat(document.getElementById('tb-wind-plf').value) || 0,
      w_dl_plf: parseFloat(document.getElementById('tb-dl').value) || 0,
      w_ll_plf: parseFloat(document.getElementById('tb-ll').value) || 0,
      pointLoads: this.tbPointLoads,
      deflectLimitLive: parseFloat(document.getElementById('tb-deflect-live').value) || 360,
      deflectLimitTotal: parseFloat(document.getElementById('tb-deflect-total').value) || 240,
    };

    const res = analyzeTimberBeam(inputs);
    this.lastResult = res;
    this.updateStatus(res.isPass, res.stressRatio * 100);

    const transferContainer = document.getElementById('transferReactionContainer');
    if (transferContainer) transferContainer.style.display = 'flex';

    const r = res.reactions;

    const metrics = [
      { label: "Member Size & Species", val: res.sizeName, sub: res.speciesName },
      { label: "Uniform Load w", val: `${res.w_service_plf.toFixed(0)} plf`, sub: `Span: ${res.L_ft} ft | Config: ${res.beamType.toUpperCase()}` },
      { label: "Left Support Reaction R1", val: `${r.R1.service.toFixed(2)} kips`, sub: `DL: ${r.R1.dl.toFixed(2)}k | Wind Uplift: ${r.R1.uplift.toFixed(2)}k` },
      { label: "Right Support Reaction R2", val: `${r.R2.service.toFixed(2)} kips`, sub: `DL: ${r.R2.dl.toFixed(2)}k | Wind Uplift: ${r.R2.uplift.toFixed(2)}k` },
      { label: "Bending Moment M", val: `${res.M_max_lbft.toFixed(0)} lb-ft`, sub: `Stress fb: ${res.fb_psi.toFixed(0)} psi / Allow Fb': ${res.Fb_prime_psi.toFixed(0)} psi` },
      { label: "Shear Stress V", val: `${res.V_max_kips.toFixed(2)} kips`, sub: `Stress fv: ${res.fv_psi.toFixed(0)} psi / Allow Fv': ${res.Fv_prime_psi.toFixed(0)} psi (${res.passShear ? 'Pass' : 'FAIL'})` },
      { label: "Deflection Live \u03B4_LL", val: `${res.delta_live_in.toFixed(3)}"`, sub: `Limit: ${res.L360_in.toFixed(3)}" (${res.passLiveDeflect ? 'Pass' : 'FAIL'})` },
      { label: "Deflection Total \u03B4_TL", val: `${res.delta_total_in.toFixed(3)}"`, sub: `Limit: ${res.L240_in.toFixed(3)}" (${res.passTotalDeflect ? 'Pass' : 'FAIL'})` }
    ];

    if (res.isNetUplift) {
      metrics.unshift({ label: "🌪️ ASCE 7 Net Wind Uplift", val: `${res.w_net_uplift_plf.toFixed(0)} plf UPLIFT`, sub: `Hurricane Tie / Simpson Hold-Down Required!` });
    }

    if (res.beamType === 'two-span') {
      metrics.splice(4, 0, { label: "Center Support Reaction R3", val: `${r.R3.service.toFixed(2)} kips`, sub: `DL: ${r.R3.dl.toFixed(2)}k | LL: ${r.R3.ll.toFixed(2)}k` });
    }

    this.renderMetrics(metrics);
    this.renderer.renderTimberAnalysis(res);
  }

  runTruss() {
    const inputs = {
      trussType: document.getElementById('truss-type').value,
      speciesName: document.getElementById('truss-species').value,
      memberSize: document.getElementById('truss-member-size').value,
      spanFt: parseFloat(document.getElementById('truss-span').value) || 30,
      pitchInches: parseFloat(document.getElementById('truss-pitch').value) || 6,
      heelHeightInches: parseFloat(document.getElementById('truss-heel-height').value) || 6,
      overhangInches: parseFloat(document.getElementById('truss-overhang').value) || 12,
      spacingInches: parseFloat(document.getElementById('truss-spacing').value) || 24,
      tcLiveLoad: parseFloat(document.getElementById('truss-tc-ll').value) || 20,
      tcDeadLoad: parseFloat(document.getElementById('truss-tc-dl').value) || 10,
      bcLiveLoad: parseFloat(document.getElementById('truss-bc-ll').value) || 0,
      bcDeadLoad: parseFloat(document.getElementById('truss-bc-dl').value) || 5,
    };

    const res = analyzeTimberTruss(inputs);
    this.lastResult = res;
    this.updateStatus(res.isPassed && res.isDeflectionPassed, res.maxDCR * 100);

    const transferContainer = document.getElementById('transferReactionContainer');
    if (transferContainer) transferContainer.style.display = 'none';

    const metrics = [
      { label: "Truss Profile & Span", val: `${res.trussType.toUpperCase()} (${res.spanFt}' Span)`, sub: `${res.member.name} ${res.species.name} @ ${res.spacingInches}" OC` },
      { label: "Total Uniform Load w", val: `${res.wTotalLinear.toFixed(0)} plf`, sub: `Pitch: ${res.pitchInches}:12 | Rise: ${res.riseFt.toFixed(2)} ft` },
      { label: "Left Support Reaction R_L", val: `${res.R_left.toFixed(0)} lbs`, sub: `Total Truss Load: ${res.totalLoadLbs.toFixed(0)} lbs` },
      { label: "Right Support Reaction R_R", val: `${res.R_right.toFixed(0)} lbs`, sub: `Total Truss Load: ${res.totalLoadLbs.toFixed(0)} lbs` },
      { label: "Top Chord Max Stress DCR", val: `${(res.dcr_topChord * 100).toFixed(1)}%`, sub: `Max Compression: ${res.maxAxialCompression.toFixed(0)} lbs` },
      { label: "Total Deflection \u03B4_TL", val: `${res.deltaTotalInches.toFixed(3)}"`, sub: `Limit: ${res.deltaAllowableInches.toFixed(3)}" (L/240) - ${res.isDeflectionPassed ? 'PASS' : 'FAIL'}` },
      { label: "Gusset Plate Contact Area", val: `${res.reqGussetAreaSqIn.toFixed(1)} sq.in.`, sub: `ANSI/TPI 1 Tooth Holding (220 psi)` }
    ];

    this.renderMetrics(metrics);
    const canvas = document.getElementById('analysisCanvas');
    renderTrussDiagram(canvas, res);
  }

  runBracedWall() {
    const getVal = (id, fallback = '') => {
      const el = document.getElementById(id);
      return el ? el.value : fallback;
    };

    const wallType = getVal('bw-wall-type', 'wood');
    const isWood = wallType === 'wood';

    const groupWood = document.getElementById('bw-group-wood');
    const groupCmu = document.getElementById('bw-group-cmu');
    if (groupWood) groupWood.style.display = isWood ? 'flex' : 'none';
    if (groupCmu) groupCmu.style.display = isWood ? 'none' : 'flex';

    const inputs = {
      wallType,
      topRestraint: getVal('bw-top-restraint', 'braced'),
      windSpeedMph: parseFloat(getVal('bw-wind-speed', 115)) || 115,
      windPsf: parseFloat(getVal('bw-wind-psf', 20.0)) || 20.0,
      exposureCategory: getVal('bw-exposure', 'C'),
      totalWallLengthFt: parseFloat(getVal('bw-total-length', 24.0)) || 24.0,
      wallHeightFt: parseFloat(getVal('bw-wall-height', 9.0)) || 9.0,
      tribWidthFt: parseFloat(getVal('bw-trib-width', 28.0)) || 28.0,
      deadLoadPsf: parseFloat(getVal('bw-dead-load', 15.0)) || 15.0,
      openingsPct: parseFloat(getVal('bw-openings-pct', 15.0)) || 15.0,
      providedPanelLengthFt: parseFloat(getVal('bw-provided-length', 12.0)) || 12.0,
      numPanels: parseInt(getVal('bw-num-panels', 2)) || 2,
      woodSheathingType: getVal('bw-sheathing', 'osb_716'),
      nailSpacingEdge: getVal('bw-nail-spacing', '6'),
      studSize: getVal('bw-stud-size', '2x6'),
      studSpacingInches: parseFloat(getVal('bw-stud-spacing', 16.0)) || 16.0,
      cmuBlockSize: getVal('bw-cmu-size', '8_cmu'),
      cmuGroutSpacing: getVal('bw-cmu-grout', '32')
    };

    const res = analyzeBracedWall(inputs);
    this.lastResult = res;
    const isOverallPass = res.isPass && res.isStudPass;
    const maxDCR = Math.max(res.dcr_shear, res.dcr_stud_bending);
    this.updateStatus(isOverallPass, maxDCR * 100);

    this.renderMetrics([
      { label: "Top Support Restraint", val: res.topRestraint === 'braced' ? '🏢 Braced (Diaphragm Restrained)' : '📐 Unbraced (Free Cantilever Parapet)', sub: `Top Reaction R_top: ${res.R_top_reaction_plf.toFixed(0)} plf` },
      { label: "Material & Sheathing", val: res.panelMethodName, sub: `Wind: ${res.p_wind_mwfrs_psf.toFixed(1)} psf (${res.windSpeedMph} mph Exp ${res.exposureCategory})` },
      { label: "Story Shear Force V", val: `${res.V_story_lbs.toFixed(0)} lbs (${res.V_story_kips.toFixed(2)} kips)`, sub: `Unit Shear: ${res.v_applied_plf.toFixed(0)} plf vs ${res.v_allow_plf.toFixed(0)} plf allow (${res.isShearPass ? 'Pass' : 'FAIL'})` },
      { label: "Braced Panel & Openings", val: `${res.providedPanelLengthFt.toFixed(1)}' Provided (${res.openingsPct}% Openings)`, sub: `Req Length: ${res.reqBracedLengthFt.toFixed(1)}' | Opening Co: ${res.Co_opening_factor.toFixed(2)}` },
      { label: "Stud Bending (Out-of-Plane)", val: `${res.studSize} @ ${res.studSpacingInches}" OC`, sub: `Stress fb: ${res.fb_stud_psi.toFixed(0)} psi vs 1250 psi allow (${res.isStudPass ? 'Pass' : 'FAIL'})` },
      { label: "Hold-Down Tension T_hd", val: `${res.T_holddown_required_lbs.toFixed(0)} lbs / Panel`, sub: res.holdDownRecommendation }
    ]);

    const canvas = document.getElementById('analysisCanvas');
    if (canvas) renderBracedWallDiagram(canvas, res);
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

  generateSelectedMembersPrintReport(selectedMemberIds) {
    const proj = this.projects[this.activeProjectId];
    if (!proj || !proj.members) return;

    const eng = document.getElementById('rep-engineer').value || proj.engineer || 'John Doe, PE';
    const comp = document.getElementById('rep-company').value || proj.company || 'Apex Engineering LLC';
    const projName = document.getElementById('rep-project').value || proj.name || 'Commercial Structure';
    const client = document.getElementById('rep-client').value || proj.client || 'BuildRight Construction';

    document.getElementById('printMetaInfo').innerHTML = `
      <strong>Engineer / Designer:</strong> ${eng} | <strong>Company:</strong> ${comp} | <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
      <strong>Project Name:</strong> ${projName} | <strong>Client / Contractor:</strong> ${client}
    `;

    const savedCurrentMemberId = this.activeMemberId;
    let fullReportHTML = '';

    selectedMemberIds.forEach((memId, idx) => {
      const m = proj.members[memId];
      if (!m) return;

      this.switchMember(memId);
      const res = this.lastResult;
      const canvas = document.getElementById('analysisCanvas');
      const canvasImgData = canvas ? canvas.toDataURL("image/png") : '';

      let reactionsTableHTML = '';
      if ((m.module === 'steel-beam' || m.module === 'timber') && res && res.reactions) {
        const r = res.reactions;
        reactionsTableHTML = `
          <h4 style="margin-top:1rem; font-size:0.95rem; color:#1e293b;">BEARING POINT SUPPORT REACTIONS & WIND UPLIFT HOLD-DOWNS</h4>
          <table class="print-table">
            <thead>
              <tr>
                <th>Support Location</th>
                <th>Dead Load (DL)</th>
                <th>Live Load (LL)</th>
                <th>Total Service Reaction</th>
                <th>ASCE 7 Net Wind Uplift (Tension)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Left Support (R1)</strong></td>
                <td>${r.R1.dl.toFixed(2)} kips</td>
                <td>${r.R1.ll.toFixed(2)} kips</td>
                <td><strong>${r.R1.service.toFixed(2)} kips</strong></td>
                <td><strong style="color:${r.R1.uplift > 0 ? '#ef4444' : '#1e293b'};">${r.R1.uplift > 0 ? r.R1.uplift.toFixed(2) + ' kips UPLIFT' : '0.00 kips'}</strong></td>
              </tr>
              <tr>
                <td><strong>Right Support (R2)</strong></td>
                <td>${r.R2.dl.toFixed(2)} kips</td>
                <td>${r.R2.ll.toFixed(2)} kips</td>
                <td><strong>${r.R2.service.toFixed(2)} kips</strong></td>
                <td><strong style="color:${r.R2.uplift > 0 ? '#ef4444' : '#1e293b'};">${r.R2.uplift > 0 ? r.R2.uplift.toFixed(2) + ' kips UPLIFT' : '0.00 kips'}</strong></td>
              </tr>
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

      fullReportHTML += `
        <div style="${idx < selectedMemberIds.length - 1 ? 'page-break-after:always;' : ''} margin-bottom:2rem;">
          <div style="background:#0f172a; color:#ffffff; padding:0.6rem 1rem; border-radius:4px; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0; font-size:1.1rem; color:#ffffff;">Member ${idx+1} of ${selectedMemberIds.length}: ${m.name}</h3>
            <span style="font-size:0.85rem; font-weight:600; background:rgba(255,255,255,0.2); padding:0.2rem 0.5rem; border-radius:3px;">${m.module.toUpperCase()}</span>
          </div>

          ${reactionsTableHTML}

          <h4 style="margin-top:1rem; font-size:0.95rem; color:#1e293b;">SUMMARY CALCULATION CHECKS</h4>
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

          <div style="margin-top:1.25rem; page-break-inside:avoid;">
            <h4 style="font-size:0.95rem; color:#1e293b; margin-bottom:0.4rem;">EXPRESSED LOADS & ANALYSIS DIAGRAM DRAWING</h4>
            <img src="${canvasImgData}" style="width:100%; max-height:280px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
        </div>
      `;
    });

    if (savedCurrentMemberId) {
      this.switchMember(savedCurrentMemberId);
    }

    document.getElementById('printBody').innerHTML = fullReportHTML;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new StructuralApp();
});
