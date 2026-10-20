---
title: "L02 - Machine Learning Basics"
tags:
  - foundation-models
  - machine-learning
  - gradient-descent
  - cross-entropy
  - backpropagation
  - cnn
  - attention
date: 2026-10-20
---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/01-introduction|Previous: (y-01) Introduction]]

## Mental Model First

- Training changes parameters; inference only uses the learned function. Everything in the course (pretraining, attention, diffusion) comes back to the same four choices: which targets, which loss, which parameters get updated, and which test distribution you evaluate on.
- The loss defines the learning problem. Squared error fits numbers, negative log-likelihood fits probabilities, and binary or multiclass cross-entropy is just the negative log-likelihood of the observed label. The language-model head is a softmax over the vocabulary trained with exactly this loss.
- Low training loss says little about generalization. What you care about is the population risk on new data, which you estimate with a held-out test set that must be free of leakage and representative of deployment. Validation data picks the checkpoint and hyperparameters.
- Gradient descent moves parameters against the gradient, scaled by the learning rate. Backpropagation computes that gradient by multiplying local derivatives along each path through the computation graph and adding contributions where paths meet.
- Architectures are made of linear maps, nonlinearities and shared weights. CNNs build in locality and weight sharing for images; residual connections and layer normalization keep deep stacks trainable; embeddings and self-attention are the same familiar operations rearranged to mix information across token positions.

## 1. Today's Lecture

The session covers the tools behind pretraining, attention and generative models in four blocks:

- **Learning and evaluation**: define a learning problem and distinguish training fit from generalization.
- **Optimization and probability**: follow a gradient update and connect predictions to likelihood and loss.
- **Neural networks**: track tensor dimensions and explain the chain rule through a network.
- **Architectures and reuse**: recognize these ingredients in CNNs, transformers and diffusion.

The transformer architecture diagram from _Attention Is All You Need_ appears throughout as a reminder of where each ingredient ends up later.

## 2. Training and Inference

![[pictures/foundationmodels/02/Lecture02_Pg004_Training_And_Inference.png]]

<p class="image-caption">Training updates θ from examples and a loss. Inference only applies the learned function to a new input.</p>

During **training**, examples $(x, y)$ go into the model $f_\theta(x)$, the loss $\ell(f_\theta(x), y)$ compares prediction and target, and a gradient update changes θ. During **inference**, a new input $x$ goes through the trained model $f_\theta(x)$ to produce a prediction. Learning changes parameters; inference uses the learned function.

## 3. Where Does the Learning Signal Come From?

![[pictures/foundationmodels/02/Lecture02_Pg005_Where_Does_The_Learning_Signal_Come.png]]

<p class="image-caption">Where the learning signal comes from: supervised, self-supervised, unsupervised and reinforcement learning.</p>

| Paradigm        | Learning signal                                                                    |
| :-------------- | :--------------------------------------------------------------------------------- |
| Supervised      | Human or measured targets: image → class, molecule → property                      |
| Self-supervised | Targets derived from the data: context → next token, masked input → hidden content |
| Unsupervised    | Structure without supplied targets: clusters or a learned data distribution        |
| Reinforcement   | Actions affect future observations; learn from rewards over a trajectory           |

Foundation-model pretraining is mostly self-supervised: the data supplies its own targets.

## 4. Data Become Vectors, Matrices, and Tensors

![[pictures/foundationmodels/02/Lecture02_Pg006_Data_Become_Vectors_Matrices_And_Tensors.png]]

<p class="image-caption">A tensor's shape says what each axis means: d features, B×d mini-batches, B×C×H×W images and B×T×d sequences.</p>

A tensor's shape states what each axis represents:

- one example: $x \in \mathbb{R}^d$, with $d$ features for one observation,
- a mini-batch: $X \in \mathbb{R}^{B \times d}$, with $B$ examples arranged as rows,
- images: $B \times C \times H \times W$ (batch, channels, height, width),
- sequences: $B \times T \times d$ (batch, tokens, features).

## 5. The Supervised Learning Problem

![[pictures/foundationmodels/02/Lecture02_Pg007_The_Supervised_Learning_Problem.png]]

<p class="image-caption">A supervised learning problem: a dataset, a model class, parameters θ and a loss.</p>

Given a dataset $D = \{(x_i, y_i)\}_{i=1}^{N}$, a supervised learning problem has three parts:

- **Model class**: the functions $f_\theta$ the learner can represent.
- **Parameters θ**: weights and biases fitted to the training data.
- **Loss** $\ell(\hat y, y)$: how costly a prediction $\hat y$ is for the observed target $y$.

## 6. The Loss Must Match the Prediction Task

![[pictures/foundationmodels/02/Lecture02_Pg008_The_Loss_Must_Match_The_Prediction.png]]

<p class="image-caption">Squared error for numerical prediction and log loss for probabilistic prediction. Both return later in diffusion and language models.</p>

