---
title: "L02 - Grundlagen OT, CPS und Digital Twins"
tags:
  - ai4iot
  - iiot
  - automatisierungstechnik
  - cps
  - digital-twin
date: 2026-11-11
---

[[/notes/lectures/ai4iot/index|Zurück zum AI4IoT-Index]] | [[/notes/lectures/ai4iot/01-ai-methoden|Zurück: (y-01) AI-Methoden]]

> [!note] Foliengrundlage
> Der Foliensatz von Prof. Dr. Jens Lachenmaier trägt das Datum 22.10.2025 (Version V01). Laut Semesterplan gehören die Themen zu den Sitzungen "Grundlagen OT" (04.11.2026) und "Grundlagen IIoT und CPS" (11.11.2026).

## Mentales Modell

- Viele Maschinen und Anlagen laufen heute nach den Regeln der Automatisierungstechnik, der Operational Technology (OT). OT steuert lokal, in Echtzeit und nach festen Logikregeln. Sie ist auf Sicherheit und Robustheit ausgelegt.
- Das Herz der OT ist die speicherprogrammierbare Steuerung (SPS). Sie liest Sensorzustände, wendet eine deterministische Regel an und setzt Aktorzustände. Die Regel lässt sich als Wahrheitstabelle aufschreiben und mit einem KV-Diagramm vereinfachen.
- Ein Cyber-physisches System (CPS) koppelt die physische Welt an eine digitale Logik, die auch außerhalb des Schaltschranks laufen kann. Sensoren übertragen den Istzustand ins Digitale (Cyberize the Physical), dort entsteht ein virtuelles Abbild, der Digital Twin, und Entscheidungen wirken über Aktoren zurück (Physicalize the Cyber).
- Die Vorlesung zeigt den Unterschied an zwei Beispielen, die es in beiden Welten gibt: Licht im Haus (KNX gegen Smart Bulb mit Sprachassistent) und ein automatisches Schiebetor (SPS-Logik gegen CPS).

## 1. Automatisierungstechnik und Automatisierungsgrad

Die Vorlesung beginnt mit zwei Fragen: Nach welchen Prinzipien funktionieren die meisten Assets heute, und warum gerade nach diesen?

![[pictures/ai4iot/02/Lecture02_Pg004_Beispiele_Automatisierungsgrad.png]]

<p class="image-caption">Werkzeugmaschinen für ein Drehteil, von manuell über teilautomatisiert bis vollautomatisiert.</p>

Als Beispiel dient ein Drehteil. Es lässt sich an einer manuellen Drehmaschine fertigen, an einer teilautomatisierten Maschine oder an einem vollautomatisierten Bearbeitungszentrum. Je höher der Automatisierungsgrad, desto mehr Arbeit übernimmt die Steuerung, und desto mehr hängt an ihrer Zuverlässigkeit.

## 2. Die Prinzipien von OT

![[pictures/ai4iot/02/Lecture02_Pg005_Prinzipien_Von_Ot.png]]

<p class="image-caption">Vier Prinzipien der OT: Leitungsvermittlung, proprietäre Sprachen, SPS-Logik und Echtzeit.</p>

OT folgt vier Prinzipien:

- Leitungsvermittelte Datenübertragung: Sender und Empfänger haben einen festen Kanal.
- Proprietäre Sprachen zur Datenübertragung: Jeder Hersteller und jeder Bus spricht sein eigenes Protokoll.
- Steuerung nach Logik-Prinzipien über eine lokale speicherprogrammierbare Steuerung (SPS).
- Echtzeit-Datenübertragung: Ein Signal muss innerhalb einer garantierten Zeit ankommen.

## 3. Leitungsvermittlung

![[pictures/ai4iot/02/Lecture02_Pg007_Leitungsvermittlung.png]]

<p class="image-caption">Leitungsvermittlung am Beispiel des klassischen Telefonnetzes: Wählscheibentelefon und Handvermittlung.</p>

Bei der Leitungsvermittlung wird für die Dauer der Kommunikation ein physischer Kanal zwischen den Partnern aufgebaut, etwa für ein Telefongespräch, und danach wieder abgebaut. Solange die Verbindung steht, gehört der Kanal den beiden Partnern exklusiv. Beispiele sind das Telefonnetz, Datex-L und ISDN.

Für die Steuerung einer Maschine ist das ein Vorteil: Niemand teilt sich die Leitung, also gibt es keine Wartezeiten durch fremden Verkehr, und die Laufzeit eines Signals bleibt vorhersagbar. Das Internet arbeitet dagegen paketvermittelt, Pakete teilen sich die Leitungen und können unterschiedlich lange brauchen.

## 4. Schaltschrank und SPS

