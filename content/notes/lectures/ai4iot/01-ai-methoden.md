---
title: "L01 - AI-Methoden"
tags:
  - ai4iot
  - iiot
  - machine-learning
  - deep-learning
  - llm
  - transformer
date: 2026-10-27
---

[[/notes/lectures/ai4iot/index|Zurück zum AI4IoT-Index]] | [[/notes/lectures/ai4iot/00-kickoff|Zurück: (y-00) Kick-Off und Kernbegriffe]]

## Mentales Modell

- Die Sitzung ist laut Folie ein Kondensat aus den Modulen "Data Science for Business Data" und "Applied AI", mit einer Brücke zum (I)IoT. Sie hat vier Teile: Grundkonzepte, Methoden der diskriminativen KI, künstliche neuronale Netze und Deep Learning (einschließlich DL für generative Lösungen) sowie Transformer-Netze und LLMs.
- Diskriminative KI ordnet Datenobjekte Klassen oder Gruppen zu: Abweichungsanalyse, Klassifikation, Clustering, Wirkungsprognose und Assoziationsanalyse. Generative KI erzeugt Artefakte, und für dieselbe Eingabe kann es viele gültige Ausgaben geben.
- Machine Learning lernt Muster aus Beispielen, statt Regeln von Hand zu kodieren. Der Engpass sind meist gelabelte Trainingsdaten. Im IIoT können sie deshalb zu einer strategischen Ressource werden.
- Deep Learning heißt künstliche neuronale Netze mit vielen Schichten. Der Boom der letzten 15 Jahre hat vier Gründe: mehr Trainingsdaten, GPUs, ReLU statt Sigmoid und laufend neue Architekturen (CNN, RNN/LSTM, GAN, Autoencoder, Diffusion, Transformer).
- LLMs sind Transformer, die auf Tokens und Embeddings arbeiten und das nächste Token per Softmax-Wahrscheinlichkeit wählen. Für den IoT-Kontext zählen ihre Grenzen (Halluzinationen, Kosten, Energiebedarf) und die Gegenbewegung zu kleinen Modellen auf Edge-Geräten.

## 1. Starke und schwache KI

![[pictures/ai4iot/01/Lecture01_Pg004_Starke_Und_Schwache_Ki.png]]

<p class="image-caption">Starke und schwache KI nach Searle, Lee und Flowers, dazu AGI, ASI und die Frage, ob heutige Sprachmodelle schon AGI sind.</p>

Der KI-Begriff war schon bei seiner Prägung ein Dachbegriff (Minsky 1968), unter dem Sprachverarbeitung, symbolisches Schließen, Wissensrepräsentation, maschinelles Lernen, Computer Vision und Robotik diskutiert werden. KI ist meist auch nicht das, was man naiv erwarten würde. Die Folie trennt zwei Lesarten:

- **Starke KI** (Strong, Full oder General AI): Nach Searle (1980) kann man von Computern mit den richtigen Programmen im wörtlichen Sinn sagen, dass sie verstehen und andere kognitive Zustände haben. Lee (2006) spricht von "systems that mimic and simulate how humans think".
- **Schwache KI** (Weak, Narrow oder Soft AI): Nach Flowers (2019) ist KI ein Werkzeug zum Lösen von Problemen.

Ob starke KI überhaupt möglich ist, wird bis heute philosophisch diskutiert. AGI (Artificial General Intelligence) entspräche der menschlichen Intelligenz, ASI (Artificial Super Intelligence) wäre ihr durchgehend überlegen. Seit 2023, und verstärkt seit 2026, wird diskutiert, ob mit Sprachmodellen wie Claude Opus 5, GPT 6 Astra, Gemini 4 oder Meta Muse Wonder bereits AGI oder ASI entstanden ist. Die Folie fragt nach der eigenen Einschätzung und verlangt, dabei auch die IoT-Perspektive zu berücksichtigen.

## 2. Data Mining, Machine Learning und Generative AI

![[pictures/ai4iot/01/Lecture01_Pg005_Data_Mining_Machine_Learning_Und_Generative.png]]

<p class="image-caption">Data Mining nach Decker und Focardi (1995) und Bissantz et al. (2000), mit Machine Learning und Statistik als Grundlagen.</p>

Data Mining ist nach Decker und Focardi (1995) eine Methodik, die eine logische oder mathematische Beschreibung von Mustern und Regelmäßigkeiten in einer Datenmenge findet. Bissantz et al. (2000) betonen, dass die Methoden autonom aus großen Rohdatenmengen die bedeutsamsten Muster identifizieren und sie dem Anwender als interessantes Wissen präsentieren. Die beiden Grundlagen des Data Mining sind Machine Learning und Statistik.

Machine Learning gibt Computern "the ability to learn without being explicitly programmed" (Samuel 1959). Es wird der KI zugerechnet und hat zuletzt vor allem bei Mustern in unstrukturierten Daten große Fortschritte gemacht. Deep Learning ist eine Variante des ML auf Basis künstlicher neuronaler Netze mit vielen Schichten.

### Generative AI im Schichtenmodell

![[pictures/ai4iot/01/Lecture01_Pg007_Generative_Ai_Im_Schichtenmodell.png]]

<p class="image-caption">KI, Machine Learning, Deep Learning und Generative AI als ineinanderliegende Schichten (Banh und Strobel 2023).</p>

Banh und Strobel (2023) ordnen die Begriffe als Schichten: KI (etwa Expertensysteme und Wissensbasen) umfasst Machine Learning (SVMs, Entscheidungsbäume, k-Nearest-Neighbors), das umfasst Deep Learning (neuronale Netze, CNNs), und darin liegt Generative AI (LLMs, GANs, Variational Autoencoder, Latent Diffusion Models). Jovanovic und Campbell (2022) definieren generatives Modellieren als Technik, die aus Trainingsbeispielen Muster und Verteilungen lernt und dann realistische synthetische Artefakte erzeugt. Generative AI nutzt das zusammen mit Fortschritten im Deep Learning, um Text, Grafik, Audio und Video in großem Umfang zu erzeugen.

### Lernen aus Regeln und Lernen aus Daten: Gesichtserkennung

![[pictures/ai4iot/01/Lecture01_Pg008_Lernen_Aus_Regeln_Und_Lernen_Aus.png]]

<p class="image-caption">Gesichtserkennung früher: handkodierte mathematische Beschreibungen von Nase, Mund und Auge (Arca et al. 2006).</p>

![[pictures/ai4iot/01/Lecture01_Pg009_Lernen_Aus_Regeln_Und_Lernen_Aus.png]]

<p class="image-caption">Gesichtserkennung heute: Ein tiefes neuronales Netz lernt Features und ihre Zusammenfassung aus Beispielbildern.</p>

Früher wurde Gesichtserkennung mit handkodierten Zusammenhängen gebaut (Arca, Campadelli und Lanzarotti 2006): Das Bild wird mathematisch transformiert, die typische Form von Gesichtselementen wie Nase, Mund und Auge wird mathematisch beschrieben, und daraus entsteht ein Gesichtsmodell mit individuellen Eigenschaften.

Heute bekommt ein tiefes künstliches neuronales Netz lediglich viele Beispielbilder. Es lernt die Features und ihre schrittweise Zusammenfassung selbst. Das funktioniert nach der Folie "um Welten besser", und derselbe Algorithmus ist nicht auf eine einzelne Anwendung wie Gesichtserkennung beschränkt.

## 3. Überwachtes, unüberwachtes und bestärkendes Lernen

### Überwachtes Lernen

![[pictures/ai4iot/01/Lecture01_Pg010_Berwachtes_Lernen.png]]

<p class="image-caption">Überwachtes Lernen: gelabelte Äpfel und Birnen, Modelltraining und Prognose mit Konfidenz.</p>

Beim überwachten Lernen liegen Trainingsdaten mit dem gewünschten Ergebnis vor, also gelabelte Daten (im Folienbeispiel Bilder von Äpfeln und Birnen). Im Modelltraining werden die Modellparameter angepasst. Das trainierte Modell liefert dann für neue Objekte eine Prognose mit einer Sicherheit ("Apfel, x % sicher"). Eingesetzt wird es vor allem für Klassifikation (Bestimmung einer Klasse) und Regression (Vorhersage eines Wertes).

### Unüberwachtes Lernen

![[pictures/ai4iot/01/Lecture01_Pg011_Un_Berwachtes_Lernen.png]]

<p class="image-caption">Unüberwachtes Lernen: Die Methode findet in ungelabelten Daten Gruppen und Ausreißer.</p>

Beim unüberwachten Lernen ist das gewünschte Ergebnis unbekannt, die Daten sind ungelabelt. Die Methode findet selbst Strukturen, etwa Gruppen und Ausreißer. Typische Einsätze sind Clustering (Gruppierung), Dimensionsreduktion (Zusammenfassen mehrerer Datenspalten) und Ausreißererkennung.

### Bestärkendes Lernen

![[pictures/ai4iot/01/Lecture01_Pg012_Best_Rkendes_Lernen.png]]

<p class="image-caption">Bestärkendes Lernen: Ein Aktor wählt Handlungen und lernt aus Belohnungen und Bestrafungen (Comi 2018).</p>

Beim Reinforcement Learning kann ein Programm (der "Aktor") zwischen Handlungen wählen. Diese führen zu positiven oder negativen Ergebniswerten, also Belohnungen oder Bestrafungen. Gelernt wird, indem die Handlungsstrategie (das Modell) so angepasst wird, dass sie die erwartete langfristige Ergebnissumme fortlaufend besser vorhersagt (Comi 2018). Es gibt beeindruckende Showcases bei Brettspielen, Videospielen und mathematischen Beweisen, und RLHF (Reinforcement Learning from Human Feedback) ist ein wichtiger Ansatz im Post-Training und Alignment von Sprachmodellen. In der Praxis bleibt RL sonst eher bei Nischenanwendungen wie der Robotik. Die Herausforderung ist der Trainingsaufwand.

## 4. Gelabelte Trainingsdaten als Engpass

![[pictures/ai4iot/01/Lecture01_Pg013_Gelabelte_Trainingsdaten_Als_Engpass.png]]

<p class="image-caption">Plantix erkennt kranke Pflanzen per Foto. Die gelabelten Trainingsdaten sind hier die strategische Ressource.</p>

Überwachtes Lernen braucht gelabelte Trainingsdaten, und hochwertige Trainingsdaten können gerade im IIoT eine strategische Ressource sein. Das Folienbeispiel ist Plantix, eine App, die kranke Pflanzen per Foto mit ML- und DL-Techniken erkennt (laut Screenshot über 550 Pflanzenkrankheiten).

### Strategien gegen Datenmangel

![[pictures/ai4iot/01/Lecture01_Pg014_Strategien_Gegen_Datenmangel.png]]

<p class="image-caption">Sieben Strategien gegen fehlende Trainingsdaten, von Self-supervised Learning bis zur ML-basierten Datengenerierung.</p>

Gegen fehlende Trainingsdaten gibt es etablierte Strategien:

| Strategie                    | Idee                                                                                                        |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------- |
| Self-supervised Learning     | Generische Basis-Features mit sogenannten Pretext Tasks lernen und für spezifische Klassifikationen nutzen. |
| Semi-supervised Learning     | Labels über Ähnlichkeiten oder Gruppierungen auf ungelabelte Daten übertragen.                              |
| Transfer Learning            | Vorbereitete allgemeine Modelle mit wenigen speziellen Trainingsdaten anpassen.                             |
| Data Augmentation            | Neue Trainingsdaten durch Modifikation vorhandener erzeugen.                                                |
| Simulation                   | Trainingsdaten mit Simulationsmodellen erzeugen.                                                            |
| Direkte Datengenerierung     | Trainingsdaten mit einfachen Regeln erzeugen, etwa aus statistischen Verteilungen.                          |
| ML-basierte Datengenerierung | Spezielle ML-Modelle erzeugen Daten, etwa Generative Adversarial Networks für Bilder.                       |

Ein Grundbestand an fehlerfreien, gelabelten Daten ist trotzdem immer nötig, und zwar umso mehr, je spezieller die Aufgabe ist.

## 5. Diskriminative und generative KI

![[pictures/ai4iot/01/Lecture01_Pg015_Diskriminative_Und_Generative_Ki.png]]

<p class="image-caption">Diskriminative und generative KI nach Weisz, Muller, He und Houde.</p>

Weisz, Muller, He und Houde unterscheiden zwei Arten von KI. Diskriminative KI bestimmt, zu welcher Klasse oder Gruppe eine Dateninstanz gehört. Klassifikations- und Clustering-Algorithmen sind Beispiele dafür. Generative KI produziert Artefakte als Ausgabe, statt Entscheidungsgrenzen zu bestimmen. Dazu kommt Variabilität: Für dieselbe Eingabe kann ein generatives System viele verschiedene Ausgaben erzeugen, von denen mehrere gültig sein können.

## 6. Methoden der diskriminativen KI im Überblick

![[pictures/ai4iot/01/Lecture01_Pg016_Methoden_Der_Diskriminativen_Ki_Im_Berblick.png]]

<p class="image-caption">Die fünf Aufgaben der diskriminativen KI mit ihren typischen Methoden.</p>

| Aufgabe                       | Typische Methoden                                                                                                                              |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| Abweichungsanalyse            | Extremwertbestimmung, statistische Ausreißerbestimmung, dichtebasierte und modellbasierte Methoden                                             |
| Assoziationsanalyse           | Korrelationsanalyse, spezifische Assoziationsanalyse-Methoden                                                                                  |
| Gruppenbildung / Clustering   | Hierarchische, dichtebasierte, partitionierende und modellbasierte Verfahren, KNN (insbesondere Self-Organizing Maps)                          |
| Klassifikation                | Nächste-Nachbarn-Klassifikation, Klassifikationsbäume und -wälder, SVMs, Bayes-Verfahren (Naive Bayes), logistische Regression, KNN            |
| Wirkungsprognose / Zeitreihen | Regressionsmethoden, ARIMA, State Space Models (Hidden Markov Models), GARCH, Klassifikationsmethoden zur Wertvorhersage, Spektralanalyse, KNN |

Dazu kommen Varianten und Kombinationen sowie Ansätze für spezielle Inhaltstypen: Bilder, Videos, Texte, Sprache, Geodaten, Prozesse sowie Netzwerke und Graphen.

### Innovationsdynamik

![[pictures/ai4iot/01/Lecture01_Pg017_Innovationsdynamik.png]]

<p class="image-caption">62.249 arXiv-Paper in einem Jahr, neue Datenquellen, Agenten und neue Regulierung.</p>

Data Mining und Machine Learning entwickeln sich sehr schnell. Auf der Pre-Publishing-Plattform arXiv erschienen in einem Jahr (Stichtag 11.10.2026) 62.249 Paper zu Machine Learning und AI. Die Folie nennt vier Treiber:

- Rasante Fortschritte bei der Verarbeitung von Bildern, Videos und Audio sowie bei der Generierung und Manipulation von Inhalten.
- Neue Anwendungsfelder durch neue Datenquellen (Shared und Open Data, Social Media) und einfacheren Zugang zu Technologie (auch Open-Source-Sprachmodelle, Cloud-Plattformen, NoCode/LowCode-AI).
- Modelle, die mehrstufige Aufgaben auf Nutzeranfrage ausführen und dabei Werkzeuge aufrufen ("Agenten" auf Basis von LLMs).
- Ein dynamisches Umfeld: EU AI Act, EU Data Act (seit 12.09.2025), geopolitische Spannungen, Zölle und Handelsbeschränkungen.

## 7. Abweichungsanalyse

![[pictures/ai4iot/01/Lecture01_Pg018_Abweichungsanalyse.png]]

<p class="image-caption">Abweichungsanalyse: Ausreißer nach Aggarwal (2017) und Anwendungen von der Störungserkennung bis zur Fraud Detection.</p>

Die Abweichungsanalyse identifiziert und analysiert Ausreißer (Outlier). Ein Ausreißer ist "eine Beobachtung, die so weit von anderen Beobachtungen abweicht, dass Zweifel daran aufkommen, ob ihre Entstehung nicht auf einen anderen Mechanismus zurückzuführen ist" (Aggarwal 2017, übersetzt). Anwendungen sind Qualitätsmanagement und Störungserkennung, Fraud Detection (etwa Lieferbetrug), Web-Log-Analysen für die Internetsicherheit sowie Datenqualitätsmanagement und Datenvorverarbeitung.

### Ausreißer oder Anomalie?

![[pictures/ai4iot/01/Lecture01_Pg019_Ausrei_Er_Oder_Anomalie.png]]

<p class="image-caption">Links wahrscheinlich eine Anomalie, rechts unklar, ob Anomalie oder Rauschen (nach Aggarwal 2017).</p>

Teilweise wird zwischen Outlier und Anomalie unterschieden. Ein Outlier kann ein erwartbares Resultat der Verteilung oder von Rauschen sein. Eine Anomalie ist ein Outlier, der einer besonderen Erklärung bedarf. Aggarwal zeigt das an zwei Streudiagrammen der angeforderten Maße zweier Produktfeatures: Ein Punkt weit weg von einer dichten Punktwolke ist wahrscheinlich eine Anomalie, ein Punkt am Rand einer locker streuenden Wolke kann ebenso gut Rauschen sein.

## 8. Klassifikation

![[pictures/ai4iot/01/Lecture01_Pg020_Klassifikation.png]]

<p class="image-caption">Klassifikation nach Han und Kamber (2006) mit Anwendungen in Produktion und Prozessanalyse.</p>

Klassifikation ist "der Prozess, ein Modell zu finden, das Datenklassen beschreibt und unterscheidet, um damit die Klasse von Objekten vorherzusagen, deren Klassenzuordnung noch unbekannt ist" (Han und Kamber 2006, übersetzt). Anwendungen im IIoT:

- Einflussfaktoren auf die Qualität komplexer Produktionsvorgänge in der Prozessindustrie bestimmen.
- Störungen, Defekte und Schadteile in der Produktion klassifizieren.
- Prozessverläufe in der Prozessanalyse klassifizieren.
- Personen(gruppen), Fahrzeuge, Ladungsträger oder allgemein Objekte identifizieren und damit zählen.

### Klassifikationsbaum und Methodenauswahl

![[pictures/ai4iot/01/Lecture01_Pg021_Klassifikationsbaum_Und_Methodenauswahl.png]]

<p class="image-caption">Ein Klassifikationsbaum sagt das Lieblingsgenre aus Alter, Verstädterung, Fitness und Geschlecht vorher.</p>

![[pictures/ai4iot/01/Lecture01_Pg022_Klassifikationsbaum_Und_Methodenauswahl.png]]

<p class="image-caption">Gängige Klassifikationsmethoden. In der Praxis werden mehrere parallel gerechnet und die beste gewählt.</p>

Das Folienbeispiel ist ein Klassifikationsbaum, der das Lieblingsgenre (Science Fiction, Fantasy, Games, Superheroes) über Attribute wie Alter, Verstädterung, Fitness und Geschlecht vorhersagt. Gängige Methoden sind k-Nächste-Nachbarn, Klassifikationsbäume und -wälder, logistische Regression, Bayes-Klassifikatoren, Support Vector Machines und neuronale Netze. In der Modellerstellung rechnet man häufig mehrere Methoden und Varianten parallel und wählt bei Validierung und Test die mit der besten Klassifikationsgüte und Performance.

## 9. Clustering

![[pictures/ai4iot/01/Lecture01_Pg023_Clustering.png]]

<p class="image-caption">Clustering nach Han und Kamber (2006) und typische Anwendungen.</p>

![[pictures/ai4iot/01/Lecture01_Pg024_Clustering.png]]

<p class="image-caption">Derselbe Datensatz mit agglomerativem Clustering (Average Linkage und Ward), k-Means und DBSCAN.</p>

Clustering gruppiert physische oder abstrakte Objekte zu Klassen ähnlicher Objekte. Ein Cluster ist eine Menge von Datenobjekten, die untereinander ähnlich und zu Objekten anderer Cluster unähnlich sind (Han und Kamber 2006). Anwendungen sind die Gruppierung von Prozessen, Produkten, Prozessverläufen, Websuchanfragen und von Fehlern samt dem Kontext ihres Auftretens.

Die Folie zeigt denselben Datensatz mit vier Verfahren geclustert: agglomerativ mit Average Linkage, agglomerativ nach Ward, k-Means und DBSCAN. Die Gruppen fallen je nach Verfahren deutlich anders aus.

## 10. Wirkungsprognosen, Regression und Zeitreihenanalyse

![[pictures/ai4iot/01/Lecture01_Pg025_Wirkungsprognosen_Regression_Und_Zeitreihenanalyse.png]]

<p class="image-caption">Regressionsanalyse und Beispiele für Wirkungsprognosen.</p>

Eine Regressionsanalyse deckt funktionale Abhängigkeiten ausgewählter (abhängiger) Attribute von einem oder mehreren (unabhängigen) Attributen auf und beschreibt sie mathematisch. Die Modelle dienen vor allem der Wirkungsprognose. Beispiele:

- Umsatz eines Kunden aus Nutzungsart und -intensität eines physischen Guts prognostizieren.
- Defektquote abhängig von Temperatur und Luftfeuchtigkeit vorhersagen.
- Einfluss von Produktmaßen und -gewicht auf die Lieferzeit bestimmen.
- Reklamationsquote abhängig von der Anzahl der Störungsmeldungen erklären.

### Zeitreihenanalyse

![[pictures/ai4iot/01/Lecture01_Pg026_Zeitreihenanalyse.png]]

<p class="image-caption">Zeitreihenanalyse als Spezialfall: Abhängigkeit von der Zeit, oft mit Streaming-Daten.</p>

![[pictures/ai4iot/01/Lecture01_Pg027_Zeitreihenanalyse.png]]

<p class="image-caption">Lineare Regression, Holt-Glättung, ein SARIMA-Modell für Helpdesk-Anfragen und ein Hidden-Markov-Modell.</p>

Der Spezialfall, bei dem die Abhängigkeit von der Zeit aufgedeckt wird, ist die Zeitreihenanalyse. Betriebswirtschaftlich dient sie der Planung und Budgetierung (Umsatz- und Kostenverläufe) und der Vorhersage von Nutzungsintensitäten, Verbräuchen und Mängelhäufigkeiten. Viele Anwendungen arbeiten mit fortlaufend eintreffenden Werten (Streaming-Daten), schreiben die Prognose laufend fort und passen das Modell eventuell laufend an. Die Folienbeispiele reichen von einer linearen Regression über exponentielle Glättung zweiter Ordnung (Holt, α = 0,5, β = 0,7) bis zu einem SARIMA-Modell für Helpdesk-Anfragen über drei Jahre und einem Hidden-Markov-Modell für Umsatzdaten.

## 11. Assoziationsanalyse

![[pictures/ai4iot/01/Lecture01_Pg028_Assoziationsanalyse.png]]

<p class="image-caption">Assoziationsanalyse: Wenn-Dann-Regeln zwischen Items, bekannt aus der Warenkorbanalyse.</p>

Assoziationsanalysen (Association Rule Mining) decken Abhängigkeiten zwischen Objekten bzw. Objekten mit bestimmten Attributausprägungen auf, den Items. Eine Menge von Items heißt Itemset. Die Ergebnisse werden als Wenn-Dann-Regeln gelesen. Das bekannteste Einsatzgebiet ist die Warenkorbanalyse ("Wenn Artikel x gekauft wird, wird auch Artikel y gekauft"). Weitere Anwendungen sind die Bestimmung von Problemursachen, Zusammenhänge in Texten, die Nutzung von Websites und die Analyse von Prozessen.

## 12. Künstliche Neuronale Netze

![[pictures/ai4iot/01/Lecture01_Pg029_K_Nstliche_Neuronale_Netze.png]]

<p class="image-caption">Künstliche neuronale Netze nach Schmidhuber (2014), vom Perceptron bis zum Deep Learning.</p>

Ein künstliches neuronales Netz besteht nach Schmidhuber (2014) aus vielen einfachen, verbundenen Prozessoren, den Neuronen, die jeweils reellwertige Aktivierungen erzeugen. Eingabeneuronen werden über Sensoren aktiviert, die anderen über gewichtete Verbindungen von zuvor aktiven Neuronen. Der Ansatz geht auf Rosenblatts Perceptron (1958) zurück, mehrlagige KNN gibt es seit den frühen 1960ern. Sie sind von echten Neuronen inspiriert, obwohl es große Unterschiede gibt.

KNN werden für das gesamte ML-Spektrum eingesetzt, vor allem für Klassifikation, Wirkungsprognose, Regression und Zeitreihenanalyse, dazu in speziellen Varianten für Clustering, Dimensionsreduktion, Datenbereinigung und Datengenerierung. Sie lohnen sich vor allem bei sehr vielen Attributen und stark verrauschten Daten. Bei einfachen Problemen sind SVMs oder Random Forests oft erfolgreicher, wobei sich das weiterentwickelt.

### Das künstliche Neuron

![[pictures/ai4iot/01/Lecture01_Pg030_Das_K_Nstliche_Neuron.png]]

<p class="image-caption">Ein künstliches Neuron: gewichtete Inputs, Netzeingabe, Aktivierungs- und Ausgabefunktion.</p>

Ein künstliches Neuron gewichtet seine Inputs 1 bis n mit den Gewichten w1 bis wn und summiert sie zur Netzeingabe. Eine Aktivierungsfunktion macht daraus einen Aktivierungswert, eine Ausgabefunktion den Output. Trainiert wird, indem die Gewichte angepasst werden. Rosenblatts Perceptron hatte binäre Inputs und als Aktivierungsfunktion eine einfache Schwellwertprüfung.

### Typen von KNN

![[pictures/ai4iot/01/Lecture01_Pg031_Typen_Von_Knn.png]]

<p class="image-caption">KNN unterscheiden sich nach Architektur, Aktivierungsfunktion, Ausgabefunktion und Lernregel.</p>

KNN unterscheiden sich in vier Dimensionen:

- **Netzarchitektur**: Anordnung und Verbindung der Neuronen, also Schichten, Zyklen (Feed-Forward oder rekurrent) und Art und Anzahl der Verbindungen (fully connected oder nur einige).
- **Aktivierungsfunktion**: wie die summierten, gewichteten Inputs in einen Output umgerechnet werden.
- **Ausgabefunktion**: insbesondere Umwandlung in 0/1-Werte für Klassifikation oder Durchreichen des Aktivierungswerts für Regression.
- **Lernregel**: der Algorithmus, der das Netz an die Trainingsdaten anpasst.