- **Numerical prediction**: squared error $\ell(\hat y, y) = \frac{1}{2}(\hat y - y)^2$. Predicting 3 instead of 1 gives loss 2, and large residuals get a larger penalty.
- **Probabilistic prediction**: log loss $\ell(p, y) = -\log p(y)$. Assigning probability 0.9 to the observed class costs less than assigning 0.1.

Both come back later: squared error for the noise target in diffusion, and log loss for the next token in a language model.

## 7. Population Risk and Empirical Risk

![[pictures/foundationmodels/02/Lecture02_Pg009_Population_Risk_And_Empirical_Risk.png]]

<p class="image-caption">Population risk is the expected loss on new data from P. Empirical risk is the average loss on a finite dataset.</p>

The distribution $P$ we care about is not available in full.

- **Population risk** is the expected loss on new examples from $P$: $R(\theta) = \mathbb{E}_{(x,y)\sim P}[\ell(f_\theta(x), y)]$.
- **Empirical risk** is the average loss on a finite dataset: $\hat R_D(\theta) = \frac{1}{N}\sum_{i=1}^{N} \ell(f_\theta(x_i), y_i)$. On the training set this is the training loss.

## 8. Training, Validation, and Test Sets

![[pictures/foundationmodels/02/Lecture02_Pg010_Training_Validation_And_Test_Sets.png]]

<p class="image-caption">Training fits parameters, validation chooses hyperparameters and checkpoints, and the test set evaluates once all decisions are fixed.</p>

| Set            | Used for                                                          |
| :------------- | :---------------------------------------------------------------- |
| Training set   | Fit the parameters θ                                              |
| Validation set | Choose architecture, learning rate, regularization and checkpoint |
| Test set       | Evaluate the selected procedure after all decisions are fixed     |

Parameters belong to the fitted model. Hyperparameters configure learning.

### A Useful Test Set Must Avoid Leakage

![[pictures/foundationmodels/02/Lecture02_Pg011_A_Useful_Test_Set_Must_Avoid.png]]

<p class="image-caption">Leakage (the same patient or document on both sides of the split) and distribution shift make a test set misleading.</p>

- **Leakage**: near-duplicates, the same patient or the same document appear on both sides of the split. The model can then exploit information that will not be available on a truly new case.
- **Distribution shift**: training and deployment differ in time, language, institution or image conditions. Choose time-based or group-based splits when the intended use requires them.

## 9. Underfitting and Overfitting

![[pictures/foundationmodels/02/Lecture02_Pg012_Underfitting_And_Overfitting.png]]

<p class="image-caption">Underfitting and overfitting on synthetic data: too restrictive, a useful fit, and a fit that follows the noise.</p>

On synthetic data with a known true mean, three fits show the spectrum: a restrictive model (a straight line) misses the structure, a suitable model captures the trend, and a very flexible model fits the sampling noise.

### Bias, Variance, and Irreducible Noise

![[pictures/foundationmodels/02/Lecture02_Pg013_Bias_Variance_And_Irreducible_Noise.png]]

<p class="image-caption">Repeated datasets separate bias (restricted class) from variance (flexible class). Expected test error = bias² + variance + noise.</p>

Fitting the same model class to many repeated datasets separates the error sources. A restricted model class gives fits that agree with each other but miss the true mean (high bias). A flexible class gives fits that follow each dataset's noise and disagree with each other (high variance).

$$\text{Expected squared test error} = \text{bias}^2 + \text{variance} + \text{noise}$$

Model size alone does not determine generalization. Data, regularization and optimization also matter.

## 10. Regularization

![[pictures/foundationmodels/02/Lecture02_Pg014_Regularization.png]]

<p class="image-caption">Regularization adds a penalty λΩ(θ): L2 shrinks weights, L1 can produce exact zeros, plus early stopping, augmentation and dropout.</p>

Among models that fit the training data, regularization prefers some solutions over others:

$$J(\theta) = \hat R_{\text{train}}(\theta) + \lambda\,\Omega(\theta)$$

Penalties on the weights: $L_2$ with $\Omega(w) = \sum_j w_j^2$ shrinks weights, and $L_1$ with $\Omega(w) = \sum_j |w_j|$ can produce exact zeros. Other controls: early stopping limits training time, data augmentation expresses useful invariances, and dropout perturbs hidden activations during training.

## 11. Linear Regression

![[pictures/foundationmodels/02/Lecture02_Pg015_Linear_Regression.png]]

<p class="image-caption">Linear regression fits a weighted sum. Residuals (red) are the gaps between prediction and target.</p>

Linear regression fits a weighted sum to a numerical target:

$$\hat y_i = w^\top x_i + b, \qquad L(w, b) = \frac{1}{2N}\sum_i (\hat y_i - y_i)^2$$

The residual is $r_i = \hat y_i - y_i$. The weight vector $w$ controls the sensitivity to each feature, and $b$ shifts the prediction.

### Vectorized Regression and Dimensions

![[pictures/foundationmodels/02/Lecture02_Pg016_Vectorized_Regression_And_Dimensions.png]]

<p class="image-caption">Vectorized regression: one matrix multiplication handles a whole mini-batch, the same pattern as the Q, K and V projections later.</p>

