import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import usePolling from '../hooks/usePolling';
import { Loader2, CheckCircle2, AlertTriangle, Brain, Code2, Search, GitBranch } from 'lucide-react';

const stages = [
  { key: 'extracting', label: 'Extracting Features', icon: Search },
  { key: 'generating', label: 'Generating Stories', icon: Code2 },
  { key: 'analyzing', label: 'Quality Analysis', icon: Brain },
  { key: 'dependencies', label: 'Mapping Dependencies', icon: GitBranch },
];

export default function Processing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { processingStatus, pollStatus } = useStore();

  const poll = useCallback(async () => {
    const prd = await pollStatus(id);
    return prd;
  }, [id, pollStatus]);

  usePolling(
    poll,
    2000,
    true,
    (prd) => {
      if (prd.status === 'completed') {
        navigate(`/results/${id}`, { replace: true });
        return true;
      }
      if (prd.status === 'failed') return true;
      return false;
    }
  );

  const progress = processingStatus?.progress || 0;
  const message = processingStatus?.message || 'Initializing...';
  const status = processingStatus?.status || 'extracting';

  const getCurrentStageIndex = () => {
    if (progress < 25) return 0;
    if (progress < 55) return 1;
    if (progress < 75) return 2;
    return 3;
  };
  const currentStage = getCurrentStageIndex();

  if (status === 'failed') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
      }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-main)',
          borderRadius: '16px',
          padding: '4rem 3rem',
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <AlertTriangle size={28} color="#DC2626" />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '0.5rem',
          }}>
            Processing Failed
          </h2>
          <p style={{
            fontSize: '0.9375rem',
            color: 'var(--text-body)',
            marginBottom: '2rem',
            fontWeight: 500,
            padding: '0.75rem',
            background: 'rgba(220, 38, 38, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(220, 38, 38, 0.2)'
          }}>
            {processingStatus?.error || message}
          </p>
          <button onClick={() => navigate('/upload')} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>

        {/* Animated indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Brain size={32} color="var(--accent)" className="animate-pulse" />
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>{message}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>{progress}%</span>
          </div>
          <div style={{
            height: '4px',
            borderRadius: '2px',
            background: 'var(--bg-surface)',
            overflow: 'hidden',
          }}>
            <div
              style={{
                height: '100%',
                borderRadius: '2px',
                background: 'var(--accent)',
                transition: 'width 1s ease-out',
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Pipeline stages */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-main)',
          borderRadius: '16px',
          padding: '1.5rem',
        }}>
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            const isActive = i === currentStage;
            const isDone = i < currentStage;
            const isPending = i > currentStage;

            return (
              <div
                key={stage.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  marginBottom: i < stages.length - 1 ? '0.25rem' : 0,
                  opacity: isPending ? 0.35 : isDone ? 0.6 : 1,
                  background: isActive ? 'var(--terracotta-bg)' : 'transparent',
                  border: isActive ? '1px solid rgba(196, 113, 59, 0.15)' : '1px solid transparent',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDone ? 'rgba(22, 163, 74, 0.08)' : isActive ? 'var(--bg-surface)' : 'var(--bg-surface)',
                  border: `1px solid ${isDone ? 'rgba(22, 163, 74, 0.2)' : 'var(--border-subtle)'}`,
                  flexShrink: 0,
                }}>
                  {isDone ? (
                    <CheckCircle2 size={16} color="#16A34A" />
                  ) : isActive ? (
                    <Loader2 size={16} color="var(--accent)" className="animate-spin" />
                  ) : (
                    <Icon size={16} color="var(--text-muted)" />
                  )}
                </div>
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: isActive ? 'var(--text-main)' : 'var(--text-body)',
                  }}>
                    {stage.label}
                  </p>
                  {isDone && <p style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>Complete</p>}
                  {isActive && <p style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>In progress…</p>}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          marginTop: '1.5rem',
        }}>
          This may take 1–5 minutes depending on PRD size
        </p>
      </div>
    </div>
  );
}
