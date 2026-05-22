import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch } from 'lucide-react';

const priorityColors = {
  critical: '#DC2626',
  high: '#D97706',
  medium: '#0284C7',
  low: '#16A34A',
};

const priorityBadgeStyles = {
  critical: {
    color: '#DC2626',
    background: 'rgba(220, 38, 38, 0.12)',
    border: '1px solid rgba(220, 38, 38, 0.25)',
  },
  high: {
    color: '#D97706',
    background: 'rgba(217, 119, 6, 0.12)',
    border: '1px solid rgba(217, 119, 6, 0.25)',
  },
  medium: {
    color: '#0284C7',
    background: 'rgba(2, 132, 199, 0.12)',
    border: '1px solid rgba(2, 132, 199, 0.25)',
  },
  low: {
    color: '#16A34A',
    background: 'rgba(22, 163, 74, 0.12)',
    border: '1px solid rgba(22, 163, 74, 0.25)',
  },
};

const edgeTypeColors = {
  blocks: '#EF4444',
  depends_on: 'var(--text-body)',
  related_to: 'var(--text-muted)',
};

function CustomNode({ data }) {
  const priority = data.priority?.toLowerCase() || 'medium';
  const priorityColor = priorityColors[priority] || '#0284C7';
  const badgeStyle = priorityBadgeStyles[priority] || priorityBadgeStyles.medium;

  return (
    <div style={{
      minWidth: '200px',
      background: 'var(--bg-surface)',
      border: `1px solid ${priorityColor}40`,
      borderRadius: '12px',
      padding: '0.75rem 1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      transition: 'all 0.2s ease',
    }}>
      {/* Target connection point on the left side */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'var(--bg-card)',
          border: '2px solid var(--text-muted)',
          width: '8px',
          height: '8px',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{
          fontSize: '0.625rem',
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          color: badgeStyle.color,
          background: badgeStyle.background,
          border: badgeStyle.border,
          padding: '0.125rem 0.375rem',
          borderRadius: '4px',
          fontWeight: 'bold', // Bolded task ID
        }}>
          {data.storyId}
        </span>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: priorityColor,
          }}
        />
      </div>

      <p style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: priorityColor, // Matches priority dot color
        lineHeight: 1.3,
        margin: '0.25rem 0 0.5rem 0',
      }}>
        {data.label}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.375rem' }}>
        {/* Lighter shade for metadata */}
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{data.featureName}</span>
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>•</span>
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{data.storyPoints} pts</span>
      </div>

      {/* Source connection point on the right side */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'var(--bg-card)',
          border: '2px solid var(--text-muted)',
          width: '8px',
          height: '8px',
        }}
      />
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
        stroke: edgeTypeColors[e.type] || 'var(--text-body)',
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
          <span style={{ width: '24px', height: '2px', background: 'var(--text-body)', display: 'inline-block' }} />
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
