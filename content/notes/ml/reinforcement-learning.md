---
title: "Reinforcement Learning"
tags:
  - machine-learning
  - reinforcement-learning
date: 2026-11-05
---

Reinforcement learning (RL) trains an agent from rewards instead of labelled examples. The agent acts, the environment answers with a new state and a reward, and the agent has to learn which actions pay off over the long run, including actions whose reward arrives many steps later. RL covers game-playing agents, robot control, and the final stage of training for chat models (RLHF). The core of it fits in a few equations, and a gridworld is enough to see them working.

## Mental Model

- The world is a Markov decision process: the next state and reward depend only on the current state and action.
- The goal is to maximize the discounted return, not the next reward. The discount $\gamma$ says how much the future counts.
- Value functions estimate the expected return from a state (or state and action). Bellman equations relate the value of a state to the values of its successors, and that recursion is what makes learning possible.
- Value-based methods (Q-learning) learn $Q$ and act greedily on it. Policy-gradient methods (REINFORCE, PPO) adjust the policy directly.
- Exploration is part of the problem: an agent that only exploits what it already knows never finds better options.

## 1. Markov Decision Processes and Returns

An MDP is a tuple $(S, A, P, R, \gamma)$: states, actions, transition probabilities $P(s' \mid s, a)$, rewards, and a discount factor $\gamma \in [0, 1)$. A policy $\pi(a \mid s)$ gives the probability of each action in each state. The return from time $t$ is

$$
G_t = r_{t+1} + \gamma r_{t+2} + \gamma^2 r_{t+3} + \dots = \sum_{k=0}^{\infty} \gamma^k r_{t+k+1}.
$$

With $\gamma = 0.9$ and three rewards of 1, the return is $1 + 0.9 + 0.81 = 2.71$. A constant reward of 1 forever has return $1 / (1 - \gamma) = 10$. A $\gamma$ near 1 makes the agent far-sighted and the learning problem harder; a small $\gamma$ makes it greedy. Discounting also keeps infinite sums finite.

## 2. Value Functions and Bellman Equations

The state value $V^\pi(s) = \mathbb{E}_\pi[G_t \mid s_t = s]$ and the action value $Q^\pi(s, a) = \mathbb{E}_\pi[G_t \mid s_t = s, a_t = a]$ satisfy a recursion:

$$
V^\pi(s) = \sum_a \pi(a \mid s) \sum_{s'} P(s' \mid s, a)\big[r(s, a, s') + \gamma V^\pi(s')\big].
$$

The best achievable values satisfy the Bellman optimality equation

$$
Q^*(s, a) = \sum_{s'} P(s' \mid s, a)\big[r + \gamma \max_{a'} Q^*(s', a')\big],
$$

and the optimal policy is greedy with respect to $Q^*$. If you know $P$ you can solve these by iterating the equation (dynamic programming). Model-free methods learn from sampled experience instead.

## 3. Q-Learning on a Gridworld

Q-learning (Watkins, 1989) keeps a table $Q(s, a)$ and nudges each entry toward a one-step bootstrap target after every transition:

$$
Q(s, a) \leftarrow Q(s, a) + \alpha\Big(r + \gamma \max_{a'} Q(s', a') - Q(s, a)\Big).
$$

It is off-policy: the target uses the greedy action even though the agent behaved $\varepsilon$-greedily (random action with probability $\varepsilon$, otherwise the best known). The grid below is the classic 3x4 example: start at the bottom left, a wall in the middle, +1 for reaching the top-right cell, -1 for the cell below it, and a step cost of -0.04. Moves are deterministic and bumping into a wall leaves the agent in place.

```python
import numpy as np

R, C, wall = 3, 4, {(1, 1)}
term = {(0, 3): 1.0, (1, 3): -1.0}
moves = [(-1, 0), (1, 0), (0, -1), (0, 1)]          # up, down, left, right

def step(s, a):
    n = (s[0] + moves[a][0], s[1] + moves[a][1])
    if not (0 <= n[0] < R and 0 <= n[1] < C) or n in wall:
        n = s
    return (n, term[n], True) if n in term else (n, -0.04, False)

rng = np.random.default_rng(0)
Q = np.zeros((R, C, 4))
gamma, alpha, eps = 0.9, 0.5, 0.2
for episode in range(2000):
    s = (2, 0)
    for _ in range(100):
        a = rng.integers(4) if rng.random() < eps else int(Q[s].argmax())
        s2, r, done = step(s, a)
        Q[s][a] += alpha * (r + (0 if done else gamma * Q[s2].max()) - Q[s][a])
        s = s2
        if done:
            break

arrows = "^v<>"
for i in range(R):
    print(" ".join("#" if (i, j) in wall else "G" if (i, j) == (0, 3) else "X" if (i, j) == (1, 3)
                   else arrows[Q[i, j].argmax()] for j in range(C)))
print(np.round(Q.max(-1), 2))
```

Running it prints the greedy policy

```text
> > > G
^ # ^ X
^ > ^ <
```

and state values of 0.73, 0.86 and 1.0 along the top row, 0.62 and 0.86 in the middle row, and 0.52, 0.62, 0.73, 0.62 along the bottom. The values agree with working backwards by hand: the cell next to the goal is worth $1.0$ (no step cost on the final move), the one before it $-0.04 + 0.9 \cdot 1.0 = 0.86$, then $-0.04 + 0.9 \cdot 0.86 = 0.734$. Every arrow leads along a shortest path to the goal and none steps onto the -1 cell. From the bottom right the agent walks left and then up.

## 4. Policy Gradients and REINFORCE

When the action space is large or continuous, a table is impossible. Instead parameterize the policy $\pi_\theta(a \mid s)$ and ascend the expected return $J(\theta)$. The policy gradient theorem gives

$$
\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta}\Big[\sum_t \nabla_\theta \log \pi_\theta(a_t \mid s_t)\; G_t\Big].
$$

REINFORCE (Williams, 1992) estimates this from sampled episodes: raise the log-probability of each action in proportion to the return that followed it. The estimate has high variance, so one subtracts a baseline $b(s)$, typically a learned value function, replacing $G_t$ by an advantage $A_t = G_t - b(s_t)$. Subtracting a function of the state does not bias the gradient. A learned baseline is the starting point of actor-critic methods.

## 5. PPO

Plain policy gradients can take a step that wrecks the policy, and the data collected by the old policy is then useless. Proximal policy optimization (Schulman et al., 2017) lets you reuse a batch for several gradient steps while limiting how far the policy moves. With the probability ratio $\rho_t(\theta) = \pi_\theta(a_t \mid s_t) / \pi_{\theta_{old}}(a_t \mid s_t)$, the clipped objective is

$$
L^{CLIP}(\theta) = \mathbb{E}_t\Big[\min\big(\rho_t A_t,\ \text{clip}(\rho_t, 1 - \epsilon, 1 + \epsilon)\, A_t\big)\Big]
$$

with $\epsilon = 0.2$ a common default.

> [!example] Worked example
> Let $\epsilon = 0.2$ and $\rho = 1.5$. With a positive advantage $A = 2$ the terms are $1.5 \cdot 2 = 3.0$ and $1.2 \cdot 2 = 2.4$, the minimum is 2.4, and since that is the clipped constant the gradient is zero: the action is already more likely than it should be, so there is no more push. With $A = -2$ the terms are $-3.0$ and $-2.4$, the minimum is $-3.0$ (unclipped), so the gradient still pushes the probability back down. The objective is pessimistic: it never rewards moving further than the clip range in the helpful direction, but it fully penalizes a harmful move.

In practice PPO adds a value-function loss and often an entropy bonus, and uses generalized advantage estimation to compute $A_t$.

## 6. RLHF in One Section

Reinforcement learning from human feedback (Christiano et al., 2017; applied to language models in InstructGPT, Ouyang et al., 2022) has three steps:

1. Start from a pretrained model and fine-tune it on demonstrations (supervised fine-tuning).
2. Collect human comparisons between pairs of responses and fit a reward model $r_\phi(x, y)$ with a Bradley-Terry loss, $-\log \sigma\big(r_\phi(x, y_w) - r_\phi(x, y_l)\big)$, where $y_w$ is the preferred response.
3. Optimize the policy with PPO to maximize $r_\phi(x, y) - \beta \, D_{KL}(\pi_\theta \Vert \pi_{ref})$. The KL penalty to the supervised model stops the policy from drifting into text that fools the reward model.

Direct preference optimization (Rafailov et al., 2023) folds steps 2 and 3 into a single supervised loss on the preference pairs, with no explicit reward model and no sampling loop.

## Related

- [[notes/lectures/mlp/11-rl|MPL 11: Reinforcement Learning]], the lecture this page condenses
- [[notes/ml/gradient-descent-and-optimizers|Gradient Descent and Optimizers]], since policy gradients are stochastic gradient ascent on $J$
- [[notes/ml/fine-tuning-and-lora|Fine-Tuning and LoRA]], where RLHF-style tuning is often combined with parameter-efficient methods
- [[notes/ml/attention-and-transformers|Attention and Transformers]], the policy network in RLHF
- [[notes/ml/pytorch-training-loop|The PyTorch Training Loop]], for the surrounding optimization machinery
- [[notes/ml/evaluation-metrics|Evaluation Metrics]], since RL reward curves need the same care about variance and seeds
