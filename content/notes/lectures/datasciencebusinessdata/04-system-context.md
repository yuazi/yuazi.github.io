---
title: "L04 - System Context"
tags:
  - dsbd
  - data-science
  - tools
  - automl
  - python
  - model-distribution
date: 2026-10-27
---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/03-central-concepts|Previous: (y-03) Central Concepts]]

## Mental Model First

- Advanced analytics now lives in landscapes that mix established BI components (data warehouse, data marts, ETL, OLAP, reporting) with big data components (big data stores, NoSQL and graph databases, streaming analytics, visual analytics). The tool market is huge and confusing.
- The model is the center: a data scientist builds it with a tool and a method (say, a random forest in scikit-learn to identify premium customers), uses it for exploration or operationalizes it as a service, and hands it over through notebooks and Git.
- Tools sort by how much of the model they bring along. Completed analytics services bring a ready model, model templates and foundation models get adapted, method tools and data science environments support building models, and platforms and languages allow free development. A sixth group distributes results and models.
- AutoML, low-code and no-code AI automate repetitive pipeline steps or replace programming with visual interfaces. LLMs may push this further toward talking to your data.
- Python dominates data science programming. Results and models are distributed to humans or machines via exchange formats, notebooks, source code platforms or implemented services, and workbenches and cloud offerings bundle the tools.

## 1. New System Landscapes

![[pictures/datasciencebusinessdata/04/Lecture04_Pg003_New_System_Landscapes.png]]

<p class="image-caption">Big data components next to established BI components, overlaid with product logos.</p>

The new system landscape combines established BI components with big data components. Source systems (CRM, ERP, SCM and others) feed a data warehouse through ETL, with application-specific data marts for reporting and OLAP and in-memory databases. Next to these sit a big data store, graph databases and further NoSQL databases. Information generation adds direct query and search on the big data store, interactive analysis and visualization (visual analytics), analyses and monitoring of streaming data, and advanced and predictive analytics. Administration, metadata management and data quality span the whole landscape.

### The Tool Market

![[pictures/datasciencebusinessdata/04/Lecture04_Pg005_The_Tool_Market.png]]

<p class="image-caption">The 2025 MAD landscape of machine learning, AI and data vendors (FirstMark).</p>

Filled with product logos, the same landscape becomes crowded: Kafka, Storm, Flink and Spark Streaming for streaming data, Hadoop, HBase, MongoDB, Neo4j, CouchDB, Redis and DynamoDB for storage, and SAS, R, MicroStrategy and Datameer for analysis. The 2025 MAD (Machine Learning, Artificial Intelligence and Data) landscape by FirstMark shows how many vendors compete across infrastructure, analytics, ML and AI, applications and data sources.

## 2. The Model and Its Tools

![[pictures/datasciencebusinessdata/04/Lecture04_Pg006_The_Model_And_Its_Tools.png]]

<p class="image-caption">A premium customer model: built with scikit-learn and random forests, used for exploration or in applications.</p>

![[pictures/datasciencebusinessdata/04/Lecture04_Pg007_The_Model_And_Its_Tools.png]]

<p class="image-caption">Visualized as a Sankey diagram, handed to IT as a Jupyter notebook in Git, coordinated through a workbench.</p>

At the heart of advanced and predictive analytics is an algorithmic or statistical-mathematical model, for example a model that identifies premium customers. The lecture follows it through its life:

- It is first created with various tools, for example with the Python library scikit-learn.
- It is based on a method implemented by a specific algorithm, for example random forest classification.
- It is used for data exploration (what makes a premium customer?) or in running applications (automatically making special offers to a potential premium customer, possibly as a web service that the web shop calls).
- Special visualizations may help, for example a Sankey diagram showing how customers become premium customers.
- It is exchanged with formats and tools for model distribution, for example a Jupyter notebook that the IT department gets through a Git repository so it can put the service into operation.
- Analytics workbenches such as Anaconda Enterprise can coordinate access to the tools.

## 3. Tools for the Model Lifecycle

![[pictures/datasciencebusinessdata/04/Lecture04_Pg008_Tools_For_The_Model_Lifecycle.png]]

<p class="image-caption">Tool types by focus, from completed analytics services to platforms and languages.</p>

Tools differ by how much of the model they provide:

