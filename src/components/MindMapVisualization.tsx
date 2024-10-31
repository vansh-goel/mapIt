import React, { useCallback, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useMindMapStore } from '../store/mindMapStore';
import * as d3 from 'd3';

export const MindMapVisualization: React.FC = () => {
  const { nodes, links } = useMindMapStore();
  const graphRef = useRef<any>();

  const handleNodeClick = useCallback((node: any) => {
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2, 1000);
    }
  }, []);

  useEffect(() => {
    if (graphRef.current && nodes.length > 0) {
      // Enhanced force simulation for better hierarchical layout
      graphRef.current.d3Force('charge').strength(-400);
      
      // Adjust link distance based on relationship type
      graphRef.current.d3Force('link').distance((link: any) => {
        return link.value > 1.5 ? 120 : 180; // Hierarchical links are closer
      }).strength((link: any) => link.value * 0.5); // Stronger forces for related nodes
      
      // Prevent node overlap
      graphRef.current.d3Force('collision', d3.forceCollide().radius((node: any) => 
        Math.sqrt(node.val) * 12
      ));

      // Create hierarchical layout
      graphRef.current.d3Force('y', d3.forceY().y((node: any) => {
        const isParent = !links.some(link => link.target === node.id);
        return isParent ? -150 : 100; // More vertical separation
      }).strength(0.2));

      // Add slight repulsion from center
      graphRef.current.d3Force('x', d3.forceX().strength(0.05));
    }
  }, [nodes, links]);

  if (nodes.length === 0) {
    return (
      <div className="w-full h-[600px] bg-white rounded-lg shadow-lg flex items-center justify-center">
        <p className="text-gray-500">Add some notes to generate a mind map</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-white rounded-lg shadow-lg">
      <ForceGraph2D
        ref={graphRef}
        graphData={{ nodes, links }}
        nodeLabel="label"
        nodeColor={(node: any) => node.color}
        nodeRelSize={8}
        linkWidth={(link: any) => link.value * 3}
        linkColor={(link: any) => 
          link.value > 1.5 ? '#2563eb' : '#94a3b8'
        }
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.label;
          const fontSize = node.val * 3;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

          // Draw background with node color (semi-transparent)
          ctx.fillStyle = `${node.color}22`; // 22 is hex for 13% opacity
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            bckgDimensions[0],
            bckgDimensions[1]
          );

          // Draw border
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.strokeRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            bckgDimensions[0],
            bckgDimensions[1]
          );

          // Draw text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x, node.y);
        }}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          ctx.fillStyle = color;
          const fontSize = node.val * 3;
          const bckgDimensions = [
            ctx.measureText(node.label).width + fontSize * 0.4,
            fontSize * 1.4
          ];
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            bckgDimensions[0],
            bckgDimensions[1]
          );
        }}
      />
    </div>
  );
};