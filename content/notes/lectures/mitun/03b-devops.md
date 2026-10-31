---
title: "L03b - DevOps zur Umsetzung software-intensiver Geschäftsmodelle"
tags:
  - mitun
  - devops
  - continuous-delivery
  - wertschoepfungskette
  - workshop
date: 2026-10-31
---

[[/notes/lectures/mitun/index|Zurück zum MITUN-Index]] | [[/notes/lectures/mitun/03-geschaeftsmodell|Zurück: (y-03) Geschäftsmodell]] | [[/notes/lectures/mitun/04-team-und-fuehrung|Weiter: (y-04) Team und Führung]]

> [!note] Foliengrundlage
> Kapitel 3.3 ist ein Workshop der OMM Solutions GmbH (Stuttgart), gehalten von Andreas Enenkel. Diese Notiz basiert auf dem Foliensatz aus dem Wintersemester 2025/26 (Stand 11/2025). Sobald die Folien für 2026/27 vorliegen, wird sie daran angepasst.

## Mentales Modell

- DevOps verbindet Entwicklung (Dev) und Betrieb (Ops) über die ganze Wertschöpfung von Plan bis Operate. Es ist ein organisatorischer Wandel mit dem Ziel, Kunden schneller Wert zu liefern.
- Wert entsteht nur, wenn drei Dimensionen zusammenpassen: Das Ergebnis trifft die Kundenanforderungen (agile Entwicklung), der Kunde bekommt die neueste stabile Version schnell (Continuous Delivery), und die Software erfüllt Qualitätsanforderungen und läuft auf der Infrastruktur (Betrieb).
- Wie beim Eisberg sieht man oben Methoden und Tools (CI/CD, Container, Infrastructure as Code). Darunter liegen Strukturen und Prinzipien und ganz unten Werte und Mindset.
- Die konkrete Ausgestaltung hängt vom Geschäftsmodell ab, die Prinzipien nicht. Wer digitale Produkte anbietet, braucht DevOps, um überhaupt skalieren zu können.
- Der Workshop arbeitet erfahrungsbasiert: Ein Bauspiel ohne DevOps-Prinzipien, dann Theorie, dann ein zweiter Durchlauf mit den Prinzipien und zuletzt die Toolkette bei OMM.

## 1. Lernziele und Ablauf

![[pictures/mitun/03b/Lecture03b_Pg012_Lernziele_Und_Ablauf.png]]

<p class="image-caption">Lernziele des Workshops.</p>

Nach dem Workshop sollen Studierende Ziele und Prinzipien von DevOps erläutern, die Bedeutung für die Wertschöpfungsketten in IT-Unternehmen diskutieren, Relevanz und Eignung von DevOps-Tools entlang dieser Ketten bewerten und ihre Anwendung an Beispielen beurteilen können. Das Motto lautet "viel machen, etwas diskutieren, wenig zuhören": Hands-on-Teil, Theorie, zweiter Hands-on-Teil und DevOps in der Praxis bei OMM.

### Begriffe rund um DevOps

![[pictures/mitun/03b/Lecture03b_Pg013_Begriffe_Rund_Um_Devops.png]]

<p class="image-caption">Tools, Methoden und Konzepte, die mit DevOps verbunden werden.</p>

Mit DevOps werden viele Begriffe verbunden: Continuous Integration (CI), Continuous Delivery (CD), Continuous Deployment, Infrastructure as Code, agile Entwicklung, Automatisierung, Containerisierung, Microservices, Kollaboration, Shared Responsibility, Feedback Loops, Versionskontrolle und Pipelines. Sie verteilen sich über die Wertschöpfungskette plan, code, build, integrate, test, release, deploy und operate (Halstenberg u. a. 2020).

## 2. Hands-on Teil 1: Wir bauen einen Uni-Campus

![[pictures/mitun/03b/Lecture03b_Pg016_Hands_On_Teil_1_Wir_Bauen.png]]

<p class="image-caption">Arbeitsanweisung für das Bauspiel.</p>

