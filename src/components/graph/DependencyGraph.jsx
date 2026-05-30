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
  getSmoothStepPath,
  EdgeLabelRenderer,
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
  depends_on: 'var(--text-main)',
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
      border: `1.5px solid ${priorityColor}`,
      borderRadius: '12px',
      padding: '0.75rem 1rem',
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15), 0 0 10px ${priorityColor}1a`,
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
        color: 'var(--text-main)', // High-contrast readable title text
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

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  label,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate position 20px before the targetX, targetY point
  // Since the edge is smoothstep and target is on the Left, the line segment directly entering the target is horizontal.
  const iconX = targetX - 20;
  const iconY = targetY;

  const isBlocks = data?.type === 'blocks';
  const isDepends = data?.type === 'depends_on';

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        {/* Edge Text Label */}
        {label && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'var(--bg-card)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '9px',
              color: 'var(--text-muted)',
              fontWeight: 500,
              pointerEvents: 'none',
              fontFamily: 'var(--font-sans)',
              border: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap',
              zIndex: 999,
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        )}

        {/* Lock/Chain Icons */}
        {(isBlocks || isDepends) && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${iconX}px,${iconY}px)`,
              pointerEvents: 'none',
              zIndex: 1000,
            }}
            className="nodrag nopan"
          >
            {isBlocks ? (
              <div style={{
                background: '#EF4444',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                border: '1.5px solid #FFFFFF',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            ) : (
              <div style={{
                background: '#1E1E24',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                border: '1.5px solid #FFFFFF',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
            )}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = { custom: CustomNode };
const edgeTypes = { customEdge: CustomEdge };

export default function DependencyGraphView({ graph }) {
  const initialNodes = useMemo(() => {
    if (!graph?.nodes) return [];
    return graph.nodes.map((n) => ({
      id: n.id,
      type: 'custom',
      position: n.position
        ? { x: n.position.x * 2.3, y: n.position.y * 1.7 }
        : { x: Math.random() * 800, y: Math.random() * 600 },
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
      type: 'customEdge',
      animated: e.type === 'blocks',
      data: {
        type: e.type,
      },
      style: {
        stroke: edgeTypeColors[e.type] || 'var(--text-body)',
        strokeWidth: e.type === 'blocks' ? 2.5 : 2.0,
        strokeDasharray: e.type === 'blocks' ? '5,5' : undefined,
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
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '24px', height: '2px', borderBottom: '2px dashed #EF4444', display: 'inline-block' }} />
            <div style={{
              background: '#EF4444',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '14px',
              height: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #FFFFFF',
            }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
          Blocks
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '24px', height: '2px', background: 'var(--text-main)', display: 'inline-block' }} />
            <div style={{
              background: '#1E1E24',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '14px',
              height: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #FFFFFF',
            }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
          </div>
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
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="var(--border-main)" variant="dots" gap={20} size={1} />
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
