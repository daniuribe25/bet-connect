import { createGlobalStyle } from 'styled-components';
import fontFaces from './font-faces';

const GlobalStyle = createGlobalStyle`
  ${fontFaces}
`;

export default GlobalStyle;
