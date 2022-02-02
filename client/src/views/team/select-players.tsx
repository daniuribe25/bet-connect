import { FunctionComponent, useEffect, useState } from 'react';
import { CenterSpinner } from 'components/core/loading-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { GameModes } from 'helpers/pl-types';
import { RootState } from 'redux/root-reducer';
import useAlerts from 'hooks/use-alerts';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import {
  createTeam,
  disbandTeam,
} from '../../redux/actions/lobby-actions';

const SelectPlayers: FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    alerts,
    teamUsers,
    isUpdatingTeam,
    teamUsersBackup,
    gameMode,
    pickedCategory,
    squadSize,
    teamUpdated,
    teamId,
    autoCreateSolo,
  } = useSelector(({ lobby }: RootState) => lobby);
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const { enqueueSnackbar } = useSnackbar();
  useAlerts(alerts, setStoreProperty);
  const apollo = useApolloClient();
  const [creatingTeam, setCreatingTeam] = useState(false);

  const handleCreateTeam = async (isSoloTeam: boolean): Promise<undefined> => {
    if (gameMode === GameModes.None) {
      enqueueSnackbar(
        'You have to choose a WZ game mode (CALDERA - REBIRTH ISLAND) from the Map selector',
        { variant: 'error' },
      );
      return;
    }
    if (isUpdatingTeam) {
      const users = teamUsers.filter((tu) => tu);
      if (
        users.length === teamUsersBackup.length &&
        users.every((u) => teamUsersBackup.map((x) => x.userId).includes(u.userId)) &&
        !teamUpdated
      ) {
        dispatch(setStoreProperty(['isUpdatingTeam', false]));
        history.push('/bet');
        dispatch(setStoreProperty(['teamUsersBackup', []]));
        return;
      }
      await dispatch(disbandTeam({ apollo, showAlert: false }));
    }
    const soloTeam = teamUsers.filter(x => x?.userId === currentUser?.id);
    const resp: any = await dispatch(
      createTeam({
        apollo,
        teamUsers: isSoloTeam && soloTeam.length ? soloTeam : teamUsers,
        isUpdatingTeam,
        gameMode: !isSoloTeam ? gameMode : GameModes.Caldera,
        pickedCategory,
        squadSize: isSoloTeam ? 1 : squadSize,
      }),
    );
    if (!resp.payload?.messages?.length) {
      history.push('/bet');
      setCreatingTeam(false);
    }
  };

  useEffect(() => {
    if (autoCreateSolo && !creatingTeam && !teamId && teamUsers?.length > 0) {
      setCreatingTeam(true);
      handleCreateTeam(true);
    }
  }, [autoCreateSolo]);

  return <CenterSpinner size={80} />;
};

export default SelectPlayers;
