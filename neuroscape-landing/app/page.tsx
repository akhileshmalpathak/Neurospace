"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Cpu, 
  Layers, 
  Zap, 
  Share2, 
  BrainCircuit, 
  ExternalLink,
  Sparkles
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("devs");

  const APP_URL = "https://neurospace-ten.vercel.app/";

  return (
    <main className="min-h-screen bg-[#0d0f18] text-[#e0e6ed] font-mono selection:bg-[#ff0055] selection:text-white relative overflow-hidden pb-20">
      
      {/* Retro Grid Background */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#00ffcc 1px, transparent 1px), linear-gradient(90deg, #00ffcc 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Navbar */}
      <nav className="border-b-4 border-[#00ffcc] bg-[#121524] px-6 py-4 sticky top-0 z-50 shadow-[0_4px_0_0_#000]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-[#00ffcc] p-1.5 border-2 border-black shadow-[2px_2px_0_0_#000]">
              <BrainCircuit className="w-6 h-6 text-black" />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-[#00ffcc] uppercase" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px' }}>
              NEUROSPACE_
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-xs bg-[#22273e] text-[#ff0055] px-3 py-1 border-2 border-black font-bold uppercase">
              v1.0 LIVE
            </span>
            <a
              href={APP_URL}
              target="_blank"
              rel="noreferrer"
              className="bg-[#ff0055] hover:bg-[#e0004c] text-white px-5 py-2 border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none font-bold text-sm tracking-wide transition-all flex items-center gap-2"
            >
              LAUNCH APP <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-12 max-w-5xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="inline-flex items-center gap-2 bg-[#1a1f36] border-2 border-[#00ffcc] text-[#00ffcc] px-4 py-1.5 text-xs font-bold uppercase mb-8 shadow-[3px_3px_0_0_#000]">
            <Sparkles className="w-4 h-4 text-[#ff0055]" /> [ SYSTEM STATUS: ONLINE ]
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-wide mb-6 uppercase text-white drop-shadow-[3px_3px_0_#ff0055]">
            Map Your Brain In <br />
            <span className="text-[#00ffcc] bg-[#181d30] px-3 py-1 border-4 border-black inline-block mt-2 shadow-[5px_5px_0_0_#ff0055]">
              PIXELATED 3D SPACE
            </span>
          </h1>

          <p className="text-[#8f9bba] text-base md:text-lg max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
            Ditch Boring 2D Notes. Construct hyper-connected visual node graphs, software architectures, and mind canvases at lightning speeds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={APP_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-[#00ffcc] hover:bg-[#00e6b8] text-black font-black px-8 py-4 border-4 border-black shadow-[6px_6px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none text-base tracking-wider uppercase transition-all"
            >
              ▶ ENTER CANVAS NOW
            </a>
          </div>
        </motion.div>
      </section>

      {/* Interactive Mock Terminal / App Preview */}
      <section className="px-6 py-6 max-w-4xl mx-auto relative z-10">
        <div className="bg-[#121524] border-4 border-[#00ffcc] p-4 shadow-[8px_8px_0_0_#000]">
          <div className="flex items-center justify-between border-b-2 border-[#1e243d] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#ff0055] inline-block border border-black"></span>
              <span className="w-3 h-3 bg-[#ffcc00] inline-block border border-black"></span>
              <span className="w-3 h-3 bg-[#00ffcc] inline-block border border-black"></span>
              <span className="text-xs text-[#8f9bba] ml-2 font-bold">[neurospace_shell.exe]</span>
            </div>
            <Terminal className="w-4 h-4 text-[#00ffcc]" />
          </div>

          <div className="bg-[#090b12] p-6 border-2 border-black min-h-[220px] flex flex-col justify-between">
            <div className="space-y-2 text-xs md:text-sm">
              <p className="text-[#00ffcc]">&gt; initialize --nodes=spatial_graph</p>
              <p className="text-white">&gt; Status: Loading 3D spatial canvas grid... OK</p>
              <p className="text-[#ff0055]">&gt; Connected to local state engine [Zero Latency]</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <div className="bg-[#181d30] p-3 border-2 border-[#00ffcc] text-center">
                <div className="text-[#00ffcc] text-xs font-bold">NODE_COUNT</div>
                <div className="text-white text-lg font-black">256+</div>
              </div>
              <div className="bg-[#181d30] p-3 border-2 border-[#ff0055] text-center">
                <div className="text-[#ff0055] text-xs font-bold">RENDER_MODE</div>
                <div className="text-white text-lg font-black">WebGL</div>
              </div>
              <div className="bg-[#181d30] p-3 border-2 border-[#ffcc00] text-center">
                <div className="text-[#ffcc00] text-xs font-bold">LATENCY</div>
                <div className="text-white text-lg font-black">0.02ms</div>
              </div>
              <div className="bg-[#181d30] p-3 border-2 border-white text-center">
                <div className="text-white text-xs font-bold">FPS</div>
                <div className="text-white text-lg font-black">60.0</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 py-12 max-w-6xl mx-auto relative z-10">
        <h2 className="text-xl md:text-2xl font-black text-center text-[#00ffcc] uppercase mb-10 tracking-widest">
          /// SYSTEM_FEATURES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121524] border-4 border-black p-6 shadow-[6px_6px_0_0_#ff0055]">
            <Layers className="w-10 h-10 text-[#ff0055] mb-4" />
            <h3 className="text-lg font-black text-white mb-2 uppercase">3D Node Mapping</h3>
            <p className="text-[#8f9bba] text-xs leading-relaxed">
              Connect concepts visually in infinite spatial directions instead of stacked static lists.
            </p>
          </div>

          <div className="bg-[#121524] border-4 border-black p-6 shadow-[6px_6px_0_0_#00ffcc]">
            <Zap className="w-10 h-10 text-[#00ffcc] mb-4" />
            <h3 className="text-lg font-black text-white mb-2 uppercase">Zero-Lag Canvas</h3>
            <p className="text-[#8f9bba] text-xs leading-relaxed">
              Built on modern Next.js stack ensuring silky smooth node movement and camera panning.
            </p>
          </div>

          <div className="bg-[#121524] border-4 border-black p-6 shadow-[6px_6px_0_0_#ffcc00]">
            <Share2 className="w-10 h-10 text-[#ffcc00] mb-4" />
            <h3 className="text-lg font-black text-white mb-2 uppercase">Modular Logic</h3>
            <p className="text-[#8f9bba] text-xs leading-relaxed">
              Ideal for mapping complex code dependencies, research papers, and product roadmaps.
            </p>
          </div>
        </div>
      </section>

      {/* Target Use Cases Tab Section */}
      <section className="px-6 py-12 max-w-5xl mx-auto relative z-10">
        <div className="bg-[#121524] border-4 border-black p-6 shadow-[8px_8px_0_0_#00ffcc]">
          <h2 className="text-lg md:text-xl font-black text-white mb-6 uppercase flex items-center gap-2">
            <Cpu className="text-[#00ffcc]" /> WHO USES NEUROSPACE?
          </h2>

          <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-black pb-4">
            <button
              onClick={() => setActiveTab("devs")}
              className={`px-4 py-2 text-xs font-bold border-2 border-black ${
                activeTab === "devs" ? "bg-[#00ffcc] text-black shadow-[2px_2px_0_0_#000]" : "bg-[#1a1f36] text-white"
              }`}
            >
              DEVELOPERS
            </button>
            <button
              onClick={() => setActiveTab("creatives")}
              className={`px-4 py-2 text-xs font-bold border-2 border-black ${
                activeTab === "creatives" ? "bg-[#ff0055] text-white shadow-[2px_2px_0_0_#000]" : "bg-[#1a1f36] text-white"
              }`}
            >
              GAMERS & DESIGNERS
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 text-xs font-bold border-2 border-black ${
                activeTab === "students" ? "bg-[#ffcc00] text-black shadow-[2px_2px_0_0_#000]" : "bg-[#1a1f36] text-white"
              }`}
            >
              STUDENTS & RESEARCHERS
            </button>
          </div>

          <div className="bg-[#0a0c14] p-5 border-2 border-black">
            {activeTab === "devs" && (
              <div>
                <h4 className="text-[#00ffcc] text-sm font-bold mb-2">&gt; SYSTEM ARCHITECTURE & API MAPS</h4>
                <p className="text-[#8f9bba] text-xs leading-relaxed">
                  Map microservices, database schemas, frontend route flows, and component dependency trees in a single unified 3D graph.
                </p>
              </div>
            )}
            {activeTab === "creatives" && (
              <div>
                <h4 className="text-[#ff0055] text-sm font-bold mb-2">&gt; GAME DESIGN & STORYBOARDS</h4>
                <p className="text-[#8f9bba] text-xs leading-relaxed">
                  Plot non-linear game mechanics, branch story quests, UI/UX interaction flows, and level designs visually.
                </p>
              </div>
            )}
            {activeTab === "students" && (
              <div>
                <h4 className="text-[#ffcc00] text-sm font-bold mb-2">&gt; CONCEPT LINKING & STUDY TREES</h4>
                <p className="text-[#8f9bba] text-xs leading-relaxed">
                  Connect complex physics formulas, syllabus modules, or historical timelines in a spatial memory palace layout.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-6 pt-8 max-w-4xl mx-auto text-center relative z-10">
        <div className="bg-[#ff0055] border-4 border-black p-8 shadow-[8px_8px_0_0_#00ffcc]">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase mb-4">
            READY TO BUILD YOUR NEURAL MAP?
          </h2>
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-black hover:bg-[#1a1a1a] text-[#00ffcc] font-black px-8 py-3 border-2 border-white shadow-[4px_4px_0_0_#fff] text-sm uppercase transition"
          >
            Launch Neurospace Free →
          </a>
        </div>
      </section>

    </main>
  );
}