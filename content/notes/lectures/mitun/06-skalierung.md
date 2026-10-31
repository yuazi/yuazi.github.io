---
title: "L06 - Skalierung"
tags:
  - mitun
  - skalierung
  - microservices
  - devops
  - dora-metriken
  - safe
  - spotify-modell
date: 2026-10-31
---

[[/notes/lectures/mitun/index|Zurück zum MITUN-Index]] | [[/notes/lectures/mitun/05-business-plan-und-funding|Zurück: (y-05) Business Plan und Funding]] | [[/notes/lectures/mitun/07-vermarktung|Weiter: (y-07) Vermarktung]]

> [!note] Foliengrundlage
> Diese Notiz basiert auf dem Foliensatz aus dem Wintersemester 2025/26. Sobald die Folien für 2026/27 vorliegen, wird sie daran angepasst.

## Mentales Modell

- Wachstum heißt, dass ein Unternehmen größer wird. Skalierung heißt, dass es dabei Skaleneffekte nutzt, sodass der Umsatz schneller steigt als die Kosten. Software ist dafür gut geeignet, aber die Praxis zeigt, dass gerade Vertrieb, Produktentwicklung und Wachstum Startups Probleme machen.
- Fitzgerald u. a. (2017) unterscheiden drei Dimensionen der Skalierung: Produkt, Prozess und Organisation. Qualität, Kosten, Zeit und Softwarefähigkeiten wirken von außen.
- Beim Produkt helfen eine lose gekoppelte Architektur (Microservices, wenn sie passen) und externe Innovationsleistung über Plattformen mit Boundary Resources wie APIs, SDKs und Entwicklerportalen.
- Beim Prozess misst man Software Delivery Performance mit den vier DORA-Metriken. DevOps, Continuous Integration und Delivery und Golden Paths verbessern sie. Mehr Entwickler bringen nur dann mehr Leistung, wenn Architektur und Prozesse mitwachsen.
- Bei der Organisation stoßen agile Teams an Grenzen (Brooks's Law, Conway's Law, Zwei-Pizza-Regel). Skalierte Rahmenwerke wie das Spotify-Modell, LeSS und SAFe ordnen viele Teams, und eine gestufte Support-Organisation fängt wachsende Kundenzahlen auf.
- Tools für Planung, Code, Build, Test, Deployment und Betrieb unterstützen, ersetzen aber keine Prinzipien: "A fool with a tool is still a fool".

## 1. Inhalt und Lernziele

![[pictures/mitun/06/Lecture06_Pg003_Inhalt_Und_Lernziele.png]]

<p class="image-caption">Inhalt der Vorlesung.</p>

![[pictures/mitun/06/Lecture06_Pg004_Inhalt_Und_Lernziele.png]]

<p class="image-caption">Lernziele der Einheit.</p>

Das Kapitel hat drei Teile: Allgemeines, die Dimensionen Produkt, Prozess und Organisation und Toolsupport zur Steigerung der Software Delivery Performance. Ziel ist, Wachstum und Skalierung abzugrenzen und die Bedeutung der Skalierung für Anbieter software-intensiver Produkte und Dienstleistungen zu diskutieren, die Dimensionen der Skalierung zu kennen und Ansätze einzuordnen, Kennzahlen für skalierbare Softwareentwicklungsorganisationen zu beurteilen, DevOps und unterstützende Tools zu erläutern und Ansätze zur Skalierung agiler Organisationen voneinander abzugrenzen.

## 2. Allgemeines

### Motivation

![[pictures/mitun/06/Lecture06_Pg006_Motivation.png]]

<p class="image-caption">Wachstumsphase und nachhaltige Skaleneffekte aus Kapitel 1.</p>

Aus [[/notes/lectures/mitun/01-grundlagen|Kapitel 1]] ist die Wachstumsphase bekannt: Der Break-even ist erreicht, Produktion und Vertrieb werden ausgebaut, neue Märkte erschlossen, der Kapitalbedarf steigt. Mögliche Problembereiche sind Kundengewinnung, fehlendes Kapital, aktiver werdende Wettbewerber, die Organisation und die Qualität. Software hat dabei nachhaltige Skaleneffekte: Die First-Copy-Costs verteilen sich auf immer mehr Kopien (Degressionseffekt), und ab einer kritischen Masse steigen die Erlöse überproportional (Skalierungseffekt).

![[pictures/mitun/06/Lecture06_Pg007_Motivation.png]]

<p class="image-caption">Herausforderungen von Startups (PwC 2019) und Stimmen aus der Praxis.</p>

Nach dem Deutschen Startup Monitor 2019 (PwC 2019) sind Vertrieb und Kundengewinnung (55,3%), Produktentwicklung (43,9%), Kapitalbeschaffung (37,9%) und Wachstum (36,3%) die größten aktuellen Herausforderungen der Startups. Elon Musk beschreibt dasselbe für Hardware: Prototypen seien einfach, die Serienproduktion sei 1000% bis 10.000% schwerer. Eine Schlagzeile fragt, ob GPT-5 die Grenzen des Wachstums zeigt.

### Wachstum, Skalierbarkeit und Skalierung

