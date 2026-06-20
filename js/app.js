/** @type {SVGSVGElement} */
const svg = document.getElementById('svg');
/** @type {HTMLDivElement} */
const tip = document.getElementById('tip');

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Handlers
 * @property {Point} h1
 * @property {Point} h2
 */

/**
 * @typedef {Object} CurveState
 * @property {Point} h1
 * @property {Point} h2
 * @property {number} steps
 */
/**
 * @typedef {Object} State
 * @property {string|null} drag
 * @property {boolean} shiftPressed
 */
const state = {
    drag: null,
    shiftPressed: false,
};

/**
 *
 * @returns {CurveState}
 */
function getCurveState() {
    return {
        h1: {
            x: +h1x.value,
            y: +h1y.value,
        },
        h2: {
            x: +h2x.value,
            y: +h2y.value,
        },
        steps: +steps.value,
    };
}

/**
 * @param {PointerEvent} e
 * @returns {Point}
 */
function svgPos(e) {
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    let p = pt.matrixTransform(svg.getScreenCTM().inverse());

    let x = Math.max(0, Math.min(100, p.x));
    let y = Math.max(0, Math.min(100, 100 - p.y));

    if (state.shiftPressed) {
        x = Math.round(x / 5) * 5;
        y = Math.round(y / 5) * 5;
    }

    return { x, y };
}

function addEventListeners() {
    addPanelControlsEvents();
    addHandlersEvents();
    addKeyboardEvents();
    addPointerEvents();
    addCopyEvents();
}

function addPanelControlsEvents() {
    document
        .querySelectorAll('input[type=range]')
        .forEach((x) => x.addEventListener('input', () => draw(getCurveState())));

    [showPoints, showSegments].forEach((x) =>
        x.addEventListener('input', () => draw(getCurveState())),
    );

    showGrid.addEventListener('input', () => (grid.style.display = showGrid.checked ? '' : 'none'));

    showHandles.addEventListener('input', () => {
        h1Line.style.display = showHandles.checked ? '' : 'none';
        h2Line.style.display = showHandles.checked ? '' : 'none';
    });

    showCurve.addEventListener(
        'input',
        () => (realCurve.style.display = showCurve.checked ? '' : 'none'),
    );
    theme.addEventListener('input', applyTheme);
}

function addHandlersEvents() {
    [h1Grip, h2Grip].forEach((el) =>
        el.addEventListener('pointerdown', () => (state.drag = el.id)),
    );

    h1Grip.addEventListener('dblclick', () => {
        h1x.value = 0;
        h1y.value = 30;
        draw(getCurveState());
    });

    h2Grip.addEventListener('dblclick', () => {
        h2x.value = 100;
        h2y.value = 30;
        draw(getCurveState());
    });
}

function addKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') state.shiftPressed = true;
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') state.shiftPressed = false;
    });
}

function addPointerEvents() {
    window.addEventListener('pointermove', (e) => {
        if (!state.drag) {
            return;
        }

        let p = svgPos(e);

        if (state.drag === 'h1Grip') {
            h1x.value = p.x;
            h1y.value = p.y;
        } else {
            h2x.value = p.x;
            h2y.value = p.y;
        }

        tip.style.display = 'block';
        tip.style.left = e.clientX + 12 + 'px';
        tip.style.top = e.clientY + 12 + 'px';
        tip.textContent = `${state.drag.toUpperCase()} (${round(p.x)}, ${round(p.y)})`;

        draw(getCurveState());
    });

    window.addEventListener('pointerup', () => {
        state.drag = null;
        tip.style.display = 'none';
    });
}

function addCopyEvents() {
    copyJson.onclick = () =>
        copyWithFeedback(copyJson, JSON.stringify(bezierPoints(getCurveState()), null, 2));

    copyCss.onclick = () =>
        copyWithFeedback(
            copyCss,
            `cubic-bezier(${(+h1x.value / 100).toFixed(2)}, ${(+h1y.value / 100).toFixed(2)}, ${(+h2x.value / 100).toFixed(2)}, ${(+h2y.value / 100).toFixed(2)})`,
        );
}

addEventListeners();
applyTheme();
draw(getCurveState());
