import styled from 'styled-components';

export const Title = styled.span`
  color: white;
  font-size: 25px;
  font-weight: 900;
`;

export const Payout = styled.span`
  color: #D4E2EC;
  font-size: 16px;
  margin: 4px 0 16px 0;
`;

export const ModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: #0C273A;
  border-radius: 10px;
  z-index: 1002;
  position: relative;
  margin: auto auto 0 auto;
  bottom: 0;
  pointer-events: all;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  max-width: 600px;
  border-top: 1px solid #7e8a93;
`;

export const MainButton = styled.button`
   height: 48px;
   color: white;
   font-size: 25px;
   font-weight: 900;
   font-family: 'Lato';
   border: none;
   border-radius: 24px;
   display: flex;
   justify-content: center;
   align-items: center;
   flex: 1;
`;

export const CancelButton = styled(MainButton)`
  background-color: #2F9BD8;
`;

export const ConfirmButton = styled(MainButton)`
  background-color: #23CA78;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;

  > :first-child {
    margin-right: 4px;
  }

  > :last-child {
    margin-left: 4px;
  }
`;

export const TextContext = styled.span`
  color: white;
  font-size: 12.8px;
  margin-bottom: 16px;
`;

export const HighlightContext = styled.span`
  padding: 16px;
  background-color: #F6BB43;
  border-radius: 8px;
  color: #0c273a;
  font-size: 12.8px;
  margin-bottom: 16px;
`;


export const BlurredBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(12, 39, 58, 0.75);
  backdrop-filter: blur(10px);
  z-index: 1001;
  pointer-events: all;
`;