One matrix multiplication evaluates a whole mini-batch. With $X: B \times d$, $w: d \times 1$ and a scalar $b$:

$$\hat y = Xw + b\mathbf{1} \quad (B \times 1), \qquad \nabla_w L = \frac{X^\top(\hat y - y)}{B}, \qquad \frac{\partial L}{\partial b} = \frac{1}{B}\sum_i (\hat y_i - y_i)$$

The same pattern returns in attention: $Q = XW_Q$, $K = XW_K$ and $V = XW_V$ are learned linear projections.

## 12. Gradient Descent

![[pictures/foundationmodels/02/Lecture02_Pg017_Gradient_Descent.png]]

<p class="image-caption">Gradient descent steps against the gradient. The learning rate η sets the step size.</p>

Gradient descent moves the parameters opposite to the local gradient:

$$\theta_{t+1} = \theta_t - \eta\,\nabla_\theta L(\theta_t)$$

The gradient points toward the steepest local increase, and the learning rate η controls the step size. Least squares has a closed-form solution, but deep networks require iterative optimization.

### One Gradient Update by Hand

![[pictures/foundationmodels/02/Lecture02_Pg018_One_Gradient_Update_By_Hand.png]]

<p class="image-caption">One update by hand on (1, 2) and (2, 4): the loss drops from 5 to 2.1825 after a single step with η = 0.1.</p>

Two data points, $(1, 2)$ and $(2, 4)$, with $\hat y = wx + b$. Start with $w = 0$, $b = 0$, $\eta = 0.1$:

- Predictions $(0, 0)$, residuals $(-2, -4)$, loss $L = \frac{4 + 16}{4} = 5$.
- $\frac{\partial L}{\partial w} = \frac{1 \cdot (-2) + 2 \cdot (-4)}{2} = -5$ and $\frac{\partial L}{\partial b} = \frac{-2 - 4}{2} = -3$.
- Update: $w_{\text{new}} = 0 - 0.1 \cdot (-5) = 0.5$ and $b_{\text{new}} = 0 - 0.1 \cdot (-3) = 0.3$.
- New predictions $(0.8, 1.3)$ and new loss $\frac{1.44 + 7.29}{4} = 2.1825$.

### The Learning Rate Changes the Behavior

![[pictures/foundationmodels/02/Lecture02_Pg019_The_Learning_Rate_Changes_The_Behavior.png]]

<p class="image-caption">On J(w) = ½w², η = 0.1 is slow, η = 0.8 converges quickly, and η = 2.1 diverges. Convergence needs 0 < η < 2.</p>

For $J(w) = \frac{1}{2}w^2$, starting at $w = 2$, the gradient is $w$, so the exact update is $w_{t+1} = (1 - \eta)\,w_t$. With $\eta = 0.1$ the steps are small and convergence is slow, $\eta = 0.8$ converges quickly, and $\eta = 2.1$ overshoots with growing oscillations. For this example, convergence requires $0 < \eta < 2$.

### Mini-batches and Optimizers

![[pictures/foundationmodels/02/Lecture02_Pg020_Mini_Batches_And_Optimizers.png]]

<p class="image-caption">Full-batch descent, mini-batch SGD, and momentum and Adam, which use the gradient history.</p>

The mini-batch gradient is $g_t = \frac{1}{B}\sum_{i \in \text{batch}} \nabla_\theta \ell_i(\theta_t)$.

- **Full-batch descent** uses all training examples for each update.
- **Mini-batch SGD** uses a sampled subset; updates are faster but carry sampling noise.
- **Momentum and Adam** use the gradient history. Adam also rescales updates by estimated second moments.

### Learning Curves Guide Model Selection

![[pictures/foundationmodels/02/Lecture02_Pg021_Learning_Curves_Guide_Model_Selection.png]]

<p class="image-caption">Training loss keeps falling while validation loss turns up. Select the checkpoint at the validation minimum.</p>

Training loss alone does not select the best checkpoint. In the example, training loss keeps falling while validation loss reaches its minimum around epoch 18 and then rises again. Inspect training and validation loss, the task metric, and performance across relevant groups. Restore the checkpoint selected on validation data, then evaluate on the test set.

## 13. Linear Classification

![[pictures/foundationmodels/02/Lecture02_Pg022_Linear_Classification.png]]

<p class="image-caption">Linear classification: the boundary is where z = x₁ − x₂ + 0.5 is zero, and points below it are class 1.</p>

The decision boundary is where the score is zero:

$$z = w^\top x + b, \qquad \hat y = 1 \text{ if } z \ge 0, \text{ otherwise } 0$$

Example: $z = x_1 - x_2 + 0.5$. The boundary is $x_2 = x_1 + 0.5$, and points below it have class 1.

### Logistic Regression

![[pictures/foundationmodels/02/Lecture02_Pg023_Logistic_Regression.png]]

<p class="image-caption">Logistic regression squashes the linear score with a sigmoid. Thresholding at 0.5 still gives a linear boundary.</p>

A sigmoid turns the linear score into a probability:

