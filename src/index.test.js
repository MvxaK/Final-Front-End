import React from 'react';
import * as ReactDOM from 'react-dom/client';

jest.mock('./App', () => () => <div>Mocked App</div>);
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(),
}));

describe('index.js', () => {
  it('calls createRoot and renders App', () => {
    const rootMock = { render: jest.fn() };
    ReactDOM.createRoot.mockReturnValue(rootMock);

    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    require('./index');

    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);
    expect(rootMock.render).toHaveBeenCalled();
  });
});
