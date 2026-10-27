// PyQuest – lokale Konfiguration.
//
// Leer lassen = reiner GAST-MODUS (kein Login, nichts wird an einen Server gesendet).
// Sobald hier eine Supabase-Projekt-URL und der anon key stehen, ist die Anmeldung aktiv.
//
// Der ANON KEY ist ÖFFENTLICH und unbedenklich (durch Row-Level-Security geschützt)
// und darf im Frontend stehen. Der SERVICE-ROLE-Key gehört NIEMALS hierher.
// Einrichtung Schritt für Schritt: siehe SETUP.md.

export default {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",

  // Gilt nur mit konfiguriertem Supabase:
  //   true  = Login-Pflicht (kein Gast-Modus) – dann datenschutz.html anpassen (SETUP.md, Abschnitt 0)
  //   false = Gast-Modus bleibt, Anmeldung ist freiwillig
  REQUIRE_LOGIN: true,

  // Anonyme Statistik und Fehlerberichte an die eigene Webstatistik (cookie-los, ohne IP).
  // Gesendet wird nur, wenn die App unter STATS_DOMAIN läuft, also nie beim lokalen Entwickeln.
  // STATS_URL leer lassen = nichts wird gesendet. Details: src/js/telemetry.js
  STATS_URL: "https://stats.ethos-polis.info",
  STATS_DOMAIN: "pyquest.ethos-polis.info",
};
