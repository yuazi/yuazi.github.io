---
title: "L05 - Design Science Research und Artefaktevaluation"
tags:
  - forschungsmethoden
  - design-science-research
  - method-engineering
  - prototyping
  - evaluation
date: 2026-10-27
---

[[/notes/lectures/forschungsmethoden/index|Zurück zum Forschungsmethoden-Index]] | [[/notes/lectures/forschungsmethoden/04-qualitative-forschung|Zurück: (y-04) Qualitative Forschung]]

## Mentales Modell

- Die gestaltungsorientierte WI erzeugt Gestaltungswissen: Mittel-Zweck-Beziehungen ("wie erreicht man ein Ziel?") statt der Ursache-Wirkungs-Beziehungen der erklärenden Forschung. Ihr Ergebnis ist ein Artefakt, also ein Konstrukt, Modell, eine Methode oder Instanziierung, das abstrakt, originell, begründet und nützlich sein muss (Memorandum, Österle u. a. 2010).
- Design Science Research (Hevner u. a. 2004) verbindet die Umgebung (Menschen, Organisationen, Technologie) mit der Wissensbasis über drei Zyklen: Relevance Cycle (Anforderungen, Feldtest), Design Cycle (Bauen und Evaluieren) und Rigor Cycle (Fundierung und Erweiterung der Wissensbasis).
- Das Vorgehensmodell von Peffers u. a. (2007) hat sechs Schritte, von Problem und Motivation über Ziele, Design, Demonstration und Evaluation bis zur Kommunikation, mit flexiblen Einstiegspunkten.
- Typische Ergebnistypen sind wissenschaftliche Gestaltungsempfehlungen (Gestaltungsparameter, -bedingungen, -wirkungen und -ziele) und Methoden, die per (Situational) Method Engineering aus Methodenfragmenten zusammengesetzt werden.
- Evaluation weist nach, dass das Artefakt nützlich ist. Methoden reichen von logischen Argumenten über Experteneinschätzungen, Experimente und Fallstudien bis zu Prototypen, die je nach Reife einen Proof of Concept, Proof of Value oder Proof of Use liefern.

## 1. Inhalt und Lernziele

![[pictures/forschungsmethoden/05/Lecture05_Pg003_Inhalt_Und_Lernziele.png]]

<p class="image-caption">Inhalt der Vorlesung.</p>

![[pictures/forschungsmethoden/05/Lecture05_Pg004_Inhalt_Und_Lernziele.png]]

<p class="image-caption">Lernziele der Einheit.</p>

Die Einheit behandelt das Memorandum zur gestaltungsorientierten WI, Artefakte und Designtheorie, den DSR-Ansatz mit Ablauf, Ergebnistypen und Evaluation, wissenschaftliche Gestaltungsempfehlungen, Method Engineering mit einem Beispielprojekt und Evaluationsmethoden (Prototyping, Fokusgruppen, Delphi, Thinking Aloud). Ziel ist, DSR zu verstehen und anzuwenden, Artefakttypen wie Gestaltungsempfehlungen und Methoden zu kennen und die passenden Methoden zur Instanziierung und Validierung zu wählen.

## 2. Memorandum zur gestaltungsorientierten Wirtschaftsinformatik

![[pictures/forschungsmethoden/05/Lecture05_Pg006_Memorandum_Zur_Gestaltungsorientierten_Wirtschaftsinformatik.png]]

<p class="image-caption">Ziele des Memorandums (Österle u. a. 2010).</p>

Das Memorandum (Österle u. a. 2010, 2011) ist eine Antwort der europäischen WI-Forschung. Es soll Regeln für rigorose Forschung und Sicherheit für Forschende schaffen, Kriterien für Gutachten, für die Auswahl des Nachwuchses und Berufungen und für die Bewertung von Wissenschaftlern und Institutionen liefern und die gestaltungsorientierte WI international positionieren.

### Vier Prinzipien

![[pictures/forschungsmethoden/05/Lecture05_Pg007_Vier_Prinzipien.png]]

<p class="image-caption">Abstraktion, Originalität, Begründung und Nutzen.</p>

