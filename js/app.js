const svg = document.getElementById('svg');
const tip = document.getElementById('tip');

let shiftPressed = false;

function round(v) {
    return Math.round(v * 100) / 100;
}

function bezierPoints(h1, h2, steps) {
    let pts = [];
    for (let t = 0; t <= steps; t++) {
        let tn = t / steps,
            ti = (steps - t) / steps;
        let f1 = 3 * ti * ti * tn;
        let f2 = 3 * ti * tn * tn;
        let f3 = tn * tn * tn;
        pts.push({
            x: round(f1 * h1.x + f2 * h2.x + f3 * 100),
            y: round(f1 * h1.y + f2 * h2.y + f3 * 100),
        });
    }
    return pts;
}

function applyTheme() {
    document.body.classList.remove('dark');
    if (
        theme.value === 'dark' ||
        (theme.value === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
    )
        document.body.classList.add('dark');

    realCurve.setAttribute('stroke', document.body.classList.contains('dark') ? 'white' : 'black');
}

function buildGrid() {
    let h = '';
    for (let i = 0; i <= 100; i += 10) {
        let strong = i === 0 || i === 50 || i === 100;
        let dash = strong ? '' : "stroke-dasharray='1 1'";
        h += `<line x1='${i}' y1='0' x2='${i}' y2='100' stroke='var(--grid)' ${dash} stroke-width='${strong ? 0.25 : 0.15}'/>`;
        h += `<line x1='0' y1='${i}' x2='100' y2='${i}' stroke='var(--grid)' ${dash} stroke-width='${strong ? 0.25 : 0.15}'/>`;
        h += `<text x='${i}' y='99' font-size='2'>${i}</text>`;
        if (i < 100) h += `<text x='0.5' y='${100 - i}' font-size='2'>${i}</text>`;
    }
    grid.innerHTML = h;
}

function draw() {
    applyTheme();

    let h1p = { x: +h1x.value, y: +h1y.value };
    let h2p = { x: +h2x.value, y: +h2y.value };
    let s = +steps.value;

    let pts = bezierPoints(h1p, h2p, s);
    window.currentPts = pts;

    grid.style.display = showGrid.checked ? '' : 'none';

    controls.innerHTML = '';
    if (showHandles.checked) {
        controls.innerHTML = `
 <line x1="0" y1="100" x2="${h1p.x}" y2="${100 - h1p.y}" stroke="orange" stroke-width="0.35"/>
 <line x1="${h2p.x}" y1="${100 - h2p.y}" x2="100" y2="0" stroke="deepskyblue" stroke-width="0.35"/>
 `;
    }

    realCurve.style.display = showCurve.checked ? '' : 'none';
    realCurve.setAttribute(
        'd',
        `M 0 100 C ${h1p.x} ${100 - h1p.y}, ${h2p.x} ${100 - h2p.y}, 100 0`,
    );

    segments.style.display = showSegments.checked ? '' : 'none';
    segments.setAttribute('points', pts.map((p) => `${p.x},${100 - p.y}`).join(' '));

    points.innerHTML = '';
    if (showPoints.checked) {
        pts.forEach((p) => {
            points.innerHTML += `<circle cx="${p.x}" cy="${100 - p.y}" r="0.55" fill="currentColor"/>`;
        });
    }

    h1Halo.setAttribute('cx', h1p.x);
    h1Halo.setAttribute('cy', 100 - h1p.y);

    h1.setAttribute('cx', h1p.x);
    h1.setAttribute('cy', 100 - h1p.y);

    h2Halo.setAttribute('cx', h2p.x);
    h2Halo.setAttribute('cy', 100 - h2p.y);

    h2.setAttribute('cx', h2p.x);
    h2.setAttribute('cy', 100 - h2p.y);

    h1label.setAttribute('x', h1p.x + 1.5);
    h1label.setAttribute('y', 100 - h1p.y - 1.5);
    h1label.textContent = `H1 (${round(h1p.x)},${round(h1p.y)})`;

    h2label.setAttribute('x', h2p.x + 1.5);
    h2label.setAttribute('y', 100 - h2p.y - 1.5);
    h2label.textContent = `H2 (${round(h2p.x)},${round(h2p.y)})`;

    info.innerHTML = `
 <b>Puntos generados:</b> ${pts.length}<br>
 <b>Control inicial:</b> (${h1p.x}, ${h1p.y})<br>
 <b>Control final:</b> (${h2p.x}, ${h2p.y})<br>
 <b>CSS:</b> cubic-bezier(${(h1p.x / 100).toFixed(2)}, ${(h1p.y / 100).toFixed(2)}, ${(h2p.x / 100).toFixed(2)}, ${(h2p.y / 100).toFixed(2)})
 `;
}

let drag = null;

function setActiveHandler(id) {
    h1.setAttribute('r', id === 'h1' ? '2.8' : '1.8');
    h2.setAttribute('r', id === 'h2' ? '2.8' : '1.8');

    h1Halo.setAttribute('opacity', id === 'h1' ? '0.55' : '0');
    h2Halo.setAttribute('opacity', id === 'h2' ? '0.55' : '0');

    h1Halo.setAttribute('class', id === 'h1' ? 'halo-active' : '');
    h2Halo.setAttribute('class', id === 'h2' ? 'halo-active' : '');

    document.body.style.cursor = id ? 'grabbing' : '';
}

function svgPos(e) {
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    let p = pt.matrixTransform(svg.getScreenCTM().inverse());

    let x = Math.max(0, Math.min(100, p.x));
    let y = Math.max(0, Math.min(100, 100 - p.y));

    if (shiftPressed) {
        x = Math.round(x / 5) * 5;
        y = Math.round(y / 5) * 5;
    }

    return { x, y };
}

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

window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') shiftPressed = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') shiftPressed = false;
});

[h1, h2].forEach((el) =>
    el.addEventListener('pointerdown', () => {
        drag = el.id;
        setActiveHandler(drag);
    }),
);

window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    let p = svgPos(e);
    if (drag === 'h1') {
        h1x.value = p.x;
        h1y.value = p.y;
    } else {
        h2x.value = p.x;
        h2y.value = p.y;
    }
    tip.style.display = 'block';
    tip.style.left = e.clientX + 12 + 'px';
    tip.style.top = e.clientY + 12 + 'px';
    tip.textContent = `${drag.toUpperCase()} (${round(p.x)}, ${round(p.y)})`;
    draw();
});

window.addEventListener('pointerup', () => {
    drag = null;
    setActiveHandler(null);
    tip.style.display = 'none';
});

h1.addEventListener('dblclick', () => {
    h1x.value = 0;
    h1y.value = 30;
    draw();
});

h2.addEventListener('dblclick', () => {
    h2x.value = 100;
    h2y.value = 30;
    draw();
});

document.querySelectorAll('input,select').forEach((x) => x.addEventListener('input', draw));

copyJson.onclick = () => copyWithFeedback(copyJson, JSON.stringify(window.currentPts, null, 2));

copyCss.onclick = () =>
    copyWithFeedback(
        copyCss,
        `cubic-bezier(${(+h1x.value / 100).toFixed(2)}, ${(+h1y.value / 100).toFixed(2)}, ${(+h2x.value / 100).toFixed(2)}, ${(+h2y.value / 100).toFixed(2)})`,
    );

buildGrid();
draw();
