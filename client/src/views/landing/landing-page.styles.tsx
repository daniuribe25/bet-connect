import styled from 'styled-components';
import SVG from 'assets/images/svgs';
import { fontMediumLarge, fontMediumSmall, fontSmall, fontSmaller } from 'styles/typography';

export const Dollar = styled(SVG)`
  height: 90px;
  position: absolute;
  left: -18px;
  top: -10px;
`;

export const ButtonWrap = styled.div`
  position: fixed;
  bottom: 0;
  max-width: 600px;
  width: 100%;
  padding: 16px;
  padding-top: 24px;
  background: linear-gradient(0deg, #031725 77.5%, rgba(12, 39, 58, 0) 100%);
`;

export const PlayerImage = styled.img`
  height: 99px;
  width: 99px;
`;

export const PlayersImagesWrapper = styled.div`
  display: flex;
  top: 0;

  > :first-child {
    top: -44px;
    position: absolute;
    left: -16px;
  }

  > :nth-child(2) {
    top: -64px;
    position: absolute;
    left: 55px;
  }

  > :nth-child(3) {
    top: -64px;
    position: absolute;
    right: 55px;
    z-index: 4;
  }

  > :nth-child(4) {
    top: -44px;
    position: absolute;
    right: -16px;

  }
`;

export const Header = styled.h1`
  ${fontMediumLarge};
  margin: 0;
`;

export const BottomSectionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  justify-content: space-between;
`;

export const SecondaryHeader = styled.h3`
  ${fontMediumSmall};
  font-weight: 900;
  margin: 0;
`;

export const TextWrapper = styled.div`
  text-align: left;
  max-width: 205px;
`;

export const SectionDescription = styled.p`
  ${fontSmall};
  margin: 0;
  margin-top: 5px;
`;

export const BottomSection = styled.div`
  margin-top: 22px;
  padding-bottom: 80px;
`;

export const PlayersClusterImage = styled.img`
  height: 104px;
  width: 115px;
`;

export const PayoutImage = styled.img`
  height: 101px;
  width: 121px;
`

export const WinPreviewImage = styled.img`
  height: 90px;
  width: 138px;
`

export const PageHeader = styled.div`
  margin-bottom: 79px;

  span {
    ${fontMediumSmall};
    font-weight: 400;
  }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  max-width: 600px;
  padding: 16px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #031725;
  width: 100%;
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 25px;

  span {
    ${fontSmall};
    color: #2F9BD8;
    cursor: pointer;
  }
`;

export const PromoWrapper = styled.div`
  background: linear-gradient(180deg, #743FFE 0%, #4611CF 100%);
  width: 288px;
  border-radius: 16px;
  margin-top: 22px;
  position: relative;
  height: 72px;
`;

export const InnerPromoWrapper = styled.div`
  border: 1px solid white;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 68px;
  margin: 2px 2px;
  justify-content: center;
`;

export const PromoDescription = styled.span`
  ${fontSmaller};
  font-weight: 700;
`;

export const BetsWrapper = styled.div`
  height: 179px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.025) 100%);
  width: 288px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`;

export const MiddleSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BetRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  letter-spacing: 3px;

  svg {
    height: 14px;
    width: 14px;
    margin-right: 6px;
  }

  span {
    padding: 4px 0;
  }

  div {
    display: flex;
    align-items: center;
  }
`;

export const BetRowTransparent = styled(BetRow)`
  opacity: 0.5;
`;

export const BetWrapper = styled.div`
  height: 145px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export const Winnings = styled.div`
  font-size: 15px;
  letter-spacing: 3px;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
`;
