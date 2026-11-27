---
title: "L04 - Daten- und Modellbereitstellung für AI4IoT"
tags:
  - ai4iot
  - iiot
  - datenmanagement
  - data-warehouse
  - data-lake
  - datenraeume
  - mlops
date: 2026-11-25
---

[[/notes/lectures/ai4iot/index|Zurück zum AI4IoT-Index]] | [[/notes/lectures/ai4iot/03-case-wartung-mit-robotern|Zurück: (y-03) Case: Wartung mit Robotern]]

## Mentales Modell

- Ein KI-Modell im IIoT braucht eine ganze Kette, bevor es etwas vorhersagen kann. Sensoren messen, Netzwerke übertragen, Maschinen sprechen über OPC UA oder MQTT miteinander, Streaming-Plattformen fangen die Datenströme auf, und eine analyseorientierte Datenhaltung bewahrt die Daten dauerhaft auf. Erst dann kommen Training und Inferenz.
- Dr. Henning Baars baut diese Kette Folie für Folie als ein Bild aus Bausteinen auf. Die Sitzung geht die Bausteine danach einzeln durch.
- Für die analyseorientierte Datenhaltung gibt es drei Grundformen: das Data Warehouse (integriert, historisiert, für Berichte), den Data Lake (Rohdaten in allen Formaten) und das Data Lakehouse, das beide auf Cloud-Infrastruktur verbindet. Für ML kommen Feature Store und Vektordatenbank dazu, für die Übersicht der Data Catalog.
- Im IIoT liegen Daten oft verteilt, auch bei verschiedenen Partnern. Data Fabric (eine virtuelle Zugriffsschicht), Data Mesh (verteilte Data Ownership) und Datenräume wie Catena-X (organisationsübergreifender Austausch) lösen das auf verschiedene Weise.
- DataOps und MLOps übertragen die DevOps-Idee auf Daten und Modelle. Sie sollen den Übergang vom Training in den Betrieb professionalisieren.

## Inhalt der Sitzung

1. Rahmenbedingungen und Anforderungen
2. Traditionen im Umgang mit Daten
3. Datenquellen und Datenströme: MQTT, OPC UA, Kafka, Big-Data-Architekturen für Datenströme
4. Data Warehouses, Data Lakes, Data Lakehouses
5. Feature Stores
6. Metadaten und Data Catalogs
7. Data Federation, Data Fabric, Data Meshes
8. Datenräume
9. DataOps und MLOps

## 1. Rahmenbedingungen: viele technische und organisatorische Bausteine

### Sensoren und Aktuatoren

![[pictures/ai4iot/04/Lecture04_Pg003_Sensoren_Und_Aktuatoren.png]]

<p class="image-caption">Der erste Baustein: Sensoren und Aktuatoren, mit ihren Anforderungen und Problemen.</p>

- Sensoren sollen oft wenig Strom verbrauchen und lange halten, idealerweise jahrelang. Manche sind schon direkt internetfähig (Smart Sensors).
- In manchen Maschinen stecken bis zu 100 Sensoren, die im Millisekundentakt Daten liefern. Alle Daten aufzuheben, ist kaum möglich. Bei einer Störung will man trotzdem einen "Fingerabdruck" der Daten aus dem relevanten Zeitraum haben.
- Für denselben Sachverhalt gibt es teils verschiedene Messgrößen, und erst der Kontext macht einen Wert richtig interpretierbar.
- Sensoren verschmutzen und verschleißen.
- Zunehmend gibt es virtuelle Sensoren: ML-Modelle, die aus vorhandenen physischen Sensorwerten andere Messgrößen ableiten oder vorhersagen.

### Netzwerke und Maschine-zu-Maschine-Kommunikation

![[pictures/ai4iot/04/Lecture04_Pg004_Netzwerke.png]]

<p class="image-caption">Netzwerke für IoT-Daten, etwa ZigBee, LoRa, WiFi und Bluetooth.</p>

Für (I)IoT-Szenarien gibt es eigene Netzwerktechnologien. Sie müssen störungsresistent sein und nutzen deshalb oft Mesh-Ansätze. Idealerweise sind sie energieeffizient, gerade aus Sicht der angebundenen Sensoren und Aktuatoren. Manche sind nicht unmittelbar internetfähig.

![[pictures/ai4iot/04/Lecture04_Pg005_Maschine_Zu_Maschine.png]]

<p class="image-caption">Maschine-zu-Maschine-Kommunikation mit OPC UA und MQTT.</p>

IoT-Lösungen müssen die Sprache der Maschine-zu-Maschine-Kommunikation sprechen. Die beiden wichtigsten Technologien sind OPC UA (bevorzugt in Industrie 4.0) und MQTT (bevorzugt in der Industrial Internet Reference Architecture, IIRA).

### Datenströme

![[pictures/ai4iot/04/Lecture04_Pg006_Datenstroeme.png]]

<p class="image-caption">Datenströme werden mit skalierbaren Streaming-Technologien wie Apache Kafka und Spark Streaming verarbeitet.</p>

