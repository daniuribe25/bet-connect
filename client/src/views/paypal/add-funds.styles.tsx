import styled from 'styled-components';
import { fontLarger } from 'styles/typography';

export const PageWrapper = styled.div`
  height: 100vh;
`;

export const BottomSheet = styled.div`
  background-color: ${({ theme }) => theme.dark.background.primary};
  box-shadow: 0px 0px 16px 0px #0C273A40;
  padding: 16px;
  bottom: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const DollarSign = styled.span`
  ${fontLarger};
  border-bottom: 2px solid ${({ theme }) => theme.info.background.primary};
  padding: 4px;
`;

export const SuggestedValuesWrapper = styled.div`
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
  justify-content: space-between;
`;
