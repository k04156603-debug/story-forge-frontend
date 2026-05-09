import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch } from 'lucide-react';

const priorityColors = {
  critical: '#DC2626',
  high: '#D97706',
  medium: '#0284C7',
  low: '#16A34A',
};

const edgeTypeColors = {
  blocks: '#EF4444',
  depends_on: 'var(--text-muted)',
  related_to: 'var(--border-main)',
};

function CustomNode({ data }) {
  return (
    <div style={{ minWidth: '180px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
        <span style={{
          fontSize: '0.625rem',
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          color: 'var(--terracotta)',
          background: 'var(--terracotta-bg)',
          padding: '0.125rem 0.375rem',
          borderRadius: '4px',
          fontWeight: 600,
        }}>
          {data.storyId}
        </span>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: priorityColors[data.priority] || '#0284C7'
          }}
        />
      </div>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.25 }}>{data.label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.375rem' }}>
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{data.featureName}</span>
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>•</span>
        <span style={{ fontSize: '0.625rem', color: 'var(--accent)' }}>{data.storyPoints} pts</span>
      </div>
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

export default function DependencyGraphView({ graph }) {
  const initialNodes = useMemo(() => {
    if (!graph?.nodes) return [];
    return graph.nodes.map((n) => ({
      id: n.id,
      type: 'custom',
      position: n.position || { x: Math.random() * 800, y: Math.random() * 600 },
      data: {
        label: n.label,
        storyId: n.id,
        featureName: n.featureName,
        storyPoints: n.storyPoints,
        priority: n.priority,
      },
    }));
  }, [graph]);

  const initialEdges = useMemo(() => {
    if (!graph?.edges) return [];
    return graph.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: 'smoothstep',
      animated: e.type === 'blocks',
      style: {
        stroke: edgeTypeColors[e.type] || 'var(--warm-gray)',
        strokeWidth: e.type === 'blocks' ? 2 : 1.5,
      },
      labelStyle: { fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-sans)', fontWeight: 500 },
      labelBgStyle: { fill: 'var(--bg-card)', fillOpacity: 0.9 },
    }));
  }, [graph]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  if (!graph || (graph.nodes?.length === 0 && graph.edges?.length === 0)) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-main)',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
      }}>
        <GitBranch size={28} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>No dependency data available</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        fontSize: '0.75rem',
        color: 'var(--text-body)',
        flexWrap: 'wrap',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ width: '24px', height: '2px', background: '#EF4444', display: 'inline-block' }} />
          Blocks
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ width: '24px', height: '2px', background: 'var(--text-muted)', display: 'inline-block' }} />
          Depends on
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} /> Critical</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706' }} /> High</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284C7' }} /> Medium</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }} /> Low</span>
      </div>

      {/* Graph */}
      <div style={{
        height: '600px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-main)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="var(--border-subtle)" gap={20} size={1} />
          <Controls
            style={{ borderRadius: '10px', border: '1px solid var(--border-main)', background: 'var(--bg-card)' }}
          />
          <MiniMap
            nodeColor="var(--bg-surface)"
            maskColor="rgba(0, 0, 0, 0.2)"
            style={{ borderRadius: '10px', border: '1px solid var(--border-main)', background: 'var(--bg-card)' }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
