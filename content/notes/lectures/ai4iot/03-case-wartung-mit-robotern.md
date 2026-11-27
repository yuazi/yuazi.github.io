---
title: "L03 - Case: Wartung mit Robotern an abgelegenen Orten"
tags:
  - ai4iot
  - iiot
  - fallstudie
  - remote-wartung
  - robotik
date: 2026-11-18
---

[[/notes/lectures/ai4iot/index|Zurück zum AI4IoT-Index]] | [[/notes/lectures/ai4iot/02-ot-cps|Zurück: (y-02) Grundlagen OT, CPS und Digital Twins]] | [[/notes/lectures/ai4iot/04-daten-und-modellbereitstellung|Weiter: (y-04) Daten- und Modellbereitstellung]]

## Mentales Modell

- In der Sitzung vom 18.11.2026 hat Prof. Dr. Jens Lachenmaier den Fall für die Prüfungsleistung vorgestellt. Jede Dreiergruppe entwirft eine AIoT-basierte Lösung für die Wartung mit Robotern an abgelegenen Orten. Abgabe ist das Kurz-Paper am 27.01.2027, präsentiert wird als Poster am 03.02.2027 (siehe [[/notes/lectures/ai4iot/00-kickoff|Kick-Off]]).
- Die Orte sind schwer erreichbar, gefährlich oder teuer für Menschen und schlecht ans Internet angebunden. Oft geht es um kritische Infrastruktur. Daraus folgen hohe Anforderungen an Zuverlässigkeit und Vertrauenswürdigkeit.
- Die Aufgabenstellung fragt die ganze Lösung ab: Geschäftsidee und Wertversprechen, Functional und Implementation Viewpoint, KI- und IoT-Komponenten, Dateninfrastruktur, Modelle, Rollen, Betrieb, Sicherheit, Mensch-Maschine-Schnittstelle und Wirtschaftlichkeit.
- Viele Fragen greifen spätere Sitzungen auf. Die Dateninfrastruktur behandelt [[/notes/lectures/ai4iot/04-daten-und-modellbereitstellung|Lerneinheit 04]], Sicherheit und Vertrauenswürdigkeit folgen in "Grundlagen Trust" (02.12.2026) und "Trustworthy AI" (09.12.2026).

## 1. Der Fall: Wartung mit Robotern an abgelegenen Orten

![[pictures/ai4iot/03/Lecture03_Pg002_Fall_Wartung_Mit_Robotern.png]]

<p class="image-caption">Wo heute schon Roboter an abgelegenen Orten warten oder reparieren.</p>

Die Folie fragt zuerst, wo es so etwas heute schon gibt:

- Reparatur großer Überland-Stromleitungen,
- Ölbohrtürme auf dem Ozean,
- Stromerzeugung in der Wüste (Solar) und Windkraftanlagen auf dem Meer,
- Internet of Underwater Things,
- Weltraum,
- auf Schiffen, vor allem beim Militär.

![[pictures/ai4iot/03/Lecture03_Pg003_Reparatur_Von_Stromleitungen.png]]

<p class="image-caption">Reparatur von Stromleitungen, mit dem Logo des Übertragungsnetzbetreibers Amprion.</p>

![[pictures/ai4iot/03/Lecture03_Pg004_Oelbohrturm.png]]

<p class="image-caption">Ein Ölbohrturm auf dem Meer (Bildquelle: Wikipedia).</p>

## 2. Besondere Herausforderungen

![[pictures/ai4iot/03/Lecture03_Pg005_Besondere_Herausforderungen.png]]

<p class="image-caption">Fünf Herausforderungen, die alle diese Einsatzorte gemeinsam haben.</p>

| Herausforderung                                                   | Mögliche Folge für die Lösung (eigene Ableitung)                                         |
| :---------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| abgelegene, schwer zugängliche Orte                               | Anfahrt und Austausch von Teilen sind teuer, die Lösung muss lange ohne Besuch auskommen |
| wenig Menschen vor Ort, wegen Gefahr oder Aufwand                 | Roboter übernehmen Aufgaben, Menschen steuern oder überwachen aus der Ferne              |
| schlechte Internetanbindung, Zeitverzug bei der Signalübertragung | Echtzeit-Fernsteuerung ist schwierig, Modelle müssen vor Ort laufen (Edge)               |
| mehrere Roboter müssen zusammenarbeiten                           | Koordination zwischen Robotern, Daten aus mehreren Quellen                               |
| kritische Infrastruktur                                           | hohe Anforderungen an Zuverlässigkeit und Trustworthiness                                |

