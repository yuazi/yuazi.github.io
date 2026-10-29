---
title: "L05a - Organizational Context"
tags:
  - dsbd
  - data-science
  - data-quality
  - data-governance
  - crisp-dm
  - data-preparation
date: 2026-10-29
---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/04-system-context|Previous: (y-04) System Context]]

## Mental Model First

- Surveys name data issues, compliance, missing analytics culture and skill shortages as the main barriers to AI and ML in companies, and data quality, governance and literacy as the top trends in data management.
- Data quality means data that is fit for use by its consumers. Wang and Strong (1996) split it into intrinsic, contextual, representational and accessibility quality.
- Governance assigns decision rights over data: policies, data owners and data stewards. A BI Competency Center (now often called an Analytics or AI Competence Center) bundles BI and analytics know-how in one interdisciplinary unit.
- Data science roles are often scattered across the organization. The lecture argues for a matrix: data analysts and stewards in the business units, data scientists and data managers in a central competence center.
- Process models give ML projects a structure: KDD (Fayyad et al. 1996), SEMMA, CRISP-DM (Chapman et al. 2000) and, for self-service analytics, DataOps.
- Before modeling comes data understanding and preparation: treat records as vectors, explore with descriptive statistics and simple charts, check distributions and correlations, then wrangle, transpose, dummy-code and standardize. Modeling itself has to fight overfitting with data splits, cross validation and regularization.

## 1. Organizational Challenges

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg003_Organizational_Challenges.png]]

<p class="image-caption">Survey findings on data management trends, limitations and satisfaction with analytics managers.</p>

Several surveys describe the organizational side of data and AI:

- BARC (2025) lists BI security and privacy, data governance, data quality management, data-driven culture and data and AI literacy as the top trends in data management. The core limitations to exploiting data are high compliance, security and privacy requirements, little data and analytics affinity in the enterprise, heterogeneous data landscapes, resource and skill shortages and a missing data and analytics culture in management. Data sovereignty has become a new, pressing issue.
- In Deloitte's second State of AI in the Enterprise survey (2025), 39 percent of roughly 1,100 IT and business executives named "data issues" among their three greatest challenges with AI initiatives.
- Deloitte (2020) found that concerns in companies mainly relate to IT security, the resulting vulnerability of processes to disruption, and data protection and ethics.
- According to EY and Forbes Insight, only about 45% of CFOs, CIOs and CTOs are satisfied with their analytics managers, compared to about 70% for specialist departments and IT.

Best-in-class companies answer with organizational measures such as role concepts and dedicated departments.

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg004_Organizational_Challenges.png]]

<p class="image-caption">Top AI initiatives for competitive advantage (Deloitte, State of AI in the Enterprise, 3rd edition, N = 2,737).</p>

In Deloitte's third State of AI in the Enterprise survey (N = 2,737), the most common top initiative is modernizing data infrastructure for AI (20%), followed by access to the newest AI technologies (19%), cloud-based AI services (17%), data science and AI development platforms (16%), partnerships (14%), hiring world-class AI experts (9%) and low-code or AutoML (6%). More than four in ten companies still have a low or medium level of sophistication across their data practices. The slide's takeaway: ML success is closely tied to data management and data organization.

## 2. Data Quality

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg005_Data_Quality.png]]

<p class="image-caption">Data quality as fitness for use, with a guiding question for each criterion.</p>

Wang and Strong (1996) define data quality as data that are fit for use by data consumers. Each criterion comes with a question you can ask of a dataset:

| Criterion               | Question                                                      |
| :---------------------- | :------------------------------------------------------------ |
| Consistency / integrity | Is everything consistent?                                     |
| Completeness            | Have all defined or relevant facts been recorded?             |
| Precision               | Is the level of detail in the data adequate?                  |
| Validity                | Does it comply with the domain specifications?                |
| Accuracy                | How accurately and correctly does the data reflect the facts? |
| Timeliness / currency   | Is the data up to date?                                       |
| Reasonableness          | Are the data values credible?                                 |
| Conformity              | Are formats used correctly?                                   |

