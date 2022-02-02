import 'react-phone-input-2/lib/style.css';
import { useHistory } from 'react-router-dom';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import connect from 'assets/images/connect-beta.svg';
import player1 from 'assets/images/player1.png';
import player2 from 'assets/images/player2.png';
import player3 from 'assets/images/player3.png';
import player4 from 'assets/images/player4.png';
import playerCluster from 'assets/images/player-cluster.png';
import payoutOption from 'assets/images/payout-option.png';
import winPreview from 'assets/images/win-preview.png';
import Pill from 'components/core/pill';
import 'views/session/login/login.css';
import {
  Dollar,
  ButtonWrap,
  PlayerImage,
  PlayersImagesWrapper,
  Header,
  BottomSectionWrapper,
  PlayersClusterImage,
  SecondaryHeader,
  TextWrapper,
  SectionDescription,
  BottomSection,
  PayoutImage,
  WinPreviewImage,
  PageHeader,
  PageWrapper,
  TopSection,
  PromoWrapper,
  InnerPromoWrapper,
  PromoDescription,
  BetsWrapper,
  MiddleSection,
  BetRow,
  BetWrapper,
  Winnings,
  BetRowTransparent,
} from './landing-page.styles';

const LandingPage = (): JSX.Element => {
  const history = useHistory();

  const handleHaveAccount = (): void => history.push('/login');
  const handleGetStarted = (): void => history.push('/register');

  return (
    <PageWrapper>
      <TopSection>
        <img src={connect} alt="PL Connect Logo" />
        <span onClick={handleHaveAccount} onKeyPress={handleHaveAccount} role="button" tabIndex={0}>
          Log in
        </span>
      </TopSection>

      <PageHeader>
        <Header>Bet on your Warzone skills</Header>
        <span>Complete solo or team challenges<br />to win cash</span>
      </PageHeader>

      <MiddleSection>
        <PlayersImagesWrapper>
          <PlayerImage src={player1} alt="Player one" />
          <PlayerImage src={player2} alt="Player two" />
          <PlayerImage src={player3} alt="Player three" />
          <PlayerImage src={player4} alt="Player four" />
        </PlayersImagesWrapper>

        <BetsWrapper>
          <BetWrapper>
            <BetRow>
              <div>
                <CheckCircleIcon />
                <span>Get 8 kills</span>
              </div>
              <span>$20</span>
            </BetRow>
            <BetRow>
              <div>
                <CheckCircleIcon />
                <span>score 2500+ damage</span>
              </div>
              <span>$16</span>
            </BetRow>
            <BetRowTransparent>
              <div>
                <RadioButtonUncheckedOutlinedIcon />
                <span>finish 1st</span>
              </div>
              <span>$200</span>
            </BetRowTransparent>
          </BetWrapper>

          <Winnings>
            <span>winnings:  </span>
            <span>$36.00</span>
          </Winnings>
        </BetsWrapper>
      </MiddleSection>

      <PromoWrapper>
        <InnerPromoWrapper>
          <Dollar icon="content:Dollars" alt="Dollar Stack" />
          <Header>$25 FREE</Header>
          <PromoDescription>When you sign up, no deposit required</PromoDescription>
        </InnerPromoWrapper>
      </PromoWrapper>

      <BottomSection>
        <Header>How to play</Header>
        <BottomSectionWrapper>
          <TextWrapper>
            <SecondaryHeader>Invite friends to PL Connect</SecondaryHeader>
            <SectionDescription>{"We'll give your first 5 friends that sign up $25 each!"}</SectionDescription>
          </TextWrapper>
          <PlayersClusterImage src={playerCluster} alt="Player Cluster" />
        </BottomSectionWrapper>
        <BottomSectionWrapper>
          <TextWrapper>
            <SecondaryHeader>{"Bet on your team's next game"}</SecondaryHeader>
            <SectionDescription>{"Bet on your team's kills, damage, and completed contracts in Caldera or Rebirth Island"}</SectionDescription>
          </TextWrapper>
          <PayoutImage src={payoutOption} alt="Payout option preview" />
        </BottomSectionWrapper>
        <BottomSectionWrapper>
          <TextWrapper>
            <SecondaryHeader>Play Warzone, win your cash</SecondaryHeader>
            <SectionDescription>{`When your match ends we pay out for any bets your team completed`}</SectionDescription>
          </TextWrapper>
          <WinPreviewImage src={winPreview} alt="Win preview" />
        </BottomSectionWrapper>
      </BottomSection>

      <ButtonWrap>
        <Pill variant="success" onClick={handleGetStarted}>Get started</Pill>
      </ButtonWrap>
    </PageWrapper>
  );
};

export default LandingPage;
