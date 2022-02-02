import { useState } from 'react';
import SVG from 'assets/images/svgs';
import styled from 'styled-components';
import { fontMediumSmall } from 'styles/typography';
import { TournamentTeam } from 'helpers/pl-types';
import UserRow from '../user-row';
import { DefaultAvatar } from '../../default-avatar';

type TeamProps = {
  team: TournamentTeam;
};

const RowWrapper = styled.div<{ highlighted: boolean }>`
  border-bottom: 1px solid #104a77;
  background-color: ${({ highlighted, theme }) =>
    highlighted ? theme.secondaryDark.background.primary : 'transparent'};
`;

const TeamName = styled.div`
  ${fontMediumSmall};
  color: ${({ theme }) => theme.dark.text.primary};
  margin-left: 16px;
`;

const ClickableRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const InnerWrapper = styled.div`
  padding: 16px;
`;

const MembersWrapper = styled.div`
  margin-left: 55px;
`;

const TeamOverviewWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UserWrapper = styled.div`
  margin: 24px 0;
`;

const TeamRow = ({ team }: TeamProps): JSX.Element => {
  const [teamsOpened, setTeamsOpened] = useState(false);

  const openOrCloseTeams = (): void => {
    setTeamsOpened(!teamsOpened);
  };

  const { teamName, tournamentTeamUser, isUsersTeam } = team;

  return (
    <RowWrapper highlighted={!!isUsersTeam}>
      <InnerWrapper>
        <ClickableRow
          tabIndex={0}
          role="button"
          onClick={openOrCloseTeams}
          onKeyPress={openOrCloseTeams}
        >
          <TeamOverviewWrapper>
            <DefaultAvatar />
            <TeamName>{isUsersTeam ? 'Your team' : teamName}</TeamName>
          </TeamOverviewWrapper>
          <SVG icon={teamsOpened ? 'action:chevronUp' : 'action:chevronDown'} />
        </ClickableRow>
        {teamsOpened && (
          <MembersWrapper>
            {tournamentTeamUser.map((user) => (
              <UserWrapper key={user.playerHandle}>
                <UserRow user={user} />
              </UserWrapper>
            ))}
          </MembersWrapper>
        )}
      </InnerWrapper>
    </RowWrapper>
  );
};

export default TeamRow;
