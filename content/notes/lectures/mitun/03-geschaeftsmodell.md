---
title: "L03 - Geschäftsmodell"
tags:
  - mitun
  - geschaeftsmodell
  - business-model-canvas
  - wertschoepfungskette
  - xaas
date: 2026-10-29
---

[[/notes/lectures/mitun/index|Zurück zum MITUN-Index]] | [[/notes/lectures/mitun/02-vorgruendung|Zurück: (y-02) Vorgründung]] | [[/notes/lectures/mitun/04-team-und-fuehrung|Weiter: (y-04) Team und Führung]]

## Mentales Modell

- Ein Geschäftsmodell beschreibt vereinfacht, wie ein Unternehmen Wert schafft und verdient. Nach Stähler (2001) hat es drei Teile: das Nutzenversprechen (welchen Nutzen stiftet das Unternehmen?), die Wertschöpfungsarchitektur (wie wird die Leistung in welcher Konfiguration erstellt?) und das Ertragsmodell (wodurch wird Geld verdient?).
- Das Geschäftsmodell liegt zwischen Strategie und Geschäftsprozessen. Die Strategie richtet sich am Wettbewerb aus und legt die Marktposition fest, das Geschäftsmodell richtet sich am Kunden aus und beschreibt die Grundlogik, mit der Nutzen gestiftet wird und als Umsatz zurückfließt. Die Prozesse setzen es mit Budgets und Strukturen um.
- Der Business Model Canvas (Osterwalder und Pigneur 2010) beschreibt ein Geschäftsmodell in neun Bausteinen auf einer Seite, etwa Googles werbefinanziertes Modell von 2012. Er ist praxisnah und einheitlich, ignoriert aber Wettbewerb und Umfeld und zeigt nur einen Zeitpunkt.
- Herzwurm und Pietsch (2009) unterscheiden vier generische Geschäftsmodelle für IT-Produkte: IT-Standardprodukte, IT-Produkt plus Service, IT-Projekte und IT-Systemservices, jedes mit eigener Wertschöpfungskette. Mit Everything-as-a-Service verschiebt sich der Markt von Einmal- zu wiederkehrenden Erlösen. Die Vorlesung fragt, wo KI-Anbieter wie Anthropic oder OpenAI in diesem Raster stehen.

## 1. Lernziele und Inhalt

![[pictures/mitun/03/Lecture03_Pg004_Inhalt_Und_Lernziele.png]]

<p class="image-caption">Lernziele der Einheit.</p>

![[pictures/mitun/03/Lecture03_Pg005_Inhalt_Und_Lernziele.png]]

<p class="image-caption">Inhalt der Vorlesung.</p>

Die Einheit beginnt mit einem Kahoot-Rückblick auf die Vorgründung. Das Kapitel behandelt Allgemeines zum Geschäftsmodell, den Business Model Canvas, generische Geschäftsmodelle für IT-Produkte und DevOps im Kontext software-intensiver Geschäftsmodelle. Ziel ist, die Bestandteile eines Geschäftsmodells zu erläutern, die Geschäftsmodellstruktur eines Unternehmens zu analysieren, die Bausteine des Business Model Canvas zu erläutern und bestehende Geschäftsmodelle damit zu analysieren, generische Geschäftsmodelle für IT-Produkte und ihre idealtypischen Wertschöpfungsketten abzugrenzen und Ziele und Prinzipien von DevOps und seine Bedeutung für die Wertschöpfung zu diskutieren.

## 2. Was ist ein Geschäftsmodell?

![[pictures/mitun/03/Lecture03_Pg007_Was_Ist_Ein_Gesch_Ftsmodell.png]]

<p class="image-caption">Geschäftsmodell nach Wirtz mit seinen Partialmodellen.</p>

Nach Wirtz (2011, zitiert nach Wirtz 2020) bildet ein Geschäftsmodell "in stark vereinfachter und aggregierter Form" ab, welche Ressourcen in die Unternehmung fließen und wie sie im innerbetrieblichen Leistungserstellungsprozess in vermarktungsfähige Informationen, Produkte und Dienstleistungen transformiert werden. Es sagt, durch welche Kombination von Produktionsfaktoren die Geschäftsstrategie umgesetzt werden soll und welche Rolle die beteiligten Akteure spielen.

Um das Geschäftsmodell liegen sechs Partialmodelle: das Marktmodell (mit Wettbewerbs- und Nachfragermodell), das Beschaffungsmodell, das Leistungserstellungsmodell, das Leistungsangebotsmodell, das Distributionsmodell und das Kapitalmodell (mit Finanzierungs- und Erlösmodell).

### Geschäftsmodell nach Stähler (2001)