Der Klassiker ist ein Feed-Forward-Netz mit Backpropagation als Lernverfahren und der Sigmoid- bzw. logistischen Funktion als Aktivierung.

### Feed-Forward-Netz mit Hidden Layer

![[pictures/ai4iot/01/Lecture01_Pg032_Feed_Forward_Netz_Mit_Hidden_Layer.png]]

<p class="image-caption">Ein Feed-Forward-Netz mit Eingabe-, Hidden- und Ausgabeschicht und Bias-Unit.</p>

Ein Feed-Forward-Netz mit drei Schichten hat eine Eingabeschicht, eine verdeckte Schicht (Hidden Layer) und eine Ausgabeschicht. Mehrlagige KNN heißen auch Multilayer Perceptrons (MLP). Eine Bias-Unit (Unit 0) liefert immer 1 und bildet so Schwellenwerte ab. Das Gewicht der Kante von Unit i in Schicht k-1 zu Unit j in Schicht k heißt w_ij^(k).

### Ausgewählte Architekturen

![[pictures/ai4iot/01/Lecture01_Pg033_Ausgew_Hlte_Architekturen.png]]

<p class="image-caption">FFNN, RNN, Autoencoder, CNN, LSTM, GAN, Diffusion Models und Transformer im Überblick.</p>

- **Feed-Forward-Netze (FFNN)**: Verbindungen von der Eingabe zur Ausgabe, keine Zyklen, keine Verbindungen innerhalb einer Schicht.
- **Recurrent Neural Networks (RNN)**: Netze mit Rückkopplungen. Sie haben dadurch ein Gedächtnis bzw. einen Zustand.
- **Autoencoder**: FFNN, die unüberwacht lernen, Daten zu komprimieren. Das Netz hat Sanduhrform, der gelernte Code steht in der schmalsten Mittelschicht.
- **Convolutional Neural Networks (CNN)**: Feed-Forward-Variante für Bilderkennung, die Bereiche des Inputs nach Features abtastet und die Ergebnisse schichtweise zusammenfasst.
- **Long Short-Term Memory (LSTM)**: RNN-Variante, die explizit vergessen und Informationen langfristig speichern kann.
- **Generative Adversarial Networks (GAN)**: Ein Teilnetz lernt, Output zu erzeugen, ein anderes lernt parallel, erzeugte von echten Inhalten zu unterscheiden.
- **Diffusion Models**: Trainingsdaten werden verrauscht, und das Netz lernt, die Originale zu rekonstruieren, und damit, neue Daten zu erzeugen.
- **Transformer**: Netze, die Sequenzen wie Sätze in andere Sequenzen überführen oder fortschreiben, inzwischen auch für viele nichttextuelle Inhalte.

Dazu kommen viele weitere Architekturen und beliebige Kombinationen.

### Woher kommt der Deep-Learning-Boom?

![[pictures/ai4iot/01/Lecture01_Pg034_Woher_Kommt_Der_Deep_Learning_Boom.png]]

<p class="image-caption">Vier Gründe für den Deep-Learning-Boom: Daten, GPUs, ReLU und neue Architekturen.</p>

- **Trainingsdaten**: Je mehr Gewichte, desto mehr Trainingsdaten braucht ein Netz. Big Data mit vielen gelabelten Datensätzen macht tiefe Netze erst trainierbar.
- **Rechenkapazität**: Tiefe Netze sind erst mit GPUs sinnvoll und halbwegs interaktiv trainierbar. GPUs sind auf parallele Gleitkommaoperationen ausgelegt und kommen ursprünglich aus dem Gaming-Markt.
- **Aktivierungsfunktion**: In den Hidden Layern hat ReLU die Sigmoid-Funktion abgelöst.
- **Neue Architekturen**: CNN, RNN/LSTM/GRU, Deep Reinforcement Models, GANs, Deep Autoencoder, Diffusion Models und Diffusion Transformer, Attention-Netze bzw. Transformer, multimodale Transformer und Transformer mit Test-Time Compute.

## 13. Convolutional Neural Networks

![[pictures/ai4iot/01/Lecture01_Pg035_Convolutional_Neural_Networks.png]]

<p class="image-caption">Convolutional Neural Networks: Geschichte von Fukushima bis AlexNet und das Funktionsprinzip.</p>

CNNs werden für Bildklassifikation, Object Detection und Image Segmentation eingesetzt und sind vom visuellen Kortex inspiriert. Erste Ansätze gibt es seit 1980 (Fukushima), später kamen weitere Ideen wie das Pooling dazu. Ab 2012 gab es Durchbrüche in der Bildklassifikation (AlexNet), ab etwa 2015 wurden zunehmend betriebliche Anwendungsfelder erschlossen. Die Hoffnung auf vollautomatisiertes Fahren (Level 4 und 5), für die CNNs die Grundlage sind, hat sich bisher nicht erfüllt.

Das Funktionsprinzip: Ein Filter (Convolutional Map) fährt über die Ausgangsdaten und sucht ein bestimmtes Muster in jedem Bildausschnitt, über alle Farbkanäle. Das Ergebnis ist eine Feature Map, die zeigt, wo welche Muster zu finden sind. Viele verschiedene Filter bilden eine Faltungsschicht (Convolutional Layer). Pooling Layer fassen die Feature Maps zusammen, und am Schluss bestimmen eine oder mehrere vollvernetzte Schichten das Ergebnis. Trainiert wird mit Backpropagation, die Filter werden also gelernt und nicht vorgegeben. CNNs haben sich bei Bild-, Video- und Tonanalyse und bei maschineller Übersetzung (etwa frühe Versionen von DeepL) bewährt. Es wird weiter experimentiert, zum Beispiel mit Hyena Hierarchy als Ersatz für Transformer.

### Ein Filter auf einem Bildausschnitt

![[pictures/ai4iot/01/Lecture01_Pg038_Ein_Filter_Auf_Einem_Bildausschnitt.png]]

<p class="image-caption">Ein Filter für eine Kurve wird auf einen Bildausschnitt gelegt und liefert ReLU(5862) = 5862.</p>

Ein Filter ist eine Gruppe künstlicher Neuronen, die ein Feature in einem Bildausschnitt erkennt. Im Folienbeispiel ist das Feature eine Kurve. Der Filter hat an den Positionen der Kurve hohe Gewichte (2 und 3), daneben kleine negative Gewichte. Er wird auf einen Bildausschnitt mit den passenden Pixelwerten (um 180) gelegt: Jeder Pixelwert wird mit dem Gewicht an seiner Stelle multipliziert, alles wird summiert, und ReLU wird angewendet. Das ergibt ReLU(5862) = 5862, also eine starke Aktivierung. Auch hier gilt, dass die Filterwerte mit Backpropagation gelernt werden (nach Chatterjee 2017 und Deshpande 2016).

### Activation Map und Pooling

![[pictures/ai4iot/01/Lecture01_Pg039_Activation_Map_Und_Pooling.png]]

<p class="image-caption">Der Filter läuft über jeden Ausschnitt und erzeugt die Activation Map.</p>

![[pictures/ai4iot/01/Lecture01_Pg040_Activation_Map_Und_Pooling.png]]

<p class="image-caption">Max-Pooling verdichtet die Activation Map, eine vollvernetzte Schicht klassifiziert am Ende.</p>

Der Filter wird auf jeden denkbaren Ausschnitt angewendet. Das Ergebnis ist die Activation Map, die angibt, wo und wie deutlich ein Feature im Bild auftritt. Auf die Activation Maps lässt sich das Verfahren erneut anwenden, und so entstehen Features aus Features: Aus Kreisen werden zum Beispiel Augen.

Damit das handhabbar bleibt, verdichtet ein Max-Pool-Layer die Activation Map, indem er für Ausschnitte den Maximalwert bildet (Average- oder Min-Pooling geht auch). Am Ende steht eine klassische vollvernetzte Schicht mit Sigmoid-Funktion, die die eigentliche Klassifikation macht.

### Gesamtarchitektur eines CNN

![[pictures/ai4iot/01/Lecture01_Pg041_Gesamtarchitektur_Eines_Cnn.png]]

<p class="image-caption">Ein CNN unterscheidet Mitarbeiter und Einbrecher über Convolution, Pooling und einen Fully Connected Layer.</p>

Das Folienbeispiel klassifiziert ein Foto als "Mitarbeiter" oder "Einbrecher": Eingangsdaten, dann ein Convolutional Layer für elementare Features, ein Pooling Layer, der Werte zusammenfasst, ein weiterer Convolutional Layer für zusammengesetzte Features, weitere Convolutional- und Pooling-Layer für immer höherwertige Features und am Ende ein Fully Connected Layer für die Klassifikation. Inzwischen werden CNNs auch für andere Gebiete wie maschinelle Übersetzung oder Prozessanalyse eingesetzt.