$$p_\theta(y = 1 \mid x) = \sigma(z), \qquad \sigma(z) = \frac{1}{1 + \exp(-z)}, \qquad \sigma(0) = 0.5$$

The sigmoid is nonlinear, but thresholding at 0.5 still gives a linear decision boundary. (The MPL course works through logistic regression on the Iris data in [[/notes/lectures/mlp/01-introduction|MPL L01]].)

### Binary Cross-Entropy

![[pictures/foundationmodels/02/Lecture02_Pg024_Binary_Cross_Entropy.png]]

<p class="image-caption">Binary cross-entropy is maximum likelihood for a Bernoulli target. Its gradient with respect to the score is p − y.</p>

Binary cross-entropy is maximum likelihood for a Bernoulli target:

$$\ell(p, y) = -y\log p - (1 - y)\log(1 - p), \qquad \frac{\partial \ell}{\partial z} = p - y$$

For $y = 1$: $p = 0.9$ gives loss ≈ 0.105, and $p = 0.1$ gives loss ≈ 2.303.

### Softmax and Multiclass Cross-Entropy

![[pictures/foundationmodels/02/Lecture02_Pg025_Softmax_And_Multiclass_Cross_Entropy.png]]

<p class="image-caption">Softmax turns scores (2, 1, 0) into probabilities (0.665, 0.245, 0.090). With target B the loss is −log 0.245 ≈ 1.408.</p>

Softmax converts $K$ scores into a categorical distribution:

$$p_k = \frac{\exp(z_k)}{\sum_j \exp(z_j)}, \qquad \ell = -\log p_y, \qquad \frac{\partial \ell}{\partial z_k} = p_k - \mathbf{1}[k = y]$$

Example: scores $(2, 1, 0)$ for classes A, B, C give probabilities $(0.665, 0.245, 0.090)$. If the target is B, the loss is $-\log(0.245) \approx 1.408$. Later, the language-model output head predicts exactly such a distribution over vocabulary tokens.

### Entropy, Cross-Entropy, and Likelihood

![[pictures/foundationmodels/02/Lecture02_Pg026_Entropy_Cross_Entropy_And_Likelihood.png]]

<p class="image-caption">Entropy measures uncertainty in p, and cross-entropy H(p, q) = H(p) + KL(p‖q) measures predicting p with q.</p>

These related quantities answer different questions:

- **Entropy**, the uncertainty in $p$: $H(p) = -\sum_k p_k \log p_k$. For a binary variable it peaks at $P(Y = 1) = 0.5$.
- **Cross-entropy**, predicting $p$ using $q$: $H(p, q) = -\sum_k p_k \log q_k$.
- They are linked by $H(p, q) = H(p) + D_{\text{KL}}(p \,\|\, q)$.

For one-hot labels, cross-entropy equals the negative log-probability of the target.

## 14. Check Your Understanding

The lecture's mid-session questions (answers in the Self-Check below):

- Training loss falls while validation loss rises. Which checkpoint would you select?
- The correct class has probability 0.2. What is its cross-entropy loss?
- Why does the learning rate belong to the hyperparameters rather than the fitted weights?
- An LLM predicts the next token. What supplies the target during pretraining?

## 15. Neural Networks Learn Intermediate Representations

![[pictures/foundationmodels/02/Lecture02_Pg028_Neural_Networks_Learn_Intermediate_Representations.png]]

<p class="image-caption">A multilayer perceptron learns intermediate representations through affine maps and activations.</p>

A multilayer perceptron applies a learned affine map and an activation in each layer:

$$h = \varphi(W_1^\top x + b_1), \qquad \hat y = W_2^\top h + b_2$$

The hidden features can make the final prediction easier.

### Nonlinearity Makes the Model Class Richer

![[pictures/foundationmodels/02/Lecture02_Pg029_Nonlinearity_Makes_The_Model_Class_Richer.png]]

<p class="image-caption">Without activations, stacked affine layers collapse into one. For XOR, two hidden features make the classes separable.</p>

Without activations, stacked affine layers collapse into one affine map:

$$W_2^\top(W_1^\top x + b_1) + b_2 = \tilde W^\top x + \tilde b$$

For XOR, one line is insufficient. Two useful hidden features detect whether $x_1 + x_2$ exceeds 0.5 or 1.5, and the classes become separable from those features.

### Activation Functions and Their Gradients

![[pictures/foundationmodels/02/Lecture02_Pg030_Activation_Functions_And_Their_Gradients.png]]

<p class="image-caption">Sigmoid saturates, ReLU gives zero gradient to inactive units, and GELU is smooth and used in transformer feed-forward layers.</p>

- **Sigmoid** can saturate and produce small gradients.
- **ReLU** is piecewise linear; inactive units receive zero gradient.
- **GELU** is smooth and appears in transformer feed-forward layers.

### Dimensions through an MLP

![[pictures/foundationmodels/02/Lecture02_Pg031_Dimensions_Through_An_Mlp.png]]

<p class="image-caption">Tracking dimensions through an MLP. With d = 4, h = 8 and K = 3 the network has 67 parameters.</p>

