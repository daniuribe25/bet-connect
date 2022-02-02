const getTeamMode = (teamSize?: number): string => {
  switch(teamSize) {
    case (1):
      return 'Solos';
    case (2):
      return 'Duos';
    case (3):
      return 'Trios';
    case (4):
      return 'Quads';
    default:
      return 'Quads';
  }
}

export default getTeamMode;
