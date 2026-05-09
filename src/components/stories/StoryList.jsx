import { useState } from 'react';
import StoryCard from './StoryCard';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';

export default function StoryList({ groupedStories, stats }) {
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (featureId) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
  };

  if (!groupedStories || groupedStories.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-main)',
        borderRadius: '14px',
        padding: '3rem',
        textAlign: 'center',
      }}>
        <Layers size={28} color="var(--text-muted-ed)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
        <p style={{ color: 'var(--text-muted-ed)', fontSize: '0.9375rem' }}>No stories generated yet</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stats bar */}
      {stats && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          fontSize: '0.875rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ color: 'var(--text-body)' }}>
            <span style={{ fontWeight: 600, color: 'var(--rich-black)' }}>{stats.total}</span> stories
          </span>
          <span style={{ color: 'var(--text-body)' }}>
            <span style={{ fontWeight: 600, color: 'var(--rich-black)' }}>{stats.totalPoints}</span> total points
          </span>
          <span style={{ color: 'var(--text-body)' }}>
            avg <span style={{ fontWeight: 600, color: 'var(--rich-black)' }}>{stats.avgPoints}</span> pts
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span className="badge badge-critical">{stats.byPriority?.critical || 0} critical</span>
            <span className="badge badge-high">{stats.byPriority?.high || 0} high</span>
            <span className="badge badge-medium">{stats.byPriority?.medium || 0} medium</span>
            <span className="badge badge-low">{stats.byPriority?.low || 0} low</span>
          </div>
        </div>
      )}

      {/* Feature groups */}
      {groupedStories.map((group) => {
        const collapsed = collapsedGroups[group.feature.id];
        return (
          <div key={group.feature.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Feature header */}
            <button
              onClick={() => toggleGroup(group.feature.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: 'var(--ivory-warm)',
                border: '1px solid var(--warm-gray-subtle)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--warm-gray)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--warm-gray-subtle)'; }}
            >
              {collapsed ? (
                <ChevronRight size={15} color="var(--text-muted-ed)" />
              ) : (
                <ChevronDown size={15} color="var(--text-muted-ed)" />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--rich-black)' }}>{group.feature.name}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted-ed)', marginTop: '0.125rem' }}>
                  {group.stories.length} stories · {group.feature.category}
                </p>
              </div>
              <span className={`badge badge-${group.feature.priority}`}>{group.feature.priority}</span>
            </button>

            {/* Stories */}
            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                {group.stories.map((story) => (
                  <StoryCard key={story._id} story={story} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