![[pictures/mitun/03/Lecture03_Pg008_Gesch_Ftsmodell_Nach_St_Hler_2001.png]]

<p class="image-caption">Nutzenversprechen, Wertschöpfungsarchitektur und Ertragsmodell.</p>

Ein Geschäftsmodell ist eine "vereinfachte, allgemeine Beschreibung der Art und Weise, wie eine Geschäftstätigkeit funktioniert oder funktionieren kann". Es hat drei Teile:

| Teil                      | Frage                                                    | Beschreibung und Beispiele                                                                                                                                                                                                                                                                                            |
| :------------------------ | :------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nutzenversprechen         | Welchen Nutzen stiftet das Unternehmen?                  | Welcher Nutzen potenziellen Kunden oder Partnern geboten wird (Wertangebot, Value Proposition), etwa Feature, Benefit, Value                                                                                                                                                                                          |
| Wertschöpfungsarchitektur | Wie wird die Leistung in welcher Konfiguration erstellt? | Wie der Nutzen entsteht und die Wertkette aufgebaut ist: der Leistungserstellungsprozess (Produktentstehung, Vertrieb, Betrieb) und die Leistungskonfiguration (beteiligte Partner und ihre Rollen). Beispiele: Eigenentwicklung oder Zukauf, Vertrieb direkt oder über Partner, Betrieb On-Premise oder in der Cloud |
| Ertragsmodell             | Wodurch wird Geld verdient?                              | Wie Erlöse entstehen, unterteilt in Erlös- und Kostenmodell. Beispiele: Lizenzen, Wartung und Service, Dienstleistungen (direkt oder indirekt, leistungsabhängig oder pauschal), Cloud-Subscriptions                                                                                                                  |

### Strategie, Geschäftsmodell und Prozesse

![[pictures/mitun/03/Lecture03_Pg009_Strategie_Gesch_Ftsmodell_Und_Prozesse.png]]

<p class="image-caption">Strategie, Geschäftsmodell und Geschäftsprozesse in der Unternehmensarchitektur (Pelzl 2016).</p>

Pelzl (2016) ordnet drei Ebenen der Unternehmensarchitektur: Auf der strategischen Ebene (Planung) werden Unternehmens-, Geschäftsfeld- und Wettbewerbsstrategie entwickelt. Auf der taktischen Ebene (Vermittlung) liegt das Geschäftsmodell, das den Wertmechanismus entwickelt. Auf der operativen Ebene (Implementierung) setzen Geschäftsprozesse mit Budgets und Arbeitsstrukturen das Modell um. Informationssysteme unterstützen alle drei Ebenen.

### Unterschiede von Strategie und Geschäftsmodell

![[pictures/mitun/03/Lecture03_Pg010_Unterschiede_Strategie_Und_Geschaeftsmodell.png]]

<p class="image-caption">Strategie und Geschäftsmodell nach Orientierung, Zielsetzung und Inhalt (Schallmo 2013).</p>

Schallmo (2013) grenzt die beiden in drei Punkten ab:

|              | Strategie                                                                                                                   | Geschäftsmodell                                                                                                                                                                                                                                                                                                                      |
| :----------- | :-------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Orientierung | Wettbewerb                                                                                                                  | Kunden                                                                                                                                                                                                                                                                                                                               |
| Zielsetzung  | Wettbewerbsvorteil aufbauen und absichern, sich von Wettbewerbern differenzieren                                            | Die Elemente so kombinieren, dass das Geschäftsmodell schwer imitierbar ist und sich die Elemente gegenseitig verstärken, um Wachstum zu erzielen                                                                                                                                                                                    |
| Inhalt       | Marktanalysen und -planungen, Festlegung der angestrebten Marktposition, Erarbeitung verschiedener Geschäftsmodell-Optionen | Wie Unternehmensaktivitäten und -elemente zusammenwirken, um Strategien umzusetzen; die Grundlogik des Unternehmens; welcher Nutzen auf welche Weise für Kunden und Partner gestiftet wird und wie er als Umsatz zurückfließt. Der Nutzen ermöglicht Differenzierung, festigt Kundenbeziehungen und schafft einen Wettbewerbsvorteil |

### Geschäftsmodellebenen

![[pictures/mitun/03/Lecture03_Pg011_Gesch_Ftsmodellebenen.png]]

<p class="image-caption">Geschäftsmodellebenen von der Industrie bis zum Produkt (Pelzl 2016).</p>

