import { render, screen, fireEvent } from "@testing-library/react";
import TreeNodeComponent from "../Components/TreeNodeComponent";

// Mock the API response data
const mockNode = {
    taxon: 'Family',
    name: 'Felidae',
    common_name: 'Felidae',
    children: [
      {
        taxon: 'Species',
        name: 'Felis catus',
        common_name: 'Felis catus',
        children: [],
      }
    ],
  };

  describe('TreeNodeComponent', () => {
    // expects Felidae text to be in the document
    test("renders the root node", () => {
      render(<TreeNodeComponent node={mockNode} />);
      expect(screen.getByText("Felidae")).toBeInTheDocument();
    });
  
    // When we click on expand icon, expects to have Felis catus text
    test("renders child nodes when expanded", () => {
      render(<TreeNodeComponent node={mockNode} />);
      const toggleButton = screen.getByText("+");
      fireEvent.click(toggleButton);
      expect(screen.getByText("Felis catus")).toBeInTheDocument();
    });
  
    // Expects Feidae node to be open intially
    test("handles initialOpenNodes prop correctly", () => {
      render(
        <TreeNodeComponent
          node={mockNode}
          initialOpenNodes={["Felidae"]}
        />
      );
      expect(screen.getByText("Felis catus")).toBeInTheDocument();
    });
  
    // Mocking the custom click event on expand icon
    test("invokes onClick callback when a node is toggled", () => {
      const mockOnClick = jest.fn();
      render(<TreeNodeComponent node={mockNode} onClick={mockOnClick} />);
      const toggleButton = screen.getByText("+");
      fireEvent.click(toggleButton);
      expect(mockOnClick).toHaveBeenCalledWith(mockNode);
    });
  
    // Expects right arrow expand node and left arrow collapse it
    test("handles arrow key navigation", () => {
      render(<TreeNodeComponent node={mockNode} />);
      const toggleButton = screen.getByText("+");
      fireEvent.keyDown(toggleButton, { key: "ArrowRight" });
      expect(screen.getByText("Felis catus")).toBeInTheDocument();
      fireEvent.keyDown(toggleButton, { key: "ArrowLeft" });
      expect(screen.queryByText("Felis catus")).not.toBeInTheDocument();
    });
});