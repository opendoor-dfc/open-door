# OPEN DOOR – Website

*From Potential to Possibility.*

Die Website ist ein **Prototyp**, entstanden im Women@Dior × UNESCO Mentoring-Programm.

## So bearbeitest du die Website (kein Code nötig)

1. Öffne **https://app.pagescms.org** und melde dich mit deinem GitHub-Account an.
2. Wähle das Projekt **open-door** aus.
3. Links im Menü siehst du:
   - **Opportunities**: Chancen (Praktika, Stipendien …)
   - **Resources**: Lernplattformen, Vorlagen, Guides
   - **Events & Workshops**
   - **Programme modules**: die 5 Module des Zertifikatsprogramms
   - **Page: …**: die Texte der einzelnen Seiten
4. Klicke auf einen Eintrag, ändere ihn und klicke auf **Save**. Für einen neuen Eintrag klickst du auf **Add an entry**.
5. Nach etwa 1–2 Minuten ist die Änderung auf der Website sichtbar.

**Etwas kaputt gemacht?** Kein Problem. Jede Änderung wird gespeichert und kann wiederhergestellt werden. Sag Kathrin Bescheid.

## Regeln für Chancen (Opportunity Explorer)

- **Nur echte, geprüfte Chancen** von offiziellen Websites eintragen.
- Immer **„Last verified on“** auf das heutige Datum setzen, wenn du die Infos auf der offiziellen Seite geprüft hast.
- Abgelaufene Chancen löschen oder die Deadline aktualisieren.
- Vorsicht bei Angeboten, die Geld für die Bewerbung verlangen.
- Beispiel-Einträge (Haken bei „Example entry“) werden gelöscht, sobald echte Einträge da sind.

## Datenschutz und Recht (Prototyp-Phase)

- Die Website sammelt **keine** Daten: keine Formulare, kein Login, keine Cookies, kein Tracking.
- Bitte **keine** Fotos oder Namen von Teilnehmerinnen hochladen, besonders nicht von Minderjährigen.
- **Keine Logos** von Dior oder UNESCO verwenden (Markenrecht).
- Die Seite ist für Suchmaschinen gesperrt (`prototype: true` in `_config.yml`).
- **Vor einem öffentlichen Launch:** Impressum und Datenschutzerklärung ergänzen, dann `prototype: false` setzen.

## Technik (für Neugierige)

- [Jekyll](https://jekyllrb.com) mit GitHub Pages; der Build passiert automatisch bei jeder Änderung.
- Inhalte liegen in `_opportunities/`, `_resources/`, `_events/` und `_modules/`, die Seitentexte in `*.md`.
- Das Aussehen steckt in `assets/css/style.css`, die Layouts in `_layouts/`.
- Die Editor-Formulare sind in `.pages.yml` definiert.
