---
title: "L01 - Introduction and Course Organization"
tags:
  - foundation-models
  - llm
  - vlm
  - vla
  - pretraining
  - organization
date: 2026-10-20
---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/02-ml-basics|Next: (y-02) Machine Learning Basics]]

## Mental Model First

- A foundation model is trained once on broad data and then reused as the basis for many downstream tasks (Bommasani et al., 2021). The idea underneath everything else in the course is reuse: learn a broadly useful representation or capability, then adapt it.
- Pretraining gets its learning signal from structure already in the data: predict the next token, reconstruct a masked token or patch, or match paired examples (an image and its caption) against mismatched ones.
- Adaptation either changes the model (fine-tuning, LoRA, instruction tuning, preference learning) or changes the context it sees at inference time (prompts, examples, retrieved documents).
- LLM, VLM and VLA describe input and output interfaces: text in and text out, images plus language in and text or locations out, observations plus instructions in and robot actions out.
- Every application needs evidence of a useful outcome (passing tests, experimental validation, learning without the assistant, safe task success), and deployment raises questions about errors, misuse, data rights, prompt injection, energy and access that capability alone does not answer.
- Organization: lectures on Mondays, a new exercise sheet every week, and exam admission needs valid attempts on 8 of 11 sheets plus at least one successful presentation. The grade is 100% the final exam.

## 1. If AI Can Write Code, Why Study CS and AI?

![[pictures/foundationmodels/01/Lecture01_Pg004_If_Ai_Can_Write_Code_Why.png]]

<p class="image-caption">Generated BFS code is only the start. You still have to understand the model, evaluate the result, improve the system and recognize its limits.</p>

Ask a model to "generate Python code for breadth-first search" and you get a correct-looking BFS with a queue and a `seen` set. The lecture's answer to why you still need to study the field is a list of things the generated code does not do for you:

- **Understand the model**: how does it learn and generate answers?
- **Evaluate the result**: is it correct, efficient, reliable?
- **Improve the system**: better algorithms, models and training.
- **Recognize the limits**: what can we guarantee, and at what cost?

## 2. Today's Lecture

The first session has three parts: foundation models (pretraining, adaptation, and what LLM, VLM and VLA mean), capabilities and applications (recent systems, scientific opportunities and the limits of demonstrations), and course organization (what the course covers, the weekly exercises and exam eligibility).

## 3. What Is a Foundation Model?

![[pictures/foundationmodels/01/Lecture01_Pg007_What_Is_A_Foundation_Model.png]]

<p class="image-caption">A foundation model is trained on broad data and adapted to many downstream tasks (Bommasani et al., 2021). The central idea is reuse.</p>

A foundation model is "a model trained on broad data that can serve as the basis for many downstream tasks" (Bommasani et al., 2021). Data of many kinds (text, images, speech, structured data, 3D signals) goes into training, and the resulting model is adapted to tasks such as question answering, sentiment analysis, information extraction, image captioning, object recognition and instruction following. The central idea is reuse: learn a broadly useful representation or capability once, then adapt it.

## 4. Pretraining: Learning from Available Structure

![[pictures/foundationmodels/01/Lecture01_Pg008_Pretraining_Learning_From_Available_Structure.png]]

<p class="image-caption">Three pretraining signals: next-token prediction, masked prediction and contrastive matching of paired examples.</p>

Pretraining needs a learning signal that does not require human labels. The lecture shows three, each with a simple training example:

- **Next-token prediction**: "The sky is" → predict "blue". This learns patterns useful for language generation.
- **Masked prediction**: "The [MASK] is blue" → reconstruct "sky". The same idea works for hidden image patches and learns representations of context.
- **Contrastive learning**: match an image with its caption ("dogs on grass") and contrast it with other examples. This learns representations shared across modalities.

## 5. Adaptation after Pretraining

![[pictures/foundationmodels/01/Lecture01_Pg009_Adaptation_After_Pretraining.png]]

<p class="image-caption">Adaptation either changes the model (fine-tuning, LoRA, instruction tuning, preference learning) or changes the context (prompts, examples, retrieved documents).</p>