### Beispiele: Tablettenerkennung und AlexNet

![[pictures/ai4iot/01/Lecture01_Pg042_Beispiele_Tablettenerkennung_Und_Alexnet.png]]

<p class="image-caption">Tablettenzählen für Pflegeprozesse mit einem anpassbaren neuronalen Netz (Dang 2022).</p>

![[pictures/ai4iot/01/Lecture01_Pg043_Beispiele_Tablettenerkennung_Und_Alexnet.png]]

<p class="image-caption">Real gelernte Filter von AlexNet (Krizhevsky et al. 2012).</p>

![[pictures/ai4iot/01/Lecture01_Pg044_Beispiele_Tablettenerkennung_Und_Alexnet.png]]

<p class="image-caption">AlexNet-Klassifikationen mit den fünf wahrscheinlichsten Klassen pro Bild.</p>

Anpassbare KNN zählen in der Bilderkennung zum Beispiel Tabletten für Pflegeprozesse (Dang 2022): Das Netz markiert jede Pille mit einer Box und einer Konfidenz zwischen 0,53 und 0,97.

Krizhevsky et al. (2012) zeigen in ihrem AlexNet-Paper die real gelernten Filter der ersten Schicht und Klassifikationsergebnisse mit den fünf wahrscheinlichsten Klassen pro Bild, etwa Milbe, Containerschiff, Motorroller und Leopard.

### Transfer Learning

![[pictures/ai4iot/01/Lecture01_Pg045_Transfer_Learning.png]]

<p class="image-caption">Transfer Learning: tiefe Schichten einfrieren, höhere anpassen oder ersetzen.</p>

Tiefe Netze brauchen sehr viele gelabelte Trainingsbeispiele, in der Bilderkennung zwischen 1.000 und 10.000 pro Klasse. Der Trainingsdatenbestand wird so zu einer wettbewerbsrelevanten Ressource. Transfer Learning reduziert den Aufwand mit vortrainierten Netzen: Die tieferen Schichten mit den grundlegenden Features werden eingefroren (freeze), die höheren angepasst (tune) oder durch neue Schichten ersetzt. Gängige Deep-Learning-Frameworks liefern dafür vortrainierte Netze wie VGG, Inception, Xception oder ResNet mit.

## 14. Generative Deep-Learning-Modelle

![[pictures/ai4iot/01/Lecture01_Pg046_Generative_Deep_Learning_Modelle.png]]

<p class="image-caption">GANs, Variational Autoencoder, Latent Diffusion Models und Transformer als Vertreter der GenAI.</p>

Generative AI zielt auf die Erstellung digitaler Inhalte (Text, Audio, Video) und nutzt dafür in den Trainingsdaten gelernte Eigenschaften und Muster (Banh und Strobel 2023, Janiesch et al. 2021). Diskriminative AI sagt dagegen Wahrscheinlichkeiten von Werten oder Datenobjekten vorher. Die wesentlichen Vertreter:

- **Generative Adversarial Networks (GANs)**: ein Meilenstein der GenAI, mit iterativ und verzahnt entwickelten Teilnetzen für das Erzeugen (Generator) und das Erkennen erzeugter Objekte (Discriminator).
- **Deep Variational Autoencoder (VAE)**: lernen, Datenobjekte zu komprimieren und aus der komprimierten Fassung die Objekte oder ihre Verteilung zu regenerieren.
- **Latent Diffusion Models**: erzeugen hochwertige Datenobjekte, indem sie schrittweises Verrauschen umkehren lernen (Rombach et al. 2022).
- **Transformer**: lernen, die Elemente einer Sequenz wechselseitig zueinander in Beziehung zu setzen (Attention). Sie sind die Grundlage aktueller Sprachmodelle und werden auch für Bilder eingesetzt (Image Transformer).

### Generative Adversarial Networks

![[pictures/ai4iot/01/Lecture01_Pg047_Generative_Adversarial_Networks.png]]

<p class="image-caption">Ein GAN: Generator und Discriminator trainieren gegeneinander.</p>

![[pictures/ai4iot/01/Lecture01_Pg049_Generative_Adversarial_Networks.png]]

<p class="image-caption">Die Netze wurden schnell besser: drei generierte Gesichter von thispersondoesnotexist.com.</p>

Ein GAN besteht aus zwei Netzen. Das Generator-Netz (etwa ein De-Convolutional Network) macht aus zufälligen Eingabewerten ein Bild. Das Discriminator-Netz (etwa ein CNN) bekommt zufällig ein echtes Trainingsbild oder ein generiertes und entscheidet "echt" oder "generiert". Erkennt der Discriminator falsch, wird er verbessert. Erkennt er ein generiertes Bild korrekt, wird der Generator angepasst. GANs waren der Startschuss für das Thema Generative AI. Die Qualität der ersten GANs (Goodfellow et al. 2014) war noch überschaubar, die Netze wurden aber schnell besser, wie die fotorealistischen Gesichter auf thispersondoesnotexist.com zeigen.

### Deep Autoencoder

![[pictures/ai4iot/01/Lecture01_Pg050_Deep_Autoencoder.png]]

<p class="image-caption">Ein Deep Autoencoder komprimiert den Input auf einen Code und rekonstruiert ihn daraus.</p>

![[pictures/ai4iot/01/Lecture01_Pg051_Deep_Autoencoder.png]]

<p class="image-caption">Variational, Denoising und Anomalie-Autoencoder, mit generierten Gesichtern als Beispiel.</p>

Ein Deep Autoencoder verdichtet unstrukturierte Daten. Der Encoder komprimiert den Input auf einen Code in der schmalsten Schicht, der Decoder rekonstruiert daraus den Input. Trainiert wird, indem die Abweichung zwischen Output und Input minimiert wird. Daraus ergeben sich mehrere Einsätze:

- **Variational Autoencoder** lernen Verteilungen statt konkreter Werte und eignen sich für GenAI, etwa für Bildgenerierung (im Folienbeispiel Gesichter), für die Entwicklung neuer Materialien oder für Recommender Systems.
- **Denoising Autoencoder** lernen, "korrekte" Daten aus fehlerhaften zu erzeugen.
- Für die **Anomalieerkennung** dient der Rekonstruktionsfehler als Feature: Was das Netz schlecht rekonstruiert, ist wahrscheinlich ungewöhnlich.

### Latent Diffusion Models

![[pictures/ai4iot/01/Lecture01_Pg052_Latent_Diffusion_Models.png]]

<p class="image-caption">Latent Diffusion: Ein Bild wird schrittweise verrauscht, und das Netz lernt das Entrauschen (Rombach et al. 2022).</p>

Ein Ausgangsbild wird schrittweise verrauscht. Ein neuronales Netz lernt, das Original schrittweise zu reproduzieren, unter Berücksichtigung einer Beschreibung, und damit, neue Bilder zu erzeugen (Rombach et al. 2022).

## 15. Recurrent Neural Networks und LSTMs

![[pictures/ai4iot/01/Lecture01_Pg053_Recurrent_Neural_Networks_Und_Lstms.png]]

<p class="image-caption">Ein RNN prognostiziert den Zustand einer Reinigungsmaschine und gibt einen Statuswert an den nächsten Zeitpunkt weiter.</p>

![[pictures/ai4iot/01/Lecture01_Pg055_Recurrent_Neural_Networks_Und_Lstms.png]]

<p class="image-caption">LSTMs entscheiden mit Gates, was behalten und was vergessen wird.</p>

Für Sequenzen und Zeitreihen gibt es Recurrent Neural Networks, bei denen Outputs wieder in das Netz eingehen. Im Folienbeispiel bekommt das Netz zum Zeitpunkt t Zustand, Leistungsstufe, Temperatur, Verschmutzung und die gereinigten Quadratmeter einer Reinigungsmaschine, berechnet über mehrere Schichten eine Prognose des Zustands und gibt einen Statuswert als zusätzlichen Input an den Zeitpunkt t+1 weiter. Aufgerollt über die Zeit sieht ein RNN wie eine Kette von Kopien aus. Trainiert wird es mit Backpropagation Through Time.

LSTMs setzen Gates (Subnetze) ein, die entscheiden, was behalten und was vergessen wird. Gated Recurrent Units (GRUs) arbeiten ähnlich. Weil sie weniger rechenintensiv sind als die Transformer großer Sprachmodelle, sind sie für IIoT-Anwendungen interessant.

## 16. Transformer-Netze

![[pictures/ai4iot/01/Lecture01_Pg056_Transformer_Netze.png]]

<p class="image-caption">Transformer: Sequence-to-Sequence Learning, die ganze Sequenz auf einmal und Attention.</p>

Transformer sind für Sequenzen von Daten gemacht, etwa Sätze, die übersetzt oder fortgeführt werden sollen (Sequence-to-Sequence Learning). Erfunden wurden sie am 6.12.2017 von Vaswani et al. (Google Brain) in "Attention is all you need". Ein Encoder berechnet Codes für die Eingabesequenz, ein Decoder daraus die Ausgabesequenz. Einsatzbereiche sind maschinelle Übersetzung, Chatbots, Textgeneratoren und Bildgenerierung, und es kommen laufend neue dazu. Zwei Ideen tragen die Architektur:

1. Statt eine Datenreihe wie bei RNN und LSTM Stück für Stück einzugeben, bekommt das Netz die ganze Sequenz auf einmal. Die Position wird über einen Positionsmarker berücksichtigt, der im Lernprozess als Input mitläuft.
2. Attention: Für ein einzelnes Element (etwa das Wort "Löwe") wird bestimmt, wie alle anderen Elemente davon abhängen (etwa ein späteres Relativpronomen "der"). Multi-Head Attention berücksichtigt mehrere solche Zusammenhänge und Bedeutungskontexte parallel.

### Embeddings und Tokens

![[pictures/ai4iot/01/Lecture01_Pg057_Embeddings_Und_Tokens.png]]

<p class="image-caption">Embeddings sind Vektoren, deren Richtung Bedeutung kodiert. Tokens sind häufige Zeichenfolgen.</p>

![[pictures/ai4iot/01/Lecture01_Pg059_Embeddings_Und_Tokens.png]]

<p class="image-caption">Tokens sind alles, was ein GPT-Modell sieht. Deshalb wird aus dem umgedrehten Lollipop pillopol.</p>

ML- und DL-Verfahren rechnen mit Zahlen, nicht mit Texten. Früher kodierte man Wörter per One-Hot-Encoding (1 für "Wort enthalten", 0 für "nicht enthalten") oder mit willkürlichen Nummern. Besser sind Zahlenwerte, die Ähnlichkeit ausdrücken: Der Wert für "Hund" sollte näher an "Katze" liegen als an "Bank". Weil hinter Wörtern vielschichtige Bedeutungen, Synonyme und Homonyme stehen, braucht es dafür viele Dimensionen, die jeweils Bedeutungsbestandteile repräsentieren. Ein solcher Vektor für ein Wort, einen Satz oder ein Dokument heißt Embedding.

- Embeddings werden mit ML gelernt, durch Training großer DL-Modelle auf großen Textbeständen.
- Ähnlichkeit misst man mit der Kosinus-Ähnlichkeit: Zeigen zwei Vektoren in dieselbe Richtung, ist der Winkel klein und die Ähnlichkeit hoch.
- Transformer arbeiten mit fertigen Embeddings für Tokens, also für häufige Zeichenfolgen wie Wörter oder Wortbestandteile (Byte-Pair Encoding). Sie können auch Embeddings für größere Texte wie Absätze, Artikel oder Kapitel berechnen. Ein GPT-Embedding eines Paper-Abstracts ist eine lange Liste von Zahlen.
- Mit Embeddings lassen sich wieder Ähnlichkeitssuchen, Klassifikationen und Clusterings rechnen.

Tokens sind das "Alphabet" der GPT-Modelle, und der Tokenizer ist sichtbar nicht auf Deutsch optimiert, weil deutsche Wörter in viele Stücke zerfallen. Tokens sind alles, was ein GPT-Modell sieht. Deshalb scheitert es an Aufgaben auf Buchstabenebene: Gebeten, "Lollipop" umzudrehen, antwortet es "pillopol".

### Die Transformer-Architektur

![[pictures/ai4iot/01/Lecture01_Pg061_Die_Transformer_Architektur.png]]

<p class="image-caption">Die Transformer-Architektur nach Vaswani et al. (2017).</p>

Die Folien gehen das Architekturdiagramm von Vaswani et al. (2017) Schritt für Schritt durch:

1. **Input und Embedding**: Das Modell betrachtet eine lange Sequenz von Tokens auf einmal, das Kontextfenster (bei GPT-3 2.048 Tokens, bei GPT-4 8.000 bis 32.000). Jedes Token wird zu einem Embedding-Vektor, der beschreibt, wo es relativ zu den anderen Tokens des Vokabulars steht (50.257 Tokens). Bei GPT-3 hat der Vektor 12.288 Dimensionen.
2. **Positional Encoding**: Die Position im Text wird explizit mitberücksichtigt.
3. **Multi-Head Attention**: Für jedes Token wird berechnet, welche Relevanz jedes andere Token hat, und das mehrfach, um verschiedene semantische Kontexte einzufangen. Im Training werden Teile maskiert, die das Modell vorhersagen soll.
4. **Add & Norm und Feed Forward**: Die Ergebnisse werden normalisiert, zusammengefasst und mit einem normalen neuronalen Netz weiterverarbeitet. Dieser Block wiederholt sich mehrfach.
5. **Linear und Softmax**: Am Ende wird für jedes Token die Wahrscheinlichkeit berechnet, dass es als nächstes kommt. Alle Wahrscheinlichkeiten summieren sich zu 1, und das nächste Token wird mit dieser Wahrscheinlichkeit ausgewählt.

### GPT

![[pictures/ai4iot/01/Lecture01_Pg066_Gpt.png]]

<p class="image-caption">Generative, Pre-Trained, Transformer.</p>

GPT steht für drei Eigenschaften:

- **Generative**: Das Modell ist darauf ausgelegt, Inhalte zu erzeugen.
- **Pre-Trained**: Es wurde mit großen Mengen Text vortrainiert, um sprachliche Strukturen und Zusammenhänge zu lernen. Die eigentliche Anwendung (Downstream Task) setzt per Finetuning darauf auf. ChatGPT ist eine solche Anwendung: ein mit menschlichen Ratern feinjustiertes Konversationsmodell auf Basis von GPT-3.5 oder GPT-4.
- **Transformer**: Es folgt der Transformer-Architektur und ist damit ein Deep-Learning-Modell, ein KNN mit vielen Schichten.

## 17. LLMs nutzen: Optionen und RAG

![[pictures/ai4iot/01/Lecture01_Pg067_Llms_Nutzen_Optionen_Und_Rag.png]]

<p class="image-caption">Optionen für den Einsatz von Transformer-Modellen, von der Eigenentwicklung bis zum direkten Prompt.</p>

Für den Einsatz von Transformer-Modellen gibt es eine Stufenleiter, von aufwendig bis einfach:

- **Eigenentwicklung** eines Sprachmodells ("viel Spaß!").
- **Finetuning** (Gewichtsanpassung) eines GPT-Modells, etwa mit vorbereiteten, gelabelten Daten (Supervised Finetuning, SFT) oder parametereffizient (PEFT).
- **APIs** der vortrainierten Modelle für Datenabfragen nutzen (Retrieval Augmented Generation, RAG). Frameworks wie LangChain erleichtern das.
- **Prompt Engineering**: gute Antworten gezielt herauskitzeln, eine Wissenschaft für sich (siehe etwa den Tree-of-Thoughts-Ansatz).
- **Direkte Nutzung** per Prompt an einen Chatbot, mit einem oder mehreren Beispielen (Single- oder Multi-Shot).

Alle Varianten sind auch über Cloud-Angebote nutzbar (etwa Microsoft Azure), mit Garantien, dass eigene Inputs nicht nach außen gehen.

### Halluzinationen am Beispiel Literaturrecherche

![[pictures/ai4iot/01/Lecture01_Pg068_Halluzinationen_Am_Beispiel_Literaturrecherche.png]]

<p class="image-caption">Eine Literaturrecherche mit ChatGPT: erfundene Artikel, falsche Jahre und echte, aber irrelevante Quellen (Herbst und Baars 2023).</p>

Der direkte Einsatz von LLMs ist oft noch problematisch. Paul Herbst und Henning Baars haben 2023 eine Literaturrecherche mit ChatGPT ausgewertet. Die Quellenliste enthielt Treffer, die nichts mit dem Thema zu tun hatten oder das falsche Jahr nannten, Artikel, die es nicht gibt, von Autoren, die es gibt und die im Bereich veröffentlicht haben, nicht akademische Vorlagen und echte Quellen, die leider nicht zum Thema passten.

### Retrieval Augmented Generation

![[pictures/ai4iot/01/Lecture01_Pg069_Retrieval_Augmented_Generation.png]]

<p class="image-caption">RAG auf den ersten Blick: Embeddings in eine Vektordatenbank, Suche und Antwort durch ein LLM.</p>

![[pictures/ai4iot/01/Lecture01_Pg077_Retrieval_Augmented_Generation.png]]

<p class="image-caption">RAG bei näherem Hinsehen: Infrastruktur, Personal, laufender Betrieb und Sicherheit (Do Rosaria 2024).</p>

Auf den ersten Blick ist es recht einfach, ein LLM in eine Lösung einzubetten. Dokumente oder Abstracts mit qualitätsgesicherten Inhalten gehen durch die Embedding-API eines LLM. Die Embeddings landen in einer Vektordatenbank, die auf solche Datenobjekte ausgelegt ist. Bei einer Anfrage sucht, gruppiert oder klassifiziert das System dort passende Inhalte, und ein LLM antwortet in natürlicher Sprache, eventuell ergänzt um Prompt Engineering und Fine-Tuning.

