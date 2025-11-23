import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MemoryNode, MemoryLink } from '../types';

interface KnowledgeGraphProps {
  nodes: MemoryNode[];
  links: MemoryLink[];
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || nodes.length === 0) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Prepare data (shallow copy to avoid mutating props directly if strictly typed)
    const nodesData = nodes.map(d => ({ ...d }));
    const linksData = links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodesData as any)
      .force("link", d3.forceLink(linksData).id((d: any) => d.label).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    // Draw Links
    const link = svg.append("g")
      .attr("stroke", "#4b5563")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(linksData)
      .join("line")
      .attr("stroke-width", 1.5);

    // Draw Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodesData)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    // Node Circles
    node.append("circle")
      .attr("r", (d: any) => d.type === 'person' ? 12 : 8)
      .attr("fill", (d: any) => {
        if (d.type === 'person') return '#b026ff';
        if (d.type === 'event') return '#ff2a6d';
        return '#00f0ff';
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    // Node Labels
    node.append("text")
      .text((d: any) => d.label)
      .attr("x", 12)
      .attr("y", 4)
      .attr("fill", "#e2e8f0")
      .style("font-size", "10px")
      .style("font-family", "JetBrains Mono");

    // Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [nodes, links]);

  return (
    <div ref={wrapperRef} className="w-full h-full relative overflow-hidden bg-shadow-900 rounded-lg border border-shadow-700">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h2 className="text-neon-blue font-mono font-bold text-sm tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
          KNOWLEDGE_GRAPH_V1
        </h2>
        <p className="text-xs text-gray-500 font-mono mt-1">
          {nodes.length} Nodes / {links.length} Relationships
        </p>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default KnowledgeGraph;