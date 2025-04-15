import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

jest.mock('./components/Navbar/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('./components/Profile/Profile', () => () => <div data-testid="profile" />);
jest.mock('./components/PictureDetails/PictureDetails', () => () => <div data-testid="picture-details" />);

describe('App routing', () => {
  test('renders Profile component on default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('profile')).toBeInTheDocument();
  });

  test('renders PictureDetails component on /picture/:id route', () => {
    render(
      <MemoryRouter initialEntries={['/picture/123']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('picture-details')).toBeInTheDocument();
  });
});
