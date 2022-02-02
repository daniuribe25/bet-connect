import { useSelector } from 'react-redux';
import { RootState } from 'redux/root-reducer';
import { TournamentTeam, tournamentStatuses} from 'helpers/pl-types';
import moment from 'moment';
import {
  TournamentEnded,
  TournamentPendingPayout,
  TournamentEnding,
  YourTournamentEntered,
  YourTournamentLive,
  TournamentLive,
  JoinTournament,
  WaitingForCaptain,
  EditTeam,
  TournamentCancelled,
} from './index';

type TournamentActionBarTypes = {
  handleClickTeam: () => void;
  openJoinTournamentModal: (currentNumberOfUsers: number) => void;
  tournamentStatus: tournamentStatuses;
  openYourEnteredTeamModal: (enteredTeam: TournamentTeam) => void;
  minimumTeamMembersNeeded?: number;
  entryFeeValue: number;
  currentUserEnteredTournament: boolean;
  tournamentTeams?: Array<TournamentTeam>;
  endDateTime: string;
}

const TournamentActionsBar = ({
  handleClickTeam,
  openJoinTournamentModal,
  tournamentStatus,
  openYourEnteredTeamModal,
  minimumTeamMembersNeeded,
  entryFeeValue,
  currentUserEnteredTournament,
  tournamentTeams,
  endDateTime
}: TournamentActionBarTypes): JSX.Element => {
  const { isCaptain, teamUsers } = useSelector(({ lobby }: RootState) => lobby);

  const usersTournamentTeam = tournamentTeams?.find((team) => team?.isUsersTeam === true);
  const users = usersTournamentTeam?.tournamentTeamUser || [];
  const getNewObject = users?.map((teammate) => {
    return {
      playerTag: teammate.playerHandle,
    }
  })
  const currentNumberOfUsers = teamUsers.filter((user) => user !== null)?.length;
  const teamHasEnoughPlayers = minimumTeamMembersNeeded === currentNumberOfUsers;

  const getEditTeamString = (): string => {
    if (minimumTeamMembersNeeded) {
      if (minimumTeamMembersNeeded > currentNumberOfUsers) {
        const numberOfUsers = minimumTeamMembersNeeded - currentNumberOfUsers;
        return `Your team needs ${numberOfUsers} more player${numberOfUsers === 1 ? '' : 's'}`
      }
      if (minimumTeamMembersNeeded < currentNumberOfUsers) {
        const numberOfUsers = currentNumberOfUsers - minimumTeamMembersNeeded;
        return `Your team has ${numberOfUsers} too many players`;
      }
    }
    return 'Your team'
  }

  const displayJoinTournament = isCaptain && (!minimumTeamMembersNeeded || teamHasEnoughPlayers) && !currentUserEnteredTournament;
  const displayEditTeam = isCaptain && !teamHasEnoughPlayers && !currentUserEnteredTournament;
  const displayWaitingForCaptain = !isCaptain && !currentUserEnteredTournament;

  if (tournamentStatus === 'NOT STARTED') {
    if (displayJoinTournament) {
      return (
        <JoinTournament
          entryFeeValue={entryFeeValue}
          handleClickTeam={handleClickTeam}
          onClick={() => openJoinTournamentModal(currentNumberOfUsers)}
          teamUsers={teamUsers}
        />
      )}
    if (displayEditTeam) {
      return (
        <EditTeam
          editTeamString={getEditTeamString()}
          teamUsers={teamUsers}
          handleClickTeam={handleClickTeam}
        />
      )
    }
    if (displayWaitingForCaptain) {
      return (
        <WaitingForCaptain teamUsers={teamUsers} />
      )
    }
    if (currentUserEnteredTournament && usersTournamentTeam) {
      return (
        <YourTournamentEntered
          teamUsers={getNewObject}
          openYourEnteredTeamModal={() => openYourEnteredTeamModal(usersTournamentTeam)}
        />
      )
    }
  }
  if (tournamentStatus === 'CANCELLED') {
    return <TournamentCancelled />
  }
  if (tournamentStatus === 'COMPLETE') {
    return <TournamentEnded />
  }
  if (tournamentStatus === 'PENDING RESULTS') {
    const finalisingTime = moment(endDateTime).add(45, 'minutes').format('h:mma');
    return (
      <TournamentEnding finaliseTime={finalisingTime}/>
  )}
  if (tournamentStatus === 'PENDING PAYOUT') {
    return (
      <TournamentPendingPayout />
  )}
  if (tournamentStatus === 'STARTED') {
    if (currentUserEnteredTournament) {
      return (
        <YourTournamentLive teamUsers={getNewObject} />
      )
    }
    return (
      <TournamentLive />
    )
  }
  return (
    <TournamentEnded />
  )
}

export default TournamentActionsBar;
