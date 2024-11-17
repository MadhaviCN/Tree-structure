import { render, screen, fireEvent } from "@testing-library/react";
import TreeNodeComponent from "../TreeNodeComponent";

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
    test("renders the root node", () => {
      render(<TreeNodeComponent node={mockNode} />);
      expect(screen.getByText("Felidae")).toBeInTheDocument();
    });
  
    test("renders child nodes when expanded", () => {
      render(<TreeNodeComponent node={mockNode} />);
      const toggleButton = screen.getByText("+");
      fireEvent.click(toggleButton);
      expect(screen.getByText("Felis catus")).toBeInTheDocument();
    });
  
    test("handles initialOpenNodes prop correctly", () => {
      render(
        <TreeNodeComponent
          node={mockNode}
          initialOpenNodes={["Felidae"]}
        />
      );
      expect(screen.getByText("Felis catus")).toBeInTheDocument();
    });
  
    test("invokes onClick callback when a node is toggled", () => {
      const mockOnClick = jest.fn();
      render(<TreeNodeComponent node={mockNode} onClick={mockOnClick} />);
      const toggleButton = screen.getByText("+");
      fireEvent.click(toggleButton);
      expect(mockOnClick).toHaveBeenCalledWith(mockNode);
    });
  
    test("handles arrow key navigation", () => {
      render(<TreeNodeComponent node={mockNode} />);
      const toggleButton = screen.getByText("+");
      fireEvent.keyDown(toggleButton, { key: "ArrowRight" });
      expect(screen.getByText("Felis catus")).toBeInTheDocument();
      fireEvent.keyDown(toggleButton, { key: "ArrowLeft" });
      expect(screen.queryByText("Felis catus")).not.toBeInTheDocument();
    });
  
    test("applies custom styles to the toggle button", () => {
      const treeStyle = { backgroundColor: "red" };
      render(<TreeNodeComponent node={mockNode} style={treeStyle} />);
      const toggleButton = screen.getByText("+");
      expect(toggleButton).toHaveStyle("background-color: red");
    });
});