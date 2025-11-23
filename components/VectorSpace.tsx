import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { VectorPoint } from '../types';

interface VectorSpaceProps {
  vectors: VectorPoint[];
}

const VectorSpace: React.FC<VectorSpaceProps> = ({ vectors }) => {
  const COLORS = ['#00f0ff', '#b026ff', '#00ff9d', '#ff2a6d'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-shadow-800 border border-shadow-600 p-3 rounded shadow-xl">
          <p className="text-neon-blue font-bold font-mono text-xs mb-1">{data.category.toUpperCase()}</p>
          <p className="text-white text-sm">{data.content}</p>
          <p className="text-gray-500 text-[10px] font-mono mt-2">
            VEC: [{data.x.toFixed(2)}, {data.y.toFixed(2)}]
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full bg-shadow-900 rounded-lg border border-shadow-700 relative p-4">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h2 className="text-neon-purple font-mono font-bold text-sm tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></span>
          VECTOR_EMBEDDINGS_SPACE
        </h2>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Latent Semantic Projection (2D PCA Reduced)
        </p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#272732" strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="dimension_1" stroke="#4b5563" tick={{fontSize: 10}} domain={[-120, 120]} />
          <YAxis type="number" dataKey="y" name="dimension_2" stroke="#4b5563" tick={{fontSize: 10}} domain={[-120, 120]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Memory" data={vectors} fill="#8884d8">
            {vectors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VectorSpace;