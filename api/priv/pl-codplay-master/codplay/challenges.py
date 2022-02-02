from .utils import get_df
from .estimator import compute_prob, compute_payouts, compute_placements

import numpy as np
import pandas as pd


class Kills(object):
    def __init__(self, selected_players, multiplier):
        self.selected_players = selected_players
        self.multiplier = multiplier
        self.squad_stats = self.summary_statistics()
        self.expected_kills = self._compute_expected_kills()

    def summary_statistics(self):
        squad_stats = {}
        for player in self.selected_players:
            kills = player['data']['Kills']
            squad_stats[player['name']] = {
                'average': np.average(kills),
                'stdev': np.std(kills)
            }
        return squad_stats

    def compute_odds(self):
        # compute odds/payouts for the entire squad
        df = {
            'Kills': [],
            'Prob': [],
            'Total_Payout': [],
            'Net_Payout': []
        }

        lower = len(self.selected_players)
        upper = len(self.selected_players) * 5

        for kill_line in range(lower, upper):
            prob = compute_prob(
                kill_line,
                self.squad_stats)
            total_payout, net_payout = compute_payouts(prob, self.multiplier)
            # collect stats into a dataframe
            df['Kills'].append(kill_line)
            df['Prob'].append(prob)
            df['Total_Payout'].append(total_payout)
            df['Net_Payout'].append(net_payout)
        return pd.DataFrame(df)

    def _compute_expected_kills(self):
        return np.sum([stat['average'] for stat in self.squad_stats.values()])


class Damages(object):
    def __init__(self, selected_players, multiplier):
        self.selected_players = selected_players
        self.multiplier = multiplier
        self.squad_stats = self.summary_statistics()
        self.expected_damages = self._compute_expected_damages()

    def summary_statistics(self):
        squad_stats = {}
        for player in self.selected_players:
            damage = player['data']['Damage']
            squad_stats[player['name']] = {
                'average': np.average(damage),
                'stdev': np.std(damage)}
        return squad_stats

    def compute_odds(self):
        df = {
            'Expected_Damage': [],
            'Prob': [],
            'Total_Payout': [],
            'Net_Payout': []
        }

        lower = int(self.expected_damages * .95)
        upper = int(self.expected_damages * 1.05)
        for expected_damage in np.linspace(lower, upper, 10):
            prob = compute_prob(
                expected_damage,
                self.squad_stats)
            total_payout, net_payout = compute_payouts(prob, self.multiplier)

            # collect stats into a dataframe
            df['Expected_Damage'].append(int(expected_damage))
            df['Prob'].append(prob)
            df['Total_Payout'].append(total_payout)
            df['Net_Payout'].append(net_payout)
        return pd.DataFrame(df)

    def _compute_expected_damages(self):
        return np.sum([stat['average'] for stat in self.squad_stats.values()])


class Placement(object):
    def __init__(self, selected_players, multiplier):
        self.selected_players = selected_players
        self.multiplier = multiplier

    def compute_odds(self):
        df = {
            'Placement': [],
            'Prob': [],
            'Total_Payout': [],
            'Net_Payout': []
        }

        for placement in range(1, 26):
            prob = compute_placements(
                placement,
                self.selected_players)
            total_payout, net_payout = compute_payouts(prob, self.multiplier)

            # collect stats into a dataframe
            df['Placement'].append(placement)
            df['Prob'].append(prob)
            df['Total_Payout'].append(total_payout)
            df['Net_Payout'].append(net_payout)
        return pd.DataFrame(df)
