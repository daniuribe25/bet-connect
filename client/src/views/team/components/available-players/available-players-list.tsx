import { useState, useEffect, FunctionComponent } from 'react';

import { InputAdornment, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/CloseOutlined';
import { useSelector } from 'react-redux';
import { UserPlayerTag } from '../../../../helpers/pl-types';
import PlayerTag from './player-tag';
import { useSelectPlayersStyles } from '../../../../styles';

const AvailablePlayersList: FunctionComponent = () => {
  const classes = useSelectPlayersStyles();
  const { playerList, teamUsers } = useSelector(({ lobby }: any) => lobby);
  const [searchValue, setSearchValue] = useState<any | null>('');
  const [filteredUsers, setFilteredUsers] = useState<UserPlayerTag[]>(
    playerList,
  );
  const getTeammatesIds = (): any =>
    teamUsers.map((us: UserPlayerTag) => us?.userId);

  const handleFilterUsers = ({ target }: any): any => {
    const idsSelected = getTeammatesIds();
    setSearchValue(target.value);
    setFilteredUsers(
      playerList.filter(
        (x: UserPlayerTag) =>
          x.playerTag.toLowerCase().includes(target.value.toLowerCase()) &&
          !idsSelected.includes(x.userId),
      ),
    );
  };

  const handleClearSearch = (userId?: string): void => {
    setSearchValue('');
    const idsSelected = [...getTeammatesIds(), userId];
    setFilteredUsers(
      playerList.filter((x: UserPlayerTag) => !idsSelected.includes(x.userId)),
    );
  };

  useEffect(() => setFilteredUsers(playerList), [playerList.length]);

  return (
    <>
      <div className={classes.cont}>
        <div className={classes.inputFilter}>
          <TextField
            onChange={handleFilterUsers}
            value={searchValue}
            label="Search"
            margin="normal"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment
                  onClick={() => handleClearSearch()}
                  className={classes.clearIcon}
                  position="start"
                >
                  <CloseIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {filteredUsers.map((userPlayerTag) => (
          <PlayerTag
            key={`${userPlayerTag.platform}-${userPlayerTag.playerTag}`}
            onSelect={handleClearSearch}
            user={userPlayerTag}
          />
        ))}
      </div>
    </>
  );
};

export default AvailablePlayersList;