### Data Quality Dimensions

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg006_Data_Quality_Dimensions.png]]

<p class="image-caption">The four data quality dimensions of Wang and Strong (1996).</p>

Wang and Strong group the criteria into four dimensions:

- **Intrinsic**: believability, accuracy, objectivity, reputation.
- **Contextual**: value added, relevancy, timeliness, completeness, appropriate amount of data.
- **Representational**: interpretability, ease of understanding, representational consistency, concise representation.
- **Accessibility**: accessibility, access security.

Contextual quality depends on the task, so the same dataset can be good enough for one analysis and useless for another.

## 3. Organizational Data Concepts and Roles

### Data Governance, Data Policy and Data Owner

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg007_Data_Governance_Policy_Owner.png]]

<p class="image-caption">Definitions of data governance, data policy and data owner.</p>

- **Data governance** "specifies the framework for decision rights and accountabilities to encourage desirable behavior in the use of data. [...] develops and implements corporate-wide data policies, guidelines, and standards that are consistent with the organization's mission, strategy, values, norms, and culture" (Weber et al. 2009).
- **Data policy**: "a statement that delineates management responsibility for data and activities that touch and/or impact data and information" (Redman 1996).
- **Data owner**: "the entity (usually a business unit) having responsibility and authority for a specific dataset" (Lucas 2010).

### Data Steward

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg008_Data_Steward.png]]

<p class="image-caption">The data steward's responsibilities according to DAMA (2008).</p>

DAMA (2008) defines the data steward as a business leader or subject matter expert who is accountable, within an assigned subject area, for:

- identifying operational and BI data requirements,
- the quality of data names, business definitions and domain values,
- compliance with regulations and conformance to internal data policies and standards,
- applying appropriate security controls,
- analyzing and improving data quality,
- identifying and solving data-related issues.

### The BI Competency Center

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg009_The_BICC.png]]

<p class="image-caption">Definition and tasks of a BI Competency Center (Gansor and Totok 2015).</p>

"A Business Intelligence Competency Center is an organizational unit that assumes responsibilities and fulfills tasks and processes with an interdisciplinary team for the promotion of an effective use of business intelligence [and analytics] in companies" (Gansor and Totok 2015). It does this through standardization and coordination, support for the BI strategy, portfolio management, training and consulting, and project support. Today the same unit is often called an Analytics Competence Center or AI Competence Center.

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg010_Functions_Of_A_BICC.png]]

<p class="image-caption">Functions of a BICC in four groups (Gansor and Totok 2015).</p>

The functions fall into four groups:

| Group             | Functions                                   |
| :---------------- | :------------------------------------------ |
| BI management     | BI management, BI standardization           |
| BI support        | BI HR, BI support                           |
| BI architecture   | Domain architecture, technical architecture |
| BI implementation | BI development, BI operation                |

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg011_Roles_In_The_BICC.png]]

<p class="image-caption">BI roles in the BICC, with the data scientist as one of the additional roles.</p>

Gansor and Totok (2015) list the roles inside a BICC:

- **Main roles**: BICC leader, representative of the business side, BI architect.
- **Main role if applicable**: BICC analyst.
- **Additional roles**: BI modeler, data quality manager, data scientist, application manager, system administrator, BI application developer, trainer, BI missionary, foreign affairs representative, BI knowledge management.

The data scientist is circled on the slide: in this 2015 model it is only an additional role. The slide asks how these competence centers have evolved since, which new roles have appeared, whether agents will take some of them over, and offers the question as a master's thesis topic.

## 4. Embedding Data Science Roles Into the Organization

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg012_Embedding_Data_Science_Roles.png]]

<p class="image-caption">Reality in many corporations: analytics units scattered across the org chart.</p>

In many corporations, analytics units sit wherever they happened to be founded. Finance and controlling has a BI and reporting unit (the BICC) and a separate data science team for finance. Production has a task force for analytics on one component line, sales and marketing runs its own analytical CRM, and IT hosts the data lake with a predictive analytics team plus a central data science team that business units can book. The groups sit in separate branches of the org chart with no link between them.

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg013_Embedding_Data_Science_Roles.png]]

<p class="image-caption">The alternative: a matrix around a Competence Center BI and Data Science.</p>

The lecture proposes a matrix that fits the decentralized nature of data science. Every business unit (finance and controlling, manufacturing with its component lines, sales and marketing) and the digital transformation unit keeps its own data analysts and data stewards with an application-oriented focus. A Competence Center BI and Data Science next to IT holds the data scientists (methodical focus) and data managers (technical focus), and possibly reports to the board. It also runs the central data storage, the data lake and the data warehouse. Matrix lines connect the analysts and stewards in each unit to the competence center.

## 5. Data Scientists and Data Analysts

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg014_Required_Competencies.png]]

<p class="image-caption">Required competencies: statistics, IT and domain knowledge feed the data science roles.</p>

Data scientists and data analysts need statistical-mathematical knowledge for model development, IT knowledge for model operationalization, and domain knowledge for problem analysis and for processing and communicating results. Arrows on the slide run between all three, so each area feeds the others.

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg015_Required_Competencies.png]]

<p class="image-caption">Two opposing practitioner quotes on what matters more.</p>

Practitioners disagree on the weighting. One quote says the days of looking for statistics experts are over and that understanding the infrastructure and the technical logic matters more. The other insists that a solid foundation in statistics is still the most important thing in advanced and predictive analytics, because throwing tools at data only produces garbage. The slide leaves the question open.

### Two Worlds, Two Roles

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg016_Two_Worlds_Two_Roles.png]]

<p class="image-caption">Top ten task types in job postings for data scientists and data analysts (Schmid and Baars 2016).</p>

An analysis of 240 job postings (Schmid and Baars 2016) shows two different profiles:

| Rank | Data scientist (N = 120 nominations)       | Share | Data analyst (N = 134 nominations)      | Share |
| ---: | :----------------------------------------- | ----: | :-------------------------------------- | ----: |
|    1 | Data analyses                              | 52.5% | Data analyses                           | 57.5% |
|    2 | Data mining projects, tools, technologies  | 47.5% | Reporting and standard reports          | 41.8% |
|    3 | ML methods and techniques                  | 39.2% | Cooperation with departments, people    | 29.9% |
|    4 | Big data projects, solutions, technologies | 38.3% | Optimizing processes, products, systems | 27.6% |
|    5 | Algorithms                                 | 35.0% | Basis for decisions, recommendations    | 22.4% |
|    6 | BI projects, solutions, technologies       | 27.5% | Data mining projects, tools             | 21.6% |
|    7 | Statistical-mathematical model development | 25.8% | Ad-hoc analyses                         | 20.9% |
|    8 | Optimizing processes, products, systems    | 20.8% | BI projects, solutions, technologies    | 17.9% |
|    9 | Basis for decisions, recommendations       | 20.0% | Data warehouse                          | 15.7% |
|   10 | Data visualization                         | 17.5% | Database                                | 14.2% |

The data scientist is the methodologist: data mining, ML, big data and algorithms. The data analyst is the linking pin: reporting, cooperation with departments and ad-hoc analyses that connect the business to the data.

## 6. Process Models for ML Projects

### Knowledge Discovery in Databases

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg017_Knowledge_Discovery_In_Databases.png]]

<p class="image-caption">The KDD process of Fayyad et al. (1996), with feedback loops back to every step.</p>

The KDD process (Fayyad et al. 1996) turns raw data into knowledge in five steps: selection produces the target data, preprocessing the preprocessed data, transformation the transformed data, data mining the patterns, and interpretation and evaluation the knowledge. Dashed feedback arrows run from interpretation back to every earlier step, since an evaluation can show that the data was selected or prepared badly.

### SEMMA

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg018_SEMMA.png]]

<p class="image-caption">The five SEMMA stages (Azevedo and Santos 2008).</p>

