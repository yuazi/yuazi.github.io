---
title: "Clustering (k-means, GMM, DBSCAN)"
tags:
  - machine-learning
  - unsupervised-learning
  - clustering
date: 2026-11-05
---

Clustering groups unlabeled points so that members of a group are more alike than members of different groups. There is no ground truth to check against, so the algorithm's assumptions about what a cluster looks like decide the result. I think of the three standard methods as three answers to that question: a compact blob around a center (k-means), a Gaussian with its own shape (GMM), or a dense region separated by sparse gaps (DBSCAN).

## Mental Model

- k-means minimizes within-cluster squared distance to a centroid. It assumes roughly round, similar-sized clusters and needs $k$ in advance.
- A Gaussian mixture model is a soft, probabilistic generalization: each cluster has its own mean, covariance and weight, and each point gets a membership probability.
- DBSCAN defines clusters by density, finds arbitrary shapes, labels outliers as noise, and does not need $k$ but does need a distance scale.
- Initialization and scaling matter more than people expect: k-means finds a local optimum, and distances change if features have different units.
- Choosing the number of clusters is a modeling decision supported by heuristics, not something the data decides alone.

## 1. k-means and Lloyd's Algorithm

Given points $\mathbf x_1,\dots,\mathbf x_n$ and $k$, k-means seeks assignments $c_i\in\{1..k\}$ and centroids $\boldsymbol\mu_1..\boldsymbol\mu_k$ minimizing

$$
J=\sum_{i=1}^n\lVert\mathbf x_i-\boldsymbol\mu_{c_i}\rVert^2 .
$$

Lloyd's algorithm alternates two steps. Assign each point to its nearest centroid. Then move each centroid to the mean of its assigned points, which is the exact minimizer of $J$ for fixed assignments. Both steps can only lower $J$ (or leave it unchanged) and there are finitely many assignments, so it terminates, but only at a local minimum. Finding the global minimum is NP-hard. Each iteration costs $O(nkd)$.

Consequences of the objective: clusters are Voronoi cells with linear boundaries, outliers drag centroids because squared distance punishes them, and features on larger scales dominate, so standardize first. k-means cannot separate two concentric rings or two interleaved crescents.

## 2. k-means++ Seeding

Random initial centroids can land two in one blob and none in another, and Lloyd will not fix that. k-means++ (Arthur and Vassilvitskii, 2007) picks the first centroid uniformly at random, then each following centroid with probability proportional to $D(\mathbf x)^2$, the squared distance to the nearest already chosen centroid. Points far from existing centers are likely picks, so the seeds spread out. The expected cost is within $O(\log k)$ of optimal, and in practice it also converges in fewer iterations. Standard practice is k-means++ plus several restarts, keeping the lowest $J$.

## 3. Choosing $k$

$J$ decreases as $k$ grows (at $k=n$ it is zero), so minimizing it directly is useless. Two common heuristics:

- Elbow: plot $J$ against $k$ and look for the bend where extra clusters stop paying off. Often ambiguous.
- Silhouette: for point $i$, let $a$ be its mean distance to its own cluster and $b$ the smallest mean distance to another cluster. Then $s=(b-a)/\max(a,b)\in[-1,1]$. The average over points is high when clusters are tight and well separated, and you pick the $k$ that maximizes it.

The code below implements k-means++, Lloyd and the silhouette on three Gaussian blobs (centers $(0,0)$, $(4,0)$, $(2,3.5)$, standard deviation 0.6, 100 points each) and tries $k=1..6$ with five restarts each.

```python
import numpy as np

def kmeans(X, k, iters=100, seed=0):
    rng = np.random.default_rng(seed)
    C = [X[rng.integers(len(X))]]                      # k-means++ seeding
    for _ in range(k - 1):
        d2 = np.min([((X - c) ** 2).sum(1) for c in C], axis=0)
        C.append(X[rng.choice(len(X), p=d2 / d2.sum())])
    C = np.array(C)
    for _ in range(iters):                             # Lloyd's algorithm
        lab = ((X[:, None] - C[None]) ** 2).sum(2).argmin(1)
        newC = np.array([X[lab == j].mean(0) if (lab == j).any() else C[j] for j in range(k)])
        if np.allclose(newC, C): break
        C = newC
    return lab, C, ((X - C[lab]) ** 2).sum()

def silhouette(X, lab):
    D = np.sqrt(((X[:, None] - X[None]) ** 2).sum(2))
    s = []
    for i in range(len(X)):
        same = (lab == lab[i]); same[i] = False
        a = D[i, same].mean()
        b = min(D[i, lab == j].mean() for j in set(lab) if j != lab[i])
        s.append((b - a) / max(a, b))
    return np.mean(s)

rng = np.random.default_rng(42)
X = np.vstack([rng.normal(m, 0.6, (100, 2)) for m in [(0, 0), (4, 0), (2, 3.5)]])
for k in range(1, 7):
    lab, C, J = min((kmeans(X, k, seed=s) for s in range(5)), key=lambda r: r[2])
    print(k, round(J, 1), round(silhouette(X, lab), 3) if k > 1 else "-")
```

