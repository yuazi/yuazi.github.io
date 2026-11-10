---
title: "L04 - Data and Tokens"
tags:
  - foundation-models
  - language-models
  - pretraining-data
  - deduplication
  - minhash
  - tokenization
  - bpe
date: 2026-11-10
---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/03-from-counting-to-predicting|Previous: (y-03) From Counting to Predicting]]

## Mental Model First

- A model can only learn what is in its data, and it sees that data as token IDs. This lecture covers both halves: which text goes into pretraining, and how text is cut into tokens.
- Pretraining sets grew about 100-fold in five years, to 36 T tokens for Qwen3 (2025). Epoch AI estimates the stock of public human text at about 300 T tokens, so the largest runs already use around a tenth of it. From here on, the quality of each token matters more than adding more of them.
- A web crawl is raw material. The curation pipeline extracts text, keeps one language, filters out low-quality and harmful pages, removes near-duplicates with MinHash, scrubs personal data and drops anything that overlaps a benchmark. Most of the crawl is thrown away: DCLM keeps 1.6% of its pool.
- After curation come the mixture (how much web, code, math and multilingual text) and the order. The best data goes last, while the learning rate decays.
- Byte-pair encoding builds a subword vocabulary by merging the most frequent adjacent pair again and again. The vocabulary inherits the language balance of its training text, so the same sentence can cost ten times more tokens in Tamil than in English, and digits and letters get split in odd places.
- Data decisions are tested like model decisions: train small models that differ only in the data, use at least two seeds, and check for contamination before trusting a gain.

## 1. Today's Lecture

This is the second of the Text LM lectures (Steffen Staab).

| Unit | Time   | Topic                                                 |
| :--- | :----- | :---------------------------------------------------- |
| 1    | 10 min | Scale and sources: how much text is there?            |
| 2    | 20 min | Curation pipeline: filter, deduplicate, decontaminate |
| 3    | 15 min | Mixtures: what to train on, in which order            |
| 4    | 20 min | Tokens and BPE: from text to token IDs, by hand       |
| 5    | 10 min | Consequences: cost, languages, arithmetic, bytes      |
| 6    | 15 min | Evaluating data: ablations with small models          |

After the lecture you should be able to describe the sources and scale of pretraining text, explain filtering, deduplication and decontamination, explain mixtures, curricula, synthetic data and the legal side, run byte-pair encoding by hand and compare tokenizers, explain what tokenization does to cost, languages and arithmetic, and judge data decisions with small-model ablations.

Several numbers (the Jaccard example, the BPE runs on Project Gutenberg, the tokenizer comparisons) are the lecturer's own computations.

## 2. Scale and Sources of Training Data

### How Much Text Does a 2025 Model Read?

The opening question: how many tokens was Qwen3 (2025) pretrained on? The options were 0.3 T, 3 T, 36 T and 300 T. The answer is 36 trillion.

![[pictures/foundationmodels/04/Lecture04_Pg006_Training_Data_Grew_100x_In_Five_Years.png]]

<p class="image-caption">Training tokens per model on a log scale, from GPT-3 (2020) to Qwen3 (2025), against the estimated stock of public human text.</p>

GPT-3 was trained on about 0.3 T tokens in 2020. Chinchilla, LLaMA 65B and Llama 2 sit between 1 and 3 T, and Llama 3, Qwen2.5, DeepSeek-V3 and OLMo 2 between roughly 5 and 20 T. Qwen3 reaches 36 T. The orange line is Epoch AI's estimate of all public human text, about 300 T tokens. The largest runs already use about 10% of it, so the stock of text becomes the limit before compute does. The chart marks April 2025 (ICLR 2025) as "peak data" for text.

![[pictures/foundationmodels/04/Lecture04_Pg007_Training_Data_For_Frontier_Models.png]]

<p class="image-caption">No official numbers for the newest frontier models, only guesses from their announced training compute.</p>

For the newest frontier models (GPT6 Astra, Claude Fable) there are no official numbers. Working back from the announced training compute gives rough guesses of 150 T to 1,500 T tokens for GPT6 Astra.

### Where Pretraining Text Comes From

![[pictures/foundationmodels/04/Lecture04_Pg008_Where_Pretraining_Text_Comes_From.png]]

<p class="image-caption">Pretraining sources: mostly web crawl, plus smaller and cleaner sources for code, science, reference, math, synthetic and licensed text.</p>

| Source         | Examples                            | Why it is used       |
| :------------- | :---------------------------------- | :------------------- |
| Web crawl      | Common Crawl, more than 300 B pages | Breadth, scale       |
| Code           | GitHub, Stack Exchange              | Structure, reasoning |
| Science, books | arXiv, PubMed, public-domain books  | Long, dense text     |
| Reference      | Wikipedia, encyclopedias            | Facts, quality       |
| Math           | Web math, textbooks, proofs         | Reasoning            |
| Synthetic      | Text generated by other models      | Targeted skills      |
| Commercial     | Bought from publishers, old books   | Breadth, scale       |

The running example is OLMo 2, whose 3.9 T training tokens are all open. Most of any crawl is boilerplate, spam, duplicates or machine-generated text, so a crawl has to be cleaned before it is a dataset, and more text does not automatically help.

### Data Becomes the Bottleneck

