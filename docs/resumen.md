
# 🧠 Bezier Visualizer — Estado actual del proyecto

## 🌐 Qué es la app

Es un **visualizador interactivo de curvas Bézier cúbicas tipo CSS `cubic-bezier()`**, donde el usuario:

* Ajusta los 2 puntos de control (h1, h2)
* Ve la curva renderizada en SVG
* Puede mostrar:

  * puntos de interpolación
  * segmentos
  * grilla
  * handles de control
* Puede copiar:

  * `cubic-bezier(...)`
  * JSON de puntos generados
* Puede compartir el estado completo vía URL

---

## 🚀 Dónde está alojada

Está desplegada como **static site en GitHub Pages**:

👉 [https://dmenta.github.io/curvas/](https://dmenta.github.io/curvas/)

No hay backend, ni build step, ni bundler.

---

## 🧱 Arquitectura actual

Es una SPA vanilla con separación manual por archivos:

```
index.html
css/
  styles.css
  curve-svg.css
js/
  app.js        → lógica de estado + eventos
  ui.js         → render SVG + DOM update
  bezier.js     → cálculo de curva
  theme.js      → modo oscuro
```

---

## 🧠 Modelo mental actual (MUY IMPORTANTE)

### 🔴 Antes (problemático)

* DOM era fuente de verdad
* estado implícito en inputs
* múltiples lecturas directas del DOM
* inconsistencias entre UI / lógica

---

### 🟢 Ahora (lo correcto que estás construyendo)

#### ✔ Single source of truth

```js
let model = {
  h1: { x, y },
  h2: { x, y },
  steps
};
```

#### ✔ Flujo único

```
UI event
   ↓
setState(nextModel)
   ↓
model actualizado
   ↓
writeSnapshot(model)
   ↓
draw(model)
   ↓
UrlStore.save(model)
```

---

## 🧩 Componentes clave

### 1. Model (estado único)

```js
model = {
  h1,
  h2,
  steps
}
```

✔ No depende del DOM
✔ Es la verdad del sistema

---

### 2. Snapshot layer

```js
readSnapshot()
writeSnapshot()
```

* puente entre DOM ↔ model
* todavía necesario porque sliders = input source

---

### 3. State transition

```js
setState(next)
```

💡 Es el corazón del sistema

Hace:

* actualiza model
* sincroniza DOM
* renderiza SVG
* actualiza URL

👉 ESTE es el “command bus” manual

---

### 4. Render

```js
draw(model)
```

* pura función de representación
* NO debería mutar estado
* NO debería leer DOM

---

### 5. Persistence (URL Store)

```js
UrlStore.save(model)
UrlStore.load()
```

* encoding/decoding de estado
* shareable link

---

### 6. Encoding layer (muy importante evolución)

```js
CurveCodec
```

Transforma:

```
model → URL params
URL params → model
```

Esto ya es el inicio de una abstracción seria de serialización.

---

## 🔄 Flujo completo actual

### interacción del usuario:

```
slider move / drag point
        ↓
readSnapshot()
        ↓
setState()
        ↓
model update
        ↓
writeSnapshot()
        ↓
draw()
        ↓
URL update
```

---

## 🧠 Insight arquitectónico clave que ya apareció

Lo más importante que descubriste (y ya estás aplicando):

> “El DOM no puede ser la fuente de verdad del sistema”

Y el siguiente nivel lógico:

> “El DOM tampoco debería decidir el flujo del sistema”

---

## ⚠️ Problemas actuales (importantes)

### 1. doble fuente implícita aún existe

Aunque mejoraste mucho:

* DOM todavía participa vía `readSnapshot`
* sliders siguen siendo estado “primario accidental”

---

### 2. falta separación fuerte de “command layer”

Hoy:

```
event → setState → side effects mezclados
```

No hay un bus explícito de comandos.

---

### 3. render no es completamente puro aún (leve)

`draw(model)` está bien encaminado, pero:

* depende de globals DOM
* no está aislado 100%

---

### 4. copyCss aún fue “arreglado” pero era síntoma

Antes:

```js
h1x.value directamente
```

Eso era fuga del modelo.

---

## 🧭 Estado conceptual del proyecto

Esto ya no es un “visualizador de curvas”.

Es un:

> mini sistema reactivo manual con estado centralizado + encoding + persistence

---

## 🧱 Próximo paso lógico (CRÍTICO)

Estás a una sola evolución de esto:

# 👉 Command-based architecture liviana

Algo como:

```js
dispatch({
  type: "SET_H1",
  payload: { x, y }
})
```

o incluso:

```js
update(model => ({
  ...model,
  h1: { x, y }
}))
```

---

## 🚀 Mejores siguientes pasos (priorizados)

### 🥇 1. Formalizar “command entry point”

Un único punto de entrada:

```js
setState()
```

→ debería ser el único modo de cambio

✔ ya lo estás haciendo casi perfecto

---

### 🥈 2. eliminar readSnapshot progresivamente

Ideal futuro:

```
DOM → event → command → model
```

pero nunca:

```
DOM → model directo implícito
```

---

### 🥉 3. separar render como función pura

```js
draw(model) → solo lectura
```

y evitar efectos secundarios ocultos

---

### 4. introducir “hydration layer”

Tu initFromUrl ya es eso, pero podría formalizarse como:

```js
hydrate(model, snapshot)
```

---

### 5. introducir “encoding system” formal

Hoy ya existe CurveCodec + UrlStore

Siguiente paso:

```
EncodingRegistry
  - url
  - json
  - clipboard
```

---

## 💡 Mejoras funcionales futuras

* presets (ease, bounce, etc.)
* undo/redo (esto encaja perfecto ahora)
* biblioteca de curvas (localStorage)
* animador easing (preview runner)
* compartir con metadata (nombre de curva)

---

## 🧭 Insight más importante de todo lo que hiciste

Lo que realmente cambió el diseño:

> pasaste de “UI-driven app” a “state-driven app con UI derivada”

Eso es literalmente el salto conceptual hacia arquitecturas tipo:

* React
* Elm architecture
* Redux mental model
* event sourcing light

---

## 🧷 Cómo retomar después

Cuando vuelvas, lo primero útil sería pensar:

> “¿quiero seguir empujando hacia command + model puro o agrego features encima?”

y si quieres seguir arquitectura:

👉 el siguiente hito natural es:

# “eliminar readSnapshot completamente”

---

Si quieres, cuando vuelvas podemos dar el siguiente paso lógico:

👉 convertir `setState` en un mini dispatcher tipo Redux sin librería

o

👉 formalizar encoding system para presets + URL + clipboard + library

---

Descansá tranquilo: el salto arquitectónico más importante ya lo hiciste en esta iteración.
