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
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

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
            .force("link", d3.forceLink<Node, Edge>(edges).id(d => d.id).distance(280).strength(0.4))
            .force("charge", d3.forceManyBody().strength(-1500))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(75));
    } else {
        simulationRef.current.nodes(nodes);
        (simulationRef.current.force("link") as d3.ForceLink<Node, Edge>).links(edges);
        simulationRef.current.alpha(0.3).restart();
    }

    const simulation = simulationRef.current;

    // Resize Observer to keep map centered
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || !entries[0]) return;
      const { width: newWidth, height: newHeight } = entries[0].contentRect;
      simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
      simulation.alpha(0.3).restart();
    });
    resizeObserver.observe(containerRef.current);

    // 4. Render Edges (Links)
    let linkGroup = g.select<SVGGElement>("g.links");
    if (linkGroup.empty()) linkGroup = g.append("g").attr("class", "links");

    const link = linkGroup.selectAll<SVGLineElement, Edge>("line")
      .data(edges, (d: any) => `${d.source.id || d.source}-${d.target.id || d.target}`);

    link.exit().remove();
    const linkEnter = link.enter().append("line")
      .attr("stroke", d => d.isInferred ? "#ffcc00" : "#3b82f6") // Use solid hex for visibility
      .attr("stroke-width", d => d.isInferred ? 1.5 : 2)
      .attr("stroke-dasharray", d => d.isInferred ? "5,5" : "0")
      .attr("marker-end", d => d.isInferred ? "url(#arrow-inferred)" : "url(#arrow-regular)")
      .attr("opacity", 0.8); // Higher opacity

    const mergedLinks = linkEnter.merge(link);

    // 5. Link Labels
    let labelGroup = g.select<SVGGElement>("g.link-labels");
    if (labelGroup.empty()) labelGroup = g.append("g").attr("class", "link-labels");

    const linkLabel = labelGroup.selectAll<SVGTextElement, Edge>("text")
        .data(edges, (d: any) => `${d.source.id || d.source}-${d.target.id || d.target}`);

    linkLabel.exit().remove();
    const linkLabelEnter = linkLabel.enter().append("text")
        .attr("class", "text-[9px] font-black uppercase fill-foreground/60 pointer-events-none")
        .attr("text-anchor", "middle")
        .attr("dy", -5)
        .style("paint-order", "stroke")
        .style("stroke", "var(--background)")
        .style("stroke-width", "3px")
        .style("stroke-linecap", "round")
        .style("stroke-linejoin", "round")
        .text(d => d.label);

    const mergedLinkLabels = linkLabelEnter.merge(linkLabel);

    // 6. Render Nodes
    let nodeGroup = g.select<SVGGElement>("g.nodes");
    if (nodeGroup.empty()) nodeGroup = g.append("g").attr("class", "nodes");

    const node = nodeGroup.selectAll<SVGGElement, Node>("g.node")
      .data(nodes, d => d.id);

    node.exit().remove();
    
    const nodeEnter = node.enter().append("g")
      .attr("class", "node cursor-pointer")
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
      .attr("stroke-width", 0.5)
      .attr("class", "hover:stroke-border-glass-bright transition-all");

    nodeEnter.append("circle")
      .attr("r", 32)
      .attr("fill", "var(--background)")
      .attr("stroke", d => d.color)
      .attr("stroke-width", 3) // Thicker stroke
      .attr("class", d => d.risk > 80 ? "animate-pulse" : "");

    nodeEnter.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("class", "fill-foreground text-[11px] font-mono font-black")
      .text(d => `${d.risk}%`);

    nodeEnter.append("text")
      .attr("dy", "48")
      .attr("text-anchor", "middle")
      .attr("class", "fill-foreground text-[9px] font-black uppercase tracking-tighter")
      .style("paint-order", "stroke")
      .style("stroke", "var(--background)")
      .style("stroke-width", "4px")
      .style("stroke-linecap", "round")
      .style("stroke-linejoin", "round")
      .text(d => d.name.length > 15 ? d.name.substring(0, 12) + "..." : d.name);

    const mergedNodes = nodeEnter.merge(node);

    simulation.on("tick", () => {
      mergedLinks
        .attr("x1", d => (d.source as Node).x || 0)
        .attr("y1", d => (d.source as Node).y || 0)
        .attr("x2", d => (d.target as Node).x || 0)
        .attr("y2", d => (d.target as Node).y || 0);

      mergedLinkLabels
        .attr("x", d => (((d.source as Node).x || 0) + ((d.target as Node).x || 0)) / 2)
        .attr("y", d => (((d.source as Node).y || 0) + ((d.target as Node).y || 0)) / 2);

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

    return () => {
      resizeObserver.disconnect();
      simulation.stop();
    };
  }, [nodes, edges]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[600px] relative cursor-grab active:cursor-grabbing bg-background/20">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