- **Abstraktion**: Ein Artefakt muss auf eine Klasse von Problemen anwendbar sein.
- **Originalität**: Es muss einen innovativen Beitrag zum publizierten Wissensstand leisten.
- **Begründung**: Es muss nachvollziehbar begründet und validierbar sein.
- **Nutzen**: Es muss heute oder künftig einen Nutzen für die Anspruchsgruppen erzeugen können.

## 3. Artefakte und Designtheorie

### Was sind Artefakte?

![[pictures/forschungsmethoden/05/Lecture05_Pg009_Was_Sind_Artefakte.png]]

<p class="image-caption">Artefakte nach Herbert A. Simon.</p>

Nach Herbert A. Simons nobelpreisgekrönter Arbeit (The Sciences of the Artificial, 1996) ist unsere Welt voller Artefakte, die vom Menschen geschaffen sind und nicht natürlich vorkommen. Als empirische Phänomene sind sie künstlich statt natürlich. Weil Menschen sie schaffen, erforscht die Wissenschaft der Artefakte die Designs, mit denen Artefakte menschlich erdachte Aufgaben, Ziele und Funktionen erfüllen.

### Design Science und Designtheorie

![[pictures/forschungsmethoden/05/Lecture05_Pg010_Design_Science_Und_Designtheorie.png]]

<p class="image-caption">Definitionen von Design Science und Designtheorie.</p>

Design Science ist "the scientific study and creation of artifacts as they are developed and used by people with the goal of solving practical problems of general interest" (Johannesson und Perjons 2014). Ihr Ergebnis ist per Definition ein Artefakt (Konstrukt, Modell, Methode oder Instanziierung), das so präsentiert wird, dass es sich mit bestehenden Artefakten für denselben Zweck vergleichen lässt (Hevner 2007). Design Science ist also gegenstandsbezogen und problemorientiert und trägt zur Designtheorie bei. Eine Designtheorie für Informationssysteme ist nach Walls u. a. (1992) "a prescriptive theory which integrates normative and descriptive theories into design paths intended to produce more effective information systems".

## 4. Der Design Science Research Ansatz

![[pictures/forschungsmethoden/05/Lecture05_Pg012_Der_Design_Science_Research_Ansatz.png]]

<p class="image-caption">Prinzipien von Design Science Research.</p>

DSR ist der prominenteste Ansatz der gestaltungsorientierten WI: ein Forschungsansatz zur Entwicklung und Validierung wissenschaftlich fundierten Gestaltungswissens. Gestaltungswissen ist instrumentelles Wissen und gibt Orientierung, wie ein Ziel erreicht werden kann. Im Zentrum stehen Mittel-Zweck-Beziehungen statt der Ursache-Wirkungs-Beziehungen erklärender Forschung. Alan Hevner führte DSR-Guidelines für Informationssysteme ein. Das Prinzip: mögliche Lösungsideen (Design als Optimierungsproblem) für relevante Probleme, vor allem in Organisationen und Verwaltung, mit wissenschaftlichen Methoden entwickeln und zwingend validieren. DSR entwickelt sich weiter und wird auch außerhalb der WI anerkannt, etwa als "Management als Design" in der BWL oder "Engineering als Design".

### Das DSR-Framework

![[pictures/forschungsmethoden/05/Lecture05_Pg013_Das_Dsr_Framework.png]]

<p class="image-caption">Das DSR-Framework mit Relevance, Design und Rigor Cycle (Hevner u. a. 2004).</p>

Hevner u. a. (2004) stellen die IS-Forschung zwischen Umgebung und Wissensbasis:

- **Umgebung (Problemraum)**: Menschen (Rollen, Fähigkeiten, Charakteristika), Organisationen (Strategien, Struktur und Kultur, Prozesse) und Technologie (Infrastruktur, Anwendungen, Kommunikationsarchitektur). Sie liefert die Business Needs und sorgt für Relevanz.
- **Forschung (Lösungsraum)**: Theorien und Artefakte gestalten, dann evaluieren und validieren (analytisch, Fallstudie, Experiment, Feldstudie, Simulation, Workshop).
- **Wissensbasis**: Grundlagen (Theorien, Frameworks, Instrumente, Konstrukte, Modelle, Methoden, Instanziierungen) und Methoden (Datenanalyse, Formalismen, Validierungskriterien). Sie liefert anwendbares Wissen und sorgt für Rigor.