![[pictures/mitun/06/Lecture06_Pg008_Wachstum_Skalierbarkeit_Und_Skalierung.png]]

<p class="image-caption">Definitionen von Wachstum, Skalierbarkeit und Skalierung.</p>

| Begriff                                 | Definition                                                                                                                                  |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| Wachstum                                | Zunahme der Größe eines Unternehmens. Mit welchen Größen man Wachstum misst, ist umstritten (Strietzel 2005).                               |
| Skalierbarkeit (technisch)              | Fähigkeit eines Systems, eine steigende Arbeitslast aufzunehmen (Stampfl u. a. 2013 nach Hill 1990).                                        |
| Skalierbarkeit (betriebswirtschaftlich) | Fähigkeit eines Geschäftsmodells, die Erlöse schneller zu steigern als die zugehörige Kostenbasis (Stampfl u. a. 2013 nach Hallowell 2001). |
| Skalierung (Arbeitsdefinition)          | Wachstum bzw. Ausbau eines software-intensiven Geschäftsmodells unter Ausnutzung möglicher Skaleneffekte (economies of scale and scope).    |

### Determinanten der Skalierung von Geschäftsmodellen

![[pictures/mitun/06/Lecture06_Pg009_Determinanten_Der_Skalierung_Von_Gesch_Ftsmodellen.png]]

<p class="image-caption">Explorative model of business model scalability (nach Stampfl u. a. 2013).</p>

Stampfl u. a. (2013) nennen Determinanten, die über die Konzeption und Realisierung des Geschäftsmodells dessen Skalierbarkeit bestimmen:

- Technologie: automatisierte Prozesse und skalierbare technische Infrastruktur
- Kosten- und Erlösstruktur und die Anpassbarkeit an verschiedene Rechtsordnungen
- Netzwerkeffekte: viraler Effekt und kritische Masse
- Nutzerorientierung: Problemlösung, Einfachheit, Vorwissen der Nutzer
- Markt: Marktpotenzial, Marktdynamik, Markterziehung
- Management: Team, Standort, Partnerschaften
- Attraktivität für Investoren

Ein skalierbares Geschäftsmodell führt zu Unternehmenswachstum über zusätzliche Märkte, Kunden, Regionen, Produkte und Funktionen oder Teams.

## 3. Dimensionen der Skalierung

![[pictures/mitun/06/Lecture06_Pg011_Dimensionen_Der_Skalierung.png]]

<p class="image-caption">Produkt, Prozess und Organisation als Dimensionen der Skalierung (Fitzgerald u. a. 2017).</p>

Fitzgerald u. a. (2017) stellen Produkt, Organisation und Prozess als drei Teile einer Black Box dar. Um sie herum wirken Qualität, Kosten, Zeit und Softwarefähigkeiten. Die folgenden Abschnitte gehen die drei Dimensionen nacheinander durch.

## 4. Produkt

### Microservice-Architekturen

![[pictures/mitun/06/Lecture06_Pg013_Microservice_Architekturen.png]]

<p class="image-caption">Monolith und Microservices (Microservices.io 2020, Kwiecien 2019).</p>

Eine Microservice-Architektur strukturiert eine Anwendung als Sammlung von Services, die lose gekoppelt, unabhängig deploybar, um Geschäftsfähigkeiten herum organisiert, im Besitz eines kleinen Teams und gut wart- und testbar sind. Sie erlaubt schnelle, häufige und zuverlässige Auslieferung großer, komplexer Anwendungen und die schrittweise Weiterentwicklung des Technologie-Stacks. Im Monolithen dagegen laufen Oberfläche, Geschäftslogik und Datenbank als eine Instanz. Die Service-Graphen von Amazon und Netflix zeigen, wie komplex solche Landschaften werden. Die Folie warnt vor Antipatterns.

![[pictures/mitun/06/Lecture06_Pg014_Microservice_Architekturen.png]]

<p class="image-caption">Prime Video wechselt von Microservices zum Monolithen (Amazon 2023).</p>

Das Team von Prime Video baute 2023 seinen Dienst zur Überwachung der Audio- und Videoqualität von einer verteilten Microservice-Architektur zu einem Monolithen um. Damit erreichte es höhere Skalierung und Ausfallsicherheit und senkte die Kosten um 90% (Amazon 2023).

### Skalieren über externe Innovationsleistung

![[pictures/mitun/06/Lecture06_Pg015_Skalieren_Ber_Externe_Innovationsleistung.png]]

<p class="image-caption">Verschiebung der treibenden Innovationsquellen (nach Hoch und Freking 2009).</p>

Mit steigenden kumulierten Investitionen in Innovation verschieben sich die treibenden Innovationsquellen vom Lieferanten über den Software- bzw. Plattformanbieter und den Kunden zum Partnerökosystem aus Plattformanbieter, Hauptkunden, Komplementoren und Wettbewerbern (Hoch und Freking 2009). Jede Stufe hebt die Innovationsdynamik auf eine neue S-Kurve.

### Boundary Resources

![[pictures/mitun/06/Lecture06_Pg016_Boundary_Resources.png]]

<p class="image-caption">Boundary Resources als Skalierungsinstrument (Ghazawneh und Henfridsson 2013, Mautsch 2015).</p>