Unit 1 check: why can't the next models just train on 10 times more human-written text? Because the public stock of human text is only about 10 to 20 times today's largest runs (answer B). More tokens do help, tokenizers can handle any amount, and the EU AI Act does not forbid it.

Epoch AI puts public human text at about 300 T tokens, against 36 T in Qwen3. Their projection for when it runs out is 2026 to 2032, with a median of 2028 (Villalobos et al., 2024). The field responds with better filtering, several epochs over the same data, and synthetic data.

## 3. The Curation Pipeline

### FineWeb as an Example

![[pictures/foundationmodels/04/Lecture04_Pg013_Example_Recipe_For_A_Modern_Curation_Pipeline.png]]

<p class="image-caption">FineWeb (Hugging Face, 2024): crawl, extract, language ID, quality filters, deduplication, PII removal, decontamination, then mixing and tokenization.</p>

FineWeb goes from 96 Common Crawl snapshots to a training set in these steps:

1. **Crawl**: 96 Common Crawl snapshots of raw HTML in WARC format.
2. **Extract text** with trafilatura.
3. **Language ID** with fastText, keeping only English pages that score at least 0.65.
4. **Quality filters**: a URL blocklist (no adult content) and C4-like custom rules.
5. **Deduplicate** with MinHash on word 5-grams, separately within each snapshot.
6. **Remove PII** (personally identifiable information): anonymize e-mail and IP addresses.
7. **Decontaminate**: drop documents that overlap benchmarks.
8. **Mix and tokenize** (Units 3 and 4).

Each step is a design decision, and FineWeb validates each one by training small models on its output (Unit 6).

### Heuristic Quality Filters

![[pictures/foundationmodels/04/Lecture04_Pg014_Heuristic_Quality_Filters.png]]

<p class="image-caption">An invented junk page (navigation links, "BEST PRICE", lorem ipsum, share buttons) and the rules that catch it.</p>

Cheap rules catch most of the junk. The ones used since Gopher (2021) and C4 (2020) drop a page when:

- it has too few words, or the mean word length is outside 3 to 10 characters,
- few lines end in punctuation and many lines are very short,
- many lines are duplicated, or it contains "lorem ipsum" or curly brackets,
- it contains too few common words (the, of, and, ...).

These rules encode someone's taste. They also drop poetry, lists and dialects.

### Model-Based Quality Filters

![[pictures/foundationmodels/04/Lecture04_Pg015_Model_Based_Quality_Filters.png]]

<p class="image-caption">FineWeb-Edu and DCLM-Baseline: two 2024 classifier recipes that beat all hand-written rules.</p>

Two 2024 recipes replace hand-written rules with a classifier:

| Recipe        | How it works                                                                                                              | Result                |
| :------------ | :------------------------------------------------------------------------------------------------------------------------ | :-------------------- |
| FineWeb-Edu   | Llama-3-70B rates 460k pages for educational value (0 to 5); a small regressor learns the ratings; keep score 3 or higher | 15 T to 1.3 T tokens  |
| DCLM-Baseline | fastText classifier with instruction data (OpenHermes 2.5) and ELI5 posts as positives; keep the top 10% of the pool      | 240 T to 3.8 T tokens |

Both beat every rule-based filter in the ablations. "Quality" here means whatever the classifier's teacher likes.

### Harmful Content

![[pictures/foundationmodels/04/Lecture04_Pg016_Harmful_Content_Is_It_Filtered.png]]

<p class="image-caption">Blocklists, word lists, toxicity classifiers and PII scrubbing, used to very different degrees.</p>

| Method              | Example                                     | Removes               |
| :------------------ | :------------------------------------------ | :-------------------- |
| URL blocklist       | FineWeb: UT1 list of adult sites            | Pornography, malware  |
| Word blocklist      | C4: drop pages containing a listed word     | Explicit pages, slurs |
| Toxicity classifier | Dolma: fastText for hate and NSFW content   | 5.5 to 7.3% of text   |
| PII scrubbing       | FineWeb, Dolma: regex for e-mail, IP, phone | Personal data         |

Dolma's classifiers are trained on the Jigsaw toxic comments data and remove single sentences, not whole documents. FineWeb has no toxicity classifier at all, so harmful pages remain in it.

### Filter or Keep?

![[pictures/foundationmodels/04/Lecture04_Pg017_Filter_Or_Keep_A_Trade_Off.png]]

<p class="image-caption">Filtering heavily versus keeping toxic text and aligning later, as Llama 2 did.</p>

Heavy filtering makes generation less toxic, but the model also gets worse at recognizing toxic text. Filters also decide whose language the model learns, because word lists hit some groups much harder than others: the C4 blocklist dropped 42% of pages in African-American English, against 6% of White-aligned English pages. Llama 2 went the other way. About 0.2% of its documents are toxic and were kept, which preserves the ability to detect toxicity and avoids erasing groups; safety comes later from post-training (Text LM lecture 5). Filters can also delete information about self-help groups (on bullying, for example) or appropriate nude content such as medical material.

### What Survives

![[pictures/foundationmodels/04/Lecture04_Pg018_What_Survives_The_Pipeline.png]]

<p class="image-caption">Tokens left after each FineWeb stage: 36 T, 20 T, 15 T, and 1.3 T for FineWeb-Edu.</p>

