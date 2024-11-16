import React from "react";
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
  test("renders tree data after fetching", async () => {
    render(<TreeComponent />);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    console.log(screen.debug()); // This will show the current state of the DOM
    await waitFor(() =>
      expect(screen.queryByText("Felidae")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.queryByText("Canidae")).toBeInTheDocument()
    );
  });

  test("search filters data on input change", async () => {
    render(<TreeComponent />);
    await screen.findByText("Felidae");
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Felis" },
    });
    console.log("screen", screen.debug());
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

    // Wait for debounce delay to pass
    await waitFor(() =>
      expect(screen.getByText("Felidae")).toBeInTheDocument()
    );
    expect(screen.getByText("Felidae")).toBeInTheDocument();
  });
});
