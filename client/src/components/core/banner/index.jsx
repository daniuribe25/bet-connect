import {
  BannerWrapper,
  BannerHeader,
  ToastWrapper,
  ToastCard,
  DismissableArea,
  Subtext,
  ButtonWrapper,
  Button,
  CloseButtonSVG,
} from './index.styles';

export const BannerContainer = ({ children, type }) => (
  <BannerWrapper type={type}>{children}</BannerWrapper>
);

export const Banner = ({ type = 'info', header, children }) => (
  <BannerWrapper data-testid="banner" type={type}>
    <BannerHeader>{header}</BannerHeader>
    {children}
  </BannerWrapper>
);

export const Toast = ({
  dismissToast,
  toastData: {
    type = 'info',
    heading,
    subtext,
    displayOptions = false,
    firstBtnOnClick,
    firstBtnText,
    secondBtnOnClick,
    secondBtnText,
    children,
    clickToDismiss,
    closeButton,
    position = 'top',
  } = {},
}) => (
  <ToastWrapper data-testid="global-toast" position={position}>
    <ToastCard type={type} position={position}>
      {clickToDismiss && (
        <DismissableArea
          data-testid="global-toast-dismissable-area"
          clickToDismiss={clickToDismiss}
          onClick={dismissToast}
        />
      )}

      {heading && <BannerHeader>{heading}</BannerHeader>}
      {subtext && <Subtext>{subtext}</Subtext>}
      {children}
      {displayOptions && (
        <ButtonWrapper>
          <Button
            data-testid="global-toast-first-btn"
            onClick={firstBtnOnClick}
            type={type}
            solid
          >
            {firstBtnText}
          </Button>
          <Button
            data-testid="global-toast-second-btn"
            onClick={secondBtnOnClick}
            type={type}
          >
            {secondBtnText}
          </Button>
        </ButtonWrapper>
      )}
      {closeButton && (
        <CloseButtonSVG
          data-testid="global-toast-close-btn"
          onClick={dismissToast}
          type={type}
          icon="action:close"
          tabIndex="-1"
          role="img"
        />
      )}
    </ToastCard>
  </ToastWrapper>
);