| Stage                                    | Tokens left |
| :--------------------------------------- | ----------: |
| After URL, language and quality filters  |        36 T |
| After per-snapshot MinHash deduplication |        20 T |
| After C4 and custom filters (= FineWeb)  |        15 T |
| FineWeb-Edu (classifier score 3 or more) |       1.3 T |

DCLM keeps 3.8 T of a 240 T pool, which is 1.6%.

## 4. Deduplication and Decontamination

### Why Deduplicate?

![[pictures/foundationmodels/04/Lecture04_Pg019_Why_Deduplicate.png]]

<p class="image-caption">Repeated text gets memorized and inflates evaluation (Lee et al., 2022).</p>

Google's C4 (Colossal Clean Crawled Corpus) contains one 61-word sentence 61,036 times. Lee et al. (2022) found that more than 1% of the tokens a model emits without a prompt are copied from its training data, ten times less after deduplication. 4.6% of the C4 validation examples have a near-duplicate in the training set, so part of the validation score measures memory. Deduplicated data trains equally good models in fewer steps.

### Near-Duplicates: Jaccard Similarity

![[pictures/foundationmodels/04/Lecture04_Pg020_Near_Duplicates_Jaccard_Similarity.png]]

<p class="image-caption">Two cookie banners that differ only in the date: Jaccard similarity 0.93.</p>

Exact matching misses pages that differ by a single date. Near-duplicate detection compares sets of word 5-grams ("shingles"). With $S_5(D)$ the set of all word 5-grams of document $D$:

$$
J(A, B) = \frac{|S_5(A) \cap S_5(B)|}{|S_5(A) \cup S_5(B)|}
$$

The lecture's example is a cookie banner ("... by clicking accept you agree to the use of cookies as described in our privacy policy, last updated in March 2024.") and the same banner updated in June 2025. They are not identical, but $J = 0.93$.

### MinHash

![[pictures/foundationmodels/04/Lecture04_Pg021_MinHash_The_Key_Idea.png]]

<p class="image-caption">MinHash: a random hash gives every shingle a number, and each document keeps only its smallest one.</p>

Computing $J$ for every pair of billions of documents is impossible. MinHash (Broder, 1997) gives every shingle a random number with a hash function $h$, and each document keeps only its minimum $m(D) = \min_{s \in S_D} h(s)$.

In the toy example, letters stand for 5-word shingles: $S_A = \{a, b, c, d, e\}$ and $S_B = \{a, b, c, d, f\}$. The hash values are $h(a) = 8$, $h(e) = 17$, $h(c) = 23$, $h(d) = 77$, $h(f) = 80$, $h(b) = 98$, so $m(A) = m(B) = 8$.

Sort the union by hash value. The smallest element of the union is equally likely to be any of its members. The two minima agree exactly when that element is a shared shingle, so

$$
P\big(m(A) = m(B)\big) = \frac{|S_A \cap S_B|}{|S_A \cup S_B|} = J(A, B)
$$

Each document hashes its own shingles, and only the minima are stored and compared. The union is never computed.

![[pictures/foundationmodels/04/Lecture04_Pg022_MinHash_Signatures_By_Hand.png]]

<p class="image-caption">Five hash functions give five minima per document; the share of equal positions estimates J.</p>

One minimum is a coin flip with probability $J$. With $k$ hash functions, the $k$ minima form the document's signature:

| Hash |   a |   b |   c |   d |   e |   f | m(A) | m(B) | Equal? |
| :--- | --: | --: | --: | --: | --: | --: | ---: | ---: | :----- |
| h1   |   8 |  98 |  23 |  77 |  17 |  80 |    8 |    8 | yes    |
| h2   |  46 |  25 |  59 |  69 |  41 |  15 |   25 |   15 | no     |
| h3   |  84 |  58 |  40 |  65 |  42 |  49 |   40 |   40 | yes    |
| h4   |  62 |  86 |  63 |  26 |  68 |  30 |   26 |   26 | yes    |
| h5   |   4 |  99 |  28 |  89 |  13 |  30 |    4 |    4 | yes    |

$\mathrm{sig}(A) = (8, 25, 40, 26, 4)$ and $\mathrm{sig}(B) = (8, 15, 40, 26, 4)$. The estimate is the share of equal positions, $\hat{J} = 4/5 = 0.8$; the true value is $4/6 \approx 0.67$. More hash functions make the estimate tighter. A signature always has $k$ numbers, however long the document is. FineWeb uses $k = 112$.

### Banding: Finding Candidate Pairs

![[pictures/foundationmodels/04/Lecture04_Pg023_Banding_Finding_Candidate_Pairs.png]]

<p class="image-caption">112 signature values split into 14 bands of 8. Two documents become a candidate pair if any band matches completely.</p>

Even comparing signatures pairwise is too slow for billions of documents. Banding (locality-sensitive hashing) splits the 112 values into 14 bands of 8 and hashes each band, so every document gets 14 bucket keys. Two documents whose 8 values agree in at least one band land in the same bucket and become a candidate pair. Only colliding documents are compared.

The probability follows from the coin-flip view. One value matches with probability $J$, one whole band with $J^8$, no band with $(1 - J^8)^{14}$, so

$$
P(\text{candidate}) = 1 - (1 - J^8)^{14}
$$

This is an S-curve. At $J = 0.5$ the probability is 0.05, so there are few false alarms; at $J = 0.75$ it is 0.77, and the cookie banners at $J = 0.93$ are caught with probability close to 1. The steep part of the curve sits near $(1/14)^{1/8} \approx 0.72$ (computed here, not on the slide), which is where the band size and band count put the threshold.