OMM tritt als Auftraggeber auf, jedes Team ist Auftragnehmer und soll einen neuen Uni-Campus bauen. Ein Team besteht aus zwei Gruppen mit höchstens vier Personen: Abteilung 1 entwirft und konstruiert die Gebäude, Abteilung 2 stellt sie auf und verbindet sie. Das Konzept ist modular, Gebäude lassen sich getrennt bauen und einzeln ausliefern. Die Teams holen Material und Anforderungen ab, Ziel ist, die Anforderungen zu erfüllen. Abteilung 1 entspricht der Entwicklung, Abteilung 2 dem Betrieb.

![[pictures/mitun/03b/Lecture03b_Pg018_Hands_On_Teil_1_Wir_Bauen.png]]

<p class="image-caption">Reflexionsfragen nach dem ersten Durchlauf.</p>

In der ersten Reflexion bewerten die Teams ihre Zielerreichung und sammeln, was funktioniert hat und was nicht.

## 3. DevOps-Theorie

### Organisatorischer Wandel

![[pictures/mitun/03b/Lecture03b_Pg020_Organisatorischer_Wandel.png]]

<p class="image-caption">DevOps als organisatorischer Wandel (Alt u. a. 2017, Ebert u. a. 2016).</p>

Ebert u. a. (2016) definieren DevOps als Integration von Entwicklung und Betrieb durch automatisierte Entwicklung, Auslieferung und Infrastrukturüberwachung. Statt getrennter Silos arbeiten funktionsübergreifende Teams an kontinuierlichen Feature-Lieferungen, was Wert schneller liefert und Probleme durch Missverständnisse zwischen Teammitgliedern reduziert. Das Modell von Alt u. a. (2017) setzt Kunde und Nutzer an die Spitze eines Dreiecks mit Entwicklung und Betrieb. Agile Entwicklung verbindet Kunde und Entwicklung, Continuous Delivery Kunde und Betrieb, Continuous Integration und Testing Entwicklung und Betrieb. In der Mitte steht die Delivery Pipeline mit Culture, Automation, Measurement und Sharing.

### DevOps über die gesamte Wertschöpfung

![[pictures/mitun/03b/Lecture03b_Pg021_Devops_Ber_Die_Gesamte_Wertsch_Pfung.png]]

<p class="image-caption">Reichweite von agiler Entwicklung, CI, Continuous Delivery, Continuous Deployment und DevOps (Halstenberg u. a. 2020).</p>

Die Ansätze decken unterschiedlich viel der Kette ab. Agile Entwicklung reicht von plan bis code, Continuous Integration bis integrate, Continuous Delivery über test bis zum Release, Continuous Deployment zusätzlich bis deploy. Nur DevOps umfasst alles bis operate und bezieht Entwicklung, Kunde und Betrieb ein. Das Bauspiel bildet einen Großteil dieser Kette ab.

### Ziele

![[pictures/mitun/03b/Lecture03b_Pg022_Ziele.png]]

<p class="image-caption">Ziele von DevOps.</p>

| Ziel                            | Wie DevOps es erreicht                                                                                              |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------ |
| Schnellere Bereitstellung       | Automatisierte und integrierte Entwicklungs- und Betriebsprozesse verkürzen Release-Zyklen                          |
| Schnelleres Feedback            | Continuous Feedback lässt Kunden- und Nutzerfeedback rasch in die Entwicklung einfließen                            |
| Bessere Zusammenarbeit          | Dev und Ops arbeiten zusammen statt in Silos und verstehen die Anforderungen der anderen Seite                      |
| Höhere Qualität und Stabilität  | CI und CD finden Fehler, bevor sie in Produktion gelangen, automatisierte Tests und Monitoring sichern die Qualität |
| Automatisierung und Effizienz   | Wiederkehrende Aufgaben werden automatisiert, das reduziert menschliche Fehler und entlastet die Teams              |
| Skalierbarkeit und Flexibilität | Ressourcen lassen sich nach Bedarf schnell skalieren, neue Technologien leichter integrieren                        |
| Kostenreduktion                 | Weniger Fehler, schnellere Auslieferung und effizientere Arbeit sparen langfristig Arbeitsstunden und Ressourcen    |

### Prinzipien

![[pictures/mitun/03b/Lecture03b_Pg023_Prinzipien.png]]

