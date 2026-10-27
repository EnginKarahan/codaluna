// Node-Import-Hook für Tests: Browser-Pfade wie "/src/js/i18n.js" auf das Projekt abbilden.
const ROOT = new URL("../../", import.meta.url);

export async function resolve(specifier, context, next) {
  if (/^\/(src|content|vendor)\//.test(specifier) || specifier === "/app-config.js") {
    return next(new URL("." + specifier, ROOT).href, context);
  }
  return next(specifier, context);
}
