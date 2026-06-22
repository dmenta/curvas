# Análisis post UNDO

**El problema central que identificaste**

Todo lo que listaste converge en una sola tensión:

> `undo/redo` llama `updateModel` directamente, saltando `Estado`

Eso crea dos problemas encadenados: la URL no se actualiza, y el undo queda acoplado al mecanismo de actualización del modelo. Lo notaste bien.

---

**La solución que proponés — `Estado.apply` — es la correcta**

```js
const Estado = {
  save(state) { ... },           // modelo → persistencia
  apply(state) { ... },          // persistencia → modelo
};
```

`apply` sería el punto de entrada para cualquier restauración de estado: undo, redo, URL inicial, presets futuros. Sus suscriptores naturales son `updateModel` y `UrlStore.save`.

```js
const applyListeners = [
  (state) => updateModel(state),
  (state) => UrlStore.save(state),
];
```

Con esto el flujo queda simétrico y completo:

```
usuario actúa    → updateModel → updateUI
estado se fija   → Estado.save → [UrlStore, UndoStack]
estado se aplica → Estado.apply → [updateModel, UrlStore]
```

Undo y redo quedan en un solo lugar:

```js
const prev = UndoStack.undo();
if (prev) Estado.apply(prev);
```

---

**El `Estado` como dueño del estado current**

Si `Estado` mantiene el estado actual, `initFromUrl` encaja perfectamente:

```js
Estado.apply(UrlStore.load() ?? defaultModel);
```

Es la inicialización como caso particular de "aplicar un estado desde persistencia". Semánticamente es exacto.

---

**El tema del primer elemento en `past[]`**

Este es el lugar donde los proyectos se desvían sutilmente, como mencionás. Lo que pasó es clásico: **la abstracción se definió antes de tener claro el invariante**.

El invariante correcto del stack es:

> `past[0]` es el estado inicial. `undo()` nunca puede dejar el stack vacío.

Por eso `length < 2` es correcto pero huele a número mágico. Si `Estado` es el dueño del estado actual, el stack solo necesita guardar el historial real, y `undo()` devuelve el tope sin necesidad de guardar el current ahí.

La confusión vino de mezclar "estado actual" con "historial de estados". Son dos cosas distintas y merecen vivir en lugares distintos.

---

**La extensión de `Array.prototype`**

Este es exactamente el tipo de desviación sutil que mencionás. Funciona, es cómodo, pero:
- Es invisible en los imports
- Contamina el scope global
- Cualquier librería futura puede colisionar

El momento en que algo "mágicamente funciona sin importarlo" es la señal de alerta. `peek(arr)` como función exportada desde `utils.js` es más verboso pero completamente honesto.

---

**Lo que más me interesa señalar como patrón general**

El desvío sutil que describís suele tener esta forma:

> Una abstracción nace para resolver un problema concreto, resuelve ese problema bien, pero su contrato queda implícito. Cuando aparece el siguiente problema, se extiende la abstracción por conveniencia en lugar de por diseño.

En tu caso: `UndoStack` nació para guardar historial. Cuando apareció undo/redo, se lo llamó directamente desde los eventos en lugar de pasar por `Estado`. Funcionó, pero rompió el contrato que habías definido para `Estado`.

La señal de que estás en ese punto es exactamente lo que sentiste: "al no pasar por `Estado` al hacer undo/redo, no se actualiza la URL". Ese síntoma es el contrato violado haciéndose visible.

---

**Próximo paso concreto**

Agregar `Estado.apply` y redirigir undo/redo y `initFromUrl` por ahí. ¿Lo encaramos?