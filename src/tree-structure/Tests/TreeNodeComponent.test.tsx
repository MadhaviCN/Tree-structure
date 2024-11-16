import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from 'react';
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
      },
      {
        taxon: 'Species',
        name: 'Felis silvestris',
        common_name: 'Felis silvestris',
        children: [],
      },
    ],
  };

  describe('TreeNodeComponent', () => {
    test('renders node name and children', () => {
      render(<TreeNodeComponent node={mockNode} />);
      expect(screen.getByText('Felidae')).toBeInTheDocument();
      expect(screen.queryByText('Felis catus')).toBeNull();
      expect(screen.queryByText('Felis silvestris')).toBeNull();
    });

    test('expand and collapse node on button click', () => {
      render(<TreeNodeComponent node={mockNode} />);
      const toggleButton = screen.getByRole('button')
      fireEvent.click(toggleButton);
      expect(screen.getByText('Felis catus')).toBeInTheDocument()
      expect(screen.getByText('Felis silvestris')).toBeInTheDocument()
      fireEvent.click(toggleButton)
      expect(screen.getByText('Felidae')).toBeInTheDocument()
    });

    test('expand and collapse using arrow keys', () => {
      render(<TreeNodeComponent node={mockNode} />);
  
      const toggleButton = screen.getByRole('button');
      // onclick on right arrow, node shoudl expand
      fireEvent.keyDown(toggleButton, { key: 'ArrowRight' });
  
      expect(screen.getByText('Felis catus')).toBeInTheDocument();
      expect(screen.getByText('Felis silvestris')).toBeInTheDocument();
      // on click of left arrow, node should collapse
      fireEvent.keyDown(toggleButton, { key: 'ArrowLeft' });
  
      expect(screen.queryByText('Felis catus')).toBeNull();
      expect(screen.queryByText('Felis silvestris')).toBeNull();
    });
});