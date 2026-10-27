---
title: "L03 - Geschäftsmodell"
tags:
  - mitun
  - geschaeftsmodell
  - business-model-canvas
  - wertschoepfungskette
  - xaas
date: 2026-10-27
---

[[/notes/lectures/mitun/index|Zurück zum MITUN-Index]] | [[/notes/lectures/mitun/02-vorgruendung|Zurück: (y-02) Vorgründung]] | [[/notes/lectures/mitun/04-team-und-fuehrung|Weiter: (y-04) Team und Führung]]

> [!note] Foliengrundlage
> Diese Notiz basiert auf dem Foliensatz aus dem Wintersemester 2025/26. Sobald die Folien für 2026/27 vorliegen, wird sie daran angepasst.

## Mentales Modell

- Ein Geschäftsmodell beschreibt vereinfacht, wie ein Unternehmen Wert schafft und verdient. Nach Stähler (2001) hat es drei Teile: das Nutzenversprechen (was wird angeboten?), die Wertschöpfungsarchitektur (wie entsteht der Nutzen, mit welchen Partnern?) und das Ertragsmodell (womit wird Geld verdient?).
- Das Geschäftsmodell liegt zwischen Strategie und Geschäftsprozessen: Die Strategie legt Unternehmens-, Geschäftsfeld- und Wettbewerbsstrategie fest, das Geschäftsmodell den Wertmechanismus, die Prozesse setzen ihn mit Budgets und Strukturen um.
- Herzwurm und Pietsch (2009) unterscheiden vier generische Geschäftsmodelle für IT-Produkte: IT-Standardprodukte, IT-Produkt plus Service, IT-Projekte und IT-Systemservices, jedes mit eigener Wertschöpfungskette. Mit Everything-as-a-Service verschiebt sich der Markt von Einmal- zu wiederkehrenden Erlösen.
- Der Business Model Canvas (Osterwalder und Pigneur 2010) beschreibt ein Geschäftsmodell in neun Bausteinen auf einer Seite. Er ist praxisnah und einheitlich, ignoriert aber Wettbewerb und Umfeld und zeigt nur einen Zeitpunkt.

## 1. Inhalt und Lernziele

![[pictures/mitun/03/Lecture03_Pg003_Inhalt_Und_Lernziele.png]]

<p class="image-caption">Inhalt der Vorlesung.</p>

![[pictures/mitun/03/Lecture03_Pg004_Inhalt_Und_Lernziele.png]]

<p class="image-caption">Lernziele der Einheit.</p>

Das Kapitel behandelt Allgemeines zum Geschäftsmodell, generische Geschäftsmodelle für IT-Produkte, den Business Model Canvas und DevOps im Kontext software-intensiver Geschäftsmodelle. Ziel ist, die Bestandteile eines Geschäftsmodells zu erläutern und bestehende Modelle zu analysieren, generische Geschäftsmodelle für IT-Produkte und ihre Wertschöpfungsketten abzugrenzen, den Business Model Canvas zu erläutern und Ziele und Prinzipien von DevOps und seine Bedeutung für die Wertschöpfung zu diskutieren.

## 2. Was ist ein Geschäftsmodell?

![[pictures/mitun/03/Lecture03_Pg006_Was_Ist_Ein_Gesch_Ftsmodell.png]]

<p class="image-caption">Geschäftsmodell nach Wirtz.</p>

Nach Wirtz (2020) bildet ein Geschäftsmodell in stark vereinfachter Form ab, welche Ressourcen in die Unternehmung fließen und wie sie im Leistungserstellungsprozess in vermarktungsfähige Informationen, Produkte und Dienstleistungen transformiert werden. Es sagt, durch welche Kombination von Produktionsfaktoren die Geschäftsstrategie umgesetzt werden soll und welche Rolle die beteiligten Akteure spielen.

### Geschäftsmodell nach Stähler (2001)