There are two ways to adapt a pretrained model:

- **Change the model**: fine-tuning and LoRA adapt the parameters; instruction tuning and preference learning shape the responses.
- **Change the context**: prompts, examples and retrieved documents supply task information at inference time, without touching the weights.

One pretrained model can support many systems with different data, tools and evaluation criteria.

## 6. LLMs, VLMs, and VLAs

![[pictures/foundationmodels/01/Lecture01_Pg010_Llms_Vlms_And_Vlas.png]]

<p class="image-caption">LLM, VLM and VLA name different input and output interfaces, from text in and text out to observations in and robot actions out.</p>

The three terms describe different input and output interfaces:

| Model                              | Input                                         | Output                               |
| :--------------------------------- | :-------------------------------------------- | :----------------------------------- |
| LLM (large language model)         | Text or code                                  | Text, code, tool-call arguments      |
| VLM (vision-language model)        | Images or video with language                 | Text, embeddings, grounded locations |
| VLA (vision-language-action model) | Visual observations, instruction, robot state | Robot actions or action sequences    |

## 7. A Snapshot of Current Systems

![[pictures/foundationmodels/01/Lecture01_Pg012_A_Snapshot_Of_Current_Systems.png]]

<p class="image-caption">A snapshot of autumn 2026 systems. Context made of text and images goes into a foundation model that acts through tools.</p>

The slide lists four systems from autumn 2026: GPT-6.1 Sol (September 2026; reasoning, coding, computer use, tools), Claude Sonnet 5.5 (September 2026; image understanding and software work), Gemini 4 Argon (September 2026; multimodal reasoning and long tasks, restricted initial access) and Mistral Large 4 (October 2026; multimodal API preview, weights announced for a later release). The common pattern: context made of text and images goes into a foundation model, which acts through tools such as code execution or computer use.

## 8. Language Modeling

![[pictures/foundationmodels/01/Lecture01_Pg013_Language_Modeling.png]]

<p class="image-caption">Language modeling: estimate P(next token | context), raise the probability of observed continuations in training, and generate one token at a time.</p>

A simple objective supports many tasks. Given "The capital of France is ...", the model estimates P(next token | context).

- **During training**, the parameters are adjusted to assign higher probability to the continuations that were actually observed.
- **During generation**, the model selects a token, appends it to the context, and repeats.

## 9. Reasoning and Computation at Inference Time

![[pictures/foundationmodels/01/Lecture01_Pg014_Reasoning_And_Computation_At_Inference_Time.png]]

<p class="image-caption">Inference-time reasoning (DeepSeek-R1): train on verifiable outcomes and spend more computation on intermediate steps, search and checking.</p>

DeepSeek-R1 is one influential research example. Two ideas drive it:

- **Training for verifiable outcomes**: for some mathematics and coding tasks, known answers or tests provide a training signal.
- **Spending more computation**: a system can generate intermediate steps, search for alternatives, or check candidate answers.

What should count as evidence of success? A correct final answer on held-out problems, and robustness to variations of the problem, within a stated time and compute budget.

## 10. Retrieval and Tool-Using Agents

![[pictures/foundationmodels/01/Lecture01_Pg015_Retrieval_And_Tool_Using_Agents.png]]

<p class="image-caption">A tool-using agent answers in four steps (retrieve, reason and act, check, respond), each with its own failure point.</p>

Example task: "Does the experiment support the paper's claim?" An agent answers in four steps, each with its own failure point:

| Step              | What it does                         | Failure point                       |
| :---------------- | :----------------------------------- | :---------------------------------- |
| 1. Retrieve       | Find relevant passages               | Missing evidence                    |
| 2. Reason and act | Read, calculate, or run code         | Wrong tool call or calculation      |
| 3. Check          | Compare the answer with the evidence | Citation does not support the claim |
| 4. Respond        | Answer with sources                  | Uncertainty lost in fluent wording  |

## 11. Vision-Language Models

![[pictures/foundationmodels/01/Lecture01_Pg016_Vision_Language_Models.png]]

<p class="image-caption">VLM questions about one image: which objects, which penguin is closest, locate every penguin. Where could perception be confused with inference?</p>

