# Características

## Nivel 1: mejoras pequeñas pero muy útiles

### 1. Presets de curvas conocidas

Un combo:

* Linear
* Ease
* Ease-In
* Ease-Out
* Ease-In-Out
* Back
* Expo
* Bounce aproximado

Al seleccionarlo:

`cubic-bezier(0.25,0.1,0.25,1)`

actualiza sliders y handlers.

Es probablemente la mejora con mejor relación utilidad/esfuerzo.

### 2. URL compartible

Algo tipo:

`?x1=30&y1=90&x2=60&y2=20&s=20`

o más compacto:

`#30,90,60,20,20`

Entonces:

configurás una curva
copiás URL
la mandás a alguien

y la curva abre exactamente igual.

Muy práctico.

### 3. Copiar SVG

Botón:

Copiar SVG

que exporte:

`<path d="..." />`

o incluso todo el SVG.

Para documentación técnica es útil.

### 4. Mostrar longitud aproximada

Algo así:

`Longitud: 143.28`

sumando segmentos.

Es un dato interesante cuando se estudian curvas.

## Nivel 2: convertirlo en herramienta educativa

Acá es donde creo que tu visualizador tiene mucho potencial.

### 5. Animación de construcción

Slider:

`t = 0.37`

Mostrás:

* P0
* P1
* P2
* P3

y el algoritmo de De Casteljau.

Visualmente:

```pre

P0 ----- P1
 \       /
  A ---- B
   \   /
     C
```

y el punto final.

Esto enseña realmente cómo funciona una Bézier.

### 6. Mostrar tangentes

En el punto inicial:

`P0 -> H1`

En el final:

`P3 -> H2`

dibujando vectores.

Sirve para entender por qué la curva entra y sale con cierta velocidad.

### 7. Mostrar velocidad

Para un valor de t:

`|B'(t)| = 2.83`

y dibujar el vector derivada.

Muy educativo.

### 8. Mostrar curvatura

Más complejo pero muy interesante.

Colorear la curva según:

`κ(t)`

(rojo = mucha curvatura).

Te permite identificar zonas de giro brusco.

## Nivel 3: orientado a CSS

Estos son los que más usaría alguien que llega desde frontend.

### 9. Simulador de easing

En vez de ver sólo la curva.

Mostrar:

```pre
┌─────────────┐
│■            │
└─────────────┘
```

y animar un cuadradito usando la curva.

Entonces ves:

* aceleración
* desaceleración
* overshoot

en tiempo real.

Esto tiene muchísimo valor práctico.

### 10. Comparar dos curvas

Curva A: verde

Curva B: roja

superpuestas.

Ideal para afinar animaciones.

### 11. Biblioteca personal

Guardar:

```pre
Mi curva rebote
Mi curva menú
Mi curva fade
```

en localStorage.

Muy poco esfuerzo.

## Nivel 4: exploración matemática

Estos son los que me entusiasman más como programador.

### 12. Mostrar ecuación paramétrica

Generar:

`x(t)=...`
`y(t)=...`

expandida.

Por ejemplo:

`x(t)=90t³-120t²+30t`

etc.

Muy lindo para entender qué está pasando detrás.

### 13. Mostrar derivada

`x'(t)`
`y'(t)`

### 14. Mostrar segunda derivada

`x''(t)`
`y''(t)`

### 15. Mostrar punto para un t

Slider:

`t = 0.0 → 1.0`

y:

`P(t) = (34.27, 62.11)`

## Sugerencias: La funcionalidad que yo implementaría primero

Si mañana continuara este proyecto, haría exactamente este orden:

1. Presets CSS.
2. URL compartible.
3. Simulador de easing.
4. Comparación de dos curvas.
5. De Casteljau interactivo.

Porque esas cinco transforman el proyecto de:

"visualizador de una Bézier"

a

"laboratorio interactivo de curvas Bézier"

Y sinceramente, viendo cómo quedó el código, creo que el siguiente paso natural ya no es refactorizar más, sino empezar a agregar capacidades de exploración. Ahí es donde el proyecto se vuelve realmente interesante.