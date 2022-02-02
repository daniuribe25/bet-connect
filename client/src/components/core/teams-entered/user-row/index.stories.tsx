import styled from 'styled-components';
import UserRow from '.';

const StoryWrapper = styled.div`
  padding: 16px;
  background-color: #EAF0F5;
`;

const mockUser = {
  playerHandle: 'wooldynasty',
  userId: '1234',
  id: '1',
  balancePaid: true,
}

export const userRow = (): JSX.Element => (
  <StoryWrapper>
    <UserRow user={mockUser} />
  </StoryWrapper>
);

export default {
  title: 'Components/Core/Teams Entered/User row',
  component: userRow,
};
