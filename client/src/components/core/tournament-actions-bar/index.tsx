import styled from 'styled-components';
import SVG from 'assets/images/svgs';
import { fontMediumSmall } from 'styles/typography';
import formatMoney from 'helpers/format-money';
import BottomInfoBar from '../bottom-info-bar';
import Pill from '../pill';
import TeamAvatars from '../team-avatars';

const PencilIcon = styled(SVG)`
  margin-right: 6px;
  cursor: pointer;
  fill: ${({ theme }) => theme.dark.icon.alternative};
`;

const SecondaryText = styled.span`
  color: ${({ theme }) => theme.lightBlue.text.secondary};
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MainButton = styled(Pill)`
  margin-top: 16px;
`;

const WaitingForCaptainPill = styled.div`
  margin-top: 16px;
  height: 48px;
  ${fontMediumSmall};
  border-radius: 24px;
  background-color: ${({ theme }) => theme.lightBlue.background.primary};
  color: ${({ theme }) => theme.lightBlue.text.secondary};
  display: flex;
  justify-content: center;
  align-items: center;
`;

type PlayerType = {
  playerTag: string;
}

type JoinTournamentType = {
  onClick: () => void;
  handleClickTeam: () => void;
  teamUsers: Array<PlayerType>;
  entryFeeValue: number;
}

export const TournamentEnded = (): JSX.Element => (
  <BottomInfoBar variant="lightBlue">
    <SecondaryText>This tournament has ended</SecondaryText>
  </BottomInfoBar>
);

export const TournamentCancelled = (): JSX.Element => (
  <BottomInfoBar variant="lightBlue">
    <SecondaryText>This tournament has been cancelled</SecondaryText>
  </BottomInfoBar>
);

export const TournamentPendingPayout = (): JSX.Element => (
  <BottomInfoBar variant="info">
    Final scores are being reviewed
  </BottomInfoBar>
);

export const TournamentEnding = ({ finaliseTime }: { finaliseTime: string }): JSX.Element => (
  <BottomInfoBar variant="info">
    {`Scores finalize around ${finaliseTime}`}
  </BottomInfoBar>
)

export const YourTournamentEntered = ({
  openYourEnteredTeamModal,
  teamUsers,
} : {
    openYourEnteredTeamModal: () => void,
    teamUsers: Array<PlayerType>,
}): JSX.Element => (
  <BottomInfoBar variant="info" onClick={openYourEnteredTeamModal}>
    <InnerWrapper>
      <span>You’ve entered this tournament</span>
      <TeamAvatars team={teamUsers} />
    </InnerWrapper>
  </BottomInfoBar>
);

export const YourTournamentLive = ({ teamUsers }: {
  teamUsers: Array<PlayerType>,
}): JSX.Element => (
  <BottomInfoBar variant="success">
    <InnerWrapper>
      <span>This tournament is live</span>
      <TeamAvatars team={teamUsers} />
    </InnerWrapper>
  </BottomInfoBar>
)

export const TournamentLive = (): JSX.Element => (
  <BottomInfoBar variant="success">
    This tournament is live
  </BottomInfoBar>
)

export const JoinTournament = ({ onClick, handleClickTeam, teamUsers, entryFeeValue }: JoinTournamentType): JSX.Element => {
  const isFree = entryFeeValue === 0;
  const buttonText = isFree ? 'Free' : `${formatMoney({ amount: entryFeeValue })} each`
  return (
    <BottomInfoBar variant="dark">
      <InnerWrapper>
        <span>Your team</span>
        <InnerWrapper onClick={handleClickTeam}>
          <PencilIcon icon="action:edit" />
          <TeamAvatars team={teamUsers} />
        </InnerWrapper>
      </InnerWrapper>
      <MainButton variant="success" onClick={onClick}>{`Join for ${buttonText}`}</MainButton>
    </BottomInfoBar>
)}

export const WaitingForCaptain = ({ teamUsers }: { teamUsers: Array<PlayerType> }): JSX.Element => (
  <BottomInfoBar variant="dark">
    <InnerWrapper>
      <span>Your team</span>
      <TeamAvatars team={teamUsers} />
    </InnerWrapper>
    <WaitingForCaptainPill>Your captain must enter your team</WaitingForCaptainPill>
  </BottomInfoBar>
)

export const EditTeam = ({ teamUsers, handleClickTeam, editTeamString }: { teamUsers: Array<PlayerType>, handleClickTeam: () => void, editTeamString: string }): JSX.Element => (
  <BottomInfoBar variant="dark">
    <InnerWrapper>
      <span>{editTeamString}</span>
      <InnerWrapper onClick={handleClickTeam}>
        <PencilIcon icon="action:edit" />
        <TeamAvatars team={teamUsers} />
      </InnerWrapper>

    </InnerWrapper>
    <MainButton variant="info" onClick={handleClickTeam}>Edit team</MainButton>
  </BottomInfoBar>
)