- Einlaufende Datenströme werden per Stream-Datenverarbeitung behandelt. Die großen Datenströme aufzufangen, braucht skalierbare, leichtgewichtige Technologien. Gängig sind Apache Kafka und Spark Streaming.
- Ein Teil der Daten wird persistiert (Lambda-Architektur, Abschnitt 3).
- Die Daten sollten live verarbeitet werden können, gegebenenfalls mit direkter Erkennung komplexer Muster wie einer Störung, teils mit ML. Das nennt man Complex Event Processing.

### Analyseorientierte Datenhaltung

![[pictures/ai4iot/04/Lecture04_Pg007_Analyseorientierte_Datenhaltung.png]]

<p class="image-caption">Die analyseorientierte Datenhaltung mit Data Lake, Data Warehouse, ETL, Data Catalog, Feature Store und Vektordatenbank, dazu ihre Anforderungen.</p>

Die analyseorientierte Datenhaltung speichert die Daten für Analysen. Sie muss viele Anforderungen erfüllen:

- dauerhafte Vorhaltung der Daten und Historisierung ("Slowly Changing Dimensions"),
- Reproduzierbarkeit der ursprünglichen Quellen und der Transformationsschritte (Data Heritage und Data Lineage),
- ein konsistentes Datenmodell, das trotzdem agil erweiterbar ist,
- Skalierbarkeit, Backup und Archivierung,
- Verständlichkeit und Glaubwürdigkeit,
- Datenschutz und Datensicherheit, mit kontrolliertem Zugriff für verschiedene Benutzergruppen (rollenbasierte Zugriffskontrolle, RBAC),
- Metadatenmanagement, umgesetzt mit einem Data Catalog.

Bis hierhin deckt die klassische Welt von Business Intelligence und Analytics (BIA) die Anforderungen ab. ML und generative KI bringen drei weitere mit:

- ML braucht Zugriff für zwei Anwendungskontexte: Training und Inferenz (Modelleinsatz).
- ML will berechnete Features wiederverwenden. Dafür gibt es den Feature Store.
- Generative KI braucht für RAG-Lösungen eine Vektordatenbank, etwa FAISS.

### Datenräume und föderierte Datenhaltung

![[pictures/ai4iot/04/Lecture04_Pg008_Datenraeume.png]]

<p class="image-caption">Datenräume für den organisationsübergreifenden Datenaustausch, etwa Gaia-X und Catena-X.</p>

Für den Datenaustausch über Organisationsgrenzen hinweg gibt es Datenräume. Man baut sie "frei Hand" oder mit speziellen Ansätzen wie Gaia-X und darauf aufsetzenden Instanzen wie Catena-X oder dem Mobility Data Space. Datenräume unterstützen die Koordination des Datenaustauschs. Sie brauchen Standards, Governance, Infrastruktur und Institutionalisierung und müssen Datenhoheit, Sicherheit und Vertraulichkeit sicherstellen.

![[pictures/ai4iot/04/Lecture04_Pg009_Foederierte_Datenhaltung.png]]

<p class="image-caption">Föderierte Datenhaltung: Datenvirtualisierung als Grundlage für ein Data Fabric, dazu das Data Mesh.</p>

Gerade in IIoT-Ökosystemen liegen die Daten nicht in einer einzigen Datenhaltung, manchmal sogar bei verschiedenen Partnern. Datenvirtualisierung greift über eine Abstraktionsschicht auf verschiedene Quellen zu und ist die Grundlage für ein Data Fabric. Das Data Mesh ist ein Konzept, Daten verteilt vorzuhalten.

### Modelltraining, Modellinferenz, DataOps und MLOps

![[pictures/ai4iot/04/Lecture04_Pg010_Modellinferenz_Vor_Ort.png]]

<p class="image-caption">Modelle müssen auch vor Ort auf Geräten mit wenig Rechenleistung laufen.</p>

Modelle müssen auch vor Ort laufen, auf Geräten mit geringer Rechenleistung, bei schlechter Netzabdeckung und in unwegsamem Gelände. Dafür gibt es inzwischen Minirechner mit GPUs für Deep Learning und Smart Cameras, auf denen Deep-Learning-Modelle laufen.

![[pictures/ai4iot/04/Lecture04_Pg011_Dataops_Mlops.png]]

<p class="image-caption">Das vollständige Bild: DataOps und MLOps verbinden Modelltraining und Modellinferenz.</p>

DataOps und MLOps sind Konzepte, um Modelltraining und Modellnutzung professionell zu überbrücken, vor allem bei Datenübergabe und Datentransformation.

## 2. Unterschiedliche Traditionen im Umgang mit Daten

Wer eine AI4IoT-Datenlösung bauen will, trifft auf IT-Anbieter aus vier Traditionen. Jede bringt andere Stärken mit.

![[pictures/ai4iot/04/Lecture04_Pg013_Traditionen_Automatisierungstechnik.png]]

<p class="image-caption">Anbietertyp 1: Automatisierungstechnik, Produktion und Logistik.</p>

![[pictures/ai4iot/04/Lecture04_Pg014_Traditionen_Iot_Und_Bia.png]]

<p class="image-caption">Anbietertypen 2 und 3: Internet of Things sowie Business Intelligence und Analytics.</p>

![[pictures/ai4iot/04/Lecture04_Pg015_Traditionen_Ai_Und_Ml.png]]

<p class="image-caption">Anbietertyp 4: Artificial Intelligence und Machine Learning.</p>

