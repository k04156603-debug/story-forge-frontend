import { BookOpen, Book, Target, BarChart3, Video, MessageSquare, Archive, PlayCircle, HelpCircle } from 'lucide-react';

export default function Guide() {
  const guideCards = [
    { 
      number: 1, 
      title: 'Access Courses', 
      desc: 'Find curated subject-wise notes and videos in the Learning section.', 
      icon: Book,
      color: '#6366F1'
    },
    { 
      number: 2, 
      title: 'Attempt Quizzes', 
      desc: 'Earn XP and maintain your streak by taking daily quizzes.', 
      icon: Target,
      color: '#F59E0B'
    },
    { 
      number: 3, 
      title: 'Track Progress', 
      desc: 'View performance analytics and previous attempts in the Dashboard.', 
      icon: BarChart3,
      color: '#10B981'
    },
    { 
      number: 4, 
      title: 'Live Classes', 
      desc: 'Join interactive live sessions with teachers according to your schedule.', 
      icon: Video,
      color: '#EF4444'
    },
    { 
      number: 5, 
      title: 'Doubt Support', 
      desc: 'Use the Chat feature to ask questions and get help from experts.', 
      icon: MessageSquare,
      color: '#8B5CF6'
    },
    { 
      number: 6, 
      title: 'Resources', 
      desc: 'Download NCERT solutions, Exemplars, and Previous Year Questions.', 
      icon: Archive,
      color: '#EC4899'
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2.5rem 6rem' }}>
      
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '3.5rem' }}>
        <p className="label-section" style={{ marginBottom: '0.75rem' }}>RESOURCES</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
          }}>Platform Guide</h1>
          <div style={{ padding: '0.5rem', background: 'var(--bg-terracotta)', borderRadius: '12px', color: 'var(--accent)' }}>
            <BookOpen size={24} />
          </div>
        </div>
        <p style={{ color: 'var(--text-body)', marginTop: '0.75rem', fontSize: '1.0625rem' }}>Master the Story Forge platform with these key features and workflows.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {guideCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className="card-editorial animate-fade-in-up" 
              style={{ 
                animationDelay: `${idx * 0.1}s`,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Card Number Badge */}
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--text-main)'
              }}>
                {card.number}
              </div>

              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: `${card.color}10`, 
                border: `1px solid ${card.color}20`,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: card.color 
              }}>
                <Icon size={28} />
              </div>

              <div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  color: 'var(--text-main)', 
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-serif)'
                }}>{card.title}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-body)', lineHeight: 1.6 }}>{card.desc}</p>
              </div>

              <button style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                width: 'fit-content'
              }}>
                <PlayCircle size={18} />
                Watch Tutorial
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="card-editorial animate-fade-in-up" style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '2rem', animationDelay: '0.6s' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          background: 'var(--bg-terracotta)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'var(--accent)',
          flexShrink: 0
        }}>
          <HelpCircle size={32} />
        </div>
        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Still have questions?</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>Visit our Help Center or contact our support team for personalized assistance.</p>
        </div>
        <button className="btn-primary" style={{ marginLeft: 'auto' }}>Go to Help Center</button>
      </div>
    </div>
  );
}
