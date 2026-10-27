---
title: "L02 - Relevance and Context"
tags:
  - dsbd
  - data-science
  - machine-learning
  - ai-adoption
  - use-cases
date: 2026-10-27
---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/01-aim-and-structure|Previous: (y-01) Aim and Structure]] | [[/notes/lectures/datasciencebusinessdata/03-central-concepts|Next: (y-03) Central Concepts]]

## Mental Model First

- About a quarter of German enterprises used AI in reference year 2025, and the share grows with company size: 23% of small firms, 57% of firms with 250 or more employees. Machine learning in the narrow sense is used by 23% of AI-using firms.
- Before LLMs, studies already showed that AI contributed to product and process innovation and that companies used ML mainly in IT, production, product development and cybersecurity.
- The main barriers are not algorithms. Lack of expertise (72%), legal uncertainty (62%) and data protection (60%) top the list. Data science needs business, data and information systems expertise.
- ML is more than neural networks and LLMs. The method zoo has five task families (outlier analysis, association rules, clustering, classification, regression and time series) plus methods for special content types, and it keeps growing.
- Real cases range from warranty cost forecasts and customer analytics to Uber's data-driven pricing, predictive maintenance for freight cars and a NoCode ML tool for a garden supplier. The course asks of each case what was analyzed, how sophisticated it was and whether it pays off.

## 1. How Many Companies Use AI

![[pictures/datasciencebusinessdata/02/Lecture02_Pg003_How_Many_Companies_Use_Ai.png]]

<p class="image-caption">26% of German enterprises used AI in 2025, from 23% of small to 57% of large firms (Destatis).</p>

Destatis reports that 26% of German enterprises used AI technologies in reference year 2025. The share rises with company size: 23% of enterprises with 10 to 49 employees, 36% with 50 to 249 and 57% with 250 or more.

### Machine Learning in Particular

![[pictures/datasciencebusinessdata/02/Lecture02_Pg004_Machine_Learning_In_Particular.png]]

<p class="image-caption">AI technologies by type: machine learning reaches 23% of AI-using enterprises.</p>

Among AI-using enterprises, the most common technologies are text mining (52%), creation of images, videos or audio (52%), speech recognition (42%) and natural language generation including code (35%). Machine learning, highlighted on the slide, is used by 23% (21% of small, 25% of medium and 39% of large firms). Automation of workflows and decision-making reaches 27%, image recognition 17% and autonomous movement of machines 6%.

## 2. AI and Innovation

![[pictures/datasciencebusinessdata/02/Lecture02_Pg005_Ai_And_Innovation.png]]

<p class="image-caption">The contribution of AI to product and process innovations of AI-using companies, reference year 2018 (BMWi 2020).</p>

Numbers from before LLMs already show the relevance of data science and ML. A BMWi study (2020, reference year 2018) breaks down the contribution of AI to the innovations of AI-using companies, separately for product innovation (world novelties, market novelties, imitations, new technologies, improvements, replacements, services and physical goods) and process innovation (manufacturing, logistics, IT, administrative processes, business process organization, work organization, marketing methods, cost reduction). For each category it shows the share where AI contributed in a statistically significant way next to the share where its contribution was not relevant.

### What ML Is Used For

![[pictures/datasciencebusinessdata/02/Lecture02_Pg006_What_Ml_Is_Used_For.png]]

<p class="image-caption">Where companies use AI, Germany against the global sample: IT first, then production, product development and cybersecurity (Deloitte 2020).</p>

Deloitte (2020) found that 79% of companies already consider AI very important or critical to success. Among AI users, the most common area is IT (39% in Germany, 47% globally), followed by production (18% and 16%), product development (17% and 15%), cybersecurity (16% and 22%) and finance (15% and 8%). Customer service, logistics and supply chain, sales, operations, marketing, strategy, legal and compliance, HR and procurement follow with shares around 5 to 13%.

## 3. Barriers to AI Adoption

![[pictures/datasciencebusinessdata/02/Lecture02_Pg007_Barriers_To_Ai_Adoption.png]]

<p class="image-caption">Barriers to AI adoption: lack of expertise, legal uncertainty and data protection lead (Destatis).</p>

| Share of companies | Barrier                                   |
| -----------------: | :---------------------------------------- |
|                72% | Lack of relevant expertise                |
|                62% | Uncertainty about legal consequences      |
|                60% | Data protection and privacy concerns      |
|                45% | Incompatibility with existing systems     |
|                44% | Lack of data availability or data quality |
|                32% | Costs too high                            |

So data science needs business, data and information systems expertise in addition to algorithms and technology.

## 4. Use Cases in Industry Publications

![[pictures/datasciencebusinessdata/02/Lecture02_Pg008_Use_Cases_In_Industry_Publications.png]]

<p class="image-caption">AI use case lists from marketing-driven industry publications.</p>

Marketing-driven industry publications (Simplilearn, AIMultiple) list AI applications like personalized shopping, AI-powered assistants, fraud prevention, process mining, predictive maintenance, manufacturing analytics, inventory and supply chain optimization, robotics and cashierless checkout. The slide asks whether these should be the subject of this class, and whether they really are.

## 5. The Method Zoo

![[pictures/datasciencebusinessdata/02/Lecture02_Pg010_The_Method_Zoo.png]]

<p class="image-caption">The method zoo: five families of discriminative methods and the questions they raise about the analyst's skills.</p>

ML and AI are more than neural networks and large language models. The discriminative methods fall into five families, plus methods for special content types (processes, networks, geodata, images, videos):

| Family                     | Methods                                                                                                                                                            |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Outlier analysis           | Extreme value extraction, statistical distribution-based detection, density-based and model-based methods                                                          |
| Association rule mining    | Correlation analysis, association rule mining and sequence mining                                                                                                  |
| Clustering                 | Hierarchical, density-based, partitioning-based and model-based clustering, neural networks (Self-Organizing Maps)                                                 |
| Classification             | k-nearest neighbors, classification trees and forests, SVMs, Bayesian methods (Naive Bayes), logistic regression, neural networks                                  |
| Regression and time series | Linear and non-linear regression, ARIMA, state space models (Hidden Markov Models), GARCH, classification for value prediction, spectral analysis, neural networks |

The field changes continuously, with a steady stream of new methods and variants. That raises questions for practice:

- How deep must method knowledge be to apply ML?
- How much statistics and mathematics should an analyst know?
- What IT know-how is required?
- What role does domain knowledge play: statistician, programmer or domain expert?

## 6. Dynamic Development

![[pictures/datasciencebusinessdata/02/Lecture02_Pg011_Dynamic_Development.png]]

<p class="image-caption">34,887 ML papers and 62,249 AI and ML papers on arXiv in a year.</p>

The speed of innovation is high, especially for images, video and audio. On arXiv, 34,887 papers on ML and 62,249 on AI and ML appeared in the last year, 95 and 212 per day respectively. ML expands into new application areas through new data sources (IoT, social media) and more accessible technology, gets integrated into more and more tools, frameworks and platforms, and is increasingly combined with large language models.

## 7. Real-World Use Cases

### Forecasting Warranty and Goodwill Costs

![[pictures/datasciencebusinessdata/02/Lecture02_Pg012_Forecasting_Warranty_And_Goodwill_Costs.png]]

<p class="image-caption">A forecasting tool for warranty and goodwill costs with model quality, influencing factors and forecast against actuals.</p>

A forecasting tool predicts warranty and goodwill costs. The screenshot shows the model quality (root mean squared error and forecast confidence), the target variable statistics for training and validation, the contribution of each influencing factor and a comparison of forecast against actual values.

### Analysis of Customer Data

![[pictures/datasciencebusinessdata/02/Lecture02_Pg013_Analysis_Of_Customer_Data.png]]

<p class="image-caption">Forbes on how Amazon created a generation of customer-data-obsessed companies.</p>

Forbes (2018) describes how Amazon set a standard for customer-data-driven companies: it used data from early on to strategize its moves, from Prime and one-click ordering to the Whole Foods acquisition, and competitors now invest heavily in customer analytics to keep up.

### Analytics-Based Business Model for Ride-Sharing

![[pictures/datasciencebusinessdata/02/Lecture02_Pg014_Analytics_Based_Business_Model_For_Ride.png]]

<p class="image-caption">How Uber uses data to match riders and drivers, predict demand and set prices.</p>