| Tool type                             | Focus                           | Description                                                                                         |
| :------------------------------------ | :------------------------------ | :-------------------------------------------------------------------------------------------------- |
| Completed analytics service           | Model use                       | Tools or services that bring ready-made models (for example image recognition or sales forecasting) |
| Model templates and foundation models | Model adaptation or fine-tuning | Tools or services with customizable models (for example for analyzing social media posts)           |
| Method                                | Model creation                  | Tools with freely configurable analytics methods (for example process mining)                       |
| Data science environment              | Model creation                  | Comprehensive tool environments for data science and data analysis                                  |
| Platforms and languages               | Free development                | Development tools and environments suitable for data analysis                                       |
| Tools for model distribution          | Sharing                         | Tools for sharing results and models                                                                |

### Foundation Models

![[pictures/datasciencebusinessdata/04/Lecture04_Pg009_Foundation_Models.png]]

<p class="image-caption">Foundation models can be adapted with little data or prompted without parameter updates.</p>

The range of ready-made models and templates that can be adapted quickly through transfer learning has grown massively. Pre-trained models can often be adapted to new tasks with comparatively little additional training data, through transfer learning or fine-tuning. Foundation models may even solve new tasks through few-shot or zero-shot prompting without any parameter updates. Completed services with ready-made models that are called like a regular program function are not covered in this class.

## 4. The Tool Environment of a Data Scientist

![[pictures/datasciencebusinessdata/04/Lecture04_Pg010_The_Tool_Environment_Of_A_Data.png]]

<p class="image-caption">The tool environment of a data scientist: data sources, model creation tools, analytical models and distribution (based on Baars 2016).</p>

Based on Baars (2016), the data scientist's environment has four parts:

- **Data sources**: sources embedded in business processes (sensors, RFID, CRM, ERP, SCM), external data, a data warehouse and a data lake, accessed directly or through an analytics sandbox.
- **Tools for model creation**, especially data mining and ML, provided as self-contained services, templates, data science environments, programming platforms or languages. They cover process mining, social media analysis, simulation and optimization (DSS), data visualization and data mining or machine learning, together with tools for data access and exploration.
- **Analytical models** that go back into the data lake, the data warehouse and the business processes as model application. External model templates can be imported.
- **Information and model distribution** through CSV, XML or JSON, reports (PDF, HTML), direct exchange of source code, exchange formats, data science notebooks and version management platforms.

An analytics workbench can wrap the whole environment for access control and administration.

## 5. Examples by Tool Category

### Tool With Model Templates: Fraud Detection

![[pictures/datasciencebusinessdata/04/Lecture04_Pg011_Tool_With_Model_Templates_Fraud_Detection.png]]

<p class="image-caption">The fraud detection tool of deepsense.ai with prepared model templates.</p>

The fraud detection tool by deepsense.ai comes with prepared model templates. Its dashboard shows the monitoring system status, an activity monitor with suspicious activity over time, fraud detected by region on a map, the top suspicious activities, a network analysis of suspicious entities and anomalous activity by type.

### Tool for a Method Group: Process Mining

![[pictures/datasciencebusinessdata/04/Lecture04_Pg012_Tool_For_A_Method_Group_Process.png]]

<p class="image-caption">A purchase-to-pay analysis in the Celonis process mining tool.</p>

Celonis is a tool for one group of methods, process mining. The example shows a purchase-to-pay analysis with 279,020 purchase order items worth about 539 million dollars. The process graph shows all variants as paths, and a histogram on the side shows how often each variant occurs.

### Data Science Environments: RapidMiner and SPSS Modeler

![[pictures/datasciencebusinessdata/04/Lecture04_Pg013_Data_Science_Environments_Rapidminer_And_Spss.png]]

<p class="image-caption">A process of operators in RapidMiner.</p>

![[pictures/datasciencebusinessdata/04/Lecture04_Pg015_Data_Science_Environments_Rapidminer_And_Spss.png]]

<p class="image-caption">An excerpt of a real ML process in SPSS Modeler (Hecht and Rathgeb 2015).</p>

Data science environments like RapidMiner and IBM SPSS Modeler let analysts build ML processes as visual flows of operators: data access, cleansing, transformation, modeling and evaluation, connected by drag and drop. A real ML process in SPSS Modeler (Hecht and Rathgeb 2015) quickly grows into a large network of such nodes.

## 6. AutoML, Low-Code AI, No-Code AI and Augmented Analytics

![[pictures/datasciencebusinessdata/04/Lecture04_Pg016_Automl_Low_Code_Ai_No_Code.png]]

<p class="image-caption">AutoML (Truong et al. 2019), low-code and no-code AI (Keil 2022) and augmented analytics.</p>

