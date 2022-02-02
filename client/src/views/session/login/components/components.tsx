import styled from 'styled-components';
import { fontMediumLarge, fontSmall } from 'styles/typography';

export const BottomWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  position: sticky;
  bottom: 0;
`;

export const Info = styled.p`
  ${fontSmall};
  margin: 0 0 22px 0;
`;

export const Heading = styled.h1`
  ${fontMediumLarge};
  margin: 0 0 8px 0;
`;

export const IconWrapper = styled.div`
  padding-bottom: 22px;
`;

export const ContentWrap = styled.div<{ isKeyboardOpen?: boolean }>`
  display: flex;
  flex: ${({ isKeyboardOpen = false }) => (isKeyboardOpen ? 0 : 1)};
  width: 100%;
  flex-direction: column;
  color: #fff;
  text-align: left;
`;

export const PageWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
