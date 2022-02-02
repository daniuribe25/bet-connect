import argparse
import json
import pandas as pd
from codplay.challenges import Kills, Damages, Placement

parser = argparse.ArgumentParser(
    description="Given the json file return proccessed results")

parser.add_argument("data")

args = parser.parse_args()


def normalize_players(players):
    players = []

    for player in data['players']:
        name = player['name']
        player_data = player['data']

        df = pd.json_normalize(player_data)

        df = df[['Kills', 'Damage', 'Placement']]

        players.append({
            'name': name,
            'data': df
        })

    return players


def get_bet_probabilities(players, multiplier):
    kill = Kills(players, multiplier)
    placement = Placement(players, multiplier)
    damage = Damages(players, multiplier)

    kill_odds = kill.compute_odds().to_dict()
    kill_odds["Kills"] = list(kill_odds["Kills"].values())
    del kill_odds["Prob"]
    del kill_odds["Total_Payout"]
    del kill_odds["Net_Payout"]

    placement_odds = placement.compute_odds().to_dict()
    placement_result = list(
        placement_odds["Placement"].values())
    placement_result.reverse()
    placement_odds["Placement"] = placement_result
    del placement_odds["Prob"]
    del placement_odds["Total_Payout"]
    del placement_odds["Net_Payout"]

    damage_odds = damage.compute_odds().to_dict()
    damage_odds["Expected_Damage"] = list(
        damage_odds["Expected_Damage"].values())
    del damage_odds["Prob"]
    del damage_odds["Total_Payout"]
    del damage_odds["Net_Payout"]

    return {
        'kills': {
            'expected_kills': kill.expected_kills,
            'odds': kill_odds
        },
        'placements': {
            'odds': placement_odds
        },
        'damage': {
            'expected_damage': damage.expected_damages,
            'odds': damage_odds
        }
    }


if not args.data:
    print("Data not given, make sure you give us data to work with")
else:
    # do my stuff
    data = json.loads(args.data)

    game_bet = data['bet']

    players = normalize_players(data['players'])

    # this is the only thing to investigate
    probabilities = get_bet_probabilities(players, game_bet)

    print(json.dumps(probabilities))
