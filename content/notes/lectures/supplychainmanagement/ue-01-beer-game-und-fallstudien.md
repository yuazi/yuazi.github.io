---
title: "Ü01 - Beer Game und Fallstudien zur SC-Planung"
tags:
  - scm
  - supply-chain-management
  - uebung
  - bullwhip-effekt
  - fallstudie
date: 2026-11-12
---

[[/notes/lectures/supplychainmanagement/index|Zurück zum SCM-Index]] | [[/notes/lectures/supplychainmanagement/01-von-der-supply-chain-zum-scm|Theorie dazu: (y-01) Von der Supply Chain zum SCM]]

> [!note] Grundlage
> Diese Notiz fasst die Übungsfolien UE 02-04 (Beer Game, Maja Baldes, 03.11.2026) und UE 05-06 (Fallstudien zur SC-Planung, 10.11.2026) zusammen. Organisation, Agenda und Klausurhinweise aus UE 01 stehen schon in [[/notes/lectures/supplychainmanagement/00-einfuehrung|(y-00) Einführung]]. Die Fallstudien selbst liegen nur im ILIAS-Kurs, weil ihre Weitergabe untersagt ist. Hier stehen deshalb nur die Leitfragen.

## Mentales Modell

- Die Übung macht Phänomene der Vorlesung erlebbar. In Kapitel 1 ist das der Bullwhip-Effekt: Im Beer Game spielt jede Gruppe eine Stufe einer Bier-Lieferkette und kommuniziert nur über Bestellungen.
- Jede Stufe entscheidet für sich vernünftig, und trotzdem schaukeln sich Bestellungen und Bestände entlang der Kette auf. Lee, Padmanabhan und Whang (1997) nennen dafür vier Ursachen: Demand Signal Processing, Rationing Game, Order Batching und Price Variations.
- In Kapitel 2 folgen zwei Fallstudien zur Supply-Chain-Planung, BearCo und Netflix gegen Blockbuster. Sie trainieren den Klausurteil, in dem etwa 30 von 90 Punkten auf eine kurze Fallstudie entfallen.

## 1. Die Bier-Supply-Chain

![[pictures/supplychainmanagement/ue/UE02_Pg003_Bier_Supply_Chain.png]]

<p class="image-caption">Die Bier-Supply-Chain vom Zulieferer bis zum Kunden: Aufträge fließen stromaufwärts, Material stromabwärts.</p>

Die Kette im Spiel reicht vom Zulieferer über Zwischenhändler, Brauerei (OEM), Vertriebshändler, Großhändler und Einzelhändler bis zum Kunden. Ein Logistikdienstleister übernimmt den Transport. Aufträge laufen von rechts nach links, also vom Kunden zum Zulieferer, das Material in die Gegenrichtung.

Das Spiel setzt bewusst enge Regeln:

- Die Stufen sprechen vertikal nur über Bestellungen miteinander. Eine Bestellmenge ist das einzige Signal, das die nächste Stufe bekommt.
- Jede Stufe entscheidet autonom über Bestellmengen und Bestände.
- Liefer- und Produktionszeiten verzögern jede Reaktion.

## 2. Die Ergebnisse

![[pictures/supplychainmanagement/ue/UE02_Pg004_Ergebnisse.png]]

<p class="image-caption">Auswertung der Spielrunde: Kundennachfrage, Lagerbestand und Aufträge je Stufe über die Perioden.</p>

![[pictures/supplychainmanagement/ue/UE02_Pg005_Ergebnisse.png]]

<p class="image-caption">Fehlmengen und Kosten je Stufe über die Perioden.</p>

Ausgewertet wird pro Stufe über alle Perioden: die Kundennachfrage, der Lagerbestand, die Aufträge, die Fehlmengen und die Kosten.

## 3. Der Bullwhip-Effekt

![[pictures/supplychainmanagement/ue/UE02_Pg006_Bullwhip_Effekt.png]]

<p class="image-caption">Bullwhip-Effekt: Verteilung der Bestellungen und Schwankung der Bestände je Stufe (vgl. Riemer 2008, S. 594f.).</p>

