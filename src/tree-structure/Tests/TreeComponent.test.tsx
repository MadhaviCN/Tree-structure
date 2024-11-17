import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TreeComponent from "../TreeComponent";

// Mock the API response data 
const mockData = [
  {
    taxon: "Family",
    name: "Felidae",
    common_name: "Cat Family",
    children: [
      {
        taxon: "Genus",
        name: "Felis",
        common_name: "Small Cats",
        children: [],
      },
    ],
  },
  {
    taxon: "Family",
    name: "Canidae",
    common_name: "Dog Family",
    children: [],
  },
];

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue(mockData),
});

describe("Tree Component", () => {
  test("renders the search input", async () => {
    render(<TreeComponent />);
    expect(screen.getByPlaceholderText("Search query")).toBeInTheDocument();
  });

  test("renders tree data after fetching", async () => {
    render(<TreeComponent />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const node = await screen.findByText('Felidae');
    expect(node).toBeInTheDocument();
    const canidae= await screen.findByText("Canidae")
    expect(canidae).toBeInTheDocument()
  });

  test("search filters data on input change", async () => {
    render(<TreeComponent />);
    await screen.findByText("Felidae");
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Felis" },
    });
    const canidaeText = await screen.findByText("Canidae");
    expect(canidaeText).toBeInTheDocument();
    const felidaeText = screen.queryByText("Felidae");
    expect(felidaeText).not.toBeInTheDocument();
  });

  test("debounce works correctly", async () => {
    render(<TreeComponent />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Feli" },
    });
    const node = screen.getByDisplayValue("Feli");
    expect(node).toBeInTheDocument();
  });
});
