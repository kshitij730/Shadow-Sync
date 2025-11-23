import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, MemoryNode, MemoryLink, VectorPoint, SystemEvent, ChatMessage } from './types';
import { processContextInput, queryAgent } from './services/geminiService';
import KnowledgeGraph from './components/KnowledgeGraph';
import VectorSpace from './components/VectorSpace';
import EventBus from './components/EventBus';
import IngestControl from './components/IngestControl';
import { Brain, Network, Share2, Layers, Cpu, Search, User } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // System State
  const [nodes, setNodes] = useState<MemoryNode[]>([]);
  const [links, setLinks] = useState<MemoryLink[]>([]);
  const [vectors, setVectors] = useState<VectorPoint[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);

  // Real-time System Health State
  const [systemHealth, setSystemHealth] = useState({
    consistency: 99.999,
    latency: 24,
    replication: 3,
    storageMB: 1.24,
    memoryBuffer: 12
  });
  
  // Agent State
  const [agentInput, setAgentInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '0', role: 'system', content: 'ShadowSync Agent v2.5 Online. Waiting for query...', timestamp: Date.now() }
  ]);

  useEffect(() => {
    if (!process.env.API_KEY) setApiKeyMissing(true);
    // Initial boot event
    addEvent('SYSTEM', 'ShadowSync Core initialized.');
    addEvent('SYNC', 'Establishing P2P mesh connection...');
    setTimeout(() => addEvent('SYNC', 'Mesh active. 3 nodes connected.'), 1200);
  }, []);

  // System Health Simulation Heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => {
        // Latency jitter based on processing state
        const baseLatency = isProcessing ? 65 : 24;
        const jitter = Math.floor(Math.random() * 15) - 5;
        let newLatency = baseLatency + jitter;

        // Memory buffer simulation (fills when processing, drains when idle)
        let newBuffer = prev.memoryBuffer;
        if (isProcessing) {
          newBuffer = Math.min(98, newBuffer + (Math.random() * 15));
        } else {
          newBuffer = Math.max(8, newBuffer - (Math.random() * 5));
        }

        // Consistency micro-fluctuations (99.9xx%)
        const newConsistency = 100 - (Math.random() * 0.005);

        return {
          ...prev,
          latency: newLatency,
          memoryBuffer: Math.floor(newBuffer),
          consistency: parseFloat(newConsistency.toFixed(4))
        };
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isProcessing]);

  // Update Storage calculation when data changes
  useEffect(() => {
    const baseSize = 1.24;
    // Estimate size: 0.015MB per node, 0.005MB per vector
    const calculatedSize = baseSize + (nodes.length * 0.015) + (vectors.length * 0.005);
    
    setSystemHealth(prev => ({
      ...prev,
      storageMB: parseFloat(calculatedSize.toFixed(3))
    }));
  }, [nodes.length, vectors.length]);

  const addEvent = (type: SystemEvent['type'], message: string) => {
    const newEvent: SystemEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: Date.now(),
      status: 'success'
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
  };

  const handleIngest = async (text: string) => {
    setIsProcessing(true);
    // Spike buffer immediately on ingest
    setSystemHealth(prev => ({ ...prev, memoryBuffer: Math.min(100, prev.memoryBuffer + 25) }));
    
    addEvent('CAPTURE', `Received context: "${text.substring(0, 30)}..."`);

    // Simulate pipeline delay
    setTimeout(() => addEvent('PROCESS', 'Normalizing input data structure...'), 400);

    const result = await processContextInput(text);

    if (result) {
      addEvent('PROCESS', 'Context extracted successfully.');
      
      // Update Graph
      const newNodes: MemoryNode[] = result.entities.map(e => ({
        id: e.name,
        label: e.name,
        type: e.type.toLowerCase().includes('person') ? 'person' : 
              e.type.toLowerCase().includes('event') ? 'event' : 'concept',
        timestamp: Date.now()
      }));

      const newLinks: MemoryLink[] = result.relationships.map(r => ({
        source: r.source,
        target: r.target,
        relation: r.relation
      }));

      // Update State with de-duplication logic (simple)
      setNodes(prev => {
        const combined = [...prev, ...newNodes];
        return Array.from(new Map(combined.map(item => [item.label, item])).values());
      });
      setLinks(prev => [...prev, ...newLinks]);
      addEvent('STORE', `Updated Knowledge Graph: +${newNodes.length} nodes.`);

      // Update Vectors
      const newVector: VectorPoint = {
        id: Math.random().toString(36),
        x: result.vector.x,
        y: result.vector.y,
        content: text,
        category: result.vector.category
      };
      setVectors(prev => [...prev, newVector]);
      addEvent('EMBED', `Generated Vector [${newVector.x.toFixed(1)}, ${newVector.y.toFixed(1)}]`);

      // Final Sync
      setTimeout(() => {
        addEvent('SYNC', 'Replicating state to connected agents...');
      }, 800);
      
    } else {
      addEvent('PROCESS', 'Failed to extract structure. Check API Key.');
    }

    setIsProcessing(false);
  };

  const handleAgentQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentInput.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: agentInput, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setAgentInput('');
    addEvent('RETRIEVE', 'Agent requesting memory access...');

    // Construct context summary for agent
    const contextSummary = `
      Entities: ${nodes.map(n => n.label).join(', ')}
      Recent Memories: ${vectors.slice(-5).map(v => v.content).join(' | ')}
    `;

    const response = await queryAgent(userMsg.content, contextSummary);
    
    setChatHistory(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'agent',
      content: response,
      timestamp: Date.now()
    }]);
    addEvent('RETRIEVE', 'Agent response delivered.');
  };

  if (apiKeyMissing) {
    return (
      <div className="h-screen w-screen bg-shadow-900 text-white flex items-center justify-center font-mono">
        <div className="max-w-md text-center p-8 border border-red-500 rounded bg-shadow-800">
          <h1 className="text-2xl font-bold mb-4 text-red-500">API Key Missing</h1>
          <p className="mb-4">ShadowSync requires a Gemini API Key to function.</p>
          <p className="text-sm text-gray-400">Please set `process.env.API_KEY` in your environment or code.</p>
        </div>
      </div>
    );
  }

  // Helper to determine buffer color
  const getBufferColor = (val: number) => {
    if (val > 80) return 'bg-neon-red';
    if (val > 50) return 'bg-yellow-400';
    return 'bg-neon-blue';
  };

  return (
    <div className="h-screen w-screen bg-shadow-900 text-gray-200 flex overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <div className="w-16 flex-shrink-0 bg-shadow-800 border-r border-shadow-600 flex flex-col items-center py-6 gap-6 z-20">
        <div className="w-10 h-10 bg-neon-blue/10 rounded-lg flex items-center justify-center text-neon-blue border border-neon-blue/20 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Layers size={24} />
        </div>
        
        <div className="flex-1 flex flex-col gap-4 w-full px-2">
          <NavButton 
            active={activeView === ViewState.DASHBOARD} 
            onClick={() => setActiveView(ViewState.DASHBOARD)} 
            icon={<Brain size={20} />} 
            label="Dash" 
          />
          <NavButton 
            active={activeView === ViewState.GRAPH} 
            onClick={() => setActiveView(ViewState.GRAPH)} 
            icon={<Share2 size={20} />} 
            label="Graph" 
          />
          <NavButton 
            active={activeView === ViewState.VECTORS} 
            onClick={() => setActiveView(ViewState.VECTORS)} 
            icon={<Network size={20} />} 
            label="Vecs" 
          />
           <NavButton 
            active={activeView === ViewState.AGENT} 
            onClick={() => setActiveView(ViewState.AGENT)} 
            icon={<User size={20} />} 
            label="Agent" 
          />
        </div>

        <div className="mt-auto flex flex-col items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-400 animate-ping' : 'bg-neon-green'}`}></div>
           <span className="text-[10px] font-mono text-gray-500">ONLINE</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-shadow-900/80 backdrop-blur-md border-b border-shadow-700 flex items-center justify-between px-6 z-10">
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tighter text-white">
              SHADOW<span className="text-neon-blue">SYNC</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest">DISTRIBUTED CONTEXT ENGINE</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-shadow-700 rounded-full border border-shadow-600">
                <span className="text-xs text-gray-400 font-mono">MEM_NODES:</span>
                <span className="text-sm font-bold text-neon-purple font-mono">{nodes.length}</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-shadow-700 rounded-full border border-shadow-600">
                <span className="text-xs text-gray-400 font-mono">VEC_EMBEDS:</span>
                <span className="text-sm font-bold text-neon-blue font-mono">{vectors.length}</span>
             </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 relative overflow-hidden bg-shadow-900 p-4">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,24,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,24,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

          {activeView === ViewState.DASHBOARD && (
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
              <div className="col-span-1 row-span-2 rounded-xl overflow-hidden border border-shadow-600 shadow-2xl relative">
                 <KnowledgeGraph nodes={nodes} links={links} />
              </div>
              <div className="col-span-1 rounded-xl overflow-hidden border border-shadow-600 shadow-2xl relative">
                 <VectorSpace vectors={vectors} />
              </div>
              <div className="col-span-1 bg-shadow-800 rounded-xl border border-shadow-600 p-6 flex flex-col transition-all duration-300">
                <h3 className="text-neon-green font-mono text-sm font-bold mb-4 flex items-center justify-between">
                  <span>SYSTEM_HEALTH</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                  </span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   <StatCard label="Consistency" value={`${systemHealth.consistency.toFixed(3)}%`} />
                   <StatCard label="Latency" value={`${systemHealth.latency}ms`} />
                   <StatCard label="Replication" value={`${systemHealth.replication}/3 Nodes`} />
                   <StatCard label="Storage" value={`${systemHealth.storageMB} MB`} />
                </div>
                <div className="mt-auto pt-4 border-t border-shadow-700">
                  <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
                    <span>MEMORY BUFFER IO</span>
                    <span className={isProcessing ? 'text-neon-purple animate-pulse' : 'text-gray-400'}>
                      {systemHealth.memoryBuffer}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-shadow-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ease-out ${getBufferColor(systemHealth.memoryBuffer)}`}
                      style={{ width: `${systemHealth.memoryBuffer}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === ViewState.GRAPH && (
            <div className="h-full w-full rounded-xl overflow-hidden border border-shadow-600 shadow-2xl">
              <KnowledgeGraph nodes={nodes} links={links} />
            </div>
          )}

          {activeView === ViewState.VECTORS && (
             <div className="h-full w-full rounded-xl overflow-hidden border border-shadow-600 shadow-2xl">
              <VectorSpace vectors={vectors} />
            </div>
          )}

          {activeView === ViewState.AGENT && (
            <div className="h-full max-w-3xl mx-auto flex flex-col bg-shadow-800 rounded-xl border border-shadow-600 overflow-hidden">
               <div className="p-4 border-b border-shadow-600 bg-shadow-800 sticky top-0 flex items-center gap-3">
                 <div className="p-2 bg-neon-purple/20 rounded-lg">
                   <Brain className="text-neon-purple" size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-white">Context Agent</h3>
                   <p className="text-xs text-gray-400 font-mono">Accessing Shared Memory Layer</p>
                 </div>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatHistory.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        msg.role === 'user' 
                          ? 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-tr-none' 
                          : 'bg-shadow-700 border border-shadow-600 text-gray-200 rounded-tl-none'
                      }`}>
                         <p className="whitespace-pre-wrap">{msg.content}</p>
                         <span className="text-[10px] opacity-50 block mt-2 font-mono text-right">
                           {new Date(msg.timestamp).toLocaleTimeString()}
                         </span>
                      </div>
                    </div>
                  ))}
               </div>
               <form onSubmit={handleAgentQuery} className="p-4 border-t border-shadow-600 bg-shadow-900 flex gap-2">
                 <input 
                    className="flex-1 bg-shadow-800 border border-shadow-600 rounded p-2 text-sm text-white focus:border-neon-purple focus:outline-none"
                    placeholder="Ask about stored context..."
                    value={agentInput}
                    onChange={e => setAgentInput(e.target.value)}
                 />
                 <button type="submit" className="bg-neon-purple text-white p-2 rounded hover:bg-neon-purple/80 transition-colors">
                   <Search size={18} />
                 </button>
               </form>
            </div>
          )}

        </main>

        {/* Bottom Ingestion Control */}
        <div className="z-20">
          <IngestControl onIngest={handleIngest} isProcessing={isProcessing} />
        </div>
      </div>

      {/* Right Event Bus */}
      <EventBus events={events} />

    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
      active 
      ? 'bg-shadow-700 text-neon-blue shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-shadow-600' 
      : 'text-gray-500 hover:text-gray-300 hover:bg-shadow-700/50'
    }`}
  >
    {icon}
    <span className="text-[10px] font-mono">{label}</span>
  </button>
);

const StatCard = ({ label, value }: any) => (
  <div className="bg-shadow-900/50 p-3 rounded border border-shadow-700">
    <p className="text-[10px] text-gray-500 font-mono uppercase mb-1">{label}</p>
    <p className="text-lg font-bold text-white font-mono">{value}</p>
  </div>
);

export default App;
