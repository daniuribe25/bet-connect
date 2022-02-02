import { getGameModeFromMap, getPlacementSufix, uuidv4, getMapAndSquadSizeCopy, getUserPlatform } from 'helpers/common';
import { UserBetHistoryType } from 'helpers/pl-types';
import noAvatar from 'assets/images/noAvatar.png';

// TODO: refactor this file
const getTaskTitle = (type: string, value: number): string => {
  switch (type) {
    case 'MAIN':
      return `Get ${value} Kills (team total)`;
    case 'KILLS':
      return `Get ${value} Kills (team total)`;
    case 'DAMAGE':
      return `${value} damage (team total)`;
    case 'PLACEMENT':
      return `Place ${value}${getPlacementSufix(value)}`;
    case 'MATCH':
      return `Finish 1st`;
    default:
      return '';
  }
};

const getTaskSubtitle = (type: string): string => {
  switch (type) {
    case 'MAIN':
    case 'KILLS':
      return 'or more';
    case 'PLACEMENT':
    case 'DAMAGE':
      return 'or better';
    default:
      return '';
  }
};

const buildHistory = (data: UserBetHistoryType[]): Array<any> => {
  const result: Array<any> = [];
  data.forEach((row) => {
    const history = {
      id: row.id,
      game: getMapAndSquadSizeCopy(getGameModeFromMap(row.map), row.team.squadSize),
      date: row.insertedAt,
      state: row.status,
      resultMatchCodId: row.resultMatchCodId,
      team: null,
      tasks: null,
      gameMode: getGameModeFromMap(row.map),
      map: row.map,
      userStats: row.userStats,
      lobbyStats: row.lobbyStats,
    };
    const team: Array<any> = [];
    const tasks: Array<any> = [];
    row.team?.teammates.forEach((tm) => {
      const mate: any = {
        photo_url: noAvatar,
        name: getUserPlatform(tm.user).username
      };
      team.push(mate);
    });
    row.requiredResult?.forEach((t) => {
      const task: any = {
        id: uuidv4(),
        won: t.won,
        type: t.type,
        betAmount: t.betAmount,
        returnAmount: t.rewardedAmount + t.betAmount,
        title: getTaskTitle(t.type, t.value),
        subtitle: getTaskSubtitle(t.type),
        added: true,
        goal: t.value,
        payout: t.rewardedAmount,
      };
      tasks.push(task);
    });
    history.team = team as any;
    history.tasks = tasks as any;
    result.push(history);
  });

  return result;
};

export default buildHistory;
