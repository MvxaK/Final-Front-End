import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import '@testing-library/jest-dom';

describe('Navbar component', () => {
  test('renders all navigation links and logo', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Dialogs/i)).toBeInTheDocument();
    expect(screen.getByText(/Main/i)).toBeInTheDocument();
    expect(screen.getByText(/Users/i)).toBeInTheDocument();
    expect(screen.getByText(/About us/i)).toBeInTheDocument();

    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('play-lh.googleusercontent.com'));
  });
});
