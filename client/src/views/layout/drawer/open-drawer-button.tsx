import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import DiscordTag from 'components/discord-tag';
import GameModePicker from 'components/game-mode-picker';
import HamburgerIcon from '@material-ui/icons/Menu';
// import { fontSmall } from 'styles/typography';
import Drawer from './index';

const HamburgerMenuButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  svg {
    fill: white;
  }
`;

// const HelpButton = styled.button`
//   background-color: transparent;
//   border: 1px solid #2F9BD8;
//   color: #2F9BD8;
//   font-family: 'Lato';
//   height: 24px;
//   width: 70px;
//   border-radius: 24px;
//   cursor: pointer;
//   ${fontSmall};
// `;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

export const OpenDrawerButton: FunctionComponent = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  // const handleOpenIntercom = (): void => {
  //   (window as any).Intercom('show');
  // };

  return (
    <>
      <InnerWrapper>
        <div>
          <HamburgerMenuButton onClick={() => setOpenDrawer(true)}>
            <HamburgerIcon />
          </HamburgerMenuButton>
          <DiscordTag />
        </div>
        {/* <HelpButton type="button" onClick={handleOpenIntercom}>HELP</HelpButton> */}
        <GameModePicker />
      </InnerWrapper>
      <Drawer open={openDrawer} closeDrawer={() => setOpenDrawer(false)} />
    </>
  );
};

export default OpenDrawerButton;
