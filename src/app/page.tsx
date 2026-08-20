"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Minus,
  Maximize2,
  Database,
  Cpu,
  Boxes,
  Network,
  Activity,
  Trash2,
  Link as LinkIcon,
  Unlink,
  RotateCcw,
  FileText,
  CheckSquare,
  Code,
  X,
  ExternalLink,
  Search,
  Filter,
  Palette,
  Download,
  Upload,
  Copy,
  LayoutTemplate,
  Map,
  Sparkles,
} from "lucide-react";

type NodeType = "Core" | "Memory" | "Logic" | "Cluster" | "Synapse";
type NodeStatus = "Active" | "Idle" | "Warning";
type NodeColor = "cyan" | "emerald" | "purple" | "amber" | "rose";

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

interface NodeData {
  id: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
  x: number;
  y: number;
  color?: NodeColor;
  notes?: string;
  checklist?: TaskItem[];
  codeSnippet?: string;
}

interface EdgeData {
  id: string;
  from: string;
  to: string;
}

const COLOR_MAP: Record<NodeColor, { border: string; bg: string; text: string; ring: string }> = {
  cyan: { border: "border-cyan-500/50", bg: "bg-cyan-500/10", text: "text-cyan-400", ring: "ring-cyan-400/40" },
  emerald: { border: "border-emerald-500/50", bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-400/40" },
  purple: { border: "border-purple-500/50", bg: "bg-purple-500/10", text: "text-purple-400", ring: "ring-purple-400/40" },
  amber: { border: "border-amber-500/50", bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-400/40" },
  rose: { border: "border-rose-500/50", bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-400/40" },
};

const DEFAULT_NODES: NodeData[] = [
  { id: "core", title: "CORE NODE", type: "Core", status: "Active", x: 0, y: 0, color: "cyan", notes: "Central intelligence hub.", checklist: [], codeSnippet: "console.log('Core system active');" },
  { id: "mem", title: "MEMORY BANK", type: "Memory", status: "Active", x: -220, y: -120, color: "amber", notes: "Vector storage node.", checklist: [], codeSnippet: "const pool = new VectorStore();" },
  { id: "logic", title: "LOGIC GATE", type: "Logic", status: "Active", x: 220, y: -80, color: "emerald", notes: "Conditional routing.", checklist: [], codeSnippet: "if (valid) routeNext();" },
  { id: "task", title: "TASK CLUSTER", type: "Cluster", status: "Idle", x: 140, y: 160, color: "purple", notes: "Async queue handler.", checklist: [], codeSnippet: "await queue.process();" },
];

const DEFAULT_EDGES: EdgeData[] = [
  { id: "e1", from: "core", to: "mem" },
  { id: "e2", from: "core", to: "logic" },
  { id: "e3", from: "core", to: "task" },
];

export default function NeuroscapeCanvas() {
  const [isMounted, setIsMounted] = useState(false);
  const [nodes, setNodes] = useState<NodeData[]>(DEFAULT_NODES);
  const [edges, setEdges] = useState<EdgeData[]>(DEFAULT_EDGES);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("core");
  const [isConnectMode, setIsConnectMode] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "checklist" | "code">("notes");
  const [newTaskText, setNewTaskText] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState<NodeType | "All">("All");

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedNodes = localStorage.getItem("neuro_nodes");
    const savedEdges = localStorage.getItem("neuro_edges");
    if (savedNodes) {
      try { setNodes(JSON.parse(savedNodes)); } catch (e) { console.error(e); }
    }
    if (savedEdges) {
      try { setEdges(JSON.parse(savedEdges)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("neuro_nodes", JSON.stringify(nodes));
      localStorage.setItem("neuro_edges", JSON.stringify(edges));
    }
  }, [nodes, edges, isMounted]);

  if (!isMounted) {
    return <div className="h-screen w-screen bg-slate-950" />;
  }

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const isNodeMatching = (node: NodeData) => {
    const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeTypeFilter === "All" || node.type === activeTypeFilter;
    return matchesSearch && matchesFilter;
  };

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (isConnectMode && selectedNodeId && selectedNodeId !== nodeId) {
      const exists = edges.some(
        (edge) => (edge.from === selectedNodeId && edge.to === nodeId) || (edge.from === nodeId && edge.to === selectedNodeId)
      );
      if (!exists) {
        setEdges([...edges, { id: `e_${Date.now()}`, from: selectedNodeId, to: nodeId }]);
      }
      setIsConnectMode(false);
    } else {
      setSelectedNodeId(nodeId);
    }
  };

  const handleNodeDoubleClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setIsDetailsOpen(true);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId) return;
    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;
    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: n.x + dx, y: n.y + dy } : n))
    );
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setDraggingNodeId(null);

  const addNode = () => {
    const title = prompt("Enter Node Title:", "SYNAPSE NODE");
    if (!title) return;
    const newNode: NodeData = {
      id: `node_${Date.now()}`,
      title: title.toUpperCase(),
      type: "Synapse",
      status: "Active",
      color: "cyan",
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      notes: "",
      checklist: [],
      codeSnippet: "",
    };
    setNodes([...nodes, newNode]);
    if (selectedNodeId) {
      setEdges([...edges, { id: `e_${Date.now()}`, from: selectedNodeId, to: newNode.id }]);
    }
    setSelectedNodeId(newNode.id);
  };

  const duplicateSelectedNode = () => {
    if (!selectedNode) return;
    const newNode: NodeData = {
      ...selectedNode,
      id: `node_${Date.now()}`,
      title: `${selectedNode.title} (COPY)`,
      x: selectedNode.x + 40,
      y: selectedNode.y + 40,
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes(nodes.filter((n) => n.id !== selectedNodeId));
    setEdges(edges.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId));
    setSelectedNodeId(null);
    setIsDetailsOpen(false);
  };

  const removeConnectionsForSelected = () => {
    if (!selectedNodeId) return;
    setEdges(edges.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId));
  };

  const autoOrganizeLayout = () => {
    const radius = Math.max(160, nodes.length * 35);
    const updated = nodes.map((n, index) => {
      if (n.id === "core") return { ...n, x: 0, y: 0 };
      const angle = ((index - 1) / (nodes.length - 1)) * 2 * Math.PI;
      return {
        ...n,
        x: Math.round(Math.cos(angle) * radius),
        y: Math.round(Math.sin(angle) * radius),
      };
    });
    setNodes(updated);
  };

  const updateSelectedNode = (fields: Partial<NodeData>) => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.map((n) => (n.id === selectedNodeId ? { ...n, ...fields } : n)));
  };

  const addTask = () => {
    if (!newTaskText.trim() || !selectedNode) return;
    const currentList = selectedNode.checklist || [];
    updateSelectedNode({
      checklist: [...currentList, { id: `t_${Date.now()}`, text: newTaskText, completed: false }],
    });
    setNewTaskText("");
  };

  const toggleTask = (taskId: string) => {
    if (!selectedNode) return;
    const updated = (selectedNode.checklist || []).map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    updateSelectedNode({ checklist: updated });
  };

  const resetGraph = () => {
    localStorage.removeItem("neuro_nodes");
    localStorage.removeItem("neuro_edges");
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    setSelectedNodeId("core");
    setSearchQuery("");
    setActiveTypeFilter("All");
    setIsDetailsOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const exportGraphJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `neuroscape_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importGraphJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          setSelectedNodeId(parsed.nodes[0]?.id || null);
        }
      } catch (err) {
        alert("Invalid JSON file format!");
      }
    };
    reader.readAsText(file);
  };

  const loadApiPreset = () => {
    const apiNodes: NodeData[] = [
      { id: "gateway", title: "API GATEWAY", type: "Core", status: "Active", x: 0, y: -150, color: "cyan" },
      { id: "auth", title: "AUTH SERVICE", type: "Logic", status: "Active", x: -180, y: 0, color: "emerald" },
      { id: "db", title: "REDIS CACHE", type: "Memory", status: "Active", x: 180, y: 0, color: "amber" },
      { id: "worker", title: "WORKER QUEUE", type: "Cluster", status: "Idle", x: 0, y: 150, color: "purple" },
    ];
    const apiEdges: EdgeData[] = [
      { id: "pe1", from: "gateway", to: "auth" },
      { id: "pe2", from: "gateway", to: "db" },
      { id: "pe3", from: "gateway", to: "worker" },
    ];
    setNodes(apiNodes);
    setEdges(apiEdges);
    setSelectedNodeId("gateway");
  };

  const getNodeIcon = (type: NodeType, color: NodeColor = "cyan") => {
    const colorClass = COLOR_MAP[color].text;
    switch (type) {
      case "Core": return <Activity className={`w-5 h-5 ${colorClass}`} />;
      case "Memory": return <Database className={`w-5 h-5 ${colorClass}`} />;
      case "Logic": return <Cpu className={`w-5 h-5 ${colorClass}`} />;
      case "Cluster": return <Boxes className={`w-5 h-5 ${colorClass}`} />;
      case "Synapse": return <Network className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none relative">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800/80 bg-slate-900/40 p-4 flex flex-col justify-between z-20">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            <h1 className="font-bold tracking-wider text-cyan-400 text-lg">NEUROSCAPE</h1>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nodes..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filters
              </span>
              <span className="text-[10px] font-mono text-cyan-400">{nodes.filter(isNodeMatching).length}/{nodes.length} visible</span>
            </div>
            <div className="space-y-1">
              {(["All", "Core", "Memory", "Logic", "Cluster", "Synapse"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTypeFilter(type)}
                  className={`w-full px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                    activeTypeFilter === type
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  <span>{type}</span>
                  <span className="text-[10px] text-slate-500">
                    {type === "All" ? nodes.length : nodes.filter((n) => n.type === type).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">System Production Build • v3.0</div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col relative" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <div className="h-14 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-900/20 z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-mono">System Online</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={autoOrganizeLayout} className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-xs flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Auto-Layout
            </button>
            <button onClick={loadApiPreset} className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-xs flex items-center gap-1.5 text-slate-300">
              <LayoutTemplate className="w-3.5 h-3.5" /> API Preset
            </button>
            <button onClick={exportGraphJSON} className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-xs flex items-center gap-1.5 text-slate-300">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-xs flex items-center gap-1.5 text-slate-300">
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
            <input type="file" ref={fileInputRef} onChange={importGraphJSON} accept=".json" className="hidden" />

            <button onClick={resetGraph} className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={addNode} className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> New Node
            </button>
          </div>
        </div>

        {/* Viewport Canvas (FIXED COORDINATE ALIGNMENT) */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
          <div 
            className="absolute left-1/2 top-1/2 w-[2000px] h-[2000px] pointer-events-none"
            style={{ 
              transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})` 
            }}
          >
            {/* SVG Connecting Lines Grouped at Canvas Center */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <g transform="translate(1000, 1000)">
                {edges.map((e) => {
                  const s = nodes.find((n) => n.id === e.from);
                  const t = nodes.find((n) => n.id === e.to);
                  if (!s || !t) return null;
                  const isEdgeVisible = isNodeMatching(s) && isNodeMatching(t);
                  return (
                    <line
                      key={e.id}
                      x1={s.x}
                      y1={s.y}
                      x2={t.x}
                      y2={t.y}
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeOpacity={isEdgeVisible ? "0.6" : "0.1"}
                      strokeDasharray="6 4"
                    />
                  );
                })}
              </g>
            </svg>

            {/* Nodes Rendered at Exact Offset Center */}
            <div className="absolute left-[1000px] top-[1000px] w-0 h-0 pointer-events-auto">
              {nodes.map((node) => {
                const isMatch = isNodeMatching(node);
                const isSelected = node.id === selectedNodeId;
                const theme = COLOR_MAP[node.color || "cyan"];

                return (
                  <div
                    key={node.id}
                    onClick={(e) => handleNodeClick(e, node.id)}
                    onDoubleClick={(e) => handleNodeDoubleClick(e, node.id)}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    style={{ 
                      transform: `translate(${node.x}px, ${node.y}px)` 
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab p-4 rounded-xl border backdrop-blur-md flex items-center gap-3 min-w-[160px] transition-all duration-200 z-10 ${
                      isMatch ? "opacity-100" : "opacity-20 pointer-events-none"
                    } ${
                      isSelected ? `bg-slate-900/90 ${theme.border} ring-2 ${theme.ring}` : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${theme.bg}`}>{getNodeIcon(node.type, node.color)}</div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{node.title}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{node.type} • {node.status}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-1 bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl z-20">
            <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))} className="p-2 text-slate-400 hover:text-slate-200"><Plus className="w-4 h-4" /></button>
            <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))} className="p-2 text-slate-400 hover:text-slate-200"><Minus className="w-4 h-4" /></button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 text-slate-400 hover:text-slate-200"><Maximize2 className="w-4 h-4" /></button>
          </div>

          {/* Canvas Mini-Map */}
          <div className="absolute bottom-6 left-6 w-44 h-32 bg-slate-900/90 border border-slate-800/80 backdrop-blur-md rounded-xl p-2 z-20 flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase">
              <span className="flex items-center gap-1"><Map className="w-3 h-3 text-cyan-400" /> MiniMap</span>
              <span>{nodes.length} N</span>
            </div>
            
            <div className="relative flex-1 my-1 bg-slate-950/80 rounded border border-slate-800/50 overflow-hidden flex items-center justify-center">
              {nodes.map((node) => {
                const miniX = (node.x / 10) + 70;
                const miniY = (node.y / 10) + 45;
                const isSelected = node.id === selectedNodeId;
                return (
                  <div
                    key={`mini_${node.id}`}
                    style={{ left: `${miniX}px`, top: `${miniY}px` }}
                    className={`absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 ${
                      isSelected ? "bg-cyan-400 ring-2 ring-cyan-400/50 scale-125 z-10" : "bg-slate-600"
                    }`}
                  />
                );
              })}
              <div
                style={{
                  transform: `translate(${-pan.x / 10}px, ${-pan.y / 10}px) scale(${1 / zoom})`,
                }}
                className="w-16 h-10 border border-cyan-400/60 bg-cyan-500/10 rounded pointer-events-none transition-transform duration-75"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Inspector Panel */}
      {selectedNode && (
        <div className="w-72 border-l border-slate-800/80 bg-slate-900/40 p-4 flex flex-col justify-between z-20">
          <div>
            <h2 className="text-sm font-bold text-slate-300 mb-4">Node Inspector</h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Title</label>
                <input value={selectedNode.title} onChange={(e) => updateSelectedNode({ title: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500/50" />
              </div>

              <div>
                <label className="text-slate-500 block mb-1.5 flex items-center gap-1">
                  <Palette className="w-3 h-3" /> Color Theme
                </label>
                <div className="flex items-center gap-2">
                  {(["cyan", "emerald", "purple", "amber", "rose"] as NodeColor[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => updateSelectedNode({ color: c })}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        c === "cyan" ? "bg-cyan-400" :
                        c === "emerald" ? "bg-emerald-400" :
                        c === "purple" ? "bg-purple-400" :
                        c === "amber" ? "bg-amber-400" : "bg-rose-400"
                      } ${(selectedNode.color || "cyan") === c ? "scale-125 ring-2 ring-white/50" : "opacity-60 hover:opacity-100"}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={duplicateSelectedNode}
                className="w-full py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Duplicate Node
              </button>

              <button
                onClick={() => setIsConnectMode(!isConnectMode)}
                className={`w-full py-2 rounded-lg border font-semibold flex items-center justify-center gap-2 ${
                  isConnectMode ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                {isConnectMode ? "Click Target Node..." : "Connect to Node"}
              </button>

              <button 
                onClick={removeConnectionsForSelected} 
                className="w-full py-2 bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Unlink className="w-3.5 h-3.5" /> Unlink Connections
              </button>

              <button 
                onClick={() => setIsDetailsOpen(true)} 
                className="w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Details Panel
              </button>
            </div>
          </div>

          <button onClick={deleteSelectedNode} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete Node
          </button>
        </div>
      )}

      {/* Details Drawer */}
      {isDetailsOpen && selectedNode && (
        <div className="absolute inset-y-0 right-0 w-96 bg-slate-900/95 border-l border-slate-800 p-6 shadow-2xl z-50 flex flex-col justify-between backdrop-blur-lg">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {getNodeIcon(selectedNode.type, selectedNode.color)}
                <h3 className="font-bold text-slate-200">{selectedNode.title}</h3>
              </div>
              <button onClick={() => setIsDetailsOpen(false)} className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-800 mb-4 text-xs font-medium text-slate-400">
              <button 
                onClick={() => setActiveTab("notes")} 
                className={`flex-1 py-2 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${activeTab === "notes" ? "border-cyan-400 text-cyan-300 font-semibold" : "border-transparent hover:text-slate-300"}`}
              >
                <FileText className="w-3.5 h-3.5" /> Notes
              </button>
              <button 
                onClick={() => setActiveTab("checklist")} 
                className={`flex-1 py-2 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${activeTab === "checklist" ? "border-cyan-400 text-cyan-300 font-semibold" : "border-transparent hover:text-slate-300"}`}
              >
                <CheckSquare className="w-3.5 h-3.5" /> Tasks
              </button>
              <button 
                onClick={() => setActiveTab("code")} 
                className={`flex-1 py-2 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${activeTab === "code" ? "border-cyan-400 text-cyan-300 font-semibold" : "border-transparent hover:text-slate-300"}`}
              >
                <Code className="w-3.5 h-3.5" /> Code
              </button>
            </div>

            {activeTab === "notes" && (
              <textarea 
                value={selectedNode.notes || ""} 
                onChange={(e) => updateSelectedNode({ notes: e.target.value })} 
                placeholder="Write custom node documentation or notes here..." 
                className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 resize-none focus:outline-none focus:border-cyan-500/50" 
              />
            )}

            {activeTab === "checklist" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input 
                    value={newTaskText} 
                    onChange={(e) => setNewTaskText(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && addTask()} 
                    placeholder="Add new task..." 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
                  />
                  <button onClick={addTask} className="px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded transition-colors">+</button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {(selectedNode.checklist || []).length === 0 ? (
                    <div className="text-[11px] text-slate-600 italic py-2 text-center">No tasks added yet.</div>
                  ) : (
                    (selectedNode.checklist || []).map((t) => (
                      <div key={t.id} className="flex items-center gap-2 p-2 rounded bg-slate-800/40 text-xs text-slate-300">
                        <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)} className="cursor-pointer accent-cyan-400" />
                        <span className={t.completed ? "line-through text-slate-500" : ""}>{t.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <textarea 
                value={selectedNode.codeSnippet || ""} 
                onChange={(e) => updateSelectedNode({ codeSnippet: e.target.value })} 
                placeholder="// Enter code snippet here..." 
                className="w-full h-64 bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800 rounded-lg p-3 resize-none focus:outline-none focus:border-cyan-500/50" 
              />
            )}
          </div>
          <div className="text-[10px] text-slate-500 text-center font-mono">Changes auto-saved</div>
        </div>
      )}
    </div>
  );
}