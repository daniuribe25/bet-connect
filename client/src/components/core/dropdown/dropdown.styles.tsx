import styled from 'styled-components';
import { fontSmall, fontMedium } from 'styles/typography';
import SVG from 'assets/images/svgs';

export const Button = styled.button`
  border: 1px solid ${({ theme }) => theme.dark.border.secondary};
  background-color: transparent;
  padding: 2px 8px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Text = styled.span`
  color: ${({ theme }) => theme.dark.text.primary};
  ${fontSmall};
  font-family: 'Lato';
`;

export const Chevron = styled(SVG)`
  fill: ${({ theme }) => theme.dark.icon.primary};
`;

export const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MenuHeader = styled.h2`
  ${fontMedium};
  font-weight: 900;
  margin: 0;
  height: 68px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.dark.border.primary};
`;

export const OptionWrapper = styled.div<{ optionIsSelected: boolean }>`
  border-left: ${({ optionIsSelected }) => optionIsSelected ? '4px solid #2F9BD8' : 'none'};
  cursor: pointer;
`;

export const InnerWrapper = styled.div<{ displayBottomBorder: boolean }>`
  margin-left: 16px;
  height: 68px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-bottom: ${({ displayBottomBorder, theme }) => displayBottomBorder ? `1px solid ${theme.dark.border.primary}` : 'none'};
`;

export const OptionTitle = styled.span`
  ${fontMedium};
`;

export const SecondaryText = styled.span`
  ${fontSmall};
  color: ${({ theme }) => theme.dark.text.alternative};
  margin-top: 2px;
`;
