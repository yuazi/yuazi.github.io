---
title: "L07 - Konzepte des Supply Chain Management II"
tags:
  - scm
  - supply-chain-management
  - scm-konzepte
  - efficient-consumer-response
  - vendor-managed-inventory
  - cpfr
date: 2026-11-28
---

[[/notes/lectures/supplychainmanagement/index|Zurück zum SCM-Index]] | [[/notes/lectures/supplychainmanagement/06-konzepte-des-scm-i|Zurück: (y-06) Konzepte des SCM I]] | [[/notes/lectures/supplychainmanagement/08-kontrollinstrumente|Weiter: (y-08) Kontrollinstrumente in der Supply Chain]]

## Mentales Modell

- Lerneinheit 07 setzt die Liste der 17 SCM-Konzepte aus [[/notes/lectures/supplychainmanagement/06-konzepte-des-scm-i|Lerneinheit 06]] fort. Diesmal geht es um die Konzepte zwischen Hersteller und Handel, also vor allem um die Distribution.
- Den Rahmen gibt Efficient Consumer Response (ECR). Das ECR-Haus hat eine Supply Side (Efficient Replenishment) und eine Demand Side (Sortiment, Promotions, Produkteinführung). Beide Seiten stehen auf Informations- und Kommunikationstechnologien wie EDI, ERP, APS, Barcode, RFID und Tracking & Tracing.
- Efficient Replenishment bündelt mehrere Einzelkonzepte: Cross Docking verteilt Ware fast ohne Lagerbestand um, und bei VMI plant der Lieferant die Bestände des Kunden. Bei der Konsignation bleibt die Ware Eigentum des Lieferanten, bis der Kunde sie abruft.
- CPFR gilt als "ECR der nächsten Generation": Hersteller und Handel planen, prognostizieren und bestellen gemeinsam und gleichen ihre Prognosen in einem neunstufigen Prozess ab.
- Am Ende vergleicht eine Tabelle nach Göpfert und Wellbrock (2012), wie gut jedes der 17 Konzepte fünf Ziele erreicht, von Endkundennutzen bis Flexibilität.

## Leitfragen

- Welche Konzepte werden im Supply Chain Management üblicherweise umgesetzt?
- Wie werden diese Konzepte umgesetzt und welche Effekte entstehen durch deren Anwendung?

## 1. Efficient Consumer Response (ECR)

![[pictures/supplychainmanagement/07/Lecture07_Pg002_Efficient_Consumer_Response.png]]

<p class="image-caption">Das ECR-Haus: Efficient Replenishment auf der Supply Side, Sortiment, Promotions und Produkteinführung auf der Demand Side, darunter IuK-Technologien und Planungssysteme (in Anlehnung an Sucky 2022, S. 311).</p>

ECR ist eine vertikale, unternehmensübergreifende Kooperation mit dem Ziel, effizient auf den Kunden zu reagieren. Sie richtet sich in zwei Richtungen aus: zum Endkunden (Demand Side) und zu den Lieferanten (Supply Side). ECR ist ein Strategiebündel aus drei Bausteinen (Werner 2017, S. 141 ff.; Wellbrock 2015, S. 137 ff.; Eßig et al. 2013, S. 59 ff.; Sucky 2022, S. 310 ff.):

| Baustein                         | Aufgabe                                                                    | Im ECR-Haus                                                                                             |
| :------------------------------- | :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| Logistikorientierte Komponenten  | einen möglichst effizienten Informations- und Materialfluss sicherstellen  | Supply Side: Efficient Replenishment (ER)                                                               |
| Marketingorientierte Komponenten | Endkundennutzen steigern, Wachstums- und Differenzierungsvorteile schaffen | Demand Side: Efficient Assortment (EA), Efficient Promotions (EP), Efficient Product Introduction (EPI) |
| Informationstechnologien         | Basis für ECR                                                              | Fundament: IuK-Technologien und Planungssysteme                                                         |

Die Vorlesung vertieft das Fundament (1) und die Supply Side (2). Die Demand Side ist auf der Folie ausgegraut.

## 2. Informations- und Kommunikationstechnologien und Planungssysteme

