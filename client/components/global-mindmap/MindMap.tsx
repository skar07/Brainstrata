'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMindMap } from '../../hooks/useMindMap';
import { MindMapNode } from '@/types/roadmap';

interface MindMapProps {
  onNodeClick?: (nodeId: string) => void;
}

const MindMap: React.FC<MindMapProps> = ({ onNodeClick }) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    nodes,
    isLoading,
    updateNodeProgress,
    getNodeById
  } = useMindMap();
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Responsive canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawMindMap();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [nodes, selectedNode, offset, isLoading]);

  // Animation loop
  useEffect(() => {
    if (isLoading) return;

    let animationId: number;
    const animate = () => {
      drawMindMap();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [nodes, selectedNode, offset, isLoading]);

  const getCategoryColor = (category: string) => {
    const colors = {
      core: '#3B82F6', // blue
      language: '#10B981', // green
      framework: '#F59E0B', // yellow
      domain: '#8B5CF6', // purple
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const drawMindMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections first with animation
    nodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const connectedNode = getNodeById(connectionId);
        if (connectedNode) {
          ctx.beginPath();
          ctx.moveTo(node.x + offset.x, node.y + offset.y);
          ctx.lineTo(connectedNode.x + offset.x, connectedNode.y + offset.y);
          
          // Animated connection line with gradient
          const gradient = ctx.createLinearGradient(
            node.x + offset.x, node.y + offset.y,
            connectedNode.x + offset.x, connectedNode.y + offset.y
          );
          gradient.addColorStop(0, '#E5E7EB');
          gradient.addColorStop(0.5, '#D1D5DB');
          gradient.addColorStop(1, '#E5E7EB');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      });
    });

    // Draw nodes with enhanced animations
    nodes.forEach((node) => {
      const isSelected = selectedNode === node.id;
      const color = getCategoryColor(node.category);
      const time = Date.now() * 0.001;
      const pulseScale = isSelected ? 1.1 + Math.sin(time * 3) * 0.05 : 1;
      
      // Draw node circle with shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.beginPath();
      ctx.arc(node.x + offset.x, node.y + offset.y, 30 * pulseScale, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? '#FEF3C7' : '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#F59E0B' : color;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();
      ctx.restore();

      // Draw animated progress ring
      ctx.save();
      const progressAngle = (-Math.PI / 2) + (2 * Math.PI * node.progress / 100);
      const animatedProgress = isSelected ? 
        progressAngle + Math.sin(time * 2) * 0.1 : 
        progressAngle;
      
      ctx.beginPath();
      ctx.arc(node.x + offset.x, node.y + offset.y, 35, -Math.PI / 2, animatedProgress);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      // Draw label with better typography
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text shadow for better readability
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.fillText(node.label, node.x + offset.x, node.y + offset.y + 5);
      ctx.restore();
    });
  };

  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);

    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(
        Math.pow(x - (node.x + offset.x), 2) + 
        Math.pow(y - (node.y + offset.y), 2)
      );
      return distance <= 35;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode.id);
      if (onNodeClick) {
        onNodeClick(clickedNode.id);
      }
    } else {
      setSelectedNode(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isDragging) {
      const touch = e.touches[0];
      setOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDragging) {
      const touch = e.changedTouches[0];
      const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY);

      const clickedNode = nodes.find(node => {
        const distance = Math.sqrt(
          Math.pow(x - (node.x + offset.x), 2) + 
          Math.pow(y - (node.y + offset.y), 2)
        );
        return distance <= 35;
      });

      if (clickedNode) {
        setSelectedNode(clickedNode.id);
        if (onNodeClick) {
          onNodeClick(clickedNode.id);
        }
      }
    }
    setIsDragging(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning mind map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-lg overflow-hidden relative">
      {/* ... rest of your JSX remains the same ... */}
      <div className="relative flex-1">
        <canvas
          ref={canvasRef}
          className="cursor-pointer w-full h-full transition-all duration-300 ease-in-out"
          style={{ 
            touchAction: 'none',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        
        
        {/* Enhanced Legend */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20 animate-fadeInUp animation-delay-300">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Categories
          </h3>
          <div className="space-y-2">
            <div className="flex items-center group">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3 group-hover:scale-125 transition-transform duration-200"></div>
              <span className="text-xs text-gray-700 font-medium">Core Concepts</span>
            </div>
            <div className="flex items-center group">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3 group-hover:scale-125 transition-transform duration-200"></div>
              <span className="text-xs text-gray-700 font-medium">Languages</span>
            </div>
            <div className="flex items-center group">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3 group-hover:scale-125 transition-transform duration-200"></div>
              <span className="text-xs text-gray-700 font-medium">Frameworks</span>
            </div>
            <div className="flex items-center group">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-3 group-hover:scale-125 transition-transform duration-200"></div>
              <span className="text-xs text-gray-700 font-medium">Domains</span>
            </div>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="absolute bottom-4 left-4 lg:hidden">
          <div className="flex space-x-2">
            <button 
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all duration-300"
              onClick={() => setOffset({ x: 0, y: 0 })}
              title="Reset View"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 font-medium">
              {nodes.filter(n => n.progress > 0).length} of {nodes.length} topics started
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMap; 