import { useContext, useState  } from 'react';
import { TournamentTeam, DivisionType } from 'helpers/pl-types';
import styled from 'styled-components';
import formatMoney from 'helpers/format-money';
import { DropdownButton, DropdownMenu } from 'components/core/dropdown';
import { ModalContext } from 'util/modal-context/modal-context';
import TournamentRankingTable from '../tournament-ranking/tournament-ranking-table';
import { RowProps } from '../tournament-ranking/types';

const DropdownWrapper = styled.div`
  position: absolute;
  right: 48px;
  z-index: 10;
  top: 12px;
`;

const ResultsWrapper = styled.div`
  height: 100%;
`;

const remapTeamForTable = (teams: TournamentTeam[]): RowProps[] => {
  return teams.map(
    ({
      teamName,
      placement,
      payoutObject,
      teamPrimaryMetricTotal,
      isUsersTeam,
      teamIsInTheMoney,
    }): RowProps => {
      return {
        placement,
        team: isUsersTeam ? 'Your team' : teamName,
        score: teamPrimaryMetricTotal,
        prize: payoutObject?.value && formatMoney({ amount: payoutObject?.value }),
        isCurrentUser: isUsersTeam,
        teamIsInTheMoney,
      };
    },
  );
};

const AllResults = ({ teams, hasDivisions, tournamentDivisions }: { teams: TournamentTeam[], hasDivisions: boolean, tournamentDivisions: DivisionType[]; }): JSX.Element => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [divisionDisplayed, setDivisionDisplayed] = useState({
    name: `Division ${tournamentDivisions?.[0]?.divisionNumber}`,
    id: tournamentDivisions?.[0]?.id,
    data: tournamentDivisions?.[0]?.divisionTeams || [],
    label: undefined,
  });
  const context = useContext(ModalContext);
  const mappedTeams = teams ? remapTeamForTable(teams) : [];
  const mappedDivisionsTeams = divisionDisplayed?.data ? remapTeamForTable(divisionDisplayed?.data) : [];

  const openDivisionsModal = (): void => {
    const array: Array<{ name: string, id: number, data: Array<any>, label?: string; }> = [];
    tournamentDivisions.map((division) => {
      const usersDivision = division?.divisionTeams.findIndex((team) => team?.isUsersTeam === true);
      return array.push({ name: `Division ${division.divisionNumber}`, id: division.id, data: division.divisionTeams, label: usersDivision !== -1 ? '★ Your division' : undefined  })
    })
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

  return (
    <ResultsWrapper>
      {hasDivisions && (
        <DropdownWrapper>
          <DropdownButton
            open={dropdownOpen}
            dropdownText={divisionDisplayed.name}
            onClick={openDivisionsModal}
          />
        </DropdownWrapper>
      )}
      {hasDivisions ? (
        <TournamentRankingTable data={mappedDivisionsTeams} />
      ) : (
        <TournamentRankingTable data={mappedTeams} />
      )}

    </ResultsWrapper>
  );
};

export default AllResults;