DSR läuft zyklisch: Der Relevance Cycle bringt Anforderungen aus der Umgebung und testet im Feld, der Design Cycle wechselt zwischen Bauen und Evaluieren, und der Rigor Cycle fundiert die Arbeit und erweitert die Wissensbasis.

### Vorgehensmodell nach Peffers u. a. (2007)

![[pictures/forschungsmethoden/05/Lecture05_Pg014_Vorgehensmodell_Nach_Peffers_U_A_2007.png]]

<p class="image-caption">Das Vorgehensmodell nach Peffers u. a. (2007) mit Einstiegspunkten.</p>

1. **Problem und Motivation identifizieren**: das Problem definieren und seine Relevanz zeigen.
2. **Ziele einer Lösung definieren**: Was erreicht ein verbessertes Artefakt?
3. **Design und Entwicklung**: das Artefakt gestalten.
4. **Demonstration**: einen Anwendungskontext finden und das Artefakt zur Problemlösung nutzen.
5. **Evaluation**: beobachten, wie effektiv und effizient die Lösung ist, und das Design gegebenenfalls anpassen.
6. **Kommunikation**: wissenschaftliche Publikationen (Paper) und Praxispublikationen (Whitepaper).

Der Prozess iteriert, und es gibt vier Einstiegspunkte: problemzentriert, zielzentriert, design- und entwicklungszentriert sowie kunden-, stakeholder- oder kontextorientiert. Die flexiblen Einstiegspunkte sind ein wichtiger Vorteil.

### Evaluationskriterien für Artefakte

![[pictures/forschungsmethoden/05/Lecture05_Pg015_Evaluationskriterien_F_R_Artefakte.png]]

<p class="image-caption">Kriterien zur Wiederverwendbarkeit von DSR-Artefakten (Iivari u. a. 2018).</p>

Iivari u. a. (2018) bewerten die Wiederverwendbarkeit von DSR-Artefakten, insbesondere von Gestaltungsprinzipien, mit fünf Kriterien: Accessibility, Importance, Novelty, Actability und Effectiveness. Mit Experten aus Forschung und Praxis lassen sich Artefakte so qualitativ validieren, um ihren Nutzen nachzuweisen und sie zugleich zu verbessern.

## 5. Wissenschaftliche Gestaltungsempfehlungen

### Elemente praxeologischer Aussagen

![[pictures/forschungsmethoden/05/Lecture05_Pg017_Elemente_Praxeologischer_Aussagen.png]]

<p class="image-caption">Gestaltungsparameter, -bedingungen, -wirkungen und -ziele (Kubicek 1975, Herzwurm 2000).</p>

Der Bezugsrahmen nach Kubicek (1975) und Herzwurm (2000) verbindet vier Elemente: Gestaltungsparameter (Gestaltungsmaßnahmen) führen zu Wirkungen, die einen Beitrag zur Erfüllung der Gestaltungsziele leisten. Gestaltungsbedingungen (Restriktionen) beeinflussen die Wirkungen und stellen Anforderungen an die Maßnahmen. Die Ziele bieten die Bewertungsgrundlage für die Auswahl der Maßnahmen.

### Ebenen der Koevolution

![[pictures/forschungsmethoden/05/Lecture05_Pg018_Ebenen_Der_Koevolution.png]]

<p class="image-caption">Umwelt, Netzwerkstrukturen und Einzelorganisationen über die Zeit (Hoffmann 2010).</p>

Hoffmann (2010) zeigt, dass sich Umwelt (institutionell, technologisch, wettbewerblich), Netzwerkstrukturen und Einzelorganisationen über die Zeit gegenseitig beeinflussen. Gestaltungsempfehlungen müssen diese Ebenen berücksichtigen.

### Stuttgarter Bezugsrahmen zur situativen Gestaltung

![[pictures/forschungsmethoden/05/Lecture05_Pg019_Stuttgarter_Bezugsrahmen_Zur_Situativen_Gestaltung.png]]

<p class="image-caption">Der Stuttgarter Bezugsrahmen mit IuK-Systemen im Zentrum.</p>

Der Stuttgarter Bezugsrahmen stellt IuK-Systeme ins Zentrum eines Netzes aus Controlling, Organisation, Marketing, Kultur, Kompetenzen und Supply-Chain-Management. Er ist eingebettet in Unternehmen, Netzwerk und Markt, gekennzeichnet durch Komplexität, Dynamik und Fit, und wirkt auf den Geschäftsmodellerfolg (wirtschaftlicher Erfolg, Potenzialerfolg, Markterfolg). Neben solchen inhaltlichen gibt es auch methodische Bezugsrahmen.

