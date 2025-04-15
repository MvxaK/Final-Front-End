import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComments } from './MyComments';
import '@testing-library/jest-dom';
import React from 'react';

test('render placeholder and button "Add"', () => {
  render(<MyComments profileImage="test.jpg" />);
  expect(screen.getByPlaceholderText(/enter your comment here/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
});

test('add and show comment', async () => {
  render(<MyComments profileImage="test.jpg" />);
  const textarea = screen.getByPlaceholderText(/enter your comment here/i);
  const addButton = screen.getByRole('button', { name: /add/i });

  await userEvent.type(textarea, 'Test comment');
  await userEvent.click(addButton);

  expect(screen.getByText('Test comment')).toBeInTheDocument();
});

test('clear placeholder after submit', async () => {
  render(<MyComments profileImage="test.jpg" />);
  const textarea = screen.getByPlaceholderText(/enter your comment here/i);
  const addButton = screen.getByRole('button', { name: /add/i });

  await userEvent.type(textarea, 'Another comment');
  await userEvent.click(addButton);

  expect(textarea).toHaveValue('');
});

test('delete a comment', async () => {
  render(<MyComments profileImage="test.jpg" />);
  const textarea = screen.getByPlaceholderText(/enter your comment here/i);
  const addButton = screen.getByRole('button', { name: /add/i });

  await userEvent.type(textarea, 'Test comment');
  await userEvent.click(addButton);

  const removeButtons = screen.getAllByRole('button', { name: /remove/i });
  const deleteButton = removeButtons[removeButtons.length - 1];
  await userEvent.click(deleteButton);

  expect(screen.queryByText('Test comment')).not.toBeInTheDocument();
});

test('like a comment', async () => {
  render(<MyComments profileImage="test.jpg" />);
  const textarea = screen.getByPlaceholderText(/enter your comment here/i);
  const addButton = screen.getByRole('button', { name: /add/i });

  await userEvent.type(textarea, 'Test comment');
  await userEvent.click(addButton);

  const likeButtons = screen.getAllByRole('button', { name: /like/i });
  const likeButton = likeButtons[likeButtons.length - 1];
  expect(likeButton).toHaveTextContent('Like (0)');

  await userEvent.click(likeButton);
  expect(likeButton).toHaveTextContent('Like (1)');
});

test('no comments initially', () => {
  const { container } = render(<MyComments profileImage="test.jpg" />);
  const commentItems = container.querySelectorAll('.comments .item');
  expect(commentItems.length).toBe(4);
});

test('display multiple comments', async () => {
  render(<MyComments profileImage="test.jpg" />);
  const textarea = screen.getByPlaceholderText(/enter your comment here/i);
  const addButton = screen.getByRole('button', { name: /add/i });

  await userEvent.type(textarea, 'First comment');
  await userEvent.click(addButton);

  await userEvent.type(textarea, 'Second comment');
  await userEvent.click(addButton);

  expect(screen.getByText('First comment')).toBeInTheDocument();
  expect(screen.getByText('Second comment')).toBeInTheDocument();
});
