'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export interface MindNode {
  label: string;
  children: MindNode[];
}

interface LayoutNode extends MindNode {
  id: string;
  x: number;
  y: number;
  depth: number;
}

// ── Layout constants ────────────────────────────────────────────────────────
const NODE_W = 150;
const NODE_H = 38;
const H_GAP = 24;
const V_GAP = 72;
const PAD = 40;

// Assign unique string IDs to every node in the tree
function assignIds(node: MindNode, prefix = '0'): MindNode & { id: string } {
  return {
    ...node,
    id: prefix,
    children: node.children.map((c, i) => assignIds(c, `${prefix}-${i}`)),
  } as MindNode & { id: string };
}

// Calculate how wide a subtree needs to be
function subtreeW(node: MindNode): number {
  if (!node.children.length) return NODE_W;
  const total = node.children.reduce((s, c) => s + subtreeW(c), 0);
  return total + (node.children.length - 1) * H_GAP;
}

// Recursively compute x, y positions, returns flat list of LayoutNodes
function layout(
  node: MindNode & { id: string },
  cx: number,
  cy: number,
  depth: number,
  out: LayoutNode[],
): void {
  out.push({ ...node, x: cx, y: cy, depth });
  if (!node.children.length) return;

  const widths = node.children.map(subtreeW);
  const totalW = widths.reduce((a, b) => a + b, 0) + (node.children.length - 1) * H_GAP;
  let childX = cx - totalW / 2;

  (node.children as Array<MindNode & { id: string }>).forEach((child, i) => {
    const w = widths[i];
    layout(child, childX + w / 2, cy + NODE_H + V_GAP, depth + 1, out);
    childX += w + H_GAP;
  });
}

// Bezier path from parent bottom-center to child top-center
function edgePath(px: number, py: number, cx: number, cy: number): string {
  const midY = (py + cy) / 2;
  return `M ${px},${py + NODE_H / 2} C ${px},${midY} ${cx},${midY} ${cx},${cy - NODE_H / 2}`;
}

// Colors per depth level
function nodeStyle(depth: number) {
  if (depth === 0) return { fill: '#1e1e1a', stroke: '#c4a96e', text: '#e8e8e4', strokeW: 1.5, rx: 20 };
  if (depth === 1) return { fill: '#1a1a18', stroke: '#3a3a38', text: '#d0d0cc', strokeW: 1, rx: 10 };
  return { fill: '#141412', stroke: '#2a2a28', text: '#a0a09a', strokeW: 1, rx: 7 };
}

interface MindMapCanvasProps {
  tree: MindNode;
  topic: string;
}

export default function MindMapCanvas({ tree, topic }: MindMapCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);

  const { nodes, edges, vb } = useMemo(() => {
    const tagged = assignIds(tree);
    const nodes: LayoutNode[] = [];
    layout(tagged, 0, 0, 0, nodes);

    // Build adjacency for edges
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const edges: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

    function buildEdges(n: MindNode & { id: string }) {
      (n.children as Array<MindNode & { id: string }>).forEach((child) => {
        const p = nodeMap.get(n.id)!;
        const c = nodeMap.get(child.id)!;
        edges.push({ x1: p.x, y1: p.y, x2: c.x, y2: c.y });
        buildEdges(child);
      });
    }
    buildEdges(tagged);

    // Compute viewBox
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const minX = Math.min(...xs) - NODE_W / 2 - PAD;
    const minY = Math.min(...ys) - NODE_H / 2 - PAD;
    const maxX = Math.max(...xs) + NODE_W / 2 + PAD;
    const maxY = Math.max(...ys) + NODE_H / 2 + PAD;

    return { nodes, edges, vb: { x: minX, y: minY, w: maxX - minX, h: maxY - minY } };
  }, [tree]);

  const handleDownload = useCallback(() => {
    if (!svgRef.current) return;
    const data = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-mindmap.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [topic]);

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}
          className="w-8 h-8 rounded-lg border border-[#2a2a28] flex items-center justify-center text-[#5a5a54] hover:text-[#a8a8a0] hover:bg-[#1a1a18] transition-all"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-[12px] text-[#4a4a48] font-mono w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
          className="w-8 h-8 rounded-lg border border-[#2a2a28] flex items-center justify-center text-[#5a5a54] hover:text-[#a8a8a0] hover:bg-[#1a1a18] transition-all"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="w-8 h-8 rounded-lg border border-[#2a2a28] flex items-center justify-center text-[#5a5a54] hover:text-[#a8a8a0] hover:bg-[#1a1a18] transition-all"
        >
          <Maximize2 size={13} />
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2a2a28] text-[12.5px] text-[#5a5a54] hover:text-[#a8a8a0] hover:bg-[#1a1a18] transition-all font-[450]"
        >
          <Download size={12} />
          Download SVG
        </button>
      </div>

      {/* SVG canvas */}
      <div className="overflow-auto rounded-2xl border border-[#1e1e1c] bg-[#0e0e0c]">
        <svg
          ref={svgRef}
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
          width={vb.w * zoom}
          height={vb.h * zoom}
          className="block mx-auto"
          style={{ minWidth: '100%' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Edges */}
          {edges.map((e, i) => (
            <path
              key={i}
              d={edgePath(e.x1, e.y1, e.x2, e.y2)}
              stroke="#2e2e2c"
              strokeWidth={1.5}
              fill="none"
            />
          ))}

          {/* Nodes */}
          {nodes.map((n) => {
            const s = nodeStyle(n.depth);
            const nw = n.depth === 0 ? NODE_W + 20 : NODE_W;
            return (
              <g key={n.id} transform={`translate(${n.x - nw / 2}, ${n.y - NODE_H / 2})`}>
                <rect
                  width={nw}
                  height={NODE_H}
                  rx={s.rx}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={s.strokeW}
                />
                <text
                  x={nw / 2}
                  y={NODE_H / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={s.text}
                  fontSize={n.depth === 0 ? 13 : 11.5}
                  fontWeight={n.depth === 0 ? 600 : 450}
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {n.label.length > 22 ? n.label.slice(0, 21) + '…' : n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-center text-[11px] text-[#3a3a38]">
        {nodes.length} nodes · scroll or zoom to explore
      </p>
    </div>
  );
}