IuK-Technologien unterstützen die Koordination und Kommunikation in der Supply Chain sowie Entscheidungen und deren Ausführung. Die Folien nennen fünf Gruppen (Sucky 2022, S. 439 ff.; Werner 2017, S. 322 ff.).

### EDI und ERP

![[pictures/supplychainmanagement/07/Lecture07_Pg003_Edi_Und_Erp.png]]

<p class="image-caption">EDI tauscht Daten zwischen mindestens zwei Partnern aus, ERP steuert die internen Prozesse. Die Tabelle nennt die Schwächen klassischer ERP/MRP-Systeme im SCM-Kontext.</p>

1. Electronic Data Interchange (EDI) ist der elektronische Datenaustausch zwischen mindestens zwei Partnern, meist Lieferant und Abnehmer. Darüber laufen Abrufe, Gutschriften, Rechnungen, Transportdaten und Bestände, zum Beispiel in einer automatisierten Lagerhaltung. EDI ist teuer in der Anschaffung, Web-EDI ist eine günstigere Lösung.
2. Enterprise Resource Planning (ERP) steuert die unternehmenseigenen Prozesse in der Supply Chain operativ und automatisiert.

Klassische ERP/MRP-Systeme haben im SCM-Kontext sechs Schwächen: Probleme mit Datenqualität und Zeit, Defizite in der Optimierungsmethodik, einen eingeschränkten Planungsinhalt, eine unzureichende Berücksichtigung von Interdependenzen, wenig Flexibilität und kaum Möglichkeiten zur Simulation.

### Advanced Planning and Scheduling (APS)

![[pictures/supplychainmanagement/07/Lecture07_Pg004_Advanced_Planning_And_Scheduling.png]]

<p class="image-caption">APS liegt als Planungsschicht über dem ERP-System und deckt Beschaffung, Produktion, Distribution und Vertrieb ab (Steven und Krüger 2004, S. 179).</p>

3. APS-Systeme ergänzen das ERP-System. Lieferanten- und Kundeninformationen fließen direkt ins System, und der Informationsfluss läuft aufwärts und abwärts. Ihre Merkmale sind Kundenorientierung, Realitätsnähe bzw. Echtzeit, Geschwindigkeit und Flexibilität, Simultanität, die Integration von Daten und Informationen sowie Simulationsfähigkeit.

### Identifikation und Tracking & Tracing

![[pictures/supplychainmanagement/07/Lecture07_Pg005_Identifikation_Und_Tracking.png]]

<p class="image-caption">Aufbau der GTIN im Barcode, RFID entlang der Supply Chain und ein Tracking & Tracing über eine Blockchain.</p>

4. Identifikationstechnologien: Barcode bzw. QR-Code (die Folie zeigt den Aufbau der Global Trade Item Number, GTIN) und RFID.
5. Tracking & Tracing Systeme: traditionelles Tracking & Tracing und Tracking & Tracing auf Basis einer Blockchain.

## 3. Efficient Replenishment (ER)

![[pictures/supplychainmanagement/07/Lecture07_Pg006_Efficient_Replenishment.png]]

<p class="image-caption">Efficient Replenishment gliedert sich in Beschaffungs-, Bestands- und Transportmanagement (in Anlehnung an Sucky 2022, S. 311).</p>

Efficient Replenishment ist ein unternehmensübergreifendes Bestandsmanagement zwischen Hersteller und Handel (Werner 2017, S. 144). Die Bestellrhythmen richten sich nach der tatsächlichen Nachfrage statt nach zeitlich verzögerten Prognosen. So sollen Out-of-Stock-Situationen verschwinden, und der Warennachschub läuft kontinuierlich und automatisiert.

Die Bestandsverantwortung geht dabei auf den Hersteller über, meist nach vorher vereinbarten Regeln zu durchschnittlichen Lagerbeständen, gewünschtem Servicelevel und akzeptiertem Bestandsrisiko.