A VLM handles images and language in one task. For a photo of penguins you can ask which objects are present, which penguin is closest to the camera, or ask it to locate every visible penguin. The question to keep in mind is where the model could confuse perception (what is in the image) with inference (what it guesses from context).

## 12. CLIP: Connecting Images and Language

![[pictures/foundationmodels/01/Lecture01_Pg017_Clip_Connecting_Images_And_Language.png]]

<p class="image-caption">CLIP's contrastive image-text training enables zero-shot recognition: describe a category in language instead of training a new classifier.</p>

CLIP (Radford et al., 2021) trains an image encoder and a text encoder contrastively, so that matching image-text pairs score high. The result is a reusable representation for retrieval and zero-shot recognition: a category can be described in language without training a new classifier for every task. It is a foundational idea behind later multimodal systems. How would you test this on a new domain? (The MPL course covers CLIP in detail in [[/notes/lectures/mlp/07-multimodal|MPL L07: Multimodal Learning]].)

## 13. Visual Foundation Models beyond Chat

![[pictures/foundationmodels/01/Lecture01_Pg018_Visual_Foundation_Models_Beyond_Chat.png]]

<p class="image-caption">Visual foundation models beyond chat: DINOv3 for self-supervised features and SAM 3 for prompt-driven detection, segmentation and tracking.</p>

Visual foundation models are useful without any chat interface:

- **DINOv3** (2025) learns self-supervised visual features for downstream tasks.
- **SAM 3** (2025) offers prompt-driven detection, segmentation and tracking.

Feature representations and task interfaces serve different roles.

## 14. Generative Models

![[pictures/foundationmodels/01/Lecture01_Pg019_Generative_Models.png]]

<p class="image-caption">Generative models learn a distribution of outputs, which raises new evaluation questions: faithfulness, consistency and physical plausibility.</p>

A generative model learns a distribution of possible outputs. In conditional generation, given a prompt or other context, it generates a plausible image, sound, video or other output. That creates a different evaluation problem: is the output faithful to the request, consistent across details, and does it respect physical constraints?

### Image Generation from 2023 to 2026

![[pictures/foundationmodels/01/Lecture01_Pg020_Image_Generation_From_2023_To_2026.png]]

<p class="image-caption">DALL-E 3 (2023) on the prompt "a professor in front of a class at the University of Stuttgart teaching Foundation Models".</p>

![[pictures/foundationmodels/01/Lecture01_Pg023_Image_Generation_From_2023_To_2026.png]]

<p class="image-caption">GPT-6.1 (2026) on the same prompt: a photorealistic lecture hall with the course title on the screen.</p>

The lecture runs the same prompt, a professor in front of a class at the University of Stuttgart teaching "Foundation Models", through DALL-E 3 (2023), Flux (2024), GPT 5 (2025) and GPT-6.1 (2026). Over the four years the results move from stylized, obviously synthetic scenes to photorealistic lecture halls with the course title on the screen.

## 15. Video Generation and World Modeling

![[pictures/foundationmodels/01/Lecture01_Pg024_Video_Generation_And_World_Modeling.png]]

<p class="image-caption">Video generation and world modeling (Veo 3.1). A convincing video does not establish a reliable simulator.</p>

Veo 3.1 (2025) is a recent example.

- **Video generation**: condition on text, images or existing footage and generate a sequence with audio.
- **World modeling**: predict how a scene evolves, potentially conditioned on actions. Useful prediction requires temporal and causal consistency.

The slide's caveat: a convincing video does not establish a reliable simulator.

## 16. Vision-Language-Action Models

![[pictures/foundationmodels/01/Lecture01_Pg025_Vision_Language_Action_Models.png]]

<p class="image-caption">RT-2 as the starting point for VLAs: camera images and an instruction go in, de-tokenized robot actions come out.</p>

In a VLA the output controls a physical system. The inputs are camera observations, a language instruction and often the robot's state. The outputs are movement commands or a sequence of actions that a controller executes. RT-2 (2023) is the historical starting point: a vision transformer and a large language model produce tokens that are de-tokenized into robot actions. Action errors have physical consequences.

