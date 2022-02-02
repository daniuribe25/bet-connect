import styled from 'styled-components';
import Wrap from './index';

const Content = styled.div`
   background-color: white;
   color: black;
   text-align: center;
`;

export const wrap = (): JSX.Element => <Wrap><Content>Content</Content></Wrap>;

export default {
  title: 'Layouts/Wrap',
  component: wrap,
};