| Beschaffungsmanagement           | Bestandsmanagement             | Transportmanagement        |
| :------------------------------- | :----------------------------- | :------------------------- |
| Continuous Replenishment         | Vendor Managed Inventory (VMI) | Cross Docking              |
| Computer Assisted Ordering (CAO) | Buyer Managed Inventory (BMI)  | Efficient Unit Loads (EUL) |
| Synchronized Production          | Co-Managed Inventory (CMI)     | Roll Cage Sequencing (RCS) |

## 4. Cross Docking (CD)

### Prinzip, Vor- und Nachteile

![[pictures/supplychainmanagement/07/Lecture07_Pg007_Cross_Docking.png]]

<p class="image-caption">Cross Docking: ein zentraler Umschlagspunkt ohne Vorratshaltung, mit Vor- und Nachteilen.</p>

Cross Docking setzt am "Engpass Rampe" an und verteilt Ware verbrauchsorientiert. Ein zentraler Umschlagspunkt sortiert die Ware nur um und hält möglichst keinen Bestand: Als Bestand liegt höchstens der Tagesbedarf dort, eine Vorratshaltung gibt es nicht. Oft betreiben Logistikdienstleister den Umschlagspunkt, oder er ist ein Multi User Warehouse. Auch wenn der Logistikdienstleister Geld kostet, senkt CD insgesamt die Kosten (Large 2012, S. 136 f.; Werner 2017, S. 152 ff.; Eßig et al. 2013, S. 131 ff.; Sucky 2022, S. 320).

| Vorteile/Nutzen                                               | Nachteile/Schwierigkeiten                                                                   |
| :------------------------------------------------------------ | :------------------------------------------------------------------------------------------ |
| Einsparung von Lagerplatz                                     | Mangel an Lagerflächen und geeignetem Fuhrpark, also Investitionen oder Kooperationen nötig |
| bessere Nutzung der im Lager gewonnenen Fläche                | Mangel an IuK-Systemen und an genauen, aktuellen Daten                                      |
| kürzere Durchlaufzeiten durch schnellere Ein- und Auslagerung | Implementierung dauert etwa 7 Monate                                                        |
| bessere Auslastung der Transportmittel                        |                                                                                             |

### Arten des Cross Dockings

![[pictures/supplychainmanagement/07/Lecture07_Pg008_Arten_Des_Cross_Docking.png]]

<p class="image-caption">Drei Arten des Cross Dockings. Die Grafik zeigt das Zwei-Stufen-Prinzip: Lieferanten, Transshipment Point, Kunden.</p>

1. Artikelreines Cross Docking: Der Lieferant verschickt Vollpaletten, die das Cross Dock weitergibt, ohne sie aufzubrechen.
2. Einstufiges Cross Docking: Der Lieferant (Hersteller) kommissioniert die Ware schon für mehrere Zielorte, etwa je Filiale, vor. Im Umschlaglager wird nicht mehr kommissioniert. Das Cross Dock fasst nur die vorkommissionierten Einheiten je Filiale zusammen.
3. Zwei-Stufen-Prinzip: Es kommen artikelreine Paletten an. Am Transshipment Point werden sie aufgebrochen, je Zielort kommissioniert, neu verpackt und verteilt.

## 5. Vendor Managed Inventory (VMI)

### Begriff und Typen

![[pictures/supplychainmanagement/07/Lecture07_Pg009_Vendor_Managed_Inventory.png]]

<p class="image-caption">Beim Vendor Managed Inventory plant der Lieferant die Produktion und den Bestand beim Abnehmer, gestützt auf dessen Informationen.</p>

Beim VMI überträgt ein Kunde seinem Hersteller ("Vendor") die Planungs- und Steuerungshoheit über sein Bestandsmanagement ("Inventory"). Der Hersteller entscheidet über Termine und Mengen und übernimmt die Verantwortung für das Vorratsmanagement. Dafür gibt der Abnehmer die relevanten Daten an ihn weiter (Werner 2017, S. 143 ff.; Eßig et al. 2013, S. 136 ff.).

Die Folie nennt drei Typen, je nachdem, wer die Bestände steuert: Buyer Managed Inventory (BMI, der Abnehmer), Co-Managed Inventory (CMI, beide gemeinsam) und Vendor Managed Inventory bzw. Supplier Managed Inventory (VMI/SMI, der Lieferant).

