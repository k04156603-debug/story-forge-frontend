import { useState } from 'react';
import useStore from '../../store/useStore';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const severityConfig = {
  blocker: {
    icon: AlertTriangle,
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.2)',
    activeBg: 'rgba(239, 68, 68, 0.15)',
  },
  warning: {
    icon: AlertCircle,
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.2)',
    activeBg: 'rgba(245, 158, 11, 0.15)',
  },
  suggestion: {
    icon: Info,
    color: '#0EA5E9',
    bg: 'rgba(14, 165, 233, 0.1)',
    border: 'rgba(14, 165, 233, 0.2)',
    activeBg: 'rgba(14, 165, 233, 0.15)',
  },
};

export default function QualityPanel({ issues: rawIssues, summary }) {
  const [filter, setFilter] = useState('all');
  const { resolveIssue } = useStore();

  const issues = Array.isArray(rawIssues) ? rawIssues : [];
  const filtered = filter === 'all' ? issues : issues.filter((i) => i.severity === filter);

  const handleResolve = async (id) => {
    await resolveIssue(id);
    toast.success('Issue marked as resolved');
  };

  const filterBtnStyle = (isActive) => ({
    fontSize: '0.75rem',
    padding: '0.375rem 0.75rem',
    borderRadius: '100px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textTransform: 'capitalize',
    border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
    background: isActive ? 'var(--bg-card)' : 'transparent',
    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
    fontFamily: 'var(--font-sans)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Summary cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {[
            { icon: AlertTriangle, label: 'Blockers', count: summary.bySeverity?.blocker || 0, cfg: severityConfig.blocker },
            { icon: AlertCircle, label: 'Warnings', count: summary.bySeverity?.warning || 0, cfg: severityConfig.warning },
            { icon: Info, label: 'Suggestions', count: summary.bySeverity?.suggestion || 0, cfg: severityConfig.suggestion },
          ].map(({ icon: Icon, label, count, cfg }, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-main)',
              borderRadius: '16px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={16} color={cfg.color} />
              </div>
              <div>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{count}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <Filter size={13} color="var(--text-muted)" />
        {['all', 'blocker', 'warning', 'suggestion'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={filterBtnStyle(filter === f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Issues list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-main)',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
          }}>
            <CheckCircle2 size={28} color="#16A34A" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
            <p style={{ color: 'var(--text-body)', fontSize: '0.9375rem' }}>No issues found in this category</p>
          </div>
        ) : (
          filtered.map((issue) => {
            const config = severityConfig[issue.severity] || severityConfig.suggestion;
            const Icon = config.icon;

            return (
              <div
                key={issue._id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-main)',
                  borderLeft: `3px solid ${config.color}`,
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  opacity: issue.resolved ? 0.5 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: config.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.125rem',
                  }}>
                    <Icon size={14} color={config.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <h4 style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>{issue.title}</h4>
                      <span className={`badge badge-${issue.severity}`}>{issue.severity}</span>
                      <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        background: 'var(--bg-surface)',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}>
                        {issue.issueType?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', marginBottom: '0.5rem' }}>{issue.description}</p>

                    {issue.originalText && (
                      <div style={{
                        background: 'var(--bg-surface)',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        marginBottom: '0.5rem',
                        borderLeft: '2px solid var(--border-main)',
                      }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Original text:</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', fontStyle: 'italic' }}>"{issue.originalText}"</p>
                      </div>
                    )}

                    {issue.suggestedFix && (
                      <div style={{
                        background: 'rgba(22, 163, 74, 0.05)',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        border: '1px solid rgba(22, 163, 74, 0.15)',
                      }}>
                        <p style={{ fontSize: '0.7rem', color: '#16A34A', marginBottom: '0.25rem', fontWeight: 500 }}>💡 Suggested fix:</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>{issue.suggestedFix}</p>
                      </div>
                    )}
                  </div>

                  {!issue.resolved && (
                    <button
                      onClick={() => handleResolve(issue._id)}
                      title="Mark as resolved"
                      style={{
                        padding: '0.375rem',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#16A34A'; e.currentTarget.style.background = 'rgba(22, 163, 74, 0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
