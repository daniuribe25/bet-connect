import styled from 'styled-components';
import SVG from 'assets/images/svgs';
import { TournamentTeamUser } from 'helpers/pl-types';

type UserProps = {
  user: TournamentTeamUser;
}

const UserRowWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ConsoleIcon = styled(SVG)`
  fill: ${({ theme }) => theme.dark.icon.secondary};
  height: 16px;
  width: 16px;
  margin-right: 2px;
`;

// const CrownIcon = styled(SVG)`
//   fill: #2F9BD8;
//   margin-left: 2px;
//   height: 24px;
//   width: 24px;
// `;

const Username = styled.span`
  font-family: 'Source Code Pro';
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.04em;
  color: ${({ theme}) => theme.dark.text.primary};
`;

const UserRow = ({ user }: UserProps): JSX.Element => {
  const { playerHandle } = user;
  return (
    <UserRowWrapper>
      <ConsoleIcon icon="platform:playstation" />
      <Username>{playerHandle}</Username>
      {/* {isCaptain && <CrownIcon icon="status:crown" />} */}
    </UserRowWrapper>
  )
}

export default UserRow;
