/**  @type {number}     */
const gridSize = 100;

/**  @type {number}     */
const desplazamientoLabel = 1.5;

function draw() {
    const handlers = getHandlers();

    updateRealCurve(handlers);

    updateHandler(h1Grip, h1Line, handlers.h1);
    updateHandler(h2Grip, h2Line, handlers.h2);

    updateHandlerLabel(h1label, handlers.h1, 'H1');
    updateHandlerLabel(h2label, handlers.h2, 'H2');

    drawSegments();
    drawPoints();

    updateInfo(handlers);
}

/**
 *
 * @param {Handlers} handlers
 */
function updateRealCurve(handlers) {
    realCurve.setAttribute(
        'd',
        `M 0 100 C ${handlers.h1.x} ${100 - handlers.h1.y}, ${handlers.h2.x} ${100 - handlers.h2.y}, 100 0`,
    );
    /* <path fill="none" stroke="red" d="M 0,100 C 5,80 18,65 50,50 S 70,30 100,0"/> */
}

/**
 *
 * @param {SVGTextElement} elem
 * @param {Point} pos
 * @param {string} tag
 */
function updateHandlerLabel(elem, pos, tag) {
    elem.setAttribute('x', pos.x + desplazamientoLabel);
    elem.setAttribute('y', gridSize - pos.y - desplazamientoLabel);
    elem.textContent = `${tag} (${round(pos.x)},${round(pos.y)})`;
}

/**
 *
 * @param {SVGUseElement} gripElem
 * @param {SVGLineElement} lineElem
 * @param {Point} pos
 */
function updateHandler(gripElem, lineElem, pos) {
    gripElem.setAttribute('x', pos.x);
    gripElem.setAttribute('y', gridSize - pos.y);
    lineElem.setAttribute('x2', pos.x);
    lineElem.setAttribute('y2', gridSize - pos.y);
}

/**
 *
 * @param {Handlers} handlers
 */
function updateInfo(handlers) {
    if (info.classList.contains('hidden')) {
        return;
    }

    const pointsInfo =
        showSegments.checked || showPoints.checked
            ? `<b>Puntos generados:</b> ${getCurrentPoints().length}<br>`
            : '';

    info.innerHTML = `
    ${pointsInfo}  
    <b>Control inicial:</b> (${handlers.h1.x.toFixed(2)}, ${handlers.h1.y.toFixed(2)})<br>
    <b>Control final:</b> (${handlers.h2.x.toFixed(2)}, ${handlers.h2.y.toFixed(2)})<br>
    <b>CSS:</b> cubic-bezier(${(handlers.h1.x / 100).toFixed(2)}, ${(handlers.h1.y / 100).toFixed(2)}, ${(handlers.h2.x / 100).toFixed(2)}, ${(handlers.h2.y / 100).toFixed(2)})
    `;
}

function drawSegments() {
    if (!showSegments.checked) {
        segments.classList.add('hidden');
        return;
    }

    segments.setAttribute(
        'points',
        getCurrentPoints()
            .map((p) => `${p.x.toFixed(2)},${(100 - p.y).toFixed(2)}`)
            .join(' '),
    );
    segments.classList.remove('hidden');
}

function drawPoints() {
    if (!showPoints.checked) {
        points.classList.add('hidden');
        return;
    }

    const elemCount = points.children.length;
    const dataPoints = getCurrentPoints();

    dataPoints.map((p, i) => {
        const values = { x: p.x.toFixed(2), y: (gridSize - p.y).toFixed(2) };

        if (i < elemCount) {
            /** @type {SVGCircleElement} */
            const circle = points.children[i];
            circle.setAttribute('cx', values.x);
            circle.setAttribute('cy', values.y);
            circle.classList.remove('hidden');
        } else {
            /** @type {SVGCircleElement} */
            const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            el.setAttribute('cx', values.x);
            el.setAttribute('cy', values.y);
            el.setAttribute('r', 0.55);
            points.appendChild(el);
        }
    });

    if (elemCount > dataPoints.length) {
        for (let i = dataPoints.length; i < elemCount; i++) {
            points.children[i].classList.add('hidden');
        }
    }

    points.classList.remove('hidden');
}

/**
 *
 * @param {HTMLButtonElement} button
 * @param {string} text
 */
async function copyWithFeedback(button, text) {
    await navigator.clipboard.writeText(text);
    const original = button.textContent;

    button.textContent = '✓ Copiado';
    button.classList.add('copied');

    setTimeout(() => {
        button.textContent = original;
        button.classList.remove('copied');
    }, 1200);
}
