import styled from 'styled-components';
import { LetterAvatar } from '../default-avatar';

type MemberProps = {
  playerTag?: string;
  name?: string;
}

type TeamTypes = {
  team: MemberProps[];
}

const Wrapper = styled.div`
  display: flex;
`;

const InnerAvatarWrapper = styled.div<{ index: number }>`
  z-index: ${({ index }) => index};
  margin-left: -5px;
`;

const teamUsersColors = ['#23CA78', '#D82F4B', '#F6BB43', '#2F9BD8'];

const TeamAvatars = ({ team }: TeamTypes): JSX.Element => {
  return (
    <Wrapper>
      {team.map((member, index) => {
        if (member) {
          return (
            <InnerAvatarWrapper key={member?.playerTag || member?.name} index={index}>
              <LetterAvatar username={member?.playerTag || member?.name || ''} color={teamUsersColors[index]} />
            </InnerAvatarWrapper>
          )
        }
        return null;
      })}
  </Wrapper>
  )
}

export default TeamAvatars;
