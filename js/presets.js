/** @type {Array<{nombre: string, model: CurveState}>} */
export const presets = [
  {
    nombre: "Lineal",
    model: { h1: { x: 0, y: 0 }, h2: { x: 100, y: 100 }, steps: 20 },
  },
  {
    nombre: "Ease",
    model: { h1: { x: 25, y: 10 }, h2: { x: 25, y: 100 }, steps: 20 },
  },
  {
    nombre: "Ease In",
    model: { h1: { x: 42, y: 0 }, h2: { x: 100, y: 100 }, steps: 20 },
  },
  {
    nombre: "Ease Out",
    model: { h1: { x: 0, y: 0 }, h2: { x: 58, y: 100 }, steps: 20 },
  },
  {
    nombre: "Ease In Out",
    model: { h1: { x: 42, y: 0 }, h2: { x: 58, y: 100 }, steps: 20 },
  },
  {
    nombre: "Snap",
    model: { h1: { x: 80, y: 0 }, h2: { x: 20, y: 100 }, steps: 20 },
  },
];