SEMMA, from SAS, names its five stages after the letters (Azevedo and Santos 2008):

- **Sample**: extract a portion of a large dataset that is big enough to contain the significant information yet small enough to manipulate quickly.
- **Explore**: search the data for unanticipated trends and anomalies to gain understanding and ideas.
- **Modify**: create, select and transform the variables to focus the model selection.
- **Model**: let the software search automatically for a combination of data that reliably predicts a desired outcome.
- **Assess**: evaluate the usefulness and reliability of the findings and estimate how well the model performs.

### CRISP-DM

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg019_CRISP_DM.png]]

<p class="image-caption">The CRISP-DM cycle around the data (Chapman et al. 2000).</p>

CRISP-DM (Cross-Industry Standard Process for Data Mining, Chapman et al. 2000) arranges six phases in a cycle around the data: business understanding, data understanding, data preparation, modeling, evaluation and deployment. Business and data understanding go back and forth, as do data preparation and modeling, and evaluation can send the project back to business understanding. Unlike KDD and SEMMA, it starts with the business problem and ends with deployment.

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg020_CRISP_DM.png]]

<p class="image-caption">CRISP-DM tasks and outputs for each phase.</p>

Each phase has generic tasks and outputs:

| Phase                  | Tasks (outputs)                                                                                                                                                                                                                         |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business understanding | Determine business objectives (background, objectives, success criteria); assess situation (resources, requirements, risks, terminology, costs and benefits); determine data mining goals; produce project plan (plan, tool assessment) |
| Data understanding     | Collect initial data, describe data, explore data, verify data quality (one report each)                                                                                                                                                |
| Data preparation       | Select data (rationale for inclusion or exclusion), clean data, construct data (derived attributes, generated records), integrate data (merged data), format data; output is the dataset and its description                            |
| Modeling               | Select modeling technique (and assumptions), generate test design, build model (parameter settings, models, descriptions), assess model (revised parameter settings)                                                                    |
| Evaluation             | Evaluate results against business success criteria (approved models), review process, determine next steps (list of possible actions, decision)                                                                                         |
| Deployment             | Plan deployment, plan monitoring and maintenance, produce final report and presentation, review project (experience documentation)                                                                                                      |

### SSBI and DataOps

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg021_SSBI_And_DataOps.png]]

<p class="image-caption">DataOps for self-service analytics (Sun and Baars 2023).</p>

In self-service BI, business units build their own analyses. Sun and Baars (2023) apply DevOps ideas to this setting as DataOps:

- Professional data provision and cooperative development of data pipelines.
- Strict, analytics-focused data governance for the whole company, including continuous integration for new data sources.
- Close cooperation between IT and the business unit, support from the analytics team and standardized distribution of results (continuous deployment).
- End-to-end metadata management for self-service analytics.
- Expert or peer-based validation of analysis results as the equivalent of testing.
- Uniform rules for developing and documenting the data profiles created in self-service.

## 7. Data Understanding and Data Preparation

### Data as Points and Vectors

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg022_Data_As_Points_And_Vectors.png]]

<p class="image-caption">A customer relation read as a matrix, its rows as points and vectors.</p>

Most methods see a table as a matrix. The relation "Customer" with the attributes (features) age and sales actual has three data objects, customer numbers 13011, 13012 and 13013 with (47, 140 €), (33, 188 €) and (26, 95 €). Read as a matrix, each row becomes a data point in a two-dimensional space, and customer 13013 becomes the vector (95, 26) when sales is put on the first axis. Distances, angles and similarities between customers then follow from ordinary vector math.

### Data Exploration

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg023_Data_Exploration.png]]

<p class="image-caption">Descriptive statistics and simple charts: line, scatter, histogram, bar and pie.</p>

Exploration starts with descriptive statistics (central tendency and dispersion) and simple visualizations: line, scatter, histogram, box, bar or column and pie charts. The slide shows examples such as monthly revenue for two locations, a 3D scatter plot, a histogram of a production quality measure, average ice cream ratings by customer segment as stacked bars and sales by product category as a pie chart.

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg024_Data_Exploration.png]]