Uber's business model rests on analytics (Kissmetrics 2018). It uses data on drivers, riders, trips and traffic to match riders with nearby drivers, predict demand, set surge prices when demand exceeds supply and monitor service quality.

### Predictive Maintenance for Railroad Freight Cars

![[pictures/datasciencebusinessdata/02/Lecture02_Pg015_Predictive_Maintenance_For_Railroad_Freight_Cars.png]]

<p class="image-caption">Predictive maintenance for Europe's largest private lessor of railroad freight cars.</p>

Together with Europe's largest private lessor of railroad freight cars, a service provider built a predictive maintenance system. GPS sensors on the cars deliver location and mileage data, statistical algorithms and machine learning estimate the wear of components, and the predictions run as a cloud service. The case study lists 30 materials monitored for component wear, 60 failure types, 50,000 daily measurements and 40 traffic patterns.

### Analytics for a Home and Garden Supplier

![[pictures/datasciencebusinessdata/02/Lecture02_Pg016_Analytics_For_A_Home_And_Garden.png]]

<p class="image-caption">A NoCode ML and AutoML tool for sales forecasting and e-mail routing (Kömpf 2022).</p>

Kömpf (2022) used a NoCode ML/AutoML tool at a home and garden supplier for sales forecasting and for routing customer e-mail requests. The screenshots show data preparation for model training, the evaluation of a sales forecast model and the automatically generated model documentation.

### Discussion Questions

![[pictures/datasciencebusinessdata/02/Lecture02_Pg017_Discussion_Questions.png]]

<p class="image-caption">Questions for judging a use case: analysis type, sophistication, benefit, pitfalls and organization.</p>

- Are there more examples?
- Which types of analyses were conducted, and how sophisticated were they?
- Is it an isolated application or a complete ML-based business model?
- What is the benefit? Is it already profitable?
- What are known pitfalls and challenges?
- How is the solution organized?

## Summary

- AI adoption in Germany is at 26% of enterprises and much higher among large firms. ML proper reaches 23% of AI users.
- Pre-LLM studies show AI contributing to product and process innovation, used mostly in IT, production, product development and cybersecurity.
- The top barriers are missing expertise, legal uncertainty and data protection, so data science needs business and IS knowledge as much as algorithms.
- The discriminative method zoo has five families plus content-specific methods and grows fast (212 AI and ML papers per day on arXiv).
- Use cases range from single forecasts to entire business models. Judge each by analysis type, sophistication, benefit and organization.

## Self-Check

1. How widespread is AI and ML use among German enterprises, and how does it depend on company size?

> [!success]- Answer
> 26% of enterprises used AI in reference year 2025: 23% of firms with 10 to 49 employees, 36% with 50 to 249 and 57% with 250 or more. Machine learning in particular was used by 23% of AI-using firms, rising from 21% in small to 39% in large firms.

2. What are the three most common barriers to AI adoption, and what follows from them?

> [!success]- Answer
> Lack of relevant expertise (72%), uncertainty about legal consequences (62%) and data protection and privacy concerns (60%). So data science needs business, data and information systems expertise in addition to algorithms and technology.

3. Name the five families of discriminative methods with two examples each.

> [!success]- Answer
> Outlier analysis (extreme values, density-based methods), association rule mining (correlation analysis, sequence mining), clustering (hierarchical, partitioning-based), classification (k-NN, classification trees and forests, SVMs, Naive Bayes, logistic regression) and regression and time series analysis (linear regression, ARIMA, GARCH, Hidden Markov Models).

4. Which questions does the method zoo raise for practitioners?

> [!success]- Answer
> How much method depth is needed to apply ML, how much statistics and mathematics an analyst needs, what IT know-how is required and how important domain knowledge is, in short whether the analyst should be a statistician, a programmer or a domain expert.

5. What makes Uber an analytics-based business model, and how does that differ from an isolated analytics application?

> [!success]- Answer
> The core service depends on analytics: matching riders and drivers, predicting demand and setting surge prices all run on data from drivers, riders, trips and traffic. Without the analytics there is no product, while in isolated applications analytics supports an otherwise unchanged business.

---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/01-aim-and-structure|Previous: (y-01) Aim and Structure]] | [[/notes/lectures/datasciencebusinessdata/03-central-concepts|Next: (y-03) Central Concepts]]
