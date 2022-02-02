import { render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import Wrapper from './test-wrapper';

const customRender = (node, options) => {
  const rendered = render(node, options);
  const element = rendered.container.firstChild;

  return { element, ...rendered };
};

const renderWithData = (initialNode, options = {}) => {
  const toRender = (node, renderOptions) => (
    <Wrapper {...renderOptions}>{node}</Wrapper>
  );

  const rendered = customRender(toRender(initialNode, options));

  const rerender = (rerenderNode, rerenderOptions) =>
    customRender(toRender(rerenderNode, rerenderOptions), {
      container: rendered.container,
    });

  return { ...rendered, rerender };
};

const staticRender = (node) => {
  global.window = {
    location: { href: '/' },
    addEventListener: () => {},
  };

  const toRender = <Wrapper>{node}</Wrapper>;

  return renderToStaticMarkup(toRender);
};

const delay = (timeout = 0) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

export * from '@testing-library/react';
export {
  renderWithData as render,
  staticRender,
  delay,
};