<p class="image-caption">Transactions per day from 2015 to 2017, with one extreme spike.</p>

Simple diagrams and pivot charts often reveal the first relevant results. A chart of transactions per day from 2015 to 2017 shows seasonal peaks and one extreme spike of over 600 transactions. Is it an outlier, an error or an anomaly? Exploring the data shows these were sunny days, so the spikes carry real information and should not be cleaned away.

### Central Tendency

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg025_Central_Tendency.png]]

<p class="image-caption">Descriptive statistics per attribute in RapidMiner, with a histogram for each.</p>

Descriptive statistics include maximum, minimum and frequencies, and the measures of central tendency: mode, arithmetic or geometric mean and quantiles (median, terciles, quartiles, deciles, percentiles). Tools like RapidMiner show these per attribute next to a small histogram, for example payment method, gender, fit, height, size and student status in a fashion retail dataset.

### Dispersion and Box Plots

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg027_Dispersion_And_Box_Plots.png]]

<p class="image-caption">A box plot of age by gender with median, quartiles, whiskers and outliers.</p>

Dispersion parameters are the range, the empirical variance, the empirical standard deviation and the interquartile range, which contains the middle 50% of observations. A box plot shows them at once: the box runs from the lower to the upper quartile with the median inside, the whiskers reach the furthest values within 1.5 times the interquartile range, and anything beyond is drawn as an outlier.

### Distributions

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg028_Normal_Distribution.png]]

<p class="image-caption">The density of the standard normal distribution N(0,1).</p>

The normal distribution is parametric: mean and variance define it completely. Distributions in general are described by their moments: mean, skewness and kurtosis.

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg029_Right_Skewed_Distribution.png]]

<p class="image-caption">Number of customers by age, a right-skewed distribution.</p>

Customer age is right-skewed: most customers are young and a long tail reaches into the sixties. As usual for right-skewed data, the median (28) lies below the mean (29), because the few old customers pull the mean up.

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg030_Other_Distributions.png]]

<p class="image-caption">Uniform, log-normal, Poisson and exponential or gamma distributions in business data.</p>

Business data often follows other distributions:

| Distribution         | Example on the slide                      |
| :------------------- | :---------------------------------------- |
| Uniform              | Color selection when ordering T-shirts    |
| Log-normal           | Salary distribution in the target group   |
| Poisson              | Lost deliveries per month over four years |
| Exponential or gamma | Amount of damage in insurance claims      |

If variables are not normally distributed, check carefully whether a method still applies.

### Correlation

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg031_Correlation.png]]

<p class="image-caption">Four scatter plots with their Bravais-Pearson correlation coefficients.</p>

The Bravais-Pearson correlation coefficient measures linear dependency. The four scatter plots show a cloud with no relation (-0.027), a noisy linear trend (0.891), an almost perfect line (0.996) and a clear sine wave that still only scores -0.350. Some statistical and ML methods need independent observations or suffer from strongly correlated features. For non-linear relations Pearson misses the pattern, so transform the data based on what you see in the plot or use other measures such as mutual information (trans-information).

### Data Wrangling

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg032_Data_Wrangling.png]]

<p class="image-caption">The four main tasks of data wrangling.</p>

Data wrangling covers:

- Filtering and cleaning based on the data quality characteristics and deficiencies found earlier.
- Integrating, harmonizing and merging tables through various joins.
- Method-specific aggregation.
- Enrichment with calculated metrics.

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg033_Data_Wrangling_Operations.png]]

<p class="image-caption">Frequent data wrangling operations.</p>

Frequent operations:

