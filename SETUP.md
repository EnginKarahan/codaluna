# PyQuest – Anmeldung & Cloud-Sync einrichten (optional)

Ohne Konfiguration läuft die App im **Gast-Modus**: kein Login, alles bleibt lokal im Browser.
Sobald in `app-config.js` eine Supabase-URL und der anon key stehen, ist die Anmeldung aktiv.

> **Wichtig:** Der **anon key** ist öffentlich und unbedenklich (er ist durch Row-Level-Security
> geschützt) und darf im Frontend stehen. Der **service_role key** gehört **niemals** ins
> Frontend oder ins Repository.

## 0. Gast-Modus oder Login-Pflicht?

`REQUIRE_LOGIN` in `app-config.js` steuert, was mit konfiguriertem Supabase passiert:

- `true`: Ohne Anmeldung geht es nicht weiter (kein Gast-Modus).
- `false`: Der Gast-Modus bleibt, die Anmeldung ist ein Angebot (Sidebar → „Anmelden“).

Bei Login-Pflicht bitte auch `datenschutz.html` anpassen: Dort steht derzeit, dass PyQuest ohne
Konto funktioniert (Abschnitte 2 und 8).

## 1. Supabase-Projekt anlegen

1. Konto auf [supabase.com](https://supabase.com) erstellen, neues Projekt anlegen.
2. **Region: EU (Frankfurt)** wählen – wegen DSGVO.
3. Unter **Project Settings → API**: `Project URL` und `anon public` key kopieren.
4. In `app-config.js` eintragen:
   ```js
   export default {
     SUPABASE_URL: "https://DEIN-PROJEKT.supabase.co",
     SUPABASE_ANON_KEY: "eyJ… (anon public)",
     REQUIRE_LOGIN: true, // oder false, siehe Abschnitt 0
   };
   ```

## 2. Datenbank-Tabelle, Sicherheit, Konto löschen

Im Dashboard unter **SQL Editor** den Inhalt von
[`backend/supabase/migration.sql`](backend/supabase/migration.sql) ausführen. Das legt an:

- die Tabelle `user_progress` mit Row-Level-Security (jede:r sieht nur den eigenen Datensatz),
- die Funktion `delete_own_account()`, mit der Nutzer:innen ihr Konto in der App selbst
  löschen können (der Fortschritt wird dabei mitgelöscht).

Das Skript kann gefahrlos mehrfach ausgeführt werden.

## 3. Redirect-URLs freigeben

Unter **Authentication → URL Configuration → Redirect URLs** die App-Adressen eintragen, z. B.:
- `http://localhost:8000` (lokales Testen mit `serve.py`)
- die Live-Domain (`https://pyquest.…`)

Die App nutzt `window.location.origin` als Redirect-Ziel.

## 4. E-Mail und Passwort – sofort einsatzbereit

Anmelden, Registrieren und „Passwort vergessen?“ funktionieren allein mit dem Supabase-Projekt.
Registrierte Adressen müssen ihre E-Mail bestätigen (Supabase-Standard). Die E-Mail-Vorlagen
lassen sich unter **Authentication → Email Templates** anpassen (z. B. auf Deutsch).
Passwörter brauchen mindestens 8 Zeichen.

## 5. Google-Anmeldung (optional)

1. [Google Cloud Console](https://console.cloud.google.com) → Projekt anlegen.
2. **APIs & Services → OAuth consent screen** konfigurieren (extern), App-Name und Support-Mail.
3. **Credentials → Create Credentials → OAuth client ID → Web application**.
   - **Authorized redirect URI:** `https://DEIN-PROJEKT.supabase.co/auth/v1/callback`
4. `Client ID` und `Client Secret` kopieren.
5. In Supabase: **Authentication → Providers → Google** aktivieren und beides einfügen.

## 6. GitHub-Anmeldung (optional, analog)

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - **Authorization callback URL:** `https://DEIN-PROJEKT.supabase.co/auth/v1/callback`
2. `Client ID` und `Client Secret` in Supabase unter **Authentication → Providers → GitHub** eintragen.

Weitere Anbieter funktionieren genauso; die Knöpfe stehen in `src/js/auth.js`.

## Verhalten der App mit Konto

- Beim Anmelden wird der lokale Fortschritt mit dem Konto zusammengeführt (nichts geht verloren).
  Gehört der lokale Stand zu einem anderen Konto, wird er verworfen.
- Beim Abmelden wird der lokale Stand vom Gerät entfernt, damit die nächste Person auf demselben
  Gerät nicht im fremden Fortschritt weiterarbeitet. Er bleibt im Konto gespeichert.
- „Konto löschen“ entfernt Konto und Fortschritt endgültig.

## Datenschutz / rechtliche Hinweise

- Region EU wählen und den **Auftragsverarbeitungsvertrag (DPA)** mit Supabase abschließen.
- Für Kinder und Jugendliche gelten besondere Anforderungen (DSGVO Art. 8: Einwilligung ab 16,
  darunter durch die Eltern). Der Gast-Modus ohne Konto ist der datensparsamste Weg.
- `impressum.html` und `datenschutz.html` sind vorhanden – Angaben vor dem Live-Gang prüfen.