### More Deduplication Is Not Always Better

![[pictures/foundationmodels/04/Lecture04_Pg024_More_Deduplication_Is_Not_Always_Better.png]]

<p class="image-caption">FineWeb's surprise: deduplicating across all 96 crawls hurt.</p>

FineWeb first deduplicated across all snapshots at once. That left 4 T tokens, and models trained on them barely improved. In one old crawl, the 10% that survived was worse than the 90% that was removed. Deduplicating within each snapshot left 20 T tokens and gave better models. Text that recurs across years is often good text, and global deduplication threw it away along with the spam. Every filter has to be tested by training (Unit 6).

### Decontamination

![[pictures/foundationmodels/04/Lecture04_Pg025_Decontamination.png]]

<p class="image-caption">Removing training documents that overlap benchmark items, as GPT-3 did with 13-gram matching.</p>

If benchmark items are in the training data, the benchmark score measures memory. Decontamination removes training documents that overlap benchmark items. GPT-3 flagged any 13-gram overlap with the pretraining set. A bug left some overlaps in GPT-3's training data anyway, and the paper reports both scores. Paraphrases and translations slip through n-gram checks. Contamination is the most common reason a benchmark result does not replicate.

### Data and the Law

![[pictures/foundationmodels/04/Lecture04_Pg026_Data_And_The_Law.png]]

<p class="image-caption">Copyright, opt-outs and the EU AI Act (more in the ethics lecture).</p>

Documenting training data is now a legal duty as well as good science:

- The EU text-and-data-mining exception allows mining unless the rights holder opts out (DSM Directive Art. 4(3)).
- AI Act Art. 53(1)(c): providers of general-purpose models need a copyright policy that respects opt-outs (laion.ai shows current practices).
- Art. 53(1)(d): they must publish a summary of the training content, using the Commission's template of 24 July 2025.
- These duties have applied since 2 August 2025. Removing personal data also follows from the GDPR. The slide's example: "Merz is Chancellor" is public knowledge, Merz's home address is personal data.

### Unit 2 Check

Two web pages are identical except for the date in the footer. Which step removes one of them? Answer C, MinHash near-duplicate detection. An exact hash changes as soon as one character changes, language ID and PII anonymization do not look at duplicates, and the cookie banners at $J = 0.93$ are flagged with probability close to 1. FineWeb's caveat still applies: deduplicate within crawls, not across them.

## 5. Mixtures, Curricula and Synthetic Data

### Data Mixtures

![[pictures/foundationmodels/04/Lecture04_Pg030_Data_Mixtures.png]]

<p class="image-caption">Llama 3's final pretraining mix of about 15 T tokens: 50% general knowledge, 25% math and reasoning, 17% code, 8% multilingual.</p>

Llama 3's final pretraining mix (about 15 T tokens) is 50% general knowledge, 25% math and reasoning, 17% code and 8% multilingual text. Sources are up- or down-sampled, so web text is not used in the proportions it was found in. The weights are tuned with small-scale experiments and scaling laws. The mix decides what the model is good at.

### Curricula: The Best Data Comes Last

![[pictures/foundationmodels/04/Lecture04_Pg031_Curricula_The_Best_Data_Comes_Last.png]]

<p class="image-caption">Pretraining, mid-training (annealing) and post-training.</p>

Training has three stages:

| Stage         | Data                                                                                |
| :------------ | :---------------------------------------------------------------------------------- |
| Pretraining   | Trillions of tokens of filtered web, code and math                                  |
| Mid-training  | Tens to hundreds of billions of high-quality tokens, while the learning rate decays |
| Post-training | Instructions, preferences, reasoning (Text LM lectures 5 and 6)                     |

The best data goes last. Annealing lowers the learning rate toward 0 while the model trains on it: Llama 3 anneals on up-sampled high-quality data at the very end, and OLMo 2 has a separate mid-training stage on the Dolmino Mix, 50 to 300 B tokens of curated, math and synthetic text.

### Textbooks Are All You Need

![[pictures/foundationmodels/04/Lecture04_Pg032_Textbooks_Are_All_You_Need.png]]

<p class="image-caption">phi-1 (Microsoft, 2023): a 1.3 B code model trained on curated and synthetic data.</p>

phi-1 (Gunasekar et al., 2023) is a 1.3 B-parameter code model trained on 8 A100 GPUs in about 4 days:

| Ingredient                               |      Tokens |
| :--------------------------------------- | ----------: |
| Web code, filtered to "textbook quality" |         6 B |
| Synthetic textbooks (GPT-3.5)            |   under 1 B |
| Synthetic exercises (fine-tuning)        | about 180 M |

It reaches 50.6% pass@1 on HumanEval. Data quality can make up for scale, at least on a narrow skill like this one.

### Synthetic Data: Rephrase Rather Than Invent

![[pictures/foundationmodels/04/Lecture04_Pg033_Synthetic_Data_Rephrase_Rather_Than_Invent.png]]

<p class="image-caption">Two ways to use a model as a data source: generate new text, or rephrase real pages (WRAP).</p>

A model can serve as a data source in two ways.

