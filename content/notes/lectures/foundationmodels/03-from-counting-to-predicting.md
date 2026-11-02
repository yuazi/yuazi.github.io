---
title: "L03 - From Counting to Predicting: Statistical Language Models"
tags:
  - foundation-models
  - language-models
  - n-grams
  - smoothing
  - perplexity
  - word2vec
  - rnn
date: 2026-11-02
---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/02-ml-basics|Previous: (y-02) Machine Learning Basics]]

## Mental Model First

- A language model is a probability distribution over token sequences. The chain rule turns it into next-token prediction without any assumption, so scoring a sentence and generating one are the same operation. Every model in the course, up to today's chat models, is a better way to estimate $P(w_i \mid w_1, \dots, w_{i-1})$.
- Word frequencies follow Zipf's law (a few words are very frequent, most are rare) and vocabulary keeps growing with Heaps' law. Half of all word types appear once, and most longer word combinations in new text were never seen in training. More data shrinks this problem without ever removing it.
- n-gram models keep only the last $n-1$ tokens and estimate probabilities by counting. Raw counts give every unseen n-gram probability 0, and one zero factor makes a whole sentence impossible. Smoothing moves probability mass to unseen events; Kneser-Ney does this best among count-based methods.
- Cross-entropy measures how many bits per token the model needs for real text. Perplexity is $2^{H}$, the number of equally likely choices the model is still undecided between. Predicting and compressing are the same problem, and perplexities are only comparable when the tokenization is the same.
- Counts treat "cat" and "dog" as unrelated symbols. Learned vectors (Bengio's neural LM, word2vec) put words with similar contexts close together, so evidence about one word transfers to the other. RNNs remove the fixed context window but squeeze the whole past into one state vector; attention removes that bottleneck and leads to the Transformer in Lecture 3.

## 1. Today's Lecture

This is the first of the Text LM lectures (Steffen Staab). The 90 minutes are split into six units, each ending with a check question:

| Unit | Time   | Topic                                                  |
| :--- | :----- | :----------------------------------------------------- |
| 1    | 10 min | Shannon's game: why predict the next letter?           |
| 2    | 15 min | Word distributions: Zipf, Heaps, the long tail         |
| 3    | 25 min | n-gram models: counting with a short memory, smoothing |
| 4    | 15 min | Evaluation: cross-entropy, perplexity, compression     |
| 5    | 15 min | Counts to vectors: distributional semantics, word2vec  |
| 6    | 10 min | Recurrent models: one vector for the whole past?       |

After the lecture you should be able to define a language model and factorize it with the chain rule, explain why sparsity cannot be avoided, estimate and smooth n-gram models from add-one to Kneser-Ney, evaluate with cross-entropy and perplexity and relate both to compression, explain how word2vec replaces counts with learned vectors, and name the bottleneck of recurrent models that attention removes.

The diagrams use one color per role for the rest of the course: input tokens, model internals, outputs, the training signal or loss, and human feedback. Shapes and labels always repeat the color, so color never carries meaning alone.

Most numbers in the lecture are the lecturer's own computations on 18 Project Gutenberg texts (about 2.1 M tokens).

## 2. Why Predict the Next Token?

### Shannon's Game

![[pictures/foundationmodels/03/Lecture03_Pg006_Guess_The_Next_Letter.png]]

<p class="image-caption">Shannon's guessing game: how many guesses do you need for the next letter of each prefix?</p>

Two prefixes:

1. `the lecture hall was full every seat was tak_`
2. `the lecture hall was full every s_`

The first is almost free to guess, the second is wide open. Shannon (1951) had people guess text letter by letter and counted how many guesses they needed. Prediction is easy where language is redundant and hard where it carries information.

![[pictures/foundationmodels/03/Lecture03_Pg007_What_A_Character_5gram_Model_Predicts.png]]

<p class="image-caption">A character 5-gram model trained on 1.9 M words of Gutenberg text, on the same two prefixes.</p>

A character 5-gram model gives `e` 91.2% after `...seat was tak` and spreads its guesses after `...every s` over `o` (19.6%), `t`, `i`, `a` and `h` (each around 11%). In bits, the first letter costs $-\log_2 0.91 \approx 0.13$ bits, and the second costs about $\log_2 5 \approx 2.3$ bits, roughly a choice among five letters.

### A Language Model Is a Distribution over Sequences

![[pictures/foundationmodels/03/Lecture03_Pg009_The_Chain_Rule_Predict_The_Next_Token.png]]

<p class="image-caption">The chain rule turns any distribution over sequences into a product of next-token predictions.</p>

A language model assigns a probability $P(w_1, \dots, w_n)$ to every token sequence. Tokens can be letters, words or word pieces; Lecture 2 of the text block decides which. By the chain rule,

$$
P(w_1, \dots, w_n) = \prod_{i=1}^{n} P(w_i \mid w_1, \dots, w_{i-1}).
$$

For example, $P(\text{the cat sat}) = P(\text{the})\,P(\text{cat} \mid \text{the})\,P(\text{sat} \mid \text{the cat})$.

The chain rule is exact for every distribution, so the modeling choices come later: which part of the history to keep and how to estimate each factor. Generating text means sampling one token at a time from left to right. The difficulty is that the history grows with every token.

### A Short History

![[pictures/foundationmodels/03/Lecture03_Pg010_A_Short_History_Of_Predicting_The_Next.png]]

<p class="image-caption">Seventy years of counting, then learning. The question (what comes next?) stayed the same.</p>

| Year | Step                                                                |
| :--- | :------------------------------------------------------------------ |
| 1913 | Markov counts letter pairs in _Eugene Onegin_                       |
| 1948 | Shannon's n-gram approximations of English                          |
| 1951 | Shannon's guessing game                                             |
| 2003 | Bengio: neural language model with learned word vectors             |
| 2007 | Brants et al.: "Large language models" trained on 2 trillion tokens |
| 2013 | word2vec                                                            |
| 2014 | seq2seq and attention                                               |
| 2017 | Transformer, then GPT and BERT                                      |

The 2007 "large language models" were n-gram models. The phrase is older than neural LLMs.

## 3. Distributions over Words

### Most Words Are Rare

![[pictures/foundationmodels/03/Lecture03_Pg015_Most_Words_Are_Rare.png]]

<p class="image-caption">Moby Dick: 44% of its distinct words occur exactly once.</p>

_Moby Dick_ has 215,970 word tokens and 17,365 distinct words (types). 44% of the types occur exactly once (_hapax legomena_), yet together they make up only 3.5% of the tokens. Across all 18 texts, 37% of 43,495 types are hapaxes. Rare words are many and frequent words are few, so most counts in any table of word statistics are 0 or 1.

### Zipf's Law

![[pictures/foundationmodels/03/Lecture03_Pg016_Zipfs_Law_Frequency_Falls_Like_A_Power.png]]

<p class="image-caption">Rank against frequency on log-log axes is close to a straight line. The fit on ranks 10 to 10,000 has slope -1.22; the flat step at the end is the words seen once.</p>

![[pictures/foundationmodels/03/Lecture03_Pg017_Zipfs_Law.png]]

<p class="image-caption">Zipf's law and the five most frequent words in the Gutenberg selection.</p>

If $f(r)$ is the frequency of the word with rank $r$, then

$$
f(r) \propto r^{-\alpha}, \qquad \alpha \approx 1.
$$

On a log-log plot this is a straight line with slope $-\alpha$. The Gutenberg fit gives $\alpha \approx 1.22$ on ranks 10 to 10,000. The top five words are _the_ (133,602), _and_ (95,442), _of_ (71,269), _to_ (48,057) and _a_ (33,945), and the top 100 words cover 55% of all tokens. The pattern holds across languages and corpora (Zipf 1949; Piantadosi 2014 reviews the evidence).

### Heaps' Law and Sparsity

![[pictures/foundationmodels/03/Lecture03_Pg018_Heaps_Law_The_Vocabulary_Never_Stops_Growing.png]]

<p class="image-caption">Vocabulary size against tokens read. The fit V = 44 · N^0.48 is sub-linear: twice the text gives about 39% more words.</p>

Heaps' law describes how the vocabulary grows with the amount of text $N$:

$$
V(N) = K N^{\beta}.
$$

For the Gutenberg selection, $K = 44$ and $\beta = 0.48$. Doubling the text multiplies the vocabulary by $2^{0.48} \approx 1.39$. Growth slows down but never stops.

![[pictures/foundationmodels/03/Lecture03_Pg019_Sparsity_Cannot_Be_Avoided.png]]

<p class="image-caption">Share of test units never seen in training: 0.9% of words, 19% of bigrams, 54% of trigrams and 76% of 4-grams.</p>

Train on 90% of the sentences (1,901,157 tokens) and test on the other 10%. Only 0.9% of the test words are new, but 19% of the test bigrams, 54% of the trigrams and 76% of the 4-grams never occurred in training. Counting assigns all of these probability 0 unless the model is smoothed.

Sparsity is a property of language statistics. More data brings more new words and many more new word combinations, so no corpus is ever large enough for pure counting.

### Is Zipf's Law About Language at All?

![[pictures/foundationmodels/03/Lecture03_Pg020_Is_Zipfs_Law_About_Language_At_All.png]]

<p class="image-caption">Random typing also produces a Zipf-like curve (Miller 1957; Li 1992).</p>

What Zipf's law tells us: there are few frequent words and a huge tail of rare ones, any finite corpus misses most possible events, and models therefore have to share statistical strength across words.

What it does not tell us: a monkey hitting letter keys and the space bar at random produces a similar curve, so the law says nothing about meaning. Why language has this shape is still debated.

## 4. n-gram Models and Smoothing

### The Markov Assumption

![[pictures/foundationmodels/03/Lecture03_Pg024_The_Markov_Assumption.png]]

<p class="image-caption">A trigram model predicts "mat" from the two previous tokens only.</p>

An n-gram model keeps only the last $n-1$ tokens of the history:

$$
P(w_i \mid w_1, \dots, w_{i-1}) \approx P(w_i \mid w_{i-n+1}, \dots, w_{i-1}).
$$

$n = 1$ is a unigram model (no context), $n = 2$ a bigram model and $n = 3$ a trigram model. An n-gram model is a Markov chain of order $n-1$ over tokens.

### Maximum-Likelihood Estimation: Just Count

![[pictures/foundationmodels/03/Lecture03_Pg025_Maximum_Likelihood_Estimation_Just_Count.png]]

<p class="image-caption">Bigram MLE on a three-sentence toy corpus. Every unseen bigram gets probability 0.</p>

The maximum-likelihood estimate of a bigram probability is the relative frequency:

$$
P_{\text{ML}}(w_i \mid w_{i-1}) = \frac{c(w_{i-1}, w_i)}{c(w_{i-1})}.
$$

Toy corpus:

```
<s> the cat sat </s>
<s> the cat ran </s>
<s> a dog sat </s>
```

| Bigram     | Count | $P$     |
| :--------- | :---- | :------ |
| cat \| the | 2     | 2/2 = 1 |
| sat \| cat | 1     | 1/2     |
| sat \| dog | 1     | 1/1 = 1 |
| dog \| the | 0     | 0       |

$$
P(\text{the cat sat}) = P(\text{the} \mid \langle s\rangle) \cdot 1 \cdot \tfrac{1}{2} \cdot P(\langle /s\rangle \mid \text{sat}) = \tfrac{2}{3} \cdot 1 \cdot \tfrac{1}{2} \cdot 1 = \tfrac{1}{3}.
$$

"the dog sat" gets probability 0 because "dog | the" was never seen, even though both words are in the corpus.

### Which Sample Came from Which n?

![[pictures/foundationmodels/03/Lecture03_Pg026_Which_Sample_Came_From_Which_N.png]]

<p class="image-caption">Four samples from models trained on three Austen novels (363,331 tokens). Match them to n = 1, 2, 3 and 5.</p>

![[pictures/foundationmodels/03/Lecture03_Pg027_Longer_Context_Reads_Better.png]]

<p class="image-caption">Longer context reads better until the model only copies. At n = 5 the whole sample is Austen verbatim.</p>

| Sample | n   | Longest run copied from the training text |
| :----- | :-- | :---------------------------------------- |
| B      | 1   | 2 words                                   |
| D      | 2   | 4 words                                   |
| A      | 3   | 6 words                                   |
| C      | 5   | 22 words, the whole sample                |

Larger $n$ makes the text more fluent, but the counts get sparser, and at $n = 5$ the model recites Austen. The trade-off between memorization and generalization comes back with every larger model in the course.

### Add-One (Laplace) Smoothing

A sentence probability is a product, so a single unseen bigram makes the whole sentence impossible. Smoothing fixes that by reserving probability for unseen events.

![[pictures/foundationmodels/03/Lecture03_Pg029_Add_One_Laplace_Smoothing.png]]

<p class="image-caption">Add-k smoothing pretends every bigram was seen k more times. With k = 1 it is so crude that the bigram model gets worse than the unigram model.</p>

$$
P_{\text{add-}k}(w_i \mid w_{i-1}) = \frac{c(w_{i-1}, w_i) + k}{c(w_{i-1}) + kV}
$$

With $k = 1$ this is Laplace smoothing. In the Gutenberg corpus $V = 26{,}035$. After "the" there are 10,306 seen successors and 15,729 unseen ones, and add-one hands the unseen ones 11% of the probability mass after "the" and far more after rarer words. The add-one bigram model reaches a test perplexity of 1,401, worse than the unigram model's 699.

### Back-Off and Interpolation

![[pictures/foundationmodels/03/Lecture03_Pg030_Back_Off_And_Interpolation.png]]

<p class="image-caption">When the long context is unreliable, mix in shorter ones. With 2 trillion tokens even "stupid back-off" works.</p>

Linear interpolation mixes all orders:

$$
P(w_i \mid w_{i-2}, w_{i-1}) = \lambda_3 P_{\text{ML}}(w_i \mid w_{i-2}, w_{i-1}) + \lambda_2 P_{\text{ML}}(w_i \mid w_{i-1}) + \lambda_1 P_{\text{ML}}(w_i),
$$

with $\lambda_1 + \lambda_2 + \lambda_3 = 1$, tuned on held-out data.

- Back-off uses the trigram if it was seen, otherwise falls back to the bigram, and so on.
- Interpolation always mixes all orders.
- "Stupid back-off" (Brants et al. 2007) skips normalization entirely. With 2 trillion tokens it is good enough, so the amount of data changes how much care the smoothing needs.

### Kneser-Ney Smoothing

![[pictures/foundationmodels/03/Lecture03_Pg031_Kneser_Ney_Smoothing.png]]

<p class="image-caption">Kneser-Ney asks how many different contexts a word completes. "Francisco" is frequent but only follows "San".</p>

Interpolated Kneser-Ney for bigrams:

$$
P_{\text{KN}}(w \mid v) = \frac{\max(c(v, w) - d,\, 0)}{c(v)} + \lambda(v)\, P_{\text{cont}}(w),
\qquad
P_{\text{cont}}(w) = \frac{|\{v : c(v, w) > 0\}|}{|\{(v', w') : c(v', w') > 0\}|}.
$$

- Subtract a fixed discount $d \approx 0.75$ from every seen count.
- Give the freed mass to the continuation distribution $P_{\text{cont}}$, which favors words that follow many different words. "Francisco" has a high count but a low continuation probability, because almost all its occurrences follow "San".
- $\lambda(v)$ makes the distribution sum to one. Since each of the $|\{w : c(v,w) > 0\}|$ seen successors gave up $d$, that weight is $\lambda(v) = d \cdot |\{w : c(v, w) > 0\}| / c(v)$.

Chen and Goodman (1999) found Kneser-Ney to be the best count-based smoothing method.

### Smoothing Matters

![[pictures/foundationmodels/03/Lecture03_Pg032_Smoothing_Matters_Perplexity_On_Held_Out_Text.png]]

<p class="image-caption">Test perplexity on held-out Gutenberg text, same data and vocabulary (|V| = 26,035 including the unknown token). Lower is better.</p>

| Model                          | Test perplexity |
| :----------------------------- | :-------------- |
| Unigram, add-one               | 699             |
| Bigram, add-one                | 1,401           |
| Bigram, add-k (k = 0.003)      | 385             |
| Bigram, interpolated (λ = 0.7) | 270             |
| Bigram, Kneser-Ney             | 239             |
| Trigram, Kneser-Ney            | 190             |

Add-one hurts, discounting helps most, and longer context only pays off once the smoothing is right. Even smoothed, an n-gram model cannot tell that "dog" behaves like "cat", because counts treat words as unrelated symbols. Unit 5 fixes this with vectors.

## 5. Evaluation: Cross-Entropy, Perplexity, Compression

### Intrinsic or Extrinsic?

![[pictures/foundationmodels/03/Lecture03_Pg037_Intrinsic_Or_Extrinsic_Evaluation.png]]

<p class="image-caption">Intrinsic evaluation measures the model's probabilities; extrinsic evaluation measures task performance.</p>

| Intrinsic                                | Extrinsic                                      |
| :--------------------------------------- | :--------------------------------------------- |
| Probability of held-out text             | Performance on a task: translation, QA, coding |
| Cross-entropy, perplexity, bits per byte | Benchmarks (Lecture 4 onward)                  |
| Cheap, exact, used during training       | Closer to what users care about                |

Lower perplexity usually means better task results, but not always.

### Cross-Entropy: Average Surprise

![[pictures/foundationmodels/03/Lecture03_Pg038_Cross_Entropy_Average_Surprise.png]]

<p class="image-caption">Cross-entropy is the average number of bits per token the model needs for the test text.</p>

For a test text $w_1, \dots, w_N$ and a model $q$:

$$
H(w_{1:N}; q) = -\frac{1}{N} \sum_{i=1}^{N} \log_2 q(w_i \mid w_{1:i-1}).
$$

- It estimates the cross-entropy $H(p, q)$ between the true distribution $p$ and the model $q$.
- It can never go below the entropy of the language: $H(p, q) = H(p) + D_{\text{KL}}(p \,\|\, q) \ge H(p)$.
- It is the training loss of every LLM in this course (with the natural log instead of $\log_2$).

### Perplexity: The Effective Number of Choices

![[pictures/foundationmodels/03/Lecture03_Pg039_Perplexity_The_Effective_Number_Of_Choices.png]]

<p class="image-caption">Perplexity is exponentiated cross-entropy. A fair die has perplexity 6.</p>

$$
\mathrm{PP}(w_{1:N}; q) = 2^{H(w_{1:N}; q)} = \left( \prod_{i=1}^{N} q(w_i \mid w_{1:i-1}) \right)^{-1/N}.
$$

A fair die with $q = 1/6$ per throw has $\mathrm{PP} = (1/6)^{-1} = 6$, and a uniform model over $V$ words has $\mathrm{PP} = V$. Perplexity is therefore a branching factor. The trigram Kneser-Ney model's perplexity of 190 equals 7.6 bits per word: the model behaves as if it were choosing among about 190 equally likely words.

### How Predictable Is English?

![[pictures/foundationmodels/03/Lecture03_Pg040_How_Predictable_Is_English.png]]

<p class="image-caption">Shannon's human guessing experiment puts English at roughly one bit per letter.</p>

In Shannon's experiment (1951, _Prediction and Entropy of Printed English_), the number of guesses people needed bounds the entropy of English. With 100 letters of context the estimate lies between 0.6 and 1.3 bits per letter, so English is highly redundant: a letter carries about one bit, against the $\log_2 27 \approx 4.75$ bits of 26 letters and a space chosen uniformly. The character 5-gram model from Unit 1 needs 1.92 bits per character, because humans use far more context.

### Prediction Is Compression

![[pictures/foundationmodels/03/Lecture03_Pg041_Prediction_Is_Compression.png]]

<p class="image-caption">A language model plus an arithmetic coder turns text into a bit string of about N times the cross-entropy bits.</p>

Feed the model's next-token distribution $q(w_i \mid w_{<i})$ into an arithmetic coder and the text compresses to about $\sum_i -\log_2 q(w_i \mid w_{<i})$ bits, which is $N$ times the cross-entropy. Better prediction means a shorter code, so minimizing the LM loss is minimizing code length. Decoding needs the same model, which acts as the codebook. Shannon (1948) already treated prediction and compression as the same problem.

![[pictures/foundationmodels/03/Lecture03_Pg042_Language_Modeling_Is_Compression.png]]

<p class="image-caption">Delétang et al. (ICLR 2024): Chinchilla 70B, trained mainly on text, compresses image patches and audio better than PNG and FLAC.</p>

| Data              | Classic codec | Chinchilla 70B |
| :---------------- | :------------ | :------------- |
| ImageNet patches  | PNG: 58.5%    | 43.4%          |
| LibriSpeech audio | FLAC: 30.3%   | 16.4%          |

Numbers are the size after compression as a share of the raw size (lower is better). The caveat: if you count the 70 B parameters as part of the compressed output, the model compresses small data poorly.

### Perplexity Depends on the Tokenization

![[pictures/foundationmodels/03/Lecture03_Pg043_Perplexity_Depends_On_The_Tokenisation.png]]

<p class="image-caption">A character model with perplexity 3.8 is worse per character than a word model with perplexity 190.</p>

| Model             | Unit      | Perplexity | Bits per unit | Bits per character |
| :---------------- | :-------- | :--------- | :------------ | :----------------- |
| Word trigram (KN) | word      | 190        | 7.57          | 1.51               |
| Character 5-gram  | character | 3.78       | 1.92          | 1.92               |

Perplexity 3.8 looks far better than 190, but it is worse per character. To compare, normalize by a unit both models share:

$$
\text{bits per character} = \frac{N_{\text{tokens}} \cdot H_{\text{token}}}{N_{\text{chars}}}.
$$

Perplexity is a per-token quantity, and tokens are not a fixed unit. Models with different tokenizers have incomparable perplexities until you convert to bits per character or per byte.

## 6. From Counts to Vectors

### You Shall Know a Word by the Company It Keeps

Firth (1957) summed up the distributional hypothesis (Harris 1954) in that sentence: words that occur in similar contexts have similar meanings. A model that knows "cat" and "dog" share contexts can transfer what it learns about one to the other.

### Context Counts Become Vectors

![[pictures/foundationmodels/03/Lecture03_Pg048_Context_Counts_Become_Vectors.png]]

<p class="image-caption">Each row of a word-context count matrix is a vector. Similar rows mean similar words.</p>

|        | drink | pour | drive | park |
| :----- | :---- | :--- | :---- | :--- |
| coffee | 8     | 5    | 0     | 0    |
| tea    | 7     | 6    | 0     | 0    |
| car    | 0     | 0    | 9     | 6    |
| bus    | 0     | 0    | 7     | 5    |

- Similarity is the cosine of two rows: $\cos(\mathbf{x}, \mathbf{y}) = \dfrac{\mathbf{x} \cdot \mathbf{y}}{\|\mathbf{x}\| \|\mathbf{y}\|}$.
- Reweighting with pointwise mutual information (PMI) discounts contexts that are frequent everywhere.
- Latent semantic analysis (LSA, Deerwester et al. 1990) applies a truncated SVD to get dense, low-dimensional vectors.

None of this needs labels: the text supplies the contexts.

### Concept Hierarchies from Text

![[pictures/foundationmodels/03/Lecture03_Pg049_Concept_Hierarchies_From_Text.png]]

<p class="image-caption">Cimiano, Hotho and Staab (JAIR 2005): a noun-verb formal context becomes a concept lattice.</p>

Earlier work from the lecturer's group used formal concept analysis (FCA). The formal context records which verbs a noun is the object of: a hotel can be booked; an apartment booked and rented; a car booked, rented and driven; a bike booked, rented, driven and ridden; an excursion or a trip booked and joined. A formal concept is a set of nouns that share the same verbs, and the subset order between concepts gives the hierarchy: bookable contains rentable and joinable, rentable contains driveable, and driveable contains rideable.

![[pictures/foundationmodels/03/Lecture03_Pg050_Does_It_Scale_To_Real_Corpora.png]]

<p class="image-caption">On tourism and finance corpora, FCA beats agglomerative and divisive clustering against hand-built taxonomies.</p>

| Method            | Tourism | Finance |
| :---------------- | :------ | :------ |
| FCA               | 43.8%   | 41.0%   |
| Single linkage    | 38.6%   | 32.2%   |
| Complete linkage  | 36.9%   | 33.4%   |
| Bi-Section-KMeans | 36.4%   | 32.8%   |

The scores are F′ against a reference taxonomy with conditional probability weighting. The corpora had 118 M and 185 M tokens, and a parser supplied the contexts (verb-object, verb-subject, verb-PP). Smoothing by clustering similar nouns did not help. Counting contexts already yields structure, and sparsity limits it. Lecture 4 comes back to this: a masked language model learns such a formal context implicitly.

### A Neural LM Shares Strength across Words

![[pictures/foundationmodels/03/Lecture03_Pg051_A_Neural_Lm_Shares_Strength_Across_Words.png]]

<p class="image-caption">Bengio et al. (2003) learn the word vectors and the next-word predictor together.</p>

$$
h = \tanh\!\big(W\,[C(w_{t-2});\, C(w_{t-1})]\big), \qquad q(w_t) = \mathrm{softmax}(U h)
$$

- Each word has a learned vector $C(w) \in \mathbb{R}^m$.
- After seeing "the cat sat", the model also gives "the dog sat" a reasonable probability, provided "cat" and "dog" have similar vectors.
- The number of parameters grows linearly in $|V|$, where an n-gram table grows exponentially in $n$.

### word2vec: Predict the Neighbors

![[pictures/foundationmodels/03/Lecture03_Pg052_Word2vec_Predict_The_Neighbours.png]]

<p class="image-caption">Skip-gram with negative sampling pulls real word-context pairs together and pushes random pairs apart.</p>

For a word $w$, a context word $c$ in its window and $k$ random words $c_1, \dots, c_k$, skip-gram with negative sampling maximizes

$$
\log \sigma(\mathbf{v}_c^\top \mathbf{v}_w) + \sum_{j=1}^{k} \log \sigma(-\mathbf{v}_{c_j}^\top \mathbf{v}_w).
$$

- Real pairs get a high score and random pairs a low one, so training never needs a softmax over the whole vocabulary.
- CBOW predicts the word from its context; skip-gram predicts the context from the word.
- Levy and Goldberg (2014) showed that skip-gram implicitly factorizes a shifted PMI matrix, which makes it counting done by gradient descent.

![[pictures/foundationmodels/03/Lecture03_Pg053_What_The_Googlenews_Vectors_Know.png]]

<p class="image-caption">Nearest neighbors and analogies in the 300-dimensional GoogleNews word2vec vectors.</p>

The lecture queried the GoogleNews vectors live (gensim 4.4.0, 22 Oct 2026):

| Query                    | Nearest results               |
| :----------------------- | :---------------------------- |
| Stuttgart                | Dortmund, Wolfsburg, Bremen   |
| Porsche                  | Audi, BMW, Maserati           |
| king − man + woman       | queen, monarch, princess      |
| Paris − France + Germany | Berlin, Frankfurt, Dusseldorf |
| walking − walk + swim    | swimming, swam, swims         |

Geography, brands, gender and morphology all come from co-occurrence alone. With these vectors, $\cos(\text{cat}, \text{dog}) = 0.76$ while $\cos(\text{cat}, \text{car}) = 0.21$.

![[pictures/foundationmodels/03/Lecture03_Pg054_Countries_And_Capitals_A_Shared_Direction.png]]

<p class="image-caption">A PCA projection of countries and capitals: the country-to-capital offsets point in similar directions.</p>

A 2-D PCA projection (after Mikolov et al. 2013, Fig. 2) shows country-capital pairs (China and Beijing, France and Paris, Germany and Berlin) with roughly parallel offsets. The two components explain only 32% of the variance, so the picture is an illustration and does not prove the structure.

### Vectors Also Learn Our Stereotypes

![[pictures/foundationmodels/03/Lecture03_Pg055_Vectors_Also_Learn_Our_Stereotypes.png]]

<p class="image-caption">The same analogy arithmetic on professions returns stereotyped answers, partly because the standard test excludes the input words.</p>

- computer_programmer − man + woman gives homemaker, housewife, graphic_designer.
- doctor − man + woman gives gynecologist, nurse, doctors.

Embeddings reflect the statistics of their training text, including its biases (Bolukbasi et al. 2016). The standard analogy test also excludes the input words from the answers. Allow them, and the nearest word to doctor − man + woman is "doctor" itself (Nissim et al. 2020). Excluding the inputs forces a different answer and exaggerates the effect.

## 7. Recurrent Models and Their Bottleneck

### Recurrent LMs: Unbounded History

![[pictures/foundationmodels/03/Lecture03_Pg059_Recurrent_Lms_Unbounded_History.png]]

<p class="image-caption">An RNN language model updates one hidden state per token and predicts the next token from it.</p>

$$
h_t = \tanh(W h_{t-1} + U x_t), \qquad q(w_{t+1} \mid w_{\le t}) = \mathrm{softmax}(V h_t)
$$

There is no Markov window, and the same weights are used at every step (Elman 1990; Mikolov et al. 2010). Gradients through many steps vanish or explode, which LSTMs (Hochreiter and Schmidhuber 1997) address with gated memory.

### The Bottleneck: One Vector per Sentence

![[pictures/foundationmodels/03/Lecture03_Pg060_The_Bottleneck_One_Vector_Per_Sentence.png]]

<p class="image-caption">In 2014 encoder-decoder translation, the decoder sees "Das Haus ist klein" only through one vector c.</p>

In encoder-decoder translation (Cho et al. 2014; Sutskever et al. 2014), the encoder reads "Das Haus ist klein" into states $h_1, \dots, h_4$ and hands the decoder a single vector $c$. The decoder produces "the house is small" from that vector alone, and quality drops on long sentences. Cho et al. reported that performance degrades rapidly as sentence length increases.

### Attention: Look Back at Every Encoder State

![[pictures/foundationmodels/03/Lecture03_Pg061_Attention_Look_Back_At_Every_Encoder_State.png]]

<p class="image-caption">Bahdanau, Cho and Bengio (ICLR 2015). Line width is the attention weight; for "small" the decoder looks mostly at "klein".</p>

At each decoding step, attention builds a fresh context vector from all encoder states:

$$
c_t = \sum_j \alpha_{tj} h_j, \qquad \alpha_{tj} = \mathrm{softmax}_j\, \mathrm{score}(s_{t-1}, h_j).
$$

When the decoder produces "small", most of the weight goes to "klein". There is no single bottleneck vector any more. In 2017 the Transformer drops the recurrence as well, and Lecture 3 of the text block starts there.

## 8. Recap

![[pictures/foundationmodels/03/Lecture03_Pg064_Recap_From_Counting_To_Predicting.png]]

<p class="image-caption">Six ideas to keep from the lecture.</p>

1. A language model is a distribution over sequences, which the chain rule turns into next-token prediction.
2. Zipf and Heaps describe a long tail, so sparsity is unavoidable.
3. n-gram models combine a Markov window with counts, and Kneser-Ney handles the unseen best.
4. Cross-entropy equals code length, and perplexities are only comparable with the same tokenizer.
5. Similar contexts give similar vectors, and the vectors pick up the biases of the text.
6. RNNs have unbounded history but squeeze it through one vector; attention removes that bottleneck.

The next lecture covers data and tokens: what models learn from.

## Self-Check

1. Which statement about the chain rule $P(w_{1:n}) = \prod_i P(w_i \mid w_{1:i-1})$ is true? (A) It assumes each word depends only on the previous word. (B) It holds for every distribution over sequences. (C) It only holds if the words are independent.

> [!success]- Answer
> B. The chain rule is exact for every joint distribution. A is the bigram (Markov) assumption, which is an approximation. C would reduce the model to a unigram model with no context at all. Modeling means choosing which history to keep and how to estimate each factor.

2. _Moby Dick_ has 17,365 distinct words. Roughly what fraction of them occurs exactly once?

> [!success]- Answer
> About 45% (44% in the lecture's count). These hapax legomena account for only 3.5% of the tokens. Across all 18 Gutenberg texts the figure is 37% of 43,495 types, so this is typical of text in general.

3. You double your training corpus. With Heaps' exponent $\beta \approx 0.5$, how much larger does the vocabulary get?

> [!success]- Answer
> About 1.4 times: $V(2N)/V(N) = 2^{\beta} \approx 2^{0.5} \approx 1.41$. With the fitted $\beta = 0.48$ it is $2^{0.48} \approx 1.39$, the "39% more words" on the slide. The vocabulary grows sub-linearly, and the number of unseen word combinations grows much faster.

4. In the toy corpus (`<s> the cat sat </s>`, `<s> the cat ran </s>`, `<s> a dog sat </s>`), what is the MLE bigram probability of "the cat sat" (with sentence boundaries) and of "the dog sat"?

> [!success]- Answer
> $P(\text{the} \mid \langle s\rangle) \cdot P(\text{cat} \mid \text{the}) \cdot P(\text{sat} \mid \text{cat}) \cdot P(\langle /s\rangle \mid \text{sat}) = \frac{2}{3} \cdot 1 \cdot \frac{1}{2} \cdot 1 = \frac{1}{3}$. "the dog sat" gets 0, because the bigram "the dog" never occurs, so $P(\text{dog} \mid \text{the}) = 0$ and the whole product is 0.

5. Your trigram model assigns probability 0 to a test sentence. What is the most likely reason?

> [!success]- Answer
> A trigram in the sentence was never seen in training and the model is not smoothed. Zero probability means "unseen", not "impossible": 54% of test trigrams in the Gutenberg split were unseen. Add-k, interpolation or Kneser-Ney reserve mass for them.

6. Why does the add-one bigram model (perplexity 1,401) do worse than the add-one unigram model (699)?

> [!success]- Answer
> Add-one adds $V = 26{,}035$ pseudo-counts to every context. For a frequent context like "the" it hands 11% of the mass to the 15,729 unseen successors, and for rarer contexts the pseudo-counts swamp the real counts entirely. The bigram distributions become close to uniform, which costs more than the extra context gains. A much smaller $k = 0.003$ already brings the bigram perplexity down to 385.

7. Why does Kneser-Ney use continuation counts instead of plain unigram counts for the lower-order distribution?

> [!success]- Answer
> The lower-order distribution is only used when the bigram is unseen or rare, so it should reflect how likely a word is to appear after a new context. "Francisco" has a high unigram count, but almost all its occurrences follow "San". Its continuation probability (the number of distinct left neighbors) is low, which stops the model from predicting "Francisco" after arbitrary words.

8. What is the perplexity of a uniform model over a vocabulary of $V$ words, and how many bits per word is a perplexity of 190?

> [!success]- Answer
> A uniform model gives each word probability $1/V$, so $\mathrm{PP} = (1/V)^{-1} = V$. A perplexity of 190 means $H = \log_2 190 \approx 7.57$ bits per word, as if the model were choosing among 190 equally likely words at every step.

9. Same test set. Model 1 has perplexity 12 with tokenizer X, model 2 has perplexity 18 with tokenizer Y. Which model is better?

> [!success]- Answer
> You cannot tell without converting to a shared unit. Total bits are $N_{\text{tokens}} \cdot \log_2 \mathrm{PP}$: $N_X \cdot 3.58$ for model 1 and $N_Y \cdot 4.17$ for model 2. Model 2 is better when $N_Y / N_X < 3.58 / 4.17 \approx 0.86$, so when tokenizer Y needs noticeably fewer tokens for the same text. With the same tokenizer and test set, the lower perplexity wins.

10. Why is minimizing cross-entropy the same as compressing?

> [!success]- Answer
> An arithmetic coder driven by the model's next-token probabilities encodes the text in about $\sum_i -\log_2 q(w_i \mid w_{<i})$ bits, which is $N$ times the cross-entropy. Lowering the cross-entropy shortens the code. The decoder needs the same model, so the model acts as the codebook; this is why Chinchilla 70B can beat PNG and FLAC on raw size while compressing small data poorly once its parameters are counted.

11. Why can a neural LM give "the dog sat" a reasonable probability when only "the cat sat" was in training?

> [!success]- Answer
> "cat" and "dog" have similar learned vectors (cosine 0.76 in the GoogleNews vectors, against 0.21 for "cat" and "car"), and the predictor is a smooth function of those vectors. Similar contexts lead to similar vectors and therefore similar predictions. Counting treats the two words as unrelated symbols and cannot do this.

12. An RNN reads a 1,000-token document. Which statement is true? (A) It can condition on all 1,000 tokens, but only through one fixed-size state. (B) It only sees the last $n-1$ tokens, like an n-gram model. (C) It processes all tokens in parallel.

> [!success]- Answer
> A. The RNN has no fixed window (B describes the n-gram model), and it is strictly sequential because step $t$ needs step $t-1$ (so not C). Attention gives direct access to all positions, and the Transformer also parallelizes over them.

---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/02-ml-basics|Previous: (y-02) Machine Learning Basics]]
