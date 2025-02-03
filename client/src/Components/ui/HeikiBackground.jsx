import React from "react";

/**
 * HeikiBackground component generates a subtle background pattern with either a grid or building-like blocks.
 * It supports random shapes for added visual interest.
 *
 * NOTE: Ensure the parent element has `relative` positioning.
 * Any child elements other than HeikiBackground should also have `relative` positioning.
 * 
 * @param {string} primaryColor - The primary color for the pattern (default: "#00895e").
 * @param {string} secondaryColor - The secondary color for the pattern (default: "#2f8d46").
 * @param {string} backgroundColor - The background color (default: "#ffffff").
 * @param {number} opacity - The opacity of the shapes and blocks (default: 0.1).
 * @param {string} density - The density of the shapes ('sparse', 'medium', 'dense') (default: 'medium').
 * @param {string} pattern - The pattern type ('grid' or 'blocks') (default: 'blocks').
 */
const HeikiBackground = ({
  primaryColor = "#00895e",
  secondaryColor = "#2f8d46",
  backgroundColor = "#ffffff",
  opacity = 0.1,
  density = "medium", // 'sparse', 'medium', 'dense'
  pattern = "blocks", // 'grid' or 'blocks'
}) => {
  // Generate random positions for shapes
  const getRandomShapes = () => {
    const densityMap = {
      sparse: 24,
      medium: 40,
      dense: 64,
    };

    const count = densityMap[density] || densityMap.medium;
    const shapes = [];

    for (let i = 0; i < count; i++) {
      const shape = {
        type: Math.random() > 0.7 ? "square" : "dot",
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        rotation: Math.random() * 45,
        size: Math.random() * (10 - 4) + 4,
        color: Math.random() > 0.5 ? primaryColor : secondaryColor,
      };
      shapes.push(shape);
    }

    return shapes;
  };

  // Generate random blocks for the buildings pattern
  const getRandomBlocks = () => {
    const blocks = [];
    const columns = 12; // Number of columns
    const maxHeight = 8; // Maximum number of blocks in height

    for (let col = 0; col < columns; col++) {
      const height = Math.floor(Math.random() * maxHeight) + 3; // Minimum 3 blocks high
      for (let row = 0; row < height; row++) {
        blocks.push({
          x: `${(col / columns) * 100}%`,
          y: `${100 - (row + 1) * (100 / maxHeight)}%`,
          width: `${(1 / columns) * 100}%`,
          height: `${(1 / maxHeight) * 100}%`,
          opacity: Math.random() * 0.04 + 0.02, // Random opacity between 0.02 and 0.06
          color: Math.random() > 0.5 ? primaryColor : secondaryColor,
        });
      }
    }

    return blocks;
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Pattern: either grid or blocks */}
      {pattern === "grid" ? (
        // Grid pattern
        <>
          {/* Random ambient shapes (kept for both patterns) */}
          {getRandomShapes().map((shape, index) => (
            <div
              key={`shape-${index}`}
              className="absolute"
              style={{
                left: shape.x,
                top: shape.y,
                opacity,
                transform: `rotate(${shape.rotation}deg)`,
                width: shape.type === "square" ? `${shape.size}px` : "2px",
                height: shape.type === "square" ? `${shape.size}px` : "2px",
                backgroundColor: shape.color,
                borderRadius: shape.type === "dot" ? "50%" : "1px",
              }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(to right, ${primaryColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${primaryColor} 1px, transparent 1px)
            `,
              backgroundSize: "40px 40px",
              opacity: opacity / 2,
            }}
          />
        </>
      ) : (
        // Blocks pattern (building-like)
        <div className="absolute inset-0">
          {getRandomBlocks().map((block, index) => (
            <div
              key={`block-${index}`}
              className="absolute transition-opacity duration-300"
              style={{
                left: block.x,
                top: block.y,
                width: block.width,
                height: block.height,
                backgroundColor: block.color,
                opacity: block.opacity,
                borderRight: "1px solid rgba(255,255,255,0.1)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeikiBackground;