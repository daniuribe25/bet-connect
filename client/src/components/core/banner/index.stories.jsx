import styled from 'styled-components';
import { BannerContainer, Banner, Toast } from '.';

const StoryWrapper = styled.div`
  display: flex;
  font-size: 12.8px;
`;

const fillerText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam';

export const bannerContainerInfo = () => (
  <BannerContainer type="info">
    <div>child in banner</div>
  </BannerContainer>
);

export const bannerContainerWarning = () => (
  <BannerContainer type="warning">
    <div>child in banner</div>
  </BannerContainer>
);

export const bannerContainerSuccess = () => (
  <BannerContainer type="success">
    <div>child in banner</div>
  </BannerContainer>
);

export const bannerWithHeaderInfo = () => (
  <Banner type="info" header="Account not verified">
    <StoryWrapper>
      <p>
        we sent a verification email to
        <b> mckenzie@playerslounge.co</b>, check your inbox to confirm your
        account creation.
      </p>
    </StoryWrapper>
  </Banner>
);

export const toastSuccess = () => (
  <Toast
    toastData={{
      type: 'success',
      heading: 'Toast Heading Success',
      subtext: fillerText,
    }}
  />
);

export const toastError = () => (
  <Toast
    toastData={{
      type: 'warning',
      heading: 'Toast Heading Error',
      subtext: fillerText,
    }}
  />
);

export const toastErrorWithOptions = () => (
  <Toast
    dismissToast={() => {}}
    toastData={{
      type: 'warning',
      heading: 'Toast Heading Error',
      subtext: fillerText,
      displayOptions: true,
      firstBtnOnClick: () => {},
      firstBtnText: 'Confirm',
      secondBtnOnClick: () => {},
      secondBtnText: 'Close',
      clickToDismiss: true,
    }}
  />
);

export const toastInfo = () => (
  <Toast
    toastData={{
      type: 'info',
      heading: 'Toast Heading Info',
      subtext: fillerText,
    }}
  />
);

export const toastInfoWithOptions = () => (
  <Toast
    toastData={{
      type: 'info',
      heading: 'Toast Heading Info',
      subtext: fillerText,
      displayOptions: true,
      firstBtnOnClick: () => {},
      firstBtnText: 'Confirm',
      secondBtnOnClick: () => {},
      secondBtnText: 'Close',
    }}
  />
);

export const toastNoProps = () => <Toast />;

export default {
  title: 'Components/Core/Banner',
  component: bannerContainerInfo,
};
