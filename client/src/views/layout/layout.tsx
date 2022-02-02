import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from 'redux/root-reducer';
import { getUserPlatform } from 'helpers/common';
import NotStatsBanner from 'components/not-stats-banner';
import Wrap from '../../layouts/wrap';
import OpenDrawerButton from './drawer/open-drawer-button';
import HelpButton from './help-button';
import MenuTabs from './menu-tabs';

const PageContent = styled.div`
  overflow-y: scroll;
  height: 100%;
  display: flex;
  flex-direction: column;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

const TopBarWrapper = styled.div`
  padding: 16px;
`;

const hiddenTopBarRoutes = ['/addFunds', '/noStats', '/updateGamerTag', '/tournaments', '/tournament/', 'activity'];
const hiddenBottomBarRoutes = ['/addFunds', '/noStats', '/updateGamerTag', '/tournament/'];

const Layout: FunctionComponent = ({ children }) => {
  const { currentUser } = useSelector(({ session }: RootState) => session);

  const { isCaptain, teamId, openTeamModal } = useSelector(
    ({ lobby }: RootState) => lobby,
  );
  const location = useLocation();

  const showTopBar = !hiddenTopBarRoutes.some(route => location?.pathname.includes(route))
  const showBottomBar = !hiddenBottomBarRoutes.some(route => location?.pathname.includes(route))

  const showNoStatsBanner = currentUser?.privateProfile && location.pathname !== '/noStats';

  return (
    <Wrap>
      {showNoStatsBanner && (
        <NotStatsBanner gamerTag={getUserPlatform(currentUser).username} />
      )}
      {showTopBar && (
        <TopBarWrapper>
          <OpenDrawerButton />
          <HelpButton />
        </TopBarWrapper>
      )}
      <PageContent>{children}</PageContent>
      {showBottomBar && (
        <MenuTabs
          isCaptain={isCaptain}
          currentUser={currentUser}
          location={location}
          teamId={teamId}
          openTeamModal={openTeamModal}
        />
      )}
    </Wrap>
  );
};

export default Layout;
