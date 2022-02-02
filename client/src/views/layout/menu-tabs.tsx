/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent } from 'react';
import SVG from 'assets/images/svgs';
import styled from 'styled-components';
import { fontSmaller } from 'styles/typography';
import { useDispatch } from 'react-redux';
import useChannels from 'hooks/use-channels';
import { useHistory } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PlayIcon from '@material-ui/icons/GamesOutlined';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import AvailablePlayersModal from 'components/add-players/available-players-modal';
import TeamTab from 'components/team-tab';
import BetGame from 'views/lobby/bet-game';
import {
  trackClickedBetsTab,
  trackClickedPlayTab,
} from 'helpers/segment-analytics';

const TabsWrapper = styled.div`
  width: 100%;
  background-color: #0C273A;
  display: flex;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  flex-direction: column;
`;

const Icon = styled(SVG)`
  height: 24px;
  width: 24px;
  fill: ${({ highlightRoute, location }) => {
    return highlightRoute?.includes(location?.pathname)
        ? '#FFFFFF'
        : '#3F7193'
  }};
`;

const IconButton = styled.div<{highlightRoute?: Array<string>, location?: any, openTeamModal?: boolean}>`
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 1;
  ${fontSmaller};
  color: ${({ highlightRoute, location }) => {
    return highlightRoute?.includes(location?.pathname)
        ? '#FFFFFF'
        : '#3F7193'
  }};

  > svg {
    margin-bottom: 2px;
  }
`;

const InnerWrapper = styled.div`
  display: flex;
`;

const hideOn = ['/addFunds'];

const MenuTabs: FunctionComponent<any> = ({ isCaptain, currentUser, location, teamId }: any) => {
  const teamChannel = useChannels(`team`, teamId);

  const dispatch = useDispatch();
  const history = useHistory();

  const playOnPress = (): void => {
    if (!isCaptain) history.push('/activeBet');
    trackClickedPlayTab();
    if (['/team', '/bet', '/activeBet'].includes(location.pathname)) {
      history.push(location.pathname);
    } else {
      history.push('/bet');
    }
    dispatch(setStoreProperty(['openTeamModal', false]));
    dispatch(setStoreProperty(['openHistoryModal', false]));
  }

  const activityOnClick = (): void => {
    trackClickedBetsTab();
    history.push('/activity')
  }

  return !hideOn.includes(location?.pathname) ? (
    <TabsWrapper>
      {location?.pathname === '/bet' && (
        <BetGame />
      )}
      <InnerWrapper>
       <IconButton
          tabIndex={0}
          role="button"
          onClick={() => history.push('/addFunds')}
          onKeyPress={() => history.push('/addFunds')}
        >
          <AddCircleOutlineIcon />
          <span>{`$${currentUser?.wallet?.funds.toFixed(2)}`}</span>
        </IconButton>

        <IconButton
          highlightRoute={['/tournaments']}
          location={location}
          tabIndex={0}
          role="button"
          onClick={() => history.push('/tournaments')}
          onKeyPress={() => history.push('/tournaments')}
        >
          <Icon highlightRoute={['/tournaments']} location={location} icon="content:trophyOutline" />
          <span>Tournaments</span>
        </IconButton>

        <IconButton
          highlightRoute={['/team', '/bet', '/activeBet']}
          location={location}
          tabIndex={0}
          role="button"
          onClick={playOnPress}
          onKeyPress={playOnPress}
        >
          <PlayIcon />
          <span>Play</span>
        </IconButton>
        <IconButton
          highlightRoute={['/activity']}
          location={location}
          tabIndex={0}
          role="button"
          onClick={activityOnClick}
          onKeyPress={activityOnClick}
        >
          <Icon highlightRoute={['/activity']} location={location} icon="content:rules" />
          <span>Activity</span>
        </IconButton>
        {teamId && (
          <IconButton tabIndex={0} role="button">
           <TeamTab />
           <span>Team</span>
          </IconButton>
        )}
        </InnerWrapper>
        <AvailablePlayersModal teamChannel={teamChannel}/>
    </TabsWrapper>
  ) : null;
};

export default MenuTabs;