![[pictures/mitun/03/Lecture03_Pg007_Gesch_Ftsmodell_Nach_St_Hler_2001.png]]

<p class="image-caption">Nutzenversprechen, Wertschöpfungsarchitektur und Ertragsmodell.</p>

Ein Geschäftsmodell ist eine "vereinfachte, allgemeine Beschreibung der Art und Weise, wie eine Geschäftstätigkeit funktioniert oder funktionieren kann". Es hat drei Teile:

| Teil                      | Frage                                   | Beschreibung und Beispiel                                                                                      |
| :------------------------ | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| Nutzenversprechen         | Was soll angeboten werden?              | Welcher Nutzen Kunden oder Partnern geboten wird (Value Proposition), etwa Feature, Benefit, Value             |
| Wertschöpfungsarchitektur | Wie soll Wertschöpfung erreicht werden? | Wie der Nutzen entsteht, Aufbau der Wertkette, Leistungserstellung, etwa: mit welchen Partnern welche Leistung |
| Ertragsmodell             | Womit wird das Geld verdient?           | Erlös- und Kostenmodell, etwa Lizenzen, Wartung und Service, Dienstleistungen, Cloud-Subscriptions             |

### Strategie, Geschäftsmodell und Prozesse

![[pictures/mitun/03/Lecture03_Pg008_Strategie_Gesch_Ftsmodell_Und_Prozesse.png]]

<p class="image-caption">Strategie, Geschäftsmodell und Geschäftsprozesse in der Unternehmensarchitektur (Pelzl 2016).</p>

Pelzl (2016) ordnet drei Ebenen der Unternehmensarchitektur: Auf der strategischen Ebene (Planung) werden Unternehmens-, Geschäftsfeld- und Wettbewerbsstrategie entwickelt. Auf der taktischen Ebene (Vermittlung) liegt das Geschäftsmodell, das den Wertmechanismus entwickelt. Auf der operativen Ebene (Implementierung) setzen Geschäftsprozesse mit Budgets und Arbeitsstrukturen das Modell um. Informationssysteme unterstützen alle drei Ebenen.

### Geschäftsmodellebenen

![[pictures/mitun/03/Lecture03_Pg009_Gesch_Ftsmodellebenen.png]]

<p class="image-caption">Geschäftsmodellebenen von der Industrie bis zum Produkt (Pelzl 2016).</p>

Geschäftsmodelle gibt es auf vier Ebenen, von generisch bis spezifisch (Pelzl 2016): Industrieebene (Geschäftsmodelltypen einer Industrie, etwa der Automobilindustrie), Unternehmensebene (wie ein Unternehmen agiert, etwa Coca-Cola oder Dell), Geschäftseinheitsebene (für eine Geschäftseinheit) und Produkt- und Serviceebene (für ein Produkt oder einen Service, etwa bei Amazon).

## 3. Generische Geschäftsmodelle für IT-Produkte

![[pictures/mitun/03/Lecture03_Pg011_Generische_Gesch_Ftsmodelle_F_R_It.png]]

<p class="image-caption">Die generischen Geschäftsmodelle für IT-Produkte (Herzwurm und Pietsch 2009).</p>

Herzwurm und Pietsch (2009) unterscheiden vier idealtypische Geschäftsmodelle:

1. IT-Standardprodukte, unterteilt in Vermarktung und Pflege sowie Forschung und Entwicklung,
2. IT-Produkt plus Service,
3. IT-Projekte, unterteilt in Projektdurchführung und Projektbegründung,
4. IT-Systemservices.

Jedes hat eine eigene Wertschöpfungskette aus unterstützenden (sekundären) und primären Aktivitäten, die zusammen die Gewinnspanne erzeugen.

### IT-Standardprodukte

![[pictures/mitun/03/Lecture03_Pg012_It_Standardprodukte.png]]

<p class="image-caption">IT-Standardprodukte: Microsoft, Symantec, Apple.</p>

