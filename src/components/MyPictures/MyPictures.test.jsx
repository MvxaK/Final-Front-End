import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MyPictures from "./MyPictures";
import { MemoryRouter } from "react-router-dom";

jest.mock('react-virtualized', () => {
  const original = jest.requireActual('react-virtualized');
  return {
    ...original,
    AutoSizer: ({ children }) => children({ height: 800, width: 1200 }),
    Masonry: ({ cellRenderer, cellCount }) => (
      <div data-testid="masonry-mock">
        {Array.from({ length: cellCount }).map((_, index) =>
          cellRenderer({ index, key: index, parent: {}, style: {} })
        )}
      </div>
    ),
  };
});

class MockFileReader {
  constructor() {
    this.onloadend = null;
    this.result = 'data:image/png;base64,dummyBase64';
  }

  readAsDataURL(file) {
    if (this.onloadend) {
      this.onloadend();
    }
  }
}

global.FileReader = MockFileReader;

describe("MyPictures", () => {
  test("renders visible images with correct alt text", () => {
    render(
      <MemoryRouter>
        <MyPictures />
      </MemoryRouter>
    );

    const expectedImages = [
      { description: "Nature and bridge" },
      { description: "Beautiful mountain" },
      { description: "Land and sun" }
    ];

    expectedImages.forEach((image) => {
      const imgElement = screen.getByAltText(image.description);
      expect(imgElement).toBeInTheDocument();
    });
  });

  test("adds a new image with description", async () => {
    render(
      <MemoryRouter>
        <MyPictures />
      </MemoryRouter>
    );

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    const input = screen.getByLabelText(/upload file/i);
    const descriptionInput = screen.getByPlaceholderText(/enter picture description/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.change(descriptionInput, { target: { value: 'Test image description' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByAltText('Test image description')).toBeInTheDocument();
    });
  });
});
