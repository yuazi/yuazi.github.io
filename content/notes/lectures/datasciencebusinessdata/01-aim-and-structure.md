---
title: "L01 - Aim and Structure"
tags:
  - dsbd
  - data-science
  - machine-learning
  - organization
date: 2026-10-27
---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/02-relevance-and-context|Next: (y-02) Relevance and Context]]

## Mental Model First

- Data Science for Business Data (Dr. Henning Baars, Information Systems I) treats machine learning from an application-oriented, business perspective. The question it trains is whether data science fits a given process context, which methods are relevant, how they fit into business processes and business models, and what organizational, technical and personnel requirements follow.
- The course is about discriminative AI, mostly on tabular data: predicting values and classes. Generative AI belongs to the summer course Applied AI.
- Python is used in the exercises as a means to an end. The exam focuses on relevance and context, the same discussions the lectures lead.
- The semester runs from concepts and tools through process models to one method family per session (outlier analysis, classification, clustering, regression and time series, association rules, neural networks, special content types), then explainable AI and model distribution with DataOps and MLOps.

## 1. Course Contents

![[pictures/datasciencebusinessdata/01/Lecture01_Pg002_Course_Contents.png]]

<p class="image-caption">The sixteen parts of the course, from aim and structure to model distribution with DataOps and MLOps.</p>

The course has sixteen parts:

1. Aim and structure of the course
2. Relevance of data science, advanced analytics and machine learning
3. Central concepts
4. System context: data science tools
5. Organizational context and process models
6. Data science methods
7. Methods: outlier analysis
8. Methods: classification
9. Methods: clustering
10. Methods: regression and time series analysis
11. Methods: association rule mining
12. Methods: artificial neural networks
13. Methods: analysis of other content categories (processes, networks, geodata, images, videos)
14. Explainable AI
15. Model distribution with DataOps, MLOps and related approaches
16. Conclusion and outlook

## 2. The Course in the WI1 Curriculum

![[pictures/datasciencebusinessdata/01/Lecture01_Pg004_The_Course_In_The_Wi1_Curriculum.png]]

<p class="image-caption">Data Science for Business Data next to Applied AI and Strategisches Daten- und Informationsmanagement, with AI4IoT and the seminar.</p>

The chair for data-driven information systems (WI1) offers three related courses:

| Course                                                      | Term   | Topics                                                                                                                                                              | Format                                                         |
| :---------------------------------------------------------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------- |
| Data Science for Business Data                              | Winter | Discriminative AI (mostly on tabular data), methods and process models, modeling business data for ML, visualization, explainability and evaluation of ML models    | Lecture and exercises in English, written exam                 |
| Applied AI and Upcoming Technologies in Industries          | Summer | Neural networks and deep learning, generative AI, large language models, IoT and smart services, organization and governance                                        | Lecture and exercises, written exam                            |
| Strategisches Daten- und Informationsmanagement and seminar | Summer | IT management in the context of enterprise strategy, business process management, IT management frameworks, deriving data and analytics architectures from strategy | Lecture and exercises, no written exam: podcast, poster, video |

AI4IoT runs in the winter term with a poster on data and AI solutions for IoT applications (Master IS only), and a seminar with changing topics runs in both terms.

### Discriminative and Generative AI

![[pictures/datasciencebusinessdata/01/Lecture01_Pg005_Discriminative_And_Generative_Ai.png]]

<p class="image-caption">Discriminative AI here, generative AI in Applied AI, following Weisz, Muller, He and Houde.</p>

The split between this course and Applied AI follows the distinction by Weisz, Muller, He and Houde. Discriminative AI determines which class or group a data instance belongs to; classification and clustering are examples. Generative AI produces artifacts instead of decision boundaries, and for one input it can produce many outputs, several of which may be valid.

## 3. Aim of the Course

![[pictures/datasciencebusinessdata/01/Lecture01_Pg006_Aim_Of_The_Course.png]]

<p class="image-caption">The course objective: discuss for a given process context whether and how data science and ML can be applied.</p>

Collecting and analyzing data is a core building block of competitive business models and business processes, and therefore a potential competitive advantage. Companies apply methods from machine learning, and thus from AI, more and more systematically. That systematic application is data science. The course looks at it from an application-oriented angle.

After the course, participants should be able to discuss for a given process context:

- whether data science or machine learning approaches can be applied,
- which types of methods are relevant,
- how these can be integrated into business processes and business models,
- which organizational, technical and personnel requirements must be met.

The focus is discriminative AI, the prediction of values and classes. Generative AI is covered in Applied AI.

## 4. Teaching Approach

![[pictures/datasciencebusinessdata/01/Lecture01_Pg007_Teaching_Approach.png]]

<p class="image-caption">Practical exercises in Python on realistic data, this term from a water management case.</p>

Content is taught, practiced and reinforced with practical tasks. The exercises provide data sets that mimic real-life use cases and analyze them with selected tools and Python. The lecture discussions on relevance and context are also the focus of the exam. Python is a means to an end, and the course is explicitly not a programming class. The slide asks for learning by doing: try things out, experiment and develop help for self-help.

As a special feature in the winter term 2026/27, the exercise data comes from a water management case based on a real case study.

## 5. Key Questions

![[pictures/datasciencebusinessdata/01/Lecture01_Pg008_Key_Questions.png]]

<p class="image-caption">The guiding questions of the course, ending with ML in the age of generative AI and LLMs.</p>

The course returns to these guiding questions throughout:

- What are relevant application areas for ML, discriminative AI and data science?
- What requirements must data analysts and data scientists meet?
- Which type of tool is right for which tasks?
- Which types of methods fit which types of problems?
- How important are technical expertise and business understanding, respectively?
- Where are the links to big data and business intelligence?
- How important is model operationalization, and how can it be implemented?
- How much governance does ML require, and how much does it tolerate?
- Where does the business potential of advanced ML and data science realistically lie?
- What are the relevant trends, above all ML in the age of generative AI and large language models?

## Summary

- The course teaches discriminative AI on business data from an application perspective: when it fits, which methods, how to embed it in processes and business models, and what it requires from the organization.
- It sits next to Applied AI (generative AI, deep learning, LLMs) and Strategisches Daten- und Informationsmanagement in the WI1 curriculum.
- Exercises use Python on realistic data, this term from a water management case. The exam targets relevance and context.

## Self-Check

1. What is the aim of the course?

> [!success]- Answer
> To be able to discuss, for a given process context, whether data science or ML approaches can be applied, which types of methods are relevant, how they can be integrated into business processes and business models, and which organizational, technical and personnel requirements must be met.

2. How does this course divide the AI field with Applied AI?

> [!success]- Answer
> Data Science for Business Data covers discriminative AI, which predicts values and classes and determines which class or group an instance belongs to (mostly on tabular data). Applied AI covers generative AI, deep learning and LLMs, which produce artifacts and can give many valid outputs for one input.

3. What role does Python play, and what does the exam focus on?

> [!success]- Answer
> Python is a means to an end for the practical exercises, and the course is not a programming class. The exam focuses on the discussions of relevance and context.

---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/02-relevance-and-context|Next: (y-02) Relevance and Context]]
