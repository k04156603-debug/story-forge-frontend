import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { FileText, Plus, Trash2, Clock, CheckCircle2, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { prds, prdLoading, fetchPrds, deletePrd } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrds();
  }, [fetchPrds]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this PRD and all its generated artifacts?')) {
      await deletePrd(id);
      toast.success('PRD deleted');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} color="#16A34A" />;
      case 'failed':    return <AlertTriangle size={14} color="#DC2626" />;
      case 'uploaded':  return <Clock size={14} color="var(--text-muted-ed)" />;
      default:          return <Loader2 size={14} color="var(--terracotta)" className="animate-spin" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return { background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' };
      case 'failed':    return { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' };
      case 'uploaded':  return { background: 'var(--ivory-warm)', color: 'var(--text-muted-ed)', border: '1px solid var(--warm-gray-subtle)' };
      default:          return { background: 'var(--terracotta-bg)', color: 'var(--terracotta)', border: '1px solid rgba(196, 113, 59, 0.2)' };
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 2rem' }}>

      {/* ── Hero Section ─────────────────────────── */}
      <section
        className="animate-fade-in-up"
        style={{
          paddingTop: '5rem',
          paddingBottom: '4.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '3rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 520px', minWidth: '280px' }}>
          <p className="label-section" style={{ marginBottom: '1.25rem' }}>
            CHAPTER 01 — INTAKE
          </p>
          <h1 className="heading-hero" style={{ marginBottom: '1.5rem' }}>
            Turn product{' '}
            <span className="highlight">requirements</span>
            <br />
            into shippable stories.
          </h1>
          <p className="text-body-editorial">
            Upload a PRD. Story Forge decomposes it into Agile user stories,
            acceptance criteria, edge cases, dependencies, and a quality
            audit — in minutes.
          </p>
        </div>
        <div
          className="animate-fade-in-up-delay-2"
          style={{
            flex: '0 0 auto',
            alignSelf: 'center',
            marginTop: '2rem',
          }}
        >
          <Link
            to="/upload"
            className="btn-primary"
            style={{
              padding: '1rem 2rem',
              fontSize: '0.9375rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <Plus size={18} />
            Forge a new PRD
          </Link>
        </div>
      </section>

      {/* ── Archive Section ───────────────────────── */}
      <section className="animate-fade-in-up-delay-3">
        {/* Archive header */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--rich-black)',
            letterSpacing: '-0.01em',
          }}>
            Archive
          </h2>
          <span className="label-section">
            {prds.length} {prds.length === 1 ? 'DOCUMENT' : 'DOCUMENTS'}
          </span>
        </div>

        <hr className="divider-editorial" style={{ marginBottom: '1.5rem' }} />

        {/* Content */}
        {prdLoading && prds.length === 0 ? (
          /* Loading skeleton */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  padding: '1.5rem',
                  background: '#FFFFFF',
                  border: '1px solid var(--warm-gray-subtle)',
                  borderRadius: '14px',
                }}
              >
                <div className="skeleton" style={{ height: '18px', width: '200px', marginBottom: '0.75rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '140px' }} />
              </div>
            ))}
          </div>
        ) : prds.length === 0 ? (
          /* Empty state */
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--warm-gray-subtle)',
              borderRadius: '14px',
              padding: '5rem 2rem',
              textAlign: 'center',
            }}
          >
            {/* Minimal document icon */}
            <div style={{ marginBottom: '1.5rem' }}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ margin: '0 auto', display: 'block' }}
              >
                <rect x="10" y="6" width="28" height="36" rx="3" stroke="var(--warm-gray)" strokeWidth="1.5" fill="none" />
                <line x1="16" y1="16" x2="32" y2="16" stroke="var(--warm-gray)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="22" x2="28" y2="22" stroke="var(--warm-gray)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="28" x2="24" y2="28" stroke="var(--warm-gray)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--rich-black)',
              marginBottom: '0.5rem',
            }}>
              No PRDs yet
            </h3>
            <p style={{
              fontSize: '0.9375rem',
              color: 'var(--text-body)',
              marginBottom: '2rem',
              maxWidth: '380px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6,
            }}>
              Paste your first product requirements doc and watch it decompose.
            </p>
            <Link
              to="/upload"
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              Start with a PRD
            </Link>
          </div>
        ) : (
          /* PRD list */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {prds.map((prd) => (
              <div
                key={prd._id}
                onClick={() => {
                  if (prd.status === 'completed') navigate(`/results/${prd._id}`);
                  else if (['extracting', 'generating', 'analyzing', 'parsing'].includes(prd.status))
                    navigate(`/processing/${prd._id}`);
                }}
                style={{
                  padding: '1.25rem 1.5rem',
                  background: '#FFFFFF',
                  border: '1px solid var(--warm-gray-subtle)',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                className="group"
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--warm-gray)';
                  e.currentTarget.style.background = 'var(--ivory-warm)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--warm-gray-subtle)';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--ivory-warm)',
                    border: '1px solid var(--warm-gray-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FileText size={18} color="var(--text-muted-ed)" />
                  </div>
                  <div>
                    <h3 style={{
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      color: 'var(--rich-black)',
                      marginBottom: '0.25rem',
                    }}>
                      {prd.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted-ed)',
                    }}>
                      <span>{prd.fileType?.toUpperCase()}</span>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <span>{(prd.charCount / 1000).toFixed(1)}k chars</span>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <span>{new Date(prd.createdAt).toLocaleDateString()}</span>
                      {prd.metadata?.storyCount && (
                        <>
                          <span style={{ opacity: 0.4 }}>·</span>
                          <span>{prd.metadata.storyCount} stories</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    className="badge"
                    style={{
                      ...getStatusStyle(prd.status),
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    {getStatusIcon(prd.status)}
                    {prd.status}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, prd._id)}
                    style={{
                      opacity: 0,
                      padding: '0.375rem',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted-ed)',
                      transition: 'all 0.15s ease',
                    }}
                    className="group-hover:opacity-100"
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#FEF2F2';
                      e.currentTarget.style.color = '#DC2626';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted-ed)';
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                  <ArrowRight size={16} color="var(--warm-gray)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom breathing space */}
      <div style={{ height: '6rem' }} />
    </div>
  );
}