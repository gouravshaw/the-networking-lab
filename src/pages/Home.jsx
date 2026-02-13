import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getToneForCategory } from '../utils/personalisationEngine';
import {
      ArrowRight,
      MessageSquare,
      Users,
      Compass,
      Send,
      Sparkles,
      Calendar,
} from 'lucide-react';

const quickTools = [
      { label: 'My Intro', icon: Compass, path: '/intro-builder', color: '#8e7cb0' },
      { label: 'Starters', icon: MessageSquare, path: '/toolbox', color: '#6b9e7a' },
      { label: 'Follow-up', icon: Send, path: '/toolbox', color: '#b07c8e' },
      { label: 'Contacts', icon: Users, path: '/contacts', color: '#c4975a' },
];

function formatRelativeTime(isoString) {
      if (!isoString) return null;
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) return 'just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString();
}

export default function Home() {
      const navigate = useNavigate();
      const { profile, sessions } = useUser();
      const tone = getToneForCategory(profile?.category);

      return (
            <div className="page" id="home-page">
                  {/* Greeting */}
                  <div className="animate-slide-up mb-8" style={{ paddingTop: 'var(--space-4)' }}>
                        <div className="text-sm text-secondary mb-1">{tone.greeting} 👋</div>
                        <h1 className="text-2xl">Ready to network?</h1>
                        <p className="text-secondary mt-2" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                              {tone.encouragement}
                        </p>
                  </div>

                  {/* Main CTA */}
                  <button
                        className="btn btn-primary btn-full btn-lg animate-slide-up stagger-2"
                        onClick={() => navigate('/session')}
                        style={{
                              marginBottom: 'var(--space-8)',
                              padding: 'var(--space-5) var(--space-6)',
                              fontSize: 'var(--font-size-lg)',
                              borderRadius: 'var(--radius-xl)',
                        }}
                        id="start-session-btn"
                  >
                        <Sparkles size={22} />
                        Start Networking Session
                        <ArrowRight size={20} />
                  </button>

                  {/* Progress Stats */}
                  {(sessions.count > 0 || sessions.lastCompleted) && (
                        <div className="card card--elevated animate-slide-up stagger-3 mb-6" style={{ background: 'var(--color-primary-light)' }}>
                              <div className="flex items-center gap-3">
                                    <div style={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: 'var(--radius-md)',
                                          background: 'var(--color-primary)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                    }}>
                                          <Calendar size={20} color="white" />
                                    </div>
                                    <div>
                                          <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)' }}>
                                                {sessions.count} session{sessions.count !== 1 ? 's' : ''} completed
                                          </div>
                                          {sessions.lastCompleted && (
                                                <div className="text-sm text-secondary">
                                                      Last session: {formatRelativeTime(sessions.lastCompleted)}
                                                </div>
                                          )}
                                    </div>
                              </div>
                        </div>
                  )}

                  {/* Quick Tools */}
                  <div className="animate-slide-up stagger-4">
                        <h2 className="text-lg mb-4" style={{ fontWeight: 'var(--font-weight-semibold)' }}>Quick Tools</h2>
                        <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: 'var(--space-3)',
                        }}>
                              {quickTools.map(({ label, icon: Icon, path, color }, i) => (
                                    <button
                                          key={label}
                                          className={`card card--elevated card--interactive animate-slide-up stagger-${i + 5}`}
                                          onClick={() => navigate(path)}
                                          style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                gap: 'var(--space-3)',
                                          }}
                                          id={`quick-tool-${label.toLowerCase().replace(/\s/g, '-')}`}
                                    >
                                          <div style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 'var(--radius-md)',
                                                background: `${color}15`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                          }}>
                                                <Icon size={18} color={color} />
                                          </div>
                                          <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
                                                {label}
                                          </span>
                                    </button>
                              ))}
                        </div>
                  </div>

                  {/* Tip Card */}
                  <div className="card card--accent animate-slide-up stagger-8 mt-6" style={{ background: 'var(--color-warm-50)' }}>
                        <div className="text-sm text-secondary mb-1" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                              💡 Tip
                        </div>
                        <p className="text-sm" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                              Consistency beats intensity. Even one short networking session a week builds lasting connections.
                        </p>
                  </div>
            </div>
      );
}
