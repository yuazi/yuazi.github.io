---
title: "Generative Models (VAE, GAN, Diffusion)"
tags:
  - machine-learning
  - deep-learning
  - generative-models
date: 2026-11-05
---

A generative model learns the distribution of the training data well enough to draw new samples from it. Three families dominate image generation: variational autoencoders (VAEs), generative adversarial networks (GANs) and diffusion models. They answer the same question, how do you train a network to turn noise into data, with three different objectives, and the differences show up in sample quality, training stability, sampling speed and whether you get a likelihood.

## Mental Model

- A likelihood-based model defines or bounds $p_\theta(x)$ and is trained by maximizing it. An implicit model only gives samples, and needs a different training signal.
- A VAE compresses data to a latent code through an encoder and decodes it back. A KL term keeps the latent space close to a simple prior so that sampling from the prior produces plausible outputs.
- A GAN trains a generator against a discriminator. There is no likelihood, only a game, which is why it is fast to sample from and hard to train.
- A diffusion model learns to undo a fixed noising process one small step at a time. Training is plain regression, and sampling takes many network evaluations.
- Guidance trades diversity for fidelity to a condition such as a text prompt.

## 1. Likelihood Versus Implicit Models

Maximum likelihood fits $p_\theta(x)$ to the data. Autoregressive models and normalizing flows do this exactly. VAEs and diffusion models optimize a lower bound on $\log p_\theta(x)$ because the exact value involves an integral over latent variables that cannot be computed. GANs skip the density altogether: the generator is a function $G(z)$ that maps noise to samples, and you can sample from it but not evaluate how likely a given image is. Implicit models avoid the compromises that come with a likelihood (such as blurry averages), but they need an adversarial or other indirect objective.

## 2. Variational Autoencoders

The encoder outputs the parameters of $q_\phi(z \mid x) = \mathcal{N}(\mu, \text{diag}(\sigma^2))$, the decoder models $p_\theta(x \mid z)$, and the prior is $p(z) = \mathcal{N}(0, I)$. Training maximizes the evidence lower bound (ELBO), from Kingma and Welling (2013):

$$
\log p_\theta(x) \ge \mathbb{E}_{q_\phi(z \mid x)}\big[\log p_\theta(x \mid z)\big] - D_{KL}\big(q_\phi(z \mid x) \,\Vert\, p(z)\big)
$$

The first term is the reconstruction quality, the second regularizes the code. For a diagonal Gaussian against the standard normal the KL has a closed form:

$$
D_{KL} = \frac{1}{2} \sum_j \big(\mu_j^2 + \sigma_j^2 - \log \sigma_j^2 - 1\big).
$$

> [!example] Worked example
> For a single latent dimension with $\mu = 1$ and $\sigma = 0.5$: $\tfrac{1}{2}(1 + 0.25 - \ln 0.25 - 1) = \tfrac{1}{2}(0.25 + 1.386) = 0.818$. A Monte Carlo estimate over a million samples, taking the mean of $\log q(z) - \log p(z)$, gives 0.818 as well.

Sampling $z$ from $q$ is a random step, and gradients cannot flow through it. The reparameterization trick moves the randomness into a separate variable:

$$
z = \mu + \sigma \odot \epsilon, \qquad \epsilon \sim \mathcal{N}(0, I).
$$

Now $z$ is a deterministic, differentiable function of $\mu$ and $\sigma$ plus fixed noise. With a Gaussian decoder the reconstruction term is a squared error, and that averaging is the usual explanation for blurry VAE samples. A failure mode to know is posterior collapse: a decoder that is strong on its own ignores $z$, and the KL goes to zero. Weighting the KL by a factor $\beta$ (the $\beta$-VAE) controls the trade-off between reconstruction and a well-structured latent space.

## 3. GANs

Goodfellow et al. (2014) set up a two-player game between a generator $G$ and a discriminator $D$ that outputs the probability that its input is real:

$$
\min_G \max_D \; \mathbb{E}_{x \sim p_{data}}[\log D(x)] + \mathbb{E}_{z \sim p(z)}[\log(1 - D(G(z)))]
$$

For a fixed generator the best discriminator is $D^*(x) = p_{data}(x) / (p_{data}(x) + p_g(x))$. Plugging it in turns the generator's objective into $-\log 4 + 2 \cdot JSD(p_{data} \Vert p_g)$, which is minimized when $p_g = p_{data}$. In practice the generator uses the non-saturating loss $-\log D(G(z))$, because early in training $D$ wins easily and the original term gives almost no gradient.

The theory assumes $D$ is optimal at every step, which never holds, and training is a moving target. Common problems are oscillation and mode collapse, where $G$ finds a few outputs that fool $D$ and produces little variety. Wasserstein GANs (Arjovsky et al., 2017) replace the loss with an earth-mover distance estimate that gives more informative gradients when the two distributions barely overlap.

## 4. Diffusion Models

