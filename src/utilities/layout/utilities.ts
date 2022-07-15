export function setupDarkMode() {
  const darkModePref = localStorage.getItem("dark");
  if (
    darkModePref === "true" ||
    (!darkModePref && matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    localStorage.setItem("dark", "true");
    return true;
  } else {
    localStorage.setItem("dark", "false");
    return false;
  }
}
