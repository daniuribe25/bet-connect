import styled from 'styled-components';
import SVG from 'assets/images/svgs';

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  background: linear-gradient(180deg, #13466a 0%, #0a2f47 100%);
  border-radius: 40px;
  height: 30px;
  margin-bottom: 22px;
`;

const ProgressBarGradientWrap = styled.div<{ step: number }>`
  width: ${({ step = 0 }) => step * 25}%;
  display: ${({ step = 0 }) => (step ? 'flex' : 'none')};
  border-radius: 40px;
  background: linear-gradient(180deg, #e77eff 0%, #8d25ff 100%);
  height: 30px;
  box-shadow: 0px 0px 10px #7540fe;
  padding: 1px;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  width: 100%;
  border-radius: 40px;
  background: linear-gradient(180deg, #7540fe 0%, #4612d0 100%);
  height: 28px;
  font-weight: 900;
  font-size: 16px;
  line-height: 19px;
`;

const Dollars = styled(SVG)`
  position: absolute;
  right: 0;
  top: -22px;
  width: 52px;
  filter: drop-shadow(0px 0px 14px #23ca78);
`;

const SignupProgressBar = ({ step }: { step: number }): JSX.Element => (
  <ProgressBarContainer>
    <ProgressBarGradientWrap step={step}>
      <ProgressBar>Free $25</ProgressBar>
    </ProgressBarGradientWrap>
    <Dollars icon="content:Dollars" alt="coin" className={undefined} />
  </ProgressBarContainer>
);

export default SignupProgressBar;
