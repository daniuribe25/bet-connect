# Codplay
A tool for processing players match data into bet probabilities, original code at pl-codplay

# In order to run the main files, you must send data something like this
python3 main.py '{ "bet": 2.5,"players": [{"data": [{"Damage": 1556, "Kills": 7, "Placement": 6}], "name": "PLZach"}]}'

# Basic about the code
## Clasess
in challenges.py there are 3 classes
- Kills
- Damages
- Placement
Each class has is own compute_ods method but their basically using an average and standard deviation to get the probabilities.
