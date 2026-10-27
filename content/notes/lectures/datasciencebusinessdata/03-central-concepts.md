---
title: "L03 - Central Concepts"
tags:
  - dsbd
  - data-science
  - business-intelligence
  - advanced-analytics
  - machine-learning
  - big-data
date: 2026-10-27
---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/02-relevance-and-context|Previous: (y-02) Relevance and Context]] | [[/notes/lectures/datasciencebusinessdata/04-system-context|Next: (y-04) System Context]]

## Mental Model First

- Many overlapping terms describe the same field: business intelligence, analytics, advanced analytics, decision support systems, data mining, machine learning, big data, AI and data science. The lecture sorts them. Data science is the systematic application of analytical methods, informed by the scientific method.
- Business intelligence was always meant as an integrated approach to decision support, with a data layer, a logic layer and an access layer. In practice it is now often equated with reporting and OLAP, which are analytics but not advanced analytics.
- Advanced analytics is a new name for model-driven decision support: at its heart is an algorithmic or statistical model that is created with tools, based on a method, and then used for exploration or operationalized in applications. Descriptive analytics asks what happened, predictive what will happen, prescriptive what to do.
- Data mining and machine learning currently dominate advanced and predictive analytics. ML beats hand-coded rules (Cyc failed after more than 1,000 person-years) and learns in supervised, unsupervised, semi-supervised, self-supervised or reinforcement mode.
- "AI" has shifted meaning over the decades from theory and rule-based systems to machine learning, and lately to deep learning and LLMs. Big data drives advanced analytics and can mean a philosophy, a problem domain or an infrastructure approach.

## 1. Data Science

![[pictures/datasciencebusinessdata/03/Lecture03_Pg003_Data_Science.png]]

<p class="image-caption">Data science according to the Data Science Association, close to data mining and advanced and predictive analytics.</p>

The Data Science Association defines data science as "the scientific study of the creation, validation and transformation of data to create meaning", using scientific principles, machine learning and algorithms to extract actionable intelligence from large data sets. The term is similar to data mining and to advanced and predictive analytics. It stresses the purposeful, methodical and systematic application of analytical methods, informed by the scientific method.

### Related Terms

![[pictures/datasciencebusinessdata/03/Lecture03_Pg004_Related_Terms.png]]

<p class="image-caption">Many overlapping terms for the same field.</p>

There are many more related terms: artificial intelligence, cognitive computing, machine learning, knowledge discovery in databases, business intelligence, data mining, big data, decision support systems, cloud analytics, model-based systems, prescriptive and predictive analytics, advanced analytics and OLAP. The rest of the lecture places them relative to each other.

## 2. Business Intelligence and Analytics

![[pictures/datasciencebusinessdata/03/Lecture03_Pg005_Business_Intelligence_And_Analytics.png]]

<p class="image-caption">The BIA framework with data, logic and access layers (Kemper, Baars and Mehanna 2010).</p>

Business intelligence (BI) is "an integrated, IT-based comprehensive approach to operational decision support" (Kemper, Baars and Mehanna 2010). The BIA framework has three layers on top of operational and external systems with structured and unstructured data (SCM, ERP, CRM, web, IoT, social media, partners, open data):

- **Data provision (data layer)**: core data warehouse, data marts, operational data store and data lake.
- **Information generation (logic layer)**: components for concept-oriented analyses, model-oriented analyses (advanced and predictive analytics), report-oriented analyses (reporting and OLAP) and data retrieval and exploration.
- **Information provision (access layer)**: data visualization, information distribution and information access.

Metadata and system integration span all layers. The academic understanding of BI has always included more advanced analysis and thus data science. The term BIA (business intelligence and analytics) makes advanced analytics and ML explicit.

## 3. Analytics and Advanced Analytics

![[pictures/datasciencebusinessdata/03/Lecture03_Pg006_Analytics_And_Advanced_Analytics.png]]

<p class="image-caption">Analytics (Davenport and Harris 2007) and advanced analytics (Bose 2009).</p>

Davenport and Harris (2007) define analytics as "the extensive use of data, statistical and quantitative analysis, explanatory and predictive models, and fact-based management to drive decisions and actions". The results can feed human decisions or drive fully automated ones.

Advanced analytics, according to Bose (2009), "simply means applying various advanced analytic techniques to data to answer questions or solve problems". Those techniques include data, text and web mining, visualization systems, recommendation systems, predictive and descriptive modeling, forecasting, optimization and simulation. Advanced analytics is a new synonym for model-driven decision support systems.