**Generate.** A strong model writes textbook-style lessons, exercises and dialogues, many short pieces, each from a different seed topic and for a different audience. This targets skills that are missing on the web, but the output tends to be narrow and repetitive. Using a commercial model this way is usually forbidden by its terms of service.

**Rephrase (WRAP).** A model rewrites real web pages, for example in Wikipedia style or as questions and answers. Maini et al. (2024) report about 3 times faster pretraining (a figure that ignores the cost of rephrasing) and more than 10% lower perplexity on subsets of the Pile, an 825 GiB English dataset built from 22 sources. Rephrasing keeps the facts of real text and only changes their style.

![[pictures/foundationmodels/04/Lecture04_Pg034_Model_Collapse.png]]

<p class="image-caption">Model collapse: train on your own output for long enough, and the tails of the distribution disappear.</p>

The risk of training generation after generation on generated data is model collapse (Shumailov et al., 2024, Nature): each generation underrepresents rare events a little more, until the tails of the distribution are gone.

### Unit 3 Check

Where does a small amount of very high-quality data help most? Answer C: at the end, while the learning rate decays. Llama 3 anneals on up-sampled high-quality domains, OLMo 2 has its Dolmino mid-training stage, and synthetic data is mostly used here, mixed with real data. The last tokens leave the strongest trace.

## 6. Tokenization and Byte-Pair Encoding

### Words, Characters or Something in Between?

![[pictures/foundationmodels/04/Lecture04_Pg038_Words_Characters_Or_Subwords.png]]

<p class="image-caption">Vocabulary size against tokens per word for words, characters and BPE subwords.</p>

Heaps' law from [[/notes/lectures/foundationmodels/03-from-counting-to-predicting|Lecture 3]] says every new text brings new words, so a word vocabulary is never complete.

| Unit               | Vocabulary     | Tokens per word | Problem             |
| :----------------- | :------------- | --------------: | :------------------ |
| Words              | Unbounded      |               1 | Unknown words (OOV) |
| Characters / bytes | About 30 / 256 |             4.3 | Long sequences      |
| Subwords (BPE)     | About 8,000    |            1.14 | A design choice     |

The figures come from BPE trained on 17 Gutenberg texts and tested on Austen's _Persuasion_. With subwords, frequent words stay whole and rare words split into known pieces. There are no unknown words, because the worst case falls back to characters or bytes. Subwords trade vocabulary size against sequence length.

### The Price of a Large Vocabulary

![[pictures/foundationmodels/04/Lecture04_Pg039_The_Price_Of_A_Large_Vocabulary.png]]

<p class="image-caption">Share of all parameters in the embeddings, from 3.9% in Llama 2 7B to 31% in GPT-2 small.</p>

A larger vocabulary gives shorter sequences, but costs parameters and compute. The embedding matrix has $V \cdot d$ parameters, twice that if input and output embeddings are untied.

| Model       | Vocabulary | Share of parameters in embeddings |
| :---------- | ---------: | --------------------------------: |
| GPT-2 small |        50k |                               31% |
| Llama 2 7B  |        32k |                              3.9% |
| Llama 3 8B  |       128k |                               13% |
| Gemma 2 2B  |       256k |                               23% |

Decoding needs a softmax over all $V$ tokens at every step, and rare tokens stay under-trained. In small models the embeddings take up a large part of the parameters. The best vocabulary size grows with the model: for Llama 2 70B, Tao et al. (2024) estimate at least 216k instead of the 32k it has.

### Byte-Pair Encoding

![[pictures/foundationmodels/04/Lecture04_Pg040_Byte_Pair_Encoding.png]]

<p class="image-caption">BPE: a 1994 compression algorithm (Gage), reused for neural machine translation in 2016 (Sennrich et al.).</p>

Training BPE:

1. Split every word into characters (or bytes).
2. Count adjacent symbol pairs, weighted by word frequency.
3. Merge the most frequent pair into a new symbol and record the merge.
4. Repeat until the vocabulary has the desired size.

Encoding new text applies the learned merges in the same order. BPE is greedy and deterministic and involves no probabilities. The vocabulary is learned from the training corpus and carries that corpus's bias.

### BPE by Hand

![[pictures/foundationmodels/04/Lecture04_Pg041_BPE_By_Hand_1.png]]

<p class="image-caption">The toy corpus from Sennrich et al. (2016), split into characters, with _ marking the end of a word.</p>

The corpus is "low" ×5, "lower" ×2, "newest" ×6 and "widest" ×3. Counting adjacent pairs weighted by frequency: e+s, s+t and t+\_ each occur 9 times (6 in "newest", 3 in "widest"), w+e 8 times, l+o and o+w 7 times each, and the rest less.

![[pictures/foundationmodels/04/Lecture04_Pg042_BPE_By_Hand_2.png]]

<p class="image-caption">The first three merges build the suffix "est_".</p>

1. e + s (9×)
2. es + t (9×)
3. est + \_ (9×)

Frequent endings become single tokens first; after three merges "newest" and "widest" both end in the token "est\_".

![[pictures/foundationmodels/04/Lecture04_Pg043_BPE_By_Hand_3.png]]

<p class="image-caption">Merges 4 and 5 build "low", the stem of low and lower.</p>

4. l + o (7×)
5. lo + w (7×)

Applied in order to unseen words, the five merges give "lowest" → low est\_ and "newer" → n e w e r \_. "lowest" never appeared in the corpus but is encoded with two known tokens. None of the merges fits "newer", so it stays at character level.