<p class="image-caption">Prinzipien von DevOps und die Eisberg-Metapher.</p>

Die Prinzipien sind Kollaboration und Integration, Automatisierung, Feedback-Schleifen und Kundenzentrierung, eine Kultur der kontinuierlichen Verbesserung, Verantwortung und Ownership, kleinschrittige, iterative Änderungen und das Messen von KPIs über Monitoring und Logging. Die Eisberg-Metapher ordnet sie ein: Sichtbar sind Methoden und Tools, darunter liegen Strukturen und Prinzipien und ganz unten Werte und Mindset.

### Was DevOps nicht ist

![[pictures/mitun/03b/Lecture03b_Pg024_Was_Devops_Nicht_Ist.png]]

<p class="image-caption">Abgrenzung von DevOps (Halstenberg u. a. 2020, Kim u. a. 2016).</p>

Nach Halstenberg u. a. (2020) und Kim u. a. (2016) räumt die Folie mit verbreiteten Missverständnissen auf:

- DevOps ist kein Standard mit festem Wissensfundus, sondern "work in progress", das laufend neue Trends aufnimmt.
- Es ist weder nur ein kulturelles Umdenken noch nur Automatisierung, und die Einführung eines Tools reicht nicht.
- Es ist kein neues Vorgehensmodell und muss mit bestehenden, meist agilen Modellen integriert werden.
- Es verlangt nicht zwingend eine neue Organisationsstruktur oder die Auflösung bestehender Abteilungen wie IT-Operations.
- Es ist mit IT-Service-Management wie ITIL vereinbar und eignet sich auch für etablierte Unternehmen, nicht nur für Startups.

### Drei Dimensionen des Kundenwerts

![[pictures/mitun/03b/Lecture03b_Pg025_Drei_Dimensionen_Des_Kundenwerts.png]]

<p class="image-caption">Alle drei Dimensionen müssen erfüllt sein, damit für den Kunden zuverlässig Wert entsteht.</p>

Auf das Dreieck von Alt u. a. (2017) bezogen heißt das: Die agile Entwicklung stellt sicher, dass das Ergebnis zu den Kundenanforderungen passt. Continuous Delivery stellt sicher, dass der Kunde die neueste stabile Version zeitnah testen und nutzen kann. Der Betrieb stellt sicher, dass die Software die qualitativen Anforderungen erfüllt und auf der Infrastruktur läuft. Fehlt eine Dimension, entsteht kein verlässlicher Wert.

## 4. Hands-on Teil 2

![[pictures/mitun/03b/Lecture03b_Pg027_Hands_On_Teil_2.png]]

<p class="image-caption">Leitfragen für den zweiten Durchlauf.</p>

Vor dem zweiten Durchlauf diskutieren die Teams zehn Minuten die Prinzipien und notieren, was sie sich vornehmen und welches Problem aus dem ersten Teil sie damit angehen. Leitfragen: Wie und wann interagiert ihr mit dem Kunden? Wie arbeiten Abteilung 1 und 2 (Dev und Ops) zusammen? Wie verteilt ihr die verbleibenden Aufgaben? Startet ihr neu oder baut ihr auf dem bisherigen Stand auf? Nach dem Durchlauf präsentiert jede Gruppe in drei Minuten, ob die Anpassungen etwas verbessert haben.

## 5. DevOps in der Praxis

### Herausforderungen bei OMM

![[pictures/mitun/03b/Lecture03b_Pg031_Herausforderungen_Bei_Omm.png]]

<p class="image-caption">Herausforderungen aus dem Alltag von OMM.</p>

Die Herausforderungen stammen aus der Entwicklung von Individualsoftware, Produkten und Produkten mit Dienstleistungen: Übergaben der Verantwortung zwischen Entwicklungs- und Operationsteam, die Einbindung des Kunden in die Entwicklung, der Überblick über Anforderungen, Prioritäten und Deadlines, der Aufwand für regelmäßige Qualitätssicherung und Deployments und die Tatsache, dass Nutzerfeedback erst sinnvoll ist, wenn die Nutzer die Software tatsächlich verwenden.

### Bezug zu den Wertschöpfungsketten