| Schwerpunkt                                         | Stärken                                                                                                                                                                                                                               | Schwächen                                                                                                                                                                                                                                                           | Geeignet für                                                                                                                             |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Automatisierungstechnik, Produktion und Logistik | Maschinenanbindung, kennen relevante Standards und Normen, kennen die technischen, organisatorischen, kulturellen und rechtlichen Besonderheiten des industriellen Mittelstands, ingenieursorientiert, teils hochspezialisierte Tools | teils lokale Lösungen, teils nicht mit aktuellen cloudbasierten Architekturen vertraut, Überführung in analyseorientierte Datenmodelle oft nicht vorgesehen und schwierig, oft unzureichende Historisierung, oft nicht auf einen Single Point of Truth ausgerichtet | Projekte, die neben Datensammlung und -analyse eine Digitalisierungsinitiative mit tiefer fachlicher Einbindung in die Prozesse brauchen |
| 2. Internet of Things                               | Anbindung typischer IoT-Datenquellen (smarte Sensoren und Aktoren, smarte Maschinen, RFID), Umgang mit großen Datenvolumina, hoher Geschwindigkeit und komplex strukturierten Daten                                                   | fachlicher Hintergrund nicht so tief wie bei Typ 1, nicht auf analyseorientierte Datenhaltung und tiefere Analysen ausgerichtet                                                                                                                                     | cloudbasierte Dashboards mit Echtzeit-Integration komplexer, verteilter Sensorik                                                         |
| 3. Business Intelligence und Analytics (BIA)        | Wurzeln im unternehmensweiten Reporting und im Aufbau integrierter, analyseorientierter Datenhaltung (Data Warehouse, Data Lake)                                                                                                      | anspruchsvolle AI/ML-Lösungen eher flankierend und nicht voll integriert, fehlende Erfahrung mit IoT-Systemen                                                                                                                                                       | Projekte, in denen der initiale Aufbau einer Datenplattform im Vordergrund steht                                                         |
| 4. Artificial Intelligence und Machine Learning     | AI-Erfahrung (methodisch, mathematisch-statistisch, werkzeug-, entwicklungs- und betriebsbezogen), oft auch mit den Grundlagen von BIA vertraut                                                                                       | für klassische BIA-Themen relativ teuer, Anbindung komplexer Sensordaten keine Kernkompetenz, anspruchsvollere Anforderungen an die Datenhaltung                                                                                                                    | Projekte, die schon auf einer hochwertigen Datenbasis aufsetzen können                                                                   |

## 3. Datenquellen und Datenströme

### OPC UA

![[pictures/ai4iot/04/Lecture04_Pg016_Opc_Ua.png]]

<p class="image-caption">OPC UA als Schichtenmodell: Informationsmodelle, Zugriff auf Daten und Ereignisse, Client-Server und Pub-Sub (OPC Foundation).</p>

OPC UA ist der Standard für die industrielle M2M-Kommunikation, vor allem in der Fertigung. Die OPC Foundation beschreibt OPC Unified Architecture als Datenaustausch-Standard für eine sichere, zuverlässige, hersteller- und plattformunabhängige industrielle Kommunikation. Er erlaubt einen betriebssystemübergreifenden Datenaustausch zwischen Produkten verschiedener Hersteller. Hersteller, Anwender, Forschungsinstitute und Konsortien haben die Spezifikationen gemeinsam erarbeitet.

Das Schichtenbild auf der Folie zeigt von oben nach unten herstellerspezifische Erweiterungen, Companion Information Models (etwa für Roboter, CNC-Maschinen, Windkraft), Core Information Models (etwa analoge Daten, Alarme, Zustandsautomaten, Dateitransfer), die Bausteine des Informationsmodells (Metamodell), den Zugriff auf das Informationsmodell (Daten und Semantik lesen, Methoden ausführen, Ereignisse melden) und die Transportarten Client-Server und Pub-Sub.

### MQTT

![[pictures/ai4iot/04/Lecture04_Pg017_Mqtt.png]]

<p class="image-caption">MQTT: Ein Temperatursensor publiziert über einen Broker, ein Mobilgerät und ein Backend-System haben das Topic abonniert.</p>

MQTT (Message Queuing Telemetry Transport) ist der Standard für den Datenaustausch im IIoT. Laut mqtt.org ist es ein OASIS-Standard für das IoT, ein extrem leichtgewichtiges Publish/Subscribe-Protokoll. Es eignet sich für entfernte Geräte mit wenig Code und minimaler Bandbreite.

Im Beispiel publiziert ein Temperatursensor den Wert 24 °C auf das Topic "temperature". Der MQTT-Broker leitet den Wert an alle weiter, die das Topic abonniert haben, hier ein Mobilgerät und ein Backend-System. Sender und Empfänger kennen sich nicht, sie kennen nur den Broker und das Topic.

### Apache Kafka

![[pictures/ai4iot/04/Lecture04_Pg018_Apache_Kafka.png]]

<p class="image-caption">Kafka: Produzenten hängen Events an die Partitionen eines Topics an.</p>

