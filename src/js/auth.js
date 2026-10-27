// PyQuest – Anmeldung (Supabase, über app-config.js gesteuert).
// E-Mail + Passwort (Anmelden, Registrieren, Zurücksetzen) + optional Google/GitHub.
// Ohne konfiguriertes Supabase läuft die App im Gast-Modus (alles lokal).
// Mit REQUIRE_LOGIN erzwingt ein Dialog die Anmeldung (kein Gast-Modus).

import config from "/app-config.js";
import { t } from "/src/js/i18n.js";
import { openModal } from "/src/js/ui.js";
import { icon } from "/src/js/icons.js";
import { logError } from "/src/js/telemetry.js";

export const authEnabled = !!(config.SUPABASE_URL && config.SUPABASE_ANON_KEY);
export const requireLogin = authEnabled && config.REQUIRE_LOGIN === true;

let client = null;
let gate = null; // offener Pflicht-Dialog

export function getClient() {
  return client;
}

export function closeGate() {
  if (gate) {
    gate.close();
    gate = null;
  }
}

export async function initAuth({ onAuthChange, showBanner }) {
  if (!authEnabled) {
    onAuthChange(null);
    return;
  }
  try {
    const { createClient } = await import("/vendor/supabase/supabase.js");
    client = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    const { data } = await client.auth.getSession();
    onAuthChange(data && data.session ? data.session.user : null);
    client.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        openSetPassword({ showBanner });
        return;
      }
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        onAuthChange(session ? session.user : null);
      }
    });
  } catch (e) {
    logError("auth.init", e);
    onAuthChange(null);
  }
}

// Nach Klick auf den Link aus der Passwort-Mail: neues Passwort setzen.
function openSetPassword({ showBanner }) {
  if (!client) return;
  const m = openModal({
    label: t("auth.setPassword"),
    className: "auth-modal",
    html: `
      <div class="modal-logo" aria-hidden="true">${icon("key", { size: 32 })}</div>
      <h2>${t("auth.setPassword")}</h2>
      <form class="auth-email">
        <input type="password" name="pw" required minlength="8" autocomplete="new-password"
               placeholder="${t("auth.newPassword")}" aria-label="${t("auth.newPassword")}" data-autofocus />
        <button type="submit" class="btn btn-primary">${t("auth.setPassword")}</button>
      </form>`,
  });
  m.el.querySelector("form").onsubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await client.auth.updateUser({ password: e.target.pw.value });
      if (error) throw error;
      m.close();
      showBanner(t("auth.passwordUpdated"), true);
    } catch (e) {
      logError("auth.setPassword", e);
      showBanner(t("auth.error"), false);
    }
  };
}

export async function signOut() {
  if (!client) return;
  try {
    await client.auth.signOut();
  } catch (e) {
    logError("auth.signOut", e);
  }
}

// Eigenes Konto löschen. Braucht die SQL-Funktion delete_own_account()
// aus backend/supabase/migration.sql (löscht Konto + Fortschritt).
export async function deleteOwnAccount() {
  if (!client) return { ok: false };
  try {
    const { error } = await client.rpc("delete_own_account");
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    logError("auth.delete", e);
    return { ok: false };
  }
}

export function openLogin({ showBanner, gate: asGate = false }) {
  if (!authEnabled || !client) return;
  if (asGate && gate) return;
  let mode = "login"; // "login" | "register"

  const privacy = `<a href="/datenschutz.html" target="_blank" rel="noopener">${t("legal.privacyPolicy")}</a>`;
  const m = openModal({
    label: t("auth.title"),
    className: "auth-modal",
    dismissible: !asGate,
    html: "",
    onClose: () => {
      if (asGate) gate = null;
    },
  });
  if (asGate) {
    gate = m;
    m.overlay.classList.add("gate");
  }

  function render() {
    const isReg = mode === "register";
    m.el.innerHTML = `
      <div class="modal-logo" aria-hidden="true">${icon("user", { size: 32 })}</div>
      <h2>${asGate ? t("auth.gateTitle") : isReg ? t("auth.register") : t("auth.title")}</h2>
      <p>${asGate ? t("auth.gateSubtitle") : t("auth.subtitle")}</p>
      <form class="auth-email">
        <input type="email" name="email" required autocomplete="email"
               placeholder="${t("auth.emailPlaceholder")}" aria-label="${t("auth.email")}" data-autofocus />
        <input type="password" name="password" required ${isReg ? 'minlength="8"' : ""}
               autocomplete="${isReg ? "new-password" : "current-password"}"
               placeholder="${t("auth.password")}" aria-label="${t("auth.password")}" />
        <button type="submit" class="btn btn-primary">${isReg ? t("auth.register") : t("auth.login")}</button>
      </form>
      <div class="auth-links">
        <button type="button" class="linkbtn" data-toggle>${isReg ? t("auth.haveAccount") : t("auth.needAccount")}</button>
        ${isReg ? "" : `<button type="button" class="linkbtn" data-forgot>${t("auth.forgot")}</button>`}
      </div>
      <div class="auth-or"><span>${t("auth.or")}</span></div>
      <div class="auth-providers">
        <button type="button" class="btn" data-provider="google">${t("auth.google")}</button>
        <button type="button" class="btn" data-provider="github">${t("auth.github")}</button>
      </div>
      <p class="auth-note">${t("auth.privacyNote", { privacy })}</p>
      ${asGate ? "" : `<div class="modal-actions"><button type="button" class="btn btn-ghost" data-close>${t("dlg.close")}</button></div>`}`;
    wire();
    const first = m.el.querySelector("[data-autofocus]");
    if (first) first.focus();
  }

  function wire() {
    const close = m.el.querySelector("[data-close]");
    if (close) close.onclick = () => m.close();
    m.el.querySelector("[data-toggle]").onclick = () => {
      mode = mode === "login" ? "register" : "login";
      render();
    };
    const forgot = m.el.querySelector("[data-forgot]");
    if (forgot) {
      forgot.onclick = async () => {
        const email = m.el.querySelector('input[name="email"]').value.trim();
        if (!email) return showBanner(t("auth.emailFirst"), false);
        try {
          const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: location.origin });
          if (error) throw error;
          showBanner(t("auth.resetSent"), true);
        } catch (err) {
          logError("auth.reset", err);
          showBanner(t("auth.error"), false);
        }
      };
    }
    m.el.querySelector("form").onsubmit = async (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value;
      try {
        if (mode === "register") {
          const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: location.origin } });
          if (error) throw error;
          if (!data.session) showBanner(t("auth.confirmSent"), true); // E-Mail-Bestätigung nötig
        } else {
          const { error } = await client.auth.signInWithPassword({ email, password });
          if (error) throw error;
        }
        if (!asGate) m.close();
      } catch (err) {
        logError(mode === "register" ? "auth.register" : "auth.login", err);
        showBanner(t("auth.error"), false);
      }
    };
    m.el.querySelectorAll("[data-provider]").forEach((b) => {
      b.onclick = async () => {
        try {
          const { error } = await client.auth.signInWithOAuth({
            provider: b.dataset.provider,
            options: { redirectTo: location.origin },
          });
          if (error) throw error;
        } catch (err) {
          logError("auth.oauth", err, { provider: b.dataset.provider });
          showBanner(t("auth.error"), false);
        }
      };
    });
  }

  render();
}