Geschäftsmodelle gibt es auf vier Ebenen, von generisch bis spezifisch (Pelzl 2016): Industrieebene (Geschäftsmodelltypen einer Industrie, etwa der Automobilindustrie), Unternehmensebene (wie ein Unternehmen agiert, etwa Coca-Cola oder Dell), Geschäftseinheitsebene (für eine Geschäftseinheit) und Produkt- und Serviceebene (für ein Produkt oder einen Service, etwa bei Amazon).

## 3. Business Model Canvas

![[pictures/mitun/03/Lecture03_Pg013_Business_Model_Canvas.png]]

<p class="image-caption">Die neun Bausteine des Business Model Canvas.</p>

Der Business Model Canvas nach Osterwalder und Pigneur (2010) hat neun Bausteine: Schlüsselpartner, Schlüsselaktivitäten, Schlüsselressourcen, Wertangebot, Kundenbeziehungen, Kanäle, Kundensegmente, Kostenstruktur und Einnahmequellen.

### 1. Kundensegmente

![[pictures/mitun/03/Lecture03_Pg014_Kundensegmente.png]]

<p class="image-caption">Kundensegmente.</p>

"Definiert die verschiedenen Gruppen von Personen oder Organisationen, die ein Unternehmen erreichen und bedienen will." Kundengruppen sind verschiedene Segmente, wenn ihre Bedürfnisse ein eigenes Angebot erfordern und rechtfertigen, sie über verschiedene Kanäle erreicht werden, verschiedene Beziehungen brauchen, verschieden rentabel sind oder für verschiedene Aspekte des Angebots zahlen.

### 2. Wertangebot

![[pictures/mitun/03/Lecture03_Pg015_Wertangebot.png]]

<p class="image-caption">Wertangebot.</p>

"Beschreibt das Paket von Produkten und Dienstleistungen, das für ein bestimmtes Kundensegment Wert schöpft." Es ist der Grund, warum Kunden sich für ein Unternehmen entscheiden, und löst ein Problem oder erfüllt ein Bedürfnis eines Segments.

### 3. Kundenbeziehungen

![[pictures/mitun/03/Lecture03_Pg016_Kundenbeziehungen.png]]

<p class="image-caption">Kundenbeziehungen.</p>

"Beschreibt die Arten von Beziehungen, die ein Unternehmen mit bestimmten Kundensegmenten eingeht." Sie reichen von persönlich bis automatisiert und dienen Kundengewinnung, Kundenbindung und Upselling. Kategorien sind persönliche Assistenz, dedizierte persönliche Assistenz, Selbstbedienung, automatisierte Dienstleistungen, Communities und Co-Creation.

### 4. Einnahmequellen

![[pictures/mitun/03/Lecture03_Pg017_Einnahmequellen.png]]

<p class="image-caption">Einnahmequellen.</p>

"Steht für die Einkünfte, die ein Unternehmen aus jedem Kundensegment bezieht (Umsatz minus Kosten gleich Gewinn)." Arten sind Verkauf von Vermögenswerten, Nutzungsgebühren, Abonnements, Verleih, Vermietung oder Leasing und Lizenzierung.

### 5. Schlüsselressourcen

![[pictures/mitun/03/Lecture03_Pg018_Schl_Sselressourcen.png]]

<p class="image-caption">Schlüsselressourcen.</p>

Die wichtigsten Wirtschaftsgüter, damit das Geschäftsmodell funktioniert: Sie ermöglichen Wertangebot, Marktbearbeitung, Kundenbeziehungen und Einkünfte. Sie sind physisch, finanziell, intellektuell oder menschlich und können im Besitz der Firma, geleast oder von Partnern bezogen sein.

### 6. Schlüsselaktivitäten

![[pictures/mitun/03/Lecture03_Pg019_Schl_Sselaktivit_Ten.png]]

<p class="image-caption">Schlüsselaktivitäten.</p>

Die wichtigsten Dinge, die ein Unternehmen tun muss, damit sein Geschäftsmodell funktioniert. Wie die Schlüsselressourcen dienen sie dazu, ein Wertangebot zu schaffen, Märkte zu erreichen, Kundenbeziehungen zu pflegen und Gewinne zu erzielen.

### 7. Schlüsselpartner

![[pictures/mitun/03/Lecture03_Pg020_Schl_Sselpartner.png]]

<p class="image-caption">Schlüsselpartner.</p>

Das Netzwerk von Lieferanten und Partnern, die zum Gelingen beitragen. Partnerschaften sind häufig der Grundstein des Geschäftsmodells. Allianzen optimieren es, mindern Risiken oder beschaffen Ressourcen. Es gibt vier Arten: strategische Allianzen zwischen Nicht-Wettbewerbern, Coopetition zwischen Wettbewerbern, Joint Ventures für neue Unternehmen und Käufer-Lieferanten-Beziehungen für zuverlässige Lieferungen.

