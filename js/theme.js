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
    colorScheme.content = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    colorScheme.content = "light";
  }
}
