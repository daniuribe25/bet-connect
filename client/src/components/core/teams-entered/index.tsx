import { useContext, useState  } from 'react';
import styled from 'styled-components';
import { TournamentTeam, DivisionType } from 'helpers/pl-types';
import { ModalContext } from 'util/modal-context/modal-context';
import { DropdownButton, DropdownMenu } from 'components/core/dropdown';
import TeamRow from './team-row';

type TeamsEnteredProps = {
  teamsData: TournamentTeam[];
  hasDivisions: boolean;
  tournamentDivisions: DivisionType[];
}

export const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.darkest.background.primary};
`;

const NoTeamsText = styled.div`
  color: ${({ theme }) => theme.dark.text.secondary};
  text-align: center;
  padding-top: 32px;
`;

const DropdownWrapper = styled.div`
  position: absolute;
  right: 48px;
  z-index: 10;
  top: 12px;
`;

const TeamsEntered = ({ teamsData, hasDivisions, tournamentDivisions }: TeamsEnteredProps): JSX.Element => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [divisionDisplayed, setDivisionDisplayed] = useState({
    name: `Division ${tournamentDivisions?.[0]?.divisionNumber}`,
    id: tournamentDivisions?.[0]?.id,
    data: tournamentDivisions?.[0]?.divisionTeams || [],
    label: undefined,
  });
  const context = useContext(ModalContext);

  const getNewUsersArray = (): TournamentTeam[] => {
    const usersTeamIndex = teamsData?.findIndex((team) => team?.isUsersTeam === true);
    if (usersTeamIndex === -1) {
      return teamsData;
    }
    const usersTeam = teamsData[usersTeamIndex];

    const newUsers = teamsData.filter((team) => team?.isUsersTeam === false)

    return [usersTeam, ...newUsers];
  }

  const users = getNewUsersArray();

  const noUsers = hasDivisions ? divisionDisplayed?.data?.length === 0 : users?.length === 0;

  const openDivisionsModal = (): void => {
    const array: Array<{ name: string, id: number, data: Array<any>, label?: string; }> = [];
    tournamentDivisions.map((division) => {
      const usersDivision = division?.divisionTeams.findIndex((team) => team?.isUsersTeam === true);
      return array.push({ name: `Division ${division.divisionNumber}`, id: division.id, data: division.divisionTeams, label: usersDivision !== -1 ? '★ Your division' : undefined  })
    })
    setDropdownOpen(true)
    context?.displaySecondaryModal({
      modalDisplayed: true,
      onClose: () => setDropdownOpen(false),
      type: 'dialog',
      body: (
        <DropdownMenu
          optionChosen={divisionDisplayed}
          options={array}
          menuTitle="Choose a division"
          onOptionClick={(division) => {
            setDivisionDisplayed(division);
            setDropdownOpen(false)
            context?.dismissSecondaryModal();
          }}
        />
      ),
    });
  }

  const teamsRendered = (): JSX.Element => {
    if (hasDivisions) {
      return (
        <>
          {divisionDisplayed?.data?.map((team) => {
            return (
              <TeamRow key={team.teamName} team={team} />
            )
          })}
      </>
      )
    }
    return (
      <>
        {users.map((team) => {
          return (
            <TeamRow key={team.teamName} team={team} />
          )
        })}
      </>
    )
  }

  return (
    <Wrapper>
      {hasDivisions && divisionDisplayed?.data?.length !== 0 && (
        <DropdownWrapper>
          <DropdownButton
            open={dropdownOpen}
            dropdownText={divisionDisplayed.name}
            onClick={openDivisionsModal}
          />
        </DropdownWrapper>
      )}

      {noUsers ? (
        <NoTeamsText>No teams have entered this tournament yet</NoTeamsText>
      ) : (
        teamsRendered()
      )}
    </Wrapper>
  )
};

export default TeamsEntered;

