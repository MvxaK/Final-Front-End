import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Comments from './Comments';

test('renders comment with message, image and likes', () => {
  render(
    <Comments
      id={1}
      message="Test comment"
      image="test-avatar.png"
      likes={3}
      onRemove={jest.fn()}
      onLike={jest.fn()}
    />
  );

  expect(screen.getByText('Test comment')).toBeInTheDocument();
  expect(screen.getByAltText('avatar')).toHaveAttribute('src', 'test-avatar.png');
  expect(screen.getByText('Like (3)')).toBeInTheDocument();
});

test('calls onLike when like button is clicked', () => {
  const onLike = jest.fn();
  render(
    <Comments
      id={1}
      message="Test comment"
      image="test-avatar.png"
      likes={3}
      onRemove={jest.fn()}
      onLike={onLike}
    />
  );

  fireEvent.click(screen.getByText('Like (3)'));
  expect(onLike).toHaveBeenCalledWith(1);
});

test('calls onRemove when remove button is clicked', () => {
  const onRemove = jest.fn();
  render(
    <Comments
      id={1}
      message="Test comment"
      image="test-avatar.png"
      likes={3}
      onRemove={onRemove}
      onLike={jest.fn()}
    />
  );

  fireEvent.click(screen.getByText('Remove'));
  expect(onRemove).toHaveBeenCalledWith(1);
});