Bei näherem Hinsehen ist RAG weder trivial noch billig (Do Rosaria 2024). Dazu gehören Infrastrukturkosten (Vektordatenbank, Modell-Inferenz, Entwicklungs-, Test- und Produktivumgebungen, Backups, Monitoring), Personalkosten (ML-, DevOps- und Security-Spezialisten, Qualitätssicherung, Projektmanagement), laufende Kosten (Betrieb rund um die Uhr, Updates, Datenbereinigung, Compliance-Audits) und ein Sicherheitsproblem: Ein System mit Zugriff auf die gesamte Wissensbasis eines Unternehmens kann vertrauliche Daten preisgeben.

## 18. Scaling Laws und Test-Time Compute

![[pictures/ai4iot/01/Lecture01_Pg070_Scaling_Laws_Und_Test_Time_Compute.png]]

<p class="image-caption">Neural Scaling Laws: MMLU-Performance gegen Trainings-Compute, und was das für Strom und Rechenzentren bedeutet.</p>

Neural Scaling Laws beschreiben den Zusammenhang zwischen Inputgrößen und Modellperformance. Die Inputgrößen sind die Modellgröße (Anzahl der Parameter bzw. Gewichte), die Größe des Trainingsdatensatzes und der Rechenaufwand (FLOPs) bzw. die Trainingskosten. Manche beobachten Emergent Abilities, also abruptes Erlernen neuer Fähigkeiten wie Arithmetik, das aber auch ein Messartefakt sein könnte. Das Problem: Die Leistung wächst logarithmisch, während der Rechenbedarf und damit Kosten und CO2 explodieren. Die Folie nennt als Konsequenzen das xAI-Rechenzentrum "Colossus", das 150 MW für 100.000 GPUs braucht, ein geplantes 100-Milliarden-Dollar-Rechenzentrum von Microsoft und OpenAI und Saudi-Arabiens 100 Milliarden Dollar für KI-Infrastruktur ("Project Transcendence").

### Skalierungsgrenzen und Test-Time Compute

![[pictures/ai4iot/01/Lecture01_Pg071_Skalierungsgrenzen_Und_Test_Time_Compute.png]]

<p class="image-caption">Skalierungsgrenzen, neue Architekturen und Test-Time Compute mit Best-of-N, Beam Search und Lookahead Search (Snell et al. 2024).</p>

Ob die Scaling Laws weiter gelten, ist unklar. Es gibt kaum neue Trainingsdaten, die Modelle werden prohibitiv teuer und energiehungrig, und zuletzt gab es bei regulären LLMs kaum größere Leistungssprünge. Deshalb wird experimentiert:

- **Neue oder wiederentdeckte Architekturen**: LSTMs bzw. xLSTMs, Liquid Neural Networks, KANs.
- **Test-Time Compute**: Das Modell erzeugt mehrere alternative Argumentationspfade, bewertet und korrigiert sie, und zwar nach ihrem Ergebnis (Outcome-based Reward Model) und nach dem Pfad selbst (Process Verifier Models, PRMs). Snell et al. (2024) vergleichen dafür Best-of-N, Beam Search und Lookahead Search.
- **Test-Time Training**: Die Parameter eines Modellausschnitts werden vorübergehend an die konkrete Fragestellung angepasst, mit ad hoc erzeugten Trainingsdaten (Akyürek et al. 2024).

## 19. Kleine Modelle für das IoT: TinyML und TinyLLMs

![[pictures/ai4iot/01/Lecture01_Pg072_Kleine_Modelle_F_R_Das_Iot.png]]

<p class="image-caption">TinyML und TinyLLMs: Quantisierung, Knowledge Distillation, Pruning und Finetuning.</p>

TinyML bringt ML-Modelle auf Kleinstcomputer wie Mobiltelefone, Raspberry Pis oder zumindest Jetson Nanos und andere Edge-Geräte. TinyLLMs sind TinyML mit kleinen LLMs, auch wenn das auf den ersten Blick ein Oxymoron ist. Sie werden aus großen Modellen abgeleitet:

- **Quantization**: weniger Nachkommastellen, eventuell Ganzzahlen statt Gleitkommazahlen.
- **Knowledge Distillation**: Ein kleines Modell wird trainiert, das große Vorbild zu imitieren.
- **Pruning**: unnötige Neuronen, Verbindungen oder Schichten entfernen.
- **Finetuning** für bestimmte Aufgaben.

Beispiele sind Gemma 3.x, Llama 3.x, Qwen 3.x, Microsoft Phi-4 und Mistral Small 4.

### Edge, Fog und Cloud

![[pictures/ai4iot/01/Lecture01_Pg073_Edge_Fog_Und_Cloud.png]]

<p class="image-caption">Cloud, Fog und Edge Layer im IoT (Golec et al. 2026).</p>

![[pictures/ai4iot/01/Lecture01_Pg074_Edge_Fog_Und_Cloud.png]]

<p class="image-caption">Eine Taxonomie der TinyLLMs nach Anwendungsdomäne, Einsatzkontext, Optimierungstechnik und Architektur.</p>

Golec et al. (2026) ordnen TinyLLMs in eine IoT-Pyramide ein. Der Cloud Layer hat unbegrenzte Rechenleistung und globalen Speicher und Analytik, aber hohe Latenz und hohen Energiebedarf. Der Fog Layer übernimmt Orchestrierung und Vorverarbeitung mit mittlerer Latenz. Der Edge Layer (Fahrzeuge, Smartphones, Wearables, Laptops) liefert Echtzeitantworten und On-Device-KI bei wenig Speicher und Energie. Dieselben Autoren gliedern TinyLLMs nach Anwendungsdomäne, Einsatzkontext (Edge-Server, IoT- und Embedded-Systeme, Mobilgeräte), Optimierungstechnik (effizientes Architekturdesign, Pruning, Knowledge Distillation, Quantisierung) und Architektur (Encoder-Decoder, Decoder-only, Encoder-only).

## 20. Aktuelle Entwicklungen: Physical AI und Agentic AI

![[pictures/ai4iot/01/Lecture01_Pg075_Aktuelle_Entwicklungen_Physical_Ai_Und_Agentic.png]]

<p class="image-caption">Physical AI und Agentic AI als aktuelle Entwicklungen.</p>

- **Physical AI** berücksichtigt die dreidimensionale Realwelt, teils direkt mit 3D-Repräsentationen statt der Reduktion auf einen eindimensionalen Datenstrom wie in heutigen multimodalen Transformern. Trainiert wird in simulierten Welten und mit Robotern. Die Folie nennt Entwicklungen von NVIDIA, World Labs und Physical Intelligence.
- **Agentic AI und Agentic Frameworks**: LLMs führen Aufgaben im Auftrag eines Benutzers aus, rufen Funktionen auf (Tool Use, etwa über APIs) und arbeiten komplexe, mehrstufige Aufgabenfolgen ab, die sich über längere Zeiträume erstrecken können. Dafür gibt es eigene Frameworks. Noch sind Agenten unzuverlässig, weil solche Aktivitätenketten eine geringe Fehlertoleranz haben und Folgefehler sich aufschaukeln. Für AI4IoT sind besonders Multiagentensysteme (MAS) interessant.

## 21. Grenzen des LLM-Einsatzes

![[pictures/ai4iot/01/Lecture01_Pg076_Grenzen_Des_Llm_Einsatzes.png]]

<p class="image-caption">Auch die besten LLMs können nicht zaubern: Halluzinationen, Daten-Leaks, Rechtsfragen und weitere Grenzen.</p>

Auch die besten LLMs können nicht zaubern. Halluzinationen scheinen mit den aktuellen Architekturen auf absehbare Zeit nicht behebbar. Dazu kommen Daten-Leaks und ungeklärte Rechtsfragen. Weitere Grenzen liegen bei schlechter Datenqualität, sehr komplexen Strukturen (etwa Datenbank-Queries auf komplexen Datenmodellen), Aufgaben, die den sozialen Kontext verstehen müssen, und implizitem Wissen, das nirgends in der eigenen Datenbasis steht.

## Zusammenfassung

