import { useState } from 'react';
import styled from 'styled-components';
import Filter from 'components/core/filter';
import { fontMediumLarge } from 'styles/typography';
import Bets from './bets';
import TournamentHistory from './tournament-history';

const HeaderWrapper = styled.div`
  position: absolute;
  width: 100%;
  max-width: 600px;
  z-index: 11;
  background-color: ${({ theme }) => theme.darkest.background.primary};
`;

const Header = styled.h1`
  color: ${({ theme }) => theme.dark.text.primary};
  ${fontMediumLarge};
  margin: 0;
  padding: 16px;
`;

const Content = styled.div`
  padding-top: 98px;
`;

const Activity = (): JSX.Element => {
  const [value, setValue] = useState('bets');

  const onStateChange = (newValue: string): void => {
    setValue(newValue);
  };

  const filterOptions = [
    {
      labelText: 'Bets',
      value: 'bets',
    },
    {
      labelText: 'Tournaments',
      value: 'tournaments',
    },
  ];

  return (
    <div>
      <HeaderWrapper>
        <Header>Activity</Header>
        <Filter
          id="id"
          value={value}
          options={filterOptions}
          onChange={onStateChange}
        />
      </HeaderWrapper>
      <Content>
        {value === 'bets' && <Bets />}
        {value === 'tournaments' && <TournamentHistory />}
      </Content>
    </div>
  )
}

export default Activity;