![[pictures/mitun/03/Lecture03_Pg013_It_Standardprodukte.png]]

<p class="image-caption">Wertschöpfungskette der Standardproduktvermarktung und -pflege.</p>

![[pictures/mitun/03/Lecture03_Pg014_It_Standardprodukte.png]]

<p class="image-caption">Wertschöpfungskette der Standardproduktentwicklung.</p>

Unternehmen wie Microsoft, Symantec und Apple entwickeln oder vermarkten standardisierte Softwareprodukte für den Massenmarkt. Anpassungen machen ausschließlich die Anwender in Eigenverantwortung.

| Wertschöpfungskette       | Unterstützende Aktivitäten                                                                             | Primäre Aktivitäten                                                                 |
| :------------------------ | :----------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| Vermarktung und Pflege    | Marketing, Änderungsmanagement, Systeminfrastruktur und Ressourcenmanagement, Konfigurationsmanagement | Qualitätssicherung, Releasemanagement, Presales und Vertrieb, Auslieferung, Wartung |
| Forschung und Entwicklung | Dokumentation, Risikomanagement, Technologieplanung, Projektmanagement                                 | Fachkonzept, technische Architektur, Detailentwurf, Implementierung, Test           |

### IT-Produkt plus Service

![[pictures/mitun/03/Lecture03_Pg015_It_Produkt_Plus_Service.png]]

<p class="image-caption">IT-Produkt plus Service: SAP, KUMAvision, DATEV.</p>

![[pictures/mitun/03/Lecture03_Pg016_It_Produkt_Plus_Service.png]]

<p class="image-caption">Wertschöpfungskette für IT-Produkt plus Service.</p>

Bei SAP, KUMAvision oder DATEV würde das Produkt ohne ergänzende Services wie kleinere Anpassungen und Schulungen nicht am Massenmarkt bestehen. Unterstützende Aktivitäten sind Marketing, Änderungsmanagement, Systeminfrastruktur und Ressourcenmanagement sowie Prozessmanagement. Primäre Aktivitäten sind Problemanalyse, Qualitätssicherung und Vorkonfiguration, Customizing, Installation und Support.

### IT-Projekte

![[pictures/mitun/03/Lecture03_Pg017_It_Projekte.png]]

<p class="image-caption">IT-Projekte: Accenture, INFORM, adesso.</p>

![[pictures/mitun/03/Lecture03_Pg018_It_Projekte.png]]

<p class="image-caption">Wertschöpfungskette der IT-Projektbegründung.</p>

![[pictures/mitun/03/Lecture03_Pg019_It_Projekte.png]]

<p class="image-caption">Wertschöpfungskette der IT-Projektdurchführung.</p>

Bei Accenture, INFORM oder adesso steht die Dienstleistung im Vordergrund: Das Projekt bestimmt das Produkt, Software wird kundenindividuell entwickelt und gepflegt.

| Wertschöpfungskette | Unterstützende Aktivitäten                                                                             | Primäre Aktivitäten                                                                                                     |
| :------------------ | :----------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| Projektbegründung   | Marketing, Geschäftsentwicklung, Technologieplanung, Personalentwicklung                               | Accountpflege und Recruitment, Presales und Qualifikation, Vorstudie, Verhandlung und Vereinbarung, Auftragscontrolling |
| Projektdurchführung | Risikomanagement, Änderungsmanagement, Systeminfrastruktur und Ressourcenmanagement, Prozessmanagement | Qualitätssicherung, Projektinitiierung, Projektsteuerung, Projektabschluss, Erfahrungssicherung                         |

### IT-Systemservices

![[pictures/mitun/03/Lecture03_Pg020_It_Systemservices.png]]

<p class="image-caption">IT-Systemservices: Salesforce, Office 365, Dropbox, STACKIT und weitere.</p>

![[pictures/mitun/03/Lecture03_Pg021_It_Systemservices.png]]

