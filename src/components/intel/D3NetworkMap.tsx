"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
  risk: number;
  color: string;
  x?: number;
  y?: number;
}

interface Edge extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  label: string;
  weight: number;
  isInferred?: boolean;
}

interface D3NetworkMapProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (node: Node) => void;
}

export const D3NetworkMap = ({ nodes, edges, onNodeClick }: D3NetworkMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Edge>>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    let g = svg.select<SVGGElement>("g.main-container");
    
    if (g.empty()) {
      g = svg.append("g").attr("class", "main-container");
      
      // Initial zoom
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      svg.call(zoom);
      
      // Arrowheads
      const defs = svg.append("defs");
      defs.selectAll("marker")
        .data(["regular", "inferred"])
        .enter().append("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 38)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", d => d === "regular" ? "var(--border-glass-bright)" : "var(--accent-gold)")
        .attr("d", "M0,-5L10,0L0,5");
    }

    // Update simulation
    if (!simulationRef.current) {
        simulationRef.current = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Edge>(edges).id(d => d.id).distance(220).strength(0.5))
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(70));
    } else {
        simulationRef.current.nodes(nodes);
        (simulationRef.current.force("link") as d3.ForceLink<Node, Edge>).links(edges);
        simulationRef.current.alpha(0.3).restart();
    }

    const simulation = simulationRef.current;

    // Render Edges
    let linkGroup = g.select<SVGGElement>("g.links");
    if (linkGroup.empty()) linkGroup = g.append("g").attr("class", "links");

    const link = linkGroup.selectAll<SVGLineElement, Edge>("line")
      .data(edges, (d: any) => `${d.source.id || d.source}-${d.target.id || d.target}`);

    link.exit().remove();
    const linkEnter = link.enter().append("line")
      .attr("stroke", d => d.isInferred ? "var(--accent-gold)" : "var(--border-glass)")
      .attr("stroke-width", d => d.isInferred ? 1 : 1.5)
      .attr("stroke-dasharray", d => d.isInferred ? "5,5" : "0")
      .attr("marker-end", d => d.isInferred ? "url(#arrow-inferred)" : "url(#arrow-regular)")
      .attr("opacity", 0.4);

    const mergedLinks = linkEnter.merge(link);

    // Render Nodes
    let nodeGroup = g.select<SVGGElement>("g.nodes");
    if (nodeGroup.empty()) nodeGroup = g.append("g").attr("class", "nodes");

    const node = nodeGroup.selectAll<SVGGElement, Node>("g.node")
      .data(nodes, d => d.id);

    node.exit().remove();
    
    const nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .on("click", (event, d) => {
          onNodeClick(d);
          d3.select(event.currentTarget).raise();
      })
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    nodeEnter.append("circle")
      .attr("r", 42)
      .attr("fill", "transparent")
      .attr("stroke", "var(--border-glass)")
      .attr("stroke-width", 0.5);

    nodeEnter.append("circle")
      .attr("r", 32)
      .attr("fill", "var(--background)")
      .attr("stroke", d => d.color)
      .attr("stroke-width", 2);

    nodeEnter.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("class", "fill-foreground text-[11px] font-mono font-black")
      .text(d => `${d.risk}%`);

    nodeEnter.append("text")
      .attr("dy", "52")
      .attr("text-anchor", "middle")
      .attr("class", "fill-muted-foreground text-[10px] font-black uppercase tracking-widest pointer-events-none")
      .text(d => d.name.length > 18 ? d.name.substring(0, 15) + "..." : d.name);

    const mergedNodes = nodeEnter.merge(node);

    simulation.on("tick", () => {
      mergedLinks
        .attr("x1", d => (d.source as Node).x || 0)
        .attr("y1", d => (d.source as Node).y || 0)
        .attr("x2", d => (d.target as Node).x || 0)
        .attr("y2", d => (d.target as Node).y || 0);

      mergedNodes
        .attr("transform", d => `translate(${d.x},${d.y})`);
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

  }, [nodes, edges]);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing bg-background/20">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
