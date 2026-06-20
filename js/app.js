const svg = document.getElementById('svg');
const tip = document.getElementById('tip');

const state = {
    drag: null,
    shiftPressed: false,
    currentPts: [],
};

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

window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') state.shiftPressed = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') state.shiftPressed = false;
});

[h1Grip, h2Grip].forEach((el) =>
    el.addEventListener('pointerdown', () => {
        state.drag = el.id;
    }),
);

window.addEventListener('pointermove', (e) => {
    if (!state.drag) return;
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
    draw();
});

window.addEventListener('pointerup', () => {
    state.drag = null;
    tip.style.display = 'none';
});

h1Grip.addEventListener('dblclick', () => {
    h1x.value = 0;
    h1y.value = 30;
    draw();
});

h2Grip.addEventListener('dblclick', () => {
    h2x.value = 100;
    h2y.value = 30;
    draw();
});

document.querySelectorAll('input,select').forEach((x) => x.addEventListener('input', draw));

copyJson.onclick = () => copyWithFeedback(copyJson, JSON.stringify(state.currentPts, null, 2));

copyCss.onclick = () =>
    copyWithFeedback(
        copyCss,
        `cubic-bezier(${(+h1x.value / 100).toFixed(2)}, ${(+h1y.value / 100).toFixed(2)}, ${(+h2x.value / 100).toFixed(2)}, ${(+h2y.value / 100).toFixed(2)})`,
    );

draw();