### BPE on Real Text

![[pictures/foundationmodels/04/Lecture04_Pg044_BPE_On_Real_Text.png]]

<p class="image-caption">BPE trained on 2 M words of Project Gutenberg: the first merges and the result after 8,000 merges.</p>

On 2 M words of Project Gutenberg the first merges are e+\_, t+h, d+\_, t+\_, s+\_, a+n, i+n, e+r and th+e\_, so word endings and the most frequent word ("the") come first. After 8,000 merges, "unbelievable" becomes un believ able\_, "tokenization" becomes to ken iz ation\_ and "Stuttgart" becomes stu tt gar t\_.

### Tokenizer Families

![[pictures/foundationmodels/04/Lecture04_Pg045_Tokenizer_Families.png]]

<p class="image-caption">BPE, byte-level BPE, WordPiece, Unigram LM and SentencePiece.</p>

| Family         | How it is trained                                  | Used by                |
| :------------- | :------------------------------------------------- | :--------------------- |
| BPE            | Greedy pair merges on characters                   | GPT-1, early NMT       |
| Byte-level BPE | Merges on UTF-8 bytes (中 is the 3 bytes E4 B8 AD) | GPT-2, GPT-4o, Llama 3 |
| WordPiece      | The merge that raises the likelihood most          | BERT                   |
| Unigram LM     | Prunes a vocabulary by likelihood                  | T5, mT5                |
| SentencePiece  | Toolkit on raw text, space written as ▁            | Llama 1 and 2 (32k)    |

Vocabulary sizes: 32k for Llama 2, 128k for Llama 3, 200k for GPT-4o.

### The Same Sentence, Two Tokenizers

![[pictures/foundationmodels/04/Lecture04_Pg046_The_Same_Sentence_Two_Tokenizers.png]]

<p class="image-caption">An English and a German sentence under the GPT-2 and GPT-4o tokenizers.</p>

"The lecture hall at the University of Stuttgart was completely full." takes 14 tokens with GPT-2 (Stuttgart becomes St + utt + gart) and 12 with GPT-4o. The German version, "Der Hörsaal der Universität Stuttgart war vollständig besetzt.", takes 25 tokens with GPT-2, which splits "Universität" and "vollständig" around the umlauts, and 12 with GPT-4o.

Unit 4 check: how many tokens does GPT-4o need for "Donaudampfschifffahrtsgesellschaftskapitän"?

![[pictures/foundationmodels/04/Lecture04_Pg048_German_Compounds_Turkish_Suffixes_And_Code.png]]

<p class="image-caption">Answer C, 13 tokens. German compounds, Turkish suffixes and code are split differently.</p>

The answer is 13 (D ona ud amp fsch if ff ahr ts gesellschaft skap it än). A Turkish word built from many suffixes takes 18 tokens. A small Python function (`def add(a, b): return a + b`) takes 16 tokens with GPT-2 and 12 with GPT-4o, partly because GPT-4o merges runs of spaces.

## 7. What Tokenization Does

### Same Sentence, Up to 10 Times the Tokens

![[pictures/foundationmodels/04/Lecture04_Pg050_Same_Sentence_Up_To_10x_The_Tokens.png]]

<p class="image-caption">Article 1 of the Universal Declaration of Human Rights in 15 languages, tokens relative to English, GPT-4 versus GPT-4o tokenizer.</p>

With the GPT-4 tokenizer (cl100k, 2023), the same sentence takes about 10 times as many tokens in Tamil as in English, about 5.5 times in Hindi and over 5 times in Greek. The GPT-4o tokenizer (o200k, 2024) shrinks the gap a lot (Tamil to a little over 2, Hindi to 1.6), but no language gets to parity. More tokens mean a higher price, a shorter effective context and slower output.

Unit 5 check: same request in Hindi and English, priced per GPT-4 (cl100k) token. Who pays more? The Hindi user, about 5 times as much (answer C). Tokenizers encode the language balance of their training data, which makes fertility (tokens per word) a fairness metric as well as an efficiency metric.

### Numbers and Letters Are Split in Odd Places

![[pictures/foundationmodels/04/Lecture04_Pg051_Numbers_And_Letters_Are_Split_In_Odd_Places.png]]

<p class="image-caption">12345678 + 87654321 = 99999999 under GPT-2, GPT-4 and Llama 2, and "strawberry" under GPT-4o.</p>

The model never sees digits or letters, only token IDs. GPT-2 splits 12345678 into 123 | 45 | 678. GPT-4 groups three digits from the left (123 | 456 | 78), so the chunks do not line up with place values. Llama 2 splits every number into single digits. GPT-4o sees "strawberry" as st | raw | berry, which is why counting its r's is hard. Singh and Strouse (2024) showed that GPT-3.5's addition accuracy goes from 68.5% to 95.6% when the digits are grouped from the right.

### Glitch Tokens

![[pictures/foundationmodels/04/Lecture04_Pg052_Glitch_Tokens.png]]

<p class="image-caption">Tokens that are in the vocabulary but were never trained, such as " SolidGoldMagikarp".</p>

The tokenizer and the model are trained on different data. The GPT-2/3 vocabulary contained " SolidGoldMagikarp", a Reddit user name. That string was frequent in the tokenizer's training data but almost absent from the model's, so its embedding stayed untrained. Asked to repeat it, GPT-3 produced unrelated words. Automatic detection finds such tokens in many open models (Land and Bartolo, 2024). The fix is to train the tokenizer on data that matches the model's training mix.

