import styled from 'styled-components';
import { fontMediumSmall, fontSmall } from 'styles/typography';

export const FAQWrapper = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.dark.border.primary};
`;

export const Question = styled.h2`
  ${fontMediumSmall}
  margin: 0;
`;

export const Answer = styled.p`
  ${fontSmall}

  a {
    color: ${({ theme }) => theme.info.text.secondary};
  }

  ol {
    padding: 0 0 0 16px;
  }

  img {
    width: 100%;
    margin: 16px 0;
    border-radius: 8px;
  }
`;

export const Wrapper = styled.div`
  padding: 16px;
  flex: 1;
  padding-top: 57px;
`;

export const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const HeaderWrapper = styled.div`
  position: fixed;
  width: 100%;
  max-width: 600px;
  z-index: 1;
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

export const Error = styled.div`
  ${fontSmall}
  text-align: center;
  padding-top: 37px;
  color: ${({ theme }) => theme.dark.text.secondary};
`;



