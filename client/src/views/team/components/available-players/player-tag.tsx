import { FunctionComponent } from 'react';
import { ListItemText } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlayerTag } from '../../../../helpers/pl-types';
import { setStoreProperty } from '../../../../redux/slices/lobby-slice';
import { useSelectPlayersStyles } from '../../../../styles';

type PlayertagProps = {
  user: UserPlayerTag;
  onSelect?: (userId: string) => void;
};

const PlayerTag: FunctionComponent<PlayertagProps> = (props) => {
  const { user, onSelect } = props;
  const dispatch = useDispatch();
  const styles = useSelectPlayersStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { teamUsers, lobbySize } = useSelector(({ lobby }: any) => lobby);

  // eslint-disable-next-line consistent-return
  const handleAddUser = (): any => {
    const addedUsers = teamUsers.filter((tu: UserPlayerTag) => tu);
    if (addedUsers.length === lobbySize)
      return enqueueSnackbar('Lobby is full', { variant: 'error' });

    const newTeamUsers = [...teamUsers];
    newTeamUsers[addedUsers.length] = user;

    dispatch(setStoreProperty(['teamUsers', newTeamUsers]));

    // eslint-disable-next-line no-unused-expressions
    onSelect && onSelect(user.userId);
  };

  return (
    <ListItem onClick={handleAddUser} classes={{ root: styles.tagRoot }}>
      <ListItemText
        className={styles.tagText}
        primary={`(${user.platform}) - ${user.playerTag}`}
      />
      <Tooltip title="Invite to squad" arrow placement="left">
        <AddIcon className={styles.tagIcon} onClick={handleAddUser} />
      </Tooltip>
    </ListItem>
  );
};

export default PlayerTag;