### Voraussetzungen, Vor- und Nachteile

![[pictures/supplychainmanagement/07/Lecture07_Pg010_Vmi_Voraussetzungen.png]]

<p class="image-caption">VMI braucht IT-Verknüpfung, Vertrauen und langfristige Verträge.</p>

Für VMI braucht es:

- eine umfassende IT-Verknüpfung, weil viele Informationen ausgetauscht werden,
- Vertrauen, vor allem dass der Lieferant mit den bereitgestellten Daten sachgemäß umgeht,
- umfassende und langfristige Verträge über Konditionen und Rahmenverträge, Anlieferrhythmus, Mindestliefermengen und die Zuteilung von Lagerkapazität für den Lieferanten.

| Vorteile/Nutzen                                                                   | Nachteile/Schwierigkeiten                                                 |
| :-------------------------------------------------------------------------------- | :------------------------------------------------------------------------ |
| geringere Kosten durch weniger Lagerhaltung und ausgelastete Transportkapazitäten | Konventionalstrafen bei Out-of-Stock-Situationen                          |
| bis zu 20 % kürzere Durchlaufzeiten                                               | Austausch vertraulicher Informationen (Kompetenzverlust, Preisabsprachen) |
| höherer Service- und Dienstleistungsgrad                                          | hoher Automatisierungsgrad, obwohl die Daten Interpretation brauchen      |
| Flexibilität                                                                      |                                                                           |

## 6. Konsignation (KON)

### Begriff, Vor- und Nachteile

![[pictures/supplychainmanagement/07/Lecture07_Pg011_Konsignation.png]]

<p class="image-caption">Konsignation: Die Ware bleibt bis zum Abruf Eigentum des Lieferanten. Die Vorteile sind nach Lieferant und Abnehmer getrennt.</p>

Bei der Konsignation bleiben Material und Vorräte in der Verfügungsmacht und im zivilrechtlichen Eigentum des Lieferanten (Konsignant). Das gilt, bis eine festgelegte Frist verstreicht oder bis der Kunde (Konsignator) die Ware aus dem Konsignationslager abruft (Werner 2017, S. 143 ff.).

Grundlage ist ein Konsignationsvertrag, der auf dem allgemeinen Rahmenvertrag aufbaut. Den Verbrauch erfasst eine regelmäßige oder permanente Inventur. Bezahlt wird nach Verbrauch in der Produktion (Payment-on-Production).

| Vorteile/Nutzen                                                                    | Nachteile/Schwierigkeiten               |
| :--------------------------------------------------------------------------------- | :-------------------------------------- |
| Lieferant: ruhigere Beschaffungs- und Produktionsabläufe, optimierte Transportwege | keine echte Bestandsminderung in der SC |
| Abnehmer: weniger Kapitalbindung, bessere Versorgungssicherheit                    | weniger Transparenz im Lager            |
|                                                                                    | doppelte Bevorratung von Materialien    |

### Ausprägungen

![[pictures/supplychainmanagement/07/Lecture07_Pg012_Auspraegungen_Der_Konsignation.png]]

<p class="image-caption">Drei Ausprägungen der Konsignation, mit dem Audi-Industriepark in Ingolstadt als Beispiel für einen Lieferantenpark.</p>

| Ausprägung                    | Merkmale                                                                                                                                       |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| Konsignationslager            | Warenlager in der Nähe des Kunden bzw. in seinen Räumen, oft kombiniert mit VMI                                                                |
| Lieferanten-Logistik-Zentrum  | gemeinsames Konsignationslager mehrerer Zulieferer in der Nähe des Großkunden, betrieben von einem externen 3PL                                |
| Industriepark/Lieferantenpark | ein Abnehmer siedelt mehrere Zulieferer nahe seiner Produktion an, sie beauftragen gemeinsam Logistikdienstleister, oft kombiniert mit JIT/JIS |

### Praxisbeispiel: Mutti's InstaFactory

> [!note] Nicht klausurrelevant
> Die Folie trägt den Sticker "Praxisbeispiele".

![[pictures/supplychainmanagement/07/Lecture07_Pg013_Praxisbeispiel_Mutti_Instafactory.png]]

