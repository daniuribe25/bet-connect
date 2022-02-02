import Label from 'components/core/label';
import moment from 'moment';
import { TournamentTeam, tournamentStatuses } from 'helpers/pl-types';
import styled from 'styled-components';
import SVG from 'assets/images/svgs';
import formatMoney from 'helpers/format-money';

const Icon = styled(SVG)`
  height: 12px;
  width: 12px;
  margin-right: 3px;
  fill: ${({ theme }) => theme.dark.icon.primary};
`;

type TournamentLabelProps = {
  userFlag: boolean;
  entryFee: number;
  tournamentStatus: tournamentStatuses;
  usersTeam?: TournamentTeam;
};

const TournamentLabel = ({
  userFlag,
  entryFee,
  usersTeam,
  tournamentStatus,
}: TournamentLabelProps): JSX.Element => {

  const JoinedLabel = (): JSX.Element => (
    <Label variant="success" size="small">
      <Icon icon="content:tickCircleFilled" />
      <span>Joined</span>
    </Label>
  )

  const TournamentCompleteLabel = (): JSX.Element => {
    const userPlacement = usersTeam?.placement ? moment.localeData().ordinal(Number(usersTeam?.placement)) : '';
    const userWon = usersTeam?.payoutObject !== null;
    const placementString = `Finished ${userPlacement}`;
    const winnerString = `Won ${formatMoney({ amount: usersTeam?.payoutObject?.value })} | ${userPlacement}`;
    return (
      <Label variant={userWon ? 'winner' : 'lightBlue'} size="small">
        {userWon ? winnerString : placementString}
      </Label>
    )
  }

  const DefaultLabel = (): JSX.Element => {
    const isFree = entryFee === 0;
    const text = isFree ? `Free entry` : `${formatMoney({ amount: entryFee })} entry`;
    return (
      <Label variant={isFree ? 'highlight' : 'secondaryDark'} size="small">
        {text}
      </Label>
    )
  }

  const renderCorrectLabel = (): JSX.Element => {
    if (tournamentStatus === 'COMPLETE') {
      return <TournamentCompleteLabel />
    }
    if (userFlag) {
      return <JoinedLabel />
    }
    return <DefaultLabel />
  }

  return (
    <>
     {renderCorrectLabel()}
    </>
  )
};

export default TournamentLabel;