### Checkliste für Gestaltungsempfehlungen

![[pictures/forschungsmethoden/05/Lecture05_Pg020_Checkliste_F_R_Gestaltungsempfehlungen.png]]

<p class="image-caption">Checkliste für Gestaltungsempfehlungen (Wache u. a. 2022).</p>

Wache u. a. (2022) geben fünf Hinweise:

1. **Reuse**: vorhandene Empfehlungen der Artefaktklasse und benachbarter Klassen prüfen, um sie anzupassen oder zu begründen, warum neue Prinzipien nötig sind.
2. **Einzigartigkeit**: die domänenspezifischen Merkmale der Prinzipien herausarbeiten, um zu prüfen, ob sie übertragbar sind.
3. **Abstraktion**: prüfen, ob sich das Wissen auch auf höheren Klassen von Artefakten auszahlt.
4. **De-Abstraktion**: prüfen, ob es sich auf niedrigeren Klassen auszahlt.
5. **Kontextualisierung**: das Ziel der Empfehlungen kontextualisieren, um ihre Wirkung in einer bestimmten Situation zu zeigen.

## 6. Method Engineering

![[pictures/forschungsmethoden/05/Lecture05_Pg022_Method_Engineering.png]]

<p class="image-caption">Methoden als DSR-Artefakt.</p>

Methoden sind ein mögliches DSR-Artefakt. Method Engineering (ME) befasst sich traditionell mit Design, Konstruktion und Anpassung von Methoden für die IS-Entwicklung durch Engineering-Praktiken. Es ist eine Metamethode, die den Erstellungsprozess leitet und bei Auswahl und Integration von Methodenbestandteilen hilft (Brinkkemper 1996). Eine neue Methode kann durch Anpassung einer bestehenden entstehen (Method Tailoring), was meist bevorzugt wird, weil man erforschten Nutzen und gesammeltes Wissen wiederverwendet. Situational Method Engineering reagiert flexibel auf sich ändernde Anforderungen und Kontexte, während klassisches ME zu Standardisierung und Starrheit neigt. Tailoring und Situational ME sind sich sehr ähnlich und werden in der Literatur nicht immer streng getrennt (Harmsen 1996, Trepper 2015).

### Konfigurationsprozess

![[pictures/forschungsmethoden/05/Lecture05_Pg023_Konfigurationsprozess.png]]

<p class="image-caption">Der Konfigurationsprozess des Method Engineering.</p>

Das Projektumfeld wird charakterisiert, passende Methodenfragmente werden aus einer Methodenbasis (Methoden, Techniken, Tools) ausgewählt und zu einer situativen Methode zusammengesetzt. Die Projektperformanz fließt als Erfahrung zurück. Die Methodenadministration validiert, nimmt Wünsche nach neuen Fragmenten oder Anpassungen auf und pflegt die Basis. Das entspricht dem Bezugsrahmen aus Gestaltungsparametern, -bedingungen und -wirkungen mit iterativem Lernen (Kubicek 1975, Brinkkemper 1996, Trepper 2015).

### DSR und Situational Method Engineering

![[pictures/forschungsmethoden/05/Lecture05_Pg024_Dsr_Und_Situational_Method_Engineering.png]]

<p class="image-caption">Zusammenspiel von DSR und Situational Method Engineering am Beispiel IoT in der Landwirtschaft.</p>

Beide lassen sich verbinden: DSR liefert Relevance, Design und Rigor Cycle, Situational ME die Charakterisierung von Situationen, die Auswahl und Zusammenführung von Methodenfragmenten und die Methodenadministration. Im Beispiel IoT in der Landwirtschaft sind die Situationsfaktoren Teamgröße und Verteilung, die IoT-Methodik, vorhandene IoT-Geräte und Multi-Methoden-Komplexität in KMU. Methodenfragmente sind etwa ein IoT Canvas, eine Systemanforderungsspezifikation und User Stories, die Fälle ein kleines Farmsystem und ein großes integriertes Farmsystem. Die Administration empfiehlt für bestimmte Ausprägungen von Situationsfaktoren bestimmte Fragmente.