- **AutoML**: "Automated machine learning (AutoML) has emerged as a way to save time and effort on repetitive tasks in ML pipelines, such as data pre-processing, feature engineering, model selection, hyperparameter optimization, and prediction result analysis" (Truong et al. 2019).
- **Low-code and no-code AI**: "No-code stands for a family of tools that allow people to build applications and systems without having to program them in a conventional way. Instead, the core functionality is accessible through visual interfaces and guided user actions, as well as pre-built integrations with other tools to exchange information as needed" (Keil 2022).
- **Augmented analytics**: the use of ML and AI for analytics itself.

### AutoML in Data Preprocessing

![[pictures/datasciencebusinessdata/04/Lecture04_Pg017_Automl_In_Data_Preprocessing.png]]

<p class="image-caption">Automatic Data Preparation in IBM SPSS Modeler.</p>

An early example is "Automatic Data Preparation" in IBM SPSS Modeler.

### Talk to Your Data?

![[pictures/datasciencebusinessdata/04/Lecture04_Pg018_Talk_To_Your_Data.png]]

<p class="image-caption">Can LLMs augment ML solutions, and will chatbots replace low-code and no-code tools?</p>

The next step in no-code ML may be to talk to your data. The slide asks how an LLM can augment an ML solution and whether chatbot interaction will eventually replace low-code and no-code solutions.

## 7. Programming Languages for Data Science

![[pictures/datasciencebusinessdata/04/Lecture04_Pg019_Programming_Languages_For_Data_Science.png]]

<p class="image-caption">A random forest in R: import, training, prediction, accuracy and ROC curve in a few lines.</p>

Development environments and analysis-oriented languages give the most freedom. An R example in RStudio (Lutz, Sultanic and Thai 2017) shows the typical steps in a few lines: import training and test data with `read.csv2`, build a random forest with `randomForest(Error ~ ., data = Training, ntree = 1000, ...)`, predict the test data, build a confusion table, compute accuracy and further metrics and draw a ROC curve with the ROCR package.

### Language Rankings

![[pictures/datasciencebusinessdata/04/Lecture04_Pg020_Language_Rankings.png]]

<p class="image-caption">The top programming languages for machine learning (GeeksforGeeks).</p>

![[pictures/datasciencebusinessdata/04/Lecture04_Pg021_Language_Rankings.png]]

<p class="image-caption">AI programming languages by TIOBE rating, use case and job demand.</p>

GeeksforGeeks ranks the top languages for machine learning as Python, R, Java, Julia, Scala, C++, JavaScript, Lisp, Haskell and Go. A second ranking (Second Talent, based on the Stack Overflow 2025 Developer Survey) combines the TIOBE rating of September 2026 with job demand:

| Rank | Language     | TIOBE (Sep 2026) | Primary AI use case               | Job demand    |
| ---: | :----------- | ---------------: | :-------------------------------- | :------------ |
|    1 | Python       |           17.76% | ML/DL, data science, NLP          | 152,000+ jobs |
|    2 | C++          |            8.67% | Performance-critical AI, robotics | High          |
|    3 | Java         |            7.54% | Enterprise AI, big data           | 43,000+ jobs  |
|    4 | JavaScript   |            2.76% | Web-based AI, TensorFlow.js       | 30,000+ jobs  |
|    5 | R            |            1.69% | Statistical analysis, research    | Moderate      |
|    6 | Julia        |            0.74% | Scientific computing, HPC         | Growing       |
|    7 | Scala        |            0.39% | Big data ML, Apache Spark         | Moderate      |
|    8 | Go           |            1.10% | AI infrastructure, cloud          | Growing       |
|    9 | Rust         |            1.34% | Memory-safe AI systems            | Premium       |
|   10 | Swift/Kotlin |    0.83% / 0.67% | Mobile AI, on-device ML           | High          |

### Languages by Context of Use

![[pictures/datasciencebusinessdata/04/Lecture04_Pg022_Languages_By_Context_Of_Use.png]]

<p class="image-caption">Languages for ML and data science by context of use and special features.</p>

