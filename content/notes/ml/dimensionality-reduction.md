---
title: "Dimensionality Reduction (PCA, t-SNE, UMAP)"
tags:
  - machine-learning
  - unsupervised-learning
  - visualization
date: 2026-11-05
---

Dimensionality reduction maps high-dimensional data into a few dimensions, either to compress it or to look at it. PCA is linear, exact and interpretable. t-SNE and UMAP are nonlinear and built for 2D or 3D pictures of neighborhood structure. The three get used interchangeably in blog posts, but they answer different questions, and the most common mistake is reading a t-SNE plot as if it were a scatter plot with meaningful axes and distances.

## Mental Model

- PCA finds the orthogonal directions of greatest variance. It is a rotation plus truncation, and everything about it follows from the SVD.
- The quantity PCA preserves is variance, so it is sensitive to feature scaling and blind to nonlinear structure.
- t-SNE and UMAP preserve neighborhoods: points close in the original space should end up close in the picture. They do not preserve global distances or densities.
- In a t-SNE or UMAP plot, the axes mean nothing, cluster sizes mean little, and gaps between clusters mean little.
- Always check an embedding against something independent: a PCA, a different seed, a different perplexity, or labels you trust.

## 1. PCA via the SVD

Center the data matrix $X\in\mathbb R^{n\times d}$ (subtract each column's mean) and take the singular value decomposition

$$
X_c=U\Sigma V^\top .
$$

The columns of $V$ are the principal directions, in order of decreasing variance. The variance along the $i$-th direction is $\sigma_i^2/(n-1)$, which is also the $i$-th eigenvalue of the covariance matrix $\frac1{n-1}X_c^\top X_c$. Projecting onto the first $k$ directions gives the embedding $Z=X_cV_k=U_k\Sigma_k$.

The fraction of variance kept is the explained variance ratio $\sum_{i\le k}\sigma_i^2/\sum_i\sigma_i^2$. By the Eckart-Young theorem, the rank-$k$ truncation is the best rank-$k$ approximation in squared error, so the mean squared reconstruction error equals the sum of the discarded variances. Pick $k$ from a cumulative explained-variance curve (for example, enough components for 90% to 95%) or from a visible drop in the scree plot. Use SVD directly rather than forming the covariance matrix, which squares the condition number.

PCA is sensitive to scale. If one column is in millimeters and another in kilometers, the large-numbered column dominates. Standardize unless the units are comparable by design.

## 2. A Worked 2D Example

Generate 500 points with standard deviation 3 along one axis and 0.5 along the other, rotate by 30 degrees and shift by $(5,-2)$.

```python
import numpy as np

rng = np.random.default_rng(0)
Z = rng.normal(size=(500, 2)) * [3.0, 0.5]             # long axis std 3, short axis std 0.5
th = np.pi / 6
R = np.array([[np.cos(th), -np.sin(th)], [np.sin(th), np.cos(th)]])
X = Z @ R.T + [5, -2]

Xc = X - X.mean(0)
U, S, Vt = np.linalg.svd(Xc, full_matrices=False)
var = S**2 / (len(X) - 1)
print("components (rows):\n", Vt.round(3))
print("variances:", var.round(3), "explained ratio:", (var / var.sum()).round(4))
proj = Xc @ Vt[0]                                      # 1-D embedding
recon = np.outer(proj, Vt[0]) + X.mean(0)
print("reconstruction MSE:", ((X - recon) ** 2).sum(1).mean().round(4), " = discarded variance", var[1].round(4))
```

Running this gives the first component $(-0.865,-0.501)$, which is the 30-degree direction $(\cos30^\circ,\sin30^\circ)=(0.866,0.5)$ with the sign flipped (the sign of a component is arbitrary). The variances are $8.738$ and $0.234$, close to the true $3^2=9$ and $0.5^2=0.25$, and the explained variance ratios are $97.39\%$ and $2.61\%$. Projecting to one dimension keeps 97.4% of the variance, and the reconstruction error per point is $0.234$, which equals the discarded variance, as the theory says.

> [!tip] Intuition
> PCA fits an ellipse to the cloud and reports its axes. The long axis is component 1. Throwing away the short axis squashes the ellipse onto a line, and what you lose is its thickness.

## 3. Kernel PCA

Linear PCA cannot unroll a spiral or separate concentric rings. Kernel PCA maps points implicitly into a feature space through a kernel $k(\mathbf x,\mathbf x')$ (for example the RBF kernel $e^{-\gamma\lVert\mathbf x-\mathbf x'\rVert^2}$) and does PCA there. In practice you build the $n\times n$ kernel matrix, center it, and take its top eigenvectors, so the cost grows with $n^2$ in memory and roughly $n^3$ in time for a full decomposition. Mapping a point back from the embedding to input space (the pre-image problem) is only approximate. The kernel bandwidth $\gamma$ is a tuning knob with no universal default.