![[pictures/ai4iot/02/Lecture02_Pg009_Schaltschrank_Mit_Sps.png]]

<p class="image-caption">Schaltschrank mit SPS: Die Steuerung sitzt im Schrank direkt an der Maschine.</p>

An einer Werkzeugmaschine sitzt die SPS im Schaltschrank direkt an der Anlage, hier eine kompakte Kleinsteuerung, verdrahtet mit den Sensoren und Aktoren der Maschine.

## 5. Die Automatisierungspyramide

![[pictures/ai4iot/02/Lecture02_Pg010_Automatisierungspyramide.png]]

<p class="image-caption">Die Automatisierungspyramide von der Feldebene bis zur Unternehmensebene (verändert nach VDI / zimt.uni-siegen.de).</p>

Die Komponenten der Automatisierungstechnik ordnet die Automatisierungspyramide in Ebenen:

| Ebene                            | System                                                |
| :------------------------------- | :---------------------------------------------------- |
| Unternehmensebene                | ERP                                                   |
| Betriebsleitebene                | MES (Betriebsdatenmanagement)                         |
| Prozess- und Steuerungsleitebene | HMI/SCADA (Bedienen und Beobachten, Prozesssteuerung) |
| Steuerungsebene                  | SPS (Maschinen- und Anlagensteuerung)                 |
| Feldebene                        | Sensorik und Aktorik (Ein- und Ausgabesignale)        |

Darunter liegen Fertigung und Produktionsprozesse. Planung und Steuerung laufen von oben nach unten, Rückmeldungen von unten nach oben. Die unteren Ebenen sind über Feldbusse vernetzt.

## 6. Feldbusse

![[pictures/ai4iot/02/Lecture02_Pg008_Feldbus.png]]

<p class="image-caption">Eine Liste verbreiteter Feldbusse (Quelle: Wikipedia).</p>

Ein Feldbus verbindet Sensoren, Aktoren und Steuerungen auf der Feldebene. Die lange Liste auf der Folie zeigt das Prinzip der proprietären Sprachen: Es gibt viele Busse, oft eng an einzelne Hersteller oder Branchen gebunden. Wer Daten aus der Feldebene holen will, muss zuerst klären, welchen Bus die Maschine spricht.

## 7. Die SPS als deterministische Regel

![[pictures/ai4iot/02/Lecture02_Pg014_Sps_Deterministische_Regel.png]]

<p class="image-caption">Die SPS: Eingangszustände werden über eine deterministische Regel auf Ausgangszustände abgebildet (Quelle: Siemens).</p>

Eine SPS bildet Zustände ab: Eingänge (Sensoren) gehen hinein, eine deterministische Regel, also eine Funktion, berechnet daraus die Ausgänge (Aktoren). Bei gleichen Eingängen kommt immer dasselbe heraus. Für eine Maschine ist das erwünscht, weil sich das Verhalten prüfen lässt.

![[pictures/ai4iot/02/Lecture02_Pg011_Sps_Und_Kv_Diagramm.png]]

<p class="image-caption">Von der Funktionstabelle über das KV-Diagramm zum Schaltausdruck.</p>

Entwickelt wird die Regel in drei Schritten:

1. Eine Funktionstabelle (Wahrheitstabelle) listet für jede Kombination der Eingänge den gewünschten Ausgang.
2. Ein Karnaugh-Veitch-Diagramm (KV-Diagramm) ordnet die Tabelle so an, dass benachbarte Einsen sich zu Blöcken zusammenfassen lassen.
3. Aus den Blöcken folgt der vereinfachte Ausdruck der Schaltalgebra.

Im Beispiel lautet das Ergebnis M1 = (S1 ∧ S3) ∨ (S1 ∧ S2). Der Motor M1 läuft also nur, wenn S1 aktiv ist und zusätzlich S2 oder S3. Ausgeklammert heißt das M1 = S1 ∧ (S2 ∨ S3).

## 8. Beispiel: Licht und Lichtschalter mit KNX

![[pictures/ai4iot/02/Lecture02_Pg012_Heimautomation_Licht.png]]

<p class="image-caption">Heimautomation klassisch: Licht und Lichtschalter über KNX.</p>

Auch das Haus kennt OT. KNX ist ein Feldbus für die Gebäudeautomation. Taster und Schaltaktoren hängen am selben Bus, und welcher Taster welche Lampe schaltet, wird konfiguriert. Die Logik bleibt lokal im Haus und folgt festen Regeln.

## 9. Team Work I: Automatisierung eines Schiebetors

![[pictures/ai4iot/02/Lecture02_Pg013_Team_Work_Schiebetor.png]]