### 8. Kostenstruktur

![[pictures/mitun/03/Lecture03_Pg021_Kostenstruktur.png]]

<p class="image-caption">Kostenstruktur.</p>

Alle Kosten, die bei der Ausführung des Geschäftsmodells anfallen. Kosten sollten immer minimiert werden, aber für manche Modelle ist das wichtiger als für andere, daher die Unterscheidung zwischen kostenorientierten und wertorientierten Strukturen. Merkmale sind Fixkosten, variable Kosten, Mengen- und Verbundvorteile.

### 9. Kanäle

![[pictures/mitun/03/Lecture03_Pg022_Kan_Le.png]]

<p class="image-caption">Kanaltypen und Kanalphasen.</p>

Wie ein Unternehmen seine Segmente erreicht und anspricht, um das Wertangebot zu vermitteln. Kanäle sind eigene direkte (Verkaufsabteilung, Internetverkauf), eigene indirekte (eigene Filialen) oder Partnerkanäle (Partnerfilialen, Großhändler). Sie durchlaufen fünf Phasen: Aufmerksamkeit, Bewertung, Kauf, Vermittlung und Nachkauf.

### Business Model Canvas im Effectuation-Prozess

![[pictures/mitun/03/Lecture03_Pg023_Business_Model_Canvas_Im_Effectuation_Prozess.png]]

<p class="image-caption">Der Business Model Canvas nach der Effectuation-Logik (Grichnik und Gassmann 2013).</p>

Grichnik und Gassmann (2013) füllen den Canvas nach der Effectuation-Logik in nummerierten Schritten aus:

1. Start bei den Schlüsselressourcen (Mittelorientierung): mit den Präferenzen, dem Wissen und den Kontakten beginnen, die sofort verfügbar sind, und dieses Inventar laufend aktualisieren.
2. Schlüsselpartner (Partnerschaften): Angebote machen, mit denen sich Partner selbst in den Prozess wählen, und ihre freiwillige Selbstverpflichtung gemeinsam festlegen.
3. Schlüsselaktivitäten: das tun, was man selbst und die Partner können und gemeinsam tun wollen, und den Partnern Einfluss erlauben.
4. Nutzenversprechen: es gemeinsam erschaffen und die eigenen Zielerwartungen mit denen der Partner durch Verhandlungen zusammenführen.
5. Kundenbeziehungen (Umstände und Zufälle): sich vielen Kontakten aussetzen und mit jedem Feedback arbeiten.
6. Kanäle: mit Kanälen beginnen, die frei oder über das eigene Netzwerk zugänglich sind.
7. Kundensegmente: die ersten Kunden aus dem Kreis der Partner gewinnen und darauf aufbauend Kundengruppen entwickeln.

Für die Kostenstruktur gilt der leistbare Verlust: Kosten mit kleinen, leistbaren Schritten unter Kontrolle halten und weder sich noch die Partner überfordern. Für die Ertragsstruktur rät die Folie, nicht sofort konkrete Erwartungen zu formulieren, die Hürde für Partner zu senken und gemeinsam ein Ertragsmodell zu entwickeln, das die Erträge fair verteilt.

### Bewertung des Business Model Canvas

![[pictures/mitun/03/Lecture03_Pg024_Bewertung_Des_Business_Model_Canvas.png]]

<p class="image-caption">Kritik und Vorteile des Business Model Canvas.</p>

| Vorteile                                                               | Kritik                                                          |
| :--------------------------------------------------------------------- | :-------------------------------------------------------------- |
| Praxisorientierte Abbildung eines Geschäftsmodells                     | Wettbewerb sowie Umwelt- und Kontextfaktoren fehlen             |
| Einheitliche Darstellung und Sprache für verschiedene Geschäftsmodelle | Bildet das Geschäftsmodell nur zu einem Zeitpunkt ab            |
| Grundlage für einen ausführlicheren Business Plan                      | Produkte und Dienstleistungen lassen sich nicht direkt ableiten |

(Schulz 2020, Becker und Priestaff 2018)

### Beispiel: Google 2012

![[pictures/mitun/03/Lecture03_Pg025_Beispiel_Google_2012.png]]

<p class="image-caption">Der Business Model Canvas von Google im Jahr 2012.</p>

Der Canvas für Google im Jahr 2012 (nach bmimatters.com 2012):