Der Plattformanbieter entwickelt und stellt Boundary Resources bereit, Komplementoren nutzen sie, um eigene Komplemente zu bauen. Der Anbieter wechselt dabei zwischen Absicherung (Kontrolle behalten) und Schaffung (Beiträge Dritter ermöglichen). Technische Boundary Resources sind modulare Architekturen, APIs, SDKs, Cloud-Infrastruktur und Transaktionssupport wie Metering und Billing. Soziale Boundary Resources sind Dokumentation und FAQs, Hackathons, Partnerprogramme und Roadmaps.

### Entwicklerportale und öffentliche Roadmaps

![[pictures/mitun/06/Lecture06_Pg017_Entwicklerportale_Und_Ffentliche_Roadmaps.png]]

<p class="image-caption">Entwicklerportale von Mercedes-Benz und Amazon Alexa.</p>

![[pictures/mitun/06/Lecture06_Pg018_Entwicklerportale_Und_Ffentliche_Roadmaps.png]]

<p class="image-caption">Entwicklerportal von OpenAI (2025).</p>

![[pictures/mitun/06/Lecture06_Pg019_Entwicklerportale_Und_Ffentliche_Roadmaps.png]]

<p class="image-caption">Öffentliche Roadmap von GitHub (2023).</p>

Beispiele für Boundary Resources: Das Mercedes-Benz-Entwicklerportal bietet APIs etwa zum Fahrzeugstatus mit Sandbox, "Bring your own car" und Business-Zugang. Das Alexa-Portal führt mit Quick-Start-Tutorials, Dokumentation und Code-Beispielen zum ersten Skill. Die OpenAI-Plattform hat einen Developer Quickstart, Modellübersichten und Anleitungen für Text, Bilder, Audio und Agenten. GitHub veröffentlicht seine Roadmap nach Quartalen gegliedert als öffentliches Board.

## 5. Prozess

### Build, Measure, Learn im Großen

![[pictures/mitun/06/Lecture06_Pg021_Build_Measure_Learn_Im_Gro_En.png]]

<p class="image-caption">Design Thinking, Lean UX, Agile und Growth Hacking sowie Design und Delivery (Longleafcollective 2020, Forsgren u. a. 2018).</p>

Der Weg vom Pain Point zum Wachstum verbindet Design Thinking (Empathie, Definition, Ideenfindung), Lean UX (Hypothese, Experiment, Prototyp), Agile (Testen, Feedback, Iteration bis zum Product-Market-Fit) und Growth Hacking (Zielkunden, Wachstumskanäle, Pirate Metrics). Forsgren u. a. (2018) trennen dabei zwei Arten von Arbeit:

| Produktdesign und -entwicklung                                                                 | Produktauslieferung (Build, Test, Deployment)                                                         |
| :--------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| Neue Produkte und Services, die Kundenprobleme hypothesengetrieben lösen (UX, Design Thinking) | Schneller Fluss von der Entwicklung in die Produktion durch standardisierte Arbeit und kleine Batches |
| Feature-Design und -Umsetzung kann völlig neue Arbeit erfordern                                | Integration, Test und Deployment laufen kontinuierlich und möglichst schnell                          |
| Schätzungen sind sehr unsicher                                                                 | Zykluszeiten sollten bekannt und vorhersehbar sein                                                    |
| Ergebnisse schwanken stark                                                                     | Ergebnisse sollten wenig schwanken                                                                    |

### Metriken für Software Delivery Performance

![[pictures/mitun/06/Lecture06_Pg022_Metriken_F_R_Software_Delivery_Performance.png]]

<p class="image-caption">Software Delivery Performance nach Leistungsgruppen (Forsgren u. a. 2018).</p>

Forsgren u. a. (2018) messen Software Delivery Performance mit vier Metriken: Lead Time, Deployment Frequency, Mean Time to Restore (MTTR) und Change Fail Percentage. Für 2017:

| Metrik                | High Performer               | Medium Performer                   | Low Performer                      |
| :-------------------- | :--------------------------- | :--------------------------------- | :--------------------------------- |
| Deployment Frequency  | bei Bedarf, mehrmals täglich | zwischen wöchentlich und monatlich | zwischen wöchentlich und monatlich |
| Lead Time for Changes | unter einer Stunde           | eine Woche bis ein Monat           | eine Woche bis ein Monat           |
| MTTR                  | unter einer Stunde           | unter einem Tag                    | ein Tag bis eine Woche             |
| Change Failure Rate   | 0 bis 15%                    | 0 bis 15%                          | 31 bis 45%                         |

Low Performer lagen bei Deployment Frequency und Lead Time im Mittel signifikant schlechter, hatten aber denselben Median wie die Medium Performer.

### Lean Product Management und transformationale Führung

![[pictures/mitun/06/Lecture06_Pg023_Lean_Product_Management_Und_Transformationale_F.png]]

<p class="image-caption">Lean Product Management, Software Delivery Performance und Organizational Performance (Forsgren u. a. 2018).</p>

Lean Product Management bedeutet, in kleinen Batches zu arbeiten, den Arbeitsfluss sichtbar zu machen, Kundenfeedback einzuholen und umzusetzen und Teams experimentieren zu lassen. Es wirkt auf die Software Delivery Performance und umgekehrt, und beide verbessern die Organizational Performance. Außerdem wirkt es auf die Organisationskultur nach Westrum und senkt Burnout.

![[pictures/mitun/06/Lecture06_Pg024_Lean_Product_Management_Und_Transformationale_F.png]]

<p class="image-caption">Transformational Leadership und ihre Wirkung auf technische und Lean-Praktiken (Forsgren u. a. 2018).</p>

Transformationale Führung (Vision, inspirierende Kommunikation, intellektuelle Anregung, unterstützende Führung, persönliche Anerkennung, vgl. [[/notes/lectures/mitun/04-team-und-fuehrung|Kapitel 4]]) treibt die technischen Praktiken: Testautomatisierung, Deployment-Automatisierung, Trunk-Based Development, Shift Left of Security, lose gekoppelte Architektur, befähigte Teams und Continuous Integration. Sie treibt auch die Lean-Praktiken Teamexperimente, kleine Batches und Kundenfeedback.

### Mehr Entwickler, mehr Leistung?

![[pictures/mitun/06/Lecture06_Pg025_Mehr_Entwickler_Mehr_Leistung.png]]

<p class="image-caption">Deployment-Frequenz in Abhängigkeit von der Zahl der Entwickler (Forsgren u. a. 2018).</p>

Mehr Entwickler bedeuten nicht automatisch höhere Software Delivery Performance. Bei High Performern steigt die Deployment-Frequenz mit der Zahl der Entwickler stark an, bei Medium Performern bleibt sie flach, bei Low Performern sinkt sie. Ob Wachstum hilft, hängt von Architektur und Prozesseffizienz ab.

### DORA-Metriken in der Praxis

![[pictures/mitun/06/Lecture06_Pg026_Dora_Metriken_In_Der_Praxis.png]]

<p class="image-caption">Verbreitung der DORA-Metriken (LeanIX 2022).</p>

Nach LeanIX (2022) erfassen Teams im Schnitt 2,0 der vier DORA-Metriken. Von den Teams, die mindestens eine erfassen, messen 77% die Deployment Frequency, 73% die Failure Rate, 63% die Lead Time for Changes und 55% die Mean Time to Recovery.

### DevOps Delivery Pipeline

![[pictures/mitun/06/Lecture06_Pg028_Devops_Delivery_Pipeline.png]]

<p class="image-caption">Continuous Integration und Continuous Delivery in der Delivery Pipeline (Halstenberg u. a. 2020).</p>

DevOps ist der Ansatz, mit dem sich die Software Delivery Performance verbessern lässt (Definition und Grundlagen in [[/notes/lectures/mitun/03b-devops|Kapitel 3.3]]). Bei Continuous Integration integrieren Teammitglieder ihre Arbeit häufig, meist mindestens täglich. Jede Integration prüft ein automatischer Build mit Tests, damit Integrationsfehler schnell auffallen (Fowler 2006). Continuous Delivery ist die Fähigkeit, Änderungen jeder Art, also Features, Konfiguration, Bugfixes und Experimente, sicher, schnell und nachhaltig in Produktion oder zu den Nutzern zu bringen (Humble 2017). Entlang der Kette plan bis operate decken agile Entwicklung, CI, Continuous Delivery, Continuous Deployment und DevOps jeweils größere Abschnitte ab.

### DevOps Evolution Model

![[pictures/mitun/06/Lecture06_Pg029_Devops_Evolution_Model.png]]

<p class="image-caption">Vom Release nach Finalisierungssprints zum Release on Demand (SAFe 2020b).</p>

Das DevOps Evolution Model von SAFe zeigt vier Reifestufen. In Modell 1 folgen auf die Sprints eigene Finalisierungssprints für "undone work", erst danach kommt das Release. In Modell 2 wandert ein Teil dieser Arbeit in die Definition of Done, die Finalisierung schrumpft. In Modell 3 endet jeder Sprint mit einem Release, in Modell 4 wird mehrmals pro Sprint bei Bedarf released. Lead Time und Feedbackzyklen werden mit jeder Stufe kürzer. Typische "undone work" sind Sicherheitsprüfungen und Audits, manuelle Tests, das Aufsetzen von Testumgebungen, Deployment-Dokumentation, Internationalisierung und zugehörige Tests, Lizenzprüfungen von Open Source und Compliance-Checks.

### Golden Paths und Maturity Models

![[pictures/mitun/06/Lecture06_Pg030_Golden_Paths_Und_Maturity_Models.png]]

<p class="image-caption">Golden Paths bei Spotify und das STACKIT Maturity Model.</p>

Golden Paths sind ausgetretene Pfade, die etwa Prozesse, Tools oder Technologien für bestimmte Anwendungsfälle bereitstellen, idealerweise als Self-Service. Spotify nutzt sie, um die Fragmentierung seines Software-Ökosystems zu verringern (Spotify 2020). Das STACKIT Maturity Model (2024) beschreibt Reifestufen mit Kriterien je Stufe. Solche Produkt- und Prozessstandards machen Skalierung wiederholbar.

## 6. Organisation

### Agile Prinzipien und Skalierung

![[pictures/mitun/06/Lecture06_Pg032_Agile_Prinzipien_Und_Skalierung.png]]

<p class="image-caption">Die zwölf Prinzipien des Agilen Manifests und Skalierungseffekte (Beck u. a. 2001).</p>

Die zwölf Prinzipien des Agilen Manifests stellen unter anderem frühe und kontinuierliche Auslieferung, offene Haltung gegenüber Änderungen, tägliche Zusammenarbeit von Fachseite und Entwicklung, motivierte Einzelne, persönliche Kommunikation, funktionierende Software als Fortschrittsmaß, nachhaltiges Tempo, Einfachheit, selbstorganisierte Teams und regelmäßige Reflexion in den Vordergrund (Beck u. a. 2001). Skalierung setzt sie unter Druck: Mit mehr Kunden, Anforderungen, Märkten, Teammitgliedern, verteilten Stakeholdern und höherer Produktkomplexität wird es schwerer, sie einzuhalten.

### Komplexitätsprobleme beim Skalieren agiler Setups

![[pictures/mitun/06/Lecture06_Pg033_Komplexit_Tsprobleme_Beim_Skalieren_Agiler_Setups.png]]

<p class="image-caption">Brooks's Law, Conway's Law und die Pizza-Regel (Lighthouse 2020, Conway 1968).</p>

Nach Brooks's Law wächst die Zahl der Beziehungen in einem Team mit $n(n-1)/2$, bei 10 Personen sind es schon 45. Jeff Bezos' Pizza-Regel lautet, nie mehr Leute zu einem Meeting einzuladen, als von zwei Pizzen satt werden. Conway's Law besagt, dass die Struktur eines Systems die Kommunikationsstruktur der Organisation kopiert, die es entwirft. Praktisch heißt das: Teams von etwa 5 bis 8 Personen und skalierbare agile Ansätze.

### Spotify-Modell

![[pictures/mitun/06/Lecture06_Pg034_Spotify_Modell.png]]

<p class="image-caption">Rollen und Einheiten im Spotify-Modell (Bäcklander 2019, Schmiedinger 2020).</p>

| Einheit oder Rolle | Aufgabe                                                                                                                                                                     |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Squad              | Basis des Modells und für die Wertschöpfung zuständig, selbstorganisiert und interdisziplinär wie ein Mini-Startup, mit langfristiger Mission (vgl. Scrum-Entwicklungsteam) |
| Product Owner      | Alle POs eines Tribes arbeiten an einer gemeinsamen Roadmap, aus der die priorisierten Backlogs der Squads folgen                                                           |
| Agile Coach        | Beseitigt Hindernisse, unterstützt kontinuierliche Verbesserung, organisiert Retrospektive und Sprint Planning (vgl. Scrum Master)                                          |
| Tribe              | Gruppe von Squads am selben oder an verwandten Produkten, höchstens 100 Personen, ein Tribe Lead sorgt für die Arbeitsumgebung                                              |
| Chapter            | Mitglieder mit gleichen Kompetenzen über Squads hinweg (z. B. UI-Entwicklung, Datenbanken), ein Chapter Lead entwickelt die Kompetenzen weiter                              |
| Guild              | Offene Interessengruppe über die ganze Organisation (z. B. Agile, C++, WebDev), ein Koordinator organisiert Treffen                                                         |

### Large Scale Scrum (LeSS)

![[pictures/mitun/06/Lecture06_Pg035_Large_Scale_Scrum_Less.png]]

<p class="image-caption">Das LeSS-Framework (LeSS 2020).</p>

LeSS überträgt Scrum auf mehrere Feature-Teams, die an einem gemeinsamen Produkt mit einem Product Owner und einem Product Backlog arbeiten. Es gibt ein gemeinsames Sprint Planning in zwei Teilen, Product Backlog Refinement, Koordination zwischen den Teams, einen gemeinsamen Sprint Review und eine übergreifende Retrospektive. Am Ende jedes Sprints steht ein potenziell auslieferbares Produktinkrement. Grundlagen sind Lean Thinking, Systemdenken, technische Exzellenz und Continuous Integration.

### Scaled Agile Framework (SAFe)

![[pictures/mitun/06/Lecture06_Pg036_Scaled_Agile_Framework_Safe.png]]

<p class="image-caption">SAFe 6.0 (SAFe 2024).</p>

SAFe organisiert agile Arbeit auf mehreren Ebenen. Auf Portfolioebene stehen Lean Portfolio Management, Portfoliostrategie und Portfolio Backlog mit Epics, die in Value Streams umgesetzt werden. Darunter arbeiten Agile Release Trains (ART) mit Product Management, System Architect und Release Train Engineer. Die agilen Teams liefern in Iterationen über eine Continuous Delivery Pipeline, synchronisiert durch PI Planning, System Demos und Inspect and Adapt, und releasen bei Bedarf. Fundament sind Lean-Agile Leadership sowie Mindset, Werte und Prinzipien.

![[pictures/mitun/06/Lecture06_Pg037_Scaled_Agile_Framework_Safe.png]]

<p class="image-caption">Die zehn SAFe-Prinzipien (SAFe 2020).</p>

Die zehn Prinzipien: wirtschaftliche Sicht einnehmen, Systemdenken anwenden, Variabilität annehmen und Optionen offenhalten, inkrementell mit schnellen, integrierten Lernzyklen bauen, Meilensteine an der objektiven Bewertung funktionierender Systeme festmachen, Work in Progress sichtbar machen und begrenzen, Batchgrößen und Warteschlangen reduzieren, Kadenz und bereichsübergreifende Planung, die intrinsische Motivation von Wissensarbeitern freisetzen, Entscheidungen dezentralisieren und um Wertschöpfung herum organisieren.

### Taxonomie skaliert-agiler Rahmenwerke

![[pictures/mitun/06/Lecture06_Pg038_Taxonomie_Skaliert_Agiler_Rahmenwerke.png]]

<p class="image-caption">Taxonomie skaliert-agiler Rahmenwerke (nach Turhan u. a. 2024).</p>

Turhan u. a. (2024) ordnen skaliert-agile Rahmenwerke über sechs Dimensionen ein:

| Dimension                    | Merkmale                                                                      |
| :--------------------------- | :---------------------------------------------------------------------------- |
| Verbreitung                  | Marktakzeptanz                                                                |
| Anwendbarkeit                | Organisationsgröße, maximale Personenanzahl                                   |
| Implementierung              | geografische Verteilung, Konfigurationen (team- bis unternehmensübergreifend) |
| Komponenten                  | angewandte Methoden, Prinzipien, Rollen, Praktiken, Artefakte                 |
| Prozesse                     | Komplexität, Flexibilität, Transparenz                                        |
| Kontinuierliche Verbesserung | Training, unterstützende Werkzeuge, Metriken, unterstützende Praktiken        |

![[pictures/mitun/06/Lecture06_Pg039_Taxonomie_Skaliert_Agiler_Rahmenwerke.png]]

<p class="image-caption">Anwendung der Taxonomie auf SAFe.</p>

![[pictures/mitun/06/Lecture06_Pg040_Taxonomie_Skaliert_Agiler_Rahmenwerke.png]]

<p class="image-caption">Anwendung der Taxonomie auf LeSS.</p>

SAFe hat eine hohe Marktakzeptanz, richtet sich an große Organisationen ohne Begrenzung der Personenzahl, funktioniert lokal bis global und in allen Konfigurationen und kombiniert Scrum, Lean, Design Thinking, Kanban und XP. Seine Prozesse sind komplex und wenig flexibel bei mittlerer Transparenz, dafür bietet es Training bis zu Coaches, Werkzeuge und Metriken. Dieselbe Einordnung gibt es für LeSS.

### Skalierbare Organisation des Supports

![[pictures/mitun/06/Lecture06_Pg041_Skalierbare_Organisation_Des_Supports.png]]

<p class="image-caption">1st, 2nd und 3rd Level Support (Half 2020a, 2020b).</p>

| Stufe             | Aufgaben                                                                                                                                         |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1st Level Support | Nimmt alle Störfälle ohne Spezialisierung auf (User Help Desk), löst Standardfälle sofort oder leitet weiter, verfolgt und berichtet             |
| 2nd Level Support | Spezialisierte Fachkräfte für schwierigere Fälle, kurzfristige Behebung und nachhaltige Lösung, Weiterleitung, Identifikation von Problemfeldern |
| 3rd Level Support | Fachexperten außerhalb des Supports, oft der Hersteller (OEM) oder die Open-Source-Community, Programmierer und Systemadministratoren            |

## 7. Toolsupport

### Exemplarische DevOps-Toolchain

![[pictures/mitun/06/Lecture06_Pg043_Exemplarische_Devops_Toolchain.png]]

<p class="image-caption">Exemplarische DevOps-Toolchain (Medium 2020).</p>

Für jede Phase der DevOps-Schleife gibt es Werkzeuge, etwa Jira und Confluence für die Planung, Git für den Code, Maven und sbt für den Build, Selenium und JUnit für Tests, Jenkins und Codeship für das Release, Docker, AWS, Chef, Ansible und Kubernetes für Deployment und Betrieb und Nagios, Splunk und Datadog für das Monitoring. Welche Tools passen, hängt von der Situation ab.

### Planung und Design

![[pictures/mitun/06/Lecture06_Pg044_Planung_Und_Design.png]]

<p class="image-caption">Jira als Issue Tracker und für das Requirements Management (Atlassian 2020).</p>

Jira schafft Transparenz über Prozessschritte und Teams hinweg. Es erfasst Anforderungen und Issues (Ideen, Epics, User Stories), plant Sprints und Tasks, verfolgt sie nach, bietet Scrum- und Kanban-Boards, überwacht Aufwände und dient als Issue Tracker für Support-Systeme.

![[pictures/mitun/06/Lecture06_Pg045_Planung_Und_Design.png]]

<p class="image-caption">Design Systems mit Zeplin oder Figma.</p>

Design-Systeme wie Zeplin oder Figma "skalieren die Kreativität". Sie schaffen ein gemeinsames Design-Verständnis über Teams, Abteilungen und Standorte, fördern modulare und konsistente Designs, binden Jira, Storybook oder GitHub an, generieren Code-Gerüste und CSS und sparen Zeit, weil manuelle Abstimmung und Mehrdeutigkeiten wegfallen.