## 4. Model-Driven Decision Support Systems

![[pictures/datasciencebusinessdata/03/Lecture03_Pg007_Model_Driven_Decision_Support_Systems.png]]

<p class="image-caption">Data-driven and model-driven decision support systems.</p>

![[pictures/datasciencebusinessdata/03/Lecture03_Pg008_Model_Driven_Decision_Support_Systems.png]]

<p class="image-caption">Model-driven DSS for inventory optimization (anyLogistix) and investment portfolios.</p>

In the international IS literature, "decision support system" is used broadly for all IT-based decision support. Two kinds are distinguished:

- **Data-driven DSS** give interactive access to large volumes of business data with reporting and OLAP tools.
- **Model-driven DSS** use statistical, financial, optimization or simulation models from operations research or application-specific mathematical methods. Mertens and Meier (2009) define them as "interactive, model- and formula-based" systems that are functionally limited to individual (sub)tasks or task classes.

Examples are anyLogistix for inventory optimization and planning and a visual optimizer for investment portfolios.

## 5. Reporting and OLAP

![[pictures/datasciencebusinessdata/03/Lecture03_Pg009_Reporting_And_Olap.png]]

<p class="image-caption">Interactive reporting at Bayer MaterialScience: analytics, but not advanced analytics.</p>

Interactive reporting is analytics, but not advanced analytics, and it is not associated with data science, although such systems usually have interfaces to it. The example is a Bayer MaterialScience reporting portal with portlets that can show graphs or tables, links between structured and unstructured information and a PortletStore with search and browse functions.

### Ad-hoc Analyses and OLAP

![[pictures/datasciencebusinessdata/03/Lecture03_Pg010_Ad_Hoc_Analyses_And_Olap.png]]

<p class="image-caption">OLAP with Jedox Palo as an Excel pivot table.</p>

![[pictures/datasciencebusinessdata/03/Lecture03_Pg011_Ad_Hoc_Analyses_And_Olap.png]]

<p class="image-caption">Multidimensional analysis along time and location, characterized by FASMI.</p>

OLAP tools such as Jedox Palo (shown as an Excel pivot table on an OLAP server) let users slice multidimensional data along dimensions like time and location. Pendse and Creeth (1996) characterize OLAP with FASMI: Fast Analysis of Shared Multidimensional Information. This too is analytics, but not advanced analytics.

## 6. The Model at the Heart of Advanced Analytics

![[pictures/datasciencebusinessdata/03/Lecture03_Pg012_The_Model_At_The_Heart_Of.png]]

<p class="image-caption">The model at the heart of advanced analytics: created with tools, based on a method, used or operationalized and distributed.</p>

At the heart of advanced and predictive analytics is an algorithmic or statistical-mathematical model. The model

- is first created with various tools, possibly with programming languages,
- is based on a selected method implemented by a specific algorithm,
- is later used either for data exploration or as part of running applications (model operationalization),
- may use special visualizations,
- may be exchanged with formats and tools for model distribution, especially data science notebooks and source code or version management systems.

Analytics workbenches can coordinate access to the various tools.

## 7. Descriptive, Predictive and Prescriptive Analytics

![[pictures/datasciencebusinessdata/03/Lecture03_Pg013_Descriptive_Predictive_And_Prescriptive_Analytics.png]]

<p class="image-caption">Descriptive, predictive and prescriptive analytics with their questions, enablers and outcomes (Delen and Demirkan 2012).</p>

Delen and Demirkan (2012) split business analytics into three kinds:

| Kind         | Questions                             | Enablers                                                     | Outcome                                              |
| :----------- | :------------------------------------ | :----------------------------------------------------------- | :--------------------------------------------------- |
| Descriptive  | What happened? What is happening?     | Business reporting, dashboards, scorecards, data warehousing | Well-defined business problems and opportunities     |
| Predictive   | What will happen? Why will it happen? | Data mining, text mining, web and media mining, forecasting  | Accurate projections of future states and conditions |
| Prescriptive | What should I do? Why should I do it? | Optimization, simulation, decision modeling, expert systems  | Best possible business decisions and transactions    |

### A Revival of Simulation and Optimization?

![[pictures/datasciencebusinessdata/03/Lecture03_Pg014_A_Revival_Of_Simulation_And_Optimization.png]]

<p class="image-caption">Predictive analytics, the limits of models built on past data and the underused fields of optimization and simulation.</p>