### WIUS-Bezugsrahmen für umfassende methodische Ansätze

![[pictures/forschungsmethoden/05/Lecture05_Pg025_Wius_Bezugsrahmen_F_R_Umfassende_Methodische.png]]

<p class="image-caption">Methode, Rollen, Softwaretool, Qualität und Situation.</p>

Ein umfassender methodischer Ansatz beantwortet fünf Fragen: Wie wird die Methode durchgeführt (Aktivitäten und Techniken)? Wer ist beteiligt (Rollen)? Womit wird sie informationstechnisch unterstützt (Softwaretool)? Wodurch werden Prozess- und Ergebnisqualität gesichert (Qualität)? Wo wird sie eingesetzt (Situation)?

### Forschungsprojekte am WIUS

![[pictures/forschungsmethoden/05/Lecture05_Pg026_Forschungsprojekte_Am_Wius.png]]

<p class="image-caption">Forschungsprojekte am WIUS.</p>

Die Projekte reichen von agilen Prozessmodellen in multidisziplinärer Produktentwicklung, neuen Wertversprechen im Software-intensive Business und softwareunterstützter Product-Backlog-Priorisierung in Scrum über IT-Unterstützung für Kreislauf-Wertschöpfungssysteme und das Management der Zufriedenheit von Partnern über Boundary Resources im IIoT bis zu Vertrauen im Cloud Manufacturing, wandlungsfähiger IT in der Brennstoffzellenfertigung und Guidelines für digitalisierte Produkte und Services mit QFD.

### Beispielprojekt: Product-Backlog-Priorisierung in Scrum

![[pictures/forschungsmethoden/05/Lecture05_Pg027_Beispielprojekt_Product_Backlog_Priorisierung_In_Scrum.png]]

<p class="image-caption">Das Projekt zur agilen Anforderungspriorisierung in verteilten Scrum-Projekten (Modell 2022).</p>

![[pictures/forschungsmethoden/05/Lecture05_Pg028_Beispielprojekt_Product_Backlog_Priorisierung_In_Scrum.png]]

<p class="image-caption">Problem und Bedarf: der Product Owner als Flaschenhals.</p>

Modell (2022) entwickelt einen wissenschaftlich begründeten, evaluierten methodischen Ansatz zur Anforderungspriorisierung in verteilten Scrum-Projekten. Das Problem: In Scrum vertritt nur der Product Owner die Stakeholder und pflegt das Product Backlog, meist mit User Stories. Durch viele, divergierende Stakeholder und Anforderungen, verschiedene Priorisierungstechniken und -kriterien und unterschiedliche Wertdefinitionen wird er zum Flaschenhals, die Ergebnisse sind intransparent und subjektiv, und eine laufende Repriorisierung ist in verteilten Projekten kaum machbar.

Das Projekt hat zwei Teilziele: ein konzeptuelles Modell zur agilen Anforderungspriorisierung mit Priorisierungs-, Rollen-, Situations-, Tool- und Qualitätsmodell (nach dem WIUS-Bezugsrahmen) und dessen praktische Evaluation durch Instanziierung als Softwareprototyp. Die Arbeitspakete reichen von der Problemidentifikation über die Entwicklung des Modells und den Prototyp bis zur Erhebung und Auswertung von Evaluationsdaten, begleitet von laufender Kommunikation und Reflexion.

## 7. Evaluation in der Wirtschaftsinformatik

![[pictures/forschungsmethoden/05/Lecture05_Pg030_Evaluation_In_Der_Wirtschaftsinformatik.png]]

<p class="image-caption">Was ist eine wissenschaftliche Evaluation?</p>

Allgemein ist Evaluation die Prüfung einer Theorie an Daten, also ein Hypothesentest. Sie soll nachweisen, dass ein Realweltausschnitt möglichst objektiv interpretiert wurde. In der gestaltungsorientierten WI weist die Evaluation zusätzlich nach, dass das Artefakt nützlich ist, also ob das Erreichen der Ziele einen Wert außerhalb der Entwicklungsumgebung hat. Bewertet wird nach Gültigkeit, Nutzen, Qualität und Wirksamkeit. Validität heißt, dass das Artefakt funktioniert, tut, was es soll, und im Betrieb verlässlich ist (Riege u. a. 2009, Gregor und Hevner 2013).

