export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  GRAPH = 'GRAPH',
  VECTORS = 'VECTORS',
  AGENT = 'AGENT'
}

export interface MemoryNode {
  id: string;
  label: string;
  type: 'entity' | 'concept' | 'event' | 'person';
  timestamp: number;
}

export interface MemoryLink {
  source: string;
  target: string;
  relation: string;
}

export interface VectorPoint {
  id: string;
  x: number;
  y: number;
  content: string;
  category: string;
}

export interface SystemEvent {
  id: string;
  type: 'CAPTURE' | 'PROCESS' | 'EMBED' | 'STORE' | 'SYNC' | 'RETRIEVE' | 'SYSTEM';
  message: string;
  timestamp: number;
  status: 'pending' | 'success' | 'processing';
}

export interface ProcessingResult {
  entities: { name: string; type: string }[];
  relationships: { source: string; target: string; relation: string }[];
  vector: { x: number; y: number; category: string };
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
}