<p class="image-caption">Wertschöpfungskette der IT-Systemservices.</p>

Bei myfactory, Salesforce, Office 365, Google Apps for Business, SAP SuccessFactors, Dropbox oder STACKIT gewinnt der Betrieb an Bedeutung. Das Modell wird im IT-Outsourcing zunehmend relevant und umfasst neben klassischen Rechenzentren auch Cloud- und ASP-Anbieter. Unterstützende Aktivitäten sind Marketing, Geschäftsentwicklung, Infrastrukturplanung und Service Controlling. Primäre Aktivitäten sind Third Party Services, Service Design, Service-Betrieb, Vertrieb und Support.

### Die Wertschöpfungsketten im Überblick

![[pictures/mitun/03/Lecture03_Pg022_Die_Wertsch_Pfungsketten_Im_Berblick.png]]

<p class="image-caption">Die sechs Wertschöpfungsketten nebeneinander.</p>

Nebeneinander gestellt zeigen die sechs Ketten, wie sich der Schwerpunkt verschiebt: von Entwicklung und Release beim Standardprodukt über Customizing und Installation beim Produkt plus Service und Vorstudie, Projektsteuerung und Erfahrungssicherung bei Projekten bis zu Service Design und Betrieb bei Systemservices.

### Everything-as-a-Service

![[pictures/mitun/03/Lecture03_Pg023_Everything_As_A_Service.png]]

<p class="image-caption">Die Evolution zu XaaS: von Einmalerlösen zu wiederkehrenden Erlösen (SAP 2023).</p>

SAP (2023) beschreibt die Evolution zu XaaS in vier Stufen: einzelne Produkte und Services, Bündel konfigurierbarer Produkte, Übergang zu Subscriptions und schließlich Servitization mit XaaS, bei der Produkte, Services, Ausrüstung, Betrieb und Wartung als Abonnement angeboten werden. Die generischen Modelle wandern dabei von Einmalerlösen (Standardprodukte, Projekte) über das Produkt plus Service zu wiederkehrenden Erlösen (Systemservices).

## 4. Business Model Canvas

![[pictures/mitun/03/Lecture03_Pg025_Business_Model_Canvas.png]]

<p class="image-caption">Die neun Bausteine des Business Model Canvas.</p>

Der Business Model Canvas nach Osterwalder und Pigneur (2010) hat neun Bausteine: Schlüsselpartner, Schlüsselaktivitäten, Schlüsselressourcen, Wertangebot, Kundenbeziehungen, Kanäle, Kundensegmente, Kostenstruktur und Einnahmequellen.

### 1. Kundensegmente

![[pictures/mitun/03/Lecture03_Pg026_Kundensegmente.png]]

<p class="image-caption">Kundensegmente.</p>

"Definiert die verschiedenen Gruppen von Personen oder Organisationen, die ein Unternehmen erreichen und bedienen will." Kundengruppen sind verschiedene Segmente, wenn ihre Bedürfnisse ein eigenes Angebot erfordern, sie über verschiedene Kanäle erreicht werden, verschiedene Beziehungen brauchen, verschieden rentabel sind oder für verschiedene Aspekte zahlen.

### 2. Wertangebot

![[pictures/mitun/03/Lecture03_Pg027_Wertangebot.png]]

<p class="image-caption">Wertangebot.</p>

"Beschreibt das Paket von Produkten und Dienstleistungen, das für ein bestimmtes Kundensegment Wert schöpft." Es ist der Grund, warum Kunden sich für ein Unternehmen entscheiden, und löst ein Problem oder erfüllt ein Bedürfnis eines Segments.

### 3. Kundenbeziehungen

![[pictures/mitun/03/Lecture03_Pg028_Kundenbeziehungen.png]]

<p class="image-caption">Kundenbeziehungen.</p>