Predictive analytics emphasizes relevance to the future and the context of use. It puts more weight on time series analysis, and today it mostly means operationalized models that run repeatedly inside applications and thus inside business processes. Models built only on past data are often insufficient, for example when demographic developments are not reflected in that data. That is a limitation of many ML models and calls for correction factors.

Optimization and simulation have been rather underused, and early expectations about their adoption and impact were not met. The slide asks for reasons and whether the field will see a revival.

## 8. Data Mining and Machine Learning

![[pictures/datasciencebusinessdata/03/Lecture03_Pg015_Data_Mining_And_Machine_Learning.png]]

<p class="image-caption">Data mining as the core of advanced and predictive analytics.</p>

![[pictures/datasciencebusinessdata/03/Lecture03_Pg016_Data_Mining_And_Machine_Learning.png]]

<p class="image-caption">Machine learning as a core pillar of data mining, with its learning paradigms.</p>

Data mining is "a problem-solving methodology that finds a logical or mathematical description, eventually of a complex nature, of patterns and regularities in a set of data" (Decker and Focardi 1995). Bissantz et al. (2000) add that its methods autonomously identify the most significant patterns in large amounts of raw data and present them as interesting knowledge. Data mining methods are the core of advanced and predictive analytics solutions and thus the subject of data science.

Machine learning gives computers "the ability to learn without being explicitly programmed" (Samuel 1959). Next to basic statistical and mathematical methods, it is a core pillar of data mining, and it has made great progress on patterns in unstructured data. It is classified under the umbrella of AI. Deep learning is the ML variant that abstracts step by step from raw data, usually with neural networks with many layers, to process images, video and audio.

## 9. Hand-Coded Rules Versus Machine Learning

### Cyc

![[pictures/datasciencebusinessdata/03/Lecture03_Pg017_Cyc.png]]

<p class="image-caption">Cyc: a rule-based knowledge base of everyday knowledge, discontinued after more than 1,000 person-years.</p>

Cyc (1984 to 2019) tried rule-based AI with a knowledge base covering the everyday knowledge of a human being ("water is wet"). Its knowledge base holds more than 40,000 predicates, 1.5 million concepts and 25 million explicitly stated axioms. The promise was that it would soon be able to read and understand newspapers. After more than 1,000 person-years of investment it was discontinued in 2017 and no longer supported from 2019.

### Rules Extracted by a Classification Tree

![[pictures/datasciencebusinessdata/03/Lecture03_Pg018_Rules_Extracted_By_A_Classification_Tree.png]]

<p class="image-caption">ML extracts rules automatically, here with a classification tree learned from a sales database.</p>

The ML alternative extracts rules from data automatically. In the example from Baars and Kemper (2021), a classification tree learned from a sales database predicts a customer's preferred genre (science fiction, fantasy, games, superheroes) from age, urbanization, fitness and gender.

### Face Recognition Then and Now

![[pictures/datasciencebusinessdata/03/Lecture03_Pg020_Face_Recognition_Then_And_Now.png]]

<p class="image-caption">Face recognition in the past, with explicitly given features.</p>

![[pictures/datasciencebusinessdata/03/Lecture03_Pg021_Face_Recognition_Then_And_Now.png]]

<p class="image-caption">Face recognition today, with a convolutional network that learns its features.</p>

Face recognition used to rely on explicitly given features (Arca, Campadelli and Lanzarotti 2006): mathematical transformations of the image, mathematical descriptions of the typical shapes of nose, mouth and eyes, and a model of the face with individual characteristics.

Today a deep neural network only receives sample images and learns the features and their step-by-step aggregation on its own: convolutional layers recognize key features, pooling layers summarize values, further layers recognize composed features and a final layer classifies, for example "employee" versus "burglar". This works better by magnitudes, and the algorithm is not limited to one application.

### ImageNet Progress

![[pictures/datasciencebusinessdata/03/Lecture03_Pg022_Imagenet_Progress.png]]

<p class="image-caption">Top-5 accuracy on ImageNet over time, above 99% by the early 2020s.</p>

The Papers with Code leaderboard for image classification on ImageNet shows top-5 accuracy climbing from AlexNet around 2012 over VGG, Inception, ResNeXt and AmoebaNet to the Florence and CoSwin models. By the early 2020s, performance had reached more than 99% top-5 and around 91% top-1 accuracy.

## 10. Learning Paradigms

### Supervised Learning

![[pictures/datasciencebusinessdata/03/Lecture03_Pg023_Supervised_Learning.png]]

<p class="image-caption">Supervised learning with labeled apples and pears.</p>