| Baustein             | Inhalt                                                                                                                                                                       |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schlüsselpartner     | Distribution Partners, Open Handset Alliance, OEMs für Chrome-OS-Geräte                                                                                                      |
| Schlüsselaktivitäten | Forschung und Entwicklung neuer und besserer Produkte, Betrieb einer riesigen IT-Infrastruktur                                                                               |
| Schlüsselressourcen  | Rechenzentren, geistiges Eigentum, Marke                                                                                                                                     |
| Wertangebot          | Websuche, Gmail, Google+; zielgerichtete Werbung mit AdWords (CPC); Reichweite für Kampagnen über AdSense; Display Advertising; Android und Chrome OS; gehostete Google Apps |
| Kundenbeziehungen    | Automatisierung wo möglich, eigener Vertrieb für Großkunden                                                                                                                  |
| Kanäle               | Globale Vertriebs- und Supportteams, Vertrieb für mehrere Produkte                                                                                                           |
| Kundensegmente       | Internetnutzer, Werbetreibende und Agenturen, Mitglieder des Google-Netzwerks, Besitzer mobiler Geräte, Entwickler, Unternehmen                                              |
| Kostenstruktur       | Traffic Acquisition Costs, F&E (vor allem Personal), Rechenzentrumsbetrieb, Vertrieb und Marketing, Verwaltung                                                               |
| Einnahmequellen      | Werbeerlöse auf Google-Seiten und im Google-Netzwerk, Verkauf von Unternehmensprodukten, kostenlose Angebote                                                                 |

2012 kamen rund 96 % der Einnahmen aus Werbung, heute sind es rund drei Viertel (Alphabet 2024). Die Folie fragt, wie viele Geschäftsmodelle in diesem Canvas stecken und was an Googles Geschäftsmodell besonders ist. Ein Ansatz: Die Nutzer zahlen nicht, die Werbetreibenden finanzieren die kostenlosen Angebote für Internetnutzer, Entwickler und Gerätebesitzer.

## 4. Generische Geschäftsmodelle für IT-Produkte

![[pictures/mitun/03/Lecture03_Pg027_Generische_Gesch_Ftsmodelle_F_R_It.png]]

<p class="image-caption">Die generischen Geschäftsmodelle für IT-Produkte (Herzwurm und Pietsch 2009).</p>

Herzwurm und Pietsch (2009) unterscheiden vier idealtypische Geschäftsmodelle:

1. IT-Standardprodukte, unterteilt in Vermarktung und Pflege sowie Forschung und Entwicklung,
2. IT-Produkt plus Service,
3. IT-Projekte, unterteilt in Projektdurchführung und Projektbegründung,
4. IT-Systemservices.

Jedes hat eine eigene Wertschöpfungskette aus unterstützenden (sekundären) und primären Aktivitäten, die zusammen die Gewinnspanne erzeugen.

### IT-Standardprodukte

![[pictures/mitun/03/Lecture03_Pg028_It_Standardprodukte.png]]

<p class="image-caption">IT-Standardprodukte: Microsoft, Symantec, Apple.</p>

![[pictures/mitun/03/Lecture03_Pg029_It_Standardprodukte.png]]

<p class="image-caption">Wertschöpfungskette der Standardproduktvermarktung und -pflege.</p>

![[pictures/mitun/03/Lecture03_Pg030_It_Standardprodukte.png]]

<p class="image-caption">Wertschöpfungskette der Standardproduktentwicklung.</p>

Unternehmen wie Microsoft, Symantec und Apple entwickeln oder vermarkten standardisierte Softwareprodukte für den Massenmarkt. Anpassungen machen ausschließlich die Anwender in Eigenverantwortung.

| Wertschöpfungskette       | Unterstützende Aktivitäten                                                                             | Primäre Aktivitäten                                                                 |
| :------------------------ | :----------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| Vermarktung und Pflege    | Marketing, Änderungsmanagement, Systeminfrastruktur und Ressourcenmanagement, Konfigurationsmanagement | Qualitätssicherung, Releasemanagement, Presales und Vertrieb, Auslieferung, Wartung |
| Forschung und Entwicklung | Dokumentation, Risikomanagement, Technologieplanung, Projektmanagement                                 | Fachkonzept, technische Architektur, Detailentwurf, Implementierung, Test           |

### IT-Produkt plus Service

![[pictures/mitun/03/Lecture03_Pg031_It_Produkt_Plus_Service.png]]

<p class="image-caption">IT-Produkt plus Service: SAP, KUMAvision, DATEV.</p>

![[pictures/mitun/03/Lecture03_Pg032_It_Produkt_Plus_Service.png]]

<p class="image-caption">Wertschöpfungskette für IT-Produkt plus Service.</p>

Bei SAP, KUMAvision oder DATEV würde das Produkt ohne ergänzende Services wie kleinere Anpassungen und Schulungen nicht am Massenmarkt bestehen. Unterstützende Aktivitäten sind Marketing, Änderungsmanagement, Systeminfrastruktur und Ressourcenmanagement sowie Prozessmanagement. Primäre Aktivitäten sind Problemanalyse, Qualitätssicherung und Vorkonfiguration, Customizing, Installation und Support.

