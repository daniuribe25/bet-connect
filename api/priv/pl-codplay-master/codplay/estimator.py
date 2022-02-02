from .utils import get_df

import pandas as pd
from numpy.random import beta
import re
import numpy as np
from typing import List
import scipy.stats


def compute_prob(line: int, stats: dict):
    """Compute the probability of a line.

    Constructs a joint normal distribution, which yields the probability.
    """
    total_mean = []
    total_std = []
    for k, v in stats.items():
        total_mean.append(v['average'])
        total_std.append(v['stdev'])
    mu = np.sum(total_mean)
    sigma = np.sqrt(np.sum(total_std))
    return 1 - scipy.stats.norm(mu, sigma).cdf(line)


def compute_payouts(prob: float, bet: float):
    """Compute payouts from probabilities.

    For example, if p(win) is 25%, then the payout should be 1/0.25, or 4x.
    """
    total = (1 / prob) * bet
    net = total - bet
    return total, net


def compute_placements(k: int, players) -> float:
    """Compute p(placing at least kth).
    """
    placements = []  # list of placements for all players in the squad

    for player in players:
        df = player['data']['Placement']
        placements += list(df.values)

    success = len(set([x for x in placements if x <= k]))
    fails = np.sum([1 for x in placements if x > k])

    prior_alpha = 1
    prior_beta = 1

    # Calculate Posterior := Likelihood * Prior
    samples = beta(a=prior_alpha + success, b=prior_beta + fails, size=10000)

    # prob(top K)
    placed = 0
    for i in range(1000):
        placed += np.random.choice(samples)

    return placed/1000  # need to rescale