Apache Kafka ist ein Beispiel für eine Big-Data-orientierte Streaming-Technologie. Laut Projektseite ist es eine Open-Source-Plattform für verteiltes Event Streaming, die Tausende Unternehmen für Datenpipelines mit hoher Leistung, Streaming Analytics, Datenintegration und geschäftskritische Anwendungen nutzen. Umgesetzt wird es über "Broker", was einem Event Hub entspricht. Produzenten hängen Events an die Partitionen (P1 bis P4) eines Topics an.

### Lambda-Architektur

![[pictures/ai4iot/04/Lecture04_Pg019_Lambda_Architektur.png]]

<p class="image-caption">Die Lambda-Architektur mit Speed Layer, Batch Layer und Serving Layer (modifiziert nach Marz und Warren 2015, S. 29).</p>

Die Lambda-Architektur ist eine Big-Data-Architektur für Datenströme und wird häufig mit Apache Kafka umgesetzt. Die Quelldaten kommen als Stream an und laufen in zwei Wege:

- Speed Layer (Realtime Layer): verarbeitet die Daten sofort.
- Batch Layer: legt die Daten dauerhaft im Data Warehouse oder Data Lake ab. Darauf sitzt ein Serving Layer.

Übergreifende Abfragen greifen auf beide Wege zu.

### Datenintegrationsstrategien

![[pictures/ai4iot/04/Lecture04_Pg020_Datenintegrationsstrategien.png]]

<p class="image-caption">Drei Strategien der Datenintegration: Konsolidierung, Föderation und Propagation (BI Research, zitiert nach White 2005).</p>

| Strategie          | Prinzip                                                                                                                            | Technik                                         | Heutige Umsetzung                                                                           |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------ |
| Data Consolidation | Daten werden zentral zusammengeführt                                                                                               | ETL, Enterprise Content Management (ECM)        | Data Lakes, Data Warehouses, Data Lakehouses, Data Meshes (dort mit föderierter Governance) |
| Data Federation    | übergreifendes, integratives Datenmodell als virtuelle Sicht; Daten werden bei Bedarf extrahiert, transformiert und bereitgestellt | Enterprise Information Integration (EII)        | Datenvirtualisierung, Data Fabric                                                           |
| Data Propagation   | Daten werden zwischen Systemen kopiert                                                                                             | EAI, Real-time ETL, Enterprise Data Replication | zum Beispiel Datenräume und Datenbroker                                                     |

## 4. Data Warehouses, Data Lakes, Data Lakehouses

### Das Data Warehouse

![[pictures/ai4iot/04/Lecture04_Pg021_Data_Warehouse.png]]

<p class="image-caption">Das Data Warehouse nach Inmon: themenorientiert, integriert, zeitorientiert und beständig.</p>

> [!abstract] Definition nach Inmon
> "A data warehouse is a subject-oriented, integrated, time-variant and non-volatile collection of data in support of management's decision making process."

| Merkmal                               | Bedeutung                                                                                            |
| :------------------------------------ | :--------------------------------------------------------------------------------------------------- |
| Subject-oriented (Themenorientierung) | Daten werden für zusammengehörende Themen zusammengestellt, etwa Analytical CRM, SCM, HR Analytics   |
| Integrated (Integration)              | Daten aus verschiedenen Quellen werden verschmolzen, idealerweise mit einem integrierten Datenmodell |
| Time-variant (Zeitorientierung)       | die Daten sind definierten Zeitperioden zugeordnet                                                   |
| Non-volatile (Beständigkeit)          | neue Daten werden angehängt, alte nicht überschrieben                                                |

Im Beispiel auf der Folie taucht Meier im Januar 2017 in SCM auf, im Dezember 2018 in HR und im März 2019 in Planning/Marketing. Das DWH hängt jeden neuen Stand mit Zeitbezug an und behält die alten.

### Komponenten eines Data Warehouse

![[pictures/ai4iot/04/Lecture04_Pg022_Dwh_Komponenten.png]]

<p class="image-caption">Ein Data Warehouse besteht selbst aus Komponenten: Staging Area, Corporate Memory, Core Data Warehouse, Data Marts, ODS und Metadaten.</p>

| Komponente                    | Aufgabe                                                                                      |
| :---------------------------- | :------------------------------------------------------------------------------------------- |
| ETL                           | Extract-Transform-Load-Prozesse, die das DWH füllen                                          |
| Staging Area                  | (temporäre) Kopien der extrahierten Rohdaten, nach dem Prinzip "extract once, deploy many"   |
| Corporate (Staging) Memory    | Archiv aller extrahierten Daten, um die Data Lineage rekonstruieren zu können                |
| Core Data Warehouse           | anwendungsübergreifende Datenhaltung                                                         |
| Data Marts                    | anwendungs- bzw. domänenspezifische "Mini-DWHs", oft Extrakte aus dem Core-DWH (Hub & Spoke) |
| Operational Data Store (ODS)  | hält aktuelle Kennzahlen für Berichte und Monitoring vor, integriert, aber nicht dauerhaft   |
| Metadaten                     | technische und fachliche Metadaten, die die DWH-Daten definieren und beschreiben             |
| Administrationsschnittstellen | Verwaltung des DWH                                                                           |

### Architekturvarianten

![[pictures/ai4iot/04/Lecture04_Pg023_Dwh_Architekturvarianten.png]]

<p class="image-caption">Architekturvarianten mit Data Marts und Core-DWH, von unabhängigen Data Marts bis zum Architektur-Mix.</p>