### Entwicklung und Versionsverwaltung

![[pictures/mitun/06/Lecture06_Pg046_Entwicklung_Und_Versionsverwaltung.png]]

<p class="image-caption">KI-gestützte Entwicklung mit GitHub Copilot.</p>

GitHub Copilot unterstützt Entwickler mit einem KI-Chat direkt im Editor.

![[pictures/mitun/06/Lecture06_Pg047_Entwicklung_Und_Versionsverwaltung.png]]

<p class="image-caption">Git, GitHub Flow und Trunk-Based Development (GitHub 2020, Hammant u. a. 2020).</p>

Git verwaltet Versionen über Trunks, Branches, Merges und Tags. Im GitHub Flow erstellt man einen Branch, öffnet einen Pull Request für Feedback und Review und merged und deployed danach. Beim skalierten Trunk-Based Development arbeitet das ganze Team auf einem gemeinsamen Trunk. Feature Branches leben höchstens ein paar Tage und gehören einer Person, Code Review und automatischer Build laufen per Pull Request vor dem Merge, und niemand committet direkt auf Release-Branches.

### Build, Test und Deploy

![[pictures/mitun/06/Lecture06_Pg048_Build_Test_Und_Deploy.png]]

<p class="image-caption">Jenkins, Black Duck und Cypress.</p>

![[pictures/mitun/06/Lecture06_Pg049_Build_Test_Und_Deploy.png]]

<p class="image-caption">End-to-End-Tests mit Cypress.</p>

Jenkins automatisiert CI/CD mit zahlreichen Plugins für die Pipeline. Black Duck analysiert die Software-Zusammensetzung, erkennt Open-Source-Komponenten, prüft Lizenzen und sucht Sicherheitslücken. Cypress ist ein Framework für automatisierte End-to-End-UI-Tests auf verschiedenen Endgeräten.

![[pictures/mitun/06/Lecture06_Pg050_Build_Test_Und_Deploy.png]]

<p class="image-caption">Container mit Docker, Kubernetes und Gardener.</p>

Container teilen sich das Host-Betriebssystem über eine Container Runtime, virtuelle Maschinen bringen jeweils ein eigenes Gastbetriebssystem über einen Hypervisor mit. Beide bieten eine konsistente Laufzeitumgebung und Sandboxing, Container zusätzlich geringen Speicherbedarf und wenig Verwaltungsaufwand (Google 2020). Docker baut, verteilt und startet Container, Kubernetes (K8s) automatisiert Deployment, Skalierung und Verwaltung containerisierter Anwendungen, Gardener verwaltet Kubernetes-Cluster.

![[pictures/mitun/06/Lecture06_Pg051_Build_Test_Und_Deploy.png]]

<p class="image-caption">Infrastructure as Code und das Spektrum der Werkzeuge (Nayak 2019).</p>

Infrastructure as Code verwaltet Infrastruktur (Netze, virtuelle Maschinen, Load Balancer, Topologie) als beschreibendes Modell mit derselben Versionierung wie der Quellcode. Die Werkzeuge decken unterschiedliche Teile ab: Packer das Templating, Terraform die Verwaltung der Infrastruktur, cloud-init einmalige Installation und Konfiguration, Chef, Puppet, Ansible und SaltStack das Ausrollen von Konfigurationen und Änderungen nach der Installation, Vagrant und CFEngine mehrere Bereiche.

### All-in-one-Plattformen und Chatbots

![[pictures/mitun/06/Lecture06_Pg053_All_In_One_Plattformen_Und_Chatbots.png]]

<p class="image-caption">GitLab und Azure DevOps als All-in-one-Plattformen.</p>

Der Trend geht zu All-in-one-DevOps-Plattformen wie GitLab oder Azure DevOps (Boards, Pipelines, Repos, Test Plans, Artifacts, Marketplace). Sie decken unterschiedlich viel ab und sollten für den konkreten Anwendungsfall evaluiert werden. Daneben gibt es Produktmanagement- und Roadmapping-Werkzeuge wie Productboard.

![[pictures/mitun/06/Lecture06_Pg054_All_In_One_Plattformen_Und_Chatbots.png]]

<p class="image-caption">Chatbots im Support und in der Teamkommunikation.</p>

Chatbots sollen den Supportprozess effizienter machen, etwa Kundenservice-Chats, die Bestellungen stornieren, Statusabfragen per Messenger, Bots in Slack-Kanälen oder Plattformen wie SAP Conversational AI. Die Folie stellt das als offene Frage.

![[pictures/mitun/06/Lecture06_Pg055_All_In_One_Plattformen_Und_Chatbots.png]]

<p class="image-caption">A fool with a tool is still a fool.</p>

Ohne passende Prinzipien, Prozesse und Kompetenzen skalieren Werkzeuge nichts.

## Zusammenfassung

