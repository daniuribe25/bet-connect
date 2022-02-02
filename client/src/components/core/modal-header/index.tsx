import styled from 'styled-components';
import SVG from 'assets/images/svgs';
import { fontMedium } from 'styles/typography';

type ModalHeaderProps = {
  title: string;
  backOnClick?: () => void;
  closeOnClick?: () => void;
}

const HeaderWrapper = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.dark.background.primary};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 0px 0px 16px 0px #0C273A;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
`;

const ModalTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.dark.text.primary};
  ${fontMedium};
  font-weight: 900;
`;

const BackButtonIcon = styled(SVG)`
  margin-right: 16px;
  fill: #3F7193;
  height: 20px;
  width: 20px;
  cursor: pointer;
`;

const CloseButtonIcon = styled(SVG)`
  fill: #3F7193;
  cursor: pointer;
`;

const BackAndTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ModalHeader = ({ title, backOnClick, closeOnClick }: ModalHeaderProps): JSX.Element => {
  return (
    <HeaderWrapper>
      <BackAndTitleWrapper>
        {backOnClick && (
          <BackButtonIcon
            data-testid="modal-header-back-button"
            onClick={backOnClick}
            icon="action:chevronLeft" />
        )}
        <ModalTitle>{title}</ModalTitle>
      </BackAndTitleWrapper>
      {closeOnClick && (
        <CloseButtonIcon
          data-testid="modal-header-close-button"
          onClick={closeOnClick}
          icon="action:close" />
      )}
    </HeaderWrapper>
  )
}

export default ModalHeader;