<p class="image-caption">Team Work I: ein Schiebetor mit Sensorik und Aktorik automatisieren und in einer Siemens-LOGO!-Steuerung umsetzen.</p>

In der Gruppenarbeit wird ein Schiebetor automatisiert, Schritt für Schritt wie in Abschnitt 7:

1. Sensorik und Aktorik am Tor anbringen.
2. Eine Funktionstabelle für 4 Sensoren und 2 Aktoren aufstellen.
3. Mit einem KV-Diagramm den algebraischen Ausdruck ableiten (Form X = AB ∨ …).
4. Die Logik in einer Siemens-LOGO!-Steuerung umsetzen, mit der Software LOGO! Soft Comfort (V8.2 SP1).

## 10. Eigenschaften von OT

![[pictures/ai4iot/02/Lecture02_Pg015_Eigenschaften_Ot.png]]

<p class="image-caption">Eigenschaften der Automatisierungstechnik: Sensordaten, Safety, Ausdehnung und Verortung.</p>

| Merkmal     | OT                                                                    |
| :---------- | :-------------------------------------------------------------------- |
| Sensordaten | Kleine Datenmengen in kurzen Intervallen, Echtzeit                    |
| Safety      | Robustheit und Echtzeitfähigkeit                                      |
| Ausdehnung  | Meist lokal an der Maschine, teilweise unternehmensintern, kurze Wege |
| Verortung   | In der Automatisierungstechnik, mit verteilten Zuständigkeiten        |

Die Folie "Warum?" danach wurde nur mündlich besprochen. Eine naheliegende Antwort auf die Eingangsfrage lässt sich aus der Tabelle ableiten: Eine Maschine, die Menschen verletzen oder Material zerstören kann, braucht eine Steuerung, die vorhersagbar und rechtzeitig reagiert. Exklusive Leitungen, lokale Logik und deterministische Regeln liefern genau das. Der Preis dafür sind Insellösungen, die schwer an IT-Systeme anzubinden sind.

## 11. Cyber-physische Systeme

![[pictures/ai4iot/02/Lecture02_Pg017_Cps_Foundations.png]]

<p class="image-caption">Grundlagenliteratur zu Cyber-physischen Systemen: der Aufsatz "CPS Foundations".</p>

![[pictures/ai4iot/02/Lecture02_Pg018_Cps_Cyber_Und_Physical.png]]

<p class="image-caption">Wechselwirkung zwischen Cyber und Physical: Sensing überträgt den physischen Zustand in einen logischen, Actuation wirkt zurück (Quelle: NISTIR 8316, S. 7).</p>

Ein CPS verbindet einen physischen Zustand mit einem logischen Zustand. Die NIST-Grafik zeigt das als Kreislauf: Über Sensing wird der physische Zustand, der den Gesetzen der Physik folgt, zu einem logischen Zustand. Auf dem rechnet die Logik, und über Actuation wirkt das Ergebnis zurück auf die physische Welt.

## 12. Beispiel: Licht als CPS

![[pictures/ai4iot/02/Lecture02_Pg019_Cps_Heimautomation.png]]

<p class="image-caption">Dasselbe Licht als CPS: Hue-Lampen, Amazon Echo und ein TP-Link-Smart-Plug.</p>

Dieselbe Aufgabe wie in Abschnitt 8, jetzt als CPS gelöst: Hue-Lampen, ein Amazon Echo und ein TP-Link-Smart-Plug. Die Geräte hängen im normalen Heimnetz und am Internet statt an einem eigenen Bus, und die Logik wandert aus dem Schaltkasten in Apps und Cloud-Dienste. Dadurch werden Sprachsteuerung oder Regeln über mehrere Hersteller hinweg möglich. Eine garantierte Reaktionszeit wie beim Feldbus gibt es über Heimnetz und Cloud allerdings nicht (eigene Einordnung, nicht auf der Folie).

## 13. Die CPS-Gefriertruhe und der Digital Twin

![[pictures/ai4iot/02/Lecture02_Pg020_Cps_Gefriertruhe_Digital_Twin.png]]

<p class="image-caption">Die CPS-Gefriertruhe: Cyberize the Physical, virtuelles Abbild als Digital Twin, Physicalize the Cyber.</p>

Das Prinzip eines CPS zeigt die Vorlesung an einer Gefriertruhe mit drei Elementen: einem Thermostat (T), einem Sensor (Z), der meldet, ob die Truhe offen ist, und einem Motor (K) für das Kühlaggregat. Der Ablauf hat drei Schritte:

1. **Cyberize the Physical (CtP)**: Die Sensoren übertragen den Istzustand in die Virtualität, zum Beispiel T = -12 °C, Z = offen, K = aus.
2. **Virtuelles Abbild**: Im Digital Twin liegen Istzustand, Logik und Sollzustand. Die Logik F(T, Z, K) arbeitet mit einem Temperaturbereich zwischen -10 °C und -20 °C und berechnet daraus den Sollzustand, hier K = an.
3. **Physicalize the Cyber (PtC)**: Der Sollzustand wirkt zurück auf die Realität, der Motor springt an.

## 14. Team Work: Das Schiebetor als CPS

![[pictures/ai4iot/02/Lecture02_Pg021_Tor_Als_Cps.png]]

<p class="image-caption">Team Work: das Schiebetor aus Abschnitt 9 als CPS neu denken.</p>

Die zweite Gruppenarbeit greift das Schiebetor wieder auf. Diesmal wird es als CPS modelliert: Welche Zustände wandern ins Digitale, wie sieht das virtuelle Abbild aus, und wie wirkt die Logik über die Aktoren zurück aufs Tor?

## 15. Ausblick

Die nächste Sitzung behandelt ein strukturiertes Vorgehen zur Entwicklung von CPS.

## Selbsttest

1. Nennen Sie die vier Prinzipien von OT.

> [!success]- Antwort
> Leitungsvermittelte Datenübertragung, proprietäre Sprachen zur Datenübertragung, Steuerung nach Logik-Prinzipien über eine lokale SPS und Echtzeit-Datenübertragung.

2. Was ist Leitungsvermittlung, und warum passt sie zur Maschinensteuerung?

> [!success]- Antwort
> Für die Dauer der Kommunikation wird ein physischer Kanal zwischen den Partnern aufgebaut, der ihnen exklusiv gehört, und danach wieder abgebaut (Beispiele: Telefonnetz, Datex-L, ISDN). Weil sich niemand die Leitung teilt, bleibt die Laufzeit eines Signals vorhersagbar, und erst das macht Echtzeit möglich.

3. Ordnen Sie ERP, MES, HMI/SCADA, SPS und Sensorik/Aktorik in die Automatisierungspyramide ein.

> [!success]- Antwort
> Von oben nach unten: ERP auf der Unternehmensebene, MES auf der Betriebsleitebene, HMI/SCADA auf der Prozess- und Steuerungsleitebene, die SPS auf der Steuerungsebene und Sensorik/Aktorik auf der Feldebene. Planung und Steuerung fließen nach unten, Rückmeldungen nach oben, die unteren Ebenen sind per Feldbus vernetzt.

4. Vereinfachen Sie M1 = (S1 ∧ S3) ∨ (S1 ∧ S2) und beschreiben Sie, wann der Motor läuft.

> [!success]- Antwort
> M1 = S1 ∧ (S2 ∨ S3). Der Motor läuft, wenn S1 aktiv ist und mindestens einer der Sensoren S2 oder S3. Ohne S1 bleibt er immer aus.

5. Warum funktionieren so viele Anlagen nach den Prinzipien der OT?

> [!success]- Antwort
> Weil Maschinen sicher und rechtzeitig reagieren müssen. OT arbeitet mit kleinen Datenmengen in kurzen Intervallen, in Echtzeit, robust und lokal. Exklusive Leitungen, lokale Logik und deterministische Regeln machen das Verhalten vorhersagbar und prüfbar. Der Nachteil sind proprietäre Insellösungen, die sich schwer mit IT verbinden lassen.

6. Erklären Sie die drei Schritte eines CPS am Beispiel der Gefriertruhe.

> [!success]- Antwort
> (I) Cyberize the Physical: Thermostat (T) und Sensor (Z) übertragen den Istzustand ins Digitale, etwa T = -12 °C, Z = offen, K = aus. (II) Im virtuellen Abbild, dem Digital Twin, berechnet die Logik F(T, Z, K) mit dem Zielbereich -10 °C bis -20 °C den Sollzustand K = an. (III) Physicalize the Cyber: Der Sollzustand wird über den Motor (K) in der Realität umgesetzt.

7. Worin unterscheidet sich das Licht über KNX vom Licht mit Hue, Echo und Smart Plug?

> [!success]- Antwort
> Bei KNX hängen Taster und Aktoren an einem eigenen Gebäudebus, und die Logik bleibt lokal und regelbasiert, ganz im Sinne der OT. Die Smart-Home-Variante ist ein CPS: Die Geräte hängen im normalen Netz und am Internet, die Logik liegt in Apps und Cloud-Diensten. Das ermöglicht Sprachsteuerung und herstellerübergreifende Regeln, garantiert aber keine Reaktionszeit.

---

[[/notes/lectures/ai4iot/index|Zurück zum AI4IoT-Index]] | [[/notes/lectures/ai4iot/01-ai-methoden|Zurück: (y-01) AI-Methoden]]