### Evaluationsmethoden

![[pictures/forschungsmethoden/05/Lecture05_Pg031_Evaluationsmethoden.png]]

<p class="image-caption">Übersicht der Evaluationsmethoden (Peffers u. a. 2012).</p>

| Methode                     | Beschreibung                                                                                                     |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| Logische Argumente          | Ein Argument mit Augenscheinvalidität                                                                            |
| Expertenevaluation          | Bewertung durch einen oder mehrere Experten, etwa per Delphi-Studie oder Workshop nach Gruppendelphi-Prinzipien  |
| Technische Experimente      | Leistungsbewertung einer Implementierung mit realen, synthetischen oder ohne Daten, technisch statt realweltlich |
| Subjektbezogene Experimente | Test mit Probanden, ob eine Behauptung zutrifft                                                                  |
| Aktionsforschung            | Einsatz in einer realen Situation als Forschungsintervention mit Bewertung der Wirkung                           |
| Prototyp                    | Implementierung, um Nützlichkeit oder Eignung zu demonstrieren                                                   |
| Konformative Fallstudie     | Anwendung in einer realen Situation mit Bewertung der Auswirkungen                                               |
| Szenario                    | Anwendung auf eine künstliche oder reale Situation, um Eignung oder Nutzen zu veranschaulichen                   |

(Peffers u. a. 2012)

Alle Belege für den Wert des Artefakts gehören in die Arbeit, Rohdaten gegebenenfalls in den Anhang. Bei der Evaluationstiefe gibt es Spielraum: Bei sehr neuartigen Artefakten kann ein Proof of Concept reichen, und wenn viel Aufwand in die Entwicklung fließt, kann die Evaluation nicht so umfassend sein wie in einem verhaltenswissenschaftlichen Projekt.

## 8. Prototyping

![[pictures/forschungsmethoden/05/Lecture05_Pg032_Prototyping.png]]

<p class="image-caption">Prototyping nach Budde u. a. (1992) und der Lean-Startup-Zyklus.</p>

![[pictures/forschungsmethoden/05/Lecture05_Pg033_Prototyping.png]]

<p class="image-caption">Beispiele für Prototypen in der Softwareentwicklung.</p>

"Prototyping is an approach based on an evolutionary view of software development and having an impact on the development process as a whole. Prototyping involves producing early working versions ('prototypes') of the future application system and experimenting with them" (Budde u. a. 1992). Funktionsfähige Versionen entstehen früh, Probleme werden durch Experimentieren geklärt, Prototypen sind eine gemeinsame Diskussionsbasis für Entwickler, Nutzer und andere Gruppen, und oft instanziieren sie ein übergeordnetes Artefakt wie ein Modell oder eine Methode. Dazu passt der Lean-Startup-Zyklus Build, Measure, Learn (Ries 2011). Prototypen reichen von Papierskizzen über Mockups bis zu klickbaren Oberflächen.

### Klassifikation von Prototypen

![[pictures/forschungsmethoden/05/Lecture05_Pg034_Klassifikation_Von_Prototypen.png]]

<p class="image-caption">Horizontaler und vertikaler Prototyp, Vollsystem und MVP.</p>

- **Horizontaler Prototyp**: deckt einzelne Architekturschichten ab, etwa die Benutzeroberfläche.
- **Vertikaler Prototyp**: deckt alle Schichten für einzelne Funktionen ab.
- **Vollsystem**: deckt alle Funktionen ab, ist aber kein Produktivsystem.
- **Minimum Viable Product**: das kleinste praktikabel anwendbare Produkt.

### Ergebnistyp oder Evaluationsmethode?

![[pictures/forschungsmethoden/05/Lecture05_Pg035_Ergebnistyp_Oder_Evaluationsmethode.png]]

<p class="image-caption">Prototypen als Ergebnistyp oder als Evaluationsmethode.</p>

Im Vorgehensmodell von Peffers u. a. (2007) kann ein Prototyp ein eigenständiger Ergebnistyp sein oder eine Evaluationsmethode. Im Methodenprofil von Wilde und Hess (2007) ist Prototyping eine der Forschungsmethoden mit Gestaltungsfokus.

### Evaluation mit Prototypen

![[pictures/forschungsmethoden/05/Lecture05_Pg036_Evaluation_Mit_Prototypen.png]]

