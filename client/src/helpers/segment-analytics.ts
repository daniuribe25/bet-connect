import { getBetAnte, getMapFromGameMode, getModeFromTeamSize } from './common';
import { CategoriesType, GameModes, UserPlayerTag } from './pl-types';

declare const analytics: any;

export const trackPage = (): void => {
  if (analytics) analytics.page();
};

export const trackIdentity = (user: any): void => {
  if (analytics)
    analytics.identify(user?.id, {
      phone: user?.phone,
      email: user?.email,
      privateProfile: user?.privateProfile,
      matchesCount: user?.matchesCount,
      ageVerified: user?.ageVerified,
    });
};

export const resetIdentity = (): void => {
  if (analytics) analytics.reset();
};

export const trackLogIn = (): void => {
  if (analytics) analytics.track('logged in');
};

export const trackLogOut = (): void => {
  if (analytics) analytics.track('logged out');
};

export const trackCreateTeam = (team: any): void => {
  if (analytics)
    analytics.track('created team', {
      team_id: team?.id,
      game: 'WZ',
      team_size: team?.teammates?.length,
      map: team?.probabilitiesCalculated?.gameMode,
    });
};

export const trackLeftTeam = (): void => {
  if (analytics) analytics.track('left team');
};

export const trackSwitchGameMode = (
  gameMode: GameModes,
  teamUsers: any,
  teamId: string,
): void => {
  const teamSize = teamUsers.filter((x: any) => x).length;
  if (analytics)
    analytics.track('switched game mode', {
      team_id: teamId,
      game: 'WZ',
      team_size: teamSize,
      map: getMapFromGameMode(gameMode),
      mode: getModeFromTeamSize(teamSize),
    });
};

export const trackPlacedBetCaptainAndTeam = (
  betHistory: any,
  pickedBets: any,
  bets: any,
  teamId: string | null,
  pickedCategory: CategoriesType,
  currentUser: any,
  teamUsers: any,
  gameMode: GameModes,
  ante: number,
  payout: number,
): void => {
  const teamMembers = teamUsers.filter((x: any) => x);

  const linesInfo = Object.entries(pickedBets).reduce(
    (acc: any, [bet, vals]: any) => {
      if (!vals.checked) return acc;
      const betKey = bet === 'killsPrizes' ? 'kills' : bet;
      const lineInfo =
        betKey === 'match'
          ? bets.match[0]
          : bets[betKey].find(
              (line: any) => line.level === pickedBets[bet].level,
            );
      return {
        ...acc,
        [`${betKey}_line`]: lineInfo?.goal,
        [`${betKey}_payout`]: lineInfo?.payout,
      };
    },
    {},
  );

  const teamMate = betHistory?.team?.teammates.find(
    (x: UserPlayerTag) => currentUser.id === x?.user?.id,
  );

  analytics.track('bet placed (user)', {
    bet_id: betHistory?.id,
    team_id: teamId,
    user_wallet_info: {
      balance_before: currentUser.wallet.funds,
      balance_after: teamMate?.user?.wallet?.funds,
    },
    game_info: {
      game: 'WZ',
      team_size: teamMembers.length,
      map: getMapFromGameMode(gameMode),
    },
    lines_info: linesInfo,
    high_level_info: {
      main_bet_format: getBetAnte(pickedCategory, true),
      lines_taken: Object.entries(pickedBets).reduce(
        (acc: any, [bet, vals]: any) => {
          if (!vals.checked) return acc;
          return [...acc, bet === 'killsPrizes' ? 'kills' : bet];
        },
        [],
      ),
      total_amount_bet: ante.toFixed(2),
      total_possible_payout: (ante + payout).toFixed(2),
    },
  });

  analytics.track('bet placed (team)', {
    bet_id: betHistory?.id,
    team_id: teamId,
    user_wallet_info: {
      balance_before: teamMembers.reduce(
        (acc: any, us: UserPlayerTag) => acc + us.user?.wallet?.funds,
        0,
      ),
      balance_after: betHistory?.team?.teammates.reduce(
        (acc: any, us: UserPlayerTag) => acc + us.user?.wallet?.funds,
        0,
      ),
    },
    game_info: {
      game: 'WZ',
      team_size: teamMembers.length,
      map: getMapFromGameMode(gameMode),
    },
    lines_info: linesInfo,
    high_level_info: {
      main_bet_format: getBetAnte(pickedCategory, true),
      lines_taken: Object.entries(pickedBets).reduce(
        (acc: any, [bet, vals]: any) => {
          if (!vals.checked) return acc;
          return [...acc, bet === 'killsPrizes' ? 'kills' : bet];
        },
        [],
      ),
      total_amount_bet: (ante * teamMembers.length).toFixed(2),
      total_possible_payout: ((ante + payout) * teamMembers.length).toFixed(2),
    },
  });
};