### IT-Projekte

![[pictures/mitun/03/Lecture03_Pg033_It_Projekte.png]]

<p class="image-caption">IT-Projekte: Accenture, INFORM, adesso.</p>

![[pictures/mitun/03/Lecture03_Pg034_It_Projekte.png]]

<p class="image-caption">Wertschöpfungskette der IT-Projektbegründung.</p>

![[pictures/mitun/03/Lecture03_Pg035_It_Projekte.png]]

<p class="image-caption">Wertschöpfungskette der IT-Projektdurchführung.</p>

Bei Accenture, INFORM oder adesso steht die Dienstleistung im Vordergrund: Das Projekt bestimmt das Produkt, Software wird kundenindividuell entwickelt und gepflegt.

| Wertschöpfungskette | Unterstützende Aktivitäten                                                                             | Primäre Aktivitäten                                                                                                     |
| :------------------ | :----------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| Projektbegründung   | Marketing, Geschäftsentwicklung, Technologieplanung, Personalentwicklung                               | Accountpflege und Recruitment, Presales und Qualifikation, Vorstudie, Verhandlung und Vereinbarung, Auftragscontrolling |
| Projektdurchführung | Risikomanagement, Änderungsmanagement, Systeminfrastruktur und Ressourcenmanagement, Prozessmanagement | Qualitätssicherung, Projektinitiierung, Projektsteuerung, Projektabschluss, Erfahrungssicherung                         |

### IT-Systemservices

![[pictures/mitun/03/Lecture03_Pg036_It_Systemservices.png]]

<p class="image-caption">IT-Systemservices: Salesforce, Office 365, Dropbox, STACKIT und weitere.</p>

![[pictures/mitun/03/Lecture03_Pg037_It_Systemservices.png]]

<p class="image-caption">Wertschöpfungskette der IT-Systemservices.</p>

Bei myfactory, Salesforce, Office 365, Google Apps for Business, SAP SuccessFactors, Dropbox oder STACKIT gewinnt der Betrieb an Bedeutung. Das Modell wird im IT-Outsourcing zunehmend relevant und umfasst neben klassischen Rechenzentren auch Cloud- und ASP-Anbieter. Unterstützende Aktivitäten sind Marketing, Geschäftsentwicklung, Infrastrukturplanung und Service Controlling. Primäre Aktivitäten sind Third Party Services, Service Design, Service-Betrieb, Vertrieb und Support.

### Die Wertschöpfungsketten im Überblick

![[pictures/mitun/03/Lecture03_Pg038_Die_Wertsch_Pfungsketten_Im_Berblick.png]]

<p class="image-caption">Die sechs Wertschöpfungsketten nebeneinander.</p>

Nebeneinander gestellt zeigen die sechs Ketten, wie sich der Schwerpunkt verschiebt: von Entwicklung und Release beim Standardprodukt über Customizing und Installation beim Produkt plus Service und Vorstudie, Projektsteuerung und Erfahrungssicherung bei Projekten bis zu Service Design und Betrieb bei Systemservices.

### Everything-as-a-Service

![[pictures/mitun/03/Lecture03_Pg039_Everything_As_A_Service.png]]

<p class="image-caption">Die Evolution zu XaaS: von Einmalerlösen zu wiederkehrenden Erlösen (SAP 2023).</p>

SAP (2023) beschreibt die Evolution zu XaaS in vier Stufen: einzelne Produkte und Services, Bündel konfigurierbarer Produkte, Übergang zu Subscriptions und schließlich Servitization mit XaaS, bei der Produkte, Services, Ausrüstung, Betrieb und Wartung als Abonnement angeboten werden. Die generischen Modelle wandern dabei von Einmalerlösen (Standardprodukte, Projekte) über das Produkt plus Service zu wiederkehrenden Erlösen (Systemservices).

### Wo stehen KI-Unternehmen?

![[pictures/mitun/03/Lecture03_Pg040_Einordnung_Von_Ki_Unternehmen.png]]

<p class="image-caption">Wo würden Sie Anthropic oder OpenAI einordnen?</p>

Die Folie fragt, in welches der vier generischen Modelle KI-Unternehmen wie Anthropic oder OpenAI gehören. Die Frage bleibt offen. Für eine Diskussion: Ein Sprachmodell wird wie ein Standardprodukt mit hohem Forschungs- und Entwicklungsaufwand für den Massenmarkt gebaut, aber über API und Abonnements als laufend betriebener Service mit wiederkehrenden Erlösen verkauft, was eher den IT-Systemservices entspricht. Für Großkunden kommen Anpassungen und Beratung hinzu wie beim Produkt plus Service.