<p class="image-caption">Wozu die Evaluation mit Prototypen dient.</p>

Ein Prototyp weist nach, dass das Artefakt in einer bestimmten Umgebung (Unternehmen oder Labor) praktisch umsetzbar ist. Er ermöglicht eine Evaluation gegen die Realwelt mit Feedback potenzieller Nutzer, dient der Illustration und Kommunikation (wie wird das Artefakt genutzt und in die Systemlandschaft integriert?), stellt sicher, dass ein Modell oder eine Methode als Software technisch realisierbar ist, und erlaubt, Gestaltungsempfehlungen gezielt an Nutzern zu testen (Frank 2006, Riege u. a. 2009).

### Proof-of-\* Evaluation

![[pictures/forschungsmethoden/05/Lecture05_Pg037_Proof_Of_Evaluation.png]]

<p class="image-caption">Proof of Concept, Proof of Value und Proof of Use (Nunamaker u. a. 2015).</p>

Nunamaker u. a. (2015) unterscheiden drei Stufen: Proof of Concept (eher ein vertikaler oder horizontaler Prototyp), Proof of Value (eher ein Minimum Viable Product) und Proof of Use (eher ein Vollsystem im realen Einsatz). Die ersten beiden sind im Zeitrahmen eines klassischen Forschungsprojekts umsetzbar.

## 9. Evaluation mit Fokusgruppen, Gruppen-Delphi und Thinking Aloud

![[pictures/forschungsmethoden/05/Lecture05_Pg038_Evaluation_Mit_Fokusgruppen_Gruppen_Delphi_Und.png]]

<p class="image-caption">Evaluation mit Fokusgruppen und Expertenworkshops.</p>

![[pictures/forschungsmethoden/05/Lecture05_Pg040_Evaluation_Mit_Fokusgruppen_Gruppen_Delphi_Und.png]]

<p class="image-caption">Gruppen-Delphi zur Strukturierung von Workshops.</p>

![[pictures/forschungsmethoden/05/Lecture05_Pg041_Evaluation_Mit_Fokusgruppen_Gruppen_Delphi_Und.png]]

<p class="image-caption">Thinking-Aloud-Tests.</p>

In Expertenworkshops stellen Forschende einen Prototyp vor, und Experten diskutieren aus Praxis- und Domänensicht seinen Nutzen: Relevanz, Einordnung der Ergebnisse, Vertrauen in die Anwendung, erfolgte Umsetzung oder Umsetzungsrestriktionen, Vollständigkeit und Verständlichkeit. Das ist eine Proof-of-Value-Evaluation, die das Stimmungsbild der Praxis einfängt. Der Workshopablauf (Artefakt vorstellen, Verständnisfragen klären, Prototyp vorstellen, fragebogengestützt bewerten, überarbeiten), das Gruppen-Delphi mit rotierenden Kleingruppen und Plenum und der Thinking-Aloud-Test mit lautem Denken auf drei Leveln funktionieren wie in [[/notes/lectures/forschungsmethoden/04-qualitative-forschung|(y-04) Qualitative Forschung]] beschrieben, hier mit dem Ziel, das Artefakt zu validieren und zu verbessern.

## Zusammenfassung

- Die gestaltungsorientierte WI erzeugt Gestaltungswissen über Mittel-Zweck-Beziehungen. Artefakte müssen abstrakt, originell, begründet und nützlich sein.
- DSR verbindet Umgebung und Wissensbasis über Relevance, Design und Rigor Cycle. Peffers u. a. geben sechs Schritte mit flexiblen Einstiegspunkten vor.
- Gestaltungsempfehlungen verknüpfen Parameter, Bedingungen, Wirkungen und Ziele. Method Engineering setzt Methoden situativ aus Fragmenten zusammen und beantwortet Wie, Wer, Womit, Wodurch und Wo.
- Evaluation weist den Nutzen nach, von logischen Argumenten bis zu Prototypen und Fallstudien. Prototypen liefern Proof of Concept, Proof of Value oder Proof of Use.

## Selbsttest

1. Welche vier Prinzipien fordert das Memorandum zur gestaltungsorientierten WI?