With the row-batch convention (one example per row of $X$):

$$X: B \times d,\; W_1: d \times h,\; b_1: h \;\Rightarrow\; H = \varphi(XW_1 + b_1): B \times h$$
$$W_2: h \times K \;\Rightarrow\; Z = HW_2 + b_2,\; P = \mathrm{softmax}(Z): B \times K$$

Example: $d = 4$, $h = 8$, $K = 3$ gives $4 \times 8 + 8 + 8 \times 3 + 3 = 67$ parameters.

## 16. A Computation Graph Makes Dependencies Explicit

![[pictures/foundationmodels/02/Lecture02_Pg032_A_Computation_Graph_Makes_Dependencies_Explicit.png]]

<p class="image-caption">A computation graph for one ReLU unit: x = 2 gives z = 1, h = 1, ŷ = 3 and a loss of 2 against target 1.</p>

One input, one hidden ReLU and a squared-error loss. With $x = 2$, $w = 1$, $b = -1$ and $v = 3$:

- $z = wx + b = 1$, $h = \mathrm{ReLU}(z) = 1$, $\hat y = vh = 3$.
- With target $y = 1$: $\ell = \frac{1}{2}(\hat y - y)^2 = 2$.

The forward pass stores the intermediate values needed for differentiation.

### Backpropagation Applies the Chain Rule

![[pictures/foundationmodels/02/Lecture02_Pg033_Backpropagation_Applies_The_Chain_Rule.png]]

<p class="image-caption">Backpropagation on the same graph: multiply local derivatives along paths to get ∂ℓ/∂v = 2, ∂ℓ/∂z = 6, ∂ℓ/∂w = 12 and ∂ℓ/∂b = 6.</p>

The same example, evaluated backward:

- $\frac{\partial \ell}{\partial \hat y} = \hat y - y = 2$
- Output weight: $\frac{\partial \ell}{\partial v} = \frac{\partial \ell}{\partial \hat y}\,h = 2$
- Hidden pre-activation: $\frac{\partial \ell}{\partial z} = 2 \cdot v \cdot \mathrm{ReLU}'(1) = 6$
- $\frac{\partial \ell}{\partial w} = 6 \cdot x = 12$ and $\frac{\partial \ell}{\partial b} = 6$

Multiply local derivatives along a path, and add the contributions where paths meet.

### The Training Loop

Automatic differentiation computes derivatives of the recorded operations:

```text
repeat over mini-batches (X, y):
    clear stored gradients
    predictions = model(X; θ)
    loss = objective(predictions, y)
    gradients = backward(loss)
    θ = optimizer_step(θ, gradients)
```

The loss defines the learning problem; the optimizer uses its gradients.

## 17. Depth, Gradients, and Residual Connections

![[pictures/foundationmodels/02/Lecture02_Pg035_Depth_Gradients_And_Residual_Connections.png]]

<p class="image-caption">Repeated factors make gradients vanish (0.5¹⁰) or explode (2¹⁰). A residual block adds the input back, x + F(x).</p>

Backpropagation multiplies local Jacobians. Repeated small or large factors make gradients vanish or explode: $0.5^{10} \approx 0.001$ and $2^{10} = 1024$. A **residual block** computes $x + F(x)$, so the identity path carries the signal and its gradient past $F$. Transformer blocks later combine residual paths, normalization, attention and MLPs.

### Layer Normalization

![[pictures/foundationmodels/02/Lecture02_Pg036_Layer_Normalization.png]]

<p class="image-caption">Layer normalization computes mean and variance over the d features of each token, with learned γ and β per feature.</p>

Layer normalization normalizes the feature coordinates of each example or token:

$$\mu = \frac{1}{d}\sum_j x_j, \qquad \sigma^2 = \frac{1}{d}\sum_j (x_j - \mu)^2, \qquad \mathrm{LN}(x) = \gamma \odot \frac{x - \mu}{\sqrt{\sigma^2 + \varepsilon}} + \beta$$

γ and β are learned per feature, and ε is a small numerical constant. For a $B \times T \times d$ sequence tensor, each token gets its own statistics over $d$.

## 18. Images Have Spatial Structure

![[pictures/foundationmodels/02/Lecture02_Pg037_Images_Have_Spatial_Structure.png]]

<p class="image-caption">Flattening an image keeps the values but loses neighborhoods. A fully connected layer has no locality or weight sharing built in.</p>

Flattening an image keeps the pixel values but removes the explicit neighborhood structure. A fully connected layer can learn from flattened pixels, but it uses separate weights for different pixel positions and does not build local connectivity or weight sharing into the architecture. CNNs encode locality and shared filters; image transformers use patch embeddings. (For the full CNN treatment see [[/notes/lectures/mlp/02-cnn|MPL L02: CNNs]].)

### Convolution: One Local Computation

![[pictures/foundationmodels/02/Lecture02_Pg038_Convolution_One_Local_Computation.png]]

<p class="image-caption">A convolution is a dot product between a local patch and a shared filter, here giving 1 − 3 + 2 = 0.</p>

