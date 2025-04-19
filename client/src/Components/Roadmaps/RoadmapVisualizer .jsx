import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiExternalLink, FiBookOpen, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import getRoadmapBySlug from '../../Constants/roadmaps';

const RoadmapVisualizer = ({ roadmapSlug = "competitive" }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [scale, setScale] = useState(1);
  const [treeLayout, setTreeLayout] = useState({ nodes: [], links: [] });
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const visualizerRef = useRef(null);
  
  // Load roadmap data
  useEffect(() => {
    const currentRoadmap = getRoadmapBySlug(roadmapSlug);
    setRoadmap(currentRoadmap);
    
    if (currentRoadmap?.nodes?.length > 0) {
      setSelectedNode(currentRoadmap.nodes[0].id);
    }
  }, [roadmapSlug]);

  // Build tree layout
  useEffect(() => {
    if (!roadmap) return;
    
    // Create node map for faster lookups
    const nodeMap = {};
    roadmap.nodes.forEach(node => {
      nodeMap[node.id] = { ...node, children: [] };
    });
    
    // Build parent-child relationships
    roadmap.nodes.forEach(node => {
      if (node.next && node.next.length > 0) {
        node.next.forEach(nextId => {
          if (nodeMap[nextId]) {
            nodeMap[node.id].children.push(nodeMap[nextId]);
          }
        });
      }
    });
    
    // Find root nodes (no parent)
    const rootNodes = roadmap.nodes.filter(node => {
      return !roadmap.nodes.some(n => n.next && n.next.includes(node.id));
    });
    
    // Build tree layout
    const nodePositions = {};
    const links = [];
    
    // Calculate tree positions
    const calculatePositions = (node, x = 0, y = 0, level = 0, parent = null) => {
      if (!node) return;
      
      // Position this node
      nodePositions[node.id] = { x, y, level };
      
      // Create link to parent if applicable
      if (parent) {
        links.push({
          source: parent.id,
          target: node.id,
          sourcePos: nodePositions[parent.id],
          targetPos: { x, y }
        });
      }
      
      // Calculate positions for children
      if (node.children && node.children.length > 0) {
        const levelWidth = 300;
        const childrenHeight = Math.max(300, 150 * node.children.length);
        const startY = y - (childrenHeight / 2) + 75;
        
        node.children.forEach((child, index) => {
          const childY = startY + (index * 150);
          calculatePositions(child, x + levelWidth, childY, level + 1, node);
        });
      }
    };
    
    // Start with root nodes
    rootNodes.forEach((rootNode, index) => {
      const verticalSpacing = Math.max(400, 200 * rootNodes.length);
      const rootY = index * verticalSpacing;
      calculatePositions(nodeMap[rootNode.id], 100, rootY, 0);
    });
    
    setTreeLayout({
      nodes: Object.keys(nodePositions).map(id => ({
        id,
        ...nodeMap[id],
        ...nodePositions[id]
      })),
      links
    });
  }, [roadmap]);

  // Handle mouse events for panning
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction) => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.min(Math.max(0.5, newScale), 2); // Limit scale between 0.5 and 2
    });
  };

  // Helper function to get node color based on level
  const getNodeColor = (level) => {
    switch(level) {
      case "Beginner": return "bg-emerald-500";
      case "Intermediate": return "bg-blue-500";
      case "Advanced": return "bg-purple-500";
      case "Expert": return "bg-rose-500";
      default: return "bg-gray-500";
    }
  };

  const getBorderColor = (level) => {
    switch(level) {
      case "Beginner": return "border-emerald-600";
      case "Intermediate": return "border-blue-600";
      case "Advanced": return "border-purple-600";
      case "Expert": return "border-rose-600";
      default: return "border-gray-600";
    }
  };

  // Get the currently selected node object
  const currentNode = roadmap?.nodes.find(node => node.id === selectedNode);

  if (!roadmap) return <div className="flex justify-center items-center h-96">Loading roadmap...</div>;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{roadmap.title}</h1>
        <div className="flex gap-4 mt-4">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm">Beginner</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Intermediate</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm">Advanced</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span className="text-sm">Expert</span>
          </span>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex justify-end mb-4 gap-2">
        <button 
          onClick={() => handleZoom('in')} 
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          aria-label="Zoom in"
        >
          <FiZoomIn />
        </button>
        <button 
          onClick={() => handleZoom('out')} 
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          aria-label="Zoom out"
        >
          <FiZoomOut />
        </button>
      </div>

      {/* Interactive visualization canvas */}
      <div 
        className="relative overflow-hidden border border-gray-200 rounded-xl bg-gray-50 mb-8" 
        style={{ height: "600px" }}
        ref={visualizerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="absolute transition-all duration-100 cursor-grab"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          {/* Tree links */}
          <svg className="absolute w-full h-full" style={{ width: "4000px", height: "2000px" }}>
            {treeLayout.links.map((link, index) => {
              const isActive = 
                selectedNode === link.source || 
                selectedNode === link.target;
              
              // Curved paths between nodes
              const sourceX = link.sourcePos.x + 75; // Middle right of source node
              const sourceY = link.sourcePos.y + 60;
              const targetX = link.targetPos.x; // Middle left of target node
              const targetY = link.targetPos.y + 60;
              
              // Control point for curve
              const controlX = (sourceX + targetX) / 2;
              const controlY = (sourceY + targetY) / 2;
              
              return (
                <motion.path
                  key={`link-${index}`}
                  d={`M${sourceX},${sourceY} Q${controlX},${controlY} ${targetX},${targetY}`}
                  stroke={isActive ? "#6366f1" : "#cbd5e1"}
                  strokeWidth={isActive ? "3" : "2"}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.02 }}
                />
              );
            })}
          </svg>
          
          {/* Tree nodes */}
          {treeLayout.nodes.map((node) => {
            const isSelected = selectedNode === node.id;
            
            return (
              <motion.div
                key={`node-${node.id}`}
                className={`absolute rounded-xl shadow-lg w-56 h-32 overflow-hidden
                  cursor-pointer transition-all border-2
                  ${isSelected ? 'shadow-xl ring-2 ring-indigo-500' : 'hover:shadow-xl'} 
                  ${getNodeColor(node.level)} ${getBorderColor(node.level)}`}
                style={{ 
                  left: node.x, 
                  top: node.y,
                }}
                onClick={() => setSelectedNode(node.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: node.level * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-4 h-full flex flex-col">
                  <h3 className="font-semibold text-lg text-white truncate">{node.title}</h3>
                  <div className="text-xs mt-1 opacity-90 text-white">{node.level}</div>
                  <div className="mt-auto flex justify-between items-end">
                    <div className="text-xs text-white opacity-80">
                      {node.resources?.length || 0} resources
                    </div>
                    {isSelected && (
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Hint text for navigation */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded-md">
          Drag to pan • Use buttons to zoom
        </div>
      </div>

      {/* Selected node details */}
      <AnimatePresence mode="wait">
        {currentNode && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            key={currentNode.id}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-4 h-4 rounded-full ${getNodeColor(currentNode.level)}`}></div>
              <h2 className="text-2xl font-bold">{currentNode.title}</h2>
              <span className="text-sm bg-gray-100 py-1 px-3 rounded-full text-gray-600">
                {currentNode.level}
              </span>
            </div>
            
            <p className="text-gray-700 mb-6">{currentNode.description}</p>
            
            <div className="mb-6">
              <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
                <FiBookOpen className="text-indigo-500" />
                Resources
              </h3>
              <div className="grid gap-3">
                {currentNode.resources?.map((resource, index) => (
                  <a 
                    key={index}
                    href={resource.link}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <span>{resource.name}</span>
                    <FiExternalLink className="text-indigo-500" />
                  </a>
                ))}
              </div>
            </div>
            
            {currentNode.next && currentNode.next.length > 0 && (
              <div>
                <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
                  <FiArrowRight className="text-indigo-500" />
                  Next Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentNode.next.map(nextId => {
                    const nextNode = roadmap.nodes.find(n => n.id === nextId);
                    if (!nextNode) return null;
                    
                    return (
                      <button
                        key={nextId}
                        onClick={() => setSelectedNode(nextId)}
                        className={`py-2 px-4 rounded-full text-sm font-medium transition-all
                          ${getNodeColor(nextNode.level)} text-white hover:opacity-90`}
                      >
                        {nextNode.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoadmapVisualizer;