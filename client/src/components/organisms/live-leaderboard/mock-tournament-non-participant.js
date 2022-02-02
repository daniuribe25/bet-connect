const mockTournament = {
  "id": 14,
  "description": "pre edit2",
  "tournamentConfigId": 18,
  "tournamentStatusLastUpdated": "2022-01-10T19:08:46.634Z",
  "payoutStatus": "PENDING",
  "tournamentStatusId": 6,
  "tournamentConfig": {
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
  "tournamentStatus": "STARTED",
  "tournamentTeams": [],
  "divisions": [
    {
      "id": 15,
      "divisionNumber": 2,
      "divisionTeams": [
        {
          "id": 4,
          "teamId": "1234",
          "tournamentId": "14",
          "isDeleted": false,
          "payoutObject": { value: 1000, type: 'currency', isApproved: false },
          "placement": 1,
          "teamName": "McKenzie's team",
          "skillRating": 5,
          "teamPrimaryMetricTotal": 123,
          "teamSecondaryMetricTotal": null,
          "tournamentTeamUser": [],
          "isUsersTeam": false,
          "teamIsInTheMoney": true,
        },
        {
          "id": 7,
          "teamId": "5673",
          "tournamentId": "14",
          "isDeleted": false,
          "payoutObject": { value: 500, type: 'currency', isApproved: false },
          "placement": 2,
          "teamName": "Zach's team",
          "skillRating": 7,
          "teamPrimaryMetricTotal": 98,
          "teamSecondaryMetricTotal": null,
          "tournamentTeamUser": [],
          "isUsersTeam": false,
          "teamIsInTheMoney": true,
        },
        {
          "id": 9,
          "teamId": "56421345123",
          "tournamentId": "14",
          "isDeleted": false,
          "payoutObject": { value: 250, type: 'currency', isApproved: false },
          "placement": 3,
          "teamName": "Tucker's team",
          "skillRating": 8,
          "teamPrimaryMetricTotal": 87,
          "teamSecondaryMetricTotal": null,
          "tournamentTeamUser": [],
          "isUsersTeam": false,
          "teamIsInTheMoney": true,
        },
        {
          "id": 5,
          "teamId": "67456",
          "tournamentId": "14",
          "isDeleted": false,
          "payoutObject": { value: 100, type: 'currency', isApproved: false },
          "placement": 4,
          "teamName": "Jordan's team",
          "skillRating": 3,
          "teamPrimaryMetricTotal": 86,
          "teamSecondaryMetricTotal": null,
          "tournamentTeamUser": [],
          "isUsersTeam": false,
          "teamIsInTheMoney": true,
        },
        {
          "id": 6,
          "teamId": "455345",
          "tournamentId": "14",
          "isDeleted": false,
          "payoutObject": null,
          "placement": 5,
          "teamName": "Austin's team",
          "skillRating": 3,
          "teamPrimaryMetricTotal": 76,
          "teamSecondaryMetricTotal": null,
          "tournamentTeamUser": [],
          "isUsersTeam": false,
          "teamIsInTheMoney": false,
        },
        {
          "id": 8,
          "teamId": "345435",
          "tournamentId": "14",
          "isDeleted": false,
          "payoutObject": null,
          "placement": 6,
          "teamName": "Marcus' team",
          "skillRating": 4,
          "teamPrimaryMetricTotal": 65,
          "teamSecondaryMetricTotal": null,
          "tournamentTeamUser": [],
          "isUsersTeam": false,
          "teamIsInTheMoney": false,
        },
        {
          "id": 10,
          "teamId": "43545",
          "tournamentId": "14",
          "isDeleted": false,
          "payoutObject": null,
          "placement": 7,
          "teamName": "Jacob's team",
          "skillRating": 1,
          "teamPrimaryMetricTotal": 56,
          "teamSecondaryMetricTotal": null,
          "tournamentTeamUser": [],
          "isUsersTeam": false,
          "teamIsInTheMoney": false,
        },
        {
          "id": 13,
          "teamId": "Franky",
          "tournamentId": "14",
          "isDeleted": false,
          "payoutObject": null,
          "placement": 8,
          "teamName": "Amrit's team",
          "skillRating": 0,
          "teamPrimaryMetricTotal": 45,
          "teamSecondaryMetricTotal": null,
          "tournamentTeamUser": [],
          "isUsersTeam": false,
          "teamIsInTheMoney": false,
        }
      ]
    },
  ],
  "userFlag": false,
  "totalTeams": 11
}

export default mockTournament;
