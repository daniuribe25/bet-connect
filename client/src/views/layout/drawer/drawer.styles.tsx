import styled from 'styled-components'
import SVG from 'assets/images/svgs';
import { fontSmall, fontMedium, fontMediumSmall } from 'styles/typography';

export const StyledLink = styled.a`
  color: ${({ theme }) => theme.dark.text.primary};
 ${fontSmall};
`;

export const TextDivider = styled.span`
  color: ${({ theme }) => theme.dark.text.primary};
  ${fontSmall};
`;

export const Icon = styled(SVG)`
  fill: ${({ theme }) => theme.dark.icon.primary};
  margin-right: 16px;
`;

export const LinksWrapper = styled.div`
  padding-left: 16px;
`;

export const TopMenuWrapper = styled.div`
  padding: 16px;
`;

export const UserWrapper = styled.div`
  display: flex;
`;

export const UserCircle = styled.div`
  border-radius: 50%;
  color: ${({ theme }) => theme.info.text.secondary};
  height: 45px;
  width: 45px;
  border: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontMedium};
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  ${fontMediumSmall};
`;

export const Balance = styled.span`
  ${fontSmall};
`;