## 17. Current Directions in Robot Foundation Models

![[pictures/foundationmodels/01/Lecture01_Pg026_Current_Directions_In_Robot_Foundation_Models.png]]

<p class="image-caption">Open questions in robot foundation models: whole-body action (Gemini Robotics 2), transfer to new homes (π0.5) and compact models (SmolVLA).</p>

Three systems stand for three open questions:

- **Gemini Robotics 2** (2026): how can perception, planning and whole-body action work together?
- **π0.5** (2025): can a policy transfer to unfamiliar homes and objects?
- **SmolVLA** (2025): how far can compact models and community robot data take us?

## 18. A Model Is Part of an Interactive System

![[pictures/foundationmodels/01/Lecture01_Pg027_A_Model_Is_Part_Of_An.png]]

<p class="image-caption">"Put the red cup in the cupboard" needs perception and grounding, planning, feedback and control, and safety and oversight.</p>

Take the instruction "Put the red cup in the cupboard". The model is only one piece of what has to work:

- **Perception and grounding**: which cup, which cupboard?
- **Planning and action**: which steps and movements?
- **Feedback and control**: did the grasp work, and what changed?
- **Safety and oversight**: when should the robot stop or ask for help?

## 19. Applications of Foundation Models

![[pictures/foundationmodels/01/Lecture01_Pg029_Applications_Of_Foundation_Models.png]]

<p class="image-caption">Each application needs evidence of a useful outcome: passing tests, experimental validation, learning without assistance, safe task success.</p>

Useful outputs need evidence of useful outcomes. For each domain the lecture pairs the output with the outcome that would count as evidence:

| Domain                | Output                                   | Evidence of a useful outcome             |
| :-------------------- | :--------------------------------------- | :--------------------------------------- |
| Software              | Edit a repository                        | Passing tests and robustness             |
| Science / biomedicine | Predict properties or propose candidates | Experiments and external validation      |
| Education             | Explain, give feedback, support practice | Learning and transfer without assistance |
| Robotics              | Follow instructions as conditions change | Safe task success in unfamiliar settings |

### Biomedicine: AlphaGenome

![[pictures/foundationmodels/01/Lecture01_Pg030_Biomedicine_Alphagenome.png]]

<p class="image-caption">AlphaGenome predicts regulatory effects of DNA variation. The Atlas holds precomputed predictions that still need biological validation.</p>

AlphaGenome predicts regulatory effects, connecting DNA sequence to expression, accessibility, splicing and other signals. The AlphaGenome Atlas holds precomputed predictions for single-letter changes across the human genome. Predictions still require biological validation, so the question to ask is what experiment would test the proposed mechanism.

### Education: Assistance and Learning

![[pictures/foundationmodels/01/Lecture01_Pg031_Education_Assistance_And_Learning.png]]

<p class="image-caption">Tutoring example: why does attention divide by √dₖ? Assistance gives hints, but learning means deriving the argument yourself.</p>

The lecture's tutoring example is "Why does the attention mechanism divide by √dₖ?". Useful assistance means asking for a hint, comparing an explanation with the equations, and testing it on a small example. Evidence of learning means deriving the argument yourself and explaining what changes when the assumptions change.

### Science and Engineering: Aurora

![[pictures/foundationmodels/01/Lecture01_Pg032_Science_And_Engineering_Aurora.png]]

<p class="image-caption">Aurora: shared pretraining on heterogeneous geophysical data, adapted to weather, air quality, ocean waves and cyclone tracks.</p>

Aurora (Nature, 2025) is a foundation model for the Earth system. It is pretrained on heterogeneous geophysical data and then adapted to specialized forecasting: weather, air quality, ocean waves and cyclone tracks. The open question is what changes under rare extreme events.

## 20. Research Opportunities

Understanding the foundations lets us improve the systems. The directions named in the lecture:

- learn from less data or less computation,
- transfer to new domains while measuring what fails,
- combine learned models with scientific structure and constraints,
- build evaluations that reveal failures hidden by average scores.

## 21. Societal Challenges