A filter uses the same weights at every spatial position. Each output is the dot product between a local input patch and the filter, plus a bias. With the patch $\begin{bmatrix}1&2&0\\0&1&3\\2&1&0\end{bmatrix}$ and a vertical edge filter whose rows are all $(1, 0, -1)$, the entrywise products sum to $1 - 3 + 2 = 0$, and with $b = 0$ the output is 0.

### CNN Architecture

![[pictures/foundationmodels/02/Lecture02_Pg039_Cnn_Architecture.png]]

<p class="image-caption">One filter turns an input digit into a response map.</p>

![[pictures/foundationmodels/02/Lecture02_Pg040_Cnn_Architecture.png]]

<p class="image-caption">A CNN stacks convolution and pooling layers for feature learning, then flattens into an MLP for classification.</p>

A CNN consists of convolutional layers, which learn visual patterns by adapting their parameters, followed by an MLP that predicts from the flattened output of the last convolutional layer. The visualization shows a single filter turning an input digit into a response map that highlights its edges.

### Stride and Padding

![[pictures/foundationmodels/02/Lecture02_Pg041_Stride_And_Padding.png]]

<p class="image-caption">Stride is the pixel distance between receptive fields. Stride 2 shrinks the output volume.</p>

![[pictures/foundationmodels/02/Lecture02_Pg042_Stride_And_Padding.png]]

<p class="image-caption">Zero padding adds a border so filters can also be applied at the corners.</p>

- **Stride** is the pixel distance between neighboring receptive fields, which can overlap. Stride affects the output volume.
- **Padding**: filters cannot be centered on the corners of the input. If that is a problem, zeros are added at the boundary (zero padding), which again affects the output volume.

### Stride and Padding Determine Output Size

![[pictures/foundationmodels/02/Lecture02_Pg043_Stride_And_Padding_Determine_Output_Size.png]]

<p class="image-caption">Output size H_out = ⌊(H + 2p − k)/s⌋ + 1. A 3×3 kernel with s = 1 and p = 1 keeps a 7×7 input at 7×7.</p>

$$H_{\text{out}} = \left\lfloor \frac{H + 2p - k}{s} \right\rfloor + 1$$

with kernel size $k$, stride $s$ and padding $p$ on each side (dilation 1; the same rule applies to the width). For $H = W = 7$ and $k = 3$: $s = 1, p = 0$ gives $5 \times 5$; $s = 2, p = 0$ gives $3 \times 3$; and $s = 1, p = 1$ preserves the $7 \times 7$ size.

### Parameter Sharing and the Output Volume

![[pictures/foundationmodels/02/Lecture02_Pg044_Parameter_Sharing_And_The_Output_Volume.png]]

<p class="image-caption">Parameter sharing: one H_F × W_F × D_F filter has H_F · W_F · D_F + 1 parameters, whatever the image size.</p>

![[pictures/foundationmodels/02/Lecture02_Pg045_Parameter_Sharing_And_The_Output_Volume.png]]

<p class="image-caption">Each filter yields one output channel. Stacking D_O filters gives an H_O × W_O × D_O output tensor.</p>

The same filter is applied to every receptive field, which reduces the number of parameters and allows generalization. An $H_F \times W_F \times D_F$ filter has $H_F \cdot W_F \cdot D_F + 1$ parameters (the $+1$ is the bias). The input to a convolutional layer is an $H_I \times W_I \times D_I$ tensor; every filter yields an $H_O \times W_O \times 1$ output, and stacking the outputs of $D_O$ filters yields an $H_O \times W_O \times D_O$ tensor.

### Equivariance, Invariance, and Pooling

![[pictures/foundationmodels/02/Lecture02_Pg047_Equivariance_Invariance_And_Pooling.png]]

<p class="image-caption">Convolution is translation equivariant. Pooling summarizes a region (max 3, mean 1.5) and reduces, but does not remove, position sensitivity.</p>

Parameter sharing causes **translation equivariance**: $f(\text{shift}(x)) = \text{shift}(f(x))$, so a shifted input (the cat moved in the image) produces a correspondingly shifted feature map. Convolution has this property ideally; boundaries and striding can break it.

**Pooling** summarizes a region: for the values $(1, 3, 2, 0)$, max pooling gives 3 and average pooling 1.5. Each neuron only sees a small receptive field, and often we care about the presence of a feature, not its exact location. Invariance means the output stays the same under a shift; pooling can reduce sensitivity to position but does not guarantee invariance.

### Down-Sampling

![[pictures/foundationmodels/02/Lecture02_Pg049_Down_Sampling.png]]

<p class="image-caption">Stride and pooling both down-sample, which can avoid overfitting or cause underfitting.</p>

Stride and pooling both down-sample: stride skips regions, pooling summarizes them. The trade-off is that down-sampling can avoid overfitting (dropping irrelevant details) but can also cause underfitting (dropping relevant details).

### Receptive Fields Grow with Depth

![[pictures/foundationmodels/02/Lecture02_Pg050_Receptive_Fields_Grow_With_Depth.png]]

