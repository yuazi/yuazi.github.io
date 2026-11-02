---
title: "L06 - Outlier Analysis"
tags:
  - dsbd
  - data-science
  - outlier-detection
  - anomaly-detection
  - generative-ai
date: 2026-11-02
---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/05a-organizational-context|Previous: (y-05a) Organizational Context]] | [[/notes/lectures/datasciencebusinessdata/07-classification|Next: (y-07) Classification]]

> [!info] Slide basis
> As of 2 November 2026, ILIAS only has slide 12 of the outlier analysis lecture, the closing slide on outlier detection and generative AI. This note covers that slide. The method slides (1 to 11) get added here once the full deck is posted.

## Mental Model First

- Outlier analysis is the first of the method chapters, between the organizational context and classification.
- Foundation models and classical outlier detection complement each other. Generative AI systems are new things to monitor, and they also offer new ways to find and explain anomalies.
- Classical methods stay transparent, reproducible and efficient, and they remain a strong baseline for tabular data. Tabular foundation models are starting to catch up.

## 1. Outlier Detection in the Age of Generative AI

![[pictures/datasciencebusinessdata/06/Lecture06_Pg012_Outlier_Detection_In_The_Age_Of_Generative_Ai.png]]

<p class="image-caption">Outlier detection for generative AI and generative AI for outlier detection, with the inputs they watch and the results they produce.</p>

The slide connects outlier detection and generative AI in both directions.

Outlier detection for generative AI watches three kinds of input:

| Input            | Examples                 |
| :--------------- | :----------------------- |
| User inputs      | Prompts, requests        |
| Data & knowledge | RAG pipelines, documents |
| System & usage   | Logs, agent actions      |

On these inputs it detects unusual inputs, outputs and usage patterns, monitors data and RAG pipelines, and identifies distribution shifts and concept drift.

Generative AI for outlier detection works the other way round. A language model can draw on semantic and contextual information (logs, events, text) that classical detectors cannot read, and it can help explain detected outliers and suggest hypotheses about their causes.

Both directions lead to the same three results: anomalies and incidents get found (misuse, errors), AI systems become more robust through monitoring and quality checks, and changing patterns such as distribution shift and concept drift become visible.

### Classical Methods Remain the Baseline

Classical outlier detection is transparent, reproducible and efficient, which makes it a strong baseline for tabular data. New tabular foundation models are catching up, so on structured business data a classical detector is the result a foundation model has to beat.

Isolation forests, covered with classification trees in [[/notes/lectures/datasciencebusinessdata/07-classification|L07]], are one tree-based detector: isolated points end up on short paths from the root.

## Summary

Generative AI gives outlier detection more to do: its prompts, retrieved documents and agent actions need monitoring for unusual patterns and drift. Language models can in turn help interpret anomalies in logs and text. For tabular data, classical methods remain the transparent and efficient baseline.

## Self-Check

1. Name three kinds of input that outlier detection for a generative AI system should monitor.

> [!success]- Answer
> User inputs (prompts and requests), data and knowledge (RAG pipelines and their documents), and system and usage data (logs and agent actions). On these the system looks for unusual inputs, outputs and usage patterns, and for distribution shifts and concept drift.

2. How can generative AI help with outlier detection itself?

> [!success]- Answer
> It can use semantic and contextual information such as log messages, events and free text, which classical detectors on numeric features cannot interpret. It can also help explain detected outliers and generate hypotheses about their causes.

3. Why are classical methods still the baseline for tabular data?

> [!success]- Answer
> They are transparent, reproducible and efficient, and they work well on structured data. Tabular foundation models are catching up, so the classical method is the result a new model has to beat.

---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/05a-organizational-context|Previous: (y-05a) Organizational Context]] | [[/notes/lectures/datasciencebusinessdata/07-classification|Next: (y-07) Classification]]