## 5. Hausaufgabe

![[pictures/mitun/03/Lecture03_Pg041_Bungs_Und_Hausaufgaben.png]]

<p class="image-caption">Vier Bereiche der AI Business Model Disruption (Osterwalder 2025).</p>

![[pictures/mitun/03/Lecture03_Pg042_Bungs_Und_Hausaufgaben.png]]

<p class="image-caption">Hausaufgabe: Googles Geschäftsmodell im Zeitalter der GenAI.</p>

Osterwalder (2025) legt vier Bereiche der AI Business Model Disruption über den Canvas: das Production Model (die linke Seite mit Partnern, Aktivitäten und Ressourcen), das Value Model (das Wertangebot in der Mitte), das Delivery Model (die rechte Seite mit Beziehungen, Kanälen und Segmenten) und das Economic Model (Kosten und Einnahmen unten).

Die Hausaufgabe: mit dem Business Model Canvas analysieren, ob und wie sich Googles Geschäftsmodell im Zeitalter der generativen KI verändert. Ein Einstieg ist der Google-Canvas von 2012 aus der Vorlesung. Ausgangspunkt ist ein Economist-Artikel (2025), nach dem das Web im KI-Zeitalter ein neues Geschäftsmodell braucht.

## 6. Ausblick: DevOps

![[pictures/mitun/03/Lecture03_Pg043_Ausblick_Devops.png]]

<p class="image-caption">Ankündigung: Block 4 zu DevOps im Kontext software-intensiver Geschäftsmodelle.</p>

Kapitel 3.4 behandelt DevOps zur Optimierung der Wertschöpfungsstruktur software-intensiver Geschäftsmodelle. Termin ist Block 4 am 13.11.2026 um 9:00 Uhr in M17.73.

## Zusammenfassung

- Ein Geschäftsmodell besteht aus Nutzenversprechen, Wertschöpfungsarchitektur und Ertragsmodell (Stähler). Wirtz ergänzt sechs Partialmodelle von Markt bis Kapital.
- Die Strategie orientiert sich am Wettbewerb und sucht einen Wettbewerbsvorteil, das Geschäftsmodell orientiert sich am Kunden und beschreibt die Grundlogik des Unternehmens. Es setzt die Strategie um, die Geschäftsprozesse setzen das Geschäftsmodell um.
- Der Business Model Canvas beschreibt ein Geschäftsmodell in neun Bausteinen. Er ist praxisnah und einheitlich, blendet aber Wettbewerb, Umfeld und die zeitliche Entwicklung aus. Nach Effectuation-Logik beginnt man bei den eigenen Ressourcen und Partnern.
- Die vier generischen Geschäftsmodelle für IT-Produkte sind Standardprodukte, Produkt plus Service, Projekte und Systemservices, jeweils mit eigener Wertschöpfungskette.
- XaaS verschiebt den Markt von Einmalerlösen zu wiederkehrenden Erlösen. Offen bleibt, in welches Modell KI-Anbieter wie Anthropic oder OpenAI gehören.

## Selbsttest

1. Welche drei Bestandteile hat ein Geschäftsmodell nach Stähler?

> [!success]- Antwort
> Das Nutzenversprechen (welcher Nutzen Kunden und Partnern geboten wird), die Wertschöpfungsarchitektur (wie der Nutzen erzeugt wird: Leistungserstellungsprozess und Leistungskonfiguration mit Partnern und Rollen) und das Ertragsmodell (womit Geld verdient wird, unterteilt in Erlös- und Kostenmodell).

2. Wie unterscheiden sich Strategie und Geschäftsmodell nach Schallmo?

> [!success]- Antwort
> Die Strategie orientiert sich am Wettbewerb, will einen Wettbewerbsvorteil aufbauen und absichern und umfasst Marktanalysen, die angestrebte Marktposition und verschiedene Geschäftsmodell-Optionen. Das Geschäftsmodell orientiert sich am Kunden, kombiniert seine Elemente schwer imitierbar und sich gegenseitig verstärkend und beschreibt die Grundlogik, wie Nutzen gestiftet wird und als Umsatz zurückfließt.

3. Wie grenzen sich Strategie, Geschäftsmodell und Geschäftsprozesse in der Unternehmensarchitektur ab?

> [!success]- Antwort
> Die Strategie (strategische Ebene) legt Unternehmens-, Geschäftsfeld- und Wettbewerbsstrategie fest. Das Geschäftsmodell (taktische Ebene) entwickelt den Wertmechanismus. Die Geschäftsprozesse (operative Ebene) setzen ihn mit Budgets und Arbeitsstrukturen um (Pelzl 2016).