## 4. t-SNE

t-SNE (van der Maaten and Hinton, 2008) turns distances into neighbor probabilities. In the original space, point $j$ is a neighbor of $i$ with probability $p_{j\mid i}\propto\exp(-\lVert\mathbf x_i-\mathbf x_j\rVert^2/2\sigma_i^2)$, where the bandwidth $\sigma_i$ is chosen per point so that the distribution has a fixed perplexity. In the low-dimensional map it uses a heavy-tailed Student-t kernel, $q_{ij}\propto(1+\lVert\mathbf y_i-\mathbf y_j\rVert^2)^{-1}$, and moves the points by gradient descent to minimize $\mathrm{KL}(P\Vert Q)$.

Perplexity is roughly the effective number of neighbors each point considers. Typical values are 5 to 50, and it should be smaller than the number of points. Low values emphasize very local structure and can shatter real clusters into fragments. High values merge detail and approach a blur.

What the picture does and does not mean:

- Near points in the map were probably near in the data, because KL penalizes placing true neighbors far apart. The reverse is weaker: two clusters that look separate might be neighbors in the data.
- Distances between clusters are not reliable. The heavy tails let t-SNE push groups apart, so the gap between two clusters carries almost no information.
- Cluster size and density are not preserved, since the per-point bandwidth normalizes density away.
- Different seeds give different layouts, and random noise can look like structure at some perplexities (Wattenberg and colleagues, 2016, make this point well with simple examples).

## 5. UMAP

UMAP (McInnes, Healy and Melville, 2018) builds a weighted $k$-nearest-neighbor graph, interpreted as a fuzzy topological structure, and then optimizes a low-dimensional layout whose graph is as similar as possible under a cross-entropy loss. Two parameters matter. `n_neighbors` sets how local the structure is, and `min_dist` sets how tightly points may pack in the map. It is generally much faster than t-SNE, scales to larger datasets, can embed new points with a fitted model, and often shows more global arrangement. The same caution applies, though: global layout is better than in t-SNE but is still not a distance-preserving map, and cluster spacing and size are not quantitative.

## 6. Pitfalls When Reading Embeddings

- Run PCA first (to 30 to 50 dimensions) before t-SNE or UMAP on very high-dimensional data. It cuts noise and cost.
- Vary perplexity or `n_neighbors` and the random seed. A structure that survives these changes is more believable.
- Do not run a clustering algorithm on the 2D map and treat the clusters as findings. Cluster in the original or PCA space and use the map to display the result ([[notes/ml/clustering|Clustering]]).
- Do not measure anything with a ruler on a t-SNE plot: no distances, areas or axis directions.
- Scale features before any of these methods, as distances drive all of them.
- A label coloring can make an embedding look cleaner than it is. Check class separability with a quick classifier on the original features.

> [!warning] Common mistake
> Comparing two t-SNE plots made with different perplexities or seeds, then reading differences as real. Stay with one fixed setting for a comparison.

## Related

- [[notes/ml/clustering|Clustering (k-means, GMM, DBSCAN)]]: cluster before or after reducing dimensions, and why order matters
- [[notes/ml/embeddings|Embeddings]]: the vectors people usually visualize with t-SNE or UMAP
- [[notes/ml/linear-and-logistic-regression|Linear and Logistic Regression]]: the least-squares geometry behind PCA's projection
- [[notes/ml/generative-models|Generative Models (VAE, GAN, Diffusion)]]: learned nonlinear latent spaces, the neural cousin of PCA
- [[notes/lectures/mlp/09-vae|MLP L09: VAE]]: a VAE as nonlinear dimensionality reduction with a probabilistic latent space
- [[notes/lectures/foundationmodels/02-ml-basics|Foundation Models L02: ML Basics]]: representation learning in context
