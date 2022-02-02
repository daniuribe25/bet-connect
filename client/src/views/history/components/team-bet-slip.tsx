/* eslint-disable guard-for-in */
import { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useApolloClient } from '@apollo/client';
import { Box } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { RootState } from 'redux/root-reducer';
import { getBetHistory, getTeams } from 'redux/actions/lobby-actions';
import { useBetTasksStyles } from 'styles/index';
import useAlerts from 'hooks/use-alerts';
import useChannels from 'hooks/use-channels';
import { UserBetHistoryType } from 'helpers/pl-types';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { setStoreProperty as setSessionStoreProperty } from 'redux/slices/session-slice';
import AvailablePlayersModal from 'components/add-players/available-players-modal';
import TaskList from 'views/lobby/components/task-list/task-list';
import buildHistory from '../../activity/helpers';

const CaptainBetButton = styled.div`
  font-size: 16px;
  color: white;
  padding: 0.7rem;
  text-align: center;
  border-radius: 50px;
  width: 100%;
  background-color: #2F9BD8;
  max-width: 500px;
  margin: 12px;
`;

export const TeamBetSlip: FunctionComponent = () => {
  const dispatch = useDispatch();
  const apollo = useApolloClient();
  const styles = useBetTasksStyles({});
  const {
    alerts,
    betStatus,
    teamId,
    restartSocket,
  } = useSelector(({ lobby }: RootState) => lobby);
  const history = useHistory();
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const teamChannel = useChannels(`team`, teamId);
  const { enqueueSnackbar } = useSnackbar();
  useAlerts(alerts, setStoreProperty);

  useEffect(() => {
    dispatch(getBetHistory({ apollo }));
  }, [getBetHistory]);

  useEffect(() => {
    teamChannel?.off('update');
    teamChannel?.off('new_bet');
    teamChannel?.on('update', async (data: any) => {
      if (data.event === 'update') {
        // TODO - Fix this loop
        // eslint-disable-next-line no-restricted-syntax
        for (const key in data) {
          dispatch(setStoreProperty([key, data[key]]));
        }
      }
      if (data.event === 'disband') {
        enqueueSnackbar(`Team disbanded by the captain`, { variant: 'error' });
        await dispatch(getTeams({ apollo, currentUser }));
        await dispatch(setStoreProperty(['teamUsers', []]));
        dispatch(setStoreProperty(['isCaptain', true]));
        dispatch(setStoreProperty(['restartSocket', restartSocket + 1]));
        dispatch(setStoreProperty(['autoCreateSolo', 1]));
        history.push('/team');
      }
    });
    teamChannel?.on('new_bet', () => {
      setTimeout(async () => {
        const resp: any = await dispatch(getBetHistory({ apollo }));
        const betHistory = resp.payload.betHistory
          .filter((x: any) => x.status === 'WAITING')
          .sort((a: UserBetHistoryType, b: UserBetHistoryType) => {
            const adate = new Date(a.insertedAt);
            const bdate = new Date(b.insertedAt);
            if (adate > bdate) {
              return -1;
            }
            return 1;
          });
        const builtData = buildHistory(betHistory || []);
        await dispatch(setStoreProperty(['openHistoryModal', true]));
        await dispatch(setStoreProperty(['openDetails', builtData[0]]));
        const foundTeammate = betHistory.length ?
          betHistory[0].team?.teammates?.find((teammate: any) => teammate.user.id === currentUser.id) :
          null;
        if (foundTeammate) {
          dispatch(setSessionStoreProperty(['currentUser', foundTeammate]));
        }
      }, 5000);
    });
  }, [teamChannel, currentUser, restartSocket]);


  useEffect(() => {
    teamChannel?.push('update', { event: 'join' });
  }, []);

  return (
    <>
      <Box width="100%" maxWidth="600">
        <TaskList />
        <AvailablePlayersModal teamChannel={teamChannel} />
      </Box>
      <div className={styles.placeBetBtnRoot}>
        {betStatus === 'OPEN' && (
          <CaptainBetButton>
            Your captain will place the bet
          </CaptainBetButton>
        )}
      </div>
    </>
  );
};

export default TeamBetSlip;
