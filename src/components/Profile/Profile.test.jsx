import { render, screen } from '@testing-library/react';
import Profile from './Profile';
import '@testing-library/jest-dom';

jest.mock('../MyComments/MyComments', () => () => <div data-testid="my-comments" />);
jest.mock('../MyPictures/MyPictures', () => () => <div data-testid="my-pictures" />);

describe('Profile component', () => {
  test('renders profile with name, description, and button', () => {
    render(<Profile />);

    expect(screen.getByText('Amir Kamalov')).toBeInTheDocument();

    expect(screen.getByText(/Something something/i)).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /go to the dialog/i });
    expect(button).toBeInTheDocument();

    const avatar = screen.getByAltText('Profile background');
    expect(avatar).toBeInTheDocument();

    expect(screen.getByTestId('my-comments')).toBeInTheDocument();
    expect(screen.getByTestId('my-pictures')).toBeInTheDocument();
  });
});