Die Folie zeigt sieben Varianten: unabhängige Data Marts, Data Marts mit Conformed Data Models, ein zentrales Core-DWH, mehrere DWHs, ein Core-DWH mit abhängigen Data Marts (Hub & Spoke), ein virtuelles DWH und den Architektur-Mix, euphemistisch "Ökosystem" genannt.

Welche Variante die beste ist, beantworten Studien nicht eindeutig. Integrierte und gemanagte Architekturen mit konsistenter Datenbasis sind rein dezentralen aber deutlich überlegen, etwa bei Kosteneffizienz und Datenqualität. Ob ein DWH, zwei oder mehr und mit welchen Schichten, hängt von Geschäftsmodell und Geschäftsprozessen ab.

### Der Data Lake

![[pictures/ai4iot/04/Lecture04_Pg024_Data_Lake.png]]

<p class="image-caption">Der Data Lake nach Baars und Kemper (2021): polystrukturierte Rohdaten, dauerhaft und anwendungsneutral gesammelt.</p>

> [!abstract] Definition nach Baars und Kemper (2021)
> "Ein (Enterprise) Data Lake ist eine Big-Data-orientierte Datenhaltung, in der große Mengen an polystrukturierten (d. h. strukturierten, semistrukturierten und unstrukturierten) Rohdaten aus unterschiedlichsten Quellen dauerhaft und anwendungsneutral in den jeweiligen Ausgangsformaten gesammelt werden." (in Anlehnung an Fang 2015 und Mathies 2017)

- Der Data Lake ist das anwendungsneutrale Gegenstück zum DWH, das die strukturierten Daten hält.
- Ursprünglich speichert er untransformierte Rohdaten. Transformiert wird erst in nachgelagerten Systemen (Schema on Read).
- Inzwischen weicht man teilweise vom strikten Schema on Read ab, aus drei Gründen: Anonymisierung und Pseudonymisierung, Abfrageperformanz sowie Datenqualität und -konsistenz.
- Der Data Lake ergänzt das DWH, er ersetzt es nicht.

### Zonen im Data Lake

![[pictures/ai4iot/04/Lecture04_Pg025_Data_Lake_Zonen.png]]

<p class="image-caption">Die Zonen eines Data Lake, flankiert von Data Catalog, Datenqualitätsmanagement und Sicherheit (in Anlehnung an Zaloni nach LaPlante et al. 2014).</p>

Im Data Lake wird zunehmend transformiert, und die Architekturen werden komplexer. Typisch sind Zonen:

| Zone                   | Inhalt                                                              |
| :--------------------- | :------------------------------------------------------------------ |
| Transient Loading Zone | Zwischenspeicherung und Vorverarbeitung der einlaufenden Quelldaten |
| Raw Data Zone          | Daten im Originalformat                                             |
| Curated Zone           | gefilterte, von Mängeln befreite, vertrauenswürdige Daten           |
| Discovery Sandbox      | Extrakte, die Data Scientists und Data Analysts weiterbearbeiten    |
| Consumption Zone       | transformierte Daten für Abfragen und Berichte                      |

Quer über allen Zonen liegen Data Catalog und Metadaten, Datenqualitätsmanagement und Sicherheit.

### Das Data Lakehouse

![[pictures/ai4iot/04/Lecture04_Pg026_Data_Lakehouse.png]]

<p class="image-caption">Das Data Lakehouse verbindet günstigen, direkt zugänglichen Speicher mit den Management- und Performance-Funktionen eines analytischen DBMS (Armbrust et al. 2021).</p>

> [!abstract] Definition nach Oreščanin und Hlupić (2021)
> "The Data Lakehouse is defined as a data management system based on low-cost and directly-accessible storage that also provides traditional analytical DBMS management and performance features. From the given definition it is clearly visible that the Data Lakehouse combines both the Data Lake features (low-cost and directly-accessible storage) and the Data Warehouse, which is typically built using RDBMS."

Das Lakehouse kombiniert Data Lake und Data Warehouse, üblicherweise auf Cloud-Infrastruktur. Das DWH ist darin eine eigene Schicht ("Zone"), die Metadaten werden integriert und übergreifend gehalten, und Abfragen laufen übergreifend. Beispiele auf den Folien sind Delta Lake und Snowflake.

## 5. Data Catalog und Feature Store

### Data Catalog

![[pictures/ai4iot/04/Lecture04_Pg029_Data_Catalog.png]]

<p class="image-caption">Der Data Catalog als System für Metadatenmanagement und Datenkuratierung (Petrik et al. 2023).</p>

Nach Petrik et al. (2023) ist ein Data Catalog ein Unternehmenssystem für Metadatenmanagement und Datenkuratierung. Er dient als Knowledge- und Collaboration-Hub, hilft Organisationen, souveräne Dateninfrastrukturen in wachsenden Netzwerken aufzubauen, und unterstützt Datenanalysten und andere Datennutzer bei der Suche nach Datensätzen, Speicherorten, Verwendungszwecken und anderen wichtigen Informationen.

### Feature Store

![[pictures/ai4iot/04/Lecture04_Pg030_Feature_Store.png]]