Sie reichen von persönlich bis automatisiert und dienen Kundengewinnung, Kundenbindung und Upselling. Kategorien sind persönliche Assistenz, dedizierte persönliche Assistenz, Selbstbedienung, automatisierte Dienstleistungen, Communities und Co-Creation.

### 4. Einnahmequellen

![[pictures/mitun/03/Lecture03_Pg029_Einnahmequellen.png]]

<p class="image-caption">Einnahmequellen.</p>

"Steht für die Einkünfte, die ein Unternehmen aus jedem Kundensegment bezieht." Arten sind Verkauf von Vermögenswerten, Nutzungsgebühren, Abonnements, Verleih, Vermietung oder Leasing und Lizenzierung.

### 5. Schlüsselressourcen

![[pictures/mitun/03/Lecture03_Pg030_Schl_Sselressourcen.png]]

<p class="image-caption">Schlüsselressourcen.</p>

Die wichtigsten Wirtschaftsgüter, damit das Geschäftsmodell funktioniert: Sie ermöglichen Wertangebot, Marktbearbeitung, Kundenbeziehungen und Einkünfte. Sie sind physisch, finanziell, intellektuell oder menschlich und können im Besitz der Firma, geleast oder von Partnern bezogen sein.

### 6. Schlüsselaktivitäten

![[pictures/mitun/03/Lecture03_Pg031_Schl_Sselaktivit_Ten.png]]

<p class="image-caption">Schlüsselaktivitäten.</p>

Die wichtigsten Dinge, die ein Unternehmen tun muss, damit sein Geschäftsmodell funktioniert, um ein Wertangebot zu schaffen, Märkte zu erreichen, Kundenbeziehungen zu pflegen und Gewinne zu erzielen.

### 7. Schlüsselpartner

![[pictures/mitun/03/Lecture03_Pg032_Schl_Sselpartner.png]]

<p class="image-caption">Schlüsselpartner.</p>

Das Netzwerk von Lieferanten und Partnern, die zum Gelingen beitragen. Allianzen optimieren das Geschäftsmodell, mindern Risiken oder beschaffen Ressourcen. Es gibt vier Arten: strategische Allianzen zwischen Nicht-Wettbewerbern, Coopetition zwischen Wettbewerbern, Joint Ventures für neue Unternehmen und Käufer-Lieferanten-Beziehungen für zuverlässige Lieferungen.

### 8. Kostenstruktur

![[pictures/mitun/03/Lecture03_Pg033_Kostenstruktur.png]]

<p class="image-caption">Kostenstruktur.</p>

Alle Kosten, die bei der Ausführung des Geschäftsmodells anfallen. Kosten sollten immer minimiert werden, aber für manche Modelle ist das wichtiger als für andere, daher die Unterscheidung zwischen kostenorientierten und wertorientierten Strukturen. Merkmale sind Fixkosten, variable Kosten, Mengen- und Verbundvorteile.

### 9. Kanäle

![[pictures/mitun/03/Lecture03_Pg034_Kan_Le.png]]

<p class="image-caption">Kanaltypen und Kanalphasen.</p>

Wie ein Unternehmen seine Segmente erreicht, um das Wertangebot zu vermitteln. Kanäle sind eigene direkte (Verkaufsabteilung, Internetverkauf), eigene indirekte (eigene Filialen) oder Partnerkanäle (Partnerfilialen, Großhändler). Sie durchlaufen fünf Phasen: Aufmerksamkeit, Bewertung, Kauf, Vermittlung und Nachkauf.

### Business Model Canvas im Effectuation-Prozess

![[pictures/mitun/03/Lecture03_Pg035_Business_Model_Canvas_Im_Effectuation_Prozess.png]]

<p class="image-caption">Der Business Model Canvas nach der Effectuation-Logik (Grichnik und Gassmann 2013).</p>

