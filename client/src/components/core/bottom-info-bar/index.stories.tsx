import BottomInfoBar from '.';

export const bottomInfoBarLight = (): JSX.Element => (
 <BottomInfoBar variant="light">bottom bar</BottomInfoBar>
);
export const bottomInfoBarLightBlue = (): JSX.Element => (
  <BottomInfoBar variant="lightBlue">bottom bar</BottomInfoBar>
 );
export const bottomInfoBarDark = (): JSX.Element => (
  <BottomInfoBar variant="dark">bottom bar</BottomInfoBar>
 );
 export const bottomInfoBarInfo = (): JSX.Element => (
  <BottomInfoBar variant="info">bottom bar</BottomInfoBar>
 );
 export const bottomInfoBarWarning = (): JSX.Element => (
  <BottomInfoBar variant="warning">bottom bar</BottomInfoBar>
 );
 export const bottomInfoBarSuccess = (): JSX.Element => (
  <BottomInfoBar variant="success">bottom bar</BottomInfoBar>
 );

export default {
  title: 'Components/Core/Bottom Info Bar',
  component: bottomInfoBarLight,
};