<p class="image-caption">Der Feature Store zwischen Featurization, Training und Serving, mit Batch-Zugriff (hoher Durchsatz) und Online-Zugriff (geringe Latenz) (Databricks).</p>

Feature Stores lösen die Probleme, die beim Umgang mit ML-Features in Training und Inferenz entstehen. Sie sind ein zentrales Repository wiederverwendbarer Features über die ganze ML-Pipeline und automatisieren deren Management (Orr et al. 2021). Im Databricks-Bild bedient der Feature Store das Training über Batch-Zugriff mit hohem Durchsatz und das Serving über Online-Zugriff mit geringer Latenz.

## 6. Data Federation: Datenvirtualisierung, Data Fabric, Data Mesh

### Datenvirtualisierung und Data Fabric

![[pictures/ai4iot/04/Lecture04_Pg032_Data_Fabric.png]]

<p class="image-caption">Die Data Fabric als systematischer Ansatz für Data Federation (IBM).</p>

Datenvirtualisierung erlaubt es, Daten aus heterogenen Quellsystemen abzufragen und zusammenzuführen, unabhängig davon, wo und in welcher Form sie gespeichert sind.

Eine Data Fabric legt eine integrierte Zugriffsschicht über verteilte, heterogene Quellsysteme und setzt dafür auf Datenvirtualisierung auf.

### Data Mesh

![[pictures/ai4iot/04/Lecture04_Pg033_Data_Mesh.png]]

<p class="image-caption">Das Data Mesh mit vier Prinzipien nach Dehghani (2020), daneben eine Data-Mesh-Architektur in einem Industrieunternehmen (Rebstock 2024).</p>

Das Data Mesh stellt analytische Daten föderiert und mit verteilter Data Ownership bereit. Es folgt vier Prinzipien (Dehghani 2020):

1. Domain-oriented decentralized data ownership and architecture: Die Fachdomänen besitzen ihre Daten und deren Architektur.
2. Data as a product: Daten werden wie ein Produkt für andere bereitgestellt.
3. Self-serve data infrastructure as a platform: Eine Plattform stellt die Infrastruktur zur Selbstbedienung bereit.
4. Federated computational governance: Die Governance ist föderiert und automatisiert.

Im Vergleich zur Integrationsstrategie aus Abschnitt 3: Das Data Mesh zählt zur Konsolidierung, aber mit föderierter Governance. Die Data Fabric ist Föderation.

## 7. Datenräume

### International Data Spaces

![[pictures/ai4iot/04/Lecture04_Pg034_International_Data_Spaces.png]]

<p class="image-caption">Die Komponenten des IDS-Referenzarchitekturmodells: IDS Connector bei Datenanbieter und -nutzer, Metadata Broker, Clearing House, App Store und Vocabulary Hub.</p>

Die International Data Spaces (IDS) sind Standards für den unternehmensübergreifenden Austausch von (IIoT-)Daten. Datenanbieter und Datennutzer tauschen die Daten über je einen IDS Connector aus. Dazu kommen ein Metadata Broker, ein Clearing House, ein App Store und ein Vocabulary Hub. Gaia-X baut auf den IDS-Standards auf.

### Catena-X

![[pictures/ai4iot/04/Lecture04_Pg036_Catena_X_Kits.png]]

<p class="image-caption">Catena-X, ein Datenraum für die automobile Lieferkette, bietet "Keep it Together"-Toolboxes (KITs) für verschiedene Use Cases.</p>

Catena-X ist ein Datenraum für die automobile Lieferkette. Für verschiedene Use Cases gibt es "Keep it Together" (KIT) Toolboxes. Wer teilnehmen will, durchläuft einen Onboarding-Prozess in vier Etappen: Einführungsleitlinien (Schritt-für-Schritt-Begleitung, Wahl eines Onboarding-Partners), Geschäftsnutzen (Geschäftszweck definieren, Business Case als Kosten-Nutzen-Plan, das eigene Ökosystem einladen), technische Befähigung (Betrieb, Datenmanagement, Datenraum, Datenintegration) und organisatorische Befähigung (Training zur Datenkompetenz, kulturelles Training).

### Datengenossenschaften

![[pictures/ai4iot/04/Lecture04_Pg038_Datengenossenschaften.png]]

<p class="image-caption">Eine Datengenossenschaft für Kühlschmierstoff-Reinigungsanlagen mit drei Partnern.</p>

Eine Datengenossenschaft ist eine leichtgewichtige Form eines Datenraums. Im Beispiel liefern drei Partner Sensor- und Stammdaten: zu den KSS-Reinigungsanlagen (Partner 1), zum Schmierstoff (Partner 2) und zur Produktionsumgebung (Partner 3). Daraus entsteht eine integrierte Datensammlung.

Die Genossenschaft übernimmt das Datenmanagement: Datenextraktion und -bereinigung, Datenintegration, Ausreißererkennung, Datenaufteilung und Anonymisierung, Kennzahlenberechnung sowie Meta- und Stammdatenmanagement. Den Nutzen haben alle Genossen: neue Formen der Arbeitsteilung, neue Geschäftsmodelle und deutliche Steigerungen von Effizienz und Effektivität. Geplant sind weitere Partner, damit die Datenbasis wächst, sich die Gemeinkosten verteilen und weitere Services und Produkte entstehen.

