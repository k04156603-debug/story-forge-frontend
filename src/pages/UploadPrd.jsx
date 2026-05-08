import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import useStore from '../store/useStore';
import { Upload, FileText, Type, ArrowRight, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadPrd() {
  const [mode, setMode] = useState('upload'); // 'upload' | 'paste'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { uploadPrd, uploadPrdText, startProcessing } = useStore();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let prd;

      if (mode === 'upload' && file) {
        const formData = new FormData();
        formData.append('file', file);
        if (title) formData.append('title', title);
        prd = await uploadPrd(formData);
      } else if (mode === 'paste' && content.trim().length >= 50) {
        prd = await uploadPrdText(content, title || undefined);
      } else {
        toast.error(mode === 'upload' ? 'Please select a file' : 'Content must be at least 50 characters');
        setLoading(false);
        return;
      }

      await startProcessing(prd.data.id);
      navigate(`/processing/${prd.data.id}`);
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setLoading(false);
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
    background: isActive ? '#FFFFFF' : 'transparent',
    color: isActive ? 'var(--rich-black)' : 'var(--text-muted-ed)',
    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
  });

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p className="label-section" style={{ marginBottom: '1rem' }}>
          NEW DOCUMENT
        </p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--rich-black)',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}>
          Upload PRD
        </h1>
        <p style={{
          fontSize: '0.9375rem',
          color: 'var(--text-body)',
          maxWidth: '420px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Upload a document or paste your requirements. Our AI will decompose it into structured Agile artifacts.
        </p>
      </div>

      {/* Mode Tabs */}
      <div
        className="animate-fade-in-up-delay-1"
        style={{
          display: 'flex',
          borderRadius: '12px',
          background: 'var(--ivory-warm)',
          padding: '4px',
          marginBottom: '2rem',
          border: '1px solid var(--warm-gray-subtle)',
        }}
      >
        <button onClick={() => setMode('upload')} style={tabStyle(mode === 'upload')}>
          <Upload size={15} /> Upload File
        </button>
        <button onClick={() => setMode('paste')} style={tabStyle(mode === 'paste')}>
          <Type size={15} /> Paste Content
        </button>
      </div>

      {/* Title Input */}
      <div className="animate-fade-in-up-delay-1" style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--rich-black)',
          marginBottom: '0.5rem',
        }}>
          Title <span style={{ color: 'var(--text-muted-ed)', fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., E-Commerce Platform PRD v2.0"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            background: '#FFFFFF',
            border: '1px solid var(--warm-gray-subtle)',
            color: 'var(--rich-black)',
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--warm-gray)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--warm-gray-subtle)'; }}
        />
      </div>

      {/* Upload Zone */}
      <div className="animate-fade-in-up-delay-2" style={{ marginBottom: '2rem' }}>
        {mode === 'upload' ? (
          <>
            {file ? (
              <div style={{
                padding: '1.25rem 1.5rem',
                background: '#FFFFFF',
                border: '1px solid var(--warm-gray-subtle)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'var(--ivory-warm)',
                    border: '1px solid var(--warm-gray-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FileText size={20} color="var(--text-muted-ed)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, color: 'var(--rich-black)', fontSize: '0.9375rem' }}>{file.name}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted-ed)' }}>{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  style={{
                    padding: '0.375rem',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted-ed)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted-ed)'; }}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                style={{
                  padding: '3.5rem 2rem',
                  background: '#FFFFFF',
                  border: `2px dashed ${isDragActive ? 'var(--terracotta)' : 'var(--warm-gray)'}`,
                  borderRadius: '14px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { if (!isDragActive) e.currentTarget.style.borderColor = 'var(--warm-gray)'; e.currentTarget.style.background = 'var(--ivory-warm)'; }}
                onMouseLeave={e => { if (!isDragActive) e.currentTarget.style.borderColor = 'var(--warm-gray-subtle)'; e.currentTarget.style.background = '#FFFFFF'; }}
              >
                <input {...getInputProps()} />
                <div style={{
                  width: '52px',
                  height: '52px',
                  margin: '0 auto 1rem',
                  borderRadius: '12px',
                  background: 'var(--ivory-warm)',
                  border: '1px solid var(--warm-gray-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Upload size={22} color="var(--text-muted-ed)" />
                </div>
                <p style={{ fontWeight: 500, color: 'var(--rich-black)', marginBottom: '0.25rem' }}>
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your PRD file'}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted-ed)' }}>
                  or click to browse · PDF, DOCX, MD supported
                </p>
              </div>
            )}
          </>
        ) : (
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--rich-black)',
              marginBottom: '0.5rem',
            }}>
              PRD Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your Product Requirements Document here...&#10;&#10;Include features, user flows, requirements, acceptance criteria, etc."
              rows={14}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1px solid var(--warm-gray-subtle)',
                color: 'var(--rich-black)',
                fontSize: '0.9375rem',
                fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
                lineHeight: 1.7,
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--warm-gray)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--warm-gray-subtle)'; }}
            />
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted-ed)', marginTop: '0.5rem' }}>
              {content.length} characters · Minimum 50 required
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || (mode === 'upload' && !file) || (mode === 'paste' && content.length < 50)}
        className="btn-primary animate-fade-in-up-delay-3"
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '0.9375rem',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            Analyze with AI
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}
