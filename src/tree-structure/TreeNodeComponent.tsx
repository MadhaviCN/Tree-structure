import React, { useState } from "react";
import { TreeTaxonomyProps } from "./types";

/**
 * It represent the properties of Taxonomy data
 * Nodes:
 * taxon {string}
 * name {string}
 * common_name {string}
 * children {TaxonomyProps}
 * @interface TaxonomyProps
 * @typedef {TaxonomyProps}
 */
interface TaxonomyProps {
  node: TreeTaxonomyProps;
}

/**
 * Tree Node Component
 * A React component that renders expanding and collapsing of nodes 
 * Features:
 * - Expand and collapsing the nodes
 * - Keyboard functionality using right and left arrow for expanding and collapsing of nodes
 * @type {React.FC<TaxonomyProps>}
 */
const TreeNodeComponent: React.FC<TaxonomyProps> = React.memo(({ node }) => {

    // state to store boolean value 
  const [isExpanded, setIsExpanded] = useState(false);
 
  /** Function is written to expand and collapse the nodes */
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  /**
   * arrowKeyPress()
   * Function to expand and collapse using arrow keys (right and left)
   * @param {React.KeyboardEvent} event
   */
  const arrowKeyPress = (event: React.KeyboardEvent) => {
        if(event.key === "ArrowRight") {
            setIsExpanded(true)
        } else if(event.key === "ArrowLeft") {
            setIsExpanded(false)
        } else {
            setIsExpanded(false)
        }
  } 

  return (
    <div style={{ marginLeft: "20px" }}>
      <div style={{display: "flex", padding:"10px"}}>
        {node?.children && node?.children?.length > 0 && (
          <button onClick={handleToggle} style={{ marginRight: "20px", fontSize:"medium" }} onKeyDown={arrowKeyPress}>
            {isExpanded ?  '-' : '+'}
          </button>
        )}
        {node?.name}
      </div>
      {isExpanded && node?.children && (
        <div>
          {node?.children?.map((child) => (
            <TreeNodeComponent key={child.taxon} node={child} />
          ))}
        </div>
      )}
    </div>
  );
});

export default TreeNodeComponent;
