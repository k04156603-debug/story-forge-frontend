import { useMemo } from 'react';
import { Check, X } from 'lucide-react';

const rules = [
  { key: 'length', label: '10–16 characters', test: (p) => p.length >= 10 && p.length <= 16 },
  { key: 'upper', label: 'At least 1 uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { key: 'lower', label: 'At least 1 lowercase letter', test: (p) => /[a-z]/.test(p) },
  { key: 'number', label: 'At least 1 number', test: (p) => /[0-9]/.test(p) },
  { key: 'special', label: 'At least 1 special character (! @ # $ %)', test: (p) => /[!@#$%]/.test(p) },
];

export function validatePassword(password) {
  return rules.every((r) => r.test(password));
}

export default function PasswordRequirements({ password = '' }) {
  const results = useMemo(
    () => rules.map((r) => ({ ...r, met: r.test(password) })),
    [password]
  );

  const metCount = results.filter((r) => r.met).length;
  const hasStartedTyping = password.length > 0;

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-main)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
          }}
        >
          Password Requirements
        </span>
        {hasStartedTyping && (
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: metCount === rules.length ? '#16A34A' : 'var(--text-muted)',
              background:
                metCount === rules.length
                  ? 'rgba(22, 163, 74, 0.1)'
                  : 'var(--bg-card)',
              border: `1px solid ${
                metCount === rules.length
                  ? 'rgba(22, 163, 74, 0.25)'
                  : 'var(--border-main)'
              }`,
              padding: '2px 8px',
              borderRadius: '100px',
              transition: 'all 0.3s ease',
            }}
          >
            {metCount}/{rules.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {hasStartedTyping && (
        <div
          style={{
            height: '3px',
            borderRadius: '2px',
            background: 'var(--bg-card)',
            marginBottom: '0.875rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: '2px',
              width: `${(metCount / rules.length) * 100}%`,
              background:
                metCount <= 2
                  ? '#EF4444'
                  : metCount <= 4
                    ? '#F59E0B'
                    : '#16A34A',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
      )}

      {/* Rules list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {results.map((rule) => {
          const isMet = rule.met && hasStartedTyping;
          const isFailed = !rule.met && hasStartedTyping;

          return (
            <div
              key={rule.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                transition: 'all 0.25s ease',
                opacity: hasStartedTyping ? 1 : 0.5,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isMet
                    ? 'rgba(22, 163, 74, 0.15)'
                    : isFailed
                      ? 'rgba(239, 68, 68, 0.08)'
                      : 'var(--bg-card)',
                  border: `1.5px solid ${
                    isMet
                      ? '#16A34A'
                      : isFailed
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'var(--border-main)'
                  }`,
                  transform: isMet ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {isMet ? (
                  <Check size={10} color="#16A34A" strokeWidth={3} />
                ) : isFailed ? (
                  <X size={9} color="#EF4444" strokeWidth={3} />
                ) : null}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  transition: 'all 0.25s ease',
                  color: isMet
                    ? '#16A34A'
                    : isFailed
                      ? 'var(--text-body)'
                      : 'var(--text-muted)',
                  textDecoration: isMet ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(22, 163, 74, 0.4)',
                }}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
