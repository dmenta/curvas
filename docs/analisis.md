# Análisis

Vos dijiste:

```pre
preview(next)  →  writeSnapshot + draw          (experiencia)
setState(next) →  history + model + URL + draw  (estado real)
```

referido al side-effect que estabamos teniendo.

## Me hizo pensar

No me gustaros los nombres y me puse a pensar porque.

### 1. preview(next)

Me parece que 'preview' "ofusca" lo que el método hace.

Revisando lo que haría veo que es:

* writeSnapshot ==> volcar valores a sliders
* draw ==> dibujar en svg

O sea, que es ua operación pura de actualización de la  UI.
De hecho para poder ejecutar draw NO es necesario hacer writeSnapshot

### 2. setState(next)

Revisando lo que haría veo que es:

* history
* model
* URL
* draw  (estado real)

Con este empece a repasar lo que hace cada una de esas cosas y me di cuenta que:

1. que podemos dibujar el svg sin ningúna depedencia de datos. Alcanza con que nos pasen un state.
2. writeSnapshot actualiza los sliders pero no tiene ningún otro efecto.
3. model es el estado real de la curva dibujada y de los valores que la crean. Esto quiere decir que si cambia la curva es unicamente por un cambio en el model.
4. el model ES el estado real.
5. la aplicación tiene en abstracto estados registrables y estos estados registrables dependen de la definición que hicimos de cúando un estado real es suficientemente estables para registrarse.
6. este estado registrado es parte de nuestro dominio.
7. ni la history ni url tienen nada que ver con el estado real.
8. la history es un conjunto de estados registrables, pero esto conceptual, la aplicación no lo requiere para operar.
9. asímismo, la url es una artefacto de la persistencia de un estado registrable.

Basado en esto repasemos los eventos de la aplicación:

1. Mutación (cambios en el estado real, el model)
    * usuario
      * cambio de un slider
      * cambio desde el svg
      * aplicación de un estado registrado por cualquier medio (ej: url, undo, preset)
    * sistema
      * inicialización

2. Update de UI (siempre que cambie el estado real)

## Propuesta de nuevos nombres y demás

### Nombres

Hasta acá vine con lo que tenemos. Pero me parece que nos hace falta renombrar las ideas para poder pensar mejor la app.

* lo que hasta ahora venimos llamando indistintamente 'model' o 'state' o 'estado real' propongo llamarlo sólo `model`, unicamente. Es el estado de la curva, el estado real, la representacion del estado de la UI (un model típico de un mvc, por ej).
* lo que hasta ahora venimos llamando 'setState' propongo llamarlo `updateModel` o `mutateModel` (no se cual me gusta más).
* lo que hasta ahora venimos llamando 'preview' propongo llamarlo `updateUI`. Consta de:
  * `updateControls`: actualizar los controles que modifican el `model` (ex writeSnapshot)
  * `updateDraw`: dibujar la curva y handlers que corresponden al `model` en el svg.
  * recordar que estas 2 acciones no dependen una de la otra.
* lo que hasta ahora venimos llamando 'estado registrable' propongo llamarlo o `Estado` o `Status`.

### Cambios y nuevas responsabilidades

El `Estado` requiere al menos 2 operaciones basicas:

* `save`: llevar el estado actual a la persistencia
* `apply`: aplicar un `Estado` nuevo desde la persistencia. Esto implica que tenemos que volcarlo al `model` (probablemento con `updateModel`).

Teniendo esto en cuenta me parece que ahora aparece más claro el flujo de la aplicación:

```pre
1.  (X) -> (nextModel) -> updateModel -> updateUI
2.  (C) -> (model) -> Estado.save -> (Estado persistido) -> (Y)
3.  (Y) -> (Estado persistido) -> Estado.apply -> (nextModel)
```

- **Caso 1.** creo que tenemos claros los escenarios.
- **Caso 2.** diría que que (Y) sería el punto de enganche del codec a la URL y del UNDO -> save
- **Caso 3.** diría que (Y) sería el punto de enganche de la URL al codec y del UNDO -> restore


### Undo y URL (y similares)

En este escenario el undo y el url quedan completamente desacoplados de nuestro circuito.

Quizás podamos hacer algo tipo Estrategias para (Y) que conecte los codecs que se nos indiquen (via un callback, por ej)

Pero el Undo, para usarlo de ejemplo
