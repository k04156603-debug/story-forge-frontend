import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import StoryList from '../components/stories/StoryList';
import QualityPanel from '../components/quality/QualityPanel';
import DependencyGraphView from '../components/graph/DependencyGraph';
import { exportApi } from '../api/client';
import { Layers, ShieldAlert, GitBranch, Download, ArrowLeft, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'stories', label: 'User Stories', icon: Layers },
  { id: 'quality', label: 'Quality Issues', icon: ShieldAlert },
  { id: 'dependencies', label: 'Dependencies', icon: GitBranch },
];

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentPrd, activeTab, setActiveTab,
    groupedStories, storyStats, qualityIssues, qualitySummary, dependencyGraph,
    storiesLoading, analysisLoading,
    fetchStories, fetchAnalysis, pollStatus,
  } = useStore();
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    pollStatus(id);
    fetchStories(id);
    fetchAnalysis(id);
  }, [id, pollStatus, fetchStories, fetchAnalysis]);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      if (format === 'jira') {
        const res = await exportApi.export(id, format);
        toast.success(`${res.data.message}`);
      } else {
        const res = await exportApi.export(id, format);
        const blob = new Blob([res], { type: format === 'csv' ? 'text/csv' : 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stories-${id}.${format === 'csv' ? 'csv' : 'md'}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exported as ${format.toUpperCase()}`);
      }
    } catch (err) {
      toast.error(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const tabStyle = (isActive) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'var(--font-sans)',
    background: isActive ? 'var(--bg-card)' : 'transparent',
    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
    boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
  });

  const exportBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 0.875rem',
    borderRadius: '100px',
    fontSize: '0.8125rem',
    fontWeight: 500,
    border: '1px solid var(--border-main)',
    background: 'var(--bg-card)',
    color: 'var(--text-main)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'var(--font-sans)',
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 2rem 6rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem',
              borderRadius: '10px',
              background: 'transparent',
              border: '1px solid var(--warm-gray-subtle)',
              cursor: 'pointer',
              color: 'var(--text-muted-ed)',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '-0.01em',
            }}>
              {currentPrd?.title || 'Results'}
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.25rem',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FileText size={13} />
                {currentPrd?.fileType?.toUpperCase()}
              </span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{storyStats?.total || 0} stories</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{storyStats?.totalPoints || 0} total points</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{qualityIssues?.length || 0} quality issues</span>
            </div>
          </div>
        </div>

        {/* Export buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            style={exportBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--ivory-warm)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
          >
            <Download size={13} /> CSV
          </button>
          <button
            onClick={() => handleExport('markdown')}
            disabled={exporting}
            style={exportBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--ivory-warm)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
          >
            <Download size={13} /> MD
          </button>
          <button
            onClick={() => handleExport('jira')}
            disabled={exporting}
            className="btn-primary"
            style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}
          >
            {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            Jira
          </button>
        </div>
      </div>

      {/* Tabs */}
        display: 'flex',
        borderRadius: '12px',
        background: 'var(--bg-surface)',
        padding: '4px',
        marginBottom: '2rem',
        border: '1px solid var(--border-main)',
      }}>
        {tabs.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            style={tabStyle(activeTab === tabId)}
          >
            <Icon size={15} />
            {label}
            {tabId === 'quality' && qualityIssues?.length > 0 && (
              <span style={{
                marginLeft: '0.25rem',
                fontSize: '0.7rem',
                background: 'rgba(217, 119, 6, 0.1)',
                color: '#D97706',
                padding: '1px 6px',
                borderRadius: '100px',
                border: '1px solid rgba(217, 119, 6, 0.2)',
                fontWeight: 600,
              }}>
                {qualityIssues.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'stories' && (
          storiesLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--warm-gray-subtle)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                }}>
                  <div className="skeleton" style={{ height: '18px', width: '250px', marginBottom: '0.5rem' }} />
                  <div className="skeleton" style={{ height: '14px', width: '180px' }} />
                </div>
              ))}
            </div>
          ) : (
            <StoryList groupedStories={groupedStories} stats={storyStats} />
          )
        )}

        {activeTab === 'quality' && (
          analysisLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--warm-gray-subtle)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                }}>
                  <div className="skeleton" style={{ height: '18px', width: '200px', marginBottom: '0.5rem' }} />
                  <div className="skeleton" style={{ height: '14px', width: '320px' }} />
                </div>
              ))}
            </div>
          ) : (
            <QualityPanel issues={qualityIssues} summary={qualitySummary} />
          )
        )}

        {activeTab === 'dependencies' && (
          <DependencyGraphView graph={dependencyGraph} />
        )}
      </div>
    </div>
  );
}