4. Nennen Sie die neun Bausteine des Business Model Canvas.

> [!success]- Antwort
> Kundensegmente, Wertangebot, Kanäle, Kundenbeziehungen, Einnahmequellen, Schlüsselressourcen, Schlüsselaktivitäten, Schlüsselpartner und Kostenstruktur.

5. In welcher Reihenfolge füllt man den Canvas nach Effectuation-Logik aus?

> [!success]- Antwort
> Man startet bei den Schlüsselressourcen (vorhandene Präferenzen, Wissen, Kontakte), geht über Schlüsselpartner, Schlüsselaktivitäten und ein gemeinsam erschaffenes Nutzenversprechen zu Kundenbeziehungen, Kanälen und Kundensegmenten. Die ersten Kunden kommen aus dem Kreis der Partner. Kosten folgen dem leistbaren Verlust, und das Ertragsmodell wird erst gemeinsam mit den Partnern entwickelt.

6. Welche vier Arten von Schlüsselpartnerschaften gibt es?

> [!success]- Antwort
> Strategische Allianzen zwischen Nicht-Wettbewerbern, Coopetition zwischen Wettbewerbern, Joint Ventures zur Gründung neuer Unternehmen und Käufer-Lieferanten-Beziehungen zur Sicherung zuverlässiger Lieferungen.

7. Welche Stärken und Schwächen hat der Business Model Canvas?

> [!success]- Antwort
> Stärken: praxisorientiert, einheitliche Darstellung und Sprache für verschiedene Geschäftsmodelle, Grundlage für einen Business Plan. Schwächen: Wettbewerb und Umfeld fehlen, er zeigt nur einen Zeitpunkt, und Produkte und Dienstleistungen lassen sich nicht direkt ableiten.

8. Was ist an Googles Geschäftsmodell von 2012 besonders?

> [!success]- Antwort
> Es sind mehrere Geschäftsmodelle in einem Canvas: kostenlose Angebote für Internetnutzer, Entwickler und Gerätebesitzer, Werbung für Werbetreibende und Agenturen, das Google-Netzwerk und Unternehmensprodukte. Die Nutzer zahlen nicht, rund 96 % der Einnahmen kamen 2012 aus Werbung (heute rund drei Viertel).

9. Nennen Sie die vier generischen Geschäftsmodelle für IT-Produkte mit je einem Beispiel und Merkmal.

> [!success]- Antwort
> IT-Standardprodukte (Microsoft): standardisierte Software für den Massenmarkt, Anpassungen durch den Anwender. IT-Produkt plus Service (SAP): das Produkt braucht ergänzende Services wie Anpassungen und Schulungen. IT-Projekte (Accenture): kundenindividuelle Entwicklung, das Projekt bestimmt das Produkt. IT-Systemservices (Salesforce): der Betrieb steht im Vordergrund, etwa Cloud- und ASP-Anbieter.

10. Wie unterscheiden sich die primären Aktivitäten bei Standardproduktentwicklung und IT-Systemservices?

> [!success]- Antwort
> Bei der Standardproduktentwicklung sind es Fachkonzept, technische Architektur, Detailentwurf, Implementierung und Test. Bei IT-Systemservices sind es Third Party Services, Service Design, Service-Betrieb, Vertrieb und Support.

11. Was bedeutet Everything-as-a-Service für die Erlöslogik?

> [!success]- Antwort
> Die Entwicklung geht von einzelnen Produkten über Bündel und Subscriptions zur Servitization, bei der Produkte, Services, Betrieb und Wartung als Abonnement angeboten werden. Damit verschiebt sich die Erlöslogik von Einmalerlösen (Standardprodukte, Projekte) zu wiederkehrenden Erlösen (Systemservices).

12. Wo würden Sie Anthropic oder OpenAI einordnen?

> [!success]- Antwort
> Die Folie lässt die Frage offen. Argumentieren lässt sich so: Das Modell selbst entsteht wie ein Standardprodukt mit hohem F&E-Aufwand für den Massenmarkt, wird aber über API und Abonnements als laufend betriebener Service mit wiederkehrenden Erlösen verkauft, also eher als IT-Systemservice. Für Unternehmenskunden kommen Anpassung und Beratung wie beim Produkt plus Service hinzu.

---

[[/notes/lectures/mitun/index|Zurück zum MITUN-Index]] | [[/notes/lectures/mitun/02-vorgruendung|Zurück: (y-02) Vorgründung]] | [[/notes/lectures/mitun/04-team-und-fuehrung|Weiter: (y-04) Team und Führung]]