Grichnik und Gassmann (2013) füllen den Canvas nach der Effectuation-Logik aus. Der Start liegt bei den Schlüsselressourcen, also den Mitteln, die der Gründer hat (Mittelorientierung). Von dort geht es über Partnerschaften, Schlüsselaktivitäten und Nutzenversprechen zu Kundenbeziehungen, Kanälen und Kundensegmenten, wobei Umstände und Zufälle genutzt werden. Die Kostenstruktur folgt dem leistbaren Verlust, und beim Ertragsmodell rät die Folie, nicht sofort konkrete Erwartungen zu formulieren.

### Bewertung des Business Model Canvas

![[pictures/mitun/03/Lecture03_Pg036_Bewertung_Des_Business_Model_Canvas.png]]

<p class="image-caption">Kritik und Vorteile des Business Model Canvas.</p>

| Vorteile                                                               | Kritik                                                          |
| :--------------------------------------------------------------------- | :-------------------------------------------------------------- |
| Praxisorientierte Abbildung eines Geschäftsmodells                     | Wettbewerb sowie Umwelt- und Kontextfaktoren fehlen             |
| Einheitliche Darstellung und Sprache für verschiedene Geschäftsmodelle | Bildet das Geschäftsmodell nur zu einem Zeitpunkt ab            |
| Grundlage für einen ausführlicheren Business Plan                      | Produkte und Dienstleistungen lassen sich nicht direkt ableiten |

(Schulz 2020, Becker und Priestaff 2018)

## 5. Übungs- und Hausaufgaben

![[pictures/mitun/03/Lecture03_Pg037_Bungs_Und_Hausaufgaben.png]]

<p class="image-caption">Übung: das Geschäftsmodell von Lovable.</p>

![[pictures/mitun/03/Lecture03_Pg038_Bungs_Und_Hausaufgaben.png]]

<p class="image-caption">Vier Bereiche der AI Business Model Disruption (Osterwalder 2025).</p>

![[pictures/mitun/03/Lecture03_Pg039_Bungs_Und_Hausaufgaben.png]]

<p class="image-caption">Hausaufgabe: Googles Geschäftsmodell im Zeitalter der GenAI.</p>

- **Übung**: In Kleingruppen wird auf Basis des Handelsblatt-Artikels und der zuvor erarbeiteten Value Proposition das Geschäftsmodell von Lovable entwickelt und im Plenum diskutiert.
- **Hausaufgabe 1**: Osterwalder (2025) unterscheidet vier Bereiche der AI Business Model Disruption: Value Model, Production Model, Delivery Model und Economic Model.
- **Hausaufgabe 2**: Analysieren, ob und wie sich Googles Geschäftsmodell im Zeitalter der generativen KI verändert, mit dem Business Model Canvas. Ausgangspunkt ist ein Economist-Artikel (2025), nach dem das Web im KI-Zeitalter ein neues Geschäftsmodell braucht.

## 6. Ausblick: DevOps

![[pictures/mitun/03/Lecture03_Pg040_Ausblick_Devops.png]]

<p class="image-caption">Ankündigung: DevOps im Kontext software-intensiver Geschäftsmodelle.</p>

Kapitel 3.4 behandelt DevOps zur Optimierung der Wertschöpfungsstruktur software-intensiver Geschäftsmodelle in einem Hands-on-Workshop (2025/26 in Block 4 am 14.11.2025).

## Zusammenfassung

- Ein Geschäftsmodell besteht aus Nutzenversprechen, Wertschöpfungsarchitektur und Ertragsmodell (Stähler) und verbindet Strategie und Geschäftsprozesse.
- Die vier generischen Geschäftsmodelle für IT-Produkte sind Standardprodukte, Produkt plus Service, Projekte und Systemservices, jeweils mit eigener Wertschöpfungskette.
- XaaS verschiebt den Markt von Einmalerlösen zu wiederkehrenden Erlösen.
- Der Business Model Canvas beschreibt ein Geschäftsmodell in neun Bausteinen. Er ist praxisnah und einheitlich, blendet aber Wettbewerb, Umfeld und die zeitliche Entwicklung aus.