![[pictures/foundationmodels/01/Lecture01_Pg034_Societal_Challenges.png]]

<p class="image-caption">Societal challenges: reliability and inequity, misuse and deception, data rights, concentration and accountability.</p>

Four questions affect the design and deployment of any system, and technical capability alone does not settle them:

- **Reliability and inequity**: who bears the cost of errors?
- **Misuse and deception**: which harmful activities get easier?
- **Data rights**: how are consent, attribution and access handled?
- **Concentration and accountability**: who controls the system, and who can challenge it?

### Security When Models Use Tools

![[pictures/foundationmodels/01/Lecture01_Pg035_Security_When_Models_Use_Tools.png]]

<p class="image-caption">Prompt injection: text inside a document tries to redirect the assistant. Reading content must not give it authority over tools and private data.</p>

Prompt injection changes the security problem. The user asks the assistant to "summarize this report", but an attacker has inserted instructions into the report that try to redirect the assistant's actions. Reading content must not give that content authority over tools and private data. Least privilege, controlled tool access, and confirmation before consequential actions are system-level controls.

### Computation and Environmental Cost

![[pictures/foundationmodels/01/Lecture01_Pg036_Computation_And_Environmental_Cost.png]]

<p class="image-caption">IEA scenario for global data-center electricity use: 415 TWh in 2024 and a projected 945 TWh in 2030.</p>

An IEA (2025) scenario estimates global data-center electricity use at 415 TWh in 2024 and 945 TWh in a 2030 base case. The 2030 value is a projection, not an observation, and it covers all data centers. Resource use is driven by training and inference volume, model and hardware efficiency, and the electricity mix and location. A smaller cost per task can coexist with greater total use.

### Economy, Work, and Access

- Which tasks become easier, and which responsibilities remain with people?
- Who can afford to train, adapt, evaluate and run these models?
- How much can we reproduce when weights, data or training details are unavailable?
- How should productivity, quality and effects on workers be measured?

"Open weights" and "fully reproducible" describe different kinds of access.

## 22. Foundations This Course Assumes

![[pictures/foundationmodels/01/Lecture01_Pg038_Foundations_This_Course_Assumes.png]]

<p class="image-caption">The assumed foundations: linear algebra and calculus, probability and statistics, ML and optimization, and programming.</p>

The course builds on mathematics and programming you already know, each tied to where it shows up later:

- **Linear algebra and calculus** ($QK^\top$, $\nabla L$): embeddings, attention matrices, gradients.
- **Probability and statistics** (P(next token | context)): likelihood, generative models, uncertainty, evaluation.
- **Machine learning and optimization** ($\theta \leftarrow \theta - \eta \nabla L$): losses, generalization, train/validation/test splits, gradient descent.
- **AI and programming** (`loss.backward()`): search, algorithms, Python, tensors, experiments.

The next lecture is a refresher on these concepts.

## 23. Learning Goals

After the course you should be able to:

- explain how pretraining and adaptation produce reusable capabilities,
- relate architectures and objectives to different data modalities,
- evaluate systems with appropriate baselines, metrics and failure analysis,
- reason about reliability, safety and the cost of using a model.

## 24. Tentative Lecture Plan

| Date   | Topic                                          | Lecturer |
| :----- | :--------------------------------------------- | :------- |
| 12 Oct | What are foundation models?                    | Mathias  |
| 19 Oct | Basics in ML recap                             | Mathias  |
| 26 Oct | No lecture                                     |          |
| 2 Nov  | Data, tokenization, n-grams, word2vec          | Steffen  |
| 9 Nov  | Transformers and pretraining: BERT, GPT        | Steffen  |
| 16 Nov | BLEU, SFT, RLHF / InstructGPT, DPO             | Steffen  |
| 23 Nov | Adaptation: fine-tuning and LoRA               | Steffen  |
| 30 Nov | Benchmarks and evaluation                      | Arvindh  |
| 7 Dec  | Reasoning: chain of thought, DeepSeek example  | Steffen  |
| 14 Dec | Retrieval-augmented generation and agents      | Steffen  |
| 21 Dec | No lecture                                     |          |
| 11 Jan | Probabilistic generative models I (VAE, GAN)   | Mathias  |
| 18 Jan | Probabilistic generative models II (Diffusion) | Mathias  |
| 25 Jan | Discrete diffusion models                      | Loay     |
| 1 Feb  | Computer Vision I (Vision Transformer, CLIP)   | Loay     |
| 8 Feb  | Computer Vision II (DINO, SAM, applications)   | Loay     |