The training data has given target values (labeled data), for example pictures marked as apple or pear. Training adjusts the model parameters, and the trained model then predicts the class of a new object with a confidence ("apple, x% confident"). Supervised learning is used mainly for classification and regression.

### Unsupervised Learning

![[pictures/datasciencebusinessdata/03/Lecture03_Pg024_Unsupervised_Learning.png]]

<p class="image-caption">Unsupervised learning finds groups and outliers in unlabeled data.</p>

The data has no target values. The method finds structure on its own, such as groups and outliers. It is used for clustering, dimension reduction (combining several data columns) and outlier detection.

### Semi-Supervised Learning

![[pictures/datasciencebusinessdata/03/Lecture03_Pg025_Semi_Supervised_Learning.png]]

<p class="image-caption">Semi-supervised learning transfers labels to similar unlabeled examples.</p>

Labels are transferred to unlabeled data based on similarity or clustering. In the slide's example, a few labeled apples, bananas and oranges label the unlabeled fruit that resembles them. This is a common strategy against scarce training data.

### Self-Supervised Learning

![[pictures/datasciencebusinessdata/03/Lecture03_Pg026_Self_Supervised_Learning.png]]

<p class="image-caption">Self-supervised learning: pretext tasks on unlabeled data, then knowledge transfer to a target task (Noroozi et al. 2018).</p>

A model first learns generic features from unlabeled data with so-called pretext tasks and then transfers that knowledge to specific prediction tasks, the downstream tasks (Noroozi et al. 2018). This is used for unstructured data and is especially common for language and image models.

### Reinforcement Learning

![[pictures/datasciencebusinessdata/03/Lecture03_Pg027_Reinforcement_Learning.png]]

<p class="image-caption">Reinforcement learning: an actor learns from rewards and punishments.</p>

A program (the actor) chooses among actions that lead to rewards or punishments. It learns by adjusting its action strategy through continuous prediction of the expected long-term sum of outcomes (Comi 2018). There are impressive showcases in board games, video games and mathematical proofs. RL is widely used for the post-training and alignment of LLMs (for example RLHF) and has become particularly important for training reasoning capabilities.

## 11. Artificial Intelligence, the Chameleon Buzzword

![[pictures/datasciencebusinessdata/03/Lecture03_Pg028_Artificial_Intelligence_The_Chameleon_Buzzword.png]]

<p class="image-caption">The participants of the 1956 Dartmouth workshop, where AI was coined as a deliberately vague umbrella term.</p>

![[pictures/datasciencebusinessdata/03/Lecture03_Pg029_Artificial_Intelligence_The_Chameleon_Buzzword.png]]

<p class="image-caption">AI according to Minsky (1968) and its domains according to Russell and Norvig.</p>

The term was coined at the 1956 Dartmouth workshop. According to its organizer McCarthy, it was deliberately meant as a vague umbrella term. Participants included McCarthy, Minsky, Shannon, Solomonoff, Newell, Simon, Samuel, Selfridge, Rochester and More.

Minsky (1968) defined AI as "the science of making machines do things that would require intelligence if done by men". Russell and Norvig (2016) list language processing, symbolic reasoning, knowledge representation, machine learning, computer vision and robotics among its domains.

### AI Textbooks Over Time

![[pictures/datasciencebusinessdata/03/Lecture03_Pg030_Ai_Textbooks_Over_Time.png]]

<p class="image-caption">Hunt (1975): theoretical questions dominate.</p>

![[pictures/datasciencebusinessdata/03/Lecture03_Pg032_Ai_Textbooks_Over_Time.png]]

<p class="image-caption">Winston (1992): knowledge processes and inference, with first ML methods.</p>

![[pictures/datasciencebusinessdata/03/Lecture03_Pg035_Ai_Textbooks_Over_Time.png]]

<p class="image-caption">Aggarwal (2021): machine learning, especially neural networks, dominates.</p>

The tables of contents of AI textbooks show how the meaning shifted:

| Year | Textbook                                           | Focus                                                                                                                    |
| :--- | :------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| 1975 | Hunt: Artificial Intelligence                      | Theoretical questions (computability, programmability, knowledge representation), fluid border to computer science       |
| 1983 | Gevarter: An Overview of AI and Robotics           | Much more application-oriented, many highly specific and mostly rule-based algorithms                                    |
| 1992 | Winston: Artificial Intelligence, 3rd ed.          | Systematic mapping of knowledge processes and computer-aided inference; some current ML methods already appear           |
| 2003 | Russell and Norvig: AI, A Modern Approach, 2nd ed. | Formal optimization and symbolic inference; ML is one part of eight, but the book declares the return of neural networks |
| 2014 | Neapolitan and Jiang: Contemporary AI              | ML becomes central, but neural networks do not appear at chapter level                                                   |
| 2021 | Aggarwal: Artificial Intelligence, A Textbook      | ML dominates, with the focus on neural networks and deep learning                                                        |

