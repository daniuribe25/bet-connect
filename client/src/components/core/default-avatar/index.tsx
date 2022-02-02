import styled from 'styled-components';
import SVG from 'assets/images/svgs';
import { fontSmall } from 'styles/typography';

const BaseWrapper = styled.div`
  border: 1px solid white;
  background-color: #031725;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`

const AvatarWrapper = styled(BaseWrapper)`
  height: 43px;
  width: 43px;
`;

const LetterWrapper = styled(BaseWrapper)`
  height: 24px;
  width: 24px;
`;

// How are we determining color for these?
const UserOutline = styled(SVG)`
  height: 26.5px;
  width: 26.5px;
  fill: #D82F4B;
`;

const Letter = styled.span`
  ${fontSmall};
  font-weight: 700;
  color: ${({ color }) => color || '#F6BB43'};
`;

export const DefaultAvatar = (): JSX.Element => {
  return (
    <AvatarWrapper>
      <UserOutline icon="social:userOutline" />
    </AvatarWrapper>
  )
}

export const LetterAvatar = ({ username, color }: { username: string, color?: string }): JSX.Element => {
  const letter = username?.charAt(0)?.toUpperCase();
  return (
    <LetterWrapper>
      <Letter color={color}>{letter}</Letter>
    </LetterWrapper>
  )
}