Denoising diffusion probabilistic models (Ho et al., 2020) define a fixed forward process that adds a little Gaussian noise at each of $T$ steps:

$$
q(x_t \mid x_{t-1}) = \mathcal{N}\big(\sqrt{1 - \beta_t}\, x_{t-1},\ \beta_t I\big).
$$

With $\alpha_t = 1 - \beta_t$ and $\bar{\alpha}_t = \prod_{s \le t} \alpha_s$ you can jump to any step in one go:

$$
x_t = \sqrt{\bar{\alpha}_t}\, x_0 + \sqrt{1 - \bar{\alpha}_t}\, \epsilon, \qquad \epsilon \sim \mathcal{N}(0, I).
$$

The reverse process is learned. A network $\epsilon_\theta(x_t, t)$ is trained to predict the noise that was added, with a simple loss:

$$
\mathcal{L} = \mathbb{E}_{x_0, t, \epsilon}\big[\lVert \epsilon - \epsilon_\theta(x_t, t) \rVert^2\big].
$$

A training step picks a random $t$, noises an image with the closed form, and regresses the noise. Sampling starts from $x_T \sim \mathcal{N}(0, I)$ and repeats

$$
x_{t-1} = \frac{1}{\sqrt{\alpha_t}} \Big(x_t - \frac{\beta_t}{\sqrt{1 - \bar{\alpha}_t}}\, \epsilon_\theta(x_t, t)\Big) + \sigma_t z
$$

for $t = T, \dots, 1$, with fresh noise $z$ at every step but the last. Ho et al. use a linear schedule from $\beta_1 = 10^{-4}$ to $\beta_T = 0.02$ with $T = 1000$.

```python
import numpy as np

T = 1000
betas = np.linspace(1e-4, 0.02, T)
ab = np.cumprod(1 - betas)                        # alpha_bar
print(ab[499], ab[-1])                            # 0.0786, 4.0e-05

rng = np.random.default_rng(0)
x = np.ones(20000)                                # 20000 chains starting at x0 = 1
for t in range(500):
    x = np.sqrt(1 - betas[t]) * x + np.sqrt(betas[t]) * rng.normal(size=x.size)
print(x.mean(), np.sqrt(ab[499]))                 # about 0.27 vs 0.28
print(x.std(), np.sqrt(1 - ab[499]))              # about 0.96 vs 0.96
```

By $t = 1000$ the signal coefficient $\sqrt{\bar\alpha_T}$ is about 0.006, so $x_T$ is nearly pure noise and starting the reverse process from a standard normal is justified. Running 500 noising steps one at a time reproduces the closed-form mean and standard deviation, which is what makes cheap training possible.

### Classifier-Free Guidance

For conditional generation (a text prompt $c$), train one network with the condition randomly dropped, for example 10% of the time, so it learns both $\epsilon_\theta(x_t, c)$ and an unconditional $\epsilon_\theta(x_t, \varnothing)$. At sampling time extrapolate away from the unconditional prediction (Ho and Salimans, 2022):

$$
\tilde{\epsilon} = \epsilon_\theta(x_t, \varnothing) + s \cdot \big(\epsilon_\theta(x_t, c) - \epsilon_\theta(x_t, \varnothing)\big).
$$

Scale $s = 1$ is the plain conditional model, larger values follow the prompt more closely and give less varied images, and values that are too high produce oversaturated, distorted results. It costs two network evaluations per step. Latent diffusion (Rombach et al., 2022) runs the whole process in the latent space of an autoencoder rather than in pixel space, which makes high-resolution generation affordable.

## 5. Comparison

| Model     | Training objective            | Sampling                              | Likelihood         | Typical weakness                                |
| --------- | ----------------------------- | ------------------------------------- | ------------------ | ----------------------------------------------- |
| VAE       | ELBO (reconstruction plus KL) | One decoder pass                      | Lower bound        | Blurry samples, posterior collapse              |
| GAN       | Adversarial minimax game      | One generator pass                    | None               | Mode collapse, unstable training                |
| Diffusion | Noise-prediction MSE          | Tens to 1000 network passes per image | Bound, rarely used | Slow sampling, needs many steps or distillation |

## Related

- [[notes/lectures/mlp/09-vae|MPL 09: VAEs]], [[notes/lectures/mlp/10-gans|MPL 10: GANs]] and [[notes/lectures/mlp/12-diffusion|MPL 12: Diffusion]], the lectures for the three families
- [[notes/ml/embeddings|Embeddings]], for the latent spaces these models learn and the CLIP encoders used for prompts
- [[notes/ml/attention-and-transformers|Attention and Transformers]], the backbone of modern text-conditioned diffusion models
- [[notes/ml/convolutional-networks|Convolutional Networks]], the building block of the original U-Net denoisers and GAN generators
- [[notes/ml/generalization-and-regularization|Generalization and Regularization]], for why the KL term acts as a regularizer
- [[notes/random/neural-style-transfer|Neural Style Transfer]], an earlier, optimization-based way to generate images from CNN features