## 12. Strong and Weak AI

![[pictures/datasciencebusinessdata/03/Lecture03_Pg036_Strong_And_Weak_Ai.png]]

<p class="image-caption">Strong and weak AI, and the question whether LLMs mark the emergence of strong AI.</p>

Strong AI (also full or general AI) means, in Searle's (1980) words, that "computers given the right programs can be literally said to understand and have other cognitive states". Lee (2006) describes such systems as ones "that mimic and simulate how humans think". Weak AI (narrow or soft AI) "presents AI as a tool for solving problems" (Flowers 2019). Whether strong AI is possible at all is still debated philosophically, and since 2023 there has been an intense discussion about whether current LLMs represent the emergence of strong AI. The slide asks whether general AI has been reached, and whether it is reachable.

## 13. Big Data

![[pictures/datasciencebusinessdata/03/Lecture03_Pg037_Big_Data.png]]

<p class="image-caption">Big data as a vague concept that is often confounded with analytics.</p>

Big data is a vague and heterogeneous concept, and in practice it is often confounded with (advanced) analytics. The original big data solutions treated analytics as a secondary goal. They mainly made large semi-structured data sets (product pages, blog posts, social media profiles) available for online access and information retrieval. Analytics functions have since gained importance, and big data drives innovative BIA solutions.

### Three Readings of Big Data

![[pictures/datasciencebusinessdata/03/Lecture03_Pg038_Three_Readings_Of_Big_Data.png]]

<p class="image-caption">Big data as a philosophy, a problem domain or an infrastructure approach.</p>

| Reading                                | Meaning                                                                                                                                                     | Character                                                                          |
| :------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| Big data as a philosophy               | Emphasis on exploratory and strategic data use, common in marketing and popular science; revival of neglected approaches like text analysis and data mining | No substantial change compared to existing terms                                   |
| Big data as a problem domain           | Big data exists when velocity, variety or volume is a problem for the user                                                                                  | User-oriented, technology-independent, low comparability of problems and solutions |
| Big data as an infrastructure approach | Storage and analysis of data that relational databases can no longer handle, with massively parallel architectures and NoSQL databases                      | Technology-oriented, not time-independent, clearly defined problems and solutions  |

### Big Data and Advanced Analytics Components

![[pictures/datasciencebusinessdata/03/Lecture03_Pg039_Big_Data_And_Advanced_Analytics_Components.png]]

<p class="image-caption">Classical BI components and big data and advanced analytics components in one architecture.</p>

The extended architecture adds big data components to the classical BI components. Next to the data warehouse, data marts, ETL, OLAP and reporting and concept-oriented solutions, it has a data lake, graph databases and other NoSQL databases, streaming data with monitoring and analysis, data query and exploration, and model-driven advanced and predictive analytics. Sources range from ERP, CRM, SCM, MES and PDM/PLM to the web, social media and the (I)IoT. System integration, data catalog, metadata and administration span all layers.

## 14. Conceptual Map

![[pictures/datasciencebusinessdata/03/Lecture03_Pg040_Conceptual_Map.png]]

<p class="image-caption">How data science, advanced analytics, data mining, ML, DSS and expert systems relate (Baars and Kemper 2021).</p>

Baars and Kemper (2021) connect the terms in one map. Data science is the systematic application of advanced analytics. Advanced analytics is a synonym for model-oriented systems. Data mining, decision support systems and expert systems are attributed to advanced analytics. Statistical methods and machine learning are part of data mining, with statistics also providing methods for ML. Simulation and optimization are used in DSS, and case-based and rule-based systems are types of expert systems. Predictive analytics is advanced analytics focused on forecasting and use, and prescriptive analytics adds proposals for the best actions.

## 15. Conclusion

![[pictures/datasciencebusinessdata/03/Lecture03_Pg041_Conclusion.png]]

<p class="image-caption">The conclusion: what each term means today.</p>