Titles and teaching assignments may change. C@mpus lists sessions on 26 October and 21 December, but the tentative plan says there is no lecture on those dates.

## 25. Lectures, Tutorials, and Course Information

Lectures are on Mondays, 11:30 to 13:00, in room V 38.01 (Universität 38); the first lecture was on 12 October 2026. Tutorial dates follow C@mpus for the exercise group you registered for. Individual exercise solutions are submitted on ILIAS, which also carries announcements, lecture videos and slides. Final exam details will be announced on ILIAS, and the grade is based 100% on the exam.

## 26. The Weekly Exercise Rhythm

![[pictures/foundationmodels/01/Lecture01_Pg045_The_Weekly_Exercise_Rhythm.png]]

<p class="image-caption">Weekly rhythm: a new sheet on Monday, individual submission by Sunday 23:59, and presentations in the tutorial.</p>

- **Monday, after the lecture**: a new sheet is released.
- **Sunday, 23:59 of the same week**: submit your own solution individually on ILIAS. Late submissions are not accepted.
- **Tutorial** (dates per group in C@mpus): students present first, then tutors explain the previous sheet's solutions and answer questions.

You can work in groups but must turn in the sheets individually.

## 27. Exam Eligibility and Valid Submissions

![[pictures/foundationmodels/01/Lecture01_Pg046_Exam_Eligibility_And_Valid_Submissions.png]]

<p class="image-caption">Exam eligibility requires valid attempts on 8 of 11 sheets and at least one successful presentation.</p>

Both requirements are mandatory:

- **8 of 11** exercise sheets with valid attempts, and
- **at least 1** successful subtask presentation in your own tutorial group.

A valid attempt means a genuine attempt at at least two subtasks per sheet, with the attempted subtasks clearly labeled. Unlabeled, blank, copied or token submissions do not count, and the teaching team checks every submission.

### Presentations: Preparation and Selection

Submitting a subtask means you are ready to present it. Tutors prioritize subtasks with submissions and select randomly within your group among the students who submitted that subtask on time and have not yet presented successfully. Submitting more exercises without having presented increases your chance of being picked. You can only be selected for subtasks you attempted, and a successful presentation removes you from the pool.

A presentation succeeds if you explain your approach and answer questions. The solution may be wrong, but it must be your own and you must understand it. If you cannot explain it, the presentation does not count; there is no strike, but you must present again, and the tutor may invalidate that submission. Aim to present by mid-semester, although there is no formal deadline.

### Attendance, Strikes, and Excused Absences

- **One strike**: if you are selected and are absent, refuse, or leave before presenting. The tutor then picks another student.
- **Two strikes**: you become ineligible for the final exam.
- **Excused absences** (documented medical reasons, family emergencies, official university commitments) give no strike. Notify the team beforehand if possible and provide proof within 7 days. You still need a successful presentation.

### Make-up Presentations

The last two tutorials offer make-up slots for students who have not yet presented successfully, using a subtask from a previous submission. Slots are limited and first come, first served. Tutors assign remaining students a subtask they attempted (you cannot choose a tutor-assigned one), so every still-eligible student gets a chance. An unexcused absence from a make-up slot gives a strike.

## 28. Academic Integrity and AI Assistance

All submissions must be your own work; copying classmates' or online solutions is a violation. AI assistance is permitted, but you must understand the solution and be able to explain your steps. Fully AI-generated work you cannot explain is a violation, and integrity violations may lead to exclusion from the final exam.

## 29. Preparing for the Course

A quick self-check (not an assessed requirement):