<p class="image-caption">Receptive fields grow with depth: two 3×3 layers see a 5×5 region, and local patterns combine into parts.</p>

Successive layers combine information from progressively larger input regions: two $3 \times 3$ layers with stride 1 give a $5 \times 5$ receptive field. Local edge and corner patterns combine into parts, and parts into a "cat". Visual encoders and convolutional denoisers later rely on such learned spatial representations.

## 19. Embeddings Put Tokens into a Vector Space

![[pictures/foundationmodels/02/Lecture02_Pg051_Embeddings_Put_Tokens_Into_A_Vector.png]]

<p class="image-caption">Embeddings: a token id becomes a row of the embedding matrix E, and an image patch goes through a shared linear projection.</p>

- **Text tokens**: token id $i \mapsto E[i, :]$, a row lookup in a learned embedding matrix $E \in \mathbb{R}^{V \times d}$. One token becomes one $d$-dimensional vector.
- **Image patches**: patch vector $x \mapsto xW + b$. Each patch is flattened and passed through a shared learned projection.

Position information identifies where the tokens occur. A sequence of embeddings then becomes the input to a transformer.

## 20. A First Look at Self-Attention

![[pictures/foundationmodels/02/Lecture02_Pg052_A_First_Look_At_Self_Attention.png]]

<p class="image-caption">Self-attention: dot products compare queries with keys, softmax turns each row into weights, and weighted sums combine values.</p>

Self-attention combines familiar operations to mix information across token positions:

$$Q = XW_Q,\quad K = XW_K,\quad V = XW_V, \qquad \mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

- **Dot products**: $QK^\top$ compares each query with each key.
- **Softmax**: each row becomes weights that sum to one.
- **Weighted sums**: those weights combine the value vectors.

(The full transformer is covered in [[/notes/lectures/mlp/05-transformer|MPL L05: Transformers]].)

## 21. Self-Supervision Creates Prediction Targets

![[pictures/foundationmodels/02/Lecture02_Pg053_Self_Supervision_Creates_Prediction_Targets.png]]

<p class="image-caption">Self-supervision builds the targets from the data. The autoregressive loss sums −log p(xₜ | x<ₜ) over the sequence.</p>

The optimizer can stay the same while the target construction changes. An autoregressive language model turns "The sky is" into the target "blue" and minimizes

$$L = -\sum_t \log p_\theta(x_t \mid x_{<t})$$

Other self-supervised tasks: masked prediction recovers hidden content, and contrastive learning scores a matched image-text pair above mismatched pairs.

## 22. Pretraining and Adaptation Reuse Learned Parameters

![[pictures/foundationmodels/02/Lecture02_Pg054_Pretraining_And_Adaptation_Reuse_Learned_Parameters.png]]

<p class="image-caption">Pretraining gives θ_pre as a starting point, and adaptation adds Δθ using task data.</p>

- **Pretraining** optimizes a broadly useful objective on a large and varied dataset; the result $\theta_{\text{pre}}$ is a learned starting point.
- **Adaptation** uses new task data to update all parameters or a chosen subset: $\theta_{\text{adapt}} = \theta_{\text{pre}} + \Delta\theta$.

The same questions return each time: which targets, which loss, which parameters, and which test distribution?

## 23. Reading and Connections to Later Lectures

- ML and neural networks: Russell and Norvig, _Artificial Intelligence: A Modern Approach_ (4th Global ed.), chapters 19 and 22.
- Attention and transformers: Vaswani et al. (2017), _Attention Is All You Need_.
- Residuals and normalization: He et al. (2016), _Deep Residual Learning_; Ba et al. (2016), _Layer Normalization_.
- Optimization: Loshchilov and Hutter (2019), _Decoupled Weight Decay Regularization_.
- Diffusion: Ho, Jain and Abbeel (2020), _Denoising Diffusion Probabilistic Models_.

## Summary

- A learning problem is a model class, parameters and a loss. The loss must fit the task: squared error for numbers, negative log-likelihood (cross-entropy) for probabilities.
- Generalization is about population risk. Training, validation and test sets have separate jobs, and leakage or distribution shift make a test set useless. Expected test error = bias² + variance + noise.
- Regularization ($L_2$, $L_1$, early stopping, augmentation, dropout) prefers some solutions among those that fit.
- Gradient descent with learning rate η (stable only in a range, here $0 < \eta < 2$), mini-batch SGD, momentum and Adam; select checkpoints on validation loss.
- Logistic regression, binary cross-entropy with gradient $p - y$, softmax cross-entropy with gradient $p_k - \mathbf{1}[k = y]$, and $H(p, q) = H(p) + D_{\text{KL}}(p\|q)$.
- MLPs need nonlinearities; backpropagation multiplies local derivatives along paths; residual connections and layer norm keep deep networks trainable.
- CNNs: local filters, parameter sharing, stride and padding ($H_{\text{out}} = \lfloor (H + 2p - k)/s \rfloor + 1$), equivariance, pooling, growing receptive fields.
- Embeddings, self-attention and self-supervised targets connect all of this to foundation models.

