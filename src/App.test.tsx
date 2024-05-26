import App from "./App";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";

describe("App component", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
  });

  interface LocalStorageMock {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    clear: () => void;
  }

  const localStorageMock: LocalStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });

  test("renders initial (Card Create New Task)", () => {
    const { getByText } = render(<App />);
    expect(getByText("Create New Task")).toBeInTheDocument();
  });

  test("renders initial (Card Create To-Do List)", () => {
    const { getByText } = render(<App />);
    expect(getByText("To-Do List")).toBeInTheDocument();
  });

  test("renders initial (input Due Date)", () => {
    const { getByText } = render(<App />);
    expect(getByText("Due Date")).toBeInTheDocument();
  });

  test("renders initial (input Description)", () => {
    const { getByText } = render(<App />);
    expect(getByText("Description")).toBeInTheDocument();
  });

  test("renders initial (button Create)", () => {
    const { getByText } = render(<App />);
    expect(getByText("Create")).toBeInTheDocument();
  });

  test("Adds a new task", async () => {
    const { getByText, getByPlaceholderText, getByRole } = render(
      <App />
    );

    const datePicker = getByPlaceholderText("Select date");
    fireEvent.change(datePicker, { target: { value: "2024-06-01" } });

    const descriptionInput = getByPlaceholderText("Description");
    fireEvent.change(descriptionInput, {
      target: { value: "Task description" },
    });

    const createButton = getByRole("button", { name: "Create" });
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(getByText("No Data")).toBeInTheDocument();
      expect(getByText("Task description")).toBeInTheDocument();
    });
  });
});
