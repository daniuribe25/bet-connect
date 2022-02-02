import { FunctionComponent, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import useChannels from 'hooks/use-channels';
import { RootState } from 'redux/root-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { trackTournamentJoined, trackTournamentLeft } from 'helpers/segment-analytics';
import { setStoreProperty as setStorePropertyTournaments } from 'redux/slices/tournaments-slice';
import ModalHeader from 'components/core/modal-header';
import TournamentHeader from 'components/core/tournament-header';
import TournamentDetails from 'components/core/tournament-details';
import TournamentPrizePreview from 'components/core/tournament-prize-preview';
import { ModalContext } from 'util/modal-context/modal-context';
import TeamsEntered from 'components/core/teams-entered';
import useInterval from 'helpers/use-interval';
import AvailablePlayersModal from 'components/add-players/available-players-modal';
import {
  ConfirmTournamentEntryModal,
  CancelTournamentEntryModal,
} from 'components/core/tournament-confirmation-modals';
import AllResults from 'components/core/all-results';
import TournamentActionsBar from 'components/core/tournament-actions-bar/tournament-actions-bar';
import YourEnteredTeam from 'components/core/your-entered-team';
import { CenterSpinner } from 'components/core/loading-spinner';
import getTeamMode from 'helpers/get-team-mode';
import {
  getTournament,
  joinTournament,
  leaveTournament,
} from 'redux/actions/tournaments-actions';
import AllPrizes from 'components/core/all-prizes';
import { PayoutAmounts, TournamentTeam, DetailProps } from 'helpers/pl-types';
import useAlerts from 'hooks/use-alerts';
import { formatDateRange, getExactTimeDifference } from 'helpers/date-time';
// import AllPrizes from 'components/core/all-prizes';

const HeaderWrapper = styled.div`
  position: absolute;
  width: 100%;
  max-width: 600px;
  z-index: 1;
`;

const Content = styled.div`
  padding: 16px;
  flex: 1;
`;

const InnerContentWrapper = styled.div`
  position: relative;
  top: -32px;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TourneyHeaderWrapper = styled.div`
  padding-top: 56px;
`;

const Tournament: FunctionComponent = () => {
  const dispatch = useDispatch();

  const { teamId, openTeamModal } = useSelector(
    ({ lobby }: RootState) => lobby,
  );

  const { viewingTournament, alerts } = useSelector(
    ({ tourneys }: RootState) => tourneys,
  );

  useAlerts(alerts, setStorePropertyTournaments);

  const teamChannel = useChannels(`team`, teamId);
  const { tournamentId }: any = useParams();
  const history = useHistory();

  const context = useContext(ModalContext);

  useEffect(() => {
    dispatch(getTournament(tournamentId));
  }, [dispatch]);

  useInterval(() => {
    dispatch(getTournament(tournamentId));
  }, 30000);

  if (!viewingTournament) {
    return <CenterSpinner size={80} />;
  }

  const cancelTournamentEntry = async (id: string): Promise<void> => {
    if (id) {
      await dispatch(
        leaveTournament({ tourneyId: viewingTournament.id, teamId: id }),
      );
    }
    trackTournamentLeft({ tourneyId: viewingTournament.id, teamId: id })
    dispatch(getTournament(tournamentId));
  };

  const openTeamsModal = (): void => {
    context?.displayModal({
      modalDisplayed: true,
      type: 'fullscreen',
      modalTitle: 'Entries',
      body: (
        <TeamsEntered
          tournamentDivisions={viewingTournament?.divisions || []}
          teamsData={viewingTournament.tournamentTeams || []}
          hasDivisions={viewingTournament.tournamentConfig.configJson.hasDivisions}
        />
      ),
    });
  };

  const joinedTournamentAction = async (): Promise<void> => {
    if (teamId) {
      await dispatch(
        joinTournament({ tourneyId: viewingTournament.id, teamId }),
      );
    }
    trackTournamentJoined({ tourneyId: viewingTournament.id, teamId })
    dispatch(getTournament(tournamentId));
  };

  const openJoinTournamentModal = (numberOfPlayersEntering: number): void => {
    const { tournamentConfig } = viewingTournament || {};
    const { configJson } = tournamentConfig || {};
    const { gameInfo, entryFeeValue, totalPrizePool } = configJson || {};

    const teamSize = gameInfo?.gameModeOptions?.teamSizes?.[0];

    const titleString = `${gameInfo?.gameModeName} ${getTeamMode(teamSize)}`;

    context?.displayModal({
      modalDisplayed: true,
      type: 'dialog',
      body: (
        <ConfirmTournamentEntryModal
          numberOfPlayersEntering={numberOfPlayersEntering}
          joinedTournamentAction={joinedTournamentAction}
          entryFeeValue={entryFeeValue}
          totalPrizePool={totalPrizePool}
          gameString={titleString}
        />
      ),
    });
  };

  const openCancelTeamEntryModal = (id?: string): void => {
    context?.displayModal({
      modalDisplayed: true,
      type: 'dialog',
      body: (
        <CancelTournamentEntryModal
          cancelTournamentEntry={() => cancelTournamentEntry(id || '')}
          entryFeeValue={
            viewingTournament?.tournamentConfig?.configJson?.entryFeeValue
          }
        />
      ),
    });
  };

  const openYourEnteredTeamModal = (enteredTeam: TournamentTeam): void => {
    context?.displayModal({
      modalDisplayed: true,
      type: 'fullscreen',
      modalTitle: 'Your entered team',
      body: (
        <YourEnteredTeam
          openCancelTeamEntryModal={openCancelTeamEntryModal}
          team={{
            id: enteredTeam?.id || '',
            teamId: enteredTeam.teamId,
            teamName: enteredTeam?.teamName || '',
            tournamentTeamUser: enteredTeam?.tournamentTeamUser || [],
          }}
        />
      ),
    });
  };

  const openAllResultsModal = (): void => {
    context?.displayModal({
      modalDisplayed: true,
      type: 'fullscreen',
      modalTitle: 'Results',
      body: (
        <AllResults
          tournamentDivisions={viewingTournament?.divisions || []}
          teams={viewingTournament.tournamentTeams || []}
          hasDivisions={viewingTournament.tournamentConfig.configJson.hasDivisions}
        />
      ),
    });
  };

  const openAllPrizesModal = (prizes: PayoutAmounts[]): void => {
    context?.displayModal({
      modalDisplayed: true,
      type: 'fullscreen',
      modalTitle: 'Prizes',
      body: <AllPrizes prizes={prizes} />,
    });
  };

  const goBackToTournaments = (): void => {
    history?.go(-1);
    dispatch(setStorePropertyTournaments(['viewingTournament', undefined]));
  };

  const handleClickTeam = (): void => {
    dispatch(setStoreProperty(['openTeamModal', !openTeamModal]));
  };

  const {
    totalTeams,
    tournamentConfig: {
      configJson: {
        entryFeeValue,
        maximumNumberTeams,
        startDateTime,
        endDateTime,
        prizeStyle,
        prizeStyleDescription,
        scoringStyle,
        scoringStyleDescription,
        hasDivisions,
        gameInfo: { gameModeName, gameModeOptions },
        payoutAmounts,
        totalPrizePool,
      },
    },
    tournamentStatus,
    tournamentTeams,
    userFlag,
  } = viewingTournament;

  const teamSize = gameModeOptions?.teamSizes?.[0] || 1;

  const titleString = `${gameModeName} ${getTeamMode(teamSize)}`;

  const timeRange = formatDateRange(
    new Date(startDateTime),
    new Date(endDateTime),
  );

  const distanceOfTime = getExactTimeDifference(
    new Date(startDateTime),
    new Date(endDateTime),
  );

  const tournamentDetails: DetailProps[] = [
    {
      header: `Scoring: ${scoringStyle}`,
      description: scoringStyleDescription,
    },
    { header: `Prizing: ${prizeStyle}`, description: prizeStyleDescription },
    {
      header: 'Play Time: ',
      description: (
        <span>
          {timeRange} {`(${distanceOfTime})`}. Any matches{' '}
          <strong>started</strong> during this time period will count towards
          your overall score.
        </span>
      ),
    },
    {
      header: 'Team Size: ',
      description: teamSize > 1 ? `${teamSize} Players` : `1 player`,
    },
  ];

  return (
    <PageWrapper>
      <HeaderWrapper>
        <ModalHeader title={titleString} backOnClick={goBackToTournaments} />
      </HeaderWrapper>
      <TourneyHeaderWrapper>
        <TournamentHeader
          openTeamsModal={openTeamsModal}
          tournamentData={{
            teamsJoined: totalTeams,
            slotsAvailable: maximumNumberTeams,
            startAt: startDateTime,
            endsAt: endDateTime,
            tournamentStatus,
          }}
        />
      </TourneyHeaderWrapper>
      <Content>
        <InnerContentWrapper>
          <TournamentPrizePreview
            tournamentStatus={tournamentStatus}
            payouts={payoutAmounts}
            teams={tournamentTeams}
            openAllResultsModal={openAllResultsModal}
            openAllPrizesModal={() => openAllPrizesModal(payoutAmounts)}
            prizeStyle={prizeStyle}
            totalPrizePool={totalPrizePool}
            hasDivisions={hasDivisions}
            tournamentDivisions={viewingTournament?.divisions || []}
          />
        </InnerContentWrapper>
        <InnerContentWrapper>
          <TournamentDetails details={tournamentDetails} />
        </InnerContentWrapper>
      </Content>
      <TournamentActionsBar
        tournamentStatus={tournamentStatus}
        handleClickTeam={handleClickTeam}
        openJoinTournamentModal={openJoinTournamentModal}
        openYourEnteredTeamModal={openYourEnteredTeamModal}
        minimumTeamMembersNeeded={gameModeOptions?.teamSizes?.[0]}
        entryFeeValue={entryFeeValue}
        currentUserEnteredTournament={userFlag}
        tournamentTeams={tournamentTeams}
        endDateTime={endDateTime}
      />
      <AvailablePlayersModal teamChannel={teamChannel} />
    </PageWrapper>
  );
};

export default Tournament;