Die Referenzgrafik nach Riemer (2008) zeigt das typische Muster. Die Bestellungen schwanken umso stärker, je weiter eine Stufe vom Kunden entfernt ist, und die Bestände pendeln zwischen Überbestand und Fehlmenge.

Was dabei passiert, fasst die Übung nach Alicke (2005) so zusammen:

- Jede Stufe trifft scheinbar rationale Bestell- und Produktentscheidungen.
- Eine falsche Wahrnehmung der Nachfrage und verzerrte Systeminformationen führen zur Überreaktion.
- Den einzelnen Entscheidern fällt die Vorhersage schwer.

Die Folgen sind eine verzögerte Reaktion auf geänderte Kundenbedarfe, geringe Flexibilität und schlechte Reaktionsfähigkeit. Dazu kommen Überbestände, schlecht ausgelastete Kapazitäten und eine stark schwankende Nachfrage.

## 4. Die vier Ursachen nach Lee, Padmanabhan und Whang

![[pictures/supplychainmanagement/ue/UE02_Pg008_Ursachen_Bullwhip_Effekt.png]]

<p class="image-caption">Das Beer Distribution Game als Beispiel für mangelnde Abstimmung und die vier Ursachen des Bullwhip-Effekts (vgl. Lee/Padmanabhan/Whang 1997; Sterman 1989).</p>

| Ursache                  | Was passiert                                                                                       |
| :----------------------- | :------------------------------------------------------------------------------------------------- |
| Demand Signal Processing | Die Nachfrage schwankt kaum, aber jeder Anstieg wird als Signal für weitere Anstiege gelesen.      |
| Rationing Game           | Abnehmer fürchten bei Knappheit eine Rationierung und bestellen mehr, als sie brauchen.            |
| Order Batching           | Bei bestellfixen Kosten werden mehrere Periodenbedarfe zu einer großen Bestellung zusammengefasst. |
| Price Variations         | Die Bestellmengen folgen den Preiserwartungen statt dem Bedarf.                                    |

## 5. Reflexion des Beer Games

Zur Nachbereitung gibt die Übung Leitfragen vor. Sie fragen nach Sachverhalten, Prozessen, Handlungsmustern, Glaubenssätzen, Emotionen und Prinzipien, jeweils danach, was gewirkt hat und was hätte wirken sollen. Dazu kommen:

- Welche drei Entwicklungsnotwendigkeiten sind unabdingbar?
- Was ist im Spiel schlecht gelaufen, und was würden Sie beim nächsten Mal anders machen?
- Wie ließen sich diese Prinzipien im SCM gestalten, und wie sähe ein SCM dann in der Praxis aus?
- Welche Nutzen- und Konfliktpotenziale entstehen dabei?

## 6. Fallstudienarbeit zur SC-Planung

Fallstudien sind simulierte Fälle aus der Praxis, an denen Lösungen erarbeitet werden. Sie sollen helfen, Sachzusammenhänge selbstständig zu erschließen, etwa welche Probleme klassisch zwischen Lieferanten einer Supply Chain auftreten und was SCM in der Praxis ausmacht. Der Arbeitsauftrag: beide Fallstudien bearbeiten, gern in Kleingruppen, sie vergleichen und die Ergebnisse in der nächsten Einheit präsentieren.

### BearCo

![[pictures/supplychainmanagement/ue/UE05_Pg005_Fallstudie_BearCo.png]]

<p class="image-caption">BearCo: Zulieferer (Steel-Corp, ManSteel, WrapCo, Lubricanto), BearCo mit Manufacturing, Logistics und Sales, Kunden (Retailers, OEMs).</p>

BearCo ist ein internationaler Hersteller von Wälzlagern. Die Grafik zeigt vier Zulieferer (Steel-Corp, ManSteel, WrapCo, Lubricanto), BearCo selbst mit den Bereichen Manufacturing, Logistics und Sales sowie zwei Kundengruppen, Retailers und OEMs. Die Leitfragen:

- Welcher Supply-Chain-Typ liegt vor, und welches ist das fokale Unternehmen?
- Was passiert auf der institutionellen, der informatorischen und der Prozess- und Ressourcenebene?
- Welche Aktivitäten des SCM werden angesprochen?

Die drei Ebenen sind das Supply-Chain-Modell nach Sucky (2022) aus [[/notes/lectures/supplychainmanagement/01-von-der-supply-chain-zum-scm|(y-01) Von der Supply Chain zum SCM]].

### Netflix und Blockbuster

![[pictures/supplychainmanagement/ue/UE05_Pg006_Fallstudie_Netflix_Blockbuster.png]]

<p class="image-caption">Netflix und Blockbuster: drei Geschäftsmodelle im Vergleich, Blockbuster, Redbox und Netflix.</p>

Die zweite Fallstudie behandelt den Niedergang von Blockbuster. Verglichen werden drei Geschäftsmodelle: Blockbuster, Redbox und Netflix. Die Leitfragen:

- Was hat das Beispiel mit Supply-Chain-Planung zu tun?
- Welche Geschäftsmodelle kommen in der Fallstudie vor?
- Wie sieht das Geschäftsmodell von Netflix heute aus, was hat sich geändert, und wie sieht die Supply Chain von Netflix heute aus?

## Selbsttest

1. Welche Spielregeln des Beer Games erzeugen den Bullwhip-Effekt?

> [!success]- Antwort
> Die Stufen kommunizieren vertikal nur über Bestellungen, sodass eine Bestellmenge das einzige Nachfragesignal ist. Jede Stufe entscheidet autonom über Bestellmengen und Bestände, und Liefer- und Produktionszeiten verzögern jede Reaktion. Zusammen führt das zu Überreaktionen, die sich stromaufwärts verstärken.

2. Warum entsteht der Bullwhip-Effekt, obwohl jede Stufe rational handelt?

> [!success]- Antwort
> Jede Stufe sieht nur die Bestellungen ihres direkten Abnehmers, nicht die echte Kundennachfrage. Sie nimmt die Nachfrage deshalb falsch wahr, bekommt verzerrte Systeminformationen und kann schlecht vorhersagen. Lokal sinnvolle Entscheidungen addieren sich so zu Überreaktionen im Gesamtsystem.

3. Nennen und erklären Sie die vier Ursachen des Bullwhip-Effekts nach Lee, Padmanabhan und Whang (1997).

> [!success]- Antwort
> Demand Signal Processing: Kleine Nachfrageanstiege werden als Signal für weitere Anstiege gelesen. Rationing Game: Aus Angst vor Rationierung bei Knappheit bestellen Abnehmer mehr als nötig. Order Batching: Wegen bestellfixer Kosten werden mehrere Periodenbedarfe zu einer Bestellung gebündelt. Price Variations: Bestellmengen folgen Preiserwartungen statt dem Bedarf.

4. Welche Folgen hat der Bullwhip-Effekt für die Supply Chain?

> [!success]- Antwort
> Verzögerte Reaktion auf geänderte Kundenbedarfe, geringe Flexibilität und schlechte Reaktionsfähigkeit, dazu Überbestände, schlecht ausgelastete Kapazitäten und eine stark schwankende Nachfrage auf den vorgelagerten Stufen.

5. Mit welchen Fragen gehen Sie an eine SCM-Fallstudie wie BearCo heran?

> [!success]- Antwort
> Welcher Supply-Chain-Typ liegt vor und welches ist das fokale Unternehmen? Was passiert auf der institutionellen, der informatorischen und der Prozess- und Ressourcenebene? Welche Aktivitäten des SCM werden angesprochen? Das deckt sich mit dem Klausurteil, in dem etwa 30 Punkte auf eine kurze Fallstudie entfallen.

---

[[/notes/lectures/supplychainmanagement/index|Zurück zum SCM-Index]] | [[/notes/lectures/supplychainmanagement/01-von-der-supply-chain-zum-scm|Theorie dazu: (y-01) Von der Supply Chain zum SCM]]