export const trackPlacedBetTeamMembers = (
  betHistory: any,
  teamId: string | null,
  pickedCategory: CategoriesType,
  currentUser: any,
  teamUsers: any,
  ante: number,
  payout: number,
): void => {
  const teamMembers = teamUsers.filter((x: any) => x);

  const linesInfo = betHistory.requiredResult.reduce(
    (acc: any, curr: any) => ({
      ...acc,
      [`${curr.type.toLowerCase()}_line`]: curr.betAmount,
      [`${curr.type.toLowerCase()}_payout`]: curr.rewardedAmount,
    }),
    {},
  );

  const teamMate = betHistory?.team?.teammates.find(
    (x: UserPlayerTag) => currentUser.id === x?.user?.id,
  );

  analytics.track('bet placed (user)', {
    bet_id: betHistory?.id,
    team_id: teamId,
    user_wallet_info: {
      balance_before: currentUser.wallet.funds,
      balance_after: teamMate?.user?.wallet?.funds,
    },
    game_info: {
      game: 'WZ',
      team_size: teamMembers.length,
      map: betHistory.map,
    },
    lines_info: linesInfo,
    high_level_info: {
      main_bet_format: getBetAnte(pickedCategory, true),
      lines_taken: betHistory.requiredResult.map((res: any) =>
        res.type?.toLowerCase(),
      ),
      total_amount_bet: ante.toFixed(2),
      total_possible_payout: payout.toFixed(2),
    },
  });
};

export const trackDepositStarted = (source: string): void => {
  if (analytics) analytics.track('deposit started', { source });
};

export const trackDepositCompleted = (amount: number): void => {
  if (analytics)
    analytics?.track('deposit completed', { amount, method: 'paypal' });
};

export const trackGamertagEntered = (selected: string, gamertag: string): void => {
  if (analytics)
    analytics?.track('gamertag entered', {
      platform: { [selected]: gamertag },
    });
};

export const trackPasswordEntered = (): void => {
  if (analytics) analytics?.track('password entered');
};

export const trackSignUpStarted = (): void => {
  if (analytics) analytics?.track('sign up started');
};

export const trackSignUpCompleted = (userId: string, method: string): void => {
  if (analytics) analytics?.track('sign up completed', { user_id: userId, method });
};

export const trackSignUpMethodChosen = (method: string): void => {
  if (analytics) analytics?.track('sign up method chosen', { method });
};

export const trackVerificationCodeConfirmed = (timesAskedNewCode: number): void => {
  if (analytics) {
    analytics.track('verification code confirmed', {
      new_code_requested: Boolean(timesAskedNewCode),
      code_request_count: timesAskedNewCode,
      code_sent_count: timesAskedNewCode + 1,
    });
  }
};

export const trackNewPhoneCodeRequested = (message: string): void => {
  if (analytics) analytics?.track('new code requested', { result: message });
};

export const trackConfirmedPublicProfile = (): void => {
  if (analytics) analytics.track('confirmed public profile');
};

export const trackViewFAQ = (): void => {
  if (analytics) analytics.track('viewed FAQ');
};

export const trackClickedBetsTab = (): void => {
  if (analytics) analytics.track('clicked bets tab');
};

export const trackClickedPlayTab = (): void => {
  if (analytics) analytics.track('clicked bet slip');
};

export const trackSentTeamInvite = (
  userId: string,
  teamId: string | null,
): void => {
  if (analytics)
    analytics.track('sent team invite', {
      recipient_id: userId,
      team_id: teamId,
    });
};

export const trackJoinedTeam = (
  userId: string,
  teamId: string | null,
): void => {
  if (analytics)
    analytics.track('joined team', {
      sender_id: userId,
      team_id: teamId,
    });
};

export const trackChangedMap = (map: GameModes): void => {
  if (analytics) analytics.track('changed map', { map });
};

export const trackBetSize = (category: CategoriesType): void => {
  if (analytics)
    analytics.track('changed bet size', {
      bet_size: getBetAnte(category, true),
    });
};

export const trackBerbixVerificationStarted = (): void => {
  if (analytics) analytics.track('berbix verification started');
};

export const trackTournamentJoined = (
  { tourneyId, teamId }:
  { tourneyId: number; teamId: string | null; }
  ): void => {
  if (analytics)
    analytics.track('tournament joined', {
      tourneyId,
      teamId,
    });
}

export const trackTournamentLeft = (
  { tourneyId, teamId }:
  { tourneyId: number; teamId: string | null; }
): void => {
  if (analytics)
    analytics.track('tournament left', {
      tourneyId,
      teamId,
    });
}
