import {
  capitalize,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import MUIDrawer from '@material-ui/core/Drawer';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { logout, logout as logoutLobby } from 'redux/slices/session-slice';
import { useLayoutStyles } from 'styles/index';
import { RootState } from 'redux/root-reducer';
import useChannels from 'hooks/use-channels';
import Pill from 'components/core/pill';
import { findMe, getUserPlatform } from 'helpers/common';
import { disbandTeam } from 'redux/actions/lobby-actions';
import { resetIdentity, trackLogOut } from 'helpers/segment-analytics';
import storage, { AUTH_TOKEN, TEAM_ID, VERIFYING_AGE } from 'helpers/storage';
import {
  StyledLink,
  Icon,
  LinksWrapper,
  TextDivider,
  TopMenuWrapper,
  UserWrapper,
  UserCircle,
  UserInfo,
  Balance,
} from './drawer.styles';

const MainButton = styled(Pill)`
  margin-top: 16px;
`;

interface DrawerProps {
  open: boolean;
  closeDrawer: () => void;
}

const Drawer = ({ open, closeDrawer }: DrawerProps): JSX.Element => {
  const styles = useLayoutStyles({});
  const history = useHistory();
  const dispatch = useDispatch();
  const apollo = useApolloClient();
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const { isCaptain, teamUsers } = useSelector(({ lobby }: RootState) => lobby);
  const userChannel = useChannels(`user`, currentUser?.id);

  const disbandLobby = (): void => {
    if (isCaptain) {
      teamUsers
        .filter((u) => u)
        .forEach((user) => {
          userChannel?.push('invite', {
            event: 'kick',
            user_id: user.userId,
            user: findMe(teamUsers, currentUser),
            reason: 'disband',
          });
        });
    }
  };

  const handleLogout = async (): Promise<void> => {
    (window as any).Intercom('shutdown');
    trackLogOut();
    resetIdentity();
    if (isCaptain)
      await dispatch(
        disbandTeam({ apollo, withoutTeam: true, showAlert: false }),
      );
    disbandLobby();
    storage.remove(AUTH_TOKEN);
    storage.remove(TEAM_ID);
    storage.remove(VERIFYING_AGE);
    dispatch(logout());
    dispatch(logoutLobby());
    history.push('/login');
  };

  const goToAddFunds = (): void => history.push('/addFunds');

  const handleOpenIntercom = (): void => {
    (window as any).Intercom('show');
    closeDrawer();
  };

  const handleGoTo = (route: string): void => {
    history.push(route);
    closeDrawer();
  };

  const playerTag = useMemo(
    () => getUserPlatform(currentUser).username,
    [currentUser],
  );

  const usernameFirstLetter = playerTag ? capitalize(playerTag[0]) : '';

  const accountBalance = `$${currentUser?.wallet?.funds?.toFixed(2)}`;

  return (
    <>
      <MUIDrawer
        onClose={closeDrawer}
        classes={{
          paper: styles.drawerPaper,
        }}
        {...{ open }}
      >
        <List>
          <TopMenuWrapper>
            <UserWrapper>
              <UserCircle>{usernameFirstLetter}</UserCircle>
              <UserInfo>
                <span>{playerTag}</span>
                <Balance>{accountBalance}</Balance>
              </UserInfo>
            </UserWrapper>
            <MainButton variant="success" onClick={goToAddFunds}>Add funds</MainButton>
          </TopMenuWrapper>
          <Divider />
          <ListItem
            button
            className={styles.listItem}
            onClick={handleOpenIntercom}
          >
            <Icon icon="platform:intercom" />
            <ListItemText primary="Support" />
          </ListItem>
          <Divider />
          <ListItem
            button
            className={styles.listItem}
            onClick={() => handleGoTo('/faq')}
          >
            <Icon icon="content:rules" />
            <ListItemText primary="FAQ" />
          </ListItem>
          <Divider />
          <ListItem
            button
            className={styles.listItem}
            onClick={() => handleGoTo('/setNewPassword')}
          >
            <Icon icon="status:locked" />
            <ListItemText primary="Change Password" />
          </ListItem>
          <Divider />
          <ListItem button className={styles.listItem} onClick={handleLogout}>
            <Icon icon="action:cancelMatch" />
            <ListItemText primary="Log out" />
          </ListItem>
          <Divider />
        </List>
        <LinksWrapper>
          <StyledLink
            href="https://playerslounge.co/terms"
            target="_blank"
            rel="noreferrer"
          >
            Terms of service
          </StyledLink>
          <TextDivider>{' | '}</TextDivider>
          <StyledLink
            href="https://playerslounge.co/privacy"
            target="_blank"
            rel="noreferrer"
          >
            Privacy policy
          </StyledLink>
        </LinksWrapper>
      </MUIDrawer>
    </>
  );
};

export default Drawer;
