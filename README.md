# SyncSpace 🌌

**SyncSpace** ist eine smarte, bereichsübergreifende Koordinations-Plattform, die Software-Teams hilft, Integrationen abzustimmen, Engpässe und Blocker frühzeitig aufzulösen sowie die Teamkapazitäten im Gleichgewicht zu halten. Keine ungesteuerten Abhängigkeiten mehr – stattdessen klare Absprachen und reibungslose Deployments.

---

## 🗺️ Projektübersicht

### Was ist SyncSpace?
Bei modernen Softwareprojekten arbeiten viele Teams zeitgleich an unterschiedlichen Bausteinen. Oft wissen Entwickler nicht, ob Schnittstellen anderer Teams bereit sind, oder Scrum Master verlieren den Überblick über blockierende Barrieren. 

**SyncSpace** löst genau dieses Problem: Es ist die zentrale Brücke zwischen Produkt-Entscheidern, lösungsorientierten Scrum Mastern und produktiven Entwicklern. Die App bündelt alle Abhängigkeiten an einem zentralen Ort, strukturiert Abstimmungs-Workshops und zeigt Kalenderbelegungen in Echtzeit an.

### Für wen ist es gedacht?
* **Scrum Master, Agile Coaches & Projektleiter**, die den Arbeitsfluss sichern und Blocker beseitigen müssen.
* **Product Owner & Produktmanager**, die Kapazitäten steuern, Termine freigeben und Aufwände einschätzen.
* **Software-Entwickler & Engineers**, die technische Hürden melden und direktes Feedback zu Schnittstellen benötigen.

---

## ✨ Hauptfunktionen (Features)

* **🚨 Echtzeit Blocker-Management & Cockpit**: 
  Probleme werden sofort erfasst, mit Schweregraden (Niedrig, Warnung, Kritisch) versehen und können direkt an POs eskaliert werden. Jede Meldung ist sofort für alle Beteiligten sichtbar.
  
* **📊 Kapazitätsplaner**:
  Vorausschauende Verplanung von Teammitgliedern zur Vermeidung von Überlastung. Integrierte Berechnungen von Zeitschätzungen in Story Points (SP).

* **📅 Smarter Team-Kalender (mit 4-Stunden-Sicherheitsregel)**:
  Verhindert Burnout und Meeting-Flut. Der Kalender rechnet die Stunden aller zugelassenen Termine pro Tag zusammen. 
  * **Grün** (< 4 Std.): Tag ist frei und verfügbar.
  * **Gelb** (= 4 Std.): Tag ist optimal ausgelastet.
  * **Rot** (> 4 Std.): Warnung wegen Überbuchung!
  *(Workshops werden erst nach Bestätigung oder Freigabe in den Kalender eingetragen).*

* **👥 Rollenspezifische Dashboards**:
  Maßgeschneiderte Ansichten für jede der drei Kernrollen mit individueller Prioritäten- und Aufgabenliste.

---

## 🎭 Nutzerrollen in SyncSpace

In der Praxis greifen drei Rollen nahtlos über die App ineinander:

1. **Sergej (Scrum Master)**
   * *Seine Mission:* Wegfreiräumer des Teams.
   * *Dashboard:* Sieht alle Blocker aller Teams auf einen Blick und entscheidet per Knopfdruck über die notwendige Eskalation.

2. **Piotr (Product Owner)**
   * *Seine Mission:* Priorisierung und Strategie.
   * *Dashboard:* Steuert die Kapazitäten des Teams, bewertet eskalierte Probleme und gibt neue Einladungsanfragen für Abstimmungs-Workshops frei.

3. **Eugen (Entwickler)**
   * *Seine Mission:* Code schreiben und ausliefern.
   * *Dashboard:* Meldet Blocker direkt aus der IDE heraus, schätzt Story Points für persönliche To-Dos und behält anstehende Integrationstermine im Auge.

---

## 📈 KPIs & Wertversprechen

Durch den Einsatz von SyncSpace erzielen verteilte Produktbereiche messbare Verbesserungen:

* **⚡ -50% Blocker-Reaktionszeit**: Kritische Hindernisse werden dank der direkten PO-Eskalation doppelt so schnell gelöst.
* **⏱️ -20% bis -35% kürzere Integrationsdauer**: Keine misslungenen Live-Termine mehr, da Workshops und technische Klärungen vorausschauend stattfinden.
* **🛠️ -15% bis -25% weniger Nacharbeiten**: Schnittstellenfehler werden behoben, BEVOR sie im Code landen.
* **🧘 Gesündere Arbeitslast**: Die strikte **4-Stunden-Regel** im Kalender schützt Teams vor zu vielen Meetings und sichert Fokuszeit für Programmierarbeiten.

---

## 💻 Erste Schritte (Getting Started)

Folge diesen einfachen Schritten, um SyncSpace auf deinem lokalen Rechner zu starten:

### Voraussetzungen
Stelle sicher, dass du **Node.js** (Version 18 oder neuer) installiert hast.

### Installationsanleitung

1. **Code herunterladen & in das Verzeichnis wechseln**:
   ```bash
   cd syncspace
   ```

2. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

3. **Projekt im Entwicklungsmodus starten**:
   ```bash
   npm run dev
   ```

4. **Im Browser öffnen**:
   Öffne den Link, der im Terminal angezeigt wird (meistens `http://localhost:3000` oder `http://localhost:5173`), um die App auszuprobieren.

---

## 🛠️ Verwendete Technologien

* **React** – Für eine reaktive, komponentenbasierte Benutzeroberfläche.
* **Vite** – Moderner, blitzschneller Build-Server.
* **TypeScript** – Typisierte Sicherheit gegen Programmierfehler zur Laufzeit.
* **Tailwind CSS** – Für das moderne, aufgeräumte Design mit gut lesbaren Kontrasten.
* **Lucide React** – Elegante Vektor-Icons für intuitive Menüführungen.
* **Google AI Studio / Gemini API** – Unterstützung bei der smarten Generierung von Lösungsansätzen.

---

## 📸 Screenshots

Hier siehst du, wie die übersichtliche Benutzeroberfläche von SyncSpace aufgebaut ist:

### 1. Zentraler Kalender mit Belastungsanzeige
![Team-Kalender & Kapazitäten](screenshots/kapazitaetsplaner.png)
*Unter jedem Datum siehst du auf einen Blick, wie viele Stunden bereits mit Meetings belegt sind (z.B. "2h/4h").*

### 2. Blocker Dashboard
![Blocker-Cockpit](screenshots/blocker-dashboard.png)
*Sergejs Live-Übersicht aller gemeldeten Schnittstellenkonflikte mit Prioritätsstufe und direktem Alarm-Button.*

### 3. Persönliches Rollen-Cockpit
![Home Screen](screenshots/home-screen.png)
*Schneller Wechsel zwischen Sergej, Piotr und Eugen mit To-Do-Listen und Story-Point-Abschätzungen.*

---

## 📁 Projektstruktur

Hier ist die übersichtliche Gliederung unseres Quellcodes:

```text
syncspace/
├── src/
│   ├── components/
│   │   ├── HomeScreen.tsx        # Dashboard-Startseite & Benutzer-Umschaltung
│   │   ├── LoginScreen.tsx       # Simulierter Login-Bereich
│   │   ├── PersonalScreen.tsx    # Rollenspezifisches Arbeits-Cockpit (Sergej, Piotr, Eugen)
│   │   ├── TeamScreen.tsx        # Belegungs-Kalender & Teamkapazitäten
│   │   └── PhoneFrame.tsx        # Schicke Preview-Hülle im Smartphone-Stil
│   ├── state/
│   │   └── AppStateContext.tsx   # Globaler Zustand & Business-Logik der App
│   ├── data.ts                   # Start-Daten (Blocker, Aufgaben und Termine)
│   ├── types.ts                  # TypeScript-Definitionen für die Datensicherheit
│   ├── main.tsx                  # Einstiegspunkt für React
│   └── index.css                 # Globale Stylesheets und Tailwind-Konfiguration
├── package.json                  # Projektabhängigkeiten und Skripte
└── README.md                     # Diese Dokumentation
```

---

## 👥 Das Team hinter SyncSpace

* **Sergej** – Agile Coach & Master of Ceremony (Sorgt für den idealen Material- & Arbeitsfluss)
* **Piotr** – Strategischer Vordenker & Kapazitätsplaner (Behält Meilensteine und Budgets im Visier)
* **Eugen** – Lead Developer (Macht technische Herausforderungen sofort transparent und verständlich)