## 8. DevOps, DataOps, MLOps

![[pictures/ai4iot/04/Lecture04_Pg039_Devops_Dataops_Mlops.png]]

<p class="image-caption">DevOps, DataOps und MLOps im Überblick.</p>

| Begriff | Bedeutung                                                                                                                                                                                                                                                                                                                                                                                 |
| :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DevOps  | verbindet Systementwicklung ("Dev") und Systembetrieb ("Ops") agil und softwaregestützt. Getrieben vom Ziel der Professionalisierung, stark auf Softwareunterstützung und Automatisierung der Entwicklung ausgerichtet (Ebert et al. 2016). Werkzeuggestützte Prozesse für Continuous Integration, Continuous Deployment, Testing und Infrastrukturmanagement ("Infrastructure as Code"). |
| DataOps | überträgt DevOps auf die Analytics-Welt: Zusammenarbeit zwischen den Einheiten, die Infrastruktur, Modelle und Berichte bereitstellen, und den Nutzern                                                                                                                                                                                                                                    |
| MLOps   | DevOps für das Deployment von Machine-Learning-Modellen                                                                                                                                                                                                                                                                                                                                   |

![[pictures/ai4iot/04/Lecture04_Pg040_Dataops_Komponenten.png]]

<p class="image-caption">Was zu DataOps gehört: Ziele und Prinzipien aus einer Interviewreihe mit acht Experten (Ereth 2018).</p>

Ereth (2018) hat in Interviews erhoben, was zu DataOps gehört:

- Ziele: kontinuierliche Verbesserung, Orchestrierung, Befähigung der Fachanwender (Citizen Users), Agilität und Geschwindigkeit, Zusammenarbeit und Vertrauen.
- Prinzipien: Wiederverwendung von Artefakten, Automatisierung, integriertes End-to-End-Denken, kurze Zyklen und inkrementelle Änderungen, Analytics as Code, Testing, Monitoring, datengetriebene Verbesserung und prozessorientierte Datenpipelines.

## Zusammenfassung

- Eine AI4IoT-Lösung besteht aus vielen Bausteinen: Sensoren und Aktuatoren, Netzwerke, M2M-Kommunikation (OPC UA, MQTT), Datenströme (Kafka, Spark Streaming), analyseorientierte Datenhaltung, Datenräume, föderierte Datenhaltung, Modelltraining und -inferenz sowie DataOps und MLOps.
- Die analyseorientierte Datenhaltung muss historisieren, reproduzierbar sein (Data Lineage), konsistent und erweiterbar bleiben und Zugriffe rollenbasiert regeln. ML braucht zusätzlich Zugriff für Training und Inferenz und einen Feature Store, generative KI eine Vektordatenbank.
- Vier Anbietertraditionen (Automatisierungstechnik, IoT, BIA, AI/ML) bringen unterschiedliche Stärken mit, keine deckt alles ab.
- OPC UA ist der herstellerunabhängige Standard der Fertigung, MQTT ein leichtgewichtiges Publish/Subscribe-Protokoll, Kafka eine verteilte Event-Streaming-Plattform. Die Lambda-Architektur trennt Speed Layer und Batch Layer.
- Daten lassen sich konsolidieren (DWH, Data Lake, Lakehouse, Data Mesh), föderieren (Datenvirtualisierung, Data Fabric) oder propagieren (Datenräume, Datenbroker).
- Das DWH ist themenorientiert, integriert, zeitorientiert und beständig und besteht aus Staging Area, Corporate Memory, Core-DWH, Data Marts und ODS. Der Data Lake sammelt polystrukturierte Rohdaten in Zonen und ergänzt das DWH. Das Lakehouse verbindet beide.
- Das Data Mesh beruht auf Domain Ownership, Data as a Product, Self-Serve-Plattform und föderierter Governance.
- Datenräume wie IDS, Gaia-X und Catena-X regeln den organisationsübergreifenden Austausch, Datengenossenschaften sind eine leichtgewichtige Variante.
- DataOps überträgt DevOps auf Analytics, MLOps auf ML-Modelle.

## Selbsttest

1. Welche Probleme bringen Sensoren für die Datenbereitstellung mit?

> [!success]- Antwort
> Manche Maschinen haben bis zu 100 Sensoren, die im Millisekundentakt liefern, sodass man nicht alle Daten aufheben kann, bei Störungen aber trotzdem einen Fingerabdruck der relevanten Zeit braucht. Für denselben Sachverhalt gibt es teils verschiedene Messgrößen, und erst der Kontext macht einen Wert interpretierbar. Sensoren verschmutzen und verschleißen. Dazu sollen sie wenig Strom brauchen und jahrelang halten.

2. Welche Anforderungen stellt ML an die analyseorientierte Datenhaltung über die klassische BIA-Welt hinaus?

> [!success]- Antwort
> ML braucht Zugriff für zwei Anwendungskontexte, Training und Inferenz, und will berechnete Features wiederverwenden, wofür es den Feature Store gibt. Generative KI braucht für RAG-Lösungen zusätzlich eine Vektordatenbank.

3. Vergleichen Sie OPC UA, MQTT und Kafka.