- **Business intelligence** was originally an integrated approach to decision and management support, but today it is often equated with reporting and OLAP.
- **Analytics** is a non-specific umbrella term for all forms of data analysis.
- **Business intelligence and analytics (BIA)** puts more emphasis on new analytical approaches.
- **Advanced analytics** is a new synonym for model-driven decision support systems.
- **Predictive and prescriptive analytics** stress relevance to the future and practical application.
- **Big data** drives advanced and predictive analytics.
- **Data mining and machine learning** currently dominate advanced and predictive analytics.
- **Artificial intelligence** is increasingly used as a synonym for ML and thus advanced analytics, and recently for deep learning and LLMs.

## Summary

- Data science is the systematic, scientifically informed application of analytical methods. It overlaps with data mining and advanced and predictive analytics.
- BIA has a data layer, a logic layer and an access layer. Reporting and OLAP are analytics, but not advanced analytics.
- Advanced analytics revolves around a model that is created with tools, based on a method, and used for exploration or operationalized in applications. Analytics is descriptive, predictive or prescriptive.
- ML replaced hand-coded rules (Cyc) because it learns rules and features from data. It learns supervised, unsupervised, semi-supervised, self-supervised or by reinforcement.
- AI has meant different things over time, now mostly ML, deep learning and LLMs. Big data can be a philosophy, a problem domain or an infrastructure approach.

## Self-Check

1. How does data science differ from data mining and advanced analytics?

> [!success]- Answer
> The terms overlap heavily. Data science stresses the purposeful, methodical and systematic application of analytical methods, informed by the scientific method, to create meaning from data. Data mining names the pattern-finding methods, and advanced analytics names the application of advanced techniques to answer questions or solve problems.

2. Describe the three layers of the BIA framework.

> [!success]- Answer
> The data layer provides data (core data warehouse, data marts, operational data store, data lake) from operational and external systems. The logic layer generates information with concept-oriented, model-oriented (advanced and predictive analytics) and report-oriented (reporting and OLAP) analyses plus retrieval and exploration. The access layer provides visualization, distribution and access. Metadata and system integration span all three.

3. Why are reporting and OLAP not advanced analytics?

> [!success]- Answer
> They give interactive access to existing business data (data-driven decision support), slicing it along dimensions, but they do not build an algorithmic or statistical model. Advanced analytics is a synonym for model-driven decision support, where a model created from a method is used for exploration or operationalized in applications.

4. Distinguish descriptive, predictive and prescriptive analytics.

> [!success]- Answer
> Descriptive analytics asks what happened or is happening, with reporting, dashboards, scorecards and data warehousing. Predictive analytics asks what will happen and why, with data, text and web mining and forecasting. Prescriptive analytics asks what to do and why, with optimization, simulation, decision modeling and expert systems (Delen and Demirkan 2012).

5. Why are models built only on past data a risk?

> [!success]- Answer
> Developments not reflected in past data, such as demographic change, are invisible to them, so their predictions can be systematically wrong. This limits many ML models and calls for correction factors.

6. What does the Cyc project show about rule-based AI?

> [!success]- Answer
> Cyc tried to encode human everyday knowledge as rules and promised to soon read and understand newspapers. After more than 1,000 person-years it was discontinued in 2017 and no longer supported from 2019. ML instead extracts rules and features automatically from data, as with classification trees or deep networks for face recognition.

7. Explain semi-supervised and self-supervised learning.

> [!success]- Answer
> Semi-supervised learning transfers labels from a few labeled examples to unlabeled data based on similarity or clustering. Self-supervised learning learns generic features from unlabeled data with pretext tasks and transfers them to specific downstream tasks. Both address a scarcity of labeled training data, and self-supervised learning is especially common for language and image models.

8. How has the meaning of "AI" changed according to textbooks from 1975 to 2021?

> [!success]- Answer
> In 1975 the focus was theoretical (computability, knowledge representation). In 1983 it was application-oriented with mostly rule-based algorithms. In 1992 it was knowledge processes and inference with first ML methods. In 2003 ML was one part of eight. In 2014 ML became central without neural networks at chapter level, and in 2021 ML, especially neural networks and deep learning, dominated.

9. Name the three readings of big data.

> [!success]- Answer
> Big data as a philosophy (exploratory, strategic data use, little new compared to existing terms), as a problem domain (whenever velocity, variety or volume is a problem for the user, technology-independent) and as an infrastructure approach (data that relational databases cannot handle, solved with massively parallel architectures and NoSQL, technology-oriented).

---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/02-relevance-and-context|Previous: (y-02) Relevance and Context]] | [[/notes/lectures/datasciencebusinessdata/04-system-context|Next: (y-04) System Context]]