- Filtering out invalid values and filling in missing ones (data imputation).
- Selecting columns and rows (subsetting).
- Deleting or replacing wrong or superfluous characters and strings, converting lowercase to uppercase.
- Spreading values across several columns and the reverse, and flipping rows and columns (transposition).
- Combining columns, for example month "07" and year "2017" into "201707", or splitting them.
- Grouping, for example minimum and maximum sales per customer group.
- Binning, for example ages into the groups 1-12, 12-18, 18-25, 25-45 and over 45.
- Calculating relevant indicators such as text similarities.
- Normalization and standardization.
- Replacing outliers if necessary.
- Dimension reduction with factor analysis or principal component analysis if necessary.

### Transposing

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg034_Transposing.png]]

<p class="image-caption">Transposing so that each row describes one data object.</p>

Each row should describe one data object. In the source table, product categories are columns and the measures (complaints, returns, negative reviews) are rows. After transposing, each category is a row: fashion with 27 complaints, 23 returns and 30 negative reviews, furniture with 13, 7 and 15, garden supplies with 14, 5 and 17, toys with 17, 6 and 20.

### Avoiding Attribute Values in Column Headers

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg035_Attribute_Values_In_Headers.png]]

<p class="image-caption">Revenue bands as column headers, reshaped into a long table of date, agent and result.</p>

A table with revenue bands as column headers (under 100 TEUR, 100 to 200 TEUR and so on) and agent names in the cells hides an attribute inside the headers. The prepared version has one row per date and agent and a column "Result" that holds the band, for example A. Meyer on 01/17/2026 with under 100 TEUR. In tidy data terms, the wide table becomes a long one.

### Dummy Attributes

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg036_Dummy_Attributes.png]]

<p class="image-caption">Shopping basket items turned into Boolean dummy attributes.</p>

Categorical values have to be made mathematically accessible for most methods. A list of shopping baskets and articles (basket 271013 with eggs and jam, basket 271014 with jam) becomes one row per basket with Boolean columns Contains_Jam and Contains_Eggs: 271013 is TRUE and TRUE, 271014 is TRUE and FALSE. This is the same idea as one-hot encoding.

### Standardization

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg037_Standardization.png]]

<p class="image-caption">Z-transformation of age and sales for four customers.</p>

Standardization brings attributes to a common denominator. It is often required or highly recommended, for example for cluster analysis or neural networks, because otherwise the attribute with the largest numbers dominates every distance. The z-transformation subtracts the mean and divides by the standard deviation, so every attribute ends up with mean 0 and standard deviation 1:

$$
z = \frac{x - \bar{x}}{s}
$$

For sales, the mean is 160 and the standard deviation 138.42, so customer 110112 with sales of 278 gets $z = (278 - 160) / 138.42 = 0.852$. The slide uses the population standard deviation (dividing by $n$). Recomputing the age column the same way (mean 31, standard deviation 7.72) gives 0.389, -1.295, 1.425 and -0.389, slightly different from the values printed on the slide.

### Automatic Preprocessing

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg038_Automatic_Preprocessing.png]]

<p class="image-caption">Automatic Data Preparation in IBM SPSS Modeler.</p>

AutoML tools can do part of this automatically, for example the Automatic Data Preparation node in IBM SPSS Modeler. It is helpful, but use it with caution: the tool does not know which outliers are sunny days.

## 8. Modeling and Overfitting

![[pictures/datasciencebusinessdata/05a/Lecture05a_Pg039_Modeling_And_Overfitting.png]]

<p class="image-caption">Overfitting, the bias-variance tradeoff and a 70/15/15 data split.</p>

In machine learning, a model can overfit: it memorizes the training data but cannot be applied to new data. This is the bias-variance tradeoff between matching the training data and generalizing from it. The standard answers:

- Split the data into a training set (about 70%) to train the model, a validation set (about 15%) to choose between model alternatives and tune hyperparameters, and a test set (about 15%) to check how well the final model generalizes.
- For hyperparameter tuning, split the validation data into several blocks that take turns as test and training data. This is n-fold cross validation.
- Regularization penalizes complexity and forces the method to derive simpler models.

## Summary