> [!success]- Antwort
> Abstraktion (auf eine Klasse von Problemen anwendbar), Originalität (innovativer Beitrag zum Wissensstand), Begründung (nachvollziehbar begründet und validierbar) und Nutzen (heute oder künftig nützlich für die Anspruchsgruppen).

2. Was unterscheidet Gestaltungswissen von erklärendem Wissen?

> [!success]- Antwort
> Gestaltungswissen ist instrumentell und beschreibt Mittel-Zweck-Beziehungen: wie man ein Ziel erreicht. Erklärende Forschung beschreibt Ursache-Wirkungs-Beziehungen: warum etwas geschieht.

3. Erklären Sie die drei Zyklen im DSR-Framework nach Hevner.

> [!success]- Antwort
> Der Relevance Cycle verbindet die Forschung mit der Umgebung (Menschen, Organisationen, Technologie), bringt Anforderungen ein und testet im Feld. Der Design Cycle wechselt zwischen Bauen und Evaluieren des Artefakts. Der Rigor Cycle verbindet die Forschung mit der Wissensbasis, fundiert sie mit Theorien und Methoden und erweitert die Wissensbasis um die Ergebnisse.

4. Nennen Sie die sechs Schritte nach Peffers u. a. und die Einstiegspunkte.

> [!success]- Antwort
> Problem und Motivation identifizieren, Ziele einer Lösung definieren, Design und Entwicklung, Demonstration, Evaluation, Kommunikation. Einstiegspunkte sind problemzentriert, zielzentriert, design- und entwicklungszentriert sowie kunden-, stakeholder- oder kontextorientiert.

5. Aus welchen Elementen besteht eine wissenschaftliche Gestaltungsempfehlung?

> [!success]- Antwort
> Gestaltungsparameter (Maßnahmen) führen zu Wirkungen, die zur Erfüllung von Gestaltungszielen beitragen. Gestaltungsbedingungen (Restriktionen) beeinflussen die Wirkungen und stellen Anforderungen an die Maßnahmen, und die Ziele sind die Bewertungsgrundlage für die Auswahl der Maßnahmen (Kubicek 1975, Herzwurm 2000).

6. Was ist Situational Method Engineering, und warum bevorzugt man Tailoring gegenüber einer Neuentwicklung?

> [!success]- Antwort
> Eine Form des Method Engineering, die eine Methode passend zur Projektsituation aus Fragmenten einer Methodenbasis zusammensetzt und so flexibel auf wechselnde Anforderungen reagiert. Tailoring passt eine bestehende Methode an. Es wird bevorzugt, weil man erforschten Nutzen und gesammeltes Wissen wiederverwendet.

7. Welche fünf Fragen beantwortet ein umfassender methodischer Ansatz nach dem WIUS-Bezugsrahmen?

> [!success]- Antwort
> Wie wird die Methode durchgeführt (Aktivitäten und Techniken)? Wer ist beteiligt (Rollen)? Womit wird sie unterstützt (Softwaretool)? Wodurch wird Qualität gesichert (Qualität)? Wo wird sie eingesetzt (Situation)?

8. Was soll eine Evaluation in der gestaltungsorientierten WI nachweisen, und welche Methoden gibt es?

> [!success]- Antwort
> Dass das Artefakt nützlich ist, also einen Wert außerhalb der Entwicklungsumgebung hat, und dass es gültig, wirksam und verlässlich ist. Methoden sind logische Argumente, Expertenevaluation, technische und subjektbezogene Experimente, Aktionsforschung, Prototypen, konformative Fallstudien und Szenarien.

9. Unterscheiden Sie horizontale und vertikale Prototypen und die Proof-of-\* Stufen.

> [!success]- Antwort
> Ein horizontaler Prototyp deckt einzelne Architekturschichten ab (etwa die UI), ein vertikaler alle Schichten für einzelne Funktionen. Proof of Concept zeigt Machbarkeit (eher vertikaler oder horizontaler Prototyp), Proof of Value zeigt Nutzen (eher MVP), Proof of Use zeigt den Einsatz in der Realumgebung (eher Vollsystem). Die ersten beiden sind im Zeitrahmen eines Forschungsprojekts umsetzbar.

---

[[/notes/lectures/forschungsmethoden/index|Zurück zum Forschungsmethoden-Index]] | [[/notes/lectures/forschungsmethoden/04-qualitative-forschung|Zurück: (y-04) Qualitative Forschung]]
