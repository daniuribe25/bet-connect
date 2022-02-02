import styled from 'styled-components';
import SVG from 'assets/images/svgs';
import { fontMediumSmall, fontSmall } from 'styles/typography';

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  ${fontSmall};
  padding: 16px;
`;

export const RightWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  ${fontMediumSmall}
  font-weight: 900;
  cursor: pointer;
`;

export const InfoIcon = styled(SVG)`
  fill: #2F9BD8;
  margin-left: 2px;
`;

export const InfoWrapper = styled.div`
  p {
    margin: 0 0 16px 0;
  }
`;

export const ProgressWrapper = styled.div`
  height: 11px;
  width: 11px;
  margin-bottom: 8px;
`;
