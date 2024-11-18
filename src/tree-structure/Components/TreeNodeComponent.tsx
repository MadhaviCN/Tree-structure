import React, { useEffect, useState } from "react";
import { TreeTaxonomyProps } from "../types";


/**
 * It represent the properties of Taxonomy data
 * Nodes:
 * taxon {string}
 * name {string}
 * common_name {string}
 * children {TaxonomyProps}
 * initialOpenNodes - optional {string}
 * onClick - optional {TaxonomyProps} - return void
 * @interface TaxonomyProps
 * @typedef {TaxonomyProps}
 */
interface TaxonomyProps {
  node: TreeTaxonomyProps;
  initialOpenNodes?: string[];
  onClick?: (node: TreeTaxonomyProps) => void; // custom onclick handler
  style?: React.CSSProperties
}

/**
 * Tree Node Component
 * A React component that renders expanding and collapsing of nodes 
 * Features:
 * - Expand and collapsing the nodes
 * - Keyboard functionality using right and left arrow for expanding and collapsing of nodes
 * - Custom clicks and styles
 * @type {React.FC<TaxonomyProps>}
 */
const TreeNodeComponent: React.FC<TaxonomyProps> = React.memo(({ node, initialOpenNodes, onClick, style }) => {

    // state to store boolean value 
  const [isExpanded, setIsExpanded] = useState(false);

  /*
  * This useEffect is to expand and the intial value on page load
  */
  useEffect(() => {
    if(initialOpenNodes?.includes(node.name)) {
      setIsExpanded(true)
    }
  }, [initialOpenNodes, node.name])
 
  /** Function is written to expand and collapse the nodes */
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    // If a custom onClick is provided, invoke it
    if (onClick) {
      onClick(node);
    }
  };

  /**
   * arrowKeyPress()
   * Function to expand and collapse on keyboard events (arrow keys right and left)
   * @param {React.KeyboardEvent} event
   */
  const arrowKeyPress = (event: React.KeyboardEvent) => {
        if(event.key === "ArrowRight" && !isExpanded) {
          // expand on right arrow
            setIsExpanded(true)
        } else if(event.key === "ArrowLeft" && isExpanded) {
          // collapse on left arrow
            setIsExpanded(false)
        } else {
          setIsExpanded(false)
        }
  } 

  return (
    <div style={{ marginLeft: "10%" }}>
      <div style={{display: "flex", padding:"10px"}}>
        {node?.children && node?.children?.length > 0 && (
          <button onClick={handleToggle} style={{ marginRight: "20px", fontSize:"medium", ...style}} onKeyDown={arrowKeyPress}
          aria-label={isExpanded ?  '-' : '+'}>
            {isExpanded ?  '-' : '+'}
          </button>
        )}
        {node?.name}
      </div>
      {isExpanded && node?.children && (
        <div>
          {node?.children?.map((child) => (
            <TreeNodeComponent key={child.taxon} node={child} initialOpenNodes={initialOpenNodes} onClick={onClick} style={style}/>
          ))}
        </div>
      )}
    </div>
  );
});

export default TreeNodeComponent;