<p class="image-caption">Mutti verlegt die Produktion der Passata direkt aufs Feld der Landwirte (Mutti 2024; Frankfurter Rundschau 2020).</p>

Der Tomatenhersteller Mutti produziert in der InstaFactory direkt beim Lieferanten, also auf dem Feld. Das bringt das Know-how der Landwirte vor Ort ein und verkürzt Lieferkette, Transportwege und Transportzeiten. Die Produktqualität steigt im Sinne der Strategie "Qualitätsführer", und jede Tomate ist zu 100 % rückverfolgbar, wie es die Kunden wünschen. Francesco Mutti (2020): "Für dieses spezielle Projekt arbeiten wir mit drei unserer besten Landwirte zusammen, die sich im Laufe der Jahre durch ihre Sorgfalt und Aufmerksamkeit ausgezeichnet haben."

## 7. Collaborative Planning, Forecasting and Replenishment (CPFR)

### Strategie, Planung und Prognose

![[pictures/supplychainmanagement/07/Lecture07_Pg014_Cpfr_Planung_Und_Prognose.png]]

<p class="image-caption">CPFR-Zyklus, Teil 1: Rahmenvereinbarung und Geschäftsplan (P), danach Abverkaufs- und Bestellprognosen (F) (in Anlehnung an Sucky 2022, S. 330).</p>

CPFR ist "ECR der nächsten Generation": Mehrere SC-Partner planen, prognostizieren und führen ihre Bestände gemeinsam und bringen dabei ihr Wissen zusammen. Der Datenaustausch, auf dem die Verbesserungen aufbauen, läuft in beide Richtungen statt nur in eine. Ziel ist eine gemeinsam bessere Datenqualität (Chopra 2019, S. 273 ff.; Sucky 2022, S. 328 ff.; Wellbrock 2015, S. 94 ff.).

Der Prozess hat vier Phasen und neun Schritte, mit "Collaboration" in der Mitte:

1. Strategie und Planung (P): Umfang und Art der Zusammenarbeit festlegen (Schritt 1, Rahmenvereinbarung), Produktionspläne synchronisieren, Erfolgskriterien und Kennzahlen definieren und einen gemeinsamen Geschäftsplan aufstellen (Schritt 2).
2. Prognose-, Planungs- und Belieferungsmanagement (F): Abverkaufs- und Bestellprognosen erst einzeln, dann gemeinsam erstellen.
   - Schritte 3 bis 5: individuelle Abverkaufsprognose, Abweichungen identifizieren und klären, gemeinsame Abverkaufsprognose.
   - Schritte 6 bis 8: individuelle Bestellprognose, Abweichungen identifizieren und klären, gemeinsame Bestellprognose.

### Umsetzung, Analyse, Vor- und Nachteile

![[pictures/supplychainmanagement/07/Lecture07_Pg015_Cpfr_Umsetzung_Und_Analyse.png]]

<p class="image-caption">CPFR-Zyklus, Teil 2: Auftragsgenerierung (R) und Analyse schließen den Kreis.</p>

3. Umsetzung und Ausführung (R): Schritt 9 ist die Auftragsgenerierung. Ausgeführt wird mit den traditionellen EC/ECR-Konzepten.
4. Analyse: Ausnahmesituationen systematisch analysieren und den Erfolg der Kooperation bewerten, damit sich die Zusammenarbeit laufend verbessert.

| Vorteile/Nutzen                                                   | Nachteile/Schwierigkeiten                     |
| :---------------------------------------------------------------- | :-------------------------------------------- |
| mehr Endkundennutzen durch genauere Prognosen                     | Kooperationsbereitschaft nötig                |
| niedrigere Sicherheitsbestände, ohne dass die Verfügbarkeit sinkt | Bereitschaft, Prozesse und Abläufe anzupassen |
| mehr Flexibilität durch mehr Informationsaustausch                | Risiko, dass Informationen missbraucht werden |
|                                                                   | Daten und Informationen müssen verfügbar sein |

## 8. Zielerreichungsgrad der SCM-Konzepte

