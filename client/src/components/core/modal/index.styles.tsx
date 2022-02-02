import SVG from 'assets/images/svgs';
import styled from 'styled-components';
import { fontMediumLarge } from 'styles/typography'

export const Wrapper = styled.div`
  height: 100vh;
  background-color: ${({ theme }) => theme.darkest.background.primary};
`;

export const BodyWrapper = styled.div`
  padding-top: 55px;
  height: 100%;
`;

export const HeaderWrapper = styled.div`
  position: fixed;
  width: 100%;
  max-width: 600px;
  z-index: 10;
`;

export const CenterWrapper = styled.div`
  padding: 16px;
`;

export const CenterModalHeader = styled.h1`
  ${fontMediumLarge};
  margin: 16px 0 16px 0;
`;

export const CenterHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CloseButton = styled(SVG)`
  cursor: pointer;
  fill: #3F7193;
  margin-right: 10px;
`;