![[pictures/mitun/03b/Lecture03b_Pg032_Bezug_Zu_Den_Wertsch_Pfungsketten.png]]

<p class="image-caption">Das Bauspiel entspricht der Wertschöpfungskette der IT-Projektdurchführung.</p>

Von den Wertschöpfungsketten aus [[/notes/lectures/mitun/03-geschaeftsmodell|Kapitel 3]] (IT-Standardprodukte, IT-Produkt plus Service, IT-Projektbegründung, IT-Projektdurchführung, IT-Systemservices) entsprach das Bauspiel der IT-Projektdurchführung, mit Projektinitiierung, Projektsteuerung, Qualitätssicherung, Projektabschluss und Erfahrungssicherung als primären Aktivitäten.

![[pictures/mitun/03b/Lecture03b_Pg033_Bezug_Zu_Den_Wertsch_Pfungsketten.png]]

<p class="image-caption">DevOps je nach Geschäftsmodell.</p>

Je nach Geschäftsmodell sieht DevOps anders aus, die Prinzipien bleiben dieselben. OMM ordnet sein eigenes digitales Produkt, einen Chatbot auf der Firmenwebsite, der Kette IT-Produkt plus Service zu. Als Anbieter digitaler Produkte braucht OMM DevOps, um überhaupt skalieren zu können.

### DevOps-Tools entlang der Wertschöpfung

Für jede Phase der Kette zeigt OMM die eigene Toolkette. In der Planung nutzt OMM Jira, Gemini und einen selbst entwickelten Sales Co-Pilot, der Projektanfragen strukturiert und Angebote vorbereitet (ohne Folienbild, weil es interne Werkzeuge zeigt).

![[pictures/mitun/03b/Lecture03b_Pg036_Devops_Tools_Entlang_Der_Wertsch_Pfung.png]]

<p class="image-caption">Code: KI-Assistenz in der Entwicklungsumgebung (GitHub Copilot).</p>

Beim Programmieren unterstützt ein KI-Assistent wie GitHub Copilot direkt in der Entwicklungsumgebung und erzeugt Komponenten nach Anweisung.

![[pictures/mitun/03b/Lecture03b_Pg037_Devops_Tools_Entlang_Der_Wertsch_Pfung.png]]

<p class="image-caption">Build bis Deploy: CI/CD-Pipeline in GitLab.</p>

Von build bis deploy läuft alles über GitLab-Pipelines mit Stufen für Module, Repository-Checks, Tests, Schwachstellen- und Lizenzscans, Build und Deployment. Im Schritt integrate und test kommt ein KI-Review hinzu: Gemini kommentiert Merge Requests in GitLab, bewertet Architektur und Abhängigkeiten, lobt gelungene Teile, markiert kritische Sicherheitsprobleme und vergibt eine Qualitätsnote (ohne Folienbild, weil es einen internen Merge Request zeigt).

![[pictures/mitun/03b/Lecture03b_Pg039_Devops_Tools_Entlang_Der_Wertsch_Pfung.png]]

<p class="image-caption">Release bis Operate: die Infrastruktur-Toolkette.</p>

Für release, deploy und operate kombiniert OMM mehrere Werkzeuge:

| Werkzeug              | Aufgabe                                                                                                          |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------- |
| GitLab                | Code und Versionierung, automatisch skalierende Runner, Container Registry (S3), Secrets (CI-Variablen und SOPS) |
| Harbor                | Registry für Helm-Charts                                                                                         |
| Rancher und Terraform | Konfiguration, Automatisierung und Orchestrierung, Plan und Ausführung, State Management (über GitLab in S3)     |
| Helm                  | Beschreibung und Installation der Deployments                                                                    |
| Kubernetes            | Orchestrierung der Infrastruktur, Monitoring, Auto-Scaling und Recovery, Routing und Load Balancing              |
| Logging-Stack         | Sammeln, Speichern, Überwachen und Analysieren von Logs                                                          |

## Zusammenfassung

