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
  clusterStrength?: number;
}

export const D3NetworkMap = ({ nodes, edges, onNodeClick, clusterStrength = 1 }: D3NetworkMapProps) => {
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
      
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.05, 5])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      svg.call(zoom);
      
      const defs = svg.append("defs");
      defs.selectAll("marker")
        .data(["regular", "inferred"])
        .enter().append("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 45)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", d => d === "regular" ? "var(--accent-blue)" : "var(--accent-gold)")
        .attr("d", "M0,-5L10,0L0,5");
    }

    // Dynamic Forces based on Cluster Strength
    const repulsion = clusterStrength > 1 ? -3000 : -1200;
    const linkDistance = clusterStrength > 1 ? 150 : 250;

    if (!simulationRef.current) {
        simulationRef.current = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Edge>(edges).id(d => d.id).distance(linkDistance).strength(0.3))
            .force("charge", d3.forceManyBody().strength(repulsion))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(80))
            .force("x", d3.forceX(width / 2).strength(0.05))
            .force("y", d3.forceY(height / 2).strength(0.05));
    } else {
        simulationRef.current.nodes(nodes);
        (simulationRef.current.force("link") as d3.ForceLink<Node, Edge>).links(edges).distance(linkDistance);
        simulationRef.current.force("charge", d3.forceManyBody().strength(repulsion));
        simulationRef.current.force("center", d3.forceCenter(width / 2, height / 2));
        simulationRef.current.alpha(0.3).restart();
    }

    const simulation = simulationRef.current;

    // 4. Render Edges as Arcs (Curves)
    let linkGroup = g.select<SVGGElement>("g.links");
    if (linkGroup.empty()) linkGroup = g.append("g").attr("class", "links");

    const link = linkGroup.selectAll<SVGPathElement, Edge>("path")
      .data(edges, (d: any) => `${d.source.id || d.source}-${d.target.id || d.target}`);

    link.exit().remove();
    const linkEnter = link.enter().append("path")
      .attr("fill", "none")
      .attr("stroke", d => d.isInferred ? "var(--accent-gold)" : "var(--accent-blue)")
      .attr("stroke-width", d => d.isInferred ? 1 : 1.5)
      .attr("stroke-dasharray", d => d.isInferred ? "4,4" : "0")
      .attr("marker-end", d => d.isInferred ? "url(#arrow-inferred)" : "url(#arrow-regular)")
      .attr("opacity", 0.4)
      .attr("class", "hover:opacity-100 hover:stroke-width-2 transition-all");

    const mergedLinks = linkEnter.merge(link);

    // 5. Link Labels
    let labelGroup = g.select<SVGGElement>("g.link-labels");
    if (labelGroup.empty()) labelGroup = g.append("g").attr("class", "link-labels");

    const linkLabel = labelGroup.selectAll<SVGTextElement, Edge>("text")
        .data(edges, (d: any) => `${d.source.id || d.source}-${d.target.id || d.target}`);

    linkLabel.exit().remove();
    const linkLabelEnter = linkLabel.enter().append("text")
        .attr("class", "text-[8px] font-bold uppercase fill-foreground/40 pointer-events-none")
        .attr("text-anchor", "middle")
        .style("paint-order", "stroke")
        .style("stroke", "var(--background)")
        .style("stroke-width", "2px")
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
          // UI Highlight
          mergedLinks.attr("opacity", (l: any) => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1);
          mergedLinks.attr("stroke-width", (l: any) => (l.source.id === d.id || l.target.id === d.id) ? 3 : 1);
          d3.select(event.currentTarget).raise();
      })
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    nodeEnter.append("circle")
      .attr("r", 40)
      .attr("fill", d => d.color)
      .attr("opacity", 0.05);

    nodeEnter.append("circle")
      .attr("r", 28)
      .attr("fill", "var(--background)")
      .attr("stroke", d => d.color)
      .attr("stroke-width", 2)
      .attr("class", d => d.risk > 85 ? "animate-pulse" : "");

    nodeEnter.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("class", "fill-foreground text-[10px] font-mono font-bold")
      .text(d => `${d.risk}%`);

    nodeEnter.append("text")
      .attr("dy", "42")
      .attr("text-anchor", "middle")
      .attr("class", "fill-foreground text-[9px] font-black uppercase tracking-tight")
      .style("paint-order", "stroke")
      .style("stroke", "var(--background)")
      .style("stroke-width", "3px")
      .text(d => d.name.length > 18 ? d.name.substring(0, 15) + "..." : d.name);

    const mergedNodes = nodeEnter.merge(node);

    simulation.on("tick", () => {
      mergedLinks.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      mergedLinkLabels
        .attr("transform", (d: any) => {
            const x = (d.source.x + d.target.x) / 2;
            const y = (d.source.y + d.target.y) / 2;
            return `translate(${x},${y})`;
        });

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
        simulation.stop();
    };
  }, [nodes, edges, clusterStrength]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[600px] relative cursor-grab active:cursor-grabbing bg-background/20">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