- ML success depends on data management and organization. Surveys rank data issues, compliance and missing analytics culture as the main barriers.
- Data quality means fitness for use. Wang and Strong split it into intrinsic, contextual, representational and accessibility quality.
- Data governance sets decision rights. Data policies, data owners and data stewards make it concrete, and a BICC or AI competence center bundles the know-how.
- Data science roles work best in a matrix: analysts and stewards in the business units, data scientists and data managers in a central competence center. Data scientists are methodologists, data analysts are linking pins.
- KDD, SEMMA, CRISP-DM and DataOps structure ML projects. Of the phase models, CRISP-DM starts with business understanding and ends with deployment.
- Data preparation means reading tables as vectors, exploring with statistics and charts, checking distributions and correlations, and wrangling, transposing, dummy-coding and standardizing. Modeling guards against overfitting with training, validation and test sets, cross validation and regularization.

## Self-Check

1. Why does the lecture say ML success is tied to data management and organization?

> [!success]- Answer
> The surveys point to data and organizational problems. Deloitte found 39% of executives name data issues among their top three AI challenges, and more than four in ten companies have low or medium sophistication in their data practices. BARC names compliance, heterogeneous landscapes, skill shortages and missing analytics culture as core limitations, and only about 45% of executives are satisfied with their analytics managers.

2. Name the four data quality dimensions of Wang and Strong with two criteria each.

> [!success]- Answer
> Intrinsic (accuracy, believability), contextual (relevancy, timeliness), representational (interpretability, concise representation) and accessibility (accessibility, access security).

3. How do a data owner and a data steward differ?

> [!success]- Answer
> The data owner, usually a business unit, has responsibility and authority for a specific dataset (Lucas 2010). The data steward is a business leader or subject matter expert accountable for the day-to-day side within a subject area: data requirements, definitions and domain values, compliance with policies, security controls and improving data quality (DAMA 2008).

4. What is a BICC and what are its four function groups?

> [!success]- Answer
> An organizational unit with an interdisciplinary team that promotes the effective use of BI and analytics through standardization, strategy support, portfolio management, training and project support (Gansor and Totok 2015). Its functions are BI management, BI support, BI architecture and BI implementation. Today it is often called an Analytics or AI Competence Center.

5. Why does the lecture prefer a matrix organization for data science roles?

> [!success]- Answer
> In many corporations analytics teams grow independently in finance, production, sales and IT and duplicate data, tools and methods. A matrix fits the decentralized nature of data science: application-oriented analysts and stewards stay in the business units, while data scientists and data managers sit in a central competence center that also runs the data lake and data warehouse.

6. How do data scientists and data analysts differ according to the job posting analysis?

> [!success]- Answer
> Both mainly do data analyses. Data scientists are methodologists: data mining, ML methods, big data and algorithms rank next. Data analysts are linking pins: reporting, cooperation with departments, process optimization and ad-hoc analyses rank next.

7. List the six CRISP-DM phases and say what sets CRISP-DM apart from KDD.

> [!success]- Answer
> Business understanding, data understanding, data preparation, modeling, evaluation and deployment. KDD starts with selecting data and ends with knowledge. CRISP-DM starts with the business objectives and ends with deploying, monitoring and reviewing the result.

8. Why can a correlation coefficient of -0.350 hide a strong relationship?

> [!success]- Answer
> Bravais-Pearson only measures linear dependency. The slide's sine wave is a clear, strong pattern but not a line, so the coefficient stays low. For non-linear relations, transform the data or use other measures such as mutual information.

9. Standardize sales of 34 when the mean is 160 and the standard deviation 138.42. Why standardize at all?

> [!success]- Answer
> $z = (34 - 160) / 138.42 = -0.910$. Without standardization, attributes with large values (sales in euros) dominate distances over attributes with small values (age), which distorts methods like cluster analysis and neural networks.

10. How do you guard against overfitting?

> [!success]- Answer
> Split the data into training (about 70%), validation (about 15%, for choosing models and tuning hyperparameters) and test sets (about 15%, for checking generalization). Use n-fold cross validation for tuning, and regularization to penalize complex models.

---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/04-system-context|Previous: (y-04) System Context]]