![[pictures/supplychainmanagement/07/Lecture07_Pg016_Zielerreichungsgrad_Der_Scm_Konzepte.png]]

<p class="image-caption">Wie gut die 17 Konzepte fünf Ziele erreichen. Grün markiert die höchsten, rot die niedrigsten Werte je Spalte (Göpfert 2019, S. 94, nach Göpfert und Wellbrock 2012).</p>

Göpfert und Wellbrock (2012) haben auch erhoben, wie gut die 17 Konzepte aus Lerneinheit 06 fünf Ziele erreichen. Fett gedruckt sind auf der Folie die Konzepte, die in den Lerneinheiten 06 und 07 vorkommen.

| Bereich               | Konzept  | Endkundennutzen | Kostenvorteile | Zeitvorteile | Qualitätsvorteile | Flexibilitätsvorteile |
| :-------------------- | :------- | :-------------- | :------------- | :----------- | :---------------- | :-------------------- |
| Planung und Steuerung | ATP/CTP  | **3,99**        | _2,77_         | 3,58         | 2,24              | 3,28                  |
|                       | CPFR     | 3,70            | 3,56           | **3,70**     | 2,58              | **3,55**              |
|                       | Kanban   | _2,51_          | 3,38           | 3,17         | 2,31              | _2,83_                |
|                       | 3PL/LLP  | _2,61_          | 3,70           | _2,79_       | 2,47              | 3,45                  |
| Beschaffung           | JIT/JIS  | 3,17            | 3,60           | **4,05**     | 2,27              | 3,09                  |
|                       | SRM      | 3,25            | 3,56           | 3,33         | **3,51**          | 3,33                  |
|                       | Sourcing | 2,90            | **3,98**       | 3,06         | 3,14              | 3,38                  |
| Produktion            | CE       | 3,31            | **4,00**       | 3,65         | **3,56**          | 3,28                  |
|                       | PP       | 3,18            | 3,22           | 3,22         | 2,52              | **3,49**              |
|                       | VAP      | 3,32            | 3,51           | 3,17         | **3,54**          | 3,13                  |
| Distribution          | QR       | 3,75            | 3,00           | **3,68**     | 2,60              | 3,26                  |
|                       | CR/ER    | 3,41            | 3,36           | 3,55         | 2,40              | 3,25                  |
|                       | VMI      | 3,10            | 3,57           | 3,12         | _2,19_            | 3,20                  |
|                       | KON      | 2,98            | 3,32           | 3,41         | _1,99_            | 3,39                  |
|                       | CD       | 2,72            | 3,48           | 3,51         | _2,22_            | 2,99                  |
|                       | ECR      | **3,92**        | 3,08           | 3,43         | 2,65              | 3,08                  |
|                       | CRM      | **4,05**        | _2,68_         | _2,84_       | 2,85              | _2,83_                |

Fett entspricht den grünen, kursiv den roten Werten der Folie. Einige Muster:

- Den höchsten Endkundennutzen bringen CRM (4,05), ATP/CTP (3,99) und ECR (3,92). Kanban (2,51) und 3PL/LLP (2,61) liegen hier am niedrigsten.
- Die größten Kostenvorteile bringen CE (4,00) und Sourcing (3,98), die größten Zeitvorteile JIT/JIS (4,05).
- Bei der Qualität schneiden die Distributionskonzepte schwach ab: Konsignation hat mit 1,99 den niedrigsten Wert der ganzen Tabelle, dazu kommen VMI (2,19) und Cross Docking (2,22). Vorn liegen CE, VAP und SRM.
- CPFR ist das einzige Konzept mit grünen Werten in zwei Spalten (Zeit und Flexibilität). CRM steht beim Endkundennutzen ganz oben und hat in drei anderen Spalten rote Werte.

## Zusammenfassung

