import React from 'react';
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Platforms, UserPlayerTag } from 'helpers/pl-types';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { useSelectPlayersStyles } from 'styles/index';
import PsnIcon from 'assets/images/psn_icon_white.svg';
import XboxIcon from 'assets/images/xbox_icon_white.svg';
import CrownIcon from 'assets/images/crown.svg';
import useChannels from 'hooks/use-channels';
import { findMe } from 'helpers/common';
import { LetterAvatar } from 'components/letter-avatar';

type LobbySeatProps = {
  user: UserPlayerTag;
  isMe: boolean;
};

export const InvitationStatus = {
  pending: 0,
  joined: 1,
  declined: -1,
};

export const LobbySeat: React.FunctionComponent<LobbySeatProps> = (
  props: LobbySeatProps,
) => {
  const css = useSelectPlayersStyles(props);
  const { user, isMe } = props;

  const { teamUsers, lobbySize, isCaptain } = useSelector(
    ({ lobby }: RootState) => lobby,
  );
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const dispatch = useDispatch();
  const userChannel = useChannels(`user`, currentUser?.id);
  const handleRemoveTeammate = (): undefined => {
    if (isCaptain) {
      const newTeamUsers = teamUsers.filter(
        (tu: UserPlayerTag) => tu && tu.userId !== user?.userId,
      );
      newTeamUsers.push(null);

      dispatch(
        setStoreProperty([
          'teamUsers',
          [
            ...newTeamUsers,
            ...new Array(lobbySize - newTeamUsers.length).fill(null),
          ],
        ]),
      );
      userChannel?.push('invite', {
        event: 'kick',
        user_id: user.userId,
        user: findMe(teamUsers, currentUser),
      });
      return;
    }
    userChannel?.push('invite', {
      event: 'leave',
      user_id: teamUsers[0].userId,
      user: findMe(teamUsers, currentUser),
    });
  };

  const OpenSearchPlayer = (): undefined => {
    if (currentUser.privateProfile) return;
    dispatch(setStoreProperty(['searchingPlayers', true]));
  };

  if (!user && isCaptain)
    return (
      <div
        tabIndex={0}
        className={css.containerNoPlayer}
        role="button"
        onClick={OpenSearchPlayer}
        onKeyDown={OpenSearchPlayer}
      >
        <AddCircleOutlineIcon className={css.addPlayer} />
        <span className={css.invitePlayer}>Invite Player </span>
      </div>
    );
  if (!user && !isCaptain)
    return (
      <div className={css.containerNoPlayer}>
        <AddCircleOutlineIcon className={css.addPlayer} />
        <span className={css.invitePlayer}>Invite Player </span>
      </div>
    );

  // const renderStatus = (labelStyle: any) => {
  // if (user.invitationStatus === 0)
  //   return <div className={css.pending} style={labelStyle}>
  //     Pending
  //   </div>
  // if ([0,1,2].includes(user.invitationStatus || 3))
  //   return <div className={css.joined} style={labelStyle}>
  //     Joined
  //   </div>
  // if (user.invitationStatus === -1)
  //   return <div className={css.declined} style={labelStyle}>
  //     Declined
  //   </div>
  // };

  const showX =
    (isCaptain && !isMe) || (!isCaptain && user.userId === currentUser.id);

  // const labelStyle = {
  //   marginRight: (isCaptain || showX) ? 0 : 35
  // };

  const consoleIcon =
    user?.platform?.toLowerCase() === Platforms.psn ? PsnIcon : XboxIcon;

  return (
    <div className={css.container}>
      <div className={css.leftItems}>
        <LetterAvatar name={user.playerTag} />
      </div>
      <div className={css.centerItems}>
        <div className={css.tagContainer}>
          <span className={css.playerName}>
            <img src={consoleIcon} className={css.icon} alt="platform Icon" />
            {user.playerTag}
          </span>
        </div>
        <div className={css.walletText}>
          ${user?.user?.wallet?.funds?.toFixed(2)}
        </div>
      </div>
      <div className={css.rightItems}>
        {/* {renderStatus(labelStyle)} */}
        {showX && (
          <Button className={css.removePlayer} onClick={handleRemoveTeammate}>
            <CloseIcon />
          </Button>
        )}
        {isMe && (
          <div className={css.captain}>
            <img src={CrownIcon} className={css.crownIcon} alt="crown Icon" />
            Captain
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbySeat;