- Skalierung ist Wachstum unter Ausnutzung von Skaleneffekten. Ein skalierbares Geschäftsmodell steigert die Erlöse schneller als die Kosten.
- Die Dimensionen sind Produkt, Prozess und Organisation (Fitzgerald u. a. 2017).
- Produkt: lose gekoppelte Architekturen (Microservices nur, wo sie passen, siehe Prime Video) und externe Innovation über Boundary Resources wie APIs, SDKs, Entwicklerportale und öffentliche Roadmaps.
- Prozess: Software Delivery Performance wird mit Lead Time, Deployment Frequency, MTTR und Change Fail Percentage gemessen. DevOps, CI/CD, transformationale Führung und Golden Paths verbessern sie, mehr Entwickler allein nicht.
- Organisation: Brooks's und Conway's Law begrenzen die Teamgröße. Spotify-Modell, LeSS und SAFe skalieren agile Arbeit, eine Taxonomie hilft beim Vergleich, gestufter Support fängt mehr Kunden auf.
- Tools unterstützen jede Phase der DevOps-Kette, ersetzen aber keine Prinzipien.

## Selbsttest

1. Grenzen Sie Wachstum, Skalierbarkeit und Skalierung voneinander ab.

> [!success]- Antwort
> Wachstum ist die Zunahme der Unternehmensgröße. Technische Skalierbarkeit ist die Fähigkeit eines Systems, mehr Last aufzunehmen, betriebswirtschaftliche die Fähigkeit eines Geschäftsmodells, die Erlöse schneller zu steigern als die Kosten. Skalierung ist Wachstum eines software-intensiven Geschäftsmodells unter Ausnutzung von Skaleneffekten (economies of scale and scope).

2. Welche Dimensionen der Skalierung gibt es, und welche Ansätze gehören dazu?

> [!success]- Antwort
> Produkt (Microservice-Architektur, externe Innovationsleistung über Plattformen und Boundary Resources), Prozess (DevOps, CI/CD, DORA-Metriken, Golden Paths) und Organisation (Spotify-Modell, LeSS, SAFe, gestufter Support), nach Fitzgerald u. a. (2017).

3. Was sind Boundary Resources? Nennen Sie Beispiele.

> [!success]- Antwort
> Ressourcen, die ein Plattformanbieter bereitstellt, damit Komplementoren eigene Komplemente entwickeln können. Der Anbieter wechselt zwischen Absicherung und Schaffung. Technische Boundary Resources sind APIs, SDKs, modulare Architekturen, Cloud-Infrastruktur und Billing, soziale sind Dokumentation, Hackathons, Partnerprogramme und Roadmaps. Beispiele sind die Entwicklerportale von Mercedes-Benz, Amazon Alexa und OpenAI und die öffentliche Roadmap von GitHub.

4. Mit welchen Metriken misst man Software Delivery Performance?

> [!success]- Antwort
> Lead Time for Changes, Deployment Frequency, Mean Time to Restore und Change Failure Rate. High Performer deployen bei Bedarf mehrmals täglich, haben Lead Time und MTTR unter einer Stunde und eine Fehlerrate von 0 bis 15% (Forsgren u. a. 2018).

5. Warum führen mehr Entwickler nicht automatisch zu mehr Leistung?

> [!success]- Antwort
> Die Zahl der Kommunikationsbeziehungen wächst mit $n(n-1)/2$ (Brooks's Law), und die Systemstruktur folgt der Kommunikationsstruktur (Conway's Law). Nur High Performer mit lose gekoppelter Architektur und effizienten Prozessen steigern ihre Deployment-Frequenz mit mehr Entwicklern, bei Low Performern sinkt sie.

6. Beschreiben Sie das DevOps Evolution Model.

> [!success]- Antwort
> Modell 1 sammelt "undone work" wie Sicherheitsprüfungen, manuelle Tests und Compliance in Finalisierungssprints vor dem Release. Modell 2 verlagert einen Teil davon in die Definition of Done. Modell 3 released am Ende jedes Sprints, Modell 4 mehrmals pro Sprint bei Bedarf. Mit jeder Stufe sinken Lead Time und Feedbackzyklus.

7. Erklären Sie Squads, Tribes, Chapters und Guilds im Spotify-Modell.

> [!success]- Antwort
> Squads sind selbstorganisierte, interdisziplinäre Teams wie Mini-Startups. Tribes bündeln Squads an verwandten Produkten bis etwa 100 Personen. Chapters verbinden Personen gleicher Kompetenz über Squads hinweg, Guilds sind offene Interessengruppen über die ganze Organisation.

8. Wie unterscheiden sich LeSS und SAFe?

> [!success]- Antwort
> LeSS skaliert Scrum schlank: mehrere Feature-Teams mit einem Product Owner, einem Backlog und gemeinsamen Events. SAFe ist umfassender, mit Portfolio-Ebene, Agile Release Trains, PI Planning und eigenen Rollen wie dem Release Train Engineer. Es hat hohe Marktakzeptanz und eignet sich für sehr große Organisationen, ist aber komplex und wenig flexibel.

---

[[/notes/lectures/mitun/index|Zurück zum MITUN-Index]] | [[/notes/lectures/mitun/05-business-plan-und-funding|Zurück: (y-05) Business Plan und Funding]] | [[/notes/lectures/mitun/07-vermarktung|Weiter: (y-07) Vermarktung]]
