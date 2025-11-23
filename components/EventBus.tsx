import React, { useEffect, useRef } from 'react';
import { SystemEvent } from '../types';
import { Activity, Database, Cpu, Wifi, Save } from 'lucide-react';

interface EventBusProps {
  events: SystemEvent[];
}

const EventBus: React.FC<EventBusProps> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);

  const getIcon = (type: SystemEvent['type']) => {
    switch (type) {
      case 'CAPTURE': return <Activity size={14} className="text-neon-blue" />;
      case 'PROCESS': return <Cpu size={14} className="text-neon-purple" />;
      case 'STORE': return <Save size={14} className="text-neon-green" />;
      case 'SYNC': return <Wifi size={14} className="text-white" />;
      case 'EMBED': return <Database size={14} className="text-yellow-400" />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-shadow-800 border-l border-shadow-600 w-80">
      <div className="p-4 border-b border-shadow-600 flex justify-between items-center bg-shadow-900/50 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider">REAL-TIME EVENT BUS</h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 relative" ref={scrollRef}>
        {events.length === 0 && (
          <div className="text-center text-gray-600 mt-10 text-xs font-mono">
            Waiting for activity...
          </div>
        )}
        {events.map((event) => (
          <div 
            key={event.id} 
            className="group flex flex-col bg-shadow-700/50 p-3 rounded border border-shadow-600 hover:border-neon-blue/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {getIcon(event.type)}
                <span className={`text-xs font-bold font-mono ${
                  event.type === 'SYNC' ? 'text-white' : 
                  event.type === 'PROCESS' ? 'text-neon-purple' : 'text-neon-blue'
                }`}>
                  {event.type}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
              </span>
            </div>
            <p className="text-xs text-gray-300 pl-6 leading-tight font-mono opacity-80 group-hover:opacity-100">
              {event.message}
            </p>
            <div className="mt-2 pl-6 flex items-center gap-2">
               <div className="h-0.5 w-full bg-shadow-600 rounded overflow-hidden">
                 <div className="h-full bg-neon-blue animate-pulse w-full origin-left"></div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventBus;