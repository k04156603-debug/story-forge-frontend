import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, Check, X, Hash } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

export default function StoryCard({ story }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const { updateStory } = useStore();

  const handleEdit = () => {
    setEditData({
      title: story.title,
      userStory: story.userStory,
      storyPoints: story.storyPoints,
      priority: story.priority,
    });
    setEditing(true);
    setExpanded(true);
  };

  const handleSave = async () => {
    try {
      await updateStory(story._id, editData);
      setEditing(false);
      toast.success('Story updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const inputEditStyle = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: '10px',
    padding: '0.5rem 0.75rem',
    color: 'var(--text-main)',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-main)',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'border-color 0.15s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-main)'; }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => !editing && setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: '0.7rem',
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            fontWeight: 600,
            color: 'var(--terracotta)',
            background: 'var(--terracotta-bg)',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            flexShrink: 0,
          }}>
            {story.storyId}
          </span>
          {editing ? (
            <input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              style={{ ...inputEditStyle, flex: 1 }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h4 style={{
              fontWeight: 600,
              color: 'var(--text-main)',
              fontSize: '0.9375rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {story.title}
            </h4>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: '0.75rem' }}>
          <span className={`badge badge-${story.priority}`}>{story.priority}</span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            background: 'var(--bg-surface)',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
          }}>
            <Hash size={11} />
            {story.storyPoints}
          </span>
          {!editing && (
            <button
              onClick={(e) => { e.stopPropagation(); handleEdit(); }}
              style={{
                padding: '0.25rem',
                borderRadius: '6px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted-ed)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--terracotta)'; e.currentTarget.style.background = 'var(--terracotta-bg)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted-ed)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Edit3 size={13} />
            </button>
          )}
          {expanded ? <ChevronUp size={15} color="var(--text-muted-ed)" /> : <ChevronDown size={15} color="var(--text-muted-ed)" />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* User Story */}
          <div>
            <p className="label-section" style={{ marginBottom: '0.375rem' }}>User Story</p>
            {editing ? (
              <textarea
                value={editData.userStory}
                onChange={(e) => setEditData({ ...editData, userStory: e.target.value })}
                style={{ ...inputEditStyle, width: '100%', resize: 'none' }}
                rows={3}
              />
            ) : (
              <p style={{ color: 'var(--text-body)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                "{story.userStory}"
              </p>
            )}
          </div>

          {/* Acceptance Criteria */}
          {story.acceptanceCriteria?.length > 0 && (
            <div>
              <p className="label-section" style={{ marginBottom: '0.5rem' }}>Acceptance Criteria</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {story.acceptanceCriteria.map((ac, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-surface)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                  }}>
                    <p><span style={{ fontWeight: 600, color: '#16A34A' }}>Given</span> <span style={{ color: 'var(--text-body)' }}>{ac.given}</span></p>
                    <p><span style={{ fontWeight: 600, color: '#D97706' }}>When</span> <span style={{ color: 'var(--text-body)' }}>{ac.when}</span></p>
                    <p><span style={{ fontWeight: 600, color: 'var(--terracotta)' }}>Then</span> <span style={{ color: 'var(--text-body)' }}>{ac.then}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edge Cases */}
          {story.edgeCases?.length > 0 && (
            <div>
              <p className="label-section" style={{ marginBottom: '0.5rem' }}>Edge Cases</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {story.edgeCases.map((ec, i) => (
                  <li key={i} style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-body)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}>
                    <span style={{ color: '#D97706', marginTop: '0.125rem' }}>⚡</span> {ec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {story.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {story.tags.map((tag, i) => (
                <span key={i} style={{
                  fontSize: '0.7rem',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '6px',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-main)',
                  fontWeight: 500,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Edit actions */}
          {editing && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              paddingTop: '0.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted-ed)' }}>Points:</label>
                <select
                  value={editData.storyPoints}
                  onChange={(e) => setEditData({ ...editData, storyPoints: Number(e.target.value) })}
                  style={{
                    ...inputEditStyle,
                    padding: '0.25rem 0.5rem',
                  }}
                >
                  {[1, 2, 3, 5, 8, 13, 21].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted-ed)' }}>Priority:</label>
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                  style={{
                    ...inputEditStyle,
                    padding: '0.25rem 0.5rem',
                  }}
                >
                  {['critical', 'high', 'medium', 'low'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }} />
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: '0.375rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted-ed)',
                }}
              >
                <X size={16} />
              </button>
              <button onClick={handleSave} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                <Check size={14} /> Save
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
