import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/root-reducer';
import UserRow from 'components/core/teams-entered/user-row';
import { DefaultAvatar } from 'components/core/default-avatar';
import { fontSmaller } from 'styles/typography';
import { TournamentTeam } from 'helpers/pl-types';

type TeamProps = {
  team?: TournamentTeam;
  openCancelTeamEntryModal: (id?: string) => void;
}

const UserWrapper = styled.div`
  margin: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  padding: 16px;
`;

const LeaveText = styled.div`
  ${fontSmaller};
  color: #D82F4B;
  cursor: pointer;
`;

const InnerWrapper = styled.div`
  display: flex;
  > :first-child {
    margin-right: 16px;
  }
`;

const YourEnteredTeams = ({ team, openCancelTeamEntryModal }: TeamProps): JSX.Element => {
  const { tournamentTeamUser, teamId } = team || {};
  const { currentUser } = useSelector(({ session }: RootState) => session);

  return (
    <Wrapper>
      {tournamentTeamUser?.map((member) => (
        <UserWrapper key={member.playerHandle}>
          <InnerWrapper>
            <DefaultAvatar />
            <UserRow user={member} />
          </InnerWrapper>
          {currentUser?.id === member?.userId && <LeaveText onClick={() => openCancelTeamEntryModal(teamId)}>Leave</LeaveText>}
        </UserWrapper>
      ))}
    </Wrapper>
  )
}

export default YourEnteredTeams;
