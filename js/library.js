import { els } from "./elements.js";
import { presets } from "./presets.js";

const STORAGE_KEY = "bezier-curvas";

/**
 * @returns {Array<{nombre: string, model: CurveState}>}
 */
function cargarMisCurvas() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

/**
 * @param {Array<{nombre: string, model: CurveState}>} curvas
 */
function guardarMisCurvas(curvas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(curvas));
}

export function poblarPresets() {
  presets.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = JSON.stringify(p.model);
    opt.textContent = p.nombre;
    els.grupoPresets.appendChild(opt);
  });
}

export function poblarMisCurvas() {
  els.grupoMisCurvas.innerHTML = "";
  cargarMisCurvas().forEach((p) => {
    const opt = document.createElement("option");
    opt.value = JSON.stringify(p.model);
    opt.textContent = p.nombre;
    els.grupoMisCurvas.appendChild(opt);
  });
}

/**
 * @param {string} nombre
 * @param {CurveState} model
 */
export function guardarCurva(nombre, model) {
  const curvas = cargarMisCurvas();
  const existente = curvas.findIndex((c) => c.nombre === nombre);

  if (existente >= 0) {
    curvas[existente].model = model;
  } else {
    curvas.push({ nombre, model });
  }

  guardarMisCurvas(curvas);
  poblarMisCurvas();
}
