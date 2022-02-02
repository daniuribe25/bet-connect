const updateScoreboardTeamsDisplayed = (teams) => {
  const usersTeamIndex = teams.findIndex((team) => team.isUsersTeam === true);

  if (usersTeamIndex === -1) {
    return teams.slice(0, 3);
  }

  const twoInFrontOfUser = usersTeamIndex - 2;
  const twoBehind = usersTeamIndex + 2;

  if (usersTeamIndex === 0) {
    return teams.slice(0, 3);
  }

  if (usersTeamIndex === 1) {
    return teams.slice(0, 4);
  }

  return teams.slice(twoInFrontOfUser, twoBehind + 1);
}

export default updateScoreboardTeamsDisplayed;
