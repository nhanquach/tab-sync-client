"use client";

import { useState, useEffect, useRef } from "react";
import { networkGraphNodes } from "./constants";

let count = 1;

const NetworkGraph = () => {
  // Sample data with vibrant colors
  const initialNodes = [
    {
      id: 0,
      label: "TabSync",
      x: 800,
      y: 300,
      connections: Array.from(
        { length: networkGraphNodes.length },
        (_, i) => i + 1
      ),
      color: "fill-primary",
    },
    ...networkGraphNodes,
  ];

  const [nodes, setNodes] = useState([initialNodes[0]]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pulseConnections, setPulseConnections] = useState({});
  const svgRef = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  // Initialize node velocities
  const velocitiesRef = useRef(
    initialNodes.map(() => ({
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
    }))
  );

  const intervalId = useRef<any>(0);

  // Handle node click
  const handleNodeClick = (node) => {
    setSelectedNode(selectedNode === node.id ? null : node.id);

    // Create pulse effect for connections
    const newPulseConnections = {};
    node.connections?.forEach((targetId) => {
      const connectionId = `${Math.min(node.id, targetId)}-${Math.max(
        node.id,
        targetId
      )}`;
      newPulseConnections[connectionId] = { progress: 0, direction: 1 };
    });
    setPulseConnections(newPulseConnections);
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e, node) => {
    e.stopPropagation();
    const svgRect = svgRef.current.getBoundingClientRect();
    setDraggedNode(node.id);
    setDragOffset({
      x: e.clientX - (node.x - svgRect.left),
      y: e.clientY - (node.y - svgRect.top),
    });
    setIsAnimating(false);
  };

  // Handle mouse move during drag
  const handleMouseMove = (e) => {
    if (draggedNode) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - dragOffset.x + svgRect.left;
      const y = e.clientY - dragOffset.y + svgRect.top;

      setNodes(
        nodes.map((node) =>
          node.id === draggedNode ? { ...node, x, y } : node
        )
      );
    }
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsAnimating(true);
  };

  // Update animation
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      setNodes((prevNodes) => {
        // Get SVG dimensions
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) return prevNodes;

        const width = svgRect.width;
        const height = svgRect.height;

        return prevNodes.map((node, index) => {
          // Update position based on velocity
          let newX = node.x + velocitiesRef.current[index].vx;
          let newY = node.y + velocitiesRef.current[index].vy;

          // Bounce off edges
          if (newX < 30 || newX > width - 30) {
            velocitiesRef.current[index].vx *= -1;
            newX = node.x + velocitiesRef.current[index].vx;
          }

          if (newY < 30 || newY > height - 30) {
            velocitiesRef.current[index].vy *= -1;
            newY = node.y + velocitiesRef.current[index].vy;
          }

          return { ...node, x: newX, y: newY };
        });
      });

      // Update pulse animations
      setPulseConnections((prev) => {
        const newPulseConnections = { ...prev };
        Object.keys(newPulseConnections).forEach((key) => {
          const conn = newPulseConnections[key];
          conn.progress += 0.02 * conn.direction;

          if (conn.progress >= 1) {
            conn.direction = -1;
          } else if (conn.progress <= 0) {
            delete newPulseConnections[key];
          }
        });
        return newPulseConnections;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Add event listeners for dragging
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedNode, dragOffset]);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      if (count === initialNodes.length) {
        clearInterval(intervalId.current);
      }

      setNodes((prev) => {
        if (!initialNodes[count]) {
          return prev;
        }

        return [...prev, initialNodes[count]];
      });

      count++;
    }, 500);

    return () => clearInterval(intervalId.current);
  }, []);

  // Handle background click to deselect
  const handleBackgroundClick = () => {
    setSelectedNode(null);
  };

  return (
    <div className="w-full flex flex-col absolute left-0 top-0 z-10">
      <div className="flex-grow overflow-hidden bg-transparent">
        <svg
          ref={svgRef}
          className="w-full h-full min-h-[800px]"
          onClick={handleBackgroundClick}
        >
          <defs>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* {console.log(nodes)} */}

          {/* Draw connection lines */}
          {nodes.map((node) =>
            node.connections.map((targetId) => {
              const targetNode = nodes.find((n) => n.id === targetId);
              if (!targetNode) {
                return;
              }
              const connectionId = `${Math.min(node.id, targetId)}-${Math.max(
                node.id,
                targetId
              )}`;
              const isPulsing = connectionId in pulseConnections;
              const pulseProgress = isPulsing
                ? pulseConnections[connectionId].progress
                : 0;

              // Calculate line gradient
              const gradientId = `gradient-${connectionId}`;

              return (
                <g key={`${node.id}-${targetId}`}>
                  {isPulsing && (
                    <defs>
                      <linearGradient
                        id={gradientId}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset={`${pulseProgress * 100}%`}
                          stopColor="#fff"
                          stopOpacity="0.8"
                        />
                        <stop
                          offset={`${Math.min(pulseProgress * 100 + 10, 100)}%`}
                          stopColor="#fff"
                          stopOpacity="0.1"
                        />
                      </linearGradient>
                    </defs>
                  )}
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={
                      isPulsing
                        ? `url(#${gradientId})`
                        : selectedNode === node.id || selectedNode === targetId
                        ? "#fff"
                        : "#666"
                    }
                    strokeWidth={
                      selectedNode === node.id || selectedNode === targetId
                        ? "2"
                        : "1"
                    }
                    strokeDasharray={
                      selectedNode === node.id || selectedNode === targetId
                        ? "none"
                        : "5,5"
                    }
                    className={isPulsing ? "filter" : ""}
                    filter={isPulsing ? "url(#glow)" : ""}
                  />
                </g>
              );
            })
          )}

          {/* Draw nodes */}
          {nodes.map((node, index) => (
            <g
              key={`${node.id}-${index}`}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(node);
              }}
              onMouseDown={(e) => handleMouseDown(e, node)}
              className="cursor-pointer"
            >
              <circle
                r={node.id === 0 ? 83 : selectedNode === node.id ? 70 : 50}
                className={`${node.color} filter`}
                fillOpacity="0.9"
                filter="url(#glow)"
                stroke={
                  selectedNode === node.id ? "#fff" : "rgba(255,255,255,0.5)"
                }
                strokeWidth={selectedNode === node.id ? 2 : 1}
              />
              <text
                textAnchor="middle"
                alignmentBaseline="middle"
                className="text-xs font-medium fill-white"
                pointerEvents="none"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default NetworkGraph;
