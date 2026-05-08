import { HelpCircle, Search, MessageSquare, Ticket, FileText, Lock, User, RefreshCcw, GraduationCap, ChevronRight, Mail } from 'lucide-react';

export default function Help() {
  const faqs = [
    {
      title: 'How to reset my password?',
      desc: 'Go to Account > Security and use the password update form.',
      icon: Lock,
      color: '#6366F1'
    },
    {
      title: 'Is my data secure?',
      desc: 'We use industry-standard encryption for all your personal data.',
      icon: FileText,
      color: '#10B981'
    },
    {
      title: 'How to contact teacher?',
      desc: 'Use the Chat section to message your respective subject teachers.',
      icon: User,
      color: '#F59E0B'
    },
    {
      title: 'Can I change my class?',
      desc: 'Class changes are restricted but can be requested from the Account view.',
      icon: RefreshCcw,
      color: '#EF4444'
    },
    {
      title: 'How to join live classes?',
      desc: 'Links for live classes appear in your batch dashboard when active.',
      icon: GraduationCap,
      color: '#8B5CF6'
    },
    {
      title: 'What are Streaks/XP?',
      desc: 'Consistent daily usage builds streaks and earns XP for ranking.',
      icon: Ticket,
      color: '#EC4899'
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2.5rem 6rem' }}>
      
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '3.5rem' }}>
        <p className="label-section" style={{ marginBottom: '0.75rem' }}>SUPPORT</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
          }}>Help Center</h1>
          <div style={{ padding: '0.5rem', background: 'var(--bg-terracotta)', borderRadius: '12px', color: 'var(--accent)' }}>
            <HelpCircle size={24} />
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '600px' }}>
          <input
            type="text"
            placeholder="Search for help articles, FAQs, and more..."
            style={{
              width: '100%',
              padding: '1.25rem 1.5rem 1.25rem 3.5rem',
              borderRadius: '20px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-main)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* FAQ Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
        {faqs.map((faq, idx) => {
          const Icon = faq.icon;
          return (
            <div 
              key={idx} 
              className="card-editorial animate-fade-in-up"
              style={{ 
                animationDelay: `${idx * 0.05}s`,
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: 'var(--bg-app)', 
                border: '1px solid var(--border-subtle)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: faq.color,
                flexShrink: 0
              }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.375rem' }}>{faq.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.5 }}>{faq.desc}</p>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" style={{ marginTop: '0.25rem' }} />
            </div>
          );
        })}
      </div>

      {/* Footer Support Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card-editorial animate-fade-in-up" style={{ animationDelay: '0.4s', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Facing an issue?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>Contact our support team and we will get back to you within 24 hours.</p>
          </div>
          <button className="btn-primary" style={{ justifyContent: 'center', padding: '0.875rem' }}>
            <MessageSquare size={18} />
            Contact Support
          </button>
        </div>

        <div className="card-editorial animate-fade-in-up" style={{ animationDelay: '0.5s', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Existing Requests</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>Check the status of your previous support tickets and inquiries.</p>
          </div>
          <button className="btn-secondary" style={{ justifyContent: 'center', padding: '0.875rem' }}>
            <Ticket size={18} />
            View All Tickets
          </button>
        </div>
      </div>
      
      {/* Email Contact */}
      <div className="animate-fade-in-up" style={{ textAlign: 'center', marginTop: '4rem', animationDelay: '0.6s' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Mail size={16} />
          Can't find what you're looking for? Email us at <span style={{ color: 'var(--accent)', fontWeight: 600 }}>support@storyforge.com</span>
        </p>
      </div>
    </div>
  );
}