- ECR ist eine vertikale Kooperation mit Ausrichtung auf Endkunde und Lieferant. Das ECR-Haus hat logistikorientierte (Efficient Replenishment) und marketingorientierte Komponenten (EA, EP, EPI) und steht auf IuK-Technologien.
- IuK-Technologien und Planungssysteme: EDI, ERP, APS als Ergänzung zum ERP, Barcode/QR-Code und RFID, traditionelles und Blockchain-basiertes Tracking & Tracing. Klassische ERP/MRP-Systeme sind für SCM zu unflexibel und können kaum simulieren.
- Efficient Replenishment: Nachschub nach tatsächlicher Nachfrage, Bestandsverantwortung beim Hersteller. Es umfasst Beschaffungs-, Bestands- und Transportmanagement.
- Cross Docking: Umschlag ohne Vorratshaltung, artikelrein, einstufig oder zweistufig. Es spart Lagerplatz und Durchlaufzeit, braucht aber Flächen, Fuhrpark und gute Daten.
- VMI: Der Lieferant steuert die Bestände des Kunden. Es braucht IT-Verknüpfung, Vertrauen und langfristige Verträge und bringt bis zu 20 % kürzere Durchlaufzeiten.
- Konsignation: Die Ware bleibt bis zum Abruf Eigentum des Lieferanten. Das senkt die Kapitalbindung beim Abnehmer, mindert den Bestand in der Supply Chain aber nicht.
- CPFR: gemeinsame Planung, Prognose und Bestellung in vier Phasen und neun Schritten. Es senkt Sicherheitsbestände, setzt aber Kooperationsbereitschaft voraus.
- Nach Göpfert und Wellbrock bringen CRM, ATP/CTP und ECR den größten Endkundennutzen, JIT/JIS die größten Zeitvorteile, CE und Sourcing die größten Kostenvorteile. Konsignation, VMI und Cross Docking erreichen bei der Qualität am wenigsten.

## Selbsttest

1. Wie ist das ECR-Haus aufgebaut?

> [!success]- Antwort
> Das Dach ist Efficient Consumer Response. Darunter steht links die Supply Side mit Efficient Replenishment (logistikorientiert, effizienter Informations- und Materialfluss) und rechts die Demand Side mit Efficient Assortment, Efficient Promotions und Efficient Product Introduction (marketingorientiert, mehr Endkundennutzen, Wachstums- und Differenzierungsvorteile). Das Fundament bilden Informations- und Kommunikationstechnologien und Planungssysteme.

2. Welche Schwächen haben klassische ERP/MRP-Systeme im SCM-Kontext, und wie hilft APS?

> [!success]- Antwort
> Klassische ERP/MRP-Systeme haben Probleme mit Datenqualität und Zeit, Defizite in der Optimierungsmethodik, einen eingeschränkten Planungsinhalt, berücksichtigen Interdependenzen kaum, sind wenig flexibel und können kaum simulieren. APS ergänzt das ERP: Lieferanten- und Kundeninformationen fließen direkt ein, der Informationsfluss läuft auf- und abwärts, und APS plant kundenorientiert, in Echtzeit, simultan und mit Simulation.

3. Was ist Efficient Replenishment, und welche Konzepte gehören dazu?

> [!success]- Antwort
> ER ist ein unternehmensübergreifendes Bestandsmanagement zwischen Hersteller und Handel. Bestellrhythmen folgen der tatsächlichen Nachfrage statt verzögerter Prognosen, der Nachschub läuft kontinuierlich und automatisiert, und die Bestandsverantwortung geht nach vereinbarten Regeln (Lagerbestand, Servicelevel, Bestandsrisiko) auf den Hersteller über. Dazu gehören im Beschaffungsmanagement Continuous Replenishment, CAO und Synchronized Production, im Bestandsmanagement VMI, BMI und CMI, im Transportmanagement Cross Docking, Efficient Unit Loads und Roll Cage Sequencing.

4. Unterscheiden Sie die drei Arten des Cross Dockings.

> [!success]- Antwort
> Beim artikelreinen Cross Docking schickt der Lieferant Vollpaletten, die ohne Aufbruch weitergehen. Beim einstufigen Cross Docking kommissioniert der Lieferant schon je Filiale vor, das Cross Dock fasst die Einheiten je Filiale nur zusammen. Beim Zwei-Stufen-Prinzip kommen artikelreine Paletten an, die am Transshipment Point aufgebrochen, je Zielort kommissioniert, neu verpackt und verteilt werden.

