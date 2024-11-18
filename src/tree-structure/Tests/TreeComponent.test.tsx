import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TreeComponent from "../Components/TreeComponent";
import TreeNodeComponent from "../Components/TreeNodeComponent";
import { TreeTaxonomyProps } from "../types";

// Mocking TreeNodeComponent
jest.mock("../Components/TreeNodeComponent", () => ({
  __esModule: true, // this is used as we are importing TreeNodeComponent, we need to use it as an ES6 module
  default: jest.fn(({ node }) => <div>{node.name}</div>),
}));

describe("TreeComponent", () => {
    const mockData: TreeTaxonomyProps[] = [
      {
      "taxon": "Family",
      "name": "Felidae",
      "common_name": "Cat Family",
      "children": [
        {
          "taxon": "Genus",
          "name": "Felis",
          "common_name": "Small Cats",
          "children": []
        },
      ]
      },
      {
        "taxon": "Family",
        "name": "Canidae",
        "common_name": "Dog Family",
        "children": [] },
    ];

    beforeEach(() => {
      // Spying on fetch method
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);
    });

    afterEach(() => {
      jest.restoreAllMocks();
  });

    // Checking for Search query placeholder and when we type Feidae, expects to have all the nodes related to Felidae
    test("filters nodes based on search query", async () => {
        render(<TreeComponent />)

        await waitFor(() => expect(fetch).toHaveBeenCalled());

        const searchField = screen.getByPlaceholderText("Search query");
        fireEvent.change(searchField, { target: { value: "Felidae" } });

        await waitFor(() => {
            expect(TreeNodeComponent).toHaveBeenCalledWith(
                expect.objectContaining({ node: mockData[0] }),
                expect.anything()
            );
        });
    });

     // Checking for Search query placeholder and when we type Canidae, expects to have all the nodes related to Canidae
    test("implements debounce correctly", async () => {
      jest.advanceTimersByTime(300);
        render(<TreeComponent />);

        const searchField = screen.getByPlaceholderText("Search query");
        fireEvent.change(searchField, { target: { value: "Canidae" } });

        expect(screen.queryByText("TreeNodeComponent")).toBeNull();

        jest.advanceTimersByTime(300);
        await waitFor(() => {
            expect(TreeNodeComponent).toHaveBeenCalledWith(
                expect.objectContaining({ node: mockData[0] }),
                expect.anything()
            );
        });
      })
});
