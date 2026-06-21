/**
 *
 * @param {"dark"|"light"|"system"} mode
 */
function applyTheme(mode) {
  if (
    mode === "dark" ||
    (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    els.colorScheme.content = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    els.colorScheme.content = "light";
  }
}
