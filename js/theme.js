function applyTheme() {
    document.body.classList.remove('dark');
    if (
        theme.value === 'dark' ||
        (theme.value === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
    )
        document.body.classList.add('dark');

    realCurve.setAttribute('stroke', document.body.classList.contains('dark') ? 'white' : 'black');
}