- KI ist ein Dachbegriff. Starke KI meint echtes Verstehen, schwache KI ein Werkzeug für Probleme. Ob heutige LLMs AGI oder ASI sind, ist offen.
- Machine Learning lernt aus Beispielen: überwacht mit Labels (Klassifikation, Regression), unüberwacht ohne Labels (Clustering, Dimensionsreduktion, Ausreißer) und bestärkend über Belohnungen. Gelabelte Daten sind der Engpass, und Self- und Semi-supervised Learning, Transfer Learning, Augmentation, Simulation und Datengenerierung mildern ihn.
- Diskriminative KI ordnet zu (Abweichungsanalyse, Klassifikation, Clustering, Wirkungsprognose, Assoziationsanalyse), generative KI erzeugt Artefakte mit Variabilität.
- KNN bestehen aus gewichteten Neuronen mit Aktivierungsfunktion und werden mit Backpropagation trainiert. CNNs lernen Filter für Bilder, RNNs und LSTMs verarbeiten Sequenzen und sind sparsamer als Transformer, GANs, VAEs und Diffusion Models erzeugen Inhalte.
- Transformer verarbeiten ganze Token-Sequenzen mit Positional Encoding und Multi-Head Attention und wählen das nächste Token per Softmax. LLMs nutzt man per Prompt, RAG, Finetuning oder Eigenentwicklung. RAG ist in der Praxis aufwendig.
- Scaling stößt an Grenzen bei Daten, Kosten und Energie. Test-Time Compute, neue Architekturen und kleine Modelle (Quantisierung, Distillation, Pruning) für Edge-Geräte sind die Antworten, die für das IIoT relevant sind.

## Selbsttest

1. Was unterscheidet starke von schwacher KI, und was bedeuten AGI und ASI?

> [!success]- Antwort
> Starke KI (Searle 1980) heißt, dass ein Computer mit dem richtigen Programm im wörtlichen Sinn versteht und kognitive Zustände hat. Schwache KI sieht KI als Werkzeug zum Lösen von Problemen (Flowers 2019). AGI entspräche der menschlichen Intelligenz, ASI wäre ihr durchgehend überlegen. Ob starke KI überhaupt möglich ist, ist philosophisch umstritten.

2. Warum funktioniert Gesichtserkennung mit Deep Learning besser als mit handkodierten Regeln?

> [!success]- Antwort
> Bei Regeln muss man die Form von Nase, Mund und Auge mathematisch beschreiben und ein Gesichtsmodell von Hand bauen. Ein tiefes neuronales Netz bekommt nur viele Beispielbilder und lernt die Features und ihre schrittweise Zusammenfassung selbst. Das ist deutlich genauer, und derselbe Algorithmus lässt sich auf andere Aufgaben übertragen.

3. Nennen Sie vier Strategien gegen einen Mangel an gelabelten Trainingsdaten.

> [!success]- Antwort
> Zum Beispiel Self-supervised Learning (Basis-Features über Pretext Tasks), Semi-supervised Learning (Labels über Ähnlichkeit übertragen), Transfer Learning (vortrainierte Modelle mit wenigen Daten anpassen), Data Augmentation (vorhandene Daten modifizieren), Simulation, direkte Datengenerierung über Regeln und ML-basierte Generierung mit GANs. Ein Grundbestand fehlerfreier gelabelter Daten bleibt trotzdem nötig, umso mehr, je spezieller die Aufgabe ist.

4. Wie unterscheiden sich diskriminative und generative KI?

> [!success]- Antwort
> Diskriminative KI bestimmt, zu welcher Klasse oder Gruppe eine Dateninstanz gehört, etwa mit Klassifikation oder Clustering. Generative KI erzeugt Artefakte als Ausgabe statt Entscheidungsgrenzen, und für dieselbe Eingabe kann sie viele verschiedene, gültige Ausgaben liefern (Weisz et al.).

5. Was ist der Unterschied zwischen einem Ausreißer und einer Anomalie?

> [!success]- Antwort
> Ein Ausreißer weicht so stark von anderen Beobachtungen ab, dass man einen anderen Entstehungsmechanismus vermutet (Aggarwal 2017). Teils wird unterschieden: Ein Outlier kann ein erwartbares Resultat der Verteilung oder von Rauschen sein, eine Anomalie ist ein Outlier, der einer besonderen Erklärung bedarf.

6. Wie arbeitet ein Filter in einem CNN, und wozu dient Pooling?

> [!success]- Antwort
> Ein Filter ist eine Gruppe von Neuronen mit Gewichten, die über jeden Bildausschnitt geschoben wird. Pixelwerte werden mit den Gewichten multipliziert, summiert und durch ReLU geschickt. Das Ergebnis über alle Ausschnitte ist die Activation Map, die zeigt, wo das Feature auftritt. Weitere Faltungsschichten bilden Features aus Features. Pooling (meist Max-Pooling) verdichtet die Activation Maps, damit das Netz handhabbar bleibt. Die Filter werden mit Backpropagation gelernt.

7. Was ist Transfer Learning, und warum ist es gerade für Unternehmen wichtig?

> [!success]- Antwort
> Ein vortrainiertes Netz (etwa VGG, Inception, Xception oder ResNet) wird übernommen. Die tieferen Schichten mit den Grundfeatures werden eingefroren, die höheren angepasst oder ersetzt. Weil Bilderkennung sonst 1.000 bis 10.000 gelabelte Beispiele pro Klasse braucht, senkt das den Datenbedarf stark.

8. Wie funktioniert ein GAN?

> [!success]- Antwort
> Ein Generator erzeugt aus Zufallswerten Inhalte, ein Discriminator bekommt zufällig echte oder generierte Inhalte und entscheidet, welche echt sind. Erkennt der Discriminator falsch, wird er verbessert, erkennt er ein generiertes Bild, wird der Generator angepasst. Beide Netze werden so iterativ und verzahnt trainiert.

9. Wofür lassen sich Autoencoder im IIoT einsetzen?

> [!success]- Antwort
> Zur Verdichtung unstrukturierter Daten, als Denoising Autoencoder zur Rekonstruktion korrekter aus fehlerhaften Daten, als Variational Autoencoder zur Generierung, und zur Anomalieerkennung: Der Rekonstruktionsfehler ist hoch, wenn ein Datensatz ungewöhnlich ist.

10. Warum sind LSTMs für IIoT-Anwendungen interessant?

> [!success]- Antwort
> Sie verarbeiten Sequenzen und Zeitreihen wie Sensordaten, können über Gates gezielt vergessen und langfristig speichern und sind weniger rechenintensiv als die Transformer großer Sprachmodelle.

11. Welche zwei Ideen machen den Transformer aus?

> [!success]- Antwort
> Erstens bekommt das Netz die ganze Sequenz auf einmal statt Schritt für Schritt, und die Reihenfolge steckt im Positional Encoding. Zweitens berechnet Attention für jedes Token die Relevanz aller anderen Tokens, und Multi-Head Attention macht das parallel für mehrere Bedeutungskontexte.

12. Was sind Embeddings und Tokens, und warum kann GPT "Lollipop" nicht zuverlässig umdrehen?

> [!success]- Antwort
> Tokens sind häufige Zeichenfolgen (Byte-Pair Encoding), aus denen das Modell Text zusammensetzt. Ein Embedding ist ein hochdimensionaler Vektor, dessen Richtung die Bedeutung kodiert, sodass ähnliche Begriffe ähnliche Vektoren haben (Kosinus-Ähnlichkeit). Das Modell sieht nur Tokens und keine einzelnen Buchstaben, deshalb scheitert es an Aufgaben auf Buchstabenebene wie dem Umdrehen eines Wortes.

13. Wie funktioniert Retrieval Augmented Generation, und warum ist es in der Praxis teuer?

> [!success]- Antwort
> Qualitätsgesicherte Dokumente werden über eine Embedding-API in Vektoren übersetzt und in einer Vektordatenbank gespeichert. Bei einer Anfrage sucht das System passende Inhalte und gibt sie dem LLM mit, das in natürlicher Sprache antwortet. Teuer wird es durch Infrastruktur (Vektordatenbank, Inferenz, Umgebungen, Monitoring), Personal, laufenden Betrieb und Compliance sowie durch das Risiko, dass vertrauliche Daten aus der Wissensbasis nach außen gelangen.

14. Was sind Scaling Laws, und warum stoßen sie an Grenzen?

> [!success]- Antwort
> Sie beschreiben, wie die Modellperformance mit Parameterzahl, Trainingsdatenmenge und Rechenaufwand wächst. Das Wachstum ist logarithmisch, während Rechenbedarf, Kosten und CO2 explodieren. Neue Trainingsdaten fehlen, und zuletzt gab es kaum Leistungssprünge bei regulären LLMs. Antworten darauf sind Test-Time Compute, Test-Time Training und neue Architekturen wie xLSTMs, Liquid NNs und KANs.

15. Wie werden TinyLLMs aus großen Modellen abgeleitet, und wo laufen sie?

> [!success]- Antwort
> Über Quantisierung (weniger Nachkommastellen oder Ganzzahlen), Knowledge Distillation (ein kleines Modell imitiert ein großes), Pruning (unnötige Teile entfernen) und Finetuning auf bestimmte Aufgaben. Sie laufen auf Edge-Geräten wie Smartphones, Raspberry Pis oder Jetson Nanos, wo sie Echtzeitantworten bei wenig Speicher und Energie liefern, während die Cloud Rechenleistung, aber hohe Latenz bietet.

---

[[/notes/lectures/ai4iot/index|Zurück zum AI4IoT-Index]] | [[/notes/lectures/ai4iot/00-kickoff|Zurück: (y-00) Kick-Off und Kernbegriffe]]
