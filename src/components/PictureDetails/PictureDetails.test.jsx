import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PictureDetails from './PictureDetails';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('PictureDetails component', () => {
  test('renders image, description, and user info from location.state', () => {
    const mockState = {
      imageSrc: 'test-image.jpg',
      description: 'Test description',
      userName: 'Amir Kamalov',
    };

    
    useLocation.mockReturnValue({ state: mockState });

    render(
      <MemoryRouter>
        <PictureDetails />
      </MemoryRouter>
    );

  
    expect(screen.getByAltText(/selected/i)).toHaveAttribute('src', 'test-image.jpg');
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Amir Kamalov')).toBeInTheDocument();
  });
});