### Byte Latent Transformer

![[pictures/foundationmodels/04/Lecture04_Pg053_Byte_Latent_Transformer.png]]

<p class="image-caption">BLT (Pagnoni et al., ACL 2025): no tokenizer, bytes grouped into dynamic patches.</p>

The Byte Latent Transformer has no tokenizer. A small model reads bytes and ends a patch where the next byte is hard to predict, so easy stretches become long patches and hard ones short. The scaling study goes up to 8 B parameters and 4 T training bytes. BLT matches Llama 3 at equal training FLOPs and needs up to 50% fewer FLOPs at inference. Tokenization may move into the model itself.

## 8. Judging Data by Ablation

### The Ablation Recipe

![[pictures/foundationmodels/04/Lecture04_Pg057_The_Ablation_Recipe.png]]

<p class="image-caption">Hold everything fixed except the data: same small model, same benchmarks, compare scores.</p>

To compare two datasets, train the same small model on each with everything else fixed, and compare benchmark scores. FineWeb used 1.71 B-parameter models, about 28 B tokens per filter ablation, and 2 seeds. The benchmarks have to show signal early, meaning above-chance scores at small scale and low variance between seeds.

### Model-Based Filtering Pays Off

![[pictures/foundationmodels/04/Lecture04_Pg058_Model_Based_Filtering_Pays_Off.png]]

<p class="image-caption">FineWeb-Edu versus FineWeb in the same ablation setup.</p>

| Benchmark | FineWeb | FineWeb-Edu |
| :-------- | ------: | ----------: |
| MMLU      |     33% |         37% |
| ARC       |     46% |         57% |

Knowledge and reasoning benchmarks gain most, with 10 times fewer tokens. A filter that selects "educational" text may favor exactly what MMLU and ARC test, though.

### DataComp-LM

![[pictures/foundationmodels/04/Lecture04_Pg059_DataComp_LM.png]]

<p class="image-caption">DataComp-LM: a benchmark for datasets, with fixed training code at four scales.</p>

DataComp-LM (Li et al., 2024) is a benchmark for datasets. Training code is fixed and only the data changes:

| Scale   | Parameters | Tokens |
| :------ | ---------: | -----: |
| 400M-1x |      412 M |  8.2 B |
| 1B-1x   |      1.4 B | 28.8 B |
| 3B-1x   |      2.8 B | 55.9 B |
| 7B-2x   |      6.9 B |  276 B |

A 7 B model trained on 2.6 T tokens of the DCLM data reaches 64% on MMLU, 6.6 points more than MAP-Neo with 40% less compute.

### Checklist for a Data Pipeline

![[pictures/foundationmodels/04/Lecture04_Pg060_Checklist_Evaluating_A_Data_Pipeline.png]]

<p class="image-caption">Six things a good data paper reports.</p>

1. **Survival**: tokens kept per stage, and why.
2. **Ablations**: small models, fixed budget, at least 2 seeds.
3. **Benchmarks**: early-signal tasks plus held-out tasks.
4. **Contamination**: n-gram overlap with every test set.
5. **Documentation**: sources, licences, opt-outs, the training content summary.
6. **Transfer**: does the ranking hold at larger scale?

Unit 6 check: filter X gives a 1.7 B model +2 points on MMLU in one training run. Before adopting it, repeat with other seeds and check the filtered data for overlap with MMLU (answer B). At small scale the noise between seeds can be as large as the effect. After that, test whether the gain transfers to larger models.

## 9. Recap

![[pictures/foundationmodels/04/Lecture04_Pg063_Recap_Data_And_Tokens.png]]

<p class="image-caption">Six ideas to keep.</p>

1. **Scale**: 36 T tokens in 2025, and public text is running out.
2. **Curation**: filter, deduplicate (within crawls) and decontaminate.
3. **Mixtures**: mix and order matter, with the best data at the end.
4. **BPE**: merge the most frequent pair, again and again.
5. **Consequences**: cost, fairness and arithmetic depend on the tokens.
6. **Ablations**: judge data by training small models.

The next lecture covers architecture, from attention to modern LLMs.

## Self-Check

1. How many tokens was Qwen3 pretrained on, and how does that compare to the estimated stock of public human text?

> [!success]- Answer
> 36 T tokens. Epoch AI estimates about 300 T tokens of public human text, so Qwen3 used roughly a tenth of it. The projected exhaustion date is 2026 to 2032 (median 2028), which is why filtering, repeated epochs and synthetic data get so much attention.

2. Name the main steps of the FineWeb pipeline in order.

> [!success]- Answer
> Crawl (96 Common Crawl snapshots), text extraction with trafilatura, language ID with fastText (English only), quality filters (URL blocklist, C4-like rules), MinHash deduplication within each snapshot, PII anonymization, decontamination, then mixing and tokenization. Each step was checked by training small models on its output.

3. FineWeb-Edu and DCLM both use a classifier as a quality filter. What do they train it on, and what is the catch?