- DevOps integriert Entwicklung und Betrieb über die ganze Kette von plan bis operate, als organisatorischen Wandel mit dem Ziel, Wert schneller zu liefern.
- Agile Entwicklung, CI, Continuous Delivery und Continuous Deployment decken jeweils nur einen Teil der Kette ab, DevOps die ganze.
- Ziele sind schnellere Releases und schnelleres Feedback, bessere Zusammenarbeit, höhere Qualität, Automatisierung, Skalierbarkeit und geringere Kosten.
- Prinzipien sind Kollaboration, Automatisierung, Feedback und Kundenzentrierung, kontinuierliche Verbesserung, Ownership, kleine iterative Schritte und Messen. Methoden und Tools sind nur die Spitze des Eisbergs.
- DevOps ist kein Standard, kein Vorgehensmodell und kein Tool und passt zu agilen Modellen, ITIL und etablierten Unternehmen.
- Kundenwert entsteht nur, wenn Anforderungen, schnelle Auslieferung und stabiler Betrieb zusammenkommen. Anbieter digitaler Produkte brauchen DevOps zum Skalieren.

## Selbsttest

1. Was ist DevOps, und welche Rollen verbindet es?

> [!success]- Antwort
> DevOps integriert Entwicklung und Betrieb durch automatisierte Entwicklung, Auslieferung und Infrastrukturüberwachung. Funktionsübergreifende Teams ersetzen getrennte Silos und liefern Features kontinuierlich. Es verbindet Entwicklung, Betrieb und Kunde und gilt als organisatorischer Wandel, der Wert schneller liefert (Ebert u. a. 2016).

2. Grenzen Sie agile Entwicklung, Continuous Integration, Continuous Delivery, Continuous Deployment und DevOps voneinander ab.

> [!success]- Antwort
> Sie decken unterschiedlich lange Abschnitte der Kette plan, code, build, integrate, test, release, deploy, operate ab. Agile Entwicklung umfasst Planung und Code, CI zusätzlich Build und Integration, Continuous Delivery reicht über den Test bis zum Release, Continuous Deployment bis zum automatischen Deployment. Nur DevOps schließt den Betrieb ein und bezieht Entwicklung, Kunde und Betrieb gemeinsam ein.

3. Nennen Sie vier Ziele von DevOps.

> [!success]- Antwort
> Schnellere Bereitstellung durch kürzere Release-Zyklen, schnelleres Feedback von Kunden und Nutzern, bessere Zusammenarbeit von Dev und Ops ohne Silos und höhere Qualität und Stabilität durch CI/CD, automatisierte Tests und Monitoring. Weitere sind Automatisierung, Skalierbarkeit und Kostenreduktion.

4. Was zeigt die Eisberg-Metapher?

> [!success]- Antwort
> Methoden und Tools wie CI/CD-Pipelines oder Container sind nur der sichtbare Teil. Darunter liegen Strukturen und Prinzipien (Kollaboration, Ownership, Feedback, kleine Schritte) und ganz unten Werte und Mindset. Ein Tool einzuführen reicht deshalb nicht.

5. Welche drei Dimensionen müssen erfüllt sein, damit für den Kunden Wert entsteht?

> [!success]- Antwort
> Das Entwicklungsergebnis passt zu den Kundenanforderungen (agile Entwicklung), der Kunde kann die neueste stabile Version zeitnah testen und nutzen (Continuous Delivery), und die Software erfüllt die Qualitätsanforderungen und läuft auf der Infrastruktur (Betrieb).

6. Warum hängt die Ausgestaltung von DevOps vom Geschäftsmodell ab?

> [!success]- Antwort
> Die Wertschöpfungsketten unterscheiden sich: Bei der IT-Projektdurchführung stehen Projektsteuerung und Abnahme im Vordergrund, bei IT-Produkt plus Service der laufende Betrieb und die Weiterentwicklung eines Produkts. Die Prinzipien bleiben gleich, aber Werkzeuge und Abläufe passen sich an. Anbieter digitaler Produkte brauchen DevOps, um überhaupt skalieren zu können.

---

[[/notes/lectures/mitun/index|Zurück zum MITUN-Index]] | [[/notes/lectures/mitun/03-geschaeftsmodell|Zurück: (y-03) Geschäftsmodell]] | [[/notes/lectures/mitun/04-team-und-fuehrung|Weiter: (y-04) Team und Führung]]
