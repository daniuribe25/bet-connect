
import { useContext } from 'react';
import { differenceInSeconds } from 'date-fns';
import HookTimer from 'components/core/hook-timer/hook-timer';
import { CircularProgressbar } from 'react-circular-progressbar';
import { ModalContext } from 'util/modal-context/modal-context';
import {
  Wrapper,
  RightWrapper,
  Title,
  InfoIcon,
  InfoWrapper,
  ProgressWrapper,
} from './index.styles';

type LivePreviewTypes = {
  timer: {
    seconds: number;
    percentage: number;
    minAgo: number;
  },
  endDateTime: string | Date;
}

const InfoComponent = (): JSX.Element => (
  <InfoWrapper>
    <p>The scoreboard shows data from completed matches. It does not update right when you get a kill or when your team is eliminated. Most scores will take about 30 minutes from the time your match started to show up on the board.</p>
    <p>Placement and prize info is based on the data we have available currently. It could change when the scoreboard updates.</p>
  </InfoWrapper>
);

const LivePreview = ({ timer, endDateTime }: LivePreviewTypes): JSX.Element => {
  const context = useContext(ModalContext);

  const openInfoModal = (): void => {
    context?.displaySecondaryModal({
      modalDisplayed: true,
      type: 'center',
      body: <InfoComponent />,
      modalTitle: 'How live scores work',
    })
  }

  const lastUpdatedString = `Updated ${timer.minAgo} minute${timer.minAgo === 1 ? '' : 's'} ago`

  return (
    <Wrapper>
      <div>
        <Title onClick={openInfoModal}>
          <span>Live scores</span>
          <InfoIcon icon="content:information" />
        </Title>
        <HookTimer secondsCountdown={differenceInSeconds(new Date(endDateTime), Date.now())} />
        <span>{' remaining'}</span>
      </div>

      <RightWrapper>
        <ProgressWrapper>
          <CircularProgressbar
            value={timer.percentage}
            strokeWidth={50}
            styles={{
              path: {
                stroke: 'white',
                strokeLinecap: 'butt',
              },
            }}
          />
        </ProgressWrapper>
        <div>{lastUpdatedString}</div>
      </RightWrapper>
    </Wrapper>
  )
}

export default LivePreview;