Running it gives:

| $k$ | $J$    | Silhouette |
| --- | ------ | ---------- |
| 1   | 1840.8 | n/a        |
| 2   | 1009.5 | 0.497      |
| 3   | 202.8  | 0.726      |
| 4   | 170.5  | 0.599      |
| 5   | 145.7  | 0.457      |
| 6   | 125.2  | 0.345      |

$J$ drops from 1009 to 203 going from 2 to 3 clusters, then only by 32 more going to 4: a clear elbow at $k=3$. The silhouette peaks at $k=3$ as well. Real data seldom agrees this cleanly.

## 4. Gaussian Mixtures and EM

A GMM models the density as $p(\mathbf x)=\sum_{j=1}^k\pi_j\,\mathcal N(\mathbf x\mid\boldsymbol\mu_j,\Sigma_j)$ with mixing weights $\pi_j\ge0$ summing to 1. The log-likelihood has a sum inside the log, so there is no closed-form maximizer. Expectation-Maximization alternates:

$$
\text{E-step: }\gamma_{ij}=\frac{\pi_j\,\mathcal N(\mathbf x_i\mid\boldsymbol\mu_j,\Sigma_j)}{\sum_l\pi_l\,\mathcal N(\mathbf x_i\mid\boldsymbol\mu_l,\Sigma_l)},
$$

$$
\text{M-step: }N_j=\sum_i\gamma_{ij},\quad \boldsymbol\mu_j=\frac1{N_j}\sum_i\gamma_{ij}\mathbf x_i,\quad \Sigma_j=\frac1{N_j}\sum_i\gamma_{ij}(\mathbf x_i-\boldsymbol\mu_j)(\mathbf x_i-\boldsymbol\mu_j)^\top,\quad \pi_j=\frac{N_j}{n}.
$$

The responsibilities $\gamma_{ij}$ are soft assignments. EM never decreases the likelihood and converges to a local maximum, so initialization matters (k-means output is a typical starting point). Relative to k-means, a GMM captures elliptical clusters through $\Sigma_j$, gives uncertainty for points between clusters, and works as a density model. If you fix $\Sigma_j=\sigma^2I$, equal weights, and let $\sigma\to0$, the E-step becomes a hard assignment and EM reduces to Lloyd's algorithm. Watch for collapse: a component centered on one point with shrinking variance sends the likelihood to infinity, so add a small variance floor. Unlike $J$, the likelihood penalized by BIC can compare different $k$.

## 5. DBSCAN

DBSCAN needs a radius $\varepsilon$ and a count $m$ (minPts). A point is a core point if at least $m$ points (itself included) lie within $\varepsilon$. A cluster is a maximal set of core points reachable from each other through chains of core points, plus the border points within $\varepsilon$ of a core point. Everything else is noise (label $-1$).

It finds arbitrary shapes such as rings and crescents, labels outliers explicitly, and the number of clusters falls out. The weak points are the two parameters and a single global density: clusters of very different density cannot both be right for one $\varepsilon$. A usual recipe sets $m\approx2d$ or higher, then plots the sorted distance to each point's $m$-th nearest neighbor and sets $\varepsilon$ at the knee of that curve. HDBSCAN removes the single-$\varepsilon$ limitation by working across a range of scales. Distances also degrade in high dimensions, so DBSCAN is best run after dimensionality reduction ([[notes/ml/dimensionality-reduction|Dimensionality Reduction]]).

## 6. Hierarchical Clustering

Agglomerative clustering starts with every point as its own cluster and repeatedly merges the closest pair, producing a dendrogram you can cut at any height. The linkage rule defines "closest": single (minimum pairwise distance, prone to chaining), complete (maximum), average, or Ward (merge that adds the least within-cluster variance, which behaves like k-means). It needs no $k$ up front and yields a whole hierarchy, but costs $O(n^2)$ memory in the plain version, so it suits thousands of points, not millions.

> [!warning] Common mistake
> Running k-means on raw features with mixed units (income in euros, age in years) and calling the result meaningful. Distances are dominated by the largest-scale feature. Standardize, or use a metric that fits the data.

## Related

- [[notes/ml/dimensionality-reduction|Dimensionality Reduction (PCA, t-SNE, UMAP)]]: reduce dimensions before clustering, and why clusters in a t-SNE plot need care
- [[notes/ml/evaluation-metrics|Evaluation Metrics]]: how clustering is scored when labels do exist
- [[notes/ml/embeddings|Embeddings]]: clustering learned vectors is the usual way to group text or images
- [[notes/ml/generative-models|Generative Models (VAE, GAN, Diffusion)]]: the GMM is the simplest latent-variable generative model
- [[notes/ml/decision-trees-and-ensembles|Decision Trees and Ensembles]]: the supervised counterpart for tabular data
- [[notes/lectures/mlp/09-vae|MLP L09: VAE]]: EM-style latent-variable thinking in a neural model