## 3. Aufgabenstellung

![[pictures/ai4iot/03/Lecture03_Pg006_Aufgabenstellung.png]]

<p class="image-caption">Die Aufgabenstellung für das Kurz-Paper: ein Lösungsansatz für die AIoT-basierte Wartung.</p>

Entwickeln Sie einen Lösungsansatz für die AIoT-basierte Wartung. Die Folie gibt dazu zehn Leitfragen vor:

1. Lösungsidee, Beteiligte und Wertschöpfungsversprechen skizzieren (Business Viewpoint).
2. Functional und Implementation Viewpoint für den Lösungsansatz erstellen.
3. Welche AI- und IoT-Komponenten sind für welche Aufgabe vorgesehen?
4. Welche Dateninfrastruktur ist vorgesehen?
5. Welche Typen von AI-Modellen werden wie und warum genutzt? Wie wird ihre Qualität gemessen und überwacht? Wie werden die Modelle in die IoT-Umgebung integriert?
6. Wer wird in welcher Rolle mit welchen Verantwortlichkeiten und Rechten beteiligt?
7. Wie werden Entwicklung, Einführung und Betrieb gestaltet?
8. Wie werden Sicherheit und Vertrauenswürdigkeit sichergestellt?
9. Ein Vorschlag für die Mensch-Maschine-Schnittstelle.
10. Inwiefern ist die Lösung wirtschaftlich?

Eigene Schwerpunkte sind in Absprache mit den Dozenten möglich.

### Wo die Leitfragen im Kurs vorkommen

| Leitfrage                             | Passende Notiz                                                                                                         |
| :------------------------------------ | :--------------------------------------------------------------------------------------------------------------------- |
| AI-Komponenten und Modelltypen        | [[/notes/lectures/ai4iot/01-ai-methoden\|(y-01) AI-Methoden]], etwa Abweichungsanalyse, CNNs, TinyLLMs für Edge-Geräte |
| IoT-Komponenten, Sensoren und Aktoren | [[/notes/lectures/ai4iot/02-ot-cps\|(y-02) Grundlagen OT, CPS und Digital Twins]], etwa das Tor als CPS                |
| Dateninfrastruktur, Modellintegration | [[/notes/lectures/ai4iot/04-daten-und-modellbereitstellung\|(y-04) Daten- und Modellbereitstellung]]                   |
| Sicherheit und Vertrauenswürdigkeit   | Grundlagen Trust (02.12.2026), Trustworthy AI (09.12.2026)                                                             |

## Selbsttest

1. Nennen Sie vier Einsatzorte, an denen heute schon Wartung mit Robotern an abgelegenen Orten vorkommt.

> [!success]- Antwort
> Die Folie nennt die Reparatur großer Überland-Stromleitungen, Ölbohrtürme auf dem Ozean, Solaranlagen in der Wüste und Windkraftanlagen auf dem Meer, das Internet of Underwater Things, den Weltraum und Schiffe, vor allem beim Militär.

2. Welche besonderen Herausforderungen haben diese Einsatzorte?

> [!success]- Antwort
> Sie sind abgelegen und schwer zugänglich, wegen Gefahren oder hohem Aufwand sind wenig Menschen vor Ort, die Internetanbindung ist schlecht und die Signalübertragung verzögert, es braucht Kombinationen von Robotern, und oft handelt es sich um kritische Infrastruktur mit hohen Anforderungen an Zuverlässigkeit und Trustworthiness.

3. Welche Viewpoints soll das Kurz-Paper enthalten?

> [!success]- Antwort
> Den Business Viewpoint mit Lösungsidee, Beteiligten und Wertschöpfungsversprechen sowie den Functional und den Implementation Viewpoint des Lösungsansatzes.

4. Welche Fragen zu den AI-Modellen stellt die Aufgabenstellung?

> [!success]- Antwort
> Welche Typen von AI-Modellen man wie und warum nutzt, wie man die Qualität der Modelle misst und überwacht und wie man die Modelle in die IoT-Umgebung integriert.

---

[[/notes/lectures/ai4iot/index|Zurück zum AI4IoT-Index]] | [[/notes/lectures/ai4iot/02-ot-cps|Zurück: (y-02) Grundlagen OT, CPS und Digital Twins]] | [[/notes/lectures/ai4iot/04-daten-und-modellbereitstellung|Weiter: (y-04) Daten- und Modellbereitstellung]]