- Can you follow matrix dimensions and apply the chain rule?
- Can you explain likelihood, overfitting, and a held-out test set?
- Can you implement and inspect a small learning experiment in Python?
- Can you explain your own solution without an assistant?

## Summary

- A foundation model is trained on broad data and reused for many downstream tasks; reuse is the central idea.
- Pretraining signals: next-token prediction, masked prediction, contrastive learning. Adaptation changes either the model (fine-tuning, LoRA, instruction tuning, preference learning) or the context (prompts, examples, retrieval).
- LLMs, VLMs and VLAs differ in their input and output interfaces, ending in robot actions for VLAs.
- Capabilities covered: language modeling, inference-time reasoning (DeepSeek-R1), retrieval and tool-using agents, VLMs, CLIP, DINOv3 and SAM 3, image and video generation, world models, robot foundation models.
- Applications need evidence of useful outcomes (AlphaGenome, Aurora, tutoring), and deployment raises questions of reliability, misuse, data rights, accountability, prompt injection, energy use and access.
- Exam admission: valid attempts on 8 of 11 sheets and one successful presentation; two strikes make you ineligible; the grade is 100% the exam.

## Self-Check

1. What is a foundation model, and what is the central idea behind it?

> [!success]- Answer
> A model trained on broad data that can serve as the basis for many downstream tasks (Bommasani et al., 2021). The central idea is reuse: learn a broadly useful representation or capability once, then adapt it to many tasks.

2. Name the three pretraining signals from the lecture and what each one learns.

> [!success]- Answer
> Next-token prediction ("The sky is" → "blue") learns patterns useful for language generation. Masked prediction ("The [MASK] is blue" → "sky", or hidden image patches) learns representations of context. Contrastive learning matches paired examples like an image and its caption against other examples and learns representations shared across modalities.

3. What are the two ways to adapt a pretrained model?

> [!success]- Answer
> Change the model: fine-tuning and LoRA adapt the parameters, and instruction tuning and preference learning shape the responses. Change the context: prompts, examples and retrieved documents supply task information at inference time without changing the weights.

4. How do LLMs, VLMs and VLAs differ?

> [!success]- Answer
> They differ in their interfaces. An LLM takes text or code and outputs text, code or tool-call arguments. A VLM takes images or video with language and outputs text, embeddings or grounded locations. A VLA takes visual observations, an instruction and the robot state and outputs robot actions or action sequences.

5. What counts as evidence of success for inference-time reasoning systems like DeepSeek-R1?

> [!success]- Answer
> A correct final answer on held-out problems and robustness to variations of the problems, achieved within a stated time and compute budget. For some math and coding tasks, known answers or tests also provide the training signal.

6. Where can a retrieval and tool-using agent fail when checking a paper's claim?

> [!success]- Answer
> Retrieval can miss evidence, the reasoning step can make a wrong tool call or calculation, the check can accept a citation that does not support the claim, and the response can lose the uncertainty in fluent wording.

7. Why does "a convincing video does not establish a reliable simulator" matter for world models?

> [!success]- Answer
> A world model has to predict how a scene evolves, possibly conditioned on actions, and useful prediction requires temporal and causal consistency. A video can look realistic while violating those constraints, so visual quality is no evidence that the model simulates the world correctly.

8. What is prompt injection, and which controls address it?

> [!success]- Answer
> An attacker places instructions inside content the model reads, such as a report it is asked to summarize, to redirect the assistant's actions. Reading content must not give that content authority over tools and private data. The controls are system-level: least privilege, controlled tool access and confirmation before consequential actions.

9. What do you need for exam eligibility in this course?

> [!success]- Answer
> Valid attempts on 8 of 11 exercise sheets (a genuine, clearly labeled attempt at at least two subtasks per sheet) and at least one successful subtask presentation in your own tutorial group. Two strikes, from being absent, refusing or leaving when selected, make you ineligible.

10. Is AI assistance allowed on the exercises?

> [!success]- Answer
> Yes, as long as you understand the solution and can explain your steps. Fully AI-generated work you cannot explain counts as an academic integrity violation and may lead to exclusion from the final exam.

---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/02-ml-basics|Next: (y-02) Machine Learning Basics]]