## Selbsttest

1. Welche drei Bestandteile hat ein Geschäftsmodell nach Stähler?

> [!success]- Antwort
> Das Nutzenversprechen (welcher Nutzen Kunden und Partnern geboten wird), die Wertschöpfungsarchitektur (wie der Nutzen erzeugt wird, mit welchen Partnern und Prozessen) und das Ertragsmodell (womit Geld verdient wird, unterteilt in Erlös- und Kostenmodell).

2. Wie grenzen sich Strategie, Geschäftsmodell und Geschäftsprozesse ab?

> [!success]- Antwort
> Die Strategie (strategische Ebene) legt Unternehmens-, Geschäftsfeld- und Wettbewerbsstrategie fest. Das Geschäftsmodell (taktische Ebene) entwickelt den Wertmechanismus. Die Geschäftsprozesse (operative Ebene) setzen ihn mit Budgets und Arbeitsstrukturen um.

3. Nennen Sie die vier generischen Geschäftsmodelle für IT-Produkte mit je einem Beispiel und Merkmal.

> [!success]- Antwort
> IT-Standardprodukte (Microsoft): standardisierte Software für den Massenmarkt, Anpassungen durch den Anwender. IT-Produkt plus Service (SAP): das Produkt braucht ergänzende Services wie Anpassungen und Schulungen. IT-Projekte (Accenture): kundenindividuelle Entwicklung, das Projekt bestimmt das Produkt. IT-Systemservices (Salesforce): der Betrieb steht im Vordergrund, etwa Cloud- und ASP-Anbieter.

4. Wie unterscheiden sich die primären Aktivitäten bei Standardproduktentwicklung und IT-Systemservices?

> [!success]- Antwort
> Bei der Standardproduktentwicklung sind es Fachkonzept, technische Architektur, Detailentwurf, Implementierung und Test. Bei IT-Systemservices sind es Third Party Services, Service Design, Service-Betrieb, Vertrieb und Support.

5. Was bedeutet Everything-as-a-Service für die Erlöslogik?

> [!success]- Antwort
> Die Entwicklung geht von einzelnen Produkten über Bündel und Subscriptions zur Servitization, bei der Produkte, Services, Betrieb und Wartung als Abonnement angeboten werden. Damit verschiebt sich die Erlöslogik von Einmalerlösen (Standardprodukte, Projekte) zu wiederkehrenden Erlösen (Systemservices).

6. Nennen Sie die neun Bausteine des Business Model Canvas.

> [!success]- Antwort
> Kundensegmente, Wertangebot, Kanäle, Kundenbeziehungen, Einnahmequellen, Schlüsselressourcen, Schlüsselaktivitäten, Schlüsselpartner und Kostenstruktur.

7. Welche vier Arten von Schlüsselpartnerschaften gibt es?

> [!success]- Antwort
> Strategische Allianzen zwischen Nicht-Wettbewerbern, Coopetition zwischen Wettbewerbern, Joint Ventures zur Gründung neuer Unternehmen und Käufer-Lieferanten-Beziehungen zur Sicherung zuverlässiger Lieferungen.

8. Welche Stärken und Schwächen hat der Business Model Canvas?

> [!success]- Antwort
> Stärken: praxisorientiert, einheitliche Darstellung und Sprache für verschiedene Geschäftsmodelle, Grundlage für einen Business Plan. Schwächen: Wettbewerb und Umfeld fehlen, er zeigt nur einen Zeitpunkt, und Produkte und Dienstleistungen lassen sich nicht direkt ableiten.

---

[[/notes/lectures/mitun/index|Zurück zum MITUN-Index]] | [[/notes/lectures/mitun/02-vorgruendung|Zurück: (y-02) Vorgründung]] | [[/notes/lectures/mitun/04-team-und-fuehrung|Weiter: (y-04) Team und Führung]]