## Self-Check

1. Training loss falls while validation loss rises. Which checkpoint do you select, and why?

> [!success]- Answer
> The checkpoint with the lowest validation loss, at the point where validation loss starts to rise. After that the model fits noise in the training data and generalizes worse. Restore that checkpoint and only then evaluate it once on the test set.

2. The correct class has probability 0.2. What is its cross-entropy loss?

> [!success]- Answer
> $-\log(0.2) \approx 1.609$ (natural log). For one-hot labels, cross-entropy is the negative log-probability of the target class.

3. Why is the learning rate a hyperparameter and not a fitted weight?

> [!success]- Answer
> It configures how learning happens (the step size of the optimizer) instead of being part of the fitted function $f_\theta$. Hyperparameters like the learning rate, architecture and regularization are chosen with the validation set; parameters are fitted on the training set.

4. An LLM predicts the next token. What supplies the target during pretraining?

> [!success]- Answer
> The data itself. In self-supervised pretraining, the next token of the training text is the target for the context before it, so no human labels are needed. The loss is $-\sum_t \log p_\theta(x_t \mid x_{<t})$.

5. What is the difference between population risk and empirical risk?

> [!success]- Answer
> Population risk is the expected loss on new examples drawn from the distribution $P$ we care about, which we cannot compute because $P$ is not available in full. Empirical risk is the average loss on a finite dataset; on the training set it is the training loss, and on a held-out test set it estimates the population risk.

6. Give two ways a test set can fail to measure generalization.

> [!success]- Answer
> Leakage: near-duplicates, the same patient or the same document end up on both sides of the split, so the model exploits information a truly new case would not have. Distribution shift: training and deployment differ in time, language, institution or image conditions, which calls for time-based or group-based splits.

7. Compute one gradient step for $\hat y = wx + b$ on the points (1, 2) and (2, 4), starting from $w = b = 0$ with $\eta = 0.1$ and $L = \frac{1}{2N}\sum(\hat y - y)^2$.

> [!success]- Answer
> Residuals are (−2, −4), so $L = 5$. $\partial L/\partial w = (1 \cdot (-2) + 2 \cdot (-4))/2 = -5$ and $\partial L/\partial b = (-2 - 4)/2 = -3$. The update gives $w = 0.5$ and $b = 0.3$, the new predictions are (0.8, 1.3), and the new loss is 2.1825.

8. For $J(w) = \frac{1}{2}w^2$, which learning rates converge, and why?

> [!success]- Answer
> The update is $w_{t+1} = (1 - \eta)w_t$, which shrinks $w$ only if $|1 - \eta| < 1$, so $0 < \eta < 2$. Small η (0.1) converges slowly, η around 0.8 converges fast, and η = 2.1 overshoots with oscillations that grow.

9. Why do stacked linear layers need activation functions?

> [!success]- Answer
> Without them, $W_2^\top(W_1^\top x + b_1) + b_2$ collapses into a single affine map $\tilde W^\top x + \tilde b$, so depth adds nothing. Nonlinear activations let hidden features (like detecting whether $x_1 + x_2$ exceeds 0.5 or 1.5 for XOR) make problems separable that a single line cannot solve.

10. In the computation graph with $x = 2$, $w = 1$, $b = -1$, $v = 3$ and $y = 1$, what are $\partial \ell / \partial w$ and $\partial \ell / \partial b$?

> [!success]- Answer
> The forward pass gives $z = 1$, $h = 1$, $\hat y = 3$ and $\ell = 2$. Backward: $\partial \ell/\partial \hat y = 2$, $\partial \ell/\partial z = 2 \cdot v \cdot \mathrm{ReLU}'(1) = 6$, so $\partial \ell/\partial w = 6 \cdot x = 12$ and $\partial \ell/\partial b = 6$.

11. A 7 × 7 input goes through a 3 × 3 convolution with stride 2 and no padding. What is the output size? What padding keeps 7 × 7 with stride 1?

> [!success]- Answer
> $\lfloor (7 + 0 - 3)/2 \rfloor + 1 = 3$, so 3 × 3. With stride 1, padding $p = 1$ gives $(7 + 2 - 3)/1 + 1 = 7$ and preserves the 7 × 7 size.

12. What is the difference between translation equivariance and invariance, and which one does pooling give?

> [!success]- Answer
> Equivariance means a shifted input gives a correspondingly shifted output, $f(\text{shift}(x)) = \text{shift}(f(x))$, which convolution has ideally thanks to parameter sharing. Invariance means the output stays the same under the shift. Pooling reduces sensitivity to position but does not guarantee invariance.

13. Final check from the lecture: what changes between token prediction and noise prediction?

> [!success]- Answer
> The target construction and the loss, while the optimizer and the reuse of learned parameters stay the same. Token prediction uses the next token as a categorical target with a log loss (cross-entropy over the vocabulary). Noise prediction in diffusion regresses the added noise with a squared error loss.

---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/01-introduction|Previous: (y-01) Introduction]]