5. Was ist VMI, welche Typen gibt es, und was spricht dafür und dagegen?

> [!success]- Antwort
> Beim VMI überträgt der Kunde seinem Hersteller die Planungs- und Steuerungshoheit über sein Bestandsmanagement, also Termin- und Mengenentscheidungen, und gibt ihm dafür seine Daten. Typen sind BMI, CMI und VMI/SMI. Vorteile: weniger Lagerhaltung, ausgelastete Transporte, bis zu 20 % kürzere Durchlaufzeiten, höherer Servicegrad, Flexibilität. Nachteile: Konventionalstrafen bei Out-of-Stock, Austausch vertraulicher Informationen und ein hoher Automatisierungsgrad, obwohl die Daten Interpretation brauchen.

6. Was bedeutet Konsignation, und warum senkt sie den Bestand in der Supply Chain nicht?

> [!success]- Antwort
> Die Ware bleibt in Verfügungsmacht und Eigentum des Lieferanten, bis eine Frist verstreicht oder der Kunde sie aus dem Konsignationslager abruft. Bezahlt wird nach Verbrauch (Payment-on-Production). Der Abnehmer bindet weniger Kapital, aber die Ware liegt weiterhin im Lager, nur auf Rechnung des Lieferanten. Deshalb gibt es keine echte Bestandsminderung, eher weniger Transparenz und teils doppelte Bevorratung.

7. Nennen Sie die drei Ausprägungen der Konsignation.

> [!success]- Antwort
> Das Konsignationslager liegt beim oder nahe beim Kunden und wird oft mit VMI kombiniert. Ein Lieferanten-Logistik-Zentrum ist ein gemeinsames Konsignationslager mehrerer Zulieferer nahe dem Großkunden, das ein 3PL betreibt. Im Industrie- bzw. Lieferantenpark siedelt ein Abnehmer mehrere Zulieferer nahe seiner Produktion an, oft kombiniert mit JIT/JIS.

8. Beschreiben Sie den CPFR-Prozess.

> [!success]- Antwort
> CPFR hat vier Phasen um die Collaboration in der Mitte. In Strategie und Planung (P) schließen die Partner eine Rahmenvereinbarung und stellen einen gemeinsamen Geschäftsplan auf. In der Prognosephase (F) erstellen sie Abverkaufs- und Bestellprognosen erst einzeln, klären Abweichungen und einigen sich auf gemeinsame Prognosen (Schritte 3 bis 8). In der Umsetzung (R) folgt die Auftragsgenerierung mit klassischen EC/ECR-Konzepten (Schritt 9). Die Analyse wertet Ausnahmen und den Kooperationserfolg aus, um die Zusammenarbeit zu verbessern.

9. Welche Vor- und Nachteile hat CPFR?

> [!success]- Antwort
> Vorteile: mehr Endkundennutzen durch genauere Prognosen, niedrigere Sicherheitsbestände bei gleicher Verfügbarkeit und mehr Flexibilität durch mehr Informationsaustausch. Nachteile: Es braucht Kooperationsbereitschaft und die Bereitschaft, Prozesse anzupassen, Informationen können missbraucht werden, und die nötigen Daten müssen verfügbar sein.

10. Welche Konzepte erreichen laut Göpfert und Wellbrock beim Endkundennutzen und bei der Qualität am meisten bzw. am wenigsten?

> [!success]- Antwort
> Beim Endkundennutzen liegen CRM (4,05), ATP/CTP (3,99) und ECR (3,92) vorn, Kanban (2,51) und 3PL/LLP (2,61) hinten. Bei den Qualitätsvorteilen liegen CE (3,56), VAP (3,54) und SRM (3,51) vorn, Konsignation (1,99), VMI (2,19) und Cross Docking (2,22) hinten.

---

[[/notes/lectures/supplychainmanagement/index|Zurück zum SCM-Index]] | [[/notes/lectures/supplychainmanagement/06-konzepte-des-scm-i|Zurück: (y-06) Konzepte des SCM I]] | [[/notes/lectures/supplychainmanagement/08-kontrollinstrumente|Weiter: (y-08) Kontrollinstrumente in der Supply Chain]]
