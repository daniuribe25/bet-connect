import styled from 'styled-components';
import { fontMediumSmall, fontSmall } from 'styles/typography';
import SVG from 'assets/images/svgs';

export const BannerWrapper = styled.div`
  color: white;
  background-color: ${({ theme, type }) => theme[type].background.primary};
  padding: 16px;
`;

export const BannerHeader = styled.div`
  ${fontMediumSmall}
  margin-bottom: 4px;
`;

export const CloseButtonSVG = styled(SVG)`
  fill: white;
  grid-row: 1;
  grid-column: 2;
  margin-left: 8px;
`;

export const Subtext = styled.span`
  ${fontSmall};
`;

export const DismissableArea = styled.button`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  cursor: pointer;
  background-color: transparent;
  border: none;
`;

export const Button = styled.button`
  padding: 4px 16px;
  border-radius: 20px;
  color: ${({ theme, solid, type }) =>
    solid ? theme[type].background.primary : 'white'};
  margin-right: 8px;
  ${fontSmall};
  background-color: ${({ solid }) => (solid ? 'white' : 'transparent')};
  border: ${({ solid }) => !solid ? '1px solid white' : 'none'};
  cursor: pointer;
  position: relative;
  z-index: 2;
`;

export const ButtonWrapper = styled.div`
  margin-top: 16px;
`;

export const ToastWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000000;
  min-width: 100vw;
  margin: 0 auto;
  position: fixed;
  left: 0;
  right: 0;
  bottom: ${({ position = 'bottom' }) => position === 'bottom' ? '16px' : 'unset'};
  top: ${({ position = 'bottom' }) =>
    position === 'top' ? '64px' : 'unset'};
  box-shadow: 0px 0px 16px 0px #0C273A40;
`;

export const ToastCard = styled.div`
  width: 100%;
  max-width: 500px;
  color: white;
  background-color: ${({ theme, type }) => theme[type].background.primary};
  padding: 16px;
  margin: 0 16px;
  border-radius: 8px;
  animation: fromBottom 0.25s ease-in;

  @keyframes fromBottom {
    0% {
      transform: ${({ position }) =>
        `translateY(${position === 'top' ? '-150px' : '150px'})`};
      }
    100% {
      transform: translate(0%);
    }
  }
`;