> [!success]- Answer
> FineWeb-Edu has Llama-3-70B rate 460k pages for educational value and trains a small regressor on those ratings (keep score 3 or more). DCLM trains a fastText classifier with OpenHermes 2.5 instruction data and ELI5 posts as positives and keeps the top 10%. "Quality" then means whatever the teacher model or the positive examples look like, and an "educational" filter may favor exactly what benchmarks like MMLU and ARC test.

4. What does heavy toxicity filtering cost, according to the lecture?

> [!success]- Answer
> The model gets worse at recognizing toxic text, and word lists remove some groups' language far more than others (the C4 blocklist dropped 42% of African-American English pages versus 6% of White-aligned ones). Filters can also delete self-help or medical content. Llama 2 instead kept about 0.2% toxic documents and relied on post-training for safety.

5. Shingle sets $S_A = \{a, b, c, d, e\}$ and $S_B = \{a, b, c, d, f\}$. What is $J(A, B)$, and why does $P(m(A) = m(B)) = J(A, B)$ hold for a random hash?

> [!success]- Answer
> $J = 4/6 \approx 0.67$: 4 shared shingles out of 6 in the union. Under a random hash, the shingle with the smallest value in the union is equally likely to be any of the 6. The two minima are equal exactly when that shingle is one of the 4 shared ones, so the probability is $4/6 = J$.

6. With FineWeb's banding (14 bands of 8), how likely is a pair with $J = 0.8$ to become a candidate, and why is that curve useful?

> [!success]- Answer
> $1 - (1 - 0.8^8)^{14} \approx 0.92$. The curve is an S-shape: pairs with $J = 0.5$ only collide with probability 0.05, pairs above about 0.75 almost always do. Near-duplicates are found without comparing all pairs, and dissimilar pages rarely trigger a full comparison.

7. Why did FineWeb deduplicate within each snapshot instead of across all 96?

> [!success]- Answer
> Global deduplication left only 4 T tokens and models barely improved; in one old crawl the kept 10% was worse than the removed 90%. Text that recurs across years tends to be good text. Per-snapshot deduplication kept 20 T tokens and trained better models.

8. Two pages are identical except for the footer date. Which step removes one of them, and why not exact hashing?

> [!success]- Answer
> MinHash near-duplicate detection. An exact hash changes as soon as one character differs, while the Jaccard similarity of the 5-gram sets stays high (0.93 for the cookie banners), so the pair is flagged with probability close to 1.

9. Where in training does a small amount of very high-quality data help most?

> [!success]- Answer
> At the end, while the learning rate decays (annealing or mid-training). Llama 3 anneals on up-sampled high-quality domains and OLMo 2 has a separate Dolmino mid-training stage. The last tokens leave the strongest trace.

10. Run the first BPE merge on the corpus low ×5, lower ×2, newest ×6, widest ×3. Then encode "lowest" with the five merges e+s, es+t, est+\_, l+o, lo+w.

> [!success]- Answer
> e+s, s+t and t+\_ are tied at 9 (6 from "newest", 3 from "widest"); the lecture merges e+s first. "lowest" becomes l o w e s t \_ → l o w es t \_ → l o w est \_ → l o w est\_ → lo w est\_ → low est\_, so two tokens: "low" and "est\_".

11. GPT-2 small has a 50,257-token vocabulary and 768-dimensional embeddings. Why does that come to about 31% of its parameters, and why is a 256k vocabulary costly for a 2 B model?

> [!success]- Answer
> $50{,}257 \times 768 \approx 38.6$ M parameters out of about 124 M, so about 31%. The embedding matrix grows with $V \cdot d$ regardless of model depth, so in small models it takes a large share (23% in Gemma 2 2B with 256k tokens), and every decoding step needs a softmax over all $V$ tokens.

12. How many tokens does GPT-4o need for "Donaudampfschifffahrtsgesellschaftskapitän", and what does this say about tokenizers?

> [!success]- Answer
> 13 tokens. Long compounds and agglutinative words (18 tokens for the Turkish example) are cut into many pieces because the vocabulary reflects the language mix of the tokenizer's training data.

13. The same request is priced per GPT-4 (cl100k) token in Hindi and in English. Who pays more, and how did GPT-4o change this?

> [!success]- Answer
> The Hindi user pays about 5 times as much (5.5 times the English token count). GPT-4o's larger, more multilingual vocabulary brings this down to 1.6 times without removing the gap. Fertility is a fairness metric as well as an efficiency metric.

14. Why do LLMs struggle with multi-digit addition and with counting letters?

> [!success]- Answer
> They see token IDs, not digits or letters. GPT-4 groups digits in threes from the left, so chunks do not align with place values; grouping from the right raised GPT-3.5's addition accuracy from 68.5% to 95.6%. "strawberry" is st | raw | berry, so the individual r's are not visible to the model.

15. What is a glitch token, and how do you avoid them?

> [!success]- Answer
> A token that is in the vocabulary but almost never appears in the model's training data, so its embedding stays untrained (" SolidGoldMagikarp" in GPT-2/3). It happens when the tokenizer and the model are trained on different data, so the fix is to train the tokenizer on data that matches the model's training mix.

16. Filter X gives a 1.7 B model +2 points on MMLU in one run. What do you do before adopting it?

> [!success]- Answer
> Repeat with other seeds, because seed noise at small scale can be as large as the effect, and check the filtered data for n-gram overlap with MMLU. Then test whether the gain transfers to larger models.

---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/03-from-counting-to-predicting|Previous: (y-03) From Counting to Predicting]]
