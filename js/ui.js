function draw() {
    applyTheme();

    let h1p = { x: +h1x.value, y: +h1y.value };
    let h2p = { x: +h2x.value, y: +h2y.value };
    let s = +steps.value;

    let pts = bezierPoints(h1p, h2p, s);
    state.currentPts = pts;

    grid.style.display = showGrid.checked ? '' : 'none';
    h1Line.style.display = showHandles.checked ? '' : 'none';
    h2Line.style.display = showHandles.checked ? '' : 'none';

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

    const desplazamientoLabel = 1.5;
    const gridSize = 100;

    h1Grip.setAttribute('x', h1p.x);
    h1Grip.setAttribute('y', gridSize - h1p.y);

    h2Grip.setAttribute('x', h2p.x);
    h2Grip.setAttribute('y', gridSize - h2p.y);

    h1Line.setAttribute('x2', h1p.x);
    h1Line.setAttribute('y2', gridSize - h1p.y);

    h2Line.setAttribute('x2', h2p.x);
    h2Line.setAttribute('y2', gridSize - h2p.y);

    h1label.setAttribute('x', h1p.x + desplazamientoLabel);
    h1label.setAttribute('y', gridSize - h1p.y - desplazamientoLabel);
    h1label.textContent = `H1 (${round(h1p.x)},${round(h1p.y)})`;

    h2label.setAttribute('x', h2p.x + desplazamientoLabel);
    h2label.setAttribute('y', gridSize - h2p.y - desplazamientoLabel);
    h2label.textContent = `H2 (${round(h2p.x)},${round(h2p.y)})`;

    info.innerHTML = `
 <b>Puntos generados:</b> ${pts.length}<br>
 <b>Control inicial:</b> (${h1p.x}, ${h1p.y})<br>
 <b>Control final:</b> (${h2p.x}, ${h2p.y})<br>
 <b>CSS:</b> cubic-bezier(${(h1p.x / 100).toFixed(2)}, ${(h1p.y / 100).toFixed(2)}, ${(h2p.x / 100).toFixed(2)}, ${(h2p.y / 100).toFixed(2)})
 `;
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