> [!success]- Antwort
> OPC UA ist ein sicherer, hersteller- und plattformunabhängiger Standard für die industrielle M2M-Kommunikation, vor allem in der Fertigung und bevorzugt in Industrie 4.0, mit reichen Informationsmodellen. MQTT ist ein extrem leichtgewichtiges Publish/Subscribe-Protokoll für entfernte Geräte mit wenig Code und Bandbreite, bevorzugt in der IIRA. Kafka ist eine verteilte Event-Streaming-Plattform für große Datenströme, umgesetzt über Broker, die einem Event Hub entsprechen.

4. Wie ist die Lambda-Architektur aufgebaut?

> [!success]- Antwort
> Die Quelldaten kommen als Stream an und laufen in zwei Wege. Der Speed Layer verarbeitet sie in Echtzeit, der Batch Layer speichert sie dauerhaft im DWH oder Data Lake, darüber liegt ein Serving Layer. Übergreifende Abfragen nutzen beide Wege. Umgesetzt wird sie häufig mit Apache Kafka.

5. Nennen Sie die drei Datenintegrationsstrategien und ordnen Sie heutige Ansätze zu.

> [!success]- Antwort
> Data Consolidation führt Daten zentral zusammen (ETL), heute als Data Lake, DWH, Lakehouse und Data Mesh (mit föderierter Governance). Data Federation stellt ein virtuelles, übergreifendes Datenmodell bereit und holt die Daten bei Bedarf, heute als Datenvirtualisierung und Data Fabric. Data Propagation kopiert Daten zwischen Systemen, etwa über Datenräume und Datenbroker.

6. Was kennzeichnet ein Data Warehouse nach Inmon?

> [!success]- Antwort
> Es ist themenorientiert (Daten für zusammengehörende Themen), integriert (Daten aus verschiedenen Quellen verschmolzen), zeitorientiert (Daten definierten Zeitperioden zugeordnet) und beständig (neue Daten werden angehängt, alte nicht überschrieben) und unterstützt Managemententscheidungen.

7. Welche Aufgaben haben Staging Area, Corporate Memory und Operational Data Store?

> [!success]- Antwort
> Die Staging Area hält (temporäre) Kopien der extrahierten Rohdaten nach dem Prinzip "extract once, deploy many". Das Corporate Memory archiviert alle extrahierten Daten, damit sich die Data Lineage rekonstruieren lässt. Der ODS hält aktuelle Kennzahlen für Berichte und Monitoring vor, integriert, aber nicht dauerhaft.

8. Was ist ein Data Lake, und warum weicht man teilweise vom Schema on Read ab?

> [!success]- Antwort
> Ein Data Lake sammelt große Mengen polystrukturierter Rohdaten aus verschiedensten Quellen dauerhaft und anwendungsneutral in ihren Ausgangsformaten. Ursprünglich wurde erst beim Lesen transformiert (Schema on Read). Man weicht davon ab wegen Anonymisierung und Pseudonymisierung, Abfrageperformanz sowie Datenqualität und -konsistenz. Der Data Lake ergänzt das DWH, er ersetzt es nicht.

9. Was ist ein Data Lakehouse?

> [!success]- Antwort
> Ein Datenmanagementsystem auf günstigem, direkt zugänglichem Speicher, das zugleich die Management- und Performance-Funktionen eines analytischen DBMS bietet. Es kombiniert Data Lake und DWH, meist in der Cloud, mit dem DWH als eigener Zone, integrierter Metadatenhaltung und übergreifenden Abfragen. Beispiele sind Delta Lake und Snowflake.

10. Unterscheiden Sie Data Fabric und Data Mesh.

> [!success]- Antwort
> Eine Data Fabric legt eine integrierte Zugriffsschicht über verteilte, heterogene Quellsysteme und setzt auf Datenvirtualisierung auf. Die Daten bleiben, wo sie sind. Ein Data Mesh stellt analytische Daten föderiert mit verteilter Data Ownership bereit, nach vier Prinzipien: domänenorientierte dezentrale Ownership, Data as a Product, Self-Serve-Infrastruktur als Plattform und föderierte, automatisierte Governance.

11. Wozu dienen Datenräume, und was brauchen sie?

> [!success]- Antwort
> Datenräume regeln den organisationsübergreifenden Datenaustausch und unterstützen dessen Koordination, "frei Hand" oder mit Ansätzen wie Gaia-X und Instanzen wie Catena-X oder dem Mobility Data Space. Sie brauchen Standards, Governance, Infrastruktur und Institutionalisierung und müssen Datenhoheit, Sicherheit und Vertraulichkeit sichern. Eine leichtgewichtige Form ist die Datengenossenschaft.

12. Unterscheiden Sie DevOps, DataOps und MLOps.

> [!success]- Antwort
> DevOps verbindet Entwicklung und Betrieb agil und automatisiert, mit Continuous Integration, Continuous Deployment, Testing und Infrastructure as Code. DataOps überträgt das auf Analytics, als Zusammenarbeit zwischen den Bereitstellern von Infrastruktur, Modellen und Berichten und deren Nutzern. MLOps ist DevOps für das Deployment von ML-Modellen.

---

[[/notes/lectures/ai4iot/index|Zurück zum AI4IoT-Index]] | [[/notes/lectures/ai4iot/03-case-wartung-mit-robotern|Zurück: (y-03) Case: Wartung mit Robotern]]
