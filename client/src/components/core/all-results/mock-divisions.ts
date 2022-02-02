const mockTournament = {
  "id": 14,
  "description": "pre edit2",
  "tournamentConfigId": 18,
  "tournamentStatusLastUpdated": "2022-01-10T19:08:46.634Z",
  "payoutStatus": "PENDING",
  "tournamentStatusId": 6,
  "tournamentConfig": {
    "id": 18,
    "configJson": {
      "gameInfo": {
        "gameId": 1,
        "gameName": "Call Of Duty: Warzone",
        "gameModeId": 1,
        "gameModeName": "Verdansk",
        "gameModeOptions": {
          "teamSizes": [
            3
          ]
        }
      },
      "description": "pre edit2",
      "endDateTime": "2022-01-10T19:05:00.000Z",
      "startTypeId": 1,
      "desiredTeams": 3,
      "hasDivisions": true,
      "payoutTypeId": 1,
      "entryFeeValue": 50,
      "payoutAmounts": [
        {
          "value": 5,
          "placement": 1
        },
        {
          "value": 40,
          "placement": 2
        },
        {
          "value": 30,
          "placement": 2
        }
      ],
      "startDateTime": "2022-01-10T17:12:00.000Z",
      "entryFeeTypeId": 1,
      "scoringStyleId": 1,
      "prizeStyleTypeId": 1,
      "tournamentLength": 120,
      "minimumTotalTeams": 10,
      "maximumNumberTeams": 100,
      "totalPrizePool": 75,
      "startType": "variable",
      "entryFeeType": "currency",
      "payoutType": "currency",
      "scoringStyle": "Best 2 kills",
      "prizeStyle": "50/50",
      "prizeStyleDescription": "Everyone who finishes in the top half of the competition wins an equal share of the prize.",
      "scoringStyleDescription": "We add up the kills from your best two matches during the tournament to determine your overall score."
    },
    "isDeleted": false
  },
  "tournamentStatus": "CANCELLED",
  "divisions": [
    {
      "id": 15,
      "divisionNumber": 2,
      "divisionTeams": [
        {
          "id": 4,
          "teamId": "woo",
          "tournamentId": 14,
          "isDeleted": false,
          "payoutObject": { value: 100, isApproved: true, type: '' },
          "placement": 1,
          "teamName": "woo's team",
          "skillRating": 5,
          "teamPrimaryMetricTotal": 56,
          "teamSecondaryMetricTotal": null,
          "teamIsInTheMoney": true,
          "tournamentTeamUser": [
            {
              "id": 7,
              "userId": "woo",
              "playerHandle": "waaaaa",
              "balancePaid": false
            },
            {
              "id": 8,
              "userId": "melon",
              "playerHandle": "melon",
              "balancePaid": false
            },
            {
              "id": 9,
              "userId": "cheese",
              "playerHandle": "cheese",
              "balancePaid": false
            }
          ],
          "isUsersTeam": false
        },
        {
          "id": 7,
          "teamId": "ford",
          "tournamentId": 14,
          "isDeleted": false,
          "payoutObject": { value: 20, isApproved: true, type: '' },
          "placement": 2,
          "teamName": "ford's team",
          "skillRating": 7,
          "teamPrimaryMetricTotal": 23,
          "teamSecondaryMetricTotal": null,
          "teamIsInTheMoney": true,
          "tournamentTeamUser": [
            {
              "id": 16,
              "userId": "ford",
              "playerHandle": "ford",
              "balancePaid": false
            },
            {
              "id": 17,
              "userId": "marcus",
              "playerHandle": "marcus",
              "balancePaid": false
            },
            {
              "id": 18,
              "userId": "tucket",
              "playerHandle": "tucker",
              "balancePaid": false
            }
          ],
          "isUsersTeam": false
        },
        {
          "id": 9,
          "teamId": "sting",
          "tournamentId": 14,
          "isDeleted": false,
          "payoutObject": { value: 15, isApproved: true, type: '' },
          "placement": 3,
          "teamName": "string's team",
          "skillRating": 8,
          "teamPrimaryMetricTotal": 12,
          "teamSecondaryMetricTotal": null,
          "teamIsInTheMoney": true,
          "tournamentTeamUser": [
            {
              "id": 22,
              "userId": "sting",
              "playerHandle": "sting",
              "balancePaid": false
            },
            {
              "id": 23,
              "userId": "slash",
              "playerHandle": "slash",
              "balancePaid": false
            },
            {
              "id": 24,
              "userId": "colin",
              "playerHandle": "colin",
              "balancePaid": false
            }
          ],
          "isUsersTeam": true
        }
      ]
    },
    {
      "id": 14,
      "divisionNumber": 3,
      "divisionTeams": [
        {
          "id": 5,
          "teamId": "cook",
          "tournamentId": 14,
          "isDeleted": false,
          "payoutObject": { value: 20, isApproved: true, type: '' },
          "placement": 2,
          "teamName": "cook's team",
          "skillRating": 3,
          "teamPrimaryMetricTotal": 5,
          "teamSecondaryMetricTotal": null,
          "teamIsInTheMoney": true,
          "tournamentTeamUser": [
            {
              "id": 10,
              "userId": "cook",
              "playerHandle": "cook",
              "balancePaid": false
            },
            {
              "id": 11,
              "userId": "chef",
              "playerHandle": "chef",
              "balancePaid": false
            },
            {
              "id": 12,
              "userId": "griller",
              "playerHandle": "griller",
              "balancePaid": false
            }
          ],
          "isUsersTeam": false
        },
        {
          "id": 6,
          "teamId": "badook",
          "tournamentId": 14,
          "isDeleted": false,
          "payoutObject": { value: 55, isApproved: true, type: '' },
          "placement": 1,
          "teamName": "badook's team",
          "skillRating": 3,
          "teamPrimaryMetricTotal": 21,
          "teamSecondaryMetricTotal": null,
          "teamIsInTheMoney": true,
          "tournamentTeamUser": [
            {
              "id": 13,
              "userId": "badook",
              "playerHandle": "badook",
              "balancePaid": false
            },
            {
              "id": 14,
              "userId": "gerome",
              "playerHandle": "gerome",
              "balancePaid": false
            },
            {
              "id": 15,
              "userId": "john",
              "playerHandle": "john",
              "balancePaid": false
            }
          ],
          "isUsersTeam": false
        },
        {
          "id": 8,
          "teamId": "stephan",
          "tournamentId": 14,
          "isDeleted": false,
          "payoutObject": { value: 15, isApproved: true, type: '' },
          "placement": 3,
          "teamName": "stephan's team",
          "skillRating": 4,
          "teamPrimaryMetricTotal": 26,
          "teamSecondaryMetricTotal": null,
          "teamIsInTheMoney": true,
          "tournamentTeamUser": [
            {
              "id": 19,
              "userId": "stephan",
              "playerHandle": "stephan",
              "balancePaid": false
            },
            {
              "id": 20,
              "userId": "tarzan",
              "playerHandle": "tarzan",
              "balancePaid": false
            },
            {
              "id": 21,
              "userId": "aladin",
              "playerHandle": "aladin",
              "balancePaid": false
            }
          ],
          "isUsersTeam": false
        }
      ]
    },
    {
      "id": 13,
      "divisionNumber": 4,
      "divisionTeams": [
        {
          "id": 10,
          "teamId": "hercule",
          "tournamentId": 14,
          "isDeleted": false,
          "payoutObject": { value: 27, isApproved: true, type: '' },
          "placement": 2,
          "teamName": "hercule's team",
          "skillRating": 1,
          "teamPrimaryMetricTotal": 3,
          "teamSecondaryMetricTotal": null,
          "teamIsInTheMoney": true,
          "tournamentTeamUser": [
            {
              "id": 25,
              "userId": "hercule",
              "playerHandle": "hercule",
              "balancePaid": false
            },
            {
              "id": 26,
              "userId": "Apollo",
              "playerHandle": "Apollo",
              "balancePaid": false
            },
            {
              "id": 27,
              "userId": "zeus",
              "playerHandle": "zeus",
              "balancePaid": false
            }
          ],
          "isUsersTeam": false
        },
        {
          "id": 13,
          "teamId": "Franky",
          "tournamentId": 14,
          "isDeleted": false,
          "payoutObject": { value: 75, isApproved: true, type: '' },
          "placement": 1,
          "teamName": "Franky's team",
          "skillRating": 0,
          "teamPrimaryMetricTotal": 34,
          "teamSecondaryMetricTotal": null,
          "teamIsInTheMoney": true,
          "tournamentTeamUser": [
            {
              "id": 34,
              "userId": "Franky",
              "playerHandle": "Franky",
              "balancePaid": false
            },
            {
              "id": 35,
              "userId": "OnPc",
              "playerHandle": "OnPc",
              "balancePaid": false
            },
            {
              "id": 36,
              "userId": "InTenEighty",
              "playerHandle": "InTenEighty",
              "balancePaid": false
            }
          ],
          "isUsersTeam": false
        }
      ]
    },
    {
      "id": 16,
      "divisionNumber": 1,
      "divisionTeams": [
        {
          "id": 11,
          "teamId": "terry",
          "tournamentId": 14,
          "isDeleted": false,
          "payoutObject": { value: 50, isApproved: true, type: '' },
          "placement": 1,
          "teamName": "terry's team",
          "skillRating": 10,
          "teamPrimaryMetricTotal": 34,
          "teamSecondaryMetricTotal": null,
          "teamIsInTheMoney": true,
          "tournamentTeamUser": [
            {
              "id": 28,
              "userId": "terry",
              "playerHandle": "terry",
              "balancePaid": false
            },
            {
              "id": 29,
              "userId": "charles",
              "playerHandle": "charles",
              "balancePaid": false
            },
            {
              "id": 30,
              "userId": "Catwell",
              "playerHandle": "catwell",
              "balancePaid": false
            }
          ],
          "isUsersTeam": false
        },
        {
          "id": 12,
          "teamId": "harambe",
          "tournamentId": 14,
          "isDeleted": false,
          "payoutObject": { value: 20, isApproved: true, type: '' },
          "placement": 2,
          "teamName": "harambe's team",
          "skillRating": 17,
          "teamPrimaryMetricTotal": 20,
          "teamSecondaryMetricTotal": null,
          "teamIsInTheMoney": true,
          "tournamentTeamUser": [
            {
              "id": 31,
              "userId": "harambe",
              "playerHandle": "harambe",
              "balancePaid": false
            },
            {
              "id": 32,
              "userId": "Albie",
              "playerHandle": "albie",
              "balancePaid": false
            },
            {
              "id": 33,
              "userId": "Pinot",
              "playerHandle": "Pinot",
              "balancePaid": false
            }
          ],
          "isUsersTeam": false
        }
      ]
    }
  ],
  "userFlag": false,
  "totalTeams": 11
}

export default mockTournament;