| Language   | Context of use                                             | Special feature                                                                                            |
| :--------- | :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| Python     | Any type of application, predominant for analytics         | Scripting language with a wide range of applications; adopted concepts from R and Matlab for data analysis |
| Java       | Any type of application                                    | Most widely used general-purpose language; syntax similar to C/C++, but closer to the user                 |
| R          | Statistics, data analysis                                  | Mathematical and statistical focus                                                                         |
| C++        | Efficient yet object-oriented applications                 | C with object orientation                                                                                  |
| C          | Efficient applications                                     | Low-level language                                                                                         |
| JavaScript | Web front ends, now also back ends                         | Started as a scripting language for dynamic websites, increasingly general purpose                         |
| Scala      | Back-end programs, big data processing (with Apache Spark) | "Enhanced Java" with features from functional programming                                                  |
| Julia      | Demanding analyses with large amounts of data              | Designed for high-performance data analysis and parallelization                                            |

### Python

![[pictures/datasciencebusinessdata/04/Lecture04_Pg023_Python.png]]

<p class="image-caption">Python as a general-purpose language, from IT automation to deep learning frameworks.</p>

![[pictures/datasciencebusinessdata/04/Lecture04_Pg024_Python.png]]

<p class="image-caption">The characteristics of Python and the growth of PyPI.</p>

Python is a general-purpose language and is not limited to analytics. It is used for scripting and automating routine IT tasks (Ansible, Salt or StackStorm for configuration and administration, Fabric for remote execution), for back-end integration with Django or Flask, for programming IoT devices like the Raspberry Pi, for data science and ML, as a scripting language for many cloud services (especially Google's) and as the language of most deep learning frameworks (TensorFlow, PyTorch).

Its characteristics:

- A simple scripting language that is easy to read and quick to use.
- Mostly interpreted, so instructions run immediately without translation into machine code, and it can be used interactively.
- No explicit type declarations.
- Structure by indentation, without curly brackets or semicolons, and a small number of keywords.
- Still supports complex constructs: full object orientation, functional programming (lambda functions, map and reduce), decorators and list comprehensions.
- Many modules in the standard library, extensible with packages. As of November 11, 2025, PyPI listed 919,419 projects with 9,918,874 releases (about 1.8 million releases in 2019, 4.3 million in 2023, 7.5 million in 2025).

## 8. Distributing Results, Models and Model Templates

![[pictures/datasciencebusinessdata/04/Lecture04_Pg025_Distributing_Results_Models_And_Model_Templates.png]]

<p class="image-caption">Distribution channels by subject (results or models) and recipient (humans or machines).</p>

Distribution channels differ by what is distributed (results or models and model templates) and who receives it (humans, which is not easily automated, or IT systems, which is easily automated):

- **Results to humans**: distribution without specific components (e-mail, websites) or via content and document management.
- **Results to machines**: automated transfer of results, for example in closed-loop data warehousing.
- **Models and templates**: data science notebooks and source code management platforms (more for humans), exchange formats, direct code sharing and implemented IT services (more for machines).
- Both can be used within an integrated analytics tool.

### Data Exchange Formats

![[pictures/datasciencebusinessdata/04/Lecture04_Pg026_Data_Exchange_Formats.png]]

<p class="image-caption">The same maintenance case as CSV, XML and JSON.</p>

Common exchange formats are CSV, XML and JSON. The slide shows the same elevator maintenance case (time, elevator ID, customer, model, region, problem "stuck", duration 416 minutes, four people affected and three defects) as XML and JSON, and planning data as semicolon-separated CSV.

### Data Science Notebooks

![[pictures/datasciencebusinessdata/04/Lecture04_Pg027_Data_Science_Notebooks.png]]

<p class="image-caption">A Jupyter notebook mixing explanations and Python code, before and after execution.</p>

Jupyter notebooks mix HTML or Markdown cells for comments and explanations with Python code cells, for example for working with matrices in NumPy or generating and plotting data with NumPy and Matplotlib. After execution, the outputs and plots appear inline, so a notebook carries code, results and explanation together.

### Version Management Systems

![[pictures/datasciencebusinessdata/04/Lecture04_Pg028_Version_Management_Systems.png]]

<p class="image-caption">A GitHub repository for teaching cluster analysis.</p>

Models and model templates can also be shared through source code and version management platforms like GitHub. The example is a repository with Python scripts and a generated CSV for teaching cluster analysis.

## 9. Workbenches

![[pictures/datasciencebusinessdata/04/Lecture04_Pg029_Workbenches.png]]

<p class="image-caption">A workbench bundling Jupyter, Zeppelin and RStudio.</p>

Workbenches are data science and data analysis environments that bundle several tools and add version management, security and rights management, deployment and big data access. The IBM Data Scientist Workbench bundled Jupyter notebooks, Apache Zeppelin and RStudio.

## 10. Cloud Computing for Data Science

![[pictures/datasciencebusinessdata/04/Lecture04_Pg030_Cloud_Computing_For_Data_Science.png]]

<p class="image-caption">Why ML and data mining suit cloud services, and the question of downsides.</p>

Cloud services suit ML and data mining for several reasons:

- Computing requirements change during the model lifecycle.
- Complex integration, configuration and administration add to already high user requirements.
- Development methods and tools change quickly.
- Analytics offers extensive possibilities for parallelization.
- Operational, security and infrastructure risks are manageable.
- External content and functions matter.

Cloud services provide scalable, shared, internet-based infrastructure, platforms or software, ideally geared toward analytics requirements like parallelization, combining methods and model templates. The slide also asks about the downsides.

### Cloud Analytics Offerings

![[pictures/datasciencebusinessdata/04/Lecture04_Pg031_Cloud_Analytics_Offerings.png]]

<p class="image-caption">Cloud analytics offerings by tool level and the higher-level systems that combine them.</p>

Cloud analytics offerings follow the same tool levels, from completed analytics services through model templates, methods and data mining environments to platforms and languages. Higher-level systems combine them: functional SaaS applications, end-to-end BIA tool suites and PaaS development environments focus on the overall system including model operationalization and integration, while cognitive computing platforms focus on combining models. The slide closes by asking whether all of this is moot now that LLMs have become so powerful.

## Summary

- System landscapes combine established BI components with big data components, and the tool market is crowded.
- The model is the center of advanced analytics: built with a tool and a method, used for exploration or operationalized, visualized and distributed.
- Tool types range from completed services (model use) over templates and foundation models (adaptation) and method tools and data science environments (creation) to platforms and languages (free development).
- AutoML, low-code and no-code AI and augmented analytics automate or simplify modeling, and LLMs may add natural language access.
- Python is the predominant data science language. Results and models go to humans or machines via exchange formats, notebooks, Git, services and integrated tools, and workbenches and cloud offerings bundle the tools.

## Self-Check

1. Walk through the life of a premium customer model.

> [!success]- Answer
> It is created with a tool such as scikit-learn, based on a method such as random forest classification. It is used for exploration (what makes a premium customer?) or in running applications (automatic special offers, possibly as a web service called by the web shop). A Sankey diagram can show how customers become premium customers. A Jupyter notebook in a Git repository hands it over to IT for operation, and a workbench like Anaconda Enterprise can coordinate tool access.

2. Order the tool types for the model lifecycle by how much of the model they provide.

> [!success]- Answer
> Completed analytics services (ready-made model, focus on use), model templates and foundation models (adaptation and fine-tuning), method tools and data science environments (model creation), platforms and languages (free development). Tools for model distribution sit beside them.

3. What can foundation models do that changes the tool picture?

> [!success]- Answer
> They can be adapted to new tasks with comparatively little training data through transfer learning or fine-tuning, and they may solve new tasks through few-shot or zero-shot prompting without any parameter updates.

4. Define AutoML and no-code AI.

> [!success]- Answer
> AutoML automates repetitive steps in ML pipelines such as preprocessing, feature engineering, model selection, hyperparameter optimization and result analysis (Truong et al. 2019). No-code AI tools let people build applications without conventional programming, through visual interfaces, guided actions and pre-built integrations (Keil 2022).

5. Why is Python the predominant language for data science?

> [!success]- Answer
> It is easy to read and quick to use, interpreted and interactive, with no type declarations and few keywords, yet supports object orientation, functional constructs, decorators and list comprehensions. It is general purpose, the main deep learning frameworks use it, and PyPI has hundreds of thousands of packages. It also leads the TIOBE ranking and job demand for AI.

6. How do distribution channels for results and models differ?

> [!success]- Answer
> They differ by subject (results or models and templates) and recipient (humans, not easily automated, or IT systems, easily automated). Results reach humans through e-mail, websites or document management and machines through automated transfer like closed-loop data warehousing. Models travel through notebooks and source code platforms or through exchange formats, code sharing and implemented services.

7. Why does cloud computing fit data science, and what are cloud analytics offerings?

> [!success]- Answer
> Computing needs change over the model lifecycle, integration and administration are complex, methods and tools change fast, analytics parallelizes well, risks are manageable and external content matters. Cloud analytics offerings mirror the tool levels from completed services to platforms, combined into SaaS applications, end-to-end BIA suites, PaaS environments or cognitive computing platforms.

---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/03-central-concepts|Previous: (y-03) Central Concepts]]